// Type declarations for asset imports used in this project.
//
// Next.js resolves and serves CSS at build time, but its bundled types
// (next/types/global.d.ts) only declare CSS *Modules* (`*.module.css`), not
// plain global stylesheets. This declaration teaches TypeScript that side-
// effect imports like `import "./globals.css"` are valid.
declare module "*.css";

// mammoth ships TypeScript declarations only for its Node entry point
// (`lib/index.d.ts`) — the pre-bundled browser build (`mammoth/mammoth.browser`)
// has no types of its own. Re-export the same API from the parent module so
// `import("mammoth/mammoth.browser")` type-checks correctly.
declare module "mammoth/mammoth.browser" {
  import mammoth = require("mammoth");
  const mammothBrowser: typeof mammoth;
  export = mammothBrowser;
}