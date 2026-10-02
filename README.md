# Live Doc - Multiuser Realtime Document

A light weight multiuser realtime text editor where multiple users can write, edit and collaborate with other.

> !!!! ON DEVELOPMENT !!!!

### Preview

<img src= "public/cover/cover.png">
<img src= "public/cover/cover2.png">

### Local development

```bash
npm install
cp .env.example .env.local   # then fill in the real values
npm run dev
```

### Deploy to Vercel

1. Push this repository to GitHub and import it in the [Vercel dashboard](https://vercel.com/new).
2. Vercel auto-detects Next.js — no custom build settings are required.
3. In **Settings → Environment Variables**, add the variables listed in
   [`.env.example`](.env.example):
   - `NEXT_PUBLIC_CONVEX_URL` (Convex deployment URL)
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (Clerk publishable key)
   - `CLERK_SECRET_KEY` (Clerk secret key)
   - `LIVEBLOCKS_SECRET_KEY` (Liveblocks secret key)
4. Deploy. If you use [Convex](https://convex.dev), also run
   `npx convex deploy` so the backend functions are live.
5. Add your Vercel URL (e.g. `https://your-app.vercel.app`) to the Clerk
   dashboard's **Allowed origins / Redirect URLs** so sign-in works.

### Tech stack

- Next.js 15 (App Router) + TypeScript
- Convex (backend) · Clerk (auth) · Liveblocks (real-time collaboration)
- TipTap editor · Tailwind CSS + shadcn/ui

Build with ♥︎ by `Sojibul Islam Rana`.
