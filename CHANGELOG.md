# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial public release of **Live Doc**, a real-time collaborative document editor.
- Next.js 15 (App Router) application scaffold with TypeScript in strict mode.
- Clerk authentication with sign-in / sign-up pages, user sessions, and
  organization support.
- Liveblocks-based real-time collaboration:
  - Live presence cursors with a deterministic per-user color.
  - Collaborative rich-text editing powered by TipTap.
  - Shared page margins via Liveblocks Storage, adjustable with a draggable ruler.
  - Comment threads (`@mentions`) and an activity inbox.
- Rich document front matter and toolbar:
  - Headings, bold, italic, underline, strikethrough, superscript, subscript.
  - Text and highlight colors, font family/size, line height, text alignment.
  - Links, images (with resize), tables, and task lists.
- Document management:
  - Template gallery (blank, proposals, resume, cover letter, letter, …).
  - Create, rename, and delete documents (owner-only deletion).
  - Full-text search with pagination.
- File import in the browser: `.docx` (mammoth), `.pdf` (pdf.js), `.txt`, `.html`.
- Export/print: download as JSON, HTML, or plain text; print to PDF.
- Convex backend: `document` table with owner/organization indexes and a
  full-text search index on titles.
- API routes for Liveblocks authentication, mention suggestions, and user
  resolution.
- MIT license, contribution guidelines, and community health files.

### Fixed

- Resolved a production build failure caused by missing type declarations for
  `mammoth/mammoth.browser` (`globals.d.ts`).
- Removed unused imports in the document navbar that failed the ESLint check.