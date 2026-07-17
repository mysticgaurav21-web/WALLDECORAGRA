import { BlindVisualizerResult } from '../types/visualizer';

/**
 * Calculates blind size, chargeable area, and considers minimum chargeable bounds.
 */
export function calculateBlindLayout(
  windowWidthFt: number,
  windowHeightFt: number,
  isInsideMount: boolean,
  minChargeableAreaSqFt: number = 12 // industry standard is often 12 sq.ft
): BlindVisualizerResult {
  
  // Convert feet to inches for modifications
  const widthInches = windowWidthFt * 12;
  const heightInches = windowHeightFt * 12;

  let finalWidthInches = widthInches;
  let finalHeightInches = heightInches;

  if (isInsideMount) {
    // Inside mount: fit inside recess, slight deduction to prevent scratching
    finalWidthInches = Math.max(0, widthInches - 0.5);
    finalHeightInches = heightInches;
  } else {
    // Outside mount: overlap recess to block light
    finalWidthInches = widthInches + 4; // 2 inches overlap on each side
    finalHeightInches = heightInches + 4; // 2 inches overlap on top/bottom
  }

  const finalWidthFt = finalWidthInches / 12;
  const finalHeightFt = finalHeightInches / 12;

  const rawArea = finalWidthFt * finalHeightFt;
  let areaSqFt = rawArea;
  let minChargeableAreaApplied = false;

  if (rawArea < minChargeableAreaSqFt) {
    areaSqFt = minChargeableAreaSqFt;
    minChargeableAreaApplied = true;
  }

  return {
    windowWidthFt,
    windowHeightFt,
    isInsideMount,
    finalWidthInches,
    finalHeightInches,
    areaSqFt,
    minChargeableAreaApplied,
  };
}
