import React from 'react';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import { DeductionRow, MeasurementUnit, ProductCategory } from '../types/calculator';
import { convertToFeet } from '../utils/unitConversions';

interface DeductionFormProps {
  category: ProductCategory;
  unit: MeasurementUnit;
  deductions: DeductionRow[];
  errors: Record<string, string>;
  onAddDeduction: (label?: string, width?: number, height?: number) => void;
  onRemoveDeduction: (id: string) => void;
  onUpdateDeduction: (id: string, field: 'width' | 'height', value: number) => void;
  onUpdateDeductionLabel: (id: string, label: string) => void;
}

// Custom feet/inches input for deduction rows
const FeetInchesInput: React.FC<{
  value: number; // decimal feet value
  onChange: (val: number) => void;
  className?: string;
}> = ({ value, onChange, className }) => {
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
      <div className="relative flex-grow min-w-0">
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
      <div className="relative flex-grow min-w-0">
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

export const DeductionForm: React.FC<DeductionFormProps> = ({
  category,
  unit,
  deductions,
  errors,
  onAddDeduction,
  onRemoveDeduction,
  onUpdateDeduction,
  onUpdateDeductionLabel,
}) => {
  // Deductions are only relevant for Wallpapers and Wall Panels
  if (category !== 'Wallpapers' && category !== 'Wall Panels') {
    return null;
  }

  const errorTotal = errors['deductionsTotal'];

  const handleQuickAdd = (type: 'door' | 'window' | 'other') => {
    let label = 'Door';
    let w = 3;
    let h = 7;

    if (type === 'door') {
      label = 'Door';
      if (unit === 'Feet') { w = 3; h = 7; }
      else if (unit === 'Inches') { w = 36; h = 84; }
      else if (unit === 'Metres') { w = 0.9; h = 2.1; }
      else if (unit === 'Centimetres') { w = 90; h = 210; }
    } else if (type === 'window') {
      label = 'Window';
      if (unit === 'Feet') { w = 4; h = 4; }
      else if (unit === 'Inches') { w = 48; h = 48; }
      else if (unit === 'Metres') { w = 1.2; h = 1.2; }
      else if (unit === 'Centimetres') { w = 120; h = 120; }
    } else {
      label = 'Opening';
      if (unit === 'Feet') { w = 3; h = 3; }
      else if (unit === 'Inches') { w = 36; h = 36; }
      else if (unit === 'Metres') { w = 1.0; h = 1.0; }
      else if (unit === 'Centimetres') { w = 100; h = 100; }
    }

    onAddDeduction(label, w, h);
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-navy/10 p-4 sm:p-5 shadow-xs space-y-4" id="calc-deduction-form">
      <div>
        <h2 className="font-display text-sm font-bold text-brand-navy flex items-center gap-1.5">
          Step 3: Deduct Openings (Optional)
        </h2>
        <p className="text-[10px] text-brand-secondary font-light mt-0.5">
          Deduct doors, windows, or empty wall sections to buy only what is necessary.
        </p>
      </div>

      {errorTotal && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
          {errorTotal}
        </div>
      )}

      {/* Quick Add Buttons Row */}
      <div className="flex flex-wrap gap-1.5 pt-0.5">
        <button
          type="button"
          onClick={() => handleQuickAdd('door')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-brand-navy/10 hover:border-brand-orange hover:text-brand-orange bg-brand-ivory/40 text-[11px] font-bold text-brand-navy transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Door {unit === 'Feet' ? '(3x7 ft)' : ''}
        </button>
        <button
          type="button"
          onClick={() => handleQuickAdd('window')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-brand-navy/10 hover:border-brand-orange hover:text-brand-orange bg-brand-ivory/40 text-[11px] font-bold text-brand-navy transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Window {unit === 'Feet' ? '(4x4 ft)' : ''}
        </button>
        <button
          type="button"
          onClick={() => handleQuickAdd('other')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-brand-navy/10 hover:border-brand-orange hover:text-brand-orange bg-brand-ivory/40 text-[11px] font-bold text-brand-navy transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Other Opening
        </button>
      </div>

      {deductions.length > 0 && (
        <div className="space-y-3 pt-2">
          {/* Header Row for Desktop */}
          <div className="hidden sm:grid sm:grid-cols-12 gap-3 pb-1 text-[9px] font-bold text-brand-navy uppercase tracking-wider border-b border-brand-navy/5">
            <div className="col-span-3">Deduction Label</div>
            <div className="col-span-3">Width {unit === 'Feet' ? '(ft/in)' : `(${unit})`}</div>
            <div className="col-span-3">Height {unit === 'Feet' ? '(ft/in)' : `(${unit})`}</div>
            <div className="col-span-3 text-right">Deducted Area</div>
          </div>

          <div className="space-y-3">
            {deductions.map((ded) => {
              const dedWidthFeet = convertToFeet(ded.width, unit);
              const dedHeightFeet = convertToFeet(ded.height, unit);
              const dedAreaSqFt = dedWidthFeet * dedHeightFeet;

              const errorWidth = errors[`ded-width-${ded.id}`];
              const errorHeight = errors[`ded-height-${ded.id}`];

              return (
                <div
                  key={ded.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center p-3 sm:p-0 rounded-xl sm:rounded-none bg-brand-ivory/20 sm:bg-transparent border sm:border-0 border-brand-navy/5 relative"
                >
                  {/* Deduction Label input */}
                  <div className="col-span-1 sm:col-span-3">
                    <span className="sm:hidden text-[9px] font-bold text-brand-navy uppercase tracking-wider block mb-0.5">
                      Deduction Label
                    </span>
                    <input
                      type="text"
                      value={ded.label || ''}
                      onChange={(e) => onUpdateDeductionLabel(ded.id, e.target.value)}
                      placeholder="e.g. Door or Window"
                      className="w-full rounded-xl border border-brand-navy/15 py-2 px-3 text-xs text-brand-text focus:border-brand-orange focus:outline-none bg-white font-medium"
                    />
                  </div>

                  {/* Width dimension input */}
                  <div className="col-span-1 sm:col-span-3">
                    <span className="sm:hidden text-[9px] font-bold text-brand-navy uppercase tracking-wider block mb-0.5">
                      Width {unit === 'Feet' ? '(ft/in)' : `(${unit})`}
                    </span>
                    {unit === 'Feet' ? (
                      <FeetInchesInput
                        value={ded.width}
                        onChange={(val) => onUpdateDeduction(ded.id, 'width', val)}
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
                          value={ded.width || ''}
                          onChange={(e) => onUpdateDeduction(ded.id, 'width', parseFloat(e.target.value) || 0)}
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

                  {/* Height dimension input */}
                  <div className="col-span-1 sm:col-span-3">
                    <span className="sm:hidden text-[9px] font-bold text-brand-navy uppercase tracking-wider block mb-0.5">
                      Height {unit === 'Feet' ? '(ft/in)' : `(${unit})`}
                    </span>
                    {unit === 'Feet' ? (
                      <FeetInchesInput
                        value={ded.height}
                        onChange={(val) => onUpdateDeduction(ded.id, 'height', val)}
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
                          value={ded.height || ''}
                          onChange={(e) => onUpdateDeduction(ded.id, 'height', parseFloat(e.target.value) || 0)}
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

                  {/* Individual Deduction Area Displays */}
                  <div className="col-span-1 sm:col-span-3 flex items-center justify-between sm:justify-end gap-2.5">
                    <span className="sm:hidden text-[9px] font-bold text-brand-navy uppercase tracking-wider">
                      Deducted Area
                    </span>
                    <div className="text-right pr-1">
                      <span className="text-xs font-bold text-red-500 font-mono">
                        -{dedAreaSqFt.toFixed(1)} <span className="text-[9px] font-normal text-brand-secondary font-sans">sq ft</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveDeduction(ded.id)}
                      className="p-1.5 text-brand-secondary hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove deduction"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
