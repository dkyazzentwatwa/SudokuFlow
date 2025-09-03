export const TECHNIQUE_GLOSSARY: Map<string, string> = new Map([
  ['NakedSingle', 'A cell with only one possible candidate.'],
  ['HiddenSingle', 'A digit that can only go in one cell within a house.'],
  ['LastDigit', 'The last empty cell in a house must contain the missing digit.'],
  ['NakedPair', 'Two cells in a house contain only the same two candidates.'],
  ['HiddenPair', 'Two digits can only go in the same two cells within a house.'],
  ['NakedTriple', 'Three cells in a house contain only the same three candidates.'],
  ['HiddenTriple', 'Three digits can only go in the same three cells within a house.'],
  ['NakedQuad', 'Four cells in a house contain only the same four candidates.'],
  ['HiddenQuad', 'Four digits can only go in the same four cells within a house.'],
  ['PointingPair', 'A digit in a box must be in a specific row or column, eliminating it elsewhere in that line.'],
  ['ClaimingPair', 'A digit in a row or column must be in a specific box, eliminating it elsewhere in that box.'],
  ['XWing', 'A digit forms a rectangle pattern in two rows and two columns, eliminating it from other cells in those lines.'],
  ['Swordfish', 'A digit forms a 3x3 pattern across three rows and three columns.'],
  ['XYWing', 'Three bivalue cells form a pattern where one acts as a pivot.'],
  ['XYZWing', 'Three cells where one has three candidates and acts as a pivot.'],
  ['SimpleColoring', 'Following chains of a single digit to find contradictions.'],
  ['RemotePairs', 'A chain of bivalue cells with the same two candidates.'],
  ['BUG', 'Bivalue Universal Grave - all cells have two candidates except one.'],
  ['UniqueRectangle', 'A pattern that would create multiple solutions if certain candidates existed.'],
  ['Propagation', 'Automatic application of basic constraints after a placement.']
]);

export function getTechniqueDescription(techniqueName: string): string {
  return TECHNIQUE_GLOSSARY.get(techniqueName) || 'Advanced solving technique.';
}