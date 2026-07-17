/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
  layout?: 'grid' | 'list' | 'detail';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 4, layout = 'grid' }) => {
  if (layout === 'detail') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
        <div className="aspect-square bg-brand-navy/5 rounded-2xl w-full" />
        <div className="space-y-4">
          <div className="h-4 bg-brand-navy/10 rounded w-1/4" />
          <div className="h-8 bg-brand-navy/10 rounded w-3/4" />
          <div className="h-5 bg-brand-navy/10 rounded w-1/3" />
          <div className="space-y-2 pt-4">
            <div className="h-3 bg-brand-navy/5 rounded w-full" />
            <div className="h-3 bg-brand-navy/5 rounded w-full" />
            <div className="h-3 bg-brand-navy/5 rounded w-5/6" />
          </div>
          <div className="h-10 bg-brand-navy/10 rounded w-1/2 pt-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-brand-navy/5 p-4 flex flex-col h-full space-y-4 animate-pulse"
        >
          {/* Image box skeleton */}
          <div className="aspect-square bg-brand-navy/5 rounded-lg w-full" />
          
          {/* Info skeleton */}
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-brand-navy/10 rounded w-1/3" />
            <div className="h-4 bg-brand-navy/15 rounded w-3/4" />
            <div className="h-3 bg-brand-navy/5 rounded w-1/2" />
          </div>

          {/* Pricing skeleton */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <div className="h-2 bg-brand-navy/5 rounded w-12" />
              <div className="h-4 bg-brand-navy/15 rounded w-20" />
            </div>
            <div className="h-8 bg-brand-navy/10 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};
