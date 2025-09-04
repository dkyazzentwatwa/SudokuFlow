import { Board, GeneratorOptions } from './types';
import { createEmptyBoard, cloneBoard, initializeCandidates, parseBoard } from './board';
import { solveFull, validateUniqueness } from './fullSolver';
import { SeededRandom } from '../utils/rng';
import { PRESET_PUZZLES } from './puzzles';

export function generatePuzzle(options: GeneratorOptions): Board | null {
  const { difficulty, symmetry = true, seed } = options;
  const rng = new SeededRandom(seed);
  
  // First try to use a preset puzzle for quick start
  const presets = PRESET_PUZZLES[difficulty];
  if (presets && presets.length > 0) {
    const puzzleString = rng.choice(presets);
    const puzzle = parseBoard(puzzleString);
    if (puzzle) {
      return puzzle;
    }
  }
  
  // If presets fail or don't exist, try generation (but with limited attempts)
  for (let attempt = 0; attempt < 3; attempt++) {
    const fullGrid = generateCompleteGrid(rng);
    if (!fullGrid) continue;
    
    const puzzle = removeClues(fullGrid, difficulty, symmetry, rng);
    if (puzzle) {
      return puzzle;
    }
  }
  
  // Final fallback - return any valid preset
  const fallbackPuzzle = parseBoard(PRESET_PUZZLES.Medium[0]);
  return fallbackPuzzle;
}

function generateCompleteGrid(rng: SeededRandom): Board | null {
  const board = createEmptyBoard();
  
  // Fill first row with random permutation
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  rng.shuffle(digits);
  for (let i = 0; i < 9; i++) {
    board[i].value = digits[i];
    board[i].given = false;
  }
  
  initializeCandidates(board);
  
  // Use DFS to complete the grid
  const result = solveFull(board, false);
  return result.solution || null;
}

function removeClues(
  fullGrid: Board,
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert',
  symmetry: boolean,
  rng: SeededRandom
): Board | null {
  const puzzle = cloneBoard(fullGrid);
  const cellOrder = Array.from({ length: 81 }, (_, i) => i);
  rng.shuffle(cellOrder);
  
  const minClues = getMinClues(difficulty);
  const targetClues = minClues + rng.nextInt(5); // Add some randomness
  let currentClues = 81;
  
  for (const cell of cellOrder) {
    if (currentClues <= targetClues) break;
    
    const symCell = symmetry ? getSymmetricCell(cell) : cell;
    
    if (puzzle[cell].value === 0) continue;
    
    const backup = cloneBoard(puzzle);
    
    // Try removing the cell(s)
    puzzle[cell].value = 0;
    puzzle[cell].given = false;
    if (symmetry && symCell !== cell && puzzle[symCell].value !== 0) {
      puzzle[symCell].value = 0;
      puzzle[symCell].given = false;
    }
    
    initializeCandidates(puzzle);
    
    // Check if puzzle still has unique solution
    if (!validateUniqueness(puzzle)) {
      // Restore and continue
      for (let i = 0; i < 81; i++) {
        puzzle[i] = { ...backup[i] };
      }
      continue;
    }
    
    // Update clue count
    currentClues = puzzle.filter(c => c.value !== 0).length;
  }
  
  // Mark remaining values as givens
  for (let i = 0; i < 81; i++) {
    if (puzzle[i].value !== 0) {
      puzzle[i].given = true;
    }
  }
  
  return puzzle;
}

function getMinClues(difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert'): number {
  switch (difficulty) {
    case 'Easy': return 36;
    case 'Medium': return 32;
    case 'Hard': return 28;
    case 'Expert': return 23;
  }
}

function getSymmetricCell(cell: number): number {
  return 80 - cell;
}

export function generateDaily(dayOffset: number = 0): Board | null {
  const today = new Date();
  today.setDate(today.getDate() + dayOffset);
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  return generatePuzzle({
    difficulty: 'Medium',
    symmetry: true,
    seed
  });
}