import { Board } from '../engine/types';
import { ALL_CANDIDATES, clearCandidate, hasCandidate } from '../engine/bitset';
import { getPeers } from '../engine/peers';

export function calculateAutoNotes(board: Board): Board {
  const updatedBoard = [...board];
  
  // For each empty cell, calculate which digits are possible
  for (let i = 0; i < 81; i++) {
    if (updatedBoard[i].value === 0) {
      // Start with all candidates
      let candidates = ALL_CANDIDATES;
      
      // Remove candidates that appear in peers
      const peers = getPeers(i);
      for (const peer of peers) {
        if (updatedBoard[peer].value !== 0) {
          candidates = clearCandidate(candidates, updatedBoard[peer].value);
        }
      }
      
      updatedBoard[i] = {
        ...updatedBoard[i],
        candidates
      };
    }
  }
  
  return updatedBoard;
}

export function updateNotesAfterPlacement(
  board: Board, 
  placedCell: number, 
  placedDigit: number
): Board {
  const updatedBoard = [...board];
  
  // Clear candidates from the placed cell
  updatedBoard[placedCell] = {
    ...updatedBoard[placedCell],
    candidates: 0
  };
  
  // Remove the placed digit from all peers
  const peers = getPeers(placedCell);
  for (const peer of peers) {
    if (updatedBoard[peer].value === 0) {
      updatedBoard[peer] = {
        ...updatedBoard[peer],
        candidates: clearCandidate(updatedBoard[peer].candidates, placedDigit)
      };
    }
  }
  
  return updatedBoard;
}

export function highlightNakedSingles(board: Board): number[] {
  const singles: number[] = [];
  
  for (let i = 0; i < 81; i++) {
    if (board[i].value === 0) {
      const candidateCount = countCandidates(board[i].candidates);
      if (candidateCount === 1) {
        singles.push(i);
      }
    }
  }
  
  return singles;
}

export function countCandidatesForCell(candidates: number): number {
  return countCandidates(candidates);
}

function countCandidates(candidates: number): number {
  let count = 0;
  for (let digit = 1; digit <= 9; digit++) {
    if (hasCandidate(candidates, digit)) {
      count++;
    }
  }
  return count;
}

export function getCandidateHighlights(board: Board): Map<number, 'single' | 'pair' | 'triple'> {
  const highlights = new Map<number, 'single' | 'pair' | 'triple'>();
  
  for (let i = 0; i < 81; i++) {
    if (board[i].value === 0) {
      const count = countCandidates(board[i].candidates);
      if (count === 1) {
        highlights.set(i, 'single');
      } else if (count === 2) {
        highlights.set(i, 'pair');
      } else if (count === 3) {
        highlights.set(i, 'triple');
      }
    }
  }
  
  return highlights;
}