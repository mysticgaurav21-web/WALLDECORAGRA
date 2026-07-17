/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { ProductGrid } from '../components/ProductGrid';
import { EmptyState } from '../components/EmptyState';
import { Breadcrumb } from '../components/Breadcrumb';
import { useApp } from '../context/AppContext';
import { Sparkles, Trash2, Search, ArrowRight, History } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { recentSearches, addRecentSearch, clearRecentSearches, products } = useApp();

  const queryParam = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryParam);

  // Sync state if queryParam changes (e.g., from breadcrumbs, other pages, suggestions)
  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  const popularSearches = [
    'White marble UV sheet',
    'Zebra blinds',
    'Frosted glass film',
    'Charcoal panel',
    'Wooden flooring',
    'Vertical garden',
  ];

  // Perform search locally
  const searchResults = useMemo(() => {
    const query = queryParam.trim().toLowerCase();
    if (!query) return [];

    return products.filter((p) => {
      return (
        p.productName.toLowerCase().includes(query) ||
        p.productCode.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.subcategory.toLowerCase().includes(query) ||
        (p.material && p.material.toLowerCase().includes(query)) ||
        (p.colour && p.colour.toLowerCase().includes(query))
      );
    });
  }, [queryParam, products]);

  const handleSearchTrigger = (val: string) => {
    const trimmed = val.trim();
    if (trimmed) {
      setSearchParams({ q: trimmed });
      addRecentSearch(trimmed);
    } else {
      setSearchParams({});
    }
  };

  const handleSuggestionClick = (keyword: string) => {
    setSearchQuery(keyword);
    handleSearchTrigger(keyword);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
      {/* Breadcrumbs */}
      <Breadcrumb items={[{ label: 'Search' }]} />

      {/* Page Header */}
      <div className="border-b border-brand-navy/10 pb-6 mb-8 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
          Digital Catalogue Search
        </span>
        <h1 className="font-display text-3xl font-extrabold text-brand-navy mt-1">
          Search WallDecor99 Products
        </h1>
        <p className="text-xs sm:text-sm text-brand-secondary mt-1">
          Explore wallpapers, UV marble sheets, blinds, textured louver panels, rigid flooring planks and vertical greenery in seconds.
        </p>
      </div>

      {/* Large Search Bar */}
      <div className="mb-10">
        <SearchBar initialValue={searchQuery} onSearch={handleSearchTrigger} />
      </div>

      {/* Grid: Suggestions & Recents (Show when no query is typed) */}
      {!queryParam && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* 1. Popular Searches */}
          <div className="p-6 bg-white border border-brand-navy/5 rounded-xl shadow-xs">
            <h2 className="font-display text-sm font-bold text-brand-navy mb-4 flex items-center gap-1.5 border-b border-brand-navy/5 pb-2">
              <Sparkles className="h-4 w-4 text-brand-orange" />
              Popular Search Terms
            </h2>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSuggestionClick(term)}
                  className="px-3 py-2 text-xs font-semibold text-brand-navy hover:text-brand-orange bg-brand-ivory hover:bg-brand-orange/5 rounded-xl border border-brand-navy/5 hover:border-brand-orange/20 transition-all text-left flex items-center gap-1 cursor-pointer"
                >
                  <Search className="h-3 w-3 text-brand-secondary" />
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Recent Searches */}
          <div className="p-6 bg-white border border-brand-navy/5 rounded-xl shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="font-display text-sm font-bold text-brand-navy mb-4 flex items-center justify-between border-b border-brand-navy/5 pb-2">
                <span className="flex items-center gap-1.5">
                  <History className="h-4 w-4 text-brand-orange" />
                  Recent Searches
                </span>
                {recentSearches.length > 0 && (
                  <button
                    onClick={clearRecentSearches}
                    className="text-[10px] text-brand-secondary hover:text-red-500 flex items-center gap-1"
                    title="Clear All Recents"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Clear
                  </button>
                )}
              </h2>

              {recentSearches.length > 0 ? (
                <div className="space-y-1.5">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-brand-text hover:text-brand-orange rounded-lg hover:bg-brand-ivory transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <span className="truncate">{search}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-brand-secondary font-light font-sans py-4">
                  No recent searches in your log. Use the box above to find premium decor pieces.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Results Display Area */}
      {queryParam && (
        <div className="space-y-6">
          <div className="border-b border-brand-navy/10 pb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-brand-navy">
              Search Results for <span className="text-brand-orange italic font-sans font-medium">"{queryParam}"</span>
            </h2>
            <span className="text-xs bg-brand-navy text-white font-mono font-bold px-2.5 py-1 rounded-lg">
              {searchResults.length} Products Found
            </span>
          </div>

          {searchResults.length > 0 ? (
            <ProductGrid products={searchResults} />
          ) : (
            <div className="py-12 bg-white rounded-2xl border border-brand-navy/10 text-center">
              <EmptyState
                title="No Matching Decor Found"
                description={`We couldn't find any wallpapers, UV sheets, glass films, blinds, or flooring with terms matching "${queryParam}". Try checking spelling, or use one of our suggestion pills below.`}
                actionLabel="Reset Search Box"
                onActionClick={() => handleSuggestionClick('')}
              />

              {/* Suggestions quick showcase */}
              <div className="mt-10 max-w-xl mx-auto text-left px-4">
                <h4 className="font-display text-xs font-bold text-brand-navy uppercase tracking-wider mb-3">
                  Recommended Suggestion Searches:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.slice(0, 4).map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSuggestionClick(term)}
                      className="px-3 py-1.5 text-xs font-semibold text-brand-navy hover:text-brand-orange bg-brand-ivory border border-brand-navy/5 rounded-lg hover:bg-brand-orange/5 transition-all cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
