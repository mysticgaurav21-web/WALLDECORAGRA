/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { HeroBanner } from '../components/HeroBanner';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Sparkles, Award, Headphones, ArrowRight, Calendar, Phone } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { products, categories } = useApp();

  // Get featured products
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  const benefits = [
    {
      icon: <Award className="h-6 w-6 text-brand-orange" />,
      title: 'Premium Quality Products',
      description: 'Hand-picked luxury materials crafted to sustain moisture, termites, and fire hazards for peace of mind.',
    },
    {
      icon: <Sparkles className="h-6 w-6 text-brand-orange" />,
      title: 'Wide Product Range',
      description: 'Over 100+ stunning catalog variations spanning UV marble, Louvers, blinds, wallpaper prints, and vertical grass.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-brand-orange" />,
      title: 'Expert Installation Support',
      description: 'Professional, certified alignment specialists to install panels and blinds seamlessly at your property.',
    },
    {
      icon: <Headphones className="h-6 w-6 text-brand-orange" />,
      title: 'Fast Customer Assistance',
      description: 'Round-the-clock supportive showroom staff to address measurements, estimates, and general questions.',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-12 pb-12">
      {/* 1. Global Search Area */}
      <section className="bg-brand-navy/5 py-3.5 sm:py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SearchBar standalone />
        </div>
      </section>

      {/* 2. Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HeroBanner />
      </section>

      {/* 3. Shop By Category */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">Browse Showroom</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-navy mt-1">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => navigate('/categories')}
            className="mt-3 sm:mt-0 text-xs sm:text-sm font-bold text-brand-orange hover:text-brand-navy transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Categories Grid (2-cols on mobile, 3-cols or 6-cols on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-white py-12 rounded-2xl border border-brand-navy/5">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">Exclusive Selection</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-navy mt-1">
              Featured Products
            </h2>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="text-xs sm:text-sm font-bold text-brand-orange hover:text-brand-navy transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* 2 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">Our Signature Promise</span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-navy mt-1">
            Why Choose WallDecor99?
          </h2>
          <p className="text-xs sm:text-sm text-brand-secondary mt-2">
            Providing superior, long-lasting surface solutions and expert advice for over a decade.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="p-6 bg-white border border-brand-navy/5 rounded-xl hover:border-brand-orange/20 transition-all shadow-xs"
            >
              <div className="p-3 bg-brand-ivory rounded-xl w-fit mb-4">
                {benefit.icon}
              </div>
              <h3 className="font-display text-base font-bold text-brand-navy mb-2">
                {benefit.title}
              </h3>
              <p className="text-xs sm:text-sm text-brand-secondary leading-relaxed font-light">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Consultation Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-brand-navy rounded-2xl py-12 px-6 sm:px-12 md:py-16 text-center shadow-xl">
          {/* Subtle design element */}
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-brand-orange/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-brand-orange/10 blur-3xl" />

          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              Need help choosing the <br />right interior product?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-brand-ivory/80 max-w-md mx-auto leading-relaxed">
              Book a free showroom consultation. Our visual experts will bring catalogs, take site dimensions, and suggest the perfect match for your space.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/consultation')}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-6 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-opacity-90 transition-all cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                Book Free Consultation
              </button>
              <a
                href="https://wa.me/919999999999?text=Hello%20WallDecor99%2C%20I%20would%20like%20to%20consult%20regarding%20interior%20products%20for%20my%20property."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-opacity-90 transition-all"
              >
                <Phone className="h-4 w-4" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
