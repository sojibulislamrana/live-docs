// Type declarations for asset imports used in this project.
//
// Next.js resolves and serves CSS at build time, but its bundled types
// (next/types/global.d.ts) only declare CSS *Modules* (`*.module.css`), not
// plain global stylesheets. This declaration teaches TypeScript that side-
// effect imports like `import "./globals.css"` are valid.
declare module "*.css";