# PrimeSudoku

A production-ready, minimalist Sudoku web app with a comprehensive human-logic solving engine.

## Features

### Core Gameplay
- Classic 9×9 Sudoku grid with given numbers
- Pencil marks / candidate tracking
- Auto-propagation of constraints
- Undo/redo functionality
- Same-digit highlighting
- Peer cell highlighting (row/column/box)
- Conflict detection and display
- Import/export puzzles (81-char string format)

### Human-Style Solving Engine
Comprehensive technique implementation including:
- **Singles**: Naked, Hidden, Last Digit
- **Subsets**: Naked/Hidden Pairs, Triples, Quads
- **Interactions**: Pointing Pairs/Triples, Claiming Pairs/Triples
- **Fish**: X-Wing, Swordfish (optional)
- **Wings**: XY-Wing, XYZ-Wing, W-Wing
- **Coloring**: Simple Coloring, Remote Pairs
- **Chains**: AIC-lite (Alternating Inference Chains)
- **Uniqueness**: BUG+1, Unique Rectangle Types 1-3

### Smart Features
- Deterministic, explainable hints
- Step-by-step solving with rationale
- Real difficulty rating based on techniques used
- Puzzle generator with symmetry
- Validation for unique solutions
- Daily puzzles with local streaks

### Technical Excellence
- Web Worker architecture for non-blocking operations
- Canvas-based rendering for optimal performance
- PWA support with offline functionality
- Keyboard-first controls
- Touch-optimized for mobile
- Full accessibility with ARIA support
- Sub-100ms interactions on mid-range devices

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Build

```bash
npm run build
```

The built files will be in the `dist` directory.

## Testing

```bash
npm run test
```

## Controls

### Keyboard
- **Click/Arrow Keys**: Navigate cells
- **1-9**: Place digit (or toggle candidate with Shift/Pencil Mode)
- **0/Backspace/Delete**: Clear cell
- **H**: Get hint
- **P**: Toggle pencil mode
- **Ctrl+Z**: Undo
- **Ctrl+Y**: Redo

### Touch/Mouse
- Tap/click cells to select
- Use on-screen controls for actions

## Architecture

- **Engine**: Pure TypeScript Sudoku logic engine running in Web Worker
- **UI**: React 18 with Canvas rendering
- **State**: Zustand for state management
- **Styling**: CSS Modules
- **Build**: Vite
- **Testing**: Vitest

## Difficulty Levels

- **Easy**: Singles and basic techniques only
- **Medium**: Includes subsets and interactions
- **Hard**: Adds fish patterns and wings
- **Expert**: Full technique set including chains

## Performance Targets

- Hint generation: <10ms
- Cell placement: <10ms
- 60fps highlighting and interactions
- Bundle size: <200KB gzipped

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT