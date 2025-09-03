import { TechniqueDetector, Board } from '../types';
import { detectNakedSingle, detectHiddenSingle, detectLastDigitInHouse } from './singles';
import { detectNakedSubsets, detectHiddenSubsets } from './subsets';
import { detectPointingPairs, detectClaimingPairs } from './interactions';
import { detectXWing } from './xwing';

export const TECHNIQUE_WEIGHTS: Map<string, number> = new Map([
  ['NakedSingle', 0.1],
  ['HiddenSingle', 0.2],
  ['LastDigit', 0.15],
  ['NakedPair', 1.2],
  ['HiddenPair', 1.3],
  ['NakedTriple', 1.6],
  ['HiddenTriple', 1.7],
  ['NakedQuad', 1.8],
  ['HiddenQuad', 1.9],
  ['PointingPair', 1.4],
  ['ClaimingPair', 1.4],
  ['XWing', 2.2],
  ['Swordfish', 2.6],
  ['XYWing', 2.8],
  ['XYZWing', 2.9],
  ['SimpleColoring', 3.0],
  ['RemotePairs', 3.1],
  ['BUG', 3.2],
  ['UniqueRectangle', 3.3]
]);

export function createTechniqueRegistry(): TechniqueDetector[] {
  return [
    {
      name: 'NakedSingle',
      priority: 1,
      detect: detectNakedSingle,
      enabled: true
    },
    {
      name: 'HiddenSingle',
      priority: 2,
      detect: detectHiddenSingle,
      enabled: true
    },
    {
      name: 'LastDigit',
      priority: 3,
      detect: detectLastDigitInHouse,
      enabled: true
    },
    {
      name: 'PointingPair',
      priority: 10,
      detect: detectPointingPairs,
      enabled: true
    },
    {
      name: 'ClaimingPair',
      priority: 11,
      detect: detectClaimingPairs,
      enabled: true
    },
    {
      name: 'NakedPair',
      priority: 20,
      detect: (board: Board) => detectNakedSubsets(board, 2),
      enabled: true
    },
    {
      name: 'HiddenPair',
      priority: 21,
      detect: (board: Board) => detectHiddenSubsets(board, 2),
      enabled: true
    },
    {
      name: 'NakedTriple',
      priority: 22,
      detect: (board: Board) => detectNakedSubsets(board, 3),
      enabled: true
    },
    {
      name: 'HiddenTriple',
      priority: 23,
      detect: (board: Board) => detectHiddenSubsets(board, 3),
      enabled: true
    },
    {
      name: 'NakedQuad',
      priority: 24,
      detect: (board: Board) => detectNakedSubsets(board, 4),
      enabled: true
    },
    {
      name: 'HiddenQuad',
      priority: 25,
      detect: (board: Board) => detectHiddenSubsets(board, 4),
      enabled: true
    },
    {
      name: 'XWing',
      priority: 30,
      detect: detectXWing,
      enabled: true
    }
  ].sort((a, b) => a.priority - b.priority);
}

export function getTechniqueWeight(techniqueName: string): number {
  return TECHNIQUE_WEIGHTS.get(techniqueName) || 1.0;
}