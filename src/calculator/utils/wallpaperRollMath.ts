import { WallpaperVisualizerResult } from '../types/visualizer';

/**
 * Calculates wallpaper rolls required using dimension-based strip layout math.
 * 
 * Standard Roll width is typically 21 inches (1.75 ft) and roll length is 33 ft.
 */
export function calculateWallpaperRolls(
  wallWidthFt: number,
  wallHeightFt: number,
  rollWidthFt: number = 1.75, // 21 inches
  rollLengthFt: number = 33.0, // 33 feet
  patternRepeatInches: number = 21, // in inches
  matchType: string = 'Straight Match'
): WallpaperVisualizerResult {
  
  const patternRepeatFt = patternRepeatInches / 12;

  // 1. Strips (drops) needed across wall width
  const stripsNeeded = Math.ceil(wallWidthFt / rollWidthFt);

  // 2. Calculate individual drop length considering pattern repeat
  let dropLengthFt = wallHeightFt;
  let cutLossPerStripFt = 0;

  if (patternRepeatFt > 0 && matchType !== 'Random Match') {
    // Each drop must be a multiple of the pattern repeat
    const repeatsPerDrop = Math.ceil(wallHeightFt / patternRepeatFt);
    dropLengthFt = repeatsPerDrop * patternRepeatFt;
    cutLossPerStripFt = Math.max(0, dropLengthFt - wallHeightFt);
  }

  // 3. How many full drops can we get from a single roll?
  let stripsPerRoll = Math.floor(rollLengthFt / dropLengthFt);
  if (stripsPerRoll <= 0) {
    stripsPerRoll = 1; // Need at least one roll per strip if the wall is taller than roll
  }

  // 4. Calculate total rolls required
  const rollsRequired = Math.ceil(stripsNeeded / stripsPerRoll);

  return {
    wallWidthFt,
    wallHeightFt,
    rollWidthFt,
    rollLengthFt,
    stripsNeeded,
    stripsPerRoll,
    rollsRequired,
    patternRepeatFt,
    cutLossPerStripFt,
    dropLengthFt,
    totalRollsRecommended: rollsRequired,
  };
}
