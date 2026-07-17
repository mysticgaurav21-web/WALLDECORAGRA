import { MeasurementUnit } from './calculator';

export interface PanelVisualizerInput {
  wallWidth: number;   // in feet
  wallHeight: number;  // in feet
  panelWidth: number;  // raw value
  panelHeight: number; // raw value
  panelUnit: MeasurementUnit;
  orientation: 'Vertical' | 'Horizontal' | 'Auto Recommend';
  wastagePercent: number;
  jointGapWidth?: number; // in inches
  installationPattern?: string;
  reuseOffcuts?: boolean;
  openings?: Array<{
    width: number;
    height: number;
    distanceLeft: number;
    distanceFloor: number;
    label: string;
  }>;
}

export interface PanelCell {
  id: string;
  x: number;      // left coordinate in feet
  y: number;      // top coordinate in feet
  width: number;  // width in feet
  height: number; // height in feet
  isCut: boolean;
  cutWidth: number;
  cutHeight: number;
  rowIdx: number;
  colIdx: number;
  label: string;
  isOpening?: boolean;
  isOffcutReused?: boolean;
}

export interface PanelVisualizerResult {
  wallWidthFt: number;
  wallHeightFt: number;
  panelWidthFt: number;
  panelHeightFt: number;
  wallAreaSqFt: number;
  panelAreaSqFt: number;
  cols: number;
  rows: number;
  panelsAcrossWidthPrecise: number;
  panelsAcrossHeightPrecise: number;
  fullPanelsCount: number;
  cutPanelsCount: number;
  exactPanelsRequired: number;
  roundedQuantity: number;
  wastagePercent: number;
  finalRecommendedQuantity: number;
  coveredAreaSqFt: number;
  cells: PanelCell[];
  reusedOffcutsCount: number;
  unusableWastageSqFt: number;
}

export interface WallpaperVisualizerResult {
  wallWidthFt: number;
  wallHeightFt: number;
  rollWidthFt: number;
  rollLengthFt: number;
  stripsNeeded: number;
  stripsPerRoll: number;
  rollsRequired: number;
  patternRepeatFt: number;
  cutLossPerStripFt: number;
  dropLengthFt: number;
  totalRollsRecommended: number;
}

export interface FlooringVisualizerResult {
  roomLengthFt: number;
  roomBreadthFt: number;
  plankWidthFt: number;
  plankLengthFt: number;
  rowsCount: number;
  colsCount: number;
  totalPlanks: number;
  exactBoxes: number;
  roundedBoxes: number;
  coveragePerBox: number;
}

export interface GlassFilmVisualizerResult {
  glassWidthFt: number;
  glassHeightFt: number;
  filmWidthFt: number;
  stripsCount: number;
  needsSeam: boolean;
  wastageSqFt: number;
}

export interface BlindVisualizerResult {
  windowWidthFt: number;
  windowHeightFt: number;
  isInsideMount: boolean;
  finalWidthInches: number;
  finalHeightInches: number;
  areaSqFt: number;
  minChargeableAreaApplied: boolean;
}
