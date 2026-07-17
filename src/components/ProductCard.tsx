/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleFavourite, isFavourite } = useApp();
  const navigate = useNavigate();
  const fav = isFavourite(product.id);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.sellingPrice);

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  // Capitalize unit
  const displayUnit = product.unit ? product.unit.charAt(0).toUpperCase() + product.unit.slice(1) : 'Unit';

  // Check stock status
  const isInStock = product.stockQuantity > 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-brand-navy/10 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavourite(product.id);
        }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/95 backdrop-blur-xs text-brand-navy hover:text-brand-orange shadow-xs transition-transform active:scale-90 cursor-pointer"
        aria-label="Toggle Favourite"
      >
        <Heart className={`h-4.5 w-4.5 transition-colors ${fav ? 'fill-brand-orange text-brand-orange' : 'text-brand-navy/60'}`} />
      </button>

      {/* Image Block: Equal height achieved via aspect-square */}
      <div
        onClick={handleCardClick}
        className="relative aspect-square overflow-hidden bg-brand-ivory cursor-pointer"
      >
        <img
          src={product.images[0]}
          alt={product.productName}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Product Information with increased internal padding */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="cursor-pointer flex flex-col gap-1.5" onClick={handleCardClick}>
          {/* Full Name: Maximum of two lines without truncation if short */}
          <h4 className="font-display text-xs sm:text-sm md:text-base font-extrabold text-brand-text group-hover:text-brand-orange transition-colors line-clamp-2 leading-snug min-h-[2.5rem] flex items-center">
            {product.productName}
          </h4>
          
          {/* Product Code */}
          <p className="text-[10px] sm:text-xs font-mono font-bold text-brand-secondary">
            {product.productCode}
          </p>

          {/* Size and thickness on one short line & Finish */}
          <div className="mt-1 flex flex-col gap-0.5 text-[11px] sm:text-xs text-brand-secondary">
            <p className="font-semibold text-brand-text">
              {product.size}{product.thickness ? ` • ${product.thickness}` : ''}
            </p>
            <p className="font-medium text-[10px] sm:text-xs text-brand-secondary capitalize">
              {product.finish}
            </p>
          </div>
        </div>

        {/* Price and Stock Status */}
        <div className="flex flex-col gap-1">
          {/* Price: Most prominent, orange */}
          <div className="text-base sm:text-lg font-extrabold text-brand-orange flex items-baseline gap-1 leading-none">
            {formattedPrice} 
            <span className="text-[10px] sm:text-xs font-normal text-brand-secondary">/ {displayUnit}</span>
          </div>

          {/* Stock: Green only for In Stock */}
          <span className={`text-[10px] sm:text-xs font-bold ${isInStock ? 'text-emerald-600' : 'text-brand-orange/80'}`}>
            {isInStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* View Details Button: Dark Navy */}
        <Link
          to={`/products/${product.id}`}
          className="w-full flex items-center justify-center rounded-xl bg-brand-navy hover:bg-brand-orange py-3 text-xs font-bold text-white transition-all duration-300 cursor-pointer"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
