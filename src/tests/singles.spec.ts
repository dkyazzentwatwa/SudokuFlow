import { describe, it, expect } from 'vitest';
import { parseBoard } from '../engine/board';
import { detectNakedSingle, detectHiddenSingle } from '../engine/techniques/singles';

describe('Singles Techniques', () => {
  it('should detect naked singles', () => {
    const puzzle = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..';
    const board = parseBoard(puzzle)!;
    
    const step = detectNakedSingle(board);
    expect(step).toBeDefined();
    expect(step?.kind).toBe('NakedSingle');
    expect(step?.placements.length).toBeGreaterThan(0);
  });
  
  it('should detect hidden singles', () => {
    const puzzle = '..3.2.6..9..3.5..1..18.64....81.29..7.......8..67.82....26.95..8..2.3..9..5.1.3';
    const board = parseBoard(puzzle)!;
    
    const step = detectHiddenSingle(board);
    expect(step).toBeDefined();
    expect(step?.kind).toBe('HiddenSingle');
    expect(step?.placements.length).toBe(1);
  });
});