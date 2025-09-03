import { Board, ValidationResult } from './types';
import { isValid } from './board';
import { validateUniqueness } from './fullSolver';

export function validateBoard(board: Board): ValidationResult {
  const errors: string[] = [];
  
  if (!isValid(board)) {
    errors.push('Board contains conflicts or invalid state');
  }
  
  const unique = validateUniqueness(board);
  
  if (!unique) {
    errors.push('Puzzle does not have a unique solution');
  }
  
  return {
    valid: errors.length === 0,
    unique,
    errors: errors.length > 0 ? errors : undefined
  };
}

export function validateImport(input: string): ValidationResult {
  const errors: string[] = [];
  
  const cleaned = input.replace(/[\s\n]/g, '');
  
  if (cleaned.length !== 81) {
    errors.push(`Invalid length: expected 81 characters, got ${cleaned.length}`);
    return {
      valid: false,
      unique: false,
      errors
    };
  }
  
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (!/[0-9.]/.test(char)) {
      errors.push(`Invalid character at position ${i + 1}: '${char}'`);
    }
  }
  
  if (errors.length > 0) {
    return {
      valid: false,
      unique: false,
      errors
    };
  }
  
  return {
    valid: true,
    unique: true
  };
}