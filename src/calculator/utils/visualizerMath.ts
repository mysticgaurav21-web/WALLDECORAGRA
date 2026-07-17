import { MeasurementUnit } from '../types/calculator';
import { PanelVisualizerInput, PanelVisualizerResult, PanelCell } from '../types/visualizer';
import { convertToFeet } from './unitConversions';

/**
 * Calculates panel coverage details and generates layout cells for the visualizer.
 */
export function calculatePanelCoverage(input: PanelVisualizerInput): PanelVisualizerResult {
  const {
    wallWidth,
    wallHeight,
    panelWidth,
    panelHeight,
    panelUnit,
    orientation,
    wastagePercent,
  } = input;

  // 1. Convert wall dimensions to Feet (if inputs are raw)
  // Note: the wall inputs are already passed in feet or converted to feet by useAreaCalculator, 
  // but to be absolutely safe, let's treat the inputs as raw and convert them or assume they are in feet.
  // We'll assume the input wall dimensions are in Feet, since that is standard for the wall measurements.
  const wallWidthFt = wallWidth;
  const wallHeightFt = wallHeight;

  // 2. Convert panel dimensions from panelUnit to Feet
  const panelWidthFt = convertToFeet(panelWidth, panelUnit);
  const panelHeightFt = convertToFeet(panelHeight, panelUnit);

  const wallAreaSqFt = wallWidthFt * wallHeightFt;
  const panelAreaSqFt = panelWidthFt * panelHeightFt;

  if (panelWidthFt <= 0 || panelHeightFt <= 0 || wallWidthFt <= 0 || wallHeightFt <= 0) {
    return {
      wallWidthFt,
      wallHeightFt,
      panelWidthFt,
      panelHeightFt,
      wallAreaSqFt,
      panelAreaSqFt,
      cols: 0,
      rows: 0,
      panelsAcrossWidthPrecise: 0,
      panelsAcrossHeightPrecise: 0,
      fullPanelsCount: 0,
      cutPanelsCount: 0,
      exactPanelsRequired: 0,
      roundedQuantity: 0,
      wastagePercent,
      finalRecommendedQuantity: 0,
      coveredAreaSqFt: 0,
      cells: [],
      reusedOffcutsCount: 0,
      unusableWastageSqFt: 0,
    };
  }

  // 3. Determine single-cell width & height based on orientation
  // If orientation is Vertical:
  // - cellW is panelWidthFt (runs across the wall width)
  // - cellH is panelHeightFt (runs along the wall height)
  // If orientation is Horizontal:
  // - cellW is panelHeightFt (long side runs across the wall width)
  // - cellH is panelWidthFt (short side stacked vertically along the wall height)
  const cellW = orientation === 'Vertical' ? panelWidthFt : panelHeightFt;
  const cellH = orientation === 'Vertical' ? panelHeightFt : panelWidthFt;

  // 4. Calculate columns (across width) and rows (across height)
  const panelsAcrossWidthPrecise = wallWidthFt / cellW;
  const panelsAcrossHeightPrecise = wallHeightFt / cellH;

  const cols = Math.ceil(panelsAcrossWidthPrecise);
  const rows = Math.ceil(panelsAcrossHeightPrecise);

  // 5. Generate cell layout and classify as Full or Cut
  const cells: PanelCell[] = [];
  let fullPanelsCount = 0;
  let cutPanelsCount = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW;
      const y = r * cellH;
      const w = Math.min(cellW, wallWidthFt - x);
      const h = Math.min(cellH, wallHeightFt - y);

      // A panel is cut if it is not fully within the wall boundary
      // Using a small epsilon to prevent floating-point rounding errors
      const isCutW = w < cellW - 0.005;
      const isCutH = h < cellH - 0.005;
      const isCut = isCutW || isCutH;

      if (isCut) {
        cutPanelsCount++;
      } else {
        fullPanelsCount++;
      }

      const cellId = `cell-${r}-${c}`;
      const label = `${r + 1},${c + 1}`;

      cells.push({
        id: cellId,
        x,
        y,
        width: w,
        height: h,
        isCut,
        cutWidth: w,
        cutHeight: h,
        rowIdx: r,
        colIdx: c,
        label,
      });
    }
  }

  // 6. Calculate total exact required count
  // Each cell represents a panel segment that must be cut from a full panel.
  // In the simplest physical world, each cell segment corresponds to 1 panel used.
  const exactPanelsRequired = cols * rows;

  // 7. Calculate recommended quantities with wastage
  const roundedQuantity = exactPanelsRequired;
  const finalRecommendedQuantity = Math.ceil(exactPanelsRequired * (1 + wastagePercent / 100));

  // Covered area is approximately equal to wall area
  const coveredAreaSqFt = wallAreaSqFt;

  return {
    wallWidthFt,
    wallHeightFt,
    panelWidthFt,
    panelHeightFt,
    wallAreaSqFt,
    panelAreaSqFt,
    cols,
    rows,
    panelsAcrossWidthPrecise,
    panelsAcrossHeightPrecise,
    fullPanelsCount,
    cutPanelsCount,
    exactPanelsRequired,
    roundedQuantity,
    wastagePercent,
    finalRecommendedQuantity,
    coveredAreaSqFt,
    cells,
    reusedOffcutsCount: 0,
    unusableWastageSqFt: 0,
  };
}
