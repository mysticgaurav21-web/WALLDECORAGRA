import { Product } from '../../types';
import { CalculationResult } from '../types/visualizer';

/**
 * Returns the physical dimensions of a product in Feet.
 */
export function getProductPhysicalSize(product: Product): { widthFt: number; heightFt: number; thicknessInch: number } {
  // 1. Try nested physicalDimensions first
  if (product.physicalDimensions) {
    const { width, height, thickness, unit } = product.physicalDimensions;
    let widthFt = width;
    let heightFt = height;
    
    if (unit === 'inch') {
      widthFt = width / 12;
      heightFt = height / 12;
    } else if (unit === 'cm') {
      widthFt = width / 30.48;
      heightFt = height / 30.48;
    } else if (unit === 'm') {
      widthFt = width * 3.28084;
      heightFt = height * 3.28084;
    }
    
    return {
      widthFt,
      heightFt,
      thicknessInch: thickness || 0,
    };
  }

  // 2. Try flat properties
  if (product.width && product.height) {
    const unit = product.dimensionUnit || 'inch';
    let widthFt = product.width;
    let heightFt = product.height;

    if (unit === 'inch') {
      widthFt = product.width / 12;
      heightFt = product.height / 12;
    } else if (unit === 'cm') {
      widthFt = product.width / 30.48;
      heightFt = product.height / 30.48;
    } else if (unit === 'm') {
      widthFt = product.width * 3.28084;
      heightFt = product.height * 3.28084;
    }
    
    return {
      widthFt,
      heightFt,
      thicknessInch: 0,
    };
  }

  // 3. Parse size string (e.g. "8 × 4 ft")
  if (product.size) {
    const sizeStr = product.size.toLowerCase();
    const match = sizeStr.match(/([\d.]+)\s*(inch|in|ft|′|'|cm|m)?\s*(?:x|\*|×)\s*([\d.]+)\s*(inch|in|ft|′|'|cm|m)?/);
    if (match) {
      const w = parseFloat(match[1]);
      let wUnit = match[2] || 'inch';
      const h = parseFloat(match[3]);
      let hUnit = match[4] || 'ft';

      if (wUnit === 'in') wUnit = 'inch';
      if (wUnit === '′' || wUnit === "'") wUnit = 'ft';
      if (hUnit === 'in') hUnit = 'inch';
      if (hUnit === '′' || hUnit === "'") hUnit = 'ft';

      let widthFt = w;
      if (wUnit === 'inch') widthFt = w / 12;
      else if (wUnit === 'cm') widthFt = w / 30.48;
      else if (wUnit === 'm') widthFt = w * 3.28084;

      let heightFt = h;
      if (hUnit === 'inch') heightFt = h / 12;
      else if (hUnit === 'cm') heightFt = h / 30.48;
      else if (hUnit === 'm') heightFt = h * 3.28084;

      return {
        widthFt,
        heightFt,
        thicknessInch: 0
      };
    }
  }

  // 4. Smart Category Defaults
  const cat = product.category.toLowerCase();
  const sub = (product.subcategory || '').toLowerCase();

  if (cat.includes('panel') || sub.includes('panel')) {
    // 10 inches wide by 10 feet high
    return { widthFt: 10 / 12, heightFt: 10, thicknessInch: 0.3 };
  }
  if (cat.includes('wallpaper') || sub.includes('wallpaper')) {
    // Standard roll: 21 inches wide (1.75 ft) by 10 ft
    return { widthFt: 1.75, heightFt: 10, thicknessInch: 0.01 };
  }
  if (cat.includes('uv') || cat.includes('sheet') || sub.includes('sheet')) {
    // 4 ft x 8 ft
    return { widthFt: 4, heightFt: 8, thicknessInch: 0.05 };
  }
  if (cat.includes('blind') || sub.includes('blind')) {
    // 4 ft x 6 ft
    return { widthFt: 4, heightFt: 6, thicknessInch: 0.1 };
  }
  if (cat.includes('floor') || sub.includes('floor')) {
    // SPC Plank: 6 inch x 4 ft
    return { widthFt: 0.5, heightFt: 4, thicknessInch: 0.2 };
  }

  return { widthFt: 4, heightFt: 8, thicknessInch: 0 };
}

/**
 * Calculates the product quantity requirements and total financial cost.
 */
export function calculateRequirements(
  product: Product,
  surfaceWidthFt: number,
  surfaceHeightFt: number,
  orientation: 'vertical' | 'horizontal' = 'vertical',
  scale: number = 1,
  widthPercent: number = 100,
  heightPercent: number = 100
): CalculationResult {
  // Real target dimensions of this layer on the surface
  const targetWidthFt = surfaceWidthFt * (widthPercent / 100);
  const targetHeightFt = surfaceHeightFt * (heightPercent / 100);
  const targetAreaSqFt = targetWidthFt * targetHeightFt;

  const { widthFt: prodWidthFt, heightFt: prodHeightFt } = getProductPhysicalSize(product);
  
  // Adjusted product size by scaling parameter
  const pWidthFt = prodWidthFt * scale;
  const pHeightFt = prodHeightFt * scale;
  const pAreaSqFt = pWidthFt * pHeightFt;

  const category = product.category.toLowerCase();
  const sellingUnit = product.sellingUnit || product.unit || 'unit';

  let unitsBeforeWastage = 0;
  let colsNeeded = 0;
  let rowsNeeded = 0;
  
  // Repeat Modes: panel-strip, tile, sheet, wallpaper-roll, floor-plank, window-overlay
  const rawRepeat = product.visualizer?.repeatMode || product.repeatMode || '';
  const repeatMode = (rawRepeat === 'strip') ? 'panel-strip' : rawRepeat;

  if (repeatMode === 'panel-strip' || category.includes('panel')) {
    // Vertical or horizontal parallel panels
    if (orientation === 'vertical') {
      colsNeeded = Math.ceil(targetWidthFt / pWidthFt);
      const panelsPerCol = Math.ceil(targetHeightFt / pHeightFt);
      rowsNeeded = panelsPerCol;
      unitsBeforeWastage = colsNeeded * panelsPerCol;
    } else {
      rowsNeeded = Math.ceil(targetHeightFt / pWidthFt);
      const panelsPerRow = Math.ceil(targetWidthFt / pHeightFt);
      colsNeeded = panelsPerRow;
      unitsBeforeWastage = rowsNeeded * panelsPerRow;
    }
  } else if (repeatMode === 'wallpaper-roll' || category.includes('wallpaper')) {
    // Wallpaper roll estimation
    const rollWidth = pWidthFt;
    const rollHeight = pHeightFt;
    
    // Number of vertical strips needed
    colsNeeded = Math.ceil(targetWidthFt / rollWidth);
    
    // Strips we can cut from one single roll of rollHeight
    const stripsPerRoll = Math.max(1, Math.floor(rollHeight / targetHeightFt));
    
    unitsBeforeWastage = Math.ceil(colsNeeded / stripsPerRoll);
    rowsNeeded = 1;
  } else if (repeatMode === 'single-sheet' || repeatMode === 'sheet' || category.includes('uv')) {
    // Large seamless sheets (UV sheets)
    colsNeeded = Math.ceil(targetWidthFt / pWidthFt);
    rowsNeeded = Math.ceil(targetHeightFt / pHeightFt);
    unitsBeforeWastage = colsNeeded * rowsNeeded;
  } else if (repeatMode === 'floor-plank' || category.includes('floor') || sellingUnit === 'box') {
    // Floor SPC planks usually sold in boxes of coveragePerUnit
    const coveragePerUnit = product.coveragePerUnit || 18; // Default 18 sq.ft per box
    unitsBeforeWastage = targetAreaSqFt / coveragePerUnit;
    colsNeeded = Math.ceil(targetWidthFt / pWidthFt);
    rowsNeeded = Math.ceil(targetHeightFt / pHeightFt);
  } else {
    // Standard tiled repeats or other accessories
    const coveragePerUnit = product.coveragePerUnit || pAreaSqFt || 1;
    unitsBeforeWastage = targetAreaSqFt / coveragePerUnit;
    colsNeeded = Math.ceil(targetWidthFt / pWidthFt);
    rowsNeeded = Math.ceil(targetHeightFt / pHeightFt);
  }

  // Ensure positive values and at least 1 unit if area is larger than zero
  if (targetAreaSqFt > 0) {
    unitsBeforeWastage = Math.max(1, unitsBeforeWastage);
    colsNeeded = Math.max(1, colsNeeded);
    rowsNeeded = Math.max(1, rowsNeeded);
  } else {
    unitsBeforeWastage = 0;
    colsNeeded = 0;
    rowsNeeded = 0;
  }

  // Wastage calculations
  const recommendedWastagePercent = product.recommendedWastage || product.recommendedWastage === 0 ? product.recommendedWastage : 10;
  // If selling unit is panel/sheet/piece/roll, we round up the final counts. For sq.ft/sq.m/unit we can be more linear.
  const isDiscreteUnit = ['panel', 'sheet', 'roll', 'piece', 'box', 'unit'].includes(sellingUnit.toLowerCase());
  
  let unitsNeededWithWastage = unitsBeforeWastage * (1 + recommendedWastagePercent / 100);
  if (isDiscreteUnit) {
    unitsNeededWithWastage = Math.ceil(unitsNeededWithWastage);
    unitsBeforeWastage = Math.ceil(unitsBeforeWastage);
  } else {
    unitsNeededWithWastage = Math.round(unitsNeededWithWastage * 100) / 100;
    unitsBeforeWastage = Math.round(unitsBeforeWastage * 100) / 100;
  }

  const coveragePerUnitSqFt = product.coveragePerUnit || pAreaSqFt;
  const totalCoverageSqFt = unitsNeededWithWastage * coveragePerUnitSqFt;
  const remainingAreaSqFt = Math.max(0, totalCoverageSqFt - targetAreaSqFt);
  const wastageSqFt = totalCoverageSqFt * (recommendedWastagePercent / 100);

  const productCost = unitsNeededWithWastage * product.sellingPrice;
  const installationCost = unitsNeededWithWastage * (product.installationCharge || 0);
  const totalCost = productCost + installationCost;

  return {
    productId: product.id,
    productName: product.productName,
    productCode: product.productCode,
    category: product.category,
    sellingUnit,
    physicalWidthFt: pWidthFt,
    physicalHeightFt: pHeightFt,
    targetAreaSqFt,
    coveragePerUnitSqFt,
    unitsNeededBeforeWastage: unitsBeforeWastage,
    recommendedWastagePercent,
    unitsNeededWithWastage,
    productCost,
    installationCost,
    totalCost,
    colsNeeded,
    rowsNeeded,
    remainingAreaSqFt,
    wastageSqFt
  };
}

/**
 * Formats a decimal feet measurement to Ft & In representation.
 */
export function ftToFtIn(feetVal: number): { ft: number; in: number } {
  const ft = Math.floor(feetVal);
  const inch = Math.round((feetVal - ft) * 12);
  return { ft, in: inch === 12 ? 0 : inch };
}

/**
 * Parses Ft and In to a decimal feet value.
 */
export function ftInToFt(ft: number, inch: number): number {
  return ft + (inch / 12);
}
