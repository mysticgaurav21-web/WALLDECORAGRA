/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { SubcategoryCard } from '../components/SubcategoryCard';
import { ProductCard } from '../components/ProductCard';
import { EmptyState } from '../components/EmptyState';
import { ArrowLeft, Grid, Sparkles } from 'lucide-react';

export const CategoryDetailsPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const { products, categories } = useApp();

  // Find current category
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="Category Not Found"
          description="We couldn't locate the specified design category. Browse our full gallery to find what you need."
          actionLabel="View All Categories"
          onActionClick={() => navigate('/categories')}
        />
      </div>
    );
  }

  // Get products of this specific category
  const categoryProducts = products.filter(
    (p) => p.category.toLowerCase() === category.name.toLowerCase()
  );

  const featuredInCat = categoryProducts.filter((p) => p.featured || p.popular);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32 sm:pb-36">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Interior Products', url: '/categories' },
          { label: category.name },
        ]}
      />

      {/* Category Banner Hero Block */}
      <div className="relative overflow-hidden bg-brand-navy rounded-2xl p-4 sm:p-8 md:p-10 mb-8 text-white min-h-[160px] sm:min-h-[220px] flex items-center shadow-md">
        <div className="absolute inset-0 z-0">
          <img
            src={category.image}
            alt={category.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center opacity-40 sm:opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 via-brand-navy/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl flex flex-col items-start">
          <button
            onClick={() => navigate('/categories')}
            className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-brand-orange hover:text-white transition-colors mb-2 uppercase tracking-wider cursor-pointer container-snap"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Categories
          </button>
          
          <h1 className="font-display text-xl sm:text-3xl md:text-4.5xl font-black tracking-tight leading-tight">
            {category.name}
          </h1>
          
          <p className="mt-1.5 text-xs sm:text-sm text-brand-ivory/90 leading-relaxed font-sans font-medium line-clamp-2 max-w-xl">
            {category.shortDescription || category.description}
          </p>

          {/* Primary CTA Only */}
          <button
            onClick={() => {
              const element = document.getElementById('subcategory-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-3.5 sm:mt-5 px-4 py-2 sm:px-5 sm:py-2.5 bg-brand-orange hover:bg-white text-white hover:text-brand-navy text-[10px] sm:text-xs font-black rounded-xl transition-all shadow-md uppercase tracking-wider cursor-pointer border border-brand-orange hover:border-white"
          >
            Explore {category.name}
          </button>
        </div>
      </div>

      {/* Full-width elegant layout: Subcategories First */}
      <div className="space-y-12">
        {/* Subcategories Grid Section */}
        <div id="subcategory-section" className="scroll-mt-6">
          <div className="border-b border-brand-navy/10 pb-3 mb-6 flex items-center justify-between">
            <h2 className="font-display text-base sm:text-lg font-extrabold text-brand-navy flex items-center gap-2">
              <Grid className="h-4 sm:h-5 w-4 sm:w-5 text-brand-orange" />
              Browse {category.name} Collections
            </h2>
            <span className="text-[10px] sm:text-xs bg-brand-navy/5 text-brand-navy font-bold px-2.5 py-1 rounded-lg">
              {category.subcategories.length} Styles
            </span>
          </div>

          {/* Two-column on mobile, three on tablet, four on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {category.subcategories.map((sub) => (
              <SubcategoryCard key={sub} name={sub} categorySlug={category.slug} />
            ))}
          </div>
        </div>

        {/* Featured Products Section */}
        <div>
          <div className="border-b border-brand-navy/10 pb-3 mb-6 flex items-center gap-2">
            <Sparkles className="h-4 sm:h-5 w-4 sm:w-5 text-brand-orange" />
            <h2 className="font-display text-base sm:text-lg font-extrabold text-brand-navy">
              Top Pick {category.name} Solutions
            </h2>
          </div>

          {featuredInCat.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {featuredInCat.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : categoryProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {categoryProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-white border border-brand-navy/10 rounded-2xl shadow-xs">
              <p className="text-sm font-medium text-brand-secondary">No products currently listed under {category.name}. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
