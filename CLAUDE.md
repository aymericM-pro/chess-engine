# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start Vite dev server
pnpm build        # Type-check + production build
pnpm preview      # Serve production build locally
pnpm lint         # ESLint over src/
pnpm test         # Run Vitest
pnpm test:ui      # Vitest UI dashboard
```

Run a single test file:
```bash
pnpm test src/modules/replay/engine/boardEngine.test.ts
```

## Architecture

This app replays a single hardcoded chess game with move-by-move analysis. There is no backend, no rules engine, and no dynamic game data — everything is static.

### Data layer (`src/modules/replay/data/`)
- `moves.ts` — 39-move game sequence (algebraic notation + board coordinates)
- `analysis.ts` — parallel array of rich analysis objects per move (tags, commentary)
- `themes.ts` — 10 predefined board color schemes

### Engine (`src/modules/replay/engine/boardEngine.ts`)
- `startPos()` → initial 64-element board array
- `applyMoves(moves, n)` → deterministically replays first `n` moves; pure/immutable
- `idx(col, row)` → converts 2D coords to flat board index

### State (`src/modules/replay/store/replayStore.ts`)
- Zustand store persisted to localStorage (`chess-replay-store`)
- Tracks `step` (0–39) and `themeId`; actions: `goTo`, `next`, `prev`, `first`, `last`, `setTheme`

### Rendering (`src/modules/replay/components/`)
- `ChessBoard.tsx` — calls `applyMoves(MOVES, step)` on every render to get board state, then renders an 8×8 SVG grid
- `BoardSection.tsx` — wraps board + labels + transport controls
- `TransportControls.tsx` — play/pause, step buttons, scrubber progress bar
- `AnalysisCard.tsx` — displays `ANALYSIS[step]` for the current move

### Routing
React Router v7: `/` redirects to `/replay`; `/settings` hosts the language picker. Layout lives in `App.tsx` (TopNav + PageBackground + `<Outlet>`).

### Styling
Tailwind CSS 4 with CSS variables defined in `src/index.css`. Dark theme palette: `bg-1` (#0d1117), `bg-2` (#161b22), `bg-3` (#1c2330). Gold accent `#d29922`, blue accent `#58a6ff`. Custom fonts: Cinzel (display) + Crimson Pro (serif body).

### i18n
i18next with French as default. Translations in `src/i18n/fr.json` and `src/i18n/en.json`. Language can be switched at runtime via `/settings`.

## Path alias
`@/*` resolves to `src/*` (configured in both `tsconfig.app.json` and `vite.config.ts`).
