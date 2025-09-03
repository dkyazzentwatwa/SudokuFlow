import { describe, it, expect } from 'vitest';
import {
  digitMask,
  hasCandidate,
  setCandidate,
  clearCandidate,
  popcount,
  candidateArray,
  candidatesFromArray,
  union,
  intersection,
  isSingleton,
  singletonDigit
} from '../engine/bitset';

describe('Bitset Operations', () => {
  it('should create correct digit masks', () => {
    expect(digitMask(1)).toBe(0b000000001);
    expect(digitMask(5)).toBe(0b000010000);
    expect(digitMask(9)).toBe(0b100000000);
  });
  
  it('should check candidates correctly', () => {
    const candidates = 0b101010101;
    expect(hasCandidate(candidates, 1)).toBe(true);
    expect(hasCandidate(candidates, 2)).toBe(false);
    expect(hasCandidate(candidates, 3)).toBe(true);
  });
  
  it('should set and clear candidates', () => {
    let candidates = 0;
    candidates = setCandidate(candidates, 5);
    expect(hasCandidate(candidates, 5)).toBe(true);
    
    candidates = clearCandidate(candidates, 5);
    expect(hasCandidate(candidates, 5)).toBe(false);
  });
  
  it('should count bits correctly', () => {
    expect(popcount(0b000000000)).toBe(0);
    expect(popcount(0b000000001)).toBe(1);
    expect(popcount(0b101010101)).toBe(5);
    expect(popcount(0b111111111)).toBe(9);
  });
  
  it('should convert to/from arrays', () => {
    const candidates = 0b101010101;
    const array = candidateArray(candidates);
    expect(array).toEqual([1, 3, 5, 7, 9]);
    
    const rebuilt = candidatesFromArray(array);
    expect(rebuilt).toBe(candidates);
  });
  
  it('should perform set operations', () => {
    const a = 0b111000111;
    const b = 0b000111000;
    
    expect(union(a, b)).toBe(0b111111111);
    expect(intersection(a, b)).toBe(0b000000000);
  });
  
  it('should detect singletons', () => {
    expect(isSingleton(0b000000000)).toBe(false);
    expect(isSingleton(0b000001000)).toBe(true);
    expect(isSingleton(0b000001001)).toBe(false);
    
    expect(singletonDigit(0b000001000)).toBe(4);
    expect(singletonDigit(0b100000000)).toBe(9);
  });
});