import { create } from 'zustand';
import { Board, Step } from '../engine/types';
import { createEmptyBoard } from '../engine/board';
import { soundManager } from '../utils/sounds';

interface BoardState {
  board: Board;
  selectedCell: number | null;
  highlightedDigit: number | null;
  pencilMode: boolean;
  conflicts: Set<number>;
  showConflicts: boolean;
  history: Board[];
  historyIndex: number;
  currentStep: Step | null;
  
  setBoard: (board: Board) => void;
  selectCell: (cell: number | null) => void;
  setHighlightedDigit: (digit: number | null) => void;
  togglePencilMode: () => void;
  setPencilMode: (mode: boolean) => void;
  placeDigit: (cell: number, digit: number) => void;
  toggleCandidate: (cell: number, digit: number) => void;
  clearCell: (cell: number) => void;
  setShowConflicts: (show: boolean) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  applyStep: (step: Step) => void;
  setCurrentStep: (step: Step | null) => void;
  reset: () => void;
  updateConflicts: () => void;
}

const engineWorker = new Worker(
  new URL('../workers/engine.worker.ts', import.meta.url),
  { type: 'module' }
);

export const useBoardStore = create<BoardState>((set, get) => ({
  board: createEmptyBoard(),
  selectedCell: null,
  highlightedDigit: null,
  pencilMode: false,
  conflicts: new Set(),
  showConflicts: true,
  history: [],
  historyIndex: -1,
  currentStep: null,
  
  setBoard: (board) => {
    set({ 
      board,
      history: [board],
      historyIndex: 0,
      conflicts: new Set()
    });
  },
  
  selectCell: (cell) => set({ selectedCell: cell }),
  
  setHighlightedDigit: (digit) => set({ highlightedDigit: digit }),
  
  togglePencilMode: () => set((state) => ({ pencilMode: !state.pencilMode })),
  
  setPencilMode: (mode) => set({ pencilMode: mode }),
  
  placeDigit: (cell, digit) => {
    const { board, pushHistory } = get();
    if (board[cell].given) return;
    
    pushHistory();
    const newBoard = [...board];
    newBoard[cell] = {
      ...board[cell],
      value: digit,
      candidates: 0
    };
    
    // Play sound effect
    soundManager.play('click');
    
    engineWorker.postMessage({ type: 'updateCandidates', board: newBoard });
    engineWorker.onmessage = (e) => {
      if (e.data.type === 'updateCandidates') {
        set({ board: e.data.result });
        get().updateConflicts();
      }
    };
  },
  
  toggleCandidate: (cell, digit) => {
    const { board, pushHistory } = get();
    if (board[cell].given || board[cell].value !== 0) return;
    
    pushHistory();
    const newBoard = [...board];
    const mask = 1 << (digit - 1);
    newBoard[cell] = {
      ...board[cell],
      candidates: board[cell].candidates ^ mask
    };
    
    set({ board: newBoard });
  },
  
  clearCell: (cell) => {
    const { board, pushHistory } = get();
    if (board[cell].given) return;
    
    pushHistory();
    const newBoard = [...board];
    newBoard[cell] = {
      ...board[cell],
      value: 0,
      candidates: 0b111111111
    };
    
    engineWorker.postMessage({ type: 'updateCandidates', board: newBoard });
    engineWorker.onmessage = (e) => {
      if (e.data.type === 'updateCandidates') {
        set({ board: e.data.result });
        get().updateConflicts();
      }
    };
  },
  
  setShowConflicts: (show) => set({ showConflicts: show }),
  
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      set({ 
        board: history[historyIndex - 1],
        historyIndex: historyIndex - 1
      });
      get().updateConflicts();
    }
  },
  
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      set({ 
        board: history[historyIndex + 1],
        historyIndex: historyIndex + 1
      });
      get().updateConflicts();
    }
  },
  
  pushHistory: () => {
    const { board, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...board]);
    set({ 
      history: newHistory,
      historyIndex: newHistory.length - 1
    });
  },
  
  applyStep: (step) => {
    const { board, pushHistory } = get();
    pushHistory();
    
    const changes = [...step.eliminations, ...step.placements];
    engineWorker.postMessage({ type: 'apply', board, changes });
    engineWorker.onmessage = (e) => {
      if (e.data.type === 'apply') {
        set({ 
          board: e.data.result.board,
          currentStep: null
        });
        get().updateConflicts();
      }
    };
  },
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  updateConflicts: () => {
    const { board, showConflicts } = get();
    if (!showConflicts) {
      set({ conflicts: new Set() });
      return;
    }
    
    const conflicts = new Set<number>();
    
    for (let house = 0; house < 27; house++) {
      const cells = getHouseCells(house);
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
      
      for (const [_, cellList] of valueMap) {
        if (cellList.length > 1) {
          for (const cell of cellList) {
            conflicts.add(cell);
          }
        }
      }
    }
    
    set({ conflicts });
  },
  
  reset: () => {
    set({
      board: createEmptyBoard(),
      selectedCell: null,
      highlightedDigit: null,
      pencilMode: false,
      conflicts: new Set(),
      history: [],
      historyIndex: -1,
      currentStep: null
    });
  }
}));

function getHouseCells(house: number): number[] {
  const cells: number[] = [];
  
  if (house < 9) {
    const row = house;
    for (let col = 0; col < 9; col++) {
      cells.push(row * 9 + col);
    }
  } else if (house < 18) {
    const col = house - 9;
    for (let row = 0; row < 9; row++) {
      cells.push(row * 9 + col);
    }
  } else {
    const box = house - 18;
    const boxRow = Math.floor(box / 3) * 3;
    const boxCol = (box % 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        cells.push((boxRow + r) * 9 + (boxCol + c));
      }
    }
  }
  
  return cells;
}