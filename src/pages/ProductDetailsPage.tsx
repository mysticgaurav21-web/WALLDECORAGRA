/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { ProductGallery } from '../components/ProductGallery';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { Heart, Plus, Minus, Check, MessageSquare, Phone, Share2, ClipboardCheck, ArrowLeft, Calculator } from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToBasket, toggleFavourite, isFavourite, products } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Find product
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="Product Not Found"
          description="We couldn't locate the specified interior product specifications."
          actionLabel="Return to Catalog"
          onActionClick={() => navigate('/')}
        />
      </div>
    );
  }

  const isFav = isFavourite(product.id);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.sellingPrice);

  const handleAddToEnquiry = () => {
    addToBasket(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const subcategorySlug = product.subcategory
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const categorySlug = product.category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
      {/* Breadcrumb path */}
      <Breadcrumb
        items={[
          { label: 'Categories', url: '/categories' },
          { label: product.category, url: `/categories/${categorySlug}` },
          { label: product.subcategory, url: `/categories/${categorySlug}/${subcategorySlug}` },
          { label: product.productName },
        ]}
      />

      {/* Main product showcase split block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-2xl border border-brand-navy/10 p-4 sm:p-8 shadow-xs">
        {/* Left Column: Product Galleries */}
        <div className="lg:col-span-6 space-y-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex lg:hidden items-center gap-1 text-xs font-bold text-brand-navy hover:text-brand-orange mb-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <ProductGallery
            images={product.images}
            roomPreviewImages={product.roomPreviewImages}
            productName={product.productName}
          />
        </div>

        {/* Right Column: Specifications & Enquiry adding */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Tag Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-md">
                {product.subcategory}
              </span>
              <span className="text-[10px] font-semibold text-brand-navy/60 bg-brand-ivory px-3 py-1 rounded-md">
                {product.category}
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                product.stockQuantity > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}>
                {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Title & Code */}
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight leading-tight">
                {product.productName}
              </h1>
              <p className="text-xs font-mono text-brand-secondary mt-1">
                Product Code: <span className="text-brand-text font-bold">{product.productCode}</span>
              </p>
            </div>

            {/* Price section */}
            <div className="p-4 bg-brand-ivory rounded-xl border border-brand-navy/5">
              <span className="text-[10px] sm:text-xs text-brand-secondary uppercase tracking-wider font-semibold block">
                Estimated Trade Pricing
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3.5xl font-extrabold text-brand-navy">
                  {formattedPrice}
                </span>
                <span className="text-xs sm:text-sm text-brand-secondary font-medium">
                  per {product.unit}
                </span>
              </div>
              <p className="text-[10px] text-brand-secondary/80 mt-1 font-light font-sans">
                *Taxes extra. Installation assistance available upon requirement.
              </p>
            </div>

            {/* Calculate Requirement Action */}
            {product.category !== 'Artificial Plants' && (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const parseCoverage = (prod: typeof product): number => {
                      const sizeStr = (prod.size || '').toLowerCase();
                      if (prod.category === 'Wallpapers') return 57;
                      if (prod.category === 'Wall Panels') {
                        if (sizeStr.includes('8') && sizeStr.includes('4')) return 32;
                        return 8;
                      }
                      if (prod.category === 'Flooring') return 18;
                      return 1;
                    };
                    const coverage = parseCoverage(product);
                    navigate(`/calculator?category=${encodeURIComponent(product.category)}&productName=${encodeURIComponent(product.productName)}&productCode=${encodeURIComponent(product.productCode)}&unit=${encodeURIComponent(product.unit)}&coverage=${coverage}&price=${product.sellingPrice}&install=${product.installationCharge || 0}`);
                  }}
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl border-2 border-brand-orange text-brand-orange hover:bg-brand-orange/[0.03] py-3 px-4 text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Calculator className="h-4 w-4" />
                  Calculate Product Requirement & Est. Cost
                </button>
                <button
                  onClick={() => navigate(`/visualizer/product/${product.id}`)}
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-brand-orange text-white hover:bg-orange-600 py-3 px-4 text-xs font-black transition-all cursor-pointer shadow-md"
                >
                  <span>🎨</span> See this Product installed in 3D Room Visualizer
                </button>
              </div>
            )}

            {/* Product Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                Product Overview
              </h3>
              <p className="text-xs sm:text-sm text-brand-secondary leading-relaxed font-light font-sans">
                {product.description}
              </p>
            </div>

            {/* Spec grid */}
            <div className="border-t border-brand-navy/10 pt-4 space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs border-b border-brand-navy/10 pb-4.5">
                <div className="flex justify-between border-b border-brand-navy/5 pb-1">
                  <span className="text-brand-secondary font-medium">Standard Dimensions</span>
                  <span className="text-brand-text font-bold">{product.size}</span>
                </div>
                {product.thickness && (
                  <div className="flex justify-between border-b border-brand-navy/5 pb-1">
                    <span className="text-brand-secondary font-medium">Material Thickness</span>
                    <span className="text-brand-text font-bold">{product.thickness}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-brand-navy/5 pb-1">
                  <span className="text-brand-secondary font-medium">Material Composition</span>
                  <span className="text-brand-text font-bold">{product.material}</span>
                </div>
                <div className="flex justify-between border-b border-brand-navy/5 pb-1">
                  <span className="text-brand-secondary font-medium">Surface Finish</span>
                  <span className="text-brand-text font-bold capitalize">{product.finish}</span>
                </div>
                {product.installationCharge && (
                  <div className="flex justify-between border-b border-brand-navy/5 pb-1">
                    <span className="text-brand-secondary font-medium">Installation Helper</span>
                    <span className="text-brand-text font-bold">₹{product.installationCharge} /{product.unit}</span>
                  </div>
                )}
                {product.warranty && (
                  <div className="flex justify-between border-b border-brand-navy/5 pb-1">
                    <span className="text-brand-secondary font-medium">Structural Warranty</span>
                    <span className="text-brand-text font-bold">{product.warranty}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Suitable For list */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">Recommended Installations</span>
              <div className="flex flex-wrap gap-1.5">
                {product.suitableFor.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold text-brand-navy bg-brand-navy/5 px-2.5 py-1 rounded-lg"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Enquiry Action Area */}
          <div className="mt-8 pt-6 border-t border-brand-navy/10 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase text-brand-navy">Select Quantity ({product.unit}s)</span>
              
              {/* Quantity selectors */}
              <div className="flex items-center border border-brand-navy/15 rounded-xl bg-brand-ivory p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-brand-navy hover:text-brand-orange hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="Decrease"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="px-4 text-sm font-extrabold font-mono text-brand-navy min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-brand-navy hover:text-brand-orange hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="Increase"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Add to Favourites Desktop */}
              <button
                onClick={() => toggleFavourite(product.id)}
                className="ml-auto flex items-center gap-1.5 rounded-xl border border-brand-navy/10 px-4 py-3 text-xs font-bold text-brand-navy hover:bg-brand-ivory transition-colors cursor-pointer"
              >
                <Heart className={`h-4.5 w-4.5 ${isFav ? 'fill-brand-orange text-brand-orange' : 'text-brand-navy/60'}`} />
                {isFav ? 'Saved' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Core Action buttons desktop */}
            <div className="hidden sm:flex gap-4">
              <button
                onClick={handleAddToEnquiry}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand-navy hover:bg-opacity-95 text-sm font-bold text-white py-4 shadow-sm transition-all cursor-pointer"
              >
                {justAdded ? (
                  <>
                    <Check className="h-4.5 w-4.5 text-emerald-400" />
                    Added to Enquiry Basket!
                  </>
                ) : (
                  'Add to Enquiry Basket'
                )}
              </button>
              
              <a
                href={`https://wa.me/919999999999?text=Hello%20WallDecor99%2C%20I%20am%20enquiring%20about%20your%20product%20${encodeURIComponent(product.productName)}%20%28Code%3A%20${product.productCode}%29.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp hover:bg-opacity-90 text-sm font-bold text-white px-6 py-4"
              >
                <MessageSquare className="h-4.5 w-4.5" />
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Action Bar (Sticky at bottom on small screens) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-brand-navy/10 p-3 shadow-[0_-8px_24px_rgba(8,35,74,0.08)] flex items-center justify-between gap-3 pb-safe">
        {/* Save Favourite */}
        <button
          onClick={() => toggleFavourite(product.id)}
          className="p-3 rounded-xl bg-brand-ivory border border-brand-navy/5 text-brand-navy"
          aria-label="Add to favourites"
        >
          <Heart className={`h-5 w-5 ${isFav ? 'fill-brand-orange text-brand-orange' : 'text-brand-navy/60'}`} />
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="p-3 rounded-xl bg-brand-ivory border border-brand-navy/5 text-brand-navy relative"
          aria-label="Share product link"
        >
          {copied ? <ClipboardCheck className="h-5 w-5 text-emerald-600" /> : <Share2 className="h-5 w-5" />}
        </button>

        {/* Add to basket */}
        <button
          onClick={handleAddToEnquiry}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-brand-navy py-3.5 text-xs font-bold text-white shadow-xs"
        >
          {justAdded ? <Check className="h-4 w-4 text-emerald-400" /> : 'Add to Enquiry'}
        </button>

        {/* Whatsapp */}
        <a
          href={`https://wa.me/919999999999?text=Hello%20WallDecor99%2C%20I%20am%20enquiring%20about%20your%20product%20${encodeURIComponent(product.productName)}%20%28Code%3A%20${product.productCode}%29.`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-xl bg-whatsapp text-white flex items-center justify-center shadow-xs"
          aria-label="WhatsApp enquiry"
        >
          <MessageSquare className="h-5 w-5 fill-white" />
        </a>
      </div>
    </div>
  );
};
