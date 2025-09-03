export interface Cell {
  given: boolean;
  value: number;
  candidates: number;
}

export interface Change {
  type: 'eliminate' | 'place';
  cell: number;
  digit: number;
}

export interface Step {
  kind: string;
  label: string;
  rationale: string;
  affectedCells: number[];
  eliminations: Change[];
  placements: Change[];
  houses?: number[];
  links?: Link[];
  candidateSnapshots?: Map<number, number>;
}

export interface Link {
  type: 'strong' | 'weak';
  from: { cell: number; digit: number };
  to: { cell: number; digit: number };
}

export type Board = Cell[];

export interface SolverResult {
  unique: boolean;
  solutionsFound: number;
  solution?: Board;
}

export interface HumanSolveResult {
  solved: boolean;
  steps: Step[];
  finalBoard: Board;
}

export interface GeneratorOptions {
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  symmetry: boolean;
  seed?: number;
}

export interface DifficultyRating {
  score: number;
  bucket: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  hardestTechnique: string;
  totalSteps: number;
  details: {
    techniqueWeights: Map<string, number>;
    earliestHardStep: number;
    branchingPressure: number;
  };
}

export interface ValidationResult {
  valid: boolean;
  unique: boolean;
  errors?: string[];
}

export interface TechniqueDetector {
  name: string;
  priority: number;
  detect: (board: Board) => Step | null;
  enabled: boolean;
}

export interface EngineConfig {
  enabledTechniques: Set<string>;
  maxAICLength: number;
  enableFinnedFish: boolean;
  enableJellyfish: boolean;
}

export const GRID_SIZE = 9;
export const TOTAL_CELLS = 81;
export const BOX_SIZE = 3;

export function cellIndex(row: number, col: number): number {
  return row * GRID_SIZE + col;
}

export function cellCoords(index: number): [number, number] {
  return [Math.floor(index / GRID_SIZE), index % GRID_SIZE];
}

export function boxIndex(row: number, col: number): number {
  return Math.floor(row / BOX_SIZE) * BOX_SIZE + Math.floor(col / BOX_SIZE);
}

export function boxForCell(cellIndex: number): number {
  const [row, col] = cellCoords(cellIndex);
  return boxIndex(row, col);
}

export const ROW_HOUSES = Array.from({ length: 9 }, (_, i) => i);
export const COL_HOUSES = Array.from({ length: 9 }, (_, i) => i + 9);
export const BOX_HOUSES = Array.from({ length: 9 }, (_, i) => i + 18);

export function houseType(houseId: number): 'row' | 'col' | 'box' {
  if (houseId < 9) return 'row';
  if (houseId < 18) return 'col';
  return 'box';
}

export function houseCells(houseId: number): number[] {
  const type = houseType(houseId);
  const cells: number[] = [];
  
  if (type === 'row') {
    const row = houseId;
    for (let col = 0; col < 9; col++) {
      cells.push(cellIndex(row, col));
    }
  } else if (type === 'col') {
    const col = houseId - 9;
    for (let row = 0; row < 9; row++) {
      cells.push(cellIndex(row, col));
    }
  } else {
    const box = houseId - 18;
    const boxRow = Math.floor(box / 3) * 3;
    const boxCol = (box % 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        cells.push(cellIndex(boxRow + r, boxCol + c));
      }
    }
  }
  
  return cells;
}