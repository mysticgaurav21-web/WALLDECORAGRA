import { PanelVisualizerInput, PanelVisualizerResult, PanelCell } from '../types/visualizer';
import { convertToFeet } from './unitConversions';

export function calculatePanelLayout(input: PanelVisualizerInput): PanelVisualizerResult {
  const {
    wallWidth,
    wallHeight,
    panelWidth,
    panelHeight,
    panelUnit,
    orientation,
    wastagePercent,
    jointGapWidth = 0, // in inches
    reuseOffcuts = false,
    openings = [],
  } = input;

  const wallWidthFt = wallWidth;
  const wallHeightFt = wallHeight;

  // Convert panel dimensions to feet
  const panelWidthFt = convertToFeet(panelWidth, panelUnit);
  const panelHeightFt = convertToFeet(panelHeight, panelUnit);
  const gapWidthFt = jointGapWidth / 12;

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

  // Effective dimensions with joints
  const isVertical = orientation === 'Vertical' || orientation === 'Auto Recommend';
  const effectivePanelWidth = panelWidthFt + gapWidthFt;
  const effectivePanelHeight = panelHeightFt; // vertical joints don't affect height usually

  const cellW = isVertical ? effectivePanelWidth : effectivePanelHeight;
  const cellH = isVertical ? effectivePanelHeight : effectivePanelWidth;

  const panelsAcrossWidthPrecise = wallWidthFt / cellW;
  const panelsAcrossHeightPrecise = wallHeightFt / cellH;

  const cols = Math.ceil(panelsAcrossWidthPrecise);
  const rows = Math.ceil(panelsAcrossHeightPrecise);

  let fullPanelsCount = 0;
  let cutPanelsCount = 0;
  const cells: PanelCell[] = [];

  // Track offcuts: list of lengths (if vertical, width offcuts; if horizontal, height offcuts)
  // Each offcut has a size and height/width
  interface Offcut {
    size: number; // width in ft for vertical, length/height in ft for horizontal
    length: number;
  }
  let availableOffcuts: Offcut[] = [];
  let reusedOffcutsCount = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW;
      const y = r * cellH;
      const w = Math.min(panelWidthFt, wallWidthFt - x);
      const h = Math.min(panelHeightFt, wallHeightFt - y);

      if (w <= 0 || h <= 0) continue;

      // Check if this cell is entirely inside an opening
      let isOverlapOpening = false;
      let overlapFully = false;
      
      openings.forEach(op => {
        const opX1 = op.distanceLeft;
        const opX2 = op.distanceLeft + op.width;
        const opY1 = wallHeightFt - op.distanceFloor - op.height; // SVG/Canvas coordinate (top-down)
        const opY2 = wallHeightFt - op.distanceFloor;

        // Check bounding box overlap
        const xOverlap = Math.max(0, Math.min(x + w, opX2) - Math.max(x, opX1));
        const yOverlap = Math.max(0, Math.min(y + h, opY2) - Math.max(y, opY1));
        const overlapArea = xOverlap * yOverlap;
        const cellArea = w * h;

        if (overlapArea > 0) {
          isOverlapOpening = true;
          if (overlapArea >= cellArea - 0.01) {
            overlapFully = true;
          }
        }
      });

      if (overlapFully) {
        // Skip adding panel or treat it as opening
        cells.push({
          id: `cell-${r}-${c}`,
          x,
          y,
          width: w,
          height: h,
          isCut: false,
          cutWidth: w,
          cutHeight: h,
          rowIdx: r,
          colIdx: c,
          label: 'OPENING',
          isOpening: true,
        });
        continue;
      }

      // Is it a cut panel?
      // It's a cut if its dimensions are smaller than a full panel
      const isCutW = w < panelWidthFt - 0.01;
      const isCutH = h < panelHeightFt - 0.01;
      const isCut = isCutW || isCutH || isOverlapOpening;

      let isOffcutReused = false;

      if (isCut && reuseOffcuts) {
        // Attempt to reuse an existing offcut
        // If vertical, we need an offcut with width >= w and height >= h
        const offcutIdx = availableOffcuts.findIndex(
          (off) => off.size >= w && off.length >= h
        );

        if (offcutIdx >= 0) {
          // Reuse offcut!
          isOffcutReused = true;
          reusedOffcutsCount++;
          // Remove or shrink the offcut
          availableOffcuts.splice(offcutIdx, 1);
        } else {
          // We can't reuse, so we cut a new panel, and produce a new offcut!
          const leftoverSize = isVertical ? (panelWidthFt - w) : (panelHeightFt - h);
          const leftoverLength = isVertical ? panelHeightFt : panelWidthFt;
          if (leftoverSize > 0.1) {
            availableOffcuts.push({ size: leftoverSize, length: leftoverLength });
          }
        }
      } else if (isCut) {
        // Just cut a new panel, no reuse
        cutPanelsCount++;
      } else {
        fullPanelsCount++;
      }

      cells.push({
        id: `cell-${r}-${c}`,
        x,
        y,
        width: w,
        height: h,
        isCut,
        cutWidth: w,
        cutHeight: h,
        rowIdx: r,
        colIdx: c,
        label: `${r + 1},${c + 1}`,
        isOffcutReused,
        isOpening: isOverlapOpening,
      });
    }
  }

  // Exact panels required = Total cells - reused offcuts
  const activeCells = cells.filter(c => !c.isOpening && !c.isOffcutReused);
  const exactPanelsRequired = activeCells.length;
  const roundedQuantity = exactPanelsRequired;

  // Final recommended with wastage percentage
  const finalRecommendedQuantity = Math.ceil(roundedQuantity * (1 + wastagePercent / 100));

  // Compute actual covered area
  let coveredAreaSqFt = 0;
  cells.forEach((cell) => {
    if (!cell.isOpening) {
      coveredAreaSqFt += cell.width * cell.height;
    }
  });

  const totalUsedMaterialSqFt = exactPanelsRequired * panelAreaSqFt;
  const unusableWastageSqFt = Math.max(0, totalUsedMaterialSqFt - coveredAreaSqFt);

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
    reusedOffcutsCount,
    unusableWastageSqFt,
  };
}
