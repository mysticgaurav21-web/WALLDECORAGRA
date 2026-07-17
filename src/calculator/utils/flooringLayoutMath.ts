import { FlooringVisualizerResult } from '../types/visualizer';

/**
 * Calculates flooring boards and boxes based on room dimensions, board dimensions, and box coverage.
 */
export function calculateFlooringLayout(
  roomLengthFt: number,
  roomBreadthFt: number,
  plankWidthInches: number = 6,
  plankLengthFt: number = 4,
  coveragePerBox: number = 18,
  direction: 'Along room length' | 'Along room width' | 'Auto Recommend' = 'Along room length'
): FlooringVisualizerResult {
  const plankWidthFt = plankWidthInches / 12;

  // Determine plank alignment
  let alongLength = true;
  if (direction === 'Along room width') {
    alongLength = false;
  } else if (direction === 'Auto Recommend') {
    // Usually recommend laying planks along the longer dimension
    alongLength = roomLengthFt >= roomBreadthFt;
  }

  // Dimension along which planks run
  const boardL = alongLength ? plankLengthFt : plankWidthFt;
  const boardW = alongLength ? plankWidthFt : plankLengthFt;

  const colsCount = Math.ceil(roomLengthFt / boardL);
  const rowsCount = Math.ceil(roomBreadthFt / boardW);
  const totalPlanks = colsCount * rowsCount;

  const roomArea = roomLengthFt * roomBreadthFt;
  const exactBoxes = roomArea / (coveragePerBox || 1);
  const roundedBoxes = Math.ceil(exactBoxes);

  return {
    roomLengthFt,
    roomBreadthFt,
    plankWidthFt,
    plankLengthFt,
    rowsCount,
    colsCount,
    totalPlanks,
    exactBoxes,
    roundedBoxes,
    coveragePerBox,
  };
}
