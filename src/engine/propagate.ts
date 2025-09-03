import { Board, Change, houseCells } from './types';
import { 
  clearCandidate, 
  hasCandidate, 
  isSingleton, 
  singletonDigit
} from './bitset';
import { getPeers } from './peers';
import { applyChange, getCandidatePositions } from './board';

export interface PropagationResult {
  changes: Change[];
  valid: boolean;
}

export function propagateFull(board: Board): PropagationResult {
  const changes: Change[] = [];
  let changed = true;
  
  while (changed) {
    changed = false;
    
    const nakedChanges = propagateNakedSingles(board);
    if (nakedChanges.length > 0) {
      changes.push(...nakedChanges);
      changed = true;
    }
    
    const hiddenChanges = propagateHiddenSingles(board);
    if (hiddenChanges.length > 0) {
      changes.push(...hiddenChanges);
      changed = true;
    }
  }
  
  const valid = boardIsValid(board);
  return { changes, valid };
}

function propagateNakedSingles(board: Board): Change[] {
  const changes: Change[] = [];
  
  for (let i = 0; i < 81; i++) {
    if (board[i].value === 0 && isSingleton(board[i].candidates)) {
      const digit = singletonDigit(board[i].candidates);
      if (applyChange(board, { type: 'place', cell: i, digit })) {
        changes.push({ type: 'place', cell: i, digit });
      }
    }
  }
  
  return changes;
}

function propagateHiddenSingles(board: Board): Change[] {
  const changes: Change[] = [];
  
  for (let house = 0; house < 27; house++) {
    for (let digit = 1; digit <= 9; digit++) {
      const positions = getCandidatePositions(board, house, digit);
      
      if (positions.length === 1) {
        const cell = positions[0];
        if (board[cell].value === 0) {
          if (applyChange(board, { type: 'place', cell, digit })) {
            changes.push({ type: 'place', cell, digit });
          }
        }
      }
    }
  }
  
  return changes;
}

function boardIsValid(board: Board): boolean {
  for (let house = 0; house < 27; house++) {
    const cells = houseCells(house);
    const seen = new Set<number>();
    
    for (const cell of cells) {
      const value = board[cell].value;
      if (value !== 0) {
        if (seen.has(value)) {
          return false;
        }
        seen.add(value);
      }
    }
    
    for (let digit = 1; digit <= 9; digit++) {
      const positions = getCandidatePositions(board, house, digit);
      const placedCount = cells.filter(c => board[c].value === digit).length;
      
      if (placedCount === 0 && positions.length === 0) {
        return false;
      }
    }
  }
  
  for (let i = 0; i < 81; i++) {
    if (board[i].value === 0 && board[i].candidates === 0) {
      return false;
    }
  }
  
  return true;
}

export function eliminateCandidate(
  board: Board, 
  cell: number, 
  digit: number
): boolean {
  if (board[cell].value !== 0) return false;
  if (!hasCandidate(board[cell].candidates, digit)) return false;
  
  board[cell].candidates = clearCandidate(board[cell].candidates, digit);
  
  if (board[cell].candidates === 0) {
    return false;
  }
  
  if (isSingleton(board[cell].candidates)) {
    const value = singletonDigit(board[cell].candidates);
    return applyChange(board, { type: 'place', cell, digit: value });
  }
  
  return true;
}

export function eliminateCandidates(
  board: Board,
  eliminations: Array<{ cell: number; digit: number }>
): boolean {
  for (const { cell, digit } of eliminations) {
    if (!eliminateCandidate(board, cell, digit)) {
      return false;
    }
  }
  return true;
}

export function placeDigit(
  board: Board,
  cell: number,
  digit: number
): boolean {
  if (board[cell].value !== 0) return false;
  if (!hasCandidate(board[cell].candidates, digit)) return false;
  
  board[cell].value = digit;
  board[cell].candidates = 0;
  
  const peers = getPeers(cell);
  for (const peer of peers) {
    if (board[peer].value === 0) {
      board[peer].candidates = clearCandidate(board[peer].candidates, digit);
    }
  }
  
  return true;
}