# Bildpunkt — Pixel Art Editor

A simple, fast, and beginner-friendly pixel art editor that runs entirely in the browser. No sign-up, no cloud, no complexity — just open and draw.

## What it does

- **Draw pixel art** on a 16×16, 32×32, or 64×64 canvas
- **Essential tools**: pencil, eraser, flood fill, and color picker
- **32-color palette** with a full custom color picker
- **Undo / redo** up to 50 steps, with keyboard shortcuts
- **Zoom** from 1× to 32× with a grid overlay (toggle with G)
- **Download PNG** at exact canvas resolution (Ctrl+Shift+S)
- **Import** any image and scale it to the canvas (file or Ctrl+V paste)
- **Save to browser** — projects survive page reloads (Ctrl+S)
- **Project browser** — browse, open, rename (double-click), and delete saved projects (Ctrl+O)
- **Keyboard canvas navigation** — Arrow keys move the cursor, Space draws
- **Help panel** — keyboard shortcut reference (press ?)

## Design principles

Simple · Fast to understand · Lightweight · Beginner-friendly

Every feature is there to support one goal: making simple pixel art quickly and easily.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Keyboard shortcuts

| Key          | Action                          |
| ------------ | ------------------------------- |
| P            | Pencil                          |
| E            | Eraser                          |
| F            | Fill                            |
| K            | Color picker                    |
| G            | Toggle grid                     |
| + / -        | Zoom in / out                   |
| ?            | Toggle help panel               |
| Ctrl+Z       | Undo                            |
| Ctrl+Y       | Redo                            |
| Ctrl+S       | Save to browser                 |
| Ctrl+O       | Open project browser            |
| Ctrl+Shift+S | Download PNG                    |
| Ctrl+N       | New canvas                      |
| Ctrl+V       | Paste image from clipboard      |
| ↑ ↓ ← →      | Move cursor (canvas focused)    |
| Space        | Draw at cursor (canvas focused) |

## Tech stack

- React 19 + TypeScript
- Vite (HMR, fast builds)
- Tailwind CSS (utility-first styling)
- HTML Canvas API (pixel rendering)
- Vitest + React Testing Library (unit and component tests)

## Available commands

| Command                 | Description                          |
| ----------------------- | ------------------------------------ |
| `npm run dev`           | Start development server with HMR    |
| `npm run build`         | Type-check and build for production  |
| `npm run preview`       | Preview the production build locally |
| `npm run lint`          | Run ESLint (strict, no warnings)     |
| `npm run format`        | Format all files with Prettier       |
| `npm test`              | Run all Vitest tests                 |
| `npm run test:coverage` | Run tests with v8 coverage report    |

## Project structure

```
src/
  components/
    canvas/     # PixelCanvas — rendering and input
    dialogs/    # NewCanvasDialog, ProjectBrowser, HelpDialog
    layout/     # AppShell, Toolbar, Sidebar
    palette/    # ColorPalette
    ui/         # Toast, StatusBar, ErrorBoundary
  hooks/        # useEditor, useHistory, useStorage, useKeyboardShortcuts, useToast
  utils/        # fill, pixelBuffer, color, palette, storage, export, import
  types/        # Shared TypeScript interfaces
  App.tsx       # Root component
  main.tsx      # React entry point
docs/           # Step-by-step implementation guides
```

## Accessibility

The editor follows WCAG 2.1 AA guidelines:

- All interactive elements are keyboard-accessible with visible focus rings
- Tool buttons use `role="radiogroup"` / `role="radio"` with `aria-checked`
- Canvas exposes `role="img"` with a descriptive `aria-label`
- Keyboard cursor: focus the canvas and navigate with Arrow keys, draw with Space
- Status messages use `aria-live="polite"` for screen reader announcements
- All dialogs have `role="dialog"`, `aria-modal`, and focus management
