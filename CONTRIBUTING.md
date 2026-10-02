# Contributing to Live Doc

First off, thank you for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to **Live Doc**. These
are just guidelines — use your best judgment and feel free to propose changes
to this document in a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Development Setup](#development-setup)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting Pull Requests](#submitting-pull-requests)
- [Coding Guidelines](#coding-guidelines)
  - [Branch Naming](#branch-naming)
  - [Commit Messages](#commit-messages)
  - [Code Style](#code-style)
- [Project Conventions](#project-conventions)

## Code of Conduct

This project and everyone participating in it is governed by the
[Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to
uphold this code. Please report unacceptable behavior as described there.

## Getting Started

### Development Setup

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:

   ```bash
   git clone https://github.com/<your-username>/live-docs.git
   cd live-docs
   ```

3. **Install** dependencies:

   ```bash
   npm install
   ```

4. **Set up** your environment:

   ```bash
   cp .env.example .env.local
   ```

   Fill in the values from your Convex, Clerk, and Liveblocks dashboards (see
   the [README](README.md#environment-variables)).

5. **Run** the dev server:

   ```bash
   npm run dev
   ```

6. Make sure Convex is reachable (`npx convex deploy` or `npx convex dev`).

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please:

- Search the [issues](https://github.com/sojibulislamrana/live-docs/issues) to
  make sure it hasn't already been reported.
- If you find a **closed** issue that seems like the same thing, open a new
  issue and link to it.

When filing a bug report, use the
[Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md) and be as detailed
as possible:

- **Steps to reproduce** — a minimal, exact list.
- **Expected behavior** vs. **what actually happened**.
- **Screenshots/recordings** if applicable.
- **Environment** — browser, OS, Node version, commit hash.

### Suggesting Features

Feature suggestions are tracked as
[GitHub issues](https://github.com/sojibulislamrana/live-docs/issues). Use the
[Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md) and
describe:

- The **problem** you're trying to solve.
- The **proposed solution** and how it fits the project.
- **Alternatives** you've considered.

### Submitting Pull Requests

1. Create a branch from `main` (see [Branch Naming](#branch-naming)).
2. Make your changes with clear, focused commits (see
   [Commit Messages](#commit-messages)).
3. Run the checks locally:

   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

   All three must pass.
4. Push your branch and open a pull request against `main`, using the
   [PR template](.github/PULL_REQUEST_TEMPLATE.md).
5. Keep changes small and reviewable. If a PR grows too large, split it.

## Coding Guidelines

### Branch Naming

Use a short, descriptive prefix plus a concise name:

| Prefix   | Use case                | Example                            |
| -------- | ----------------------- | ---------------------------------- |
| `feat/`  | New feature             | `feat/table-export`                |
| `fix/`   | Bug fix                 | `fix/mention-suggestion-crash`     |
| `docs/`  | Documentation only      | `docs/deploy-guide`                |
| `chore/` | Maintenance / tooling   | `chore/update-dependencies`        |

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/)
convention:

```
<type>(<scope>): <subject>
```

Example types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.

```
feat(editor): add table export to HTML
fix(ruler): clamp right margin before left margin is zero
docs(readme): document Convex deployment flow
```

### Code Style

- **TypeScript** — strict mode is enabled; write types explicitly where they
  add clarity, let inference work elsewhere.
- **Formatting/linting** — stay consistent with the existing ESLint config
  (`next/core-web-vitals`, `next/typescript`). No Prettier is required, but
  keep the style consistent with the rest of the codebase.
- **Components** — use the existing shadcn/ui primitives before creating new
  ones manually.
- **Client vs server** — files that touch the browser must be marked
  `"use client"`; keep route handlers and Convex functions on the server.
- Add a short comment explaining *why* when the intent isn't obvious.

## Project Conventions

- **Rich text** is TipTap. Custom extensions live in `src/extensions/`.
- **Backend** logic lives in `convex/` — schema changes require regeneration
  (`npx convex codegen`).
- **Real-time** state (presence, storage, threads) lives in Liveblocks; the
  shared type definitions are in `liveblocks.config.ts`.
- Document templates are defined in `src/constant/templates.ts`.

Thanks again for contributing! ❤️