/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { Heart, Grid } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';

export const CategoriesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { favourites, products, categories } = useApp();
  const [showFavsOnly, setShowFavsOnly] = useState(false);

  // Sync with state from Header link
  useEffect(() => {
    if (location.state && (location.state as any).showFavouritesOnly) {
      setShowFavsOnly(true);
      // Clean up state
      navigate('/categories', { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Filter products by saved favorites list
  const favouriteProducts = products.filter((p) => favourites.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
      {/* Breadcrumbs */}
      <Breadcrumb items={[{ label: 'Categories' }]} />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-navy/10 pb-6 mb-8 gap-4">
        <div>
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">Premium Catalogue</span>
          <h1 className="font-display text-3xl font-extrabold text-brand-navy mt-1">
            {showFavsOnly ? 'My Saved Favourites' : 'Explore Categories'}
          </h1>
          <p className="text-xs sm:text-sm text-brand-secondary mt-1 max-w-2xl">
            {showFavsOnly
              ? 'Your curated list of premium interior products. Add these items directly to your enquiry basket.'
              : 'Browse our high-quality catalogue collections, hand-crafted to give your commercial and residential areas a stunning upgrade.'}
          </p>
        </div>

        {/* Toggle between Categories list and Saved Favourites list */}
        {favourites.length > 0 && (
          <div className="flex bg-brand-ivory p-1 rounded-xl self-start">
            <button
              onClick={() => setShowFavsOnly(false)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                !showFavsOnly ? 'bg-white text-brand-navy shadow-sm' : 'text-brand-secondary'
              }`}
            >
              <Grid className="h-3.5 w-3.5" />
              All Categories
            </button>
            <button
              onClick={() => setShowFavsOnly(true)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                showFavsOnly ? 'bg-white text-brand-navy shadow-sm' : 'text-brand-secondary'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${showFavsOnly ? 'fill-brand-orange text-brand-orange' : ''}`} />
              Favourites ({favourites.length})
            </button>
          </div>
        )}
      </div>

      {showFavsOnly ? (
        /* Saved Favourites Render */
        favouriteProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {favouriteProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16 bg-white border border-brand-navy/10 rounded-2xl p-6">
            <Heart className="h-10 w-10 text-brand-navy/20 mb-4" />
            <p className="text-sm text-brand-secondary">No favourite products saved yet.</p>
            <button
              onClick={() => setShowFavsOnly(false)}
              className="mt-4 px-4 py-2 bg-brand-navy text-white text-xs font-semibold rounded-lg"
            >
              Browse Categories
            </button>
          </div>
        )
      ) : (
        /* Display all six categories in a premium two-column mobile grid */
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 md:gap-8">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      )}

      {/* Promotion Banner */}
      <div className="mt-16 bg-gradient-to-br from-brand-navy to-brand-navy/90 text-white rounded-2xl p-6 sm:p-10 border border-white/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider bg-brand-orange/10 border border-brand-orange/20 px-3 py-1 rounded-md">
            Smart Area & Cost Planning
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-black tracking-tight leading-tight pt-1">
            Need Help with Calculations?
          </h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-xl font-light leading-relaxed">
            Use our live <strong>Interior Area & Cost Calculator</strong> to estimate wallpaper rolls, PVC/WPC panel count, flooring boxes, glass film coverage, installation rates, and approximate grand totals.
          </p>
        </div>
        <button
          onClick={() => navigate('/calculator')}
          className="px-6 py-3.5 bg-brand-orange hover:bg-opacity-95 text-xs font-bold text-white rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
        >
          Open Area Calculator →
        </button>
      </div>
    </div>
  );
};
