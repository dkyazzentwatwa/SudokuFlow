import { Board, SolverResult } from './types';
import { cloneBoard, isSolved } from './board';
import { popcount, hasCandidate } from './bitset';
import { propagateFull } from './propagate';

export function solveFull(board: Board, findAll = false): SolverResult {
  const workingBoard = cloneBoard(board);
  
  const { valid } = propagateFull(workingBoard);
  if (!valid) {
    return { unique: false, solutionsFound: 0 };
  }
  
  const solutions: Board[] = [];
  const maxSolutions = findAll ? Infinity : 2;
  
  function dfs(): boolean {
    if (isSolved(workingBoard)) {
      solutions.push(cloneBoard(workingBoard));
      return solutions.length >= maxSolutions;
    }
    
    const cell = selectCell(workingBoard);
    if (cell === -1) {
      return false;
    }
    
    const candidates = workingBoard[cell].candidates;
    const orderedDigits = getOrderedCandidates(workingBoard, cell, candidates);
    
    for (const digit of orderedDigits) {
      const savedBoard = cloneBoard(workingBoard);
      
      workingBoard[cell].value = digit;
      workingBoard[cell].candidates = 0;
      
      updatePeers(workingBoard, cell, digit);
      
      const { valid } = propagateFull(workingBoard);
      
      if (valid) {
        if (dfs()) {
          return true;
        }
      }
      
      for (let i = 0; i < 81; i++) {
        workingBoard[i] = { ...savedBoard[i] };
      }
    }
    
    return false;
  }
  
  dfs();
  
  return {
    unique: solutions.length === 1,
    solutionsFound: solutions.length,
    solution: solutions.length > 0 ? solutions[0] : undefined
  };
}

function selectCell(board: Board): number {
  let minCandidates = 10;
  let bestCell = -1;
  
  for (let i = 0; i < 81; i++) {
    if (board[i].value === 0) {
      const count = popcount(board[i].candidates);
      if (count === 0) {
        return -1;
      }
      if (count < minCandidates) {
        minCandidates = count;
        bestCell = i;
        if (count === 1) {
          return bestCell;
        }
      }
    }
  }
  
  return bestCell;
}

function getOrderedCandidates(board: Board, cell: number, candidates: number): number[] {
  const digits: Array<{ digit: number; constraintCount: number }> = [];
  
  for (let digit = 1; digit <= 9; digit++) {
    if (hasCandidate(candidates, digit)) {
      let constraintCount = 0;
      
      const row = Math.floor(cell / 9);
      const col = cell % 9;
      const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
      
      for (let c = 0; c < 9; c++) {
        const idx = row * 9 + c;
        if (idx !== cell && board[idx].value === 0 && hasCandidate(board[idx].candidates, digit)) {
          constraintCount++;
        }
      }
      
      for (let r = 0; r < 9; r++) {
        const idx = r * 9 + col;
        if (idx !== cell && board[idx].value === 0 && hasCandidate(board[idx].candidates, digit)) {
          constraintCount++;
        }
      }
      
      const boxRow = Math.floor(box / 3) * 3;
      const boxCol = (box % 3) * 3;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const idx = (boxRow + r) * 9 + (boxCol + c);
          if (idx !== cell && board[idx].value === 0 && hasCandidate(board[idx].candidates, digit)) {
            constraintCount++;
          }
        }
      }
      
      digits.push({ digit, constraintCount });
    }
  }
  
  digits.sort((a, b) => a.constraintCount - b.constraintCount);
  return digits.map(d => d.digit);
}

function updatePeers(board: Board, cell: number, digit: number): void {
  const row = Math.floor(cell / 9);
  const col = cell % 9;
  const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
  
  for (let c = 0; c < 9; c++) {
    const idx = row * 9 + c;
    if (idx !== cell && board[idx].value === 0) {
      board[idx].candidates &= ~(1 << (digit - 1));
    }
  }
  
  for (let r = 0; r < 9; r++) {
    const idx = r * 9 + col;
    if (idx !== cell && board[idx].value === 0) {
      board[idx].candidates &= ~(1 << (digit - 1));
    }
  }
  
  const boxRow = Math.floor(box / 3) * 3;
  const boxCol = (box % 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const idx = (boxRow + r) * 9 + (boxCol + c);
      if (idx !== cell && board[idx].value === 0) {
        board[idx].candidates &= ~(1 << (digit - 1));
      }
    }
  }
}

export function validateUniqueness(board: Board): boolean {
  const result = solveFull(board, false);
  return result.unique && result.solutionsFound === 1;
}