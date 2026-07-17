import { MeasurementRow, DeductionRow, MeasurementUnit, ProductCategory, MeasurementType } from './calculator';

export interface MeasurementCardProps {
  index: number;
  row: MeasurementRow;
  unit: MeasurementUnit;
  category: ProductCategory;
  errorWidth?: string;
  errorHeight?: string;
  onUpdate: (field: 'width' | 'height' | 'quantity' | 'label' | 'collapsed', value: any) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onSameSizeAsPrevious?: () => void;
  showSameSizeAsPrevious?: boolean;
}

export interface DeductionCardProps {
  deduction: DeductionRow;
  unit: MeasurementUnit;
  errorWidth?: string;
  errorHeight?: string;
  onUpdate: (field: 'width' | 'height' | 'quantity' | 'label' | 'distanceLeft' | 'distanceFloor', value: any) => void;
  onRemove: () => void;
}
