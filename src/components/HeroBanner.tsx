/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-brand-navy rounded-2xl md:rounded-3xl shadow-xl">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
         <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
          alt="Premium Living Room Interior Showroom"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-85 md:opacity-90 transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-brand-navy/75 via-brand-navy/35 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-16 md:py-24 md:px-12 flex flex-col items-start justify-center">
        {/* Tagline badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/20 px-3.5 py-1 text-[10px] sm:text-xs font-semibold tracking-wider text-brand-orange uppercase mb-3 sm:mb-6 border border-brand-orange/35">
          WallDecor99 Showroom
        </div>

        {/* Heading */}
        <h1 className="max-w-2xl font-display text-2xl sm:text-4xl md:text-5xl lg:text-5.5xl font-extrabold tracking-tight text-white leading-tight">
          Beautiful Interiors <br />
          <span className="text-brand-orange">Begin Here</span>
        </h1>

        {/* Supporting text */}
        <p className="mt-3 max-w-lg text-xs sm:text-sm md:text-base text-brand-ivory/95 leading-relaxed font-sans font-normal">
          Premium wallpapers, wall panels, glass films, blinds, flooring, and plants meticulously curated to elevate your residential or commercial space.
        </p>

        {/* Actions */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/categories')}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-5 py-2.5 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-opacity-90 transition-all active:scale-95 cursor-pointer"
          >
            Explore Products
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate('/consultation')}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all active:scale-95 cursor-pointer"
          >
            <Calendar className="h-4 w-4" />
            Free Consultation
          </button>
        </div>
      </div>
    </div>
  );
};
