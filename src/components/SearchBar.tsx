/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  initialValue?: string;
  onSearch?: (value: string) => void;
  standalone?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = '',
  onSearch,
  standalone = false,
}) => {
  const [value, setValue] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = value.trim();
    if (onSearch) {
      onSearch(query);
    } else if (standalone) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-brand-navy/60">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search wallpapers, UV sheets, blinds, charcoal panels..."
          className="w-full rounded-xl border border-brand-navy/15 bg-white py-4.5 pl-12 pr-10 text-sm text-brand-text placeholder-brand-secondary/70 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange shadow-sm transition-all"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue('');
              if (onSearch) onSearch('');
            }}
            className="absolute right-4 text-brand-secondary hover:text-brand-text p-1 rounded-full hover:bg-brand-ivory transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
};
