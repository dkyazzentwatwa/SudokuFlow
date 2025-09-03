import { Board, Step, Change, houseCells, boxForCell } from '../types';
import { hasCandidate } from '../bitset';

export function detectPointingPairs(board: Board): Step | null {
  for (let box = 0; box < 9; box++) {
    const boxHouse = box + 18;
    const boxCells = houseCells(boxHouse);
    
    for (let digit = 1; digit <= 9; digit++) {
      const positions: number[] = [];
      
      for (const cell of boxCells) {
        if (board[cell].value === 0 && hasCandidate(board[cell].candidates, digit)) {
          positions.push(cell);
        }
      }
      
      if (positions.length === 2 || positions.length === 3) {
        const rows = positions.map(p => Math.floor(p / 9));
        const cols = positions.map(p => p % 9);
        
        const sameRow = rows.every(r => r === rows[0]);
        const sameCol = cols.every(c => c === cols[0]);
        
        if (sameRow) {
          const row = rows[0];
          const eliminations: Change[] = [];
          
          for (let col = 0; col < 9; col++) {
            const cell = row * 9 + col;
            if (!positions.includes(cell) && 
                board[cell].value === 0 && 
                hasCandidate(board[cell].candidates, digit)) {
              eliminations.push({ type: 'eliminate', cell, digit });
            }
          }
          
          if (eliminations.length > 0) {
            return {
              kind: 'PointingPair',
              label: `Pointing ${positions.length === 2 ? 'Pair' : 'Triple'}: ${digit}`,
              rationale: `Digit ${digit} in box ${box + 1} must be in row ${row + 1}`,
              affectedCells: [...positions, ...eliminations.map(e => e.cell)],
              eliminations,
              placements: [],
              houses: [boxHouse, row],
              candidateSnapshots: new Map(
                eliminations.map(e => [e.cell, board[e.cell].candidates])
              )
            };
          }
        }
        
        if (sameCol) {
          const col = cols[0];
          const eliminations: Change[] = [];
          
          for (let row = 0; row < 9; row++) {
            const cell = row * 9 + col;
            if (!positions.includes(cell) && 
                board[cell].value === 0 && 
                hasCandidate(board[cell].candidates, digit)) {
              eliminations.push({ type: 'eliminate', cell, digit });
            }
          }
          
          if (eliminations.length > 0) {
            return {
              kind: 'PointingPair',
              label: `Pointing ${positions.length === 2 ? 'Pair' : 'Triple'}: ${digit}`,
              rationale: `Digit ${digit} in box ${box + 1} must be in column ${col + 1}`,
              affectedCells: [...positions, ...eliminations.map(e => e.cell)],
              eliminations,
              placements: [],
              houses: [boxHouse, col + 9],
              candidateSnapshots: new Map(
                eliminations.map(e => [e.cell, board[e.cell].candidates])
              )
            };
          }
        }
      }
    }
  }
  
  return null;
}

export function detectClaimingPairs(board: Board): Step | null {
  for (let row = 0; row < 9; row++) {
    const rowCells = houseCells(row);
    
    for (let digit = 1; digit <= 9; digit++) {
      const positions: number[] = [];
      
      for (const cell of rowCells) {
        if (board[cell].value === 0 && hasCandidate(board[cell].candidates, digit)) {
          positions.push(cell);
        }
      }
      
      if (positions.length === 2 || positions.length === 3) {
        const boxes = positions.map(p => boxForCell(p));
        const sameBox = boxes.every(b => b === boxes[0]);
        
        if (sameBox) {
          const box = boxes[0];
          const boxHouse = box + 18;
          const boxCells = houseCells(boxHouse);
          const eliminations: Change[] = [];
          
          for (const cell of boxCells) {
            if (!positions.includes(cell) && 
                board[cell].value === 0 && 
                hasCandidate(board[cell].candidates, digit)) {
              eliminations.push({ type: 'eliminate', cell, digit });
            }
          }
          
          if (eliminations.length > 0) {
            return {
              kind: 'ClaimingPair',
              label: `Claiming ${positions.length === 2 ? 'Pair' : 'Triple'}: ${digit}`,
              rationale: `Digit ${digit} in row ${row + 1} must be in box ${box + 1}`,
              affectedCells: [...positions, ...eliminations.map(e => e.cell)],
              eliminations,
              placements: [],
              houses: [row, boxHouse],
              candidateSnapshots: new Map(
                eliminations.map(e => [e.cell, board[e.cell].candidates])
              )
            };
          }
        }
      }
    }
  }
  
  for (let col = 0; col < 9; col++) {
    const colCells = houseCells(col + 9);
    
    for (let digit = 1; digit <= 9; digit++) {
      const positions: number[] = [];
      
      for (const cell of colCells) {
        if (board[cell].value === 0 && hasCandidate(board[cell].candidates, digit)) {
          positions.push(cell);
        }
      }
      
      if (positions.length === 2 || positions.length === 3) {
        const boxes = positions.map(p => boxForCell(p));
        const sameBox = boxes.every(b => b === boxes[0]);
        
        if (sameBox) {
          const box = boxes[0];
          const boxHouse = box + 18;
          const boxCells = houseCells(boxHouse);
          const eliminations: Change[] = [];
          
          for (const cell of boxCells) {
            if (!positions.includes(cell) && 
                board[cell].value === 0 && 
                hasCandidate(board[cell].candidates, digit)) {
              eliminations.push({ type: 'eliminate', cell, digit });
            }
          }
          
          if (eliminations.length > 0) {
            return {
              kind: 'ClaimingPair',
              label: `Claiming ${positions.length === 2 ? 'Pair' : 'Triple'}: ${digit}`,
              rationale: `Digit ${digit} in column ${col + 1} must be in box ${box + 1}`,
              affectedCells: [...positions, ...eliminations.map(e => e.cell)],
              eliminations,
              placements: [],
              houses: [col + 9, boxHouse],
              candidateSnapshots: new Map(
                eliminations.map(e => [e.cell, board[e.cell].candidates])
              )
            };
          }
        }
      }
    }
  }
  
  return null;
}