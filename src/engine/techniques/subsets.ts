import { Board, Step, Change, houseCells, houseType, cellCoords } from '../types';
import { 
  popcount, 
  candidateArray, 
  union, 
  hasCandidate
} from '../bitset';

export function detectNakedSubsets(board: Board, size: number): Step | null {
  for (let house = 0; house < 27; house++) {
    const cells = houseCells(house);
    const candidateCells: Array<{ cell: number; candidates: number }> = [];
    
    for (const cell of cells) {
      if (board[cell].value === 0) {
        candidateCells.push({ cell, candidates: board[cell].candidates });
      }
    }
    
    if (candidateCells.length <= size) continue;
    
    const step = findNakedSubset(board, candidateCells, size, house);
    if (step) return step;
  }
  
  return null;
}

function findNakedSubset(
  board: Board,
  candidateCells: Array<{ cell: number; candidates: number }>,
  size: number,
  house: number
): Step | null {
  const combinations = getCombinations(candidateCells, size);
  
  for (const combo of combinations) {
    let unionCandidates = 0;
    for (const item of combo) {
      unionCandidates = union(unionCandidates, item.candidates);
    }
    
    if (popcount(unionCandidates) === size) {
      const eliminations: Change[] = [];
      const subsetCells = combo.map(c => c.cell);
      const subsetDigits = candidateArray(unionCandidates);
      
      for (const { cell, candidates } of candidateCells) {
        if (!subsetCells.includes(cell)) {
          for (const digit of subsetDigits) {
            if (hasCandidate(candidates, digit)) {
              eliminations.push({ type: 'eliminate', cell, digit });
            }
          }
        }
      }
      
      if (eliminations.length > 0) {
        const type = houseType(house);
        let houseName = '';
        
        if (type === 'row') {
          houseName = `row ${house + 1}`;
        } else if (type === 'col') {
          houseName = `column ${(house - 9) + 1}`;
        } else {
          houseName = `box ${(house - 18) + 1}`;
        }
        
        const subsetName = ['', '', 'Pair', 'Triple', 'Quad'][size];
        const cellsStr = subsetCells.map(c => {
          const [r, c2] = cellCoords(c);
          return `R${r+1}C${c2+1}`;
        }).join(', ');
        
        return {
          kind: `Naked${subsetName}`,
          label: `Naked ${subsetName} in ${houseName}`,
          rationale: `Cells ${cellsStr} contain only digits {${subsetDigits.join(',')}}`,
          affectedCells: [...subsetCells, ...eliminations.map(e => e.cell)],
          eliminations,
          placements: [],
          houses: [house],
          candidateSnapshots: new Map(
            [...subsetCells, ...eliminations.map(e => e.cell)]
              .map(c => [c, board[c].candidates])
          )
        };
      }
    }
  }
  
  return null;
}

export function detectHiddenSubsets(board: Board, size: number): Step | null {
  for (let house = 0; house < 27; house++) {
    const cells = houseCells(house);
    const digitPositions = new Map<number, number[]>();
    
    for (let digit = 1; digit <= 9; digit++) {
      const positions: number[] = [];
      for (const cell of cells) {
        if (board[cell].value === 0 && hasCandidate(board[cell].candidates, digit)) {
          positions.push(cell);
        }
      }
      if (positions.length > 0 && positions.length <= size) {
        digitPositions.set(digit, positions);
      }
    }
    
    const step = findHiddenSubset(board, digitPositions, size, house);
    if (step) return step;
  }
  
  return null;
}

function findHiddenSubset(
  board: Board,
  digitPositions: Map<number, number[]>,
  size: number,
  house: number
): Step | null {
  const digits = Array.from(digitPositions.keys());
  const digitCombos = getCombinations(digits, size);
  
  for (const digitCombo of digitCombos) {
    const cellSet = new Set<number>();
    
    for (const digit of digitCombo) {
      const positions = digitPositions.get(digit)!;
      for (const pos of positions) {
        cellSet.add(pos);
      }
    }
    
    if (cellSet.size === size) {
      const eliminations: Change[] = [];
      const affectedCells = Array.from(cellSet);
      
      for (const cell of affectedCells) {
        for (let d = 1; d <= 9; d++) {
          if (!digitCombo.includes(d) && hasCandidate(board[cell].candidates, d)) {
            eliminations.push({ type: 'eliminate', cell, digit: d });
          }
        }
      }
      
      if (eliminations.length > 0) {
        const type = houseType(house);
        let houseName = '';
        
        if (type === 'row') {
          houseName = `row ${house + 1}`;
        } else if (type === 'col') {
          houseName = `column ${(house - 9) + 1}`;
        } else {
          houseName = `box ${(house - 18) + 1}`;
        }
        
        const subsetName = ['', '', 'Pair', 'Triple', 'Quad'][size];
        const cellsStr = affectedCells.map(c => {
          const [r, c2] = cellCoords(c);
          return `R${r+1}C${c2+1}`;
        }).join(', ');
        
        return {
          kind: `Hidden${subsetName}`,
          label: `Hidden ${subsetName} in ${houseName}`,
          rationale: `Digits {${digitCombo.join(',')}} can only go in cells ${cellsStr} within ${houseName}`,
          affectedCells,
          eliminations,
          placements: [],
          houses: [house],
          candidateSnapshots: new Map(
            affectedCells.map(c => [c, board[c].candidates])
          )
        };
      }
    }
  }
  
  return null;
}

function getCombinations<T>(items: T[], size: number): T[][] {
  if (size === 0) return [[]];
  if (items.length < size) return [];
  
  const result: T[][] = [];
  
  function backtrack(start: number, current: T[]): void {
    if (current.length === size) {
      result.push([...current]);
      return;
    }
    
    for (let i = start; i < items.length; i++) {
      current.push(items[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  
  backtrack(0, []);
  return result;
}