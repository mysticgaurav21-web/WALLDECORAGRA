export type ProductCategory = 'Wallpapers' | 'Wall Panels' | 'Glass Films' | 'Blinds' | 'Flooring';

export type MeasurementType =
  // Wallpaper
  | 'Single Wall'
  | 'Multiple Walls'
  | 'Custom Area'
  // Wall Panels
  | 'Feature Wall'
  // Glass Films
  | 'Single Glass'
  | 'Multiple Glass Sections'
  | 'Door Glass'
  // Blinds
  | 'Single Window'
  | 'Multiple Windows'
  | 'Inside Mount'
  | 'Outside Mount'
  // Flooring
  | 'Single Room'
  | 'Multiple Rooms'
  | 'Stair or Passage';

export type MeasurementUnit = 'Feet' | 'Inches' | 'Metres' | 'Centimetres';

export interface MeasurementRow {
  id: string;
  label?: string;
  width: number;
  height: number;
  quantity?: number;
  collapsed?: boolean;
}

export interface DeductionRow {
  id: string;
  label: string;
  width: number;
  height: number;
  quantity: number;
  distanceLeft?: number; // Distance from left in feet
  distanceFloor?: number; // Distance from floor in feet
}

export type PricingMode =
  | 'sqft'
  | 'sqm'
  | 'roll'
  | 'sheet'
  | 'panel'
  | 'piece'
  | 'box'
  | 'unit';

export type SpareStockOption = 'none' | '1unit' | '2units' | 'custom' | 'recommended';

export interface ProductCoverageInfo {
  productName?: string;
  productCode?: string;
  unit: string; // Roll, Sheet, Panel, Piece, Box, Square Foot, Square Metre, Running Foot, Unit
  width?: number; // dimension, optional
  height?: number; // dimension, optional
  coveragePerUnit: number; // coverage in square feet
  sellingPrice: number;
  installationCharge: number;
  pricingMode: PricingMode;
  isInstallationPerUnit: boolean;
  
  // Wall Panel specific fields
  panelWidth?: number;
  panelHeight?: number;
  panelThickness?: number;
  panelOrientation?: 'Vertical' | 'Horizontal' | 'Auto Recommend';
  panelUnit?: MeasurementUnit;
  jointGapWidth?: number; // in inches
  cuttingAllowance?: number; // in percentage, e.g. 5 for 5%
  useDimensionCoverage?: boolean;
}

export interface CalculatorState {
  category: ProductCategory;
  measurementType: MeasurementType;
  unit: MeasurementUnit;
  rows: MeasurementRow[];
  deductions: DeductionRow[];
  wastage: number; // Percentage, e.g. 10
  installationPattern: string; // Straight, Herringbone, Diagonal, Staggered, Standard Drop, etc.
  productCoverage: ProductCoverageInfo;
  transportCharge: number;
  additionalCharge: number;
  reuseOffcuts: boolean;
  spareOption: SpareStockOption;
  customSpareQty: number;
  activeWallIndex?: number; // For multiple wall tab selection
}

export interface CalculationResult {
  totalAreaSqFt: number;
  totalAreaSqM: number;
  totalDeductionSqFt: number;
  netAreaSqFt: number;
  wastageAreaSqFt: number;
  finalRequiredCoverageSqFt: number;
  estimatedQuantity: number; // exact raw units
  roundedQuantity: number; // exact rounded upwards
  spareQuantity: number; // units based on spareOption
  purchaseQuantity: number; // roundedQuantity + spareQuantity
  materialCost: number;
  installationCost: number;
  grandTotal: number;
}
