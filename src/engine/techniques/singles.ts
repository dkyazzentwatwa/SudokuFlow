import { Board, Step, houseCells, houseType, cellCoords } from '../types';
import { isSingleton, singletonDigit } from '../bitset';
import { getCandidatePositions } from '../board';

export function detectNakedSingle(board: Board): Step | null {
  for (let cell = 0; cell < 81; cell++) {
    if (board[cell].value === 0 && isSingleton(board[cell].candidates)) {
      const digit = singletonDigit(board[cell].candidates);
      const [row, col] = cellCoords(cell);
      
      return {
        kind: 'NakedSingle',
        label: `Naked Single: ${digit}`,
        rationale: `Cell R${row+1}C${col+1} has only one candidate: ${digit}`,
        affectedCells: [cell],
        eliminations: [],
        placements: [{ type: 'place', cell, digit }],
        candidateSnapshots: new Map([[cell, board[cell].candidates]])
      };
    }
  }
  
  return null;
}

export function detectHiddenSingle(board: Board): Step | null {
  for (let house = 0; house < 27; house++) {
    const type = houseType(house);
    
    for (let digit = 1; digit <= 9; digit++) {
      const positions = getCandidatePositions(board, house, digit);
      
      if (positions.length === 1) {
        const cell = positions[0];
        if (board[cell].value === 0) {
          const [row, col] = cellCoords(cell);
          let houseName = '';
          
          if (type === 'row') {
            houseName = `row ${house + 1}`;
          } else if (type === 'col') {
            houseName = `column ${(house - 9) + 1}`;
          } else {
            houseName = `box ${(house - 18) + 1}`;
          }
          
          return {
            kind: 'HiddenSingle',
            label: `Hidden Single: ${digit} in ${houseName}`,
            rationale: `Digit ${digit} can only go in R${row+1}C${col+1} within ${houseName}`,
            affectedCells: [cell],
            eliminations: [],
            placements: [{ type: 'place', cell, digit }],
            houses: [house],
            candidateSnapshots: new Map([[cell, board[cell].candidates]])
          };
        }
      }
    }
  }
  
  return null;
}

export function detectLastDigitInHouse(board: Board): Step | null {
  for (let house = 0; house < 27; house++) {
    const type = houseType(house);
    const cells = houseCells(house);
    const emptyCells: number[] = [];
    const missingDigits = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    
    for (const cell of cells) {
      if (board[cell].value === 0) {
        emptyCells.push(cell);
      } else {
        missingDigits.delete(board[cell].value);
      }
    }
    
    if (emptyCells.length === 1 && missingDigits.size === 1) {
      const cell = emptyCells[0];
      const digit = Array.from(missingDigits)[0];
      const [row, col] = cellCoords(cell);
      let houseName = '';
      
      if (type === 'row') {
        houseName = `row ${house + 1}`;
      } else if (type === 'col') {
        houseName = `column ${(house - 9) + 1}`;
      } else {
        houseName = `box ${(house - 18) + 1}`;
      }
      
      return {
        kind: 'LastDigit',
        label: `Last Digit: ${digit} in ${houseName}`,
        rationale: `R${row+1}C${col+1} is the last empty cell in ${houseName}, must be ${digit}`,
        affectedCells: [cell],
        eliminations: [],
        placements: [{ type: 'place', cell, digit }],
        houses: [house],
        candidateSnapshots: new Map([[cell, board[cell].candidates]])
      };
    }
  }
  
  return null;
}