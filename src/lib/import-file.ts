/**
 * Converts an uploaded file (docx, doc, pdf, txt, html) into an HTML string
 * that can be loaded directly into the TipTap editor via setContent().
 *
 * All parsing is done client-side in the browser — no server round-trip.
 */

// ─── DOCX / DOC ──────────────────────────────────────────────────────────────

async function docxToHtml(file: File): Promise<string> {
  // mammoth converts .docx to clean HTML preserving headings, bold, italic,
  // lists, links, tables, and basic formatting.
  const mammoth = await import("mammoth/mammoth.browser");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  if (result.messages.length) {
    console.warn("[import-file] mammoth warnings:", result.messages);
  }
  return result.value; // HTML string
}

// ─── PDF ─────────────────────────────────────────────────────────────────────

async function pdfToHtml(file: File): Promise<string> {
  // pdfjs-dist extracts text page-by-page.  We wrap each page in a <p> block
  // so the content is at least readable in the editor.
  const pdfjsLib = await import("pdfjs-dist");

  // Point the worker at the bundled file that Next.js copies to /public.
  // We set it lazily so this only runs in the browser.
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

  const pageParagraphs: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Each item in content.items is a text span.
    const lines = (content.items as { str: string; hasEOL: boolean }[])
      .map((item) => item.str + (item.hasEOL ? "\n" : ""))
      .join("")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length) {
      pageParagraphs.push(
        `<h4>Page ${i}</h4>` + lines.map((l) => `<p>${escapeHtml(l)}</p>`).join(""),
      );
    }
  }

  return pageParagraphs.join('<hr />');
}

// ─── Plain text ───────────────────────────────────────────────────────────────

function textToHtml(text: string): string {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
}

// ─── HTML (direct) ───────────────────────────────────────────────────────────

function sanitiseHtml(html: string): string {
  // Keep it simple: strip <script> and <style> tags, return the rest.
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── Public API ──────────────────────────────────────────────────────────────

export type ImportResult = {
  html: string;
  fileName: string;
};

/**
 * Opens a native file picker, lets the user choose a supported file,
 * and returns the file content as HTML ready for the TipTap editor.
 *
 * Throws if the user cancels or the file type is unsupported.
 */
export function openFileImport(): Promise<ImportResult> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type   = "file";
    input.accept = ".docx,.doc,.pdf,.txt,.html,.htm";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) { reject(new Error("No file selected")); return; }

      try {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
        let html  = "";

        if (ext === "docx" || ext === "doc") {
          html = await docxToHtml(file);
        } else if (ext === "pdf") {
          html = await pdfToHtml(file);
        } else if (ext === "txt") {
          const text = await file.text();
          html = textToHtml(text);
        } else if (ext === "html" || ext === "htm") {
          const raw = await file.text();
          html = sanitiseHtml(raw);
        } else {
          reject(new Error(`Unsupported file type: .${ext}`));
          return;
        }

        resolve({ html, fileName: file.name.replace(/\.[^.]+$/, "") });
      } catch (err) {
        reject(err);
      }
    };

    input.oncancel = () => reject(new Error("Cancelled"));
    input.click();
  });
}
