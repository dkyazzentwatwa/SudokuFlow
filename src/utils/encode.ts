import { Board } from '../engine/types';

export function encodeBoard(board: Board): string {
  const values = board.map(cell => cell.value);
  const rle = runLengthEncode(values);
  return btoa(rle).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function decodeBoard(encoded: string): number[] | null {
  try {
    const padded = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padding = (4 - (padded.length % 4)) % 4;
    const base64 = padded + '='.repeat(padding);
    const rle = atob(base64);
    return runLengthDecode(rle);
  } catch {
    return null;
  }
}

function runLengthEncode(values: number[]): string {
  let result = '';
  let i = 0;
  
  while (i < values.length) {
    const value = values[i];
    let count = 1;
    
    while (i + count < values.length && values[i + count] === value && count < 9) {
      count++;
    }
    
    if (count > 1) {
      result += `${count}${value}`;
    } else {
      result += value.toString();
    }
    
    i += count;
  }
  
  return result;
}

function runLengthDecode(rle: string): number[] {
  const result: number[] = [];
  let i = 0;
  
  while (i < rle.length) {
    if (/[2-9]/.test(rle[i]) && i + 1 < rle.length && /[0-9]/.test(rle[i + 1])) {
      const count = parseInt(rle[i]);
      const value = parseInt(rle[i + 1]);
      for (let j = 0; j < count; j++) {
        result.push(value);
      }
      i += 2;
    } else {
      result.push(parseInt(rle[i]));
      i++;
    }
  }
  
  return result;
}

export function encodeState(board: Board, includeNotes: boolean = false): string {
  const data = {
    v: board.map(c => c.value),
    g: board.map(c => c.given ? 1 : 0)
  };
  
  if (includeNotes) {
    (data as any)['n'] = board.map(c => c.candidates);
  }
  
  return btoa(JSON.stringify(data))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function decodeState(encoded: string): Board | null {
  try {
    const padded = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padding = (4 - (padded.length % 4)) % 4;
    const base64 = padded + '='.repeat(padding);
    const data = JSON.parse(atob(base64));
    
    if (!data.v || data.v.length !== 81) {
      return null;
    }
    
    const board: Board = new Array(81);
    
    for (let i = 0; i < 81; i++) {
      board[i] = {
        value: data.v[i] || 0,
        given: data.g ? data.g[i] === 1 : false,
        candidates: data.n ? data.n[i] : 0
      };
    }
    
    return board;
  } catch {
    return null;
  }
}