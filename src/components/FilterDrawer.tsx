/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subcategories: string[];
  materials: string[];
  colours: string[];
  finishes: string[];
  sizes: string[];
  thicknesses: string[];
  
  selectedSubcategory: string | null;
  setSelectedSubcategory: (val: string | null) => void;
  selectedMaterial: string | null;
  setSelectedMaterial: (val: string | null) => void;
  selectedColour: string | null;
  setSelectedColour: (val: string | null) => void;
  selectedFinish: string | null;
  setSelectedFinish: (val: string | null) => void;
  selectedSize: string | null;
  setSelectedSize: (val: string | null) => void;
  selectedThickness: string | null;
  setSelectedThickness: (val: string | null) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  
  onReset: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  subcategories,
  materials,
  colours,
  finishes,
  sizes,
  thicknesses,
  
  selectedSubcategory,
  setSelectedSubcategory,
  selectedMaterial,
  setSelectedMaterial,
  selectedColour,
  setSelectedColour,
  selectedFinish,
  setSelectedFinish,
  selectedSize,
  setSelectedSize,
  selectedThickness,
  setSelectedThickness,
  maxPrice,
  setMaxPrice,
  inStockOnly,
  setInStockOnly,
  onReset,
}) => {
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setLocalMaxPrice(val);
  };

  const handleApply = () => {
    setMaxPrice(localMaxPrice);
    onClose();
  };

  const handleReset = () => {
    onReset();
    setLocalMaxPrice(5000);
    onClose();
  };

  const sectionClass = "py-4.5 border-b border-brand-navy/10";
  const titleClass = "text-xs font-bold text-brand-navy uppercase tracking-wider mb-3 flex items-center justify-between";

  const renderFilterList = (
    items: string[],
    selected: string | null,
    setSelected: (val: string | null) => void
  ) => {
    return (
      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
        <button
          onClick={() => setSelected(null)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${
            selected === null
              ? 'bg-brand-orange border-brand-orange text-white'
              : 'bg-white border-brand-navy/10 text-brand-text hover:bg-brand-ivory'
          }`}
        >
          All
        </button>
        {items.map((item) => (
          <button
            key={item}
            onClick={() => setSelected(item === selected ? null : item)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all border flex items-center gap-1 ${
              selected === item
                ? 'bg-brand-navy border-brand-navy text-white'
                : 'bg-white border-brand-navy/10 text-brand-text hover:bg-brand-ivory'
            }`}
          >
            {item}
            {selected === item && <Check className="h-3 w-3" />}
          </button>
        ))}
      </div>
    );
  };

  const drawerContent = (
    <div className="flex flex-col h-full bg-white text-brand-text">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-brand-navy/10">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-brand-orange" />
          <h2 className="font-display text-lg font-bold text-brand-navy">Product Filters</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-brand-navy hover:text-brand-orange rounded-full hover:bg-brand-ivory md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Filter Options Area */}
      <div className="flex-1 overflow-y-auto px-5 py-2 space-y-1">
        {/* Subcategory */}
        {subcategories.length > 0 && (
          <div className={sectionClass}>
            <span className={titleClass}>Subcategory</span>
            {renderFilterList(subcategories, selectedSubcategory, setSelectedSubcategory)}
          </div>
        )}

        {/* Price Range */}
        <div className={sectionClass}>
          <span className={titleClass}>
            <span>Max Price</span>
            <span className="text-brand-orange font-bold font-mono">₹{localMaxPrice}</span>
          </span>
          <div className="px-1 py-2">
            <input
              type="range"
              min="0"
              max="5000"
              step="50"
              value={localMaxPrice}
              onChange={handlePriceChange}
              className="w-full accent-brand-orange"
            />
            <div className="flex justify-between text-[10px] text-brand-secondary font-semibold font-mono mt-1">
              <span>₹0</span>
              <span>₹2,500</span>
              <span>₹5,000+</span>
            </div>
          </div>
        </div>

        {/* Materials */}
        {materials.length > 0 && (
          <div className={sectionClass}>
            <span className={titleClass}>Material</span>
            {renderFilterList(materials, selectedMaterial, setSelectedMaterial)}
          </div>
        )}

        {/* Finish */}
        {finishes.length > 0 && (
          <div className={sectionClass}>
            <span className={titleClass}>Finish</span>
            {renderFilterList(finishes, selectedFinish, setSelectedFinish)}
          </div>
        )}

        {/* Colours */}
        {colours.length > 0 && (
          <div className={sectionClass}>
            <span className={titleClass}>Colour Palette</span>
            {renderFilterList(colours, selectedColour, setSelectedColour)}
          </div>
        )}

        {/* Size */}
        {sizes.length > 0 && (
          <div className={sectionClass}>
            <span className={titleClass}>Dimensions</span>
            {renderFilterList(sizes, selectedSize, setSelectedSize)}
          </div>
        )}

        {/* Thickness */}
        {thicknesses.length > 0 && (
          <div className={sectionClass}>
            <span className={titleClass}>Thickness</span>
            {renderFilterList(thicknesses, selectedThickness, setSelectedThickness)}
          </div>
        )}

        {/* Stock status toggle */}
        <div className="py-6 flex items-center justify-between">
          <span className="text-sm font-semibold text-brand-navy">In-stock products only</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange"></div>
          </label>
        </div>
      </div>

      {/* Drawer Action Bar */}
      <div className="p-4 bg-brand-ivory border-t border-brand-navy/10 flex items-center gap-3">
        <button
          onClick={handleReset}
          className="flex-1 py-3 text-sm font-semibold rounded-xl border border-brand-navy/10 text-brand-navy hover:bg-white transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="flex-1 py-3 text-sm font-semibold rounded-xl bg-brand-navy hover:bg-opacity-90 text-white transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Left-Side Sticky Filters */}
      <div className="hidden lg:block w-72 shrink-0 h-fit bg-white border border-brand-navy/10 rounded-2xl overflow-hidden shadow-xs">
        {drawerContent}
      </div>

      {/* Mobile Full Screen Filter Overlay Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
          {/* Content panel */}
          <div className="relative ml-auto flex h-full w-full max-w-md flex-col shadow-2xl animate-slide-in">
            {drawerContent}
          </div>
        </div>
      )}
    </>
  );
};
