import React, { useState, useEffect } from 'react';
import { HelpCircle, AlertCircle } from 'lucide-react';
import { ProductCategory } from '../types/calculator';

interface WastageSelectorProps {
  category: ProductCategory;
  wastage: number;
  errors: Record<string, string>;
  onWastageChange: (wastage: number) => void;
}

const RECOMMENDATIONS: Record<ProductCategory, { pct: number; reason: string }> = {
  Wallpapers: {
    pct: 10,
    reason: 'Allows room for wallpaper pattern matching, roll alignments, and minor cutting errors at corners.',
  },
  'Wall Panels': {
    pct: 10,
    reason: 'Covers trimming wastage when splitting sheets/panels, and matching vertical woodgrains or UV patterns.',
  },
  'Glass Films': {
    pct: 5,
    reason: 'Allows minor trimming allowance along window glass frames and seals.',
  },
  Blinds: {
    pct: 0,
    reason: 'Blinds are tailored custom to exact dimensions, so no wastage buffer is needed.',
  },
  Flooring: {
    pct: 10,
    reason: 'Recommended for herringbone, staggered plank joint cuts, corner trimming, and wall expansions.',
  },
};

export const WastageSelector: React.FC<WastageSelectorProps> = ({
  category,
  wastage,
  errors,
  onWastageChange,
}) => {
  const [customActive, setCustomActive] = useState(false);
  const [customVal, setCustomVal] = useState<number | ''>('');

  const recommendation = RECOMMENDATIONS[category] || { pct: 10, reason: 'Recommended allowance for trimming and corners.' };

  // Set default when category switches
  useEffect(() => {
    const isStandard = [0, 5, 10, 15].includes(wastage);
    if (isStandard) {
      setCustomActive(false);
    } else {
      setCustomActive(true);
      setCustomVal(wastage);
    }
  }, [category, wastage]);

  const handleStandardClick = (option: number) => {
    setCustomActive(false);
    onWastageChange(option);
  };

  const handleCustomClick = () => {
    setCustomActive(true);
    const val = customVal !== '' ? customVal : recommendation.pct;
    setCustomVal(val);
    onWastageChange(val);
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (isNaN(parsed)) {
      setCustomVal('');
    } else {
      setCustomVal(parsed);
      onWastageChange(parsed);
    }
  };

  const isOptionActive = (option: number) => {
    return !customActive && wastage === option;
  };

  const errorWastage = errors['wastage'];

  return (
    <div className="bg-white rounded-2xl border border-brand-navy/10 p-5 sm:p-6 shadow-xs space-y-4" id="calc-wastage-selector">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-sm font-bold text-brand-navy flex items-center gap-1.5">
            Step 4: Wastage & Trimming Allowance
          </h2>
          <p className="text-[10px] text-brand-secondary font-light mt-0.5">
            Adding wastage ensures you do not run short of materials midway.
          </p>
        </div>
      </div>

      {/* Button Row */}
      <div className="flex flex-wrap gap-2">
        {[0, 5, 10, 15].map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => handleStandardClick(val)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              isOptionActive(val)
                ? 'border-brand-navy bg-brand-navy text-white shadow-xs'
                : 'border-brand-navy/10 bg-white text-brand-navy/70 hover:border-brand-navy/30'
            }`}
          >
            {val}% {recommendation.pct === val ? ' (Rec.)' : ''}
          </button>
        ))}

        <button
          type="button"
          onClick={handleCustomClick}
          className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
            customActive
              ? 'border-brand-navy bg-brand-navy text-white shadow-xs'
              : 'border-brand-navy/10 bg-white text-brand-navy/70 hover:border-brand-navy/30'
          }`}
        >
          Custom %
        </button>

        {/* Custom Input */}
        {customActive && (
          <div className="relative inline-flex items-center w-28 animate-fade-in">
            <input
              type="number"
              min="0"
              max="50"
              step="any"
              value={customVal === '' ? '' : customVal}
              onChange={handleCustomInputChange}
              className={`w-full rounded-xl border py-2 pl-3.5 pr-8 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white ${
                errorWastage ? 'border-red-500 focus:ring-red-500' : 'border-brand-navy/15 focus:border-brand-orange'
              }`}
              placeholder="10"
            />
            <span className="absolute right-3.5 text-xs font-bold text-brand-navy">%</span>
          </div>
        )}
      </div>

      {errorWastage && <span className="text-xs text-red-500 mt-1 block">{errorWastage}</span>}

      {/* Wastage Recommendation Card */}
      <div className="p-4 bg-brand-ivory rounded-xl border border-brand-navy/5 flex gap-3 items-start text-xs text-brand-navy/90 leading-relaxed">
        <HelpCircle className="h-5 w-5 text-brand-orange shrink-0 mt-0.5 stroke-[1.8]" />
        <div className="space-y-1">
          <p className="font-semibold text-[11px] text-brand-navy uppercase tracking-wider">
            Why add wastage? (WallDecor99 recommendation: {recommendation.pct}%)
          </p>
          <p className="text-brand-secondary text-[11px] font-sans leading-normal">
            {recommendation.reason} {category === 'Wallpapers' && 'Pattern matching and wall condition may affect final roll requirement.'}
          </p>
        </div>
      </div>
    </div>
  );
};
