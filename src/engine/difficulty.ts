import { Board, DifficultyRating } from './types';
import { solveHuman } from './humanSolver';
import { getTechniqueWeight } from './techniques/registry';

export function rateBoard(board: Board): DifficultyRating {
  const result = solveHuman(board);
  
  if (!result.solved) {
    return {
      score: 10.0,
      bucket: 'Expert',
      hardestTechnique: 'Unsolvable',
      totalSteps: result.steps.length,
      details: {
        techniqueWeights: new Map(),
        earliestHardStep: 0,
        branchingPressure: 0
      }
    };
  }
  
  const techniqueWeights = new Map<string, number>();
  let hardestWeight = 0;
  let hardestTechnique = 'None';
  let earliestHardStep = result.steps.length;
  let branchingPressure = 0;
  
  result.steps.forEach((step, index) => {
    const weight = getTechniqueWeight(step.kind);
    techniqueWeights.set(step.kind, weight);
    
    if (weight > hardestWeight) {
      hardestWeight = weight;
      hardestTechnique = step.kind;
      earliestHardStep = index;
    }
    
    if (step.eliminations.length > 3) {
      branchingPressure += step.eliminations.length * 0.01;
    }
  });
  
  const score = calculateScore(
    hardestWeight,
    result.steps.length,
    earliestHardStep,
    branchingPressure
  );
  
  const bucket = getBucket(score);
  
  return {
    score,
    bucket,
    hardestTechnique,
    totalSteps: result.steps.length,
    details: {
      techniqueWeights,
      earliestHardStep,
      branchingPressure
    }
  };
}

function calculateScore(
  hardestWeight: number,
  totalSteps: number,
  earliestHardStep: number,
  branchingPressure: number
): number {
  return (
    hardestWeight +
    Math.min(totalSteps * 0.02, 1.0) +
    Math.max(0, (20 - earliestHardStep) * 0.05) +
    Math.min(branchingPressure, 0.5)
  );
}

function getBucket(score: number): 'Easy' | 'Medium' | 'Hard' | 'Expert' {
  if (score < 1.5) return 'Easy';
  if (score < 2.5) return 'Medium';
  if (score < 3.5) return 'Hard';
  return 'Expert';
}

export function meetsTargetDifficulty(
  board: Board,
  target: 'Easy' | 'Medium' | 'Hard' | 'Expert'
): boolean {
  const rating = rateBoard(board);
  
  if (rating.bucket !== target) {
    return false;
  }
  
  if (target === 'Easy' && rating.totalSteps < 10) {
    return false;
  }
  
  if (target === 'Medium' && rating.totalSteps < 15) {
    return false;
  }
  
  if (target === 'Hard') {
    const hasAdvanced = Array.from(rating.details.techniqueWeights.values())
      .some(w => w >= 2.0);
    if (!hasAdvanced) {
      return false;
    }
  }
  
  if (target === 'Expert') {
    const hasExpert = Array.from(rating.details.techniqueWeights.values())
      .some(w => w >= 2.5);
    if (!hasExpert) {
      return false;
    }
  }
  
  return true;
}