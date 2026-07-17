import {
  CalculatorState,
  CalculationResult,
} from '../types/calculator';
import { convertToFeet, convertSqFtToSqM } from './unitConversions';

/**
 * Calculates the final coverage and estimated cost based on calculator state.
 */
export function calculateEstimate(state: CalculatorState): CalculationResult {
  const {
    unit,
    rows,
    deductions,
    wastage,
    productCoverage,
    transportCharge,
    additionalCharge,
  } = state;

  // 1. Calculate Total Measured Area in Square Feet
  let totalAreaSqFt = 0;
  rows.forEach((row) => {
    const wFt = convertToFeet(row.width, unit);
    const hFt = convertToFeet(row.height, unit);
    totalAreaSqFt += wFt * hFt * (row.quantity || 1);
  });

  // 2. Calculate Total Deductions in Square Feet
  let totalDeductionSqFt = 0;
  deductions.forEach((row) => {
    const wFt = convertToFeet(row.width, unit);
    const hFt = convertToFeet(row.height, unit);
    totalDeductionSqFt += wFt * hFt;
  });

  // 3. Calculate Net Area in Square Feet
  const netAreaSqFt = Math.max(0, totalAreaSqFt - totalDeductionSqFt);

  // 4. Calculate Wastage
  const wastageAreaSqFt = netAreaSqFt * (wastage / 100);

  // 5. Final Required Coverage in Square Feet
  const finalRequiredCoverageSqFt = netAreaSqFt + wastageAreaSqFt;

  // 6. Quantity estimation
  const coveragePerUnit = productCoverage.coveragePerUnit || 1;
  const estimatedQuantity = finalRequiredCoverageSqFt / coveragePerUnit;
  // Always round up to whole purchase unit, except if it's strictly 0
  const roundedQuantity = finalRequiredCoverageSqFt > 0 ? Math.ceil(estimatedQuantity) : 0;

  // 7. Material Cost estimation
  let materialCost = 0;
  const price = productCoverage.sellingPrice || 0;

  switch (productCoverage.pricingMode) {
    case 'sqft':
      materialCost = finalRequiredCoverageSqFt * price;
      break;
    case 'sqm':
      materialCost = convertSqFtToSqM(finalRequiredCoverageSqFt) * price;
      break;
    default:
      // Per roll, sheet, panel, piece, box, unit
      materialCost = roundedQuantity * price;
      break;
  }

  // 8. Installation Cost estimation
  let installationCost = 0;
  const installCharge = productCoverage.installationCharge || 0;

  if (productCoverage.isInstallationPerUnit) {
    installationCost = roundedQuantity * installCharge;
  } else {
    // Per sqft
    installationCost = netAreaSqFt * installCharge;
  }

  // 9. Grand Total
  const grandTotal = materialCost + installationCost + (transportCharge || 0) + (additionalCharge || 0);

  return {
    totalAreaSqFt,
    totalAreaSqM: convertSqFtToSqM(totalAreaSqFt),
    totalDeductionSqFt,
    netAreaSqFt,
    wastageAreaSqFt,
    finalRequiredCoverageSqFt,
    estimatedQuantity,
    roundedQuantity,
    materialCost,
    installationCost,
    grandTotal,
    spareQuantity: 0,
    purchaseQuantity: roundedQuantity,
  };
}
