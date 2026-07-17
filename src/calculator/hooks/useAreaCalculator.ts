import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  CalculatorState,
  ProductCategory,
  MeasurementType,
  MeasurementUnit,
  MeasurementRow,
  DeductionRow,
  ProductCoverageInfo,
  PricingMode,
  SpareStockOption,
} from '../types/calculator';
import { calculateCostEstimate } from '../utils/costCalculations';

const LOCAL_STORAGE_KEY = 'wd99_calc_state';

export const CATEGORY_DEFAULTS: Record<
  ProductCategory,
  {
    measurementType: MeasurementType;
    wastage: number;
    installationPattern: string;
    productCoverage: ProductCoverageInfo;
  }
> = {
  Wallpapers: {
    measurementType: 'Single Wall',
    wastage: 10,
    installationPattern: 'Straight Match',
    productCoverage: {
      productName: 'Standard Wallpaper Roll',
      productCode: 'WP-STD',
      unit: 'Roll',
      coveragePerUnit: 57,
      sellingPrice: 2400,
      installationCharge: 15,
      pricingMode: 'roll',
      isInstallationPerUnit: false,
      width: 1.75, // 21 inches
      height: 33.0, // 33 feet
    },
  },
  'Wall Panels': {
    measurementType: 'Single Wall',
    wastage: 7,
    installationPattern: 'Straight Vertical',
    productCoverage: {
      productName: 'Grey Marble UV Sheet',
      productCode: 'UV-003',
      unit: 'Sheet',
      coveragePerUnit: 32,
      sellingPrice: 2400,
      installationCharge: 450,
      pricingMode: 'sheet',
      isInstallationPerUnit: true,
      panelWidth: 10, // 10 inches
      panelHeight: 120, // 10 ft
      panelThickness: 0.5,
      panelUnit: 'Inches',
      panelOrientation: 'Vertical',
      jointGapWidth: 0,
      cuttingAllowance: 5,
      useDimensionCoverage: true,
    },
  },
  'Glass Films': {
    measurementType: 'Single Glass',
    wastage: 5,
    installationPattern: 'Seamless Fit',
    productCoverage: {
      productName: 'Frosted Glass Film',
      productCode: 'GF-FROST',
      unit: 'Square Foot',
      coveragePerUnit: 1,
      sellingPrice: 70,
      installationCharge: 15,
      pricingMode: 'sqft',
      isInstallationPerUnit: false,
    },
  },
  Blinds: {
    measurementType: 'Single Window',
    wastage: 0,
    installationPattern: 'Standard Mount',
    productCoverage: {
      productName: 'Premium Roller Blind',
      productCode: 'BL-ROLLER',
      unit: 'Square Foot',
      coveragePerUnit: 1,
      sellingPrice: 120,
      installationCharge: 20,
      pricingMode: 'sqft',
      isInstallationPerUnit: false,
    },
  },
  Flooring: {
    measurementType: 'Single Room',
    wastage: 8,
    installationPattern: 'Straight Lay',
    productCoverage: {
      productName: 'Wooden Flooring Box',
      productCode: 'FL-WOOD',
      unit: 'Box',
      coveragePerUnit: 18,
      sellingPrice: 1800,
      installationCharge: 30,
      pricingMode: 'box',
      isInstallationPerUnit: false,
    },
  },
};

export function useAreaCalculator() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const getInitialState = (): CalculatorState => {
    // 1. Check state from location/navigation
    const stateFromLocation = location.state as Partial<CalculatorState> | null;
    if (stateFromLocation?.category) {
      return {
        ...CATEGORY_DEFAULTS[stateFromLocation.category],
        ...stateFromLocation,
      } as CalculatorState;
    }

    // 2. Check search params
    const paramCategory = searchParams.get('category') as ProductCategory | null;
    if (paramCategory && CATEGORY_DEFAULTS[paramCategory]) {
      const defaults = CATEGORY_DEFAULTS[paramCategory];
      return {
        category: paramCategory,
        measurementType: defaults.measurementType,
        unit: 'Feet',
        rows: [{ id: 'init-row-1', width: 10, height: 10, quantity: 1, collapsed: false }],
        deductions: [],
        wastage: defaults.wastage,
        installationPattern: defaults.installationPattern,
        productCoverage: { ...defaults.productCoverage },
        transportCharge: 0,
        additionalCharge: 0,
        reuseOffcuts: true,
        spareOption: 'recommended',
        customSpareQty: 0,
      };
    }

    // 3. Try loading from localStorage
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.category) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing calculator state', e);
      }
    }

    // 4. Default state
    const defaultCat: ProductCategory = 'Wall Panels';
    const defaults = CATEGORY_DEFAULTS[defaultCat];
    return {
      category: defaultCat,
      measurementType: defaults.measurementType,
      unit: 'Feet',
      rows: [{ id: 'init-row-1', width: 10, height: 10, quantity: 1, collapsed: false }],
      deductions: [],
      wastage: defaults.wastage,
      installationPattern: defaults.installationPattern,
      productCoverage: { ...defaults.productCoverage },
      transportCharge: 0,
      additionalCharge: 0,
      reuseOffcuts: true,
      spareOption: 'recommended',
      customSpareQty: 0,
    };
  };

  const [state, setState] = useState<CalculatorState>(getInitialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const changeCategory = (category: ProductCategory) => {
    const defaults = CATEGORY_DEFAULTS[category];
    let initialWidth = 10;
    let initialHeight = 10;

    if (category === 'Flooring') {
      initialWidth = 12;
      initialHeight = 10;
    } else if (category === 'Glass Films') {
      initialWidth = 6;
      initialHeight = 4;
    }

    setState((prev) => ({
      ...prev,
      category,
      measurementType: defaults.measurementType,
      wastage: defaults.wastage,
      installationPattern: defaults.installationPattern,
      rows: [{ id: `row-${Date.now()}`, label: `${category === 'Flooring' ? 'Room' : 'Wall'} 1`, width: initialWidth, height: initialHeight, quantity: 1, collapsed: false }],
      deductions: [],
      productCoverage: { ...defaults.productCoverage },
      spareOption: 'recommended',
      customSpareQty: 0,
      activeWallIndex: 0,
    }));
    setErrors({});
  };

  const changeMeasurementType = (measurementType: MeasurementType) => {
    setState((prev) => ({ ...prev, measurementType }));
  };

  const changeUnit = (unit: MeasurementUnit) => {
    setState((prev) => ({ ...prev, unit }));
  };

  // Rows Actions
  const addRow = () => {
    const defaultLabel = state.category === 'Flooring' ? `Room ${state.rows.length + 1}` : `Wall ${state.rows.length + 1}`;
    setState((prev) => ({
      ...prev,
      rows: [
        ...prev.rows,
        { id: `row-${Date.now()}-${Math.random()}`, label: defaultLabel, width: 10, height: 10, quantity: 1, collapsed: false },
      ],
      activeWallIndex: prev.rows.length,
    }));
  };

  const duplicateRow = (id: string) => {
    const target = state.rows.find(r => r.id === id);
    if (!target) return;
    setState((prev) => {
      const idx = prev.rows.findIndex(r => r.id === id);
      const newRow = {
        ...target,
        id: `row-${Date.now()}-${Math.random()}`,
        label: `${target.label || 'Area'} (Copy)`,
      };
      const updated = [...prev.rows];
      updated.splice(idx + 1, 0, newRow);
      return {
        ...prev,
        rows: updated,
        activeWallIndex: idx + 1,
      };
    });
  };

  const sameSizeAsPrevious = (id: string) => {
    const idx = state.rows.findIndex(r => r.id === id);
    if (idx <= 0) return; // Must have a previous row
    const prevRow = state.rows[idx - 1];
    setState((prev) => ({
      ...prev,
      rows: prev.rows.map((r) =>
        r.id === id ? { ...r, width: prevRow.width, height: prevRow.height } : r
      ),
    }));
  };

  const removeRow = (id: string) => {
    setState((prev) => {
      if (prev.rows.length <= 1) return prev;
      const updatedRows = prev.rows.filter((r) => r.id !== id);
      return {
        ...prev,
        rows: updatedRows,
        activeWallIndex: Math.max(0, (prev.activeWallIndex || 0) - 1),
      };
    });
  };

  const updateRow = (id: string, field: 'width' | 'height' | 'quantity' | 'collapsed', value: any) => {
    setState((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    }));
  };

  const updateRowLabel = (id: string, label: string) => {
    setState((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => (r.id === id ? { ...r, label } : r)),
    }));
  };

  // Deductions Actions
  const addDeduction = (label: string = 'Door', width: number = 3, height: number = 7, distanceLeft: number = 2, distanceFloor: number = 0) => {
    setState((prev) => ({
      ...prev,
      deductions: [
        ...prev.deductions,
        {
          id: `ded-${Date.now()}-${Math.random()}`,
          label,
          width,
          height,
          quantity: 1,
          distanceLeft,
          distanceFloor,
        },
      ],
    }));
  };

  const removeDeduction = (id: string) => {
    setState((prev) => ({
      ...prev,
      deductions: prev.deductions.filter((d) => d.id !== id),
    }));
  };

  const updateDeduction = (
    id: string,
    field: 'width' | 'height' | 'quantity' | 'distanceLeft' | 'distanceFloor',
    value: number
  ) => {
    setState((prev) => ({
      ...prev,
      deductions: prev.deductions.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
    }));
  };

  const updateDeductionLabel = (id: string, label: string) => {
    setState((prev) => ({
      ...prev,
      deductions: prev.deductions.map((d) => (d.id === id ? { ...d, label } : d)),
    }));
  };

  const updateWastage = (wastage: number) => {
    setState((prev) => ({ ...prev, wastage }));
  };

  const updateInstallationPattern = (installationPattern: string) => {
    setState((prev) => ({ ...prev, installationPattern }));
  };

  const updateProductCoverage = (fields: Partial<ProductCoverageInfo>) => {
    setState((prev) => ({
      ...prev,
      productCoverage: { ...prev.productCoverage, ...fields },
    }));
  };

  const updateCharges = (transport: number, additional: number) => {
    setState((prev) => ({
      ...prev,
      transportCharge: transport,
      additionalCharge: additional,
    }));
  };

  const updateSpareOption = (spareOption: SpareStockOption, customSpareQty: number = 0) => {
    setState((prev) => ({
      ...prev,
      spareOption,
      customSpareQty,
    }));
  };

  const updateActiveWallIndex = (idx: number) => {
    setState((prev) => ({ ...prev, activeWallIndex: idx }));
  };

  const resetCalculator = () => {
    const defaults = CATEGORY_DEFAULTS[state.category];
    let initialWidth = 10;
    let initialHeight = 10;
    if (state.category === 'Flooring') {
      initialWidth = 12;
      initialHeight = 10;
    } else if (state.category === 'Glass Films') {
      initialWidth = 6;
      initialHeight = 4;
    }

    setState({
      category: state.category,
      measurementType: defaults.measurementType,
      unit: 'Feet',
      rows: [{ id: `row-${Date.now()}`, label: `${state.category === 'Flooring' ? 'Room' : 'Wall'} 1`, width: initialWidth, height: initialHeight, quantity: 1, collapsed: false }],
      deductions: [],
      wastage: defaults.wastage,
      installationPattern: defaults.installationPattern,
      productCoverage: { ...defaults.productCoverage },
      transportCharge: 0,
      additionalCharge: 0,
      reuseOffcuts: true,
      spareOption: 'recommended',
      customSpareQty: 0,
      activeWallIndex: 0,
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate rows
    state.rows.forEach((row) => {
      if (row.width <= 0 || isNaN(row.width)) {
        newErrors[`row-width-${row.id}`] = 'Width must be greater than zero.';
      }
      if (row.height <= 0 || isNaN(row.height)) {
        newErrors[`row-height-${row.id}`] = 'Height / Length must be greater than zero.';
      }
    });

    // Validate deductions
    state.deductions.forEach((ded) => {
      if (ded.width <= 0 || isNaN(ded.width)) {
        newErrors[`ded-width-${ded.id}`] = 'Deduction width must be greater than zero.';
      }
      if (ded.height <= 0 || isNaN(ded.height)) {
        newErrors[`ded-height-${ded.id}`] = 'Deduction height must be greater than zero.';
      }
    });

    // Validate wastage
    if (state.wastage < 0 || state.wastage > 50 || isNaN(state.wastage)) {
      newErrors['wastage'] = 'Wastage must be between 0% and 50%.';
    }

    // Validate pricing
    if (state.productCoverage.sellingPrice < 0 || isNaN(state.productCoverage.sellingPrice)) {
      newErrors['sellingPrice'] = 'Selling price cannot be negative.';
    }

    // Total deductions check
    const calculation = calculateCostEstimate(state);
    if (calculation.totalDeductionSqFt >= calculation.totalAreaSqFt && state.deductions.length > 0) {
      newErrors['deductionsTotal'] = 'Total deduction area cannot exceed total measured area.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const results = calculateCostEstimate(state);

  return {
    state,
    errors,
    results,
    changeCategory,
    changeMeasurementType,
    changeUnit,
    addRow,
    duplicateRow,
    sameSizeAsPrevious,
    removeRow,
    updateRow,
    updateRowLabel,
    addDeduction,
    removeDeduction,
    updateDeduction,
    updateDeductionLabel,
    updateWastage,
    updateInstallationPattern,
    updateProductCoverage,
    updateCharges,
    updateSpareOption,
    updateActiveWallIndex,
    resetCalculator,
    validateForm,
  };
}
