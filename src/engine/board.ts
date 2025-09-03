import { Board, Change, TOTAL_CELLS, houseCells } from './types';
import { 
  ALL_CANDIDATES, 
  clearCandidate, 
  hasCandidate,
  isSingleton,
  singletonDigit
} from './bitset';
import { getPeers } from './peers';

export function createEmptyBoard(): Board {
  const board: Board = new Array(TOTAL_CELLS);
  for (let i = 0; i < TOTAL_CELLS; i++) {
    board[i] = {
      given: false,
      value: 0,
      candidates: ALL_CANDIDATES
    };
  }
  return board;
}

export function cloneBoard(board: Board): Board {
  return board.map(cell => ({
    given: cell.given,
    value: cell.value,
    candidates: cell.candidates
  }));
}

export function parseBoard(input: string): Board | null {
  const cleaned = input.replace(/[\s\n]/g, '');
  
  if (cleaned.length !== 81) {
    return null;
  }
  
  const board = createEmptyBoard();
  
  for (let i = 0; i < 81; i++) {
    const char = cleaned[i];
    if (char !== '0' && char !== '.') {
      const digit = parseInt(char, 10);
      if (digit >= 1 && digit <= 9) {
        board[i].given = true;
        board[i].value = digit;
        board[i].candidates = 0;
      }
    }
  }
  
  initializeCandidates(board);
  return board;
}

export function boardToString(board: Board): string {
  return board.map(cell => cell.value || '.').join('');
}

export function initializeCandidates(board: Board): void {
  for (let i = 0; i < TOTAL_CELLS; i++) {
    if (board[i].value === 0) {
      board[i].candidates = ALL_CANDIDATES;
      
      const peers = getPeers(i);
      for (const peer of peers) {
        if (board[peer].value !== 0) {
          board[i].candidates = clearCandidate(board[i].candidates, board[peer].value);
        }
      }
    } else {
      board[i].candidates = 0;
    }
  }
}

export function applyChange(board: Board, change: Change): boolean {
  const cell = board[change.cell];
  
  if (change.type === 'place') {
    if (cell.value !== 0) return false;
    if (!hasCandidate(cell.candidates, change.digit)) return false;
    
    cell.value = change.digit;
    cell.candidates = 0;
    
    const peers = getPeers(change.cell);
    for (const peer of peers) {
      if (board[peer].value === 0) {
        board[peer].candidates = clearCandidate(board[peer].candidates, change.digit);
      }
    }
    
    return true;
  } else {
    if (cell.value !== 0) return false;
    if (!hasCandidate(cell.candidates, change.digit)) return false;
    
    cell.candidates = clearCandidate(cell.candidates, change.digit);
    return true;
  }
}

export function applyChanges(board: Board, changes: Change[]): boolean {
  for (const change of changes) {
    if (!applyChange(board, change)) {
      return false;
    }
  }
  return true;
}

export function propagateConstraints(board: Board): Change[] {
  const changes: Change[] = [];
  let changed = true;
  
  while (changed) {
    changed = false;
    
    for (let i = 0; i < TOTAL_CELLS; i++) {
      if (board[i].value === 0 && isSingleton(board[i].candidates)) {
        const digit = singletonDigit(board[i].candidates);
        if (applyChange(board, { type: 'place', cell: i, digit })) {
          changes.push({ type: 'place', cell: i, digit });
          changed = true;
        }
      }
    }
  }
  
  return changes;
}

export function isValid(board: Board): boolean {
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
  }
  
  for (let i = 0; i < TOTAL_CELLS; i++) {
    if (board[i].value === 0 && board[i].candidates === 0) {
      return false;
    }
  }
  
  return true;
}

export function isSolved(board: Board): boolean {
  for (let i = 0; i < TOTAL_CELLS; i++) {
    if (board[i].value === 0) {
      return false;
    }
  }
  return isValid(board);
}

export function getCandidatePositions(board: Board, house: number, digit: number): number[] {
  const cells = houseCells(house);
  const positions: number[] = [];
  
  for (const cell of cells) {
    if (board[cell].value === 0 && hasCandidate(board[cell].candidates, digit)) {
      positions.push(cell);
    }
  }
  
  return positions;
}

export function getHouseCandidates(board: Board, house: number): Map<number, number[]> {
  const candidates = new Map<number, number[]>();
  const cells = houseCells(house);
  
  for (let digit = 1; digit <= 9; digit++) {
    const positions: number[] = [];
    for (const cell of cells) {
      if (board[cell].value === 0 && hasCandidate(board[cell].candidates, digit)) {
        positions.push(cell);
      }
    }
    if (positions.length > 0) {
      candidates.set(digit, positions);
    }
  }
  
  return candidates;
}

export function getBoardHash(board: Board): string {
  let hash = '';
  for (let i = 0; i < TOTAL_CELLS; i++) {
    hash += board[i].value.toString();
  }
  return hash;
}

export function countFilledCells(board: Board): number {
  return board.filter(cell => cell.value !== 0).length;
}

export function getConflicts(board: Board): Set<number> {
  const conflicts = new Set<number>();
  
  for (let house = 0; house < 27; house++) {
    const cells = houseCells(house);
    const valueMap = new Map<number, number[]>();
    
    for (const cell of cells) {
      const value = board[cell].value;
      if (value !== 0) {
        if (!valueMap.has(value)) {
          valueMap.set(value, []);
        }
        valueMap.get(value)!.push(cell);
      }
    }
    
    for (const [_, cells] of valueMap) {
      if (cells.length > 1) {
        for (const cell of cells) {
          conflicts.add(cell);
        }
      }
    }
  }
  
  return conflicts;
}