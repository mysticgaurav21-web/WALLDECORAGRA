import { MeasurementRow, DeductionRow, MeasurementUnit } from '../types/calculator';
import { convertToFeet } from './unitConversions';

export function calculateGrossArea(rows: MeasurementRow[], unit: MeasurementUnit): number {
  let totalAreaSqFt = 0;
  rows.forEach((row) => {
    const wFt = convertToFeet(row.width, unit);
    const hFt = convertToFeet(row.height, unit);
    totalAreaSqFt += wFt * hFt * (row.quantity || 1);
  });
  return totalAreaSqFt;
}

export function calculateDeductionsArea(deductions: DeductionRow[], unit: MeasurementUnit): number {
  let totalDeductionSqFt = 0;
  deductions.forEach((row) => {
    const wFt = convertToFeet(row.width, unit);
    const hFt = convertToFeet(row.height, unit);
    totalDeductionSqFt += wFt * hFt * (row.quantity || 1);
  });
  return totalDeductionSqFt;
}

export function calculateNetArea(rows: MeasurementRow[], deductions: DeductionRow[], unit: MeasurementUnit): number {
  const gross = calculateGrossArea(rows, unit);
  const deduction = calculateDeductionsArea(deductions, unit);
  return Math.max(0, gross - deduction);
}
