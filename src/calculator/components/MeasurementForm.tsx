import React from 'react';
import { Plus, Trash2, HelpCircle, Copy, ChevronsDown } from 'lucide-react';
import {
  ProductCategory,
  MeasurementType,
  MeasurementUnit,
  MeasurementRow,
} from '../types/calculator';
import { convertToFeet } from '../utils/unitConversions';

interface MeasurementFormProps {
  category: ProductCategory;
  measurementType: MeasurementType;
  unit: MeasurementUnit;
  rows: MeasurementRow[];
  errors: Record<string, string>;
  onTypeChange: (type: MeasurementType) => void;
  onUnitChange: (unit: MeasurementUnit) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onUpdateRow: (id: string, field: 'width' | 'height' | 'quantity', value: number) => void;
  onUpdateRowLabel: (id: string, label: string) => void;
  onDuplicateRow?: (id: string) => void;
  onSameSizeAsPrevious?: (id: string) => void;
}

const TYPE_OPTIONS: Record<ProductCategory, MeasurementType[]> = {
  Wallpapers: ['Single Wall', 'Multiple Walls', 'Custom Area'],
  'Wall Panels': ['Single Wall', 'Multiple Walls', 'Custom Area'],
  'Glass Films': ['Single Glass', 'Multiple Glass Sections', 'Door Glass', 'Custom Area'],
  Blinds: ['Single Window', 'Multiple Windows'],
  Flooring: ['Single Room', 'Multiple Rooms', 'Stair or Passage', 'Custom Area'],
};

const UNITS: MeasurementUnit[] = ['Feet', 'Inches', 'Metres', 'Centimetres'];

// Custom input for separate feet & inches
const FeetInchesInput: React.FC<{
  value: number; // decimal feet value
  onChange: (val: number) => void;
  className?: string;
  placeholder?: string;
}> = ({ value, onChange, className, placeholder }) => {
  const [feetStr, setFeetStr] = React.useState<string>('');
  const [inchesStr, setInchesStr] = React.useState<string>('');

  React.useEffect(() => {
    if (value === 0) {
      setFeetStr('');
      setInchesStr('');
    } else {
      const feet = Math.floor(value);
      const inches = Math.round((value - feet) * 12);
      setFeetStr(feet > 0 ? feet.toString() : '0');
      setInchesStr(inches > 0 ? inches.toString() : '0');
    }
  }, [value]);

  const updateParent = (fStr: string, iStr: string) => {
    const feet = parseInt(fStr) || 0;
    const inches = parseInt(iStr) || 0;
    onChange(feet + inches / 12);
  };

  return (
    <div className="flex gap-1 items-center w-full">
      <div className="relative flex-1 min-w-0">
        <input
          type="number"
          min="0"
          value={feetStr}
          onChange={(e) => {
            setFeetStr(e.target.value);
            updateParent(e.target.value, inchesStr);
          }}
          className={className}
          placeholder="0"
        />
        <span className="absolute right-2 top-2.5 text-[9px] font-bold text-brand-secondary/40">ft</span>
      </div>
      <div className="relative flex-1 min-w-0">
        <input
          type="number"
          min="0"
          max="11"
          value={inchesStr}
          onChange={(e) => {
            setInchesStr(e.target.value);
            updateParent(feetStr, e.target.value);
          }}
          className={className}
          placeholder="0"
        />
        <span className="absolute right-2 top-2.5 text-[9px] font-bold text-brand-secondary/40">in</span>
      </div>
    </div>
  );
};

export const MeasurementForm: React.FC<MeasurementFormProps> = ({
  category,
  measurementType,
  unit,
  rows,
  errors,
  onTypeChange,
  onUnitChange,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
  onUpdateRowLabel,
  onDuplicateRow,
  onSameSizeAsPrevious,
}) => {
  const allowedTypes = TYPE_OPTIONS[category] || ['Single Wall', 'Custom Area'];

  // Automatically adjust measurement type if it's not allowed in this category
  React.useEffect(() => {
    if (!allowedTypes.includes(measurementType)) {
      onTypeChange(allowedTypes[0]);
    }
  }, [category, allowedTypes, measurementType, onTypeChange]);

  const getWidthLabel = () => {
    if (category === 'Wallpapers' || category === 'Wall Panels') return 'Wall Width';
    if (category === 'Glass Films') return 'Glass Width';
    if (category === 'Blinds') return 'Window Width';
    if (category === 'Flooring') return 'Room Length';
    return 'Width';
  };

  const getHeightLabel = () => {
    if (category === 'Wallpapers' || category === 'Wall Panels') return 'Wall Height';
    if (category === 'Glass Films') return 'Glass Height';
    if (category === 'Blinds') return 'Window Height';
    if (category === 'Flooring') return 'Room Breadth';
    return 'Height';
  };

  const getRowPlaceholderLabel = (index: number) => {
    if (category === 'Wallpapers' || category === 'Wall Panels') return `Wall ${index + 1}`;
    if (category === 'Flooring') return `Room ${index + 1}`;
    if (category === 'Blinds') return `Window ${index + 1}`;
    if (category === 'Glass Films') return `Glass Panel ${index + 1}`;
    return `Area ${index + 1}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-navy/10 p-4 sm:p-5 shadow-xs space-y-4" id="calc-measurement-form">
      {/* Header and Unit Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-navy/10 pb-3">
        <div>
          <h2 className="font-display text-sm font-bold text-brand-navy flex items-center gap-1.5">
            Step 2: Area Measurements
          </h2>
          <p className="text-[10px] text-brand-secondary font-light mt-0.5">
            Specify dimensions of your area in your preferred units.
          </p>
        </div>

        {/* Measurement Unit Selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[10px] font-bold text-brand-navy uppercase tracking-wider">Unit:</span>
          <div className="inline-flex rounded-lg border border-brand-navy/10 p-0.5 bg-brand-ivory">
            {UNITS.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => onUnitChange(u)}
                className={`px-2 py-0.5 text-[9px] sm:text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  unit === u
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'text-brand-navy/65 hover:text-brand-orange'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Measurement Setup */}
      <div className="space-y-1">
        <label className="text-[9px] font-bold text-brand-navy uppercase tracking-wider block">
          Measurement Setup
        </label>
        <div className="flex flex-wrap gap-1.5">
          {allowedTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onTypeChange(type)}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded-xl border transition-all cursor-pointer ${
                measurementType === type
                  ? 'border-brand-navy bg-brand-navy text-white shadow-xs'
                  : 'border-brand-navy/10 bg-white text-brand-navy/70 hover:border-brand-navy/30'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Measurement Rows List */}
      <div className="space-y-3 pt-1">
        {/* Table Header for Desktop */}
        <div className="hidden sm:grid sm:grid-cols-12 gap-3 pb-1 text-[9px] font-bold text-brand-navy uppercase tracking-wider border-b border-brand-navy/5">
          <div className="col-span-3">Label (Optional)</div>
          <div className="col-span-3">{getWidthLabel()} {unit === 'Feet' ? '(ft/in)' : `(${unit})`}</div>
          <div className="col-span-3">{getHeightLabel()} {unit === 'Feet' ? '(ft/in)' : `(${unit})`}</div>
          {category === 'Blinds' && <div className="col-span-1.5 text-center">Qty</div>}
          <div className={`${category === 'Blinds' ? 'col-span-1.5' : 'col-span-3'} text-right`}>Area (sq.ft)</div>
        </div>

        <div className="space-y-3">
          {rows.map((row, idx) => {
            const rowWidthFeet = convertToFeet(row.width, unit);
            const rowHeightFeet = convertToFeet(row.height, unit);
            const rowQty = row.quantity || 1;
            const rowAreaSqFt = rowWidthFeet * rowHeightFeet * rowQty;

            const errorWidth = errors[`row-width-${row.id}`];
            const errorHeight = errors[`row-height-${row.id}`];

            return (
              <div
                key={row.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center p-3 sm:p-0 rounded-xl sm:rounded-none bg-brand-ivory/40 sm:bg-transparent border sm:border-0 border-brand-navy/5 relative"
              >
                {/* Optional Area Label */}
                <div className="col-span-1 sm:col-span-3">
                  <span className="sm:hidden text-[9px] font-bold text-brand-navy uppercase tracking-wider block mb-0.5">
                    Label
                  </span>
                  <input
                    type="text"
                    value={row.label || ''}
                    onChange={(e) => onUpdateRowLabel(row.id, e.target.value)}
                    placeholder={getRowPlaceholderLabel(idx)}
                    className="w-full rounded-xl border border-brand-navy/15 py-2 px-3 text-xs text-brand-text focus:border-brand-orange focus:outline-none bg-white font-medium"
                  />
                </div>

                {/* Width dimension input */}
                <div className="col-span-1 sm:col-span-3">
                  <span className="sm:hidden text-[9px] font-bold text-brand-navy uppercase tracking-wider block mb-0.5">
                    {getWidthLabel()} {unit === 'Feet' ? '(ft / in)' : `(${unit})`}
                  </span>
                  {unit === 'Feet' ? (
                    <FeetInchesInput
                      value={row.width}
                      onChange={(val) => onUpdateRow(row.id, 'width', val)}
                      className={`w-full rounded-xl border py-2 px-2.5 text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white ${
                        errorWidth ? 'border-red-500' : 'border-brand-navy/15'
                      }`}
                    />
                  ) : (
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        min="0.01"
                        value={row.width || ''}
                        onChange={(e) => onUpdateRow(row.id, 'width', parseFloat(e.target.value) || 0)}
                        className={`w-full rounded-xl border py-2 pl-3 pr-8 text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white ${
                          errorWidth ? 'border-red-500' : 'border-brand-navy/15'
                        }`}
                        placeholder="0.0"
                      />
                      <span className="absolute right-3 top-2 text-[9px] font-bold text-brand-secondary/60">
                        {unit.substring(0, 2).toLowerCase()}
                      </span>
                    </div>
                  )}
                  {errorWidth && <span className="text-[9px] text-red-500 mt-0.5 block">{errorWidth}</span>}
                </div>

                {/* Height / Length dimension input */}
                <div className="col-span-1 sm:col-span-3">
                  <span className="sm:hidden text-[9px] font-bold text-brand-navy uppercase tracking-wider block mb-0.5">
                    {getHeightLabel()} {unit === 'Feet' ? '(ft / in)' : `(${unit})`}
                  </span>
                  {unit === 'Feet' ? (
                    <FeetInchesInput
                      value={row.height}
                      onChange={(val) => onUpdateRow(row.id, 'height', val)}
                      className={`w-full rounded-xl border py-2 px-2.5 text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white ${
                        errorHeight ? 'border-red-500' : 'border-brand-navy/15'
                      }`}
                    />
                  ) : (
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        min="0.01"
                        value={row.height || ''}
                        onChange={(e) => onUpdateRow(row.id, 'height', parseFloat(e.target.value) || 0)}
                        className={`w-full rounded-xl border py-2 pl-3 pr-8 text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white ${
                          errorHeight ? 'border-red-500' : 'border-brand-navy/15'
                        }`}
                        placeholder="0.0"
                      />
                      <span className="absolute right-3 top-2 text-[9px] font-bold text-brand-secondary/60">
                        {unit.substring(0, 2).toLowerCase()}
                      </span>
                    </div>
                  )}
                  {errorHeight && <span className="text-[9px] text-red-500 mt-0.5 block">{errorHeight}</span>}
                </div>

                {/* Optional quantity input (Windows) for Blinds */}
                {category === 'Blinds' && (
                  <div className="col-span-1 sm:col-span-1.5">
                    <span className="sm:hidden text-[9px] font-bold text-brand-navy uppercase tracking-wider block mb-0.5">
                      Number of Windows
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={row.quantity || 1}
                      onChange={(e) => onUpdateRow(row.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full rounded-xl border border-brand-navy/15 py-2 px-3 text-xs font-semibold text-brand-navy focus:border-brand-orange focus:outline-none bg-white text-center"
                    />
                  </div>
                )}

                {/* Row calculated Area Display & Action */}
                <div className={`${category === 'Blinds' ? 'sm:col-span-1.5' : 'sm:col-span-3'} col-span-1 flex flex-wrap items-center justify-between sm:justify-end gap-2`}>
                  <div className="sm:hidden text-[9px] font-bold text-brand-navy uppercase tracking-wider">
                    Calculated Area
                  </div>
                  <div className="text-right pr-1">
                    <span className="text-xs font-bold text-brand-navy font-mono">
                      {rowAreaSqFt.toFixed(1)} <span className="text-[9px] font-normal text-brand-secondary font-sans">sq ft</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Same Size as Previous */}
                    {idx > 0 && onSameSizeAsPrevious && (
                      <button
                        type="button"
                        onClick={() => onSameSizeAsPrevious(row.id)}
                        className="p-1.5 text-brand-orange hover:text-brand-orange/90 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
                        title="Same size as previous"
                      >
                        <ChevronsDown className="h-4 w-4" />
                      </button>
                    )}

                    {/* Duplicate Row */}
                    {onDuplicateRow && (
                      <button
                        type="button"
                        onClick={() => onDuplicateRow(row.id)}
                        className="p-1.5 text-brand-navy/60 hover:text-brand-navy rounded-lg hover:bg-brand-navy/5 transition-colors cursor-pointer"
                        title="Duplicate this area row"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {/* Remove Button */}
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemoveRow(row.id)}
                        className="p-1.5 text-brand-secondary hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete area row"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Another Area button */}
      {(measurementType.includes('Multiple') || measurementType.includes('rooms') || measurementType.includes('sections') || measurementType.includes('windows')) && (
        <div className="pt-1">
          <button
            type="button"
            onClick={onAddRow}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-dashed border-brand-orange/40 hover:border-brand-orange bg-brand-orange/[0.01] hover:bg-brand-orange/[0.03] text-[11px] font-bold text-brand-orange transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Another {category === 'Flooring' ? 'Room' : category === 'Blinds' ? 'Window' : 'Wall'}
          </button>
        </div>
      )}
    </div>
  );
};
