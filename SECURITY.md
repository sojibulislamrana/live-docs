# Security Policy

## Supported Versions

This project follows [Semantic Versioning](https://semver.org/). The following
table shows which versions currently receive security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | ✅ Active support  |
| < 0.1   | ❌ Unsupported     |

## Reporting a Vulnerability

We take security vulnerabilities seriously. **Please do not open a public
issue for security problems.**

To report a vulnerability, please open a
[private security advisory](https://github.com/sojibulislamrana/live-docs/security/advisories)
on GitHub, or contact the maintainer directly via GitHub.

You can expect an acknowledgement within **48 hours**. We will then assess the
report, reproduce the issue if possible, and work on a fix. You'll receive
updates as the investigation and fix progress, and we'll give credit to
reporters (unless you prefer to stay anonymous).

### What to include

To help us triage quickly, please include:

- The affected version(s) and environment (browser, Node version, deployment)
- A description of the vulnerability and its potential impact
- Steps to reproduce, or a proof-of-concept
- Any suggested fix (optional)

## Security Notes for This Project

- **Environment variables** (`CLERK_SECRET_KEY`, `LIVEBLOCKS_SECRET_KEY`, …)
  must never be committed to the repository or exposed to the browser. They are
  already covered by `.gitignore` — keep it that way.
- The production build is deployed to [Vercel](https://vercel.com) and the
  backend runs on [Convex](https://convex.dev); keep both platforms' security
  features (branch protection, preview deployments, workspace access) enabled.
- Client-side file imports (`.docx`, `.pdf`, `.html`) are sanitized before
  being inserted into the editor — sanitize any new import paths you add.