import React, { useState, useEffect } from 'react';
import { HelpCircle, Sparkles, Folder, Keyboard, Columns, LayoutGrid } from 'lucide-react';
import { ProductCoverageInfo, PricingMode, ProductCategory, MeasurementUnit } from '../types/calculator';
import { useApp } from '../../context/AppContext';
import { convertToFeet } from '../utils/unitConversions';

interface ProductCoverageFormProps {
  category: ProductCategory;
  coverage: ProductCoverageInfo;
  errors: Record<string, string>;
  onChange: (fields: Partial<ProductCoverageInfo>) => void;
}

const SUPPORTED_UNITS = [
  'Roll',
  'Sheet',
  'Panel',
  'Piece',
  'Box',
  'Square Foot',
  'Square Metre',
  'Running Foot',
  'Unit',
];

const PRICING_MODES: { value: PricingMode; label: string }[] = [
  { value: 'sqft', label: 'Per Square Foot (₹/sq.ft)' },
  { value: 'sqm', label: 'Per Square Metre (₹/sq.m)' },
  { value: 'roll', label: 'Per Roll (₹/roll)' },
  { value: 'sheet', label: 'Per Sheet (₹/sheet)' },
  { value: 'panel', label: 'Per Panel (₹/panel)' },
  { value: 'piece', label: 'Per Piece (₹/piece)' },
  { value: 'box', label: 'Per Box (₹/box)' },
  { value: 'unit', label: 'Per Unit (₹/unit)' },
];

const PanelFeetInchesInput: React.FC<{
  value: number;
  onChange: (val: number) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const [feetStr, setFeetStr] = useState<string>('');
  const [inchesStr, setInchesStr] = useState<string>('');

  useEffect(() => {
    if (value === undefined || value === null || value === 0) {
      setFeetStr('');
      setInchesStr('');
    } else {
      const feet = Math.floor(value);
      const inches = Math.round((value - feet) * 12);
      setFeetStr(feet > 0 ? feet.toString() : '0');
      setInchesStr(inches > 0 ? inches.toString() : '0');
    }
  }, [value]);

  const handleUpdate = (fStr: string, iStr: string) => {
    const feet = parseInt(fStr) || 0;
    const inches = parseInt(iStr) || 0;
    onChange(feet + inches / 12);
  };

  return (
    <div>
      <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
        {label}
      </label>
      <div className="flex gap-2 items-center">
        <div className="relative flex-1 min-w-0">
          <input
            type="number"
            min="0"
            value={feetStr}
            onChange={(e) => {
              setFeetStr(e.target.value);
              handleUpdate(e.target.value, inchesStr);
            }}
            placeholder="0"
            className="w-full rounded-xl border border-brand-navy/15 py-2 px-3 text-xs font-bold text-brand-navy focus:border-brand-orange focus:outline-none bg-white font-medium"
          />
          <span className="absolute right-2.5 top-2 text-[9px] font-bold text-brand-secondary/40">ft</span>
        </div>
        <div className="relative flex-1 min-w-0">
          <input
            type="number"
            min="0"
            max="11"
            value={inchesStr}
            onChange={(e) => {
              setInchesStr(e.target.value);
              handleUpdate(feetStr, e.target.value);
            }}
            placeholder="0"
            className="w-full rounded-xl border border-brand-navy/15 py-2 px-3 text-xs font-bold text-brand-navy focus:border-brand-orange focus:outline-none bg-white font-medium"
          />
          <span className="absolute right-2.5 top-2 text-[9px] font-bold text-brand-secondary/40">in</span>
        </div>
      </div>
    </div>
  );
};

export const ProductCoverageForm: React.FC<ProductCoverageFormProps> = ({
  category,
  coverage,
  errors,
  onChange,
}) => {
  const { products } = useApp();
  const [pricingOption, setPricingOption] = useState<'catalog' | 'manual'>('catalog');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // Filter products matching current category
  const categoryProducts = products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );

  // Capitalize helper
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // Coverage mapper helper
  const getProductCoverageValue = (product: any): number => {
    if (product.category === 'Wallpapers') return 57;
    if (product.category === 'Wall Panels') {
      if (product.unit.toLowerCase() === 'sheet') return 32;
      if (product.unit.toLowerCase() === 'panel') return 10;
      return 32;
    }
    if (product.category === 'Flooring') {
      if (product.unit.toLowerCase() === 'box' || product.id?.includes('wood')) return 18;
      return 1;
    }
    return 1;
  };

  const getPricingModeValue = (unitStr: string): PricingMode => {
    const u = unitStr.toLowerCase();
    if (u.includes('roll')) return 'roll';
    if (u.includes('sheet')) return 'sheet';
    if (u.includes('panel')) return 'panel';
    if (u.includes('box')) return 'box';
    if (u.includes('sq') || u.includes('foot') || u.includes('ft')) return 'sqft';
    if (u.includes('metre') || u.includes('m')) return 'sqm';
    return 'unit';
  };

  const calculateCoverageFromDims = (width: number, height: number, unit: MeasurementUnit): number => {
    const wFt = convertToFeet(width, unit);
    const hFt = convertToFeet(height, unit);
    return Number((wFt * hFt).toFixed(4));
  };

  const updatePanelWidth = (val: number) => {
    const pUnit = coverage.panelUnit || 'Feet';
    const isAuto = coverage.useDimensionCoverage ?? true;
    const newWidth = Math.max(0, val);
    const updates: Partial<ProductCoverageInfo> = { panelWidth: newWidth };
    if (isAuto) {
      const pHeight = coverage.panelHeight || 8;
      const coverageVal = calculateCoverageFromDims(newWidth, pHeight, pUnit);
      updates.coveragePerUnit = coverageVal;
    }
    onChange(updates);
  };

  const updatePanelHeight = (val: number) => {
    const pUnit = coverage.panelUnit || 'Feet';
    const isAuto = coverage.useDimensionCoverage ?? true;
    const newHeight = Math.max(0, val);
    const updates: Partial<ProductCoverageInfo> = { panelHeight: newHeight };
    if (isAuto) {
      const pWidth = coverage.panelWidth || 4;
      const coverageVal = calculateCoverageFromDims(pWidth, newHeight, pUnit);
      updates.coveragePerUnit = coverageVal;
    }
    onChange(updates);
  };

  const updatePanelUnit = (val: MeasurementUnit) => {
    const isAuto = coverage.useDimensionCoverage ?? true;
    const updates: Partial<ProductCoverageInfo> = { panelUnit: val };
    if (isAuto) {
      const pWidth = coverage.panelWidth || 4;
      const pHeight = coverage.panelHeight || 8;
      const coverageVal = calculateCoverageFromDims(pWidth, pHeight, val);
      updates.coveragePerUnit = coverageVal;
    }
    onChange(updates);
  };

  // Sync pricingOption and reset selections if category changes
  useEffect(() => {
    setSelectedProductId('');
    if (categoryProducts.length > 0) {
      setPricingOption('catalog');
    } else {
      setPricingOption('manual');
    }
  }, [category]);

  const parseSize = (sizeStr?: string): { width: number; height: number; unit: MeasurementUnit } => {
    if (!sizeStr) return { width: 4, height: 8, unit: 'Feet' };
    const cleaned = sizeStr.toLowerCase().replace(/[\s×x]+/g, 'x').trim();
    const regex = /^([\d.]+)(ft|in|m|cm|inch|feet|mtr|metre)?x([\d.]+)(ft|in|m|cm|inch|feet|mtr|metre)?/;
    const match = cleaned.match(regex);
    
    if (match) {
      const val1 = parseFloat(match[1]);
      const val2 = parseFloat(match[3]);
      const u1 = match[2];
      const u2 = match[4] || u1 || 'ft';
      
      let unit: MeasurementUnit = 'Feet';
      if (u2.includes('in') || u2.includes('inch')) unit = 'Inches';
      else if (u2.includes('cm')) unit = 'Centimetres';
      else if (u2.includes('m') || u2.includes('mtr')) unit = 'Metres';
      
      const height = Math.max(val1, val2);
      const width = Math.min(val1, val2);
      return { width, height, unit };
    }
    return { width: 4, height: 8, unit: 'Feet' };
  };

  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    if (!prodId) return;

    const prod = categoryProducts.find((p) => p.id === prodId);
    if (!prod) return;

    const formattedUnit = capitalize(prod.unit);
    const coverageVal = getProductCoverageValue(prod);
    const mode = getPricingModeValue(prod.unit);
    const isInstallPerUnit = category === 'Wall Panels';

    const parsed = parseSize(prod.size);

    onChange({
      productName: prod.productName,
      productCode: prod.productCode,
      unit: formattedUnit,
      coveragePerUnit: coverageVal,
      sellingPrice: prod.sellingPrice,
      installationCharge: prod.installationCharge || 0,
      pricingMode: mode,
      isInstallationPerUnit: isInstallPerUnit,
      panelWidth: parsed.width,
      panelHeight: parsed.height,
      panelUnit: parsed.unit,
      panelOrientation: 'Vertical',
      useDimensionCoverage: true,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-navy/10 p-4 sm:p-5 shadow-xs space-y-4" id="calc-product-coverage-form">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-navy/10 pb-3">
        <div>
          <h2 className="font-display text-sm font-bold text-brand-navy flex items-center gap-1.5">
            Step 3: Product & Pricing
          </h2>
          <p className="text-[10px] text-brand-secondary font-light mt-0.5">
            Select a product from our premium catalog or enter your custom pricing rates.
          </p>
        </div>

        {pricingOption === 'catalog' && selectedProductId && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-[9px] font-bold text-brand-orange">
            <Sparkles className="h-3 w-3" /> Catalog Connected
          </span>
        )}
      </div>

      {/* Tabs / Selection Toggle */}
      {categoryProducts.length > 0 && (
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-brand-ivory border border-brand-navy/5">
          <button
            type="button"
            onClick={() => setPricingOption('catalog')}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              pricingOption === 'catalog'
                ? 'bg-white text-brand-navy shadow-xs'
                : 'text-brand-secondary hover:text-brand-navy'
            }`}
          >
            <Folder className="h-3.5 w-3.5" /> Select Catalog Product
          </button>
          <button
            type="button"
            onClick={() => setPricingOption('manual')}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              pricingOption === 'manual'
                ? 'bg-white text-brand-navy shadow-xs'
                : 'text-brand-secondary hover:text-brand-navy'
            }`}
          >
            <Keyboard className="h-3.5 w-3.5" /> Enter Rates Manually
          </button>
        </div>
      )}

      {/* Mode 1: Catalog Selector */}
      {pricingOption === 'catalog' && categoryProducts.length > 0 && (
        <div className="space-y-1 bg-brand-ivory/30 p-3.5 rounded-xl border border-brand-navy/5">
          <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block">
            Choose WallDecor99 Product <span className="text-brand-orange">*</span>
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => handleProductSelect(e.target.value)}
            className="w-full rounded-xl border border-brand-navy/15 py-2.5 px-3.5 text-xs font-semibold text-brand-navy focus:border-brand-orange focus:outline-none bg-white cursor-pointer"
          >
            <option value="">-- Choose Product --</option>
            {categoryProducts.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.productName} ({prod.productCode}) — ₹{prod.sellingPrice}/{prod.unit}
              </option>
            ))}
          </select>
          <span className="text-[9px] text-brand-secondary font-light mt-1 block">
            This will prefill all physical coverages, pricing modes, and labour rate defaults.
          </span>
        </div>
      )}

      {/* Manual & Pre-filled detail inputs */}
      <div className="space-y-4">
        {/* Product specs row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Product Name */}
          <div>
            <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
              Product Name <span className="text-brand-orange">*</span>
            </label>
            <input
              type="text"
              value={coverage.productName || ''}
              onChange={(e) => onChange({ productName: e.target.value })}
              placeholder="e.g. Premium Italian Louver"
              className="w-full rounded-xl border border-brand-navy/15 py-2.5 px-3.5 text-xs font-semibold text-brand-navy focus:border-brand-orange focus:outline-none bg-white font-medium"
            />
          </div>

          {/* Product Code */}
          <div>
            <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
              Product Code / Pattern <span className="text-brand-secondary/60">(Optional)</span>
            </label>
            <input
              type="text"
              value={coverage.productCode || ''}
              onChange={(e) => onChange({ productCode: e.target.value })}
              placeholder="e.g. WD-PV-908"
              className="w-full rounded-xl border border-brand-navy/15 py-2.5 px-3.5 text-xs font-semibold text-brand-navy focus:border-brand-orange focus:outline-none bg-white font-medium"
            />
          </div>
        </div>

        {/* Pricing specs row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Selling Price */}
          <div>
            <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
              Selling Price (₹) <span className="text-brand-orange">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-brand-navy">₹</span>
              <input
                type="number"
                min="0"
                step="any"
                value={coverage.sellingPrice || ''}
                onChange={(e) => onChange({ sellingPrice: parseFloat(e.target.value) || 0 })}
                className={`w-full rounded-xl border py-2.5 pl-7 pr-3.5 text-xs font-bold text-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white ${
                  errors['sellingPrice'] ? 'border-red-500' : 'border-brand-navy/15 focus:border-brand-orange'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors['sellingPrice'] && (
              <span className="text-[9px] text-red-500 mt-0.5 block">{errors['sellingPrice']}</span>
            )}
          </div>

          {/* Price Rate Basis */}
          <div>
            <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
              Price Rate Basis <span className="text-brand-orange">*</span>
            </label>
            <select
              value={coverage.pricingMode}
              onChange={(e) => onChange({ pricingMode: e.target.value as PricingMode })}
              className="w-full rounded-xl border border-brand-navy/15 py-2.5 px-3.5 text-xs font-semibold text-brand-navy focus:border-brand-orange focus:outline-none bg-white cursor-pointer"
            >
              {PRICING_MODES.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Coverage specs row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Coverage Per Unit */}
          <div>
            <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
              Coverage Area per {coverage.unit || 'Unit'} <span className="text-brand-orange">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0.01"
                step="any"
                value={coverage.coveragePerUnit || ''}
                onChange={(e) => onChange({ coveragePerUnit: parseFloat(e.target.value) || 0 })}
                className={`w-full rounded-xl border py-2.5 pl-3.5 pr-14 text-xs font-bold text-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white ${
                  errors['coveragePerUnit'] ? 'border-red-500' : 'border-brand-navy/15 focus:border-brand-orange'
                }`}
                placeholder="e.g. 57"
              />
              <span className="absolute right-3.5 top-2.5 text-[9px] font-bold text-brand-secondary/70">
                sq.ft / {coverage.unit.toLowerCase()}
              </span>
            </div>
            {errors['coveragePerUnit'] ? (
              <span className="text-[9px] text-red-500 mt-0.5 block">{errors['coveragePerUnit']}</span>
            ) : (
              <span className="text-[9px] text-brand-secondary font-light mt-1 block">
                Standard Roll = 57 sq.ft, Panel (8x4) = 32 sq.ft, Blinds/Glass Films = 1 sq.ft.
              </span>
            )}
          </div>

          {/* Unit Designation */}
          <div>
            <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
              Unit Designation
            </label>
            <select
              value={coverage.unit}
              onChange={(e) => onChange({ unit: e.target.value })}
              className="w-full rounded-xl border border-brand-navy/15 py-2.5 px-3.5 text-xs font-semibold text-brand-navy focus:border-brand-orange focus:outline-none bg-white cursor-pointer"
            >
              {SUPPORTED_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Installation row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Installation Charge */}
          <div>
            <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
              Installation Charge (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-brand-navy">₹</span>
              <input
                type="number"
                min="0"
                step="any"
                value={coverage.installationCharge || 0}
                onChange={(e) => onChange({ installationCharge: parseFloat(e.target.value) || 0 })}
                className={`w-full rounded-xl border py-2.5 pl-7 pr-3.5 text-xs font-bold text-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white border-brand-navy/15 focus:border-brand-orange`}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Installation Basis */}
          <div>
            <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
              Installation Charge Basis
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onChange({ isInstallationPerUnit: false })}
                className={`py-2 px-2.5 text-[10px] font-bold rounded-xl border text-center transition-all cursor-pointer ${
                  !coverage.isInstallationPerUnit
                    ? 'border-brand-navy bg-brand-navy text-white shadow-xs'
                    : 'border-brand-navy/10 bg-white text-brand-navy/60 hover:border-brand-navy/30'
                }`}
              >
                Per Sq. Ft
              </button>
              <button
                type="button"
                onClick={() => onChange({ isInstallationPerUnit: true })}
                className={`py-2 px-2.5 text-[10px] font-bold rounded-xl border text-center transition-all cursor-pointer ${
                  coverage.isInstallationPerUnit
                    ? 'border-brand-navy bg-brand-navy text-white shadow-xs'
                    : 'border-brand-navy/10 bg-white text-brand-navy/60 hover:border-brand-navy/30'
                }`}
              >
                Per {coverage.unit || 'Unit'}
              </button>
            </div>
          </div>
        </div>

        {/* Panel Dimensions and Orientation Section (Only for Wall Panels) */}
        {category === 'Wall Panels' && (
          <div className="border-t border-brand-navy/10 pt-4 mt-4 space-y-4" id="panel-dimensions-section">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4.5 w-4.5 text-brand-orange" />
              <h3 className="text-xs font-extrabold text-brand-navy uppercase tracking-wider">
                Panel Coverage Dimensions (for Visualizer)
              </h3>
            </div>

            <div className="bg-brand-ivory/40 p-4 rounded-xl border border-brand-navy/5 space-y-3.5">
              {/* Toggle switch for auto-calculation */}
              <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-xl border border-brand-navy/5">
                <div>
                  <span className="text-[11px] font-extrabold text-brand-navy block">
                    Auto-calculate coverage from panel dimensions
                  </span>
                  <span className="text-[9px] text-brand-secondary block font-light leading-normal">
                    When enabled, the coverage area per panel is calculated as panel width × height.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !(coverage.useDimensionCoverage ?? true);
                    const updates: Partial<ProductCoverageInfo> = { useDimensionCoverage: nextVal };
                    if (nextVal) {
                      const pWidth = coverage.panelWidth || 4;
                      const pHeight = coverage.panelHeight || 8;
                      const pUnit = coverage.panelUnit || 'Feet';
                      updates.coveragePerUnit = calculateCoverageFromDims(pWidth, pHeight, pUnit);
                    }
                    onChange(updates);
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    (coverage.useDimensionCoverage ?? true) ? 'bg-brand-orange' : 'bg-brand-navy/20'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      (coverage.useDimensionCoverage ?? true) ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Grid with Dimensions, Units & Orientation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Unit selection */}
                <div>
                  <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                    Panel Dimension Unit
                  </label>
                  <select
                    value={coverage.panelUnit || 'Feet'}
                    onChange={(e) => updatePanelUnit(e.target.value as MeasurementUnit)}
                    className="w-full rounded-xl border border-brand-navy/15 py-2 px-3 text-xs font-semibold text-brand-navy focus:border-brand-orange focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="Feet">Feet</option>
                    <option value="Inches">Inches</option>
                    <option value="Metres">Metres</option>
                    <option value="Centimetres">Centimetres</option>
                  </select>
                </div>

                {/* Orientation selection */}
                <div>
                  <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                    Installation Orientation
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => onChange({ panelOrientation: 'Vertical' })}
                      className={`py-2 px-2.5 text-[10px] font-bold rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        (coverage.panelOrientation || 'Vertical') === 'Vertical'
                          ? 'border-brand-navy bg-brand-navy text-white shadow-xs'
                          : 'border-brand-navy/10 bg-white text-brand-navy/60 hover:border-brand-navy/30'
                      }`}
                    >
                      <Columns className="h-3 w-3 shrink-0" /> Vertical
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ panelOrientation: 'Horizontal' })}
                      className={`py-2 px-2.5 text-[10px] font-bold rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        (coverage.panelOrientation || 'Vertical') === 'Horizontal'
                          ? 'border-brand-navy bg-brand-navy text-white shadow-xs'
                          : 'border-brand-navy/10 bg-white text-brand-navy/60 hover:border-brand-navy/30'
                      }`}
                    >
                      <span className="rotate-90 block"><Columns className="h-3 w-3 shrink-0" /></span> Horizontal
                    </button>
                  </div>
                </div>
              </div>

              {/* Width and Height input row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* Panel Width */}
                {(coverage.panelUnit || 'Feet') === 'Feet' ? (
                  <PanelFeetInchesInput
                    value={coverage.panelWidth ?? 4}
                    onChange={updatePanelWidth}
                    label="Panel Width"
                  />
                ) : (
                  <div>
                    <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                      Panel Width ({coverage.panelUnit === 'Inches' ? 'in' : coverage.panelUnit === 'Metres' ? 'm' : 'cm'})
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      step="any"
                      value={coverage.panelWidth ?? 4}
                      onChange={(e) => updatePanelWidth(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-brand-navy/15 py-2 px-3 text-xs font-bold text-brand-navy focus:border-brand-orange focus:outline-none bg-white font-medium"
                    />
                  </div>
                )}

                {/* Panel Height */}
                {(coverage.panelUnit || 'Feet') === 'Feet' ? (
                  <PanelFeetInchesInput
                    value={coverage.panelHeight ?? 8}
                    onChange={updatePanelHeight}
                    label="Panel Height"
                  />
                ) : (
                  <div>
                    <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                      Panel Height ({coverage.panelUnit === 'Inches' ? 'in' : coverage.panelUnit === 'Metres' ? 'm' : 'cm'})
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      step="any"
                      value={coverage.panelHeight ?? 8}
                      onChange={(e) => updatePanelHeight(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-brand-navy/15 py-2 px-3 text-xs font-bold text-brand-navy focus:border-brand-orange focus:outline-none bg-white font-medium"
                    />
                  </div>
                )}
              </div>

              {/* Show warning / alert if the values are weird */}
              {((coverage.panelWidth || 0) <= 0 || (coverage.panelHeight || 0) <= 0) && (
                <p className="text-[10px] font-bold text-red-500">
                  ⚠️ Panel dimensions must be greater than zero for the visualizer to function.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
