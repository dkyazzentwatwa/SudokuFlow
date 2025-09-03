import { cellCoords, cellIndex, boxForCell, TOTAL_CELLS } from './types';

let PEERS_CACHE: number[][] | null = null;
let HOUSES_FOR_CELL_CACHE: number[][] | null = null;

export function getPeers(cell: number): number[] {
  if (!PEERS_CACHE) {
    initializePeersCache();
  }
  return PEERS_CACHE![cell];
}

export function getHousesForCell(cell: number): number[] {
  if (!HOUSES_FOR_CELL_CACHE) {
    initializeHousesCache();
  }
  return HOUSES_FOR_CELL_CACHE![cell];
}

function initializePeersCache(): void {
  PEERS_CACHE = new Array(TOTAL_CELLS);
  
  for (let cell = 0; cell < TOTAL_CELLS; cell++) {
    const peers = new Set<number>();
    const [row, col] = cellCoords(cell);
    const box = boxForCell(cell);
    
    for (let c = 0; c < 9; c++) {
      if (c !== col) {
        peers.add(cellIndex(row, c));
      }
    }
    
    for (let r = 0; r < 9; r++) {
      if (r !== row) {
        peers.add(cellIndex(r, col));
      }
    }
    
    const boxRow = Math.floor(box / 3) * 3;
    const boxCol = (box % 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const idx = cellIndex(boxRow + r, boxCol + c);
        if (idx !== cell) {
          peers.add(idx);
        }
      }
    }
    
    PEERS_CACHE[cell] = Array.from(peers);
  }
}

function initializeHousesCache(): void {
  HOUSES_FOR_CELL_CACHE = new Array(TOTAL_CELLS);
  
  for (let cell = 0; cell < TOTAL_CELLS; cell++) {
    const [row, col] = cellCoords(cell);
    const box = boxForCell(cell);
    
    HOUSES_FOR_CELL_CACHE[cell] = [
      row,
      col + 9,
      box + 18
    ];
  }
}

export function arePeers(cell1: number, cell2: number): boolean {
  if (cell1 === cell2) return false;
  
  const [r1, c1] = cellCoords(cell1);
  const [r2, c2] = cellCoords(cell2);
  
  return r1 === r2 || c1 === c2 || boxForCell(cell1) === boxForCell(cell2);
}

export function commonHouses(cell1: number, cell2: number): number[] {
  const houses1 = getHousesForCell(cell1);
  const houses2 = getHousesForCell(cell2);
  
  return houses1.filter(h => houses2.includes(h));
}

export function cellsSeenByAll(cells: number[]): number[] {
  if (cells.length === 0) return [];
  if (cells.length === 1) return getPeers(cells[0]);
  
  const peerSets = cells.map(c => new Set(getPeers(c)));
  const commonPeers = new Set(peerSets[0]);
  
  for (let i = 1; i < peerSets.length; i++) {
    for (const peer of commonPeers) {
      if (!peerSets[i].has(peer)) {
        commonPeers.delete(peer);
      }
    }
  }
  
  for (const cell of cells) {
    commonPeers.delete(cell);
  }
  
  return Array.from(commonPeers);
}