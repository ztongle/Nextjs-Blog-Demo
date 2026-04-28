# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js Blog Demo project demonstrating Server-Side Rendering (SSR) and Incremental Static Regeneration (ISR). Uses Next.js App Router (App Router is the default, not Pages Router).

**Important:** This is Next.js 16.2.1 with breaking changes from older versions. Read `node_modules/next/dist/docs/` before writing code.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run Jest unit tests
npm run test:watch   # Run Jest in watch mode
npm run test:coverage # Run Jest with coverage
npm run test:e2e     # Run Playwright e2e tests
npm run test:e2e:ui  # Run Playwright with UI mode
```

To run a single test file, use `-- <file>` or `--testPathPattern`:
```bash
npm test -- --testPathPattern=MyTest
```

## Architecture

- **App Router** (`app/`): Next.js App Router with React 19 Server Components by default
- **Data Layer** (`lib/posts.ts`): Mock blog post data with SSR/ISR demonstration. Posts are served from in-memory array with optional dynamic posts loaded from `data/posts.json`
- **API Routes** (`app/api/posts/route.ts`): Next.js API routes for blog post operations
- **Pages**:
  - `app/page.tsx` - Home page listing all posts
  - `app/posts/[slug]/page.tsx` - Individual post pages with ISR support
  - `app/admin/page.tsx` - Admin interface
- **Styling**: Tailwind CSS v4 with `@tailwindcss/postcss`
- **Testing**: Jest for unit tests, Playwright for e2e tests
- **Dynamic Posts**: Additional posts can be added via `data/posts.json` file

## Key Patterns

- Server Components are the default in App Router
- `lib/posts.ts` exports `getAllPosts()`, `getPostBySlug()`, `getAllSlugs()` for data fetching
- Posts support ISR via `revalidate` export where applicable
- MSW (Mock Service Worker) is configured for API mocking in tests
