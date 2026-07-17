import { CalculatorState, CalculationResult } from '../types/calculator';
import { calculateGrossArea, calculateDeductionsArea, calculateNetArea } from './areaCalculations';
import { calculatePanelLayout } from './panelLayoutMath';
import { calculateWallpaperRolls } from './wallpaperRollMath';
import { calculateFlooringLayout } from './flooringLayoutMath';
import { calculateGlassFilmLayout } from './glassFilmMath';
import { calculateBlindLayout } from './blindMath';
import { convertSqFtToSqM } from './unitConversions';

export function calculateCostEstimate(state: CalculatorState): CalculationResult {
  const {
    category,
    measurementType,
    unit,
    rows,
    deductions,
    wastage,
    installationPattern,
    productCoverage,
    transportCharge,
    additionalCharge,
    reuseOffcuts,
    spareOption,
    customSpareQty,
  } = state;

  // 1. Calculate Areas
  const totalAreaSqFt = calculateGrossArea(rows, unit);
  const totalDeductionSqFt = calculateDeductionsArea(deductions, unit);
  const netAreaSqFt = calculateNetArea(rows, deductions, unit);
  const wastageAreaSqFt = netAreaSqFt * (wastage / 100);
  const finalRequiredCoverageSqFt = netAreaSqFt + wastageAreaSqFt;

  // 2. Base Quantity calculations based on category layout rules
  let roundedQuantity = 0;
  let estimatedQuantity = 0;

  if (category === 'Wall Panels') {
    // Run layout-based math on the active rows
    let totalPanelsAcrossRows = 0;
    rows.forEach(row => {
      const pLayout = calculatePanelLayout({
        wallWidth: row.width,
        wallHeight: row.height,
        panelWidth: productCoverage.panelWidth || 10,
        panelHeight: productCoverage.panelHeight || 120, // 10 ft
        panelUnit: productCoverage.panelUnit || 'Inches',
        orientation: productCoverage.panelOrientation || 'Vertical',
        wastagePercent: wastage,
        jointGapWidth: productCoverage.jointGapWidth || 0,
        reuseOffcuts,
        openings: deductions.map(d => ({
          width: d.width,
          height: d.height,
          distanceLeft: d.distanceLeft || 0,
          distanceFloor: d.distanceFloor || 0,
          label: d.label,
        })),
      });
      totalPanelsAcrossRows += pLayout.exactPanelsRequired;
    });

    estimatedQuantity = totalPanelsAcrossRows;
    roundedQuantity = totalPanelsAcrossRows;

  } else if (category === 'Wallpapers') {
    let totalRollsAcrossRows = 0;
    rows.forEach(row => {
      // standard wallpapers typically 1.75 ft wide and 33 ft long
      const rollW = productCoverage.width || 1.75;
      const rollL = productCoverage.height || 33.0;
      const repeatVal = 21; // standard repeat
      const rollsRes = calculateWallpaperRolls(
        row.width,
        row.height,
        rollW,
        rollL,
        repeatVal,
        installationPattern
      );
      totalRollsAcrossRows += rollsRes.rollsRequired;
    });

    estimatedQuantity = totalRollsAcrossRows;
    roundedQuantity = totalRollsAcrossRows;

  } else if (category === 'Flooring') {
    let totalBoxesAcrossRows = 0;
    rows.forEach(row => {
      const floorRes = calculateFlooringLayout(
        row.width,
        row.height,
        8, // plank width in inches
        4, // plank length in feet
        productCoverage.coveragePerUnit || 18,
        'Along room length'
      );
      totalBoxesAcrossRows += floorRes.roundedBoxes;
    });

    estimatedQuantity = totalBoxesAcrossRows;
    roundedQuantity = totalBoxesAcrossRows;

  } else if (category === 'Glass Films') {
    let totalStrips = 0;
    rows.forEach(row => {
      const filmRes = calculateGlassFilmLayout(row.width, row.height, 36);
      totalStrips += filmRes.stripsCount;
    });
    // Glass films are often priced by sqft
    estimatedQuantity = finalRequiredCoverageSqFt / (productCoverage.coveragePerUnit || 1);
    roundedQuantity = Math.ceil(estimatedQuantity);

  } else if (category === 'Blinds') {
    let totalBlindArea = 0;
    rows.forEach(row => {
      const blindRes = calculateBlindLayout(
        row.width,
        row.height,
        measurementType === 'Inside Mount',
        12 // min 12 sqft
      );
      totalBlindArea += blindRes.areaSqFt * (row.quantity || 1);
    });
    estimatedQuantity = totalBlindArea / (productCoverage.coveragePerUnit || 1);
    roundedQuantity = Math.ceil(estimatedQuantity);
  } else {
    // Default fallback
    estimatedQuantity = finalRequiredCoverageSqFt / (productCoverage.coveragePerUnit || 1);
    roundedQuantity = Math.ceil(estimatedQuantity);
  }

  // Ensure rounded quantity is not zero if there is area
  if (roundedQuantity === 0 && finalRequiredCoverageSqFt > 0) {
    roundedQuantity = 1;
  }

  // 3. Recommended Spare Quantity
  let spareQuantity = 0;
  if (spareOption === '1unit') {
    spareQuantity = 1;
  } else if (spareOption === '2units') {
    spareQuantity = 2;
  } else if (spareOption === 'custom') {
    spareQuantity = customSpareQty;
  } else if (spareOption === 'recommended') {
    // Recommended spare stock depends on patterns and layout complexity
    if (category === 'Wall Panels') {
      spareQuantity = Math.max(1, Math.ceil(roundedQuantity * 0.10)); // 10% spare
    } else if (category === 'Wallpapers') {
      spareQuantity = installationPattern === 'Offset Match' ? 2 : 1;
    } else if (category === 'Flooring') {
      spareQuantity = Math.max(1, Math.ceil(roundedQuantity * 0.08)); // 8% spare for cuts
    } else {
      spareQuantity = 1;
    }
  }

  const purchaseQuantity = roundedQuantity + spareQuantity;

  // 4. Cost Estimations
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
      materialCost = purchaseQuantity * price;
      break;
  }

  let installationCost = 0;
  const installCharge = productCoverage.installationCharge || 0;

  if (productCoverage.isInstallationPerUnit) {
    installationCost = purchaseQuantity * installCharge;
  } else {
    installationCost = netAreaSqFt * installCharge;
  }

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
    spareQuantity,
    purchaseQuantity,
    materialCost,
    installationCost,
    grandTotal,
  };
}
