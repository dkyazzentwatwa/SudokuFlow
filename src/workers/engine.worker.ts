import { parseBoard, initializeCandidates, applyChanges } from '../engine/board';
import { getNextHint, solveHuman } from '../engine/humanSolver';
import { solveFull, validateUniqueness } from '../engine/fullSolver';
import { rateBoard } from '../engine/difficulty';
import { generatePuzzle, generateDaily } from '../engine/generator';
import { Board } from '../engine/types';

type WorkerMessage = 
  | { type: 'hint'; board: Board }
  | { type: 'apply'; board: Board; changes: any[] }
  | { type: 'solveHuman'; board: Board }
  | { type: 'solveFull'; board: Board }
  | { type: 'validate'; board: Board }
  | { type: 'generate'; options: any }
  | { type: 'generateDaily'; offset: number }
  | { type: 'rate'; board: Board }
  | { type: 'parse'; input: string }
  | { type: 'updateCandidates'; board: Board };

self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const data = event.data;
  const type = data.type;
  
  try {
    switch (type) {
      case 'hint': {
        const hint = getNextHint(data.board);
        self.postMessage({ type: 'hint', result: hint });
        break;
      }
      
      case 'apply': {
        const board = [...data.board];
        const success = applyChanges(board, data.changes);
        if (success) {
          initializeCandidates(board);
        }
        self.postMessage({ type: 'apply', result: { board, success } });
        break;
      }
      
      case 'solveHuman': {
        const result = solveHuman(data.board);
        self.postMessage({ type: 'solveHuman', result });
        break;
      }
      
      case 'solveFull': {
        const result = solveFull(data.board);
        self.postMessage({ type: 'solveFull', result });
        break;
      }
      
      case 'validate': {
        const unique = validateUniqueness(data.board);
        self.postMessage({ type: 'validate', result: { unique } });
        break;
      }
      
      case 'generate': {
        const puzzle = generatePuzzle(data.options);
        self.postMessage({ type: 'generate', result: puzzle });
        break;
      }
      
      case 'generateDaily': {
        const puzzle = generateDaily(data.offset || 0);
        self.postMessage({ type: 'generateDaily', result: puzzle });
        break;
      }
      
      case 'rate': {
        const rating = rateBoard(data.board);
        self.postMessage({ type: 'rate', result: rating });
        break;
      }
      
      case 'parse': {
        const board = parseBoard(data.input);
        self.postMessage({ type: 'parse', result: board });
        break;
      }
      
      case 'updateCandidates': {
        const board = [...data.board];
        initializeCandidates(board);
        self.postMessage({ type: 'updateCandidates', result: board });
        break;
      }
    }
  } catch (error) {
    self.postMessage({ 
      type: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});