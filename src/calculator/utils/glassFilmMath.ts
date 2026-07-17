import { GlassFilmVisualizerResult } from '../types/visualizer';

/**
 * Calculates glass film layout, strips needed, and flags seam alerts.
 */
export function calculateGlassFilmLayout(
  glassWidthFt: number,
  glassHeightFt: number,
  filmWidthInches: number = 36 // 3 feet default
): GlassFilmVisualizerResult {
  const filmWidthFt = filmWidthInches / 12;

  // Calculate strips across glass width
  const stripsCount = Math.ceil(glassWidthFt / filmWidthFt);
  const needsSeam = stripsCount > 1;

  const totalUsedAreaSqFt = stripsCount * filmWidthFt * glassHeightFt;
  const glassAreaSqFt = glassWidthFt * glassHeightFt;
  const wastageSqFt = Math.max(0, totalUsedAreaSqFt - glassAreaSqFt);

  return {
    glassWidthFt,
    glassHeightFt,
    filmWidthFt,
    stripsCount,
    needsSeam,
    wastageSqFt,
  };
}
