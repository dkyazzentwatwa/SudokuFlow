# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SudokuFlow is a production-ready, minimalist Sudoku web app with a comprehensive human-logic solving engine. It's built with React, TypeScript, and Vite, featuring a Web Worker architecture for non-blocking operations and Canvas-based rendering for optimal performance.

## Commands

### Development
```bash
npm run dev         # Start development server on http://localhost:5173
```

### Build & Testing
```bash
npm run build       # Build production bundle (TypeScript compile + Vite build)
npm run preview     # Preview production build locally
npm run test        # Run tests with Vitest
npm run test:ui     # Run tests with Vitest UI
```

### Code Quality
```bash
npm run type-check  # Run TypeScript type checking (tsc --noEmit)
npm run lint        # Run ESLint on src/**/*.{ts,tsx}
```

## Architecture

### Core Components

**Engine (`src/engine/`)**: Pure TypeScript Sudoku logic running in Web Worker
- `board.ts`: Core board operations and state management
- `humanSolver.ts`: Human-style solving with step-by-step explanations
- `generator.ts`: Puzzle generation with symmetry patterns
- `techniques/`: Implementation of solving techniques (singles, subsets, interactions, xwing)
- `bitset.ts`: Efficient bitset operations for candidate tracking
- `peers.ts`: Cell relationship calculations (row/column/box peers)

**State Management**: 
- `src/state/boardState.ts`: Zustand store for game state management
- Handles board state, history (undo/redo), and user interactions

**UI Components (`src/components/`)**: React components with Canvas rendering
- Main gameplay components handle the interactive Sudoku grid
- Performance-optimized for 60fps interactions

**Worker Integration (`src/workers/`)**: 
- `engine.worker.ts`: Web Worker for non-blocking puzzle operations
- Handles puzzle generation, validation, and solving asynchronously

## Key Technical Details

### TypeScript Configuration
- Strict mode enabled with all checks
- Module resolution: bundler
- Path alias: `@/` maps to `./src/`
- Target: ES2020

### Performance Considerations
- Canvas-based rendering for optimal grid performance
- Web Worker for CPU-intensive operations
- Bitset operations for efficient candidate tracking
- Target: <10ms hint generation, 60fps interactions

### Testing
- Vitest with React Testing Library
- Tests located in `src/tests/`
- Setup file: `src/tests/setup.ts`

### PWA Configuration
- Vite PWA plugin with auto-update
- Offline functionality
- Service worker for caching strategies