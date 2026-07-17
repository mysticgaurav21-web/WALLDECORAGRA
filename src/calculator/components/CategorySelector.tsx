import React from 'react';
import { Layers, Box, Shield, Menu, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { ProductCategory } from '../types/calculator';

interface CategorySelectorProps {
  selected: ProductCategory;
  onChange: (category: ProductCategory) => void;
}

const CATEGORIES: { name: ProductCategory; icon: React.FC<any>; description: string }[] = [
  {
    name: 'Wallpapers',
    icon: Layers,
    description: 'Designer murals & textured wallpapers',
  },
  {
    name: 'Wall Panels',
    icon: LayoutGrid,
    description: 'WPC Louvers, PVC & UV stone panels',
  },
  {
    name: 'Glass Films',
    icon: Shield,
    description: 'Frosted privacy & solar films',
  },
  {
    name: 'Blinds',
    icon: Menu,
    description: 'Custom roller, zebra & wooden blinds',
  },
  {
    name: 'Flooring',
    icon: Box,
    description: 'Laminate, SPC & wooden flooring',
  },
];

export const CategorySelector: React.FC<CategorySelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="space-y-2.5" id="calc-category-selector">
      <label className="text-[11px] font-bold text-brand-navy uppercase tracking-wider block">
        Step 1: Select Product Category <span className="text-brand-orange">*</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selected === cat.name;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => onChange(cat.name)}
              className={`flex flex-col items-center justify-center p-2.5 sm:p-3 text-center rounded-xl border-2 transition-all duration-200 relative group cursor-pointer h-full min-h-[105px] sm:min-h-[115px] last:col-span-2 last:sm:col-span-1 ${
                isSelected
                  ? 'border-brand-orange bg-orange-50/40 shadow-xs scale-[1.01]'
                  : 'border-brand-navy/10 hover:border-brand-navy/20 bg-white hover:shadow-xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-orange fill-white" />
                  <span className="text-[8px] font-black text-brand-orange uppercase tracking-wider bg-white px-1.5 py-0.5 rounded border border-brand-orange/20 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                    Selected
                  </span>
                </div>
              )}
              <div
                className={`p-2 rounded-lg mb-1.5 transition-colors duration-200 ${
                  isSelected ? 'bg-brand-orange text-white' : 'bg-brand-ivory text-brand-navy group-hover:text-brand-orange'
                }`}
              >
                <Icon className="h-4.5 w-4.5 stroke-[2]" />
              </div>
              <span className={`text-[11px] sm:text-xs font-bold font-display ${isSelected ? 'text-brand-navy' : 'text-brand-navy/90'}`}>
                {cat.name}
              </span>
              <span className="text-[9px] text-brand-secondary mt-0.5 line-clamp-1 max-w-[130px] leading-snug font-sans">
                {cat.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
