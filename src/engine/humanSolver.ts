import { Board, Step, HumanSolveResult } from './types';
import { cloneBoard, isSolved } from './board';
import { applyChanges } from './board';
import { createTechniqueRegistry } from './techniques/registry';
import { propagateFull } from './propagate';

export interface HumanSolverOptions {
  maxSteps?: number;
  enabledTechniques?: Set<string>;
}

export function solveHuman(
  board: Board,
  options: HumanSolverOptions = {}
): HumanSolveResult {
  const { maxSteps = 1000, enabledTechniques } = options;
  const workingBoard = cloneBoard(board);
  const steps: Step[] = [];
  
  const { changes: propChanges } = propagateFull(workingBoard);
  if (propChanges.length > 0) {
    steps.push({
      kind: 'Propagation',
      label: 'Initial propagation',
      rationale: 'Applying constraint propagation',
      affectedCells: propChanges.map(c => c.cell),
      eliminations: propChanges.filter(c => c.type === 'eliminate'),
      placements: propChanges.filter(c => c.type === 'place')
    });
  }
  
  const registry = createTechniqueRegistry().filter(
    t => !enabledTechniques || enabledTechniques.has(t.name)
  );
  
  let stepCount = 0;
  
  while (!isSolved(workingBoard) && stepCount < maxSteps) {
    const step = findNextStep(workingBoard, registry);
    
    if (!step) {
      break;
    }
    
    steps.push(step);
    
    const allChanges = [...step.eliminations, ...step.placements];
    if (!applyChanges(workingBoard, allChanges)) {
      break;
    }
    
    const { changes: propChanges } = propagateFull(workingBoard);
    if (propChanges.length > 0) {
      steps.push({
        kind: 'Propagation',
        label: 'Constraint propagation',
        rationale: 'Propagating constraints after ' + step.kind,
        affectedCells: propChanges.map(c => c.cell),
        eliminations: propChanges.filter(c => c.type === 'eliminate'),
        placements: propChanges.filter(c => c.type === 'place')
      });
    }
    
    stepCount++;
  }
  
  return {
    solved: isSolved(workingBoard),
    steps,
    finalBoard: workingBoard
  };
}

export function getNextHint(
  board: Board,
  enabledTechniques?: Set<string>
): Step | null {
  const workingBoard = cloneBoard(board);
  
  const { changes: propChanges } = propagateFull(workingBoard);
  if (propChanges.length > 0) {
    return {
      kind: 'Propagation',
      label: 'Constraint propagation',
      rationale: 'Apply basic constraint propagation',
      affectedCells: propChanges.map(c => c.cell),
      eliminations: propChanges.filter(c => c.type === 'eliminate'),
      placements: propChanges.filter(c => c.type === 'place')
    };
  }
  
  const registry = createTechniqueRegistry().filter(
    t => !enabledTechniques || enabledTechniques.has(t.name)
  );
  
  return findNextStep(board, registry);
}

function findNextStep(
  board: Board,
  registry: ReturnType<typeof createTechniqueRegistry>
): Step | null {
  for (const technique of registry) {
    if (technique.enabled) {
      const step = technique.detect(board);
      if (step) {
        return step;
      }
    }
  }
  
  return null;
}