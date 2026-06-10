# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bildpunkt** is a React + TypeScript + Vite frontend application. It's a modern web application template with hot module replacement (HMR), ESLint, Prettier, TypeScript strict mode, and Git hooks for code quality.

**Repository**: https://github.com/receter/bildpunkt

## Tech Stack

- **Runtime**: Node.js v22.19.0 (.nvmrc defines this)
- **Framework**: React 19.2.6
- **Build Tool**: Vite 8.0.12
- **Language**: TypeScript 6.0.2
- **Styling**: Plain CSS with CSS order plugin
- **Code Quality**:
  - ESLint (flat config, TypeScript support, React Hooks & Refresh plugins)
  - Prettier 3.8.4 (CSS order via prettier-plugin-css-order)
  - lint-staged for pre-commit hooks
  - Husky for Git hooks

## Project Structure

```
bildpunkt/
├── src/
│   ├── App.tsx          # Main app component with counter demo
│   ├── App.css          # App styles
│   ├── main.tsx         # React root entry point
│   ├── index.css        # Global styles
│   └── assets/          # SVG logos and images
├── public/              # Static assets (favicon.svg, icons.svg)
├── index.html           # HTML entry point
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TS config references (app & node configs)
├── tsconfig.app.json    # App-specific TS config (target: es2023, React JSX)
├── tsconfig.node.json   # Build tools TS config
├── eslint.config.js     # ESLint flat config
├── .prettierrc           # Prettier config (CSS order plugin enabled)
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

### Start Development Server

```bash
npm run dev
```

Runs Vite dev server with HMR. App loads at http://localhost:5173

### Build for Production

```bash
npm run build
```

Runs TypeScript build check (`tsc -b`) then Vite build. Output goes to `dist/`

### Lint Code

```bash
npm run lint
```

Runs ESLint on all files. Pre-commit hook runs this with `--max-warnings 0` (strict)

### Format Code

```bash
npm run format
```

Runs Prettier on all files. Pre-commit hook also runs this on staged files

### Preview Production Build

```bash
npm run preview
```

Serves the built app locally for testing

## Git Workflow & Hooks

**Pre-commit Hook** (`npx lint-staged`):

- Lints TypeScript/JavaScript with ESLint (strict: no warnings allowed)
- Formats all staged files with Prettier
- Automatically runs on commit via Husky

**Pre-push Hook**: Currently empty stub

**Claude Code Settings Hook**: `.claude/settings.json` has a "Stop" hook configured that formats and lints the entire `src/` directory with Prettier and ESLint (--fix enabled)

## Code Style Rules

- **Imports**: Sorted via `eslint-plugin-simple-import-sort` (enforced as error)
- **CSS Declaration Order**: Alphabetical via `prettier-plugin-css-order`
- **React Hooks**: Validated by `eslint-plugin-react-hooks`
- **React Refresh**: `eslint-plugin-react-refresh` ensures Fast Refresh compatibility

## Current App Structure

The app demonstrates a basic React component with:

- Counter state using `useState`
- Image assets imported and rendered
- Multiple sections showing documentation and social links
- CSS layout using flexbox and grid (see `App.css` for details)

Main entry: `src/main.tsx` → `src/App.tsx` → mounted in `#root` div (index.html)

## Dependencies Overview

**Production**:

- `react@^19.2.6` - Latest React with improved composition/compiler support
- `react-dom@^19.2.6` - DOM rendering

**Dev** (key ones):

- TypeScript ecosystem: `typescript`, `@types/react`, `@types/react-dom`, `@types/node`
- Build: Vite, @vitejs/plugin-react
- Linting: ESLint with TypeScript, React plugins
- Formatting: Prettier with CSS order plugin
- Git hooks: Husky, lint-staged

## Notes for Future Development

1. **React Compiler Not Enabled**: The template intentionally disables React Compiler due to performance impact. See React docs if you want to enable it.
2. **Strict Type Checking**: TypeScript is configured very strictly. Unused locals/parameters will cause build failures—intentional for code quality.
3. **HMR Works Out-of-Box**: Changes to `.tsx`/`.css` files hot-reload in the browser.
4. **No Testing Framework Included**: Consider adding Vitest or Jest if tests are needed.
5. **Import Organization**: Don't manually sort imports—ESLint will enforce and auto-fix the correct order.
