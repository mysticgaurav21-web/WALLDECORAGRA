/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white border border-brand-navy/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Installed Room Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-ivory">
        <img
          src={category.image}
          alt={`${category.name} showroom view`}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info Body */}
      <div className="p-3.5 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-display text-sm sm:text-base font-extrabold text-brand-navy group-hover:text-brand-orange transition-colors leading-snug">
            {category.name}
          </h3>
          <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-slate-700 font-medium line-clamp-2 leading-relaxed">
            {category.shortDescription}
          </p>
        </div>

        <div className="mt-3.5 pt-3 border-t border-brand-navy/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-1">
          <span className="text-[9px] sm:text-[10px] font-bold text-brand-navy/60 bg-brand-ivory px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md w-fit">
            {category.subcategories.length} Collections
          </span>
          <Link
            to={`/categories/${category.slug}`}
            className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-orange hover:text-brand-navy group-hover:gap-1.5 transition-all w-fit"
          >
            Explore
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
