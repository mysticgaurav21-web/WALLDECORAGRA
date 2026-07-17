import { Product } from '../../types';

export type WallSurfaceId = 
  | 'front-wall'
  | 'left-wall'
  | 'right-wall'
  | 'floor'
  | 'window'
  | 'glass-partition'
  | 'custom-section';

export interface WallSurface {
  id: WallSurfaceId;
  name: string;
  widthFt: number;
  heightFt: number;
}

export type RoomPresetId =
  | 'empty-room'
  | 'living-room'
  | 'tv-wall'
  | 'bedroom'
  | 'office-reception'
  | 'showroom'
  | 'window-wall';

export interface RoomPreset {
  id: RoomPresetId;
  name: string;
  description: string;
}

export interface DimensionState {
  roomWidthFt: number;
  roomLengthFt: number;
  roomHeightFt: number;
  wallWidthFt: number;
  wallHeightFt: number;
}

export interface ProductLayerState {
  id: string;
  product: Product;
  orientation: 'vertical' | 'horizontal';
  scale: number;
  visible: boolean;
  zIndex: number;
  surfaceId?: WallSurfaceId;
  
  // Placement coordinates on the wall (in percentages of the target wall surface)
  widthPercent: number;
  heightPercent: number;
  leftPercent: number;
  topPercent: number;
}

export interface SavedDesign {
  id: string;
  name: string;
  date: string;
  roomPresetId: RoomPresetId;
  dimensions: DimensionState;
  selectedSurfaceId: WallSurfaceId;
  layers: ProductLayerState[];
  notes?: string;
}

export interface CalculationResult {
  productId: string;
  productName: string;
  productCode: string;
  category: string;
  sellingUnit: string;
  physicalWidthFt: number;
  physicalHeightFt: number;
  targetAreaSqFt: number;
  coveragePerUnitSqFt: number;
  unitsNeededBeforeWastage: number;
  recommendedWastagePercent: number;
  unitsNeededWithWastage: number;
  productCost: number;
  installationCost: number;
  totalCost: number;
  
  // Cut pieces and material layout info
  colsNeeded: number;
  rowsNeeded: number;
  remainingAreaSqFt: number;
  wastageSqFt: number;
}
