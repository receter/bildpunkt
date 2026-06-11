# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bildpunkt** is a browser-based pixel art editor built with React 19, TypeScript, Vite, and Tailwind CSS. Users can draw pixel art on a canvas, save/load projects, and export PNG files — all without any backend.

**Repository**: https://github.com/receter/bildpunkt

## Tech Stack

- **Runtime**: Node.js v22.19.0 (.nvmrc defines this)
- **Framework**: React 19.2.6
- **Build Tool**: Vite 8.0.12
- **Language**: TypeScript 6.0.2
- **Styling**: Tailwind CSS (utility-first; no plain CSS except global resets in `index.css`)
- **Rendering**: HTML Canvas API for the pixel grid
- **Testing**: Vitest + React Testing Library
- **Code Quality**:
  - ESLint (flat config, TypeScript support, React Hooks & Refresh plugins)
  - Prettier 3.8.4
  - lint-staged for pre-commit hooks
  - Husky for Git hooks

## Project Structure

```
bildpunkt/
├── src/
│   ├── components/      # UI components (toolbar, canvas, dialogs, palette)
│   ├── hooks/           # Custom hooks (useEditor, useHistory, useStorage)
│   ├── utils/           # Pure functions (fill, image I/O, storage helpers)
│   ├── types/           # Shared TypeScript types and interfaces
│   ├── App.tsx          # Root layout component
│   ├── main.tsx         # React entry point
│   └── index.css        # Global resets only
├── docs/                # Step-by-step implementation plan (5 steps)
├── public/              # Static assets (favicon.svg)
├── index.html           # HTML entry point
├── vite.config.ts       # Vite configuration (also configures Vitest)
├── tsconfig.json        # TS config references
├── tsconfig.app.json    # App TS config (target: ES2023, React JSX)
├── tsconfig.node.json   # Build tools TS config
├── eslint.config.js     # ESLint flat config
└── package.json         # Dependencies and npm scripts
```

## Key TypeScript Settings

- **Target**: ES2023
- **Module**: ESNext with bundler resolution
- **JSX**: react-jsx (automatic JSX transform)
- **Strict Mode**:
  - `noUnusedLocals` and `noUnusedParameters` enabled
  - `noFallthroughCasesInSwitch` enabled
  - `erasableSyntaxOnly` for clean transpilation
- **Library**: DOM + ES2023 built-ins

## Development Commands

```bash
npm run dev        # Vite dev server at http://localhost:5173 (HMR enabled)
npm run build      # tsc -b then Vite build → dist/
npm run preview    # Serve dist/ locally
npm run lint       # ESLint, max-warnings 0
npm run format     # Prettier on all files
npm test           # Vitest unit tests
```

## Keeping the README Up To Date

**The README is the public face of this project. Keep it current.**

- When new npm scripts are added → update the commands table in README.md
- When the project structure changes significantly → update the directory tree
- When new features are shipped → update "What it does" and feature list
- When dependencies change materially (new testing lib, CSS framework swap) → update "Tech stack"

Do not describe in-progress or planned features as if they are shipped. Only document what is actually working.

## Testing Requirements

**Every meaningful unit of logic must have tests.**

- All pure utility functions in `src/utils/` must have Vitest unit tests
- Custom hooks in `src/hooks/` must be tested with `@testing-library/react` `renderHook`
- Canvas drawing logic must be tested with mocked canvas context
- Aim for high coverage on fill algorithm, undo/redo history, and storage helpers
- Test file convention: `src/utils/fill.test.ts`, `src/hooks/useHistory.test.ts`, etc.
- Run `npm test` before marking a step complete

## Git Workflow & Hooks

**Pre-commit Hook** (`npx lint-staged`):

- Lints TypeScript/JavaScript with ESLint (strict: no warnings allowed)
- Formats staged files with Prettier

**Pre-push Hook**: Currently empty stub

**Claude Code Settings Hook**: `.claude/settings.json` has a "Stop" hook that formats and lints `src/` with Prettier and ESLint (--fix enabled)

## Code Style Rules

- **Styling**: Tailwind utility classes only — no custom CSS files per component
- **Imports**: Sorted via `eslint-plugin-simple-import-sort` (enforced as error)
- **React Hooks**: Validated by `eslint-plugin-react-hooks`
- **React Refresh**: `eslint-plugin-react-refresh` ensures Fast Refresh compatibility
- **No comments** unless the WHY is non-obvious (hidden invariant, workaround, etc.)

## Accessibility Requirements

Follow WCAG 2.1 AA throughout:

- All interactive elements need visible focus rings and `aria-label` or visible text
- Tool buttons use `role="radio"` within a `role="radiogroup"` (only one active tool)
- Canvas must expose a text alternative describing the current artwork
- Color contrast must meet AA (4.5:1 for text, 3:1 for UI components)
- Every action available by mouse must also be reachable by keyboard

## Architecture Notes

- **Canvas pixel data** is stored as a flat `Uint8ClampedArray` (RGBA) — same format as `ImageData`. Never store pixel state as a 2D array of color strings.
- **Undo/redo** uses an immutable snapshot stack — each entry is a copy of the full pixel buffer. Keep the stack bounded (e.g., max 50 snapshots).
- **Local storage** projects are stored as base64-encoded PNG data under a namespaced key (`bildpunkt:project:<id>`). The index of all projects lives at `bildpunkt:index`.
- **Fill algorithm**: flood fill implemented iteratively (stack-based), not recursively, to avoid call-stack overflows on large canvases.
- **Image import**: scale imported images to the canvas size using `drawImage` on an offscreen canvas, then read back `ImageData`.

## Implementation Plan

See `docs/` for the five-step plan. Each step has a markdown document with instructions, acceptance criteria, and notes on what to test.
