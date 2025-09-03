import { Board, Step, Change } from '../types';
import { hasCandidate } from '../bitset';
import { getCandidatePositions } from '../board';

export function detectXWing(board: Board): Step | null {
  for (let digit = 1; digit <= 9; digit++) {
    const rowStep = findXWingInRows(board, digit);
    if (rowStep) return rowStep;
    
    const colStep = findXWingInColumns(board, digit);
    if (colStep) return colStep;
  }
  
  return null;
}

function findXWingInRows(board: Board, digit: number): Step | null {
  const rowCandidates: Map<number, number[]> = new Map();
  
  for (let row = 0; row < 9; row++) {
    const positions = getCandidatePositions(board, row, digit);
    if (positions.length === 2) {
      const cols = positions.map(p => p % 9);
      rowCandidates.set(row, cols);
    }
  }
  
  const rows = Array.from(rowCandidates.keys());
  
  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      const row1 = rows[i];
      const row2 = rows[j];
      const cols1 = rowCandidates.get(row1)!;
      const cols2 = rowCandidates.get(row2)!;
      
      if (cols1[0] === cols2[0] && cols1[1] === cols2[1]) {
        const eliminations: Change[] = [];
        const xwingCells = [
          row1 * 9 + cols1[0],
          row1 * 9 + cols1[1],
          row2 * 9 + cols1[0],
          row2 * 9 + cols1[1]
        ];
        
        for (let row = 0; row < 9; row++) {
          if (row !== row1 && row !== row2) {
            for (const col of cols1) {
              const cell = row * 9 + col;
              if (board[cell].value === 0 && hasCandidate(board[cell].candidates, digit)) {
                eliminations.push({ type: 'eliminate', cell, digit });
              }
            }
          }
        }
        
        if (eliminations.length > 0) {
          return {
            kind: 'XWing',
            label: `X-Wing: ${digit} in rows ${row1 + 1},${row2 + 1}`,
            rationale: `Digit ${digit} forms X-Wing pattern in rows ${row1 + 1} and ${row2 + 1} on columns ${cols1[0] + 1} and ${cols1[1] + 1}`,
            affectedCells: [...xwingCells, ...eliminations.map(e => e.cell)],
            eliminations,
            placements: [],
            houses: [row1, row2, cols1[0] + 9, cols1[1] + 9],
            candidateSnapshots: new Map(
              eliminations.map(e => [e.cell, board[e.cell].candidates])
            )
          };
        }
      }
    }
  }
  
  return null;
}

function findXWingInColumns(board: Board, digit: number): Step | null {
  const colCandidates: Map<number, number[]> = new Map();
  
  for (let col = 0; col < 9; col++) {
    const positions = getCandidatePositions(board, col + 9, digit);
    if (positions.length === 2) {
      const rows = positions.map(p => Math.floor(p / 9));
      colCandidates.set(col, rows);
    }
  }
  
  const cols = Array.from(colCandidates.keys());
  
  for (let i = 0; i < cols.length; i++) {
    for (let j = i + 1; j < cols.length; j++) {
      const col1 = cols[i];
      const col2 = cols[j];
      const rows1 = colCandidates.get(col1)!;
      const rows2 = colCandidates.get(col2)!;
      
      if (rows1[0] === rows2[0] && rows1[1] === rows2[1]) {
        const eliminations: Change[] = [];
        const xwingCells = [
          rows1[0] * 9 + col1,
          rows1[1] * 9 + col1,
          rows1[0] * 9 + col2,
          rows1[1] * 9 + col2
        ];
        
        for (let col = 0; col < 9; col++) {
          if (col !== col1 && col !== col2) {
            for (const row of rows1) {
              const cell = row * 9 + col;
              if (board[cell].value === 0 && hasCandidate(board[cell].candidates, digit)) {
                eliminations.push({ type: 'eliminate', cell, digit });
              }
            }
          }
        }
        
        if (eliminations.length > 0) {
          return {
            kind: 'XWing',
            label: `X-Wing: ${digit} in columns ${col1 + 1},${col2 + 1}`,
            rationale: `Digit ${digit} forms X-Wing pattern in columns ${col1 + 1} and ${col2 + 1} on rows ${rows1[0] + 1} and ${rows1[1] + 1}`,
            affectedCells: [...xwingCells, ...eliminations.map(e => e.cell)],
            eliminations,
            placements: [],
            houses: [rows1[0], rows1[1], col1 + 9, col2 + 9],
            candidateSnapshots: new Map(
              eliminations.map(e => [e.cell, board[e.cell].candidates])
            )
          };
        }
      }
    }
  }
  
  return null;
}