export const ALL_CANDIDATES = 0b111111111;

export function digitMask(digit: number): number {
  return 1 << (digit - 1);
}

export function hasCandidate(candidates: number, digit: number): boolean {
  return (candidates & digitMask(digit)) !== 0;
}

export function setCandidate(candidates: number, digit: number): number {
  return candidates | digitMask(digit);
}

export function clearCandidate(candidates: number, digit: number): number {
  return candidates & ~digitMask(digit);
}

export function popcount(n: number): number {
  n = n - ((n >>> 1) & 0x55555555);
  n = (n & 0x33333333) + ((n >>> 2) & 0x33333333);
  return (((n + (n >>> 4)) & 0xf0f0f0f) * 0x1010101) >>> 24;
}

export function* iterateCandidates(candidates: number): Generator<number> {
  for (let digit = 1; digit <= 9; digit++) {
    if (hasCandidate(candidates, digit)) {
      yield digit;
    }
  }
}

export function candidateArray(candidates: number): number[] {
  return Array.from(iterateCandidates(candidates));
}

export function candidatesFromArray(digits: number[]): number {
  let mask = 0;
  for (const digit of digits) {
    mask = setCandidate(mask, digit);
  }
  return mask;
}

export function lowestBit(n: number): number {
  if (n === 0) return 0;
  let digit = 1;
  let mask = 1;
  while ((n & mask) === 0) {
    mask <<= 1;
    digit++;
  }
  return digit;
}

export function highestBit(n: number): number {
  if (n === 0) return 0;
  let digit = 9;
  let mask = 0b100000000;
  while ((n & mask) === 0) {
    mask >>= 1;
    digit--;
  }
  return digit;
}

export function intersection(a: number, b: number): number {
  return a & b;
}

export function union(a: number, b: number): number {
  return a | b;
}

export function difference(a: number, b: number): number {
  return a & ~b;
}

export function isEmpty(candidates: number): boolean {
  return candidates === 0;
}

export function isSingleton(candidates: number): boolean {
  return candidates !== 0 && (candidates & (candidates - 1)) === 0;
}

export function singletonDigit(candidates: number): number {
  if (!isSingleton(candidates)) return 0;
  return lowestBit(candidates);
}

export function formatCandidates(candidates: number): string {
  return candidateArray(candidates).join('');
}