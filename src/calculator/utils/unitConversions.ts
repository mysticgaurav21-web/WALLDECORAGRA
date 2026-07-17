import { MeasurementUnit } from '../types/calculator';

/**
 * Converts a length measurement from the specified unit to feet.
 */
export function convertToFeet(value: number, fromUnit: MeasurementUnit): number {
  if (value <= 0 || isNaN(value)) return 0;
  switch (fromUnit) {
    case 'Feet':
      return value;
    case 'Inches':
      return value / 12;
    case 'Metres':
      return value * 3.28084;
    case 'Centimetres':
      return value * 0.0328084;
    default:
      return value;
  }
}

/**
 * Converts area in square feet to square metres.
 */
export function convertSqFtToSqM(areaSqFt: number): number {
  return areaSqFt / 10.7639;
}

/**
 * Formats currency values in Indian Rupees (₹) beautifully.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
