/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortDropdownProps {
  currentSort: string;
  onSortChange: (val: string) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ currentSort, onSortChange }) => {
  const options = [
    { value: 'featured', label: 'Featured Products' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline text-xs font-semibold text-brand-secondary">Sort by:</span>
      <div className="relative flex items-center">
        <div className="absolute left-3 text-brand-navy/60 pointer-events-none">
          <ArrowUpDown className="h-4 w-4" />
        </div>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none rounded-xl border border-brand-navy/10 bg-white py-2.5 pl-9 pr-8 text-xs sm:text-sm font-semibold text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange shadow-xs cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom Chevron icon styling for premium selects */}
        <div className="absolute right-3 pointer-events-none text-brand-secondary text-[10px]">▼</div>
      </div>
    </div>
  );
};
