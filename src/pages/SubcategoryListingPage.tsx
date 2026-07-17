/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { SortDropdown } from '../components/SortDropdown';
import { FilterDrawer } from '../components/FilterDrawer';
import { ProductGrid } from '../components/ProductGrid';
import { EmptyState } from '../components/EmptyState';
import { SlidersHorizontal, Tag, RefreshCw } from 'lucide-react';

export const SubcategoryListingPage: React.FC = () => {
  const { categorySlug, subcategorySlug } = useParams<{ categorySlug: string; subcategorySlug: string }>();
  const navigate = useNavigate();
  const { products, categories } = useApp();

  // Find parent category
  const category = categories.find((c) => c.slug === categorySlug);

  // If subcategorySlug represents a subcategory, we can try to find the proper display name
  const subcategoryName = useMemo(() => {
    if (!category) return '';
    const match = category.subcategories.find(
      (sub) =>
        sub.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === subcategorySlug
    );
    return match || subcategorySlug?.replace(/-/g, ' ');
  }, [category, subcategorySlug]);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter & Sort State
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(subcategoryName || null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedColour, setSelectedColour] = useState<string | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedThickness, setSelectedThickness] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="Category Not Found"
          description="We couldn't locate the specified design category."
          actionLabel="View All Categories"
          onActionClick={() => navigate('/categories')}
        />
      </div>
    );
  }

  // Get all products in parent category to populate filters dynamically
  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.category.toLowerCase() === category.name.toLowerCase());
  }, [category, products]);

  // Extract unique filter properties dynamically from the category products
  const uniqueSubcategories = category.subcategories;
  const uniqueMaterials = useMemo(() => Array.from(new Set(categoryProducts.map((p) => p.material))), [categoryProducts]);
  const uniqueColours = useMemo(() => Array.from(new Set(categoryProducts.map((p) => p.colour))), [categoryProducts]);
  const uniqueFinishes = useMemo(() => Array.from(new Set(categoryProducts.map((p) => p.finish))), [categoryProducts]);
  const uniqueSizes = useMemo(() => Array.from(new Set(categoryProducts.map((p) => p.size))), [categoryProducts]);
  const uniqueThicknesses = useMemo(() => {
    return Array.from(new Set(categoryProducts.map((p) => p.thickness).filter(Boolean))) as string[];
  }, [categoryProducts]);

  // Apply filters in local memory
  const filteredProducts = useMemo(() => {
    let result = [...categoryProducts];

    if (selectedSubcategory) {
      result = result.filter((p) => p.subcategory.toLowerCase() === selectedSubcategory.toLowerCase());
    }
    if (selectedMaterial) {
      result = result.filter((p) => p.material === selectedMaterial);
    }
    if (selectedColour) {
      result = result.filter((p) => p.colour === selectedColour);
    }
    if (selectedFinish) {
      result = result.filter((p) => p.finish === selectedFinish);
    }
    if (selectedSize) {
      result = result.filter((p) => p.size === selectedSize);
    }
    if (selectedThickness) {
      result = result.filter((p) => p.thickness === selectedThickness);
    }
    if (maxPrice) {
      result = result.filter((p) => p.sellingPrice <= maxPrice);
    }
    if (inStockOnly) {
      result = result.filter((p) => p.stockQuantity > 0);
    }

    // Apply Sorting options
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.sellingPrice - b.sellingPrice);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.sellingPrice - a.sellingPrice);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.id.localeCompare(a.id)); // Mock newest
    } else {
      // 'featured'
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [
    categoryProducts,
    selectedSubcategory,
    selectedMaterial,
    selectedColour,
    selectedFinish,
    selectedSize,
    selectedThickness,
    maxPrice,
    inStockOnly,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSelectedSubcategory(null);
    setSelectedMaterial(null);
    setSelectedColour(null);
    setSelectedFinish(null);
    setSelectedSize(null);
    setSelectedThickness(null);
    setMaxPrice(5000);
    setInStockOnly(false);
  };

  // Check if any filter is actively modified
  const hasActiveFilters =
    selectedSubcategory !== null ||
    selectedMaterial !== null ||
    selectedColour !== null ||
    selectedFinish !== null ||
    selectedSize !== null ||
    selectedThickness !== null ||
    maxPrice < 5000 ||
    inStockOnly;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32 sm:pb-36">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Categories', url: '/categories' },
          { label: category.name, url: `/categories/${category.slug}` },
          { label: subcategoryName || 'Products' },
        ]}
      />

      {/* Hero Header Section */}
      <div className="border-b border-brand-navy/10 pb-6 mb-8">
        <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
          {category.name} Range
        </span>
        <h1 className="font-display text-3xl font-extrabold text-brand-navy mt-1">
          {subcategoryName || `${category.name} Collection`}
        </h1>
        <p className="text-xs sm:text-sm text-brand-secondary mt-1 max-w-3xl leading-relaxed">
          Premium choices curated carefully. Browse technical details, review textures, and select perfect matches for modern installations.
        </p>
      </div>

      {/* Toolbar: Filters and Sorters */}
      <div className="flex flex-col gap-3 mb-6">
        {/* First Row: Product Count & Filters button */}
        <div className="bg-white rounded-xl border border-brand-navy/10 p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
          <span className="text-xs sm:text-sm font-semibold text-brand-navy">
            Showing <span className="text-brand-orange font-bold font-mono">{filteredProducts.length}</span> Products
          </span>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-navy/15 bg-brand-ivory px-3 py-2 text-xs font-bold text-brand-navy hover:bg-brand-orange hover:text-white transition-all cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {hasActiveFilters && (
              <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-ping" />
            )}
          </button>
        </div>

        {/* Second Row: Sort dropdown */}
        <div className="bg-white rounded-xl border border-brand-navy/10 p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-xs w-full flex-wrap">
          <span className="text-xs sm:text-sm font-bold text-brand-secondary">Sort Options</span>
          <SortDropdown currentSort={sortBy} onSortChange={setSortBy} />
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-brand-secondary font-bold flex items-center gap-1">
            <Tag className="h-3 w-3" />
            Active Filters:
          </span>
          {selectedSubcategory && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-navy/10 text-brand-navy text-[10px] sm:text-xs font-semibold px-2.5 py-1">
              Subcategory: {selectedSubcategory}
              <button onClick={() => setSelectedSubcategory(null)} className="hover:text-brand-orange font-bold text-sm">×</button>
            </span>
          )}
          {selectedMaterial && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-navy/10 text-brand-navy text-[10px] sm:text-xs font-semibold px-2.5 py-1">
              Material: {selectedMaterial}
              <button onClick={() => setSelectedMaterial(null)} className="hover:text-brand-orange font-bold text-sm">×</button>
            </span>
          )}
          {selectedColour && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-navy/10 text-brand-navy text-[10px] sm:text-xs font-semibold px-2.5 py-1">
              Colour: {selectedColour}
              <button onClick={() => setSelectedColour(null)} className="hover:text-brand-orange font-bold text-sm">×</button>
            </span>
          )}
          {selectedFinish && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-navy/10 text-brand-navy text-[10px] sm:text-xs font-semibold px-2.5 py-1">
              Finish: {selectedFinish}
              <button onClick={() => setSelectedFinish(null)} className="hover:text-brand-orange font-bold text-sm">×</button>
            </span>
          )}
          {selectedSize && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-navy/10 text-brand-navy text-[10px] sm:text-xs font-semibold px-2.5 py-1">
              Size: {selectedSize}
              <button onClick={() => setSelectedSize(null)} className="hover:text-brand-orange font-bold text-sm">×</button>
            </span>
          )}
          {selectedThickness && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-navy/10 text-brand-navy text-[10px] sm:text-xs font-semibold px-2.5 py-1">
              Thickness: {selectedThickness}
              <button onClick={() => setSelectedThickness(null)} className="hover:text-brand-orange font-bold text-sm">×</button>
            </span>
          )}
          {maxPrice < 5000 && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-navy/10 text-brand-navy text-[10px] sm:text-xs font-semibold px-2.5 py-1">
              Max Price: ₹{maxPrice}
              <button onClick={() => setMaxPrice(5000)} className="hover:text-brand-orange font-bold text-sm">×</button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-navy/10 text-brand-navy text-[10px] sm:text-xs font-semibold px-2.5 py-1">
              In Stock Only
              <button onClick={() => setInStockOnly(false)} className="hover:text-brand-orange font-bold text-sm">×</button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-xs text-brand-orange font-bold underline hover:text-brand-navy flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" /> Clear All
          </button>
        </div>
      )}

      {/* Main Grid: Filters on Left (Desktop), Products on Right */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Panel (Sits on Left sticky on Desktop, or Full Screen Overlay Drawer on Mobile) */}
        <FilterDrawer
          isOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          subcategories={uniqueSubcategories}
          materials={uniqueMaterials}
          colours={uniqueColours}
          finishes={uniqueFinishes}
          sizes={uniqueSizes}
          thicknesses={uniqueThicknesses}
          
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
          selectedMaterial={selectedMaterial}
          setSelectedMaterial={setSelectedMaterial}
          selectedColour={selectedColour}
          setSelectedColour={setSelectedColour}
          selectedFinish={selectedFinish}
          setSelectedFinish={setSelectedFinish}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          selectedThickness={selectedThickness}
          setSelectedThickness={setSelectedThickness}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          inStockOnly={inStockOnly}
          setInStockOnly={setInStockOnly}
          
          onReset={handleResetFilters}
        />

        {/* Product Grid Area */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="py-12 bg-white rounded-2xl border border-brand-navy/10 text-center">
              <EmptyState
                title="No Products Match Your Filters"
                description="Try broadening your maximum price range or turning off specific finishes/materials to discover relevant interior models."
                actionLabel="Reset Active Filters"
                onActionClick={handleResetFilters}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
