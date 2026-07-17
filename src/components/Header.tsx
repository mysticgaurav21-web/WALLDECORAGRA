/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingBag, Phone, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { basket, favourites } = useApp();
  const navigate = useNavigate();

  const activeStyle = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'text-brand-orange border-b-2 border-brand-orange'
        : 'text-brand-navy hover:text-brand-orange'
    }`;

  const basketCount = basket.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-brand-navy/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2.5 group">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy text-xl font-black text-white transition-transform duration-300 group-hover:scale-105 shadow-xs">
                  W
                </span>
                <span className="font-display text-2xl font-black tracking-tight text-brand-navy select-none leading-none">
                  Wall<span className="text-brand-orange">Decor99</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <NavLink to="/" className={activeStyle}>
                Home
              </NavLink>
              <NavLink to="/categories" className={activeStyle}>
                Categories
              </NavLink>
              <NavLink to="/search" className={activeStyle}>
                Search Catalog
              </NavLink>
              <NavLink to="/enquiry" className={activeStyle}>
                Enquiry
              </NavLink>
              <NavLink to="/calculator" className={activeStyle}>
                Calculator
              </NavLink>
              <NavLink to="/visualizer" className={activeStyle}>
                Studio Visualizer
              </NavLink>

              <NavLink to="/contact" className={activeStyle}>
                Contact
              </NavLink>
              <NavLink to="/admin" className={activeStyle}>
                ⚙️ Admin
              </NavLink>
            </nav>

            {/* Actions (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              {/* Search button */}
              <button
                onClick={() => navigate('/search')}
                className="p-2 text-brand-navy hover:text-brand-orange rounded-full hover:bg-brand-ivory transition-all"
                title="Search Products"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Favourites button */}
              <Link
                to="/categories"
                state={{ showFavouritesOnly: true }}
                className="relative p-2 text-brand-navy hover:text-brand-orange rounded-full hover:bg-brand-ivory transition-all"
                title="Favorites"
              >
                <Heart className="h-5 w-5" />
                {favourites.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white">
                    {favourites.length}
                  </span>
                )}
              </Link>

              {/* Enquiry Basket */}
              <Link
                to="/enquiry"
                className="relative p-2 text-brand-navy hover:text-brand-orange rounded-full hover:bg-brand-ivory transition-all"
                title="Enquiry Basket"
              >
                <ShoppingBag className="h-5 w-5" />
                {basketCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-navy text-[10px] font-bold text-white animate-pulse">
                    {basketCount}
                  </span>
                )}
              </Link>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/919999999999?text=Hello%20WallDecor99%2C%20I%20am%20interested%20in%20your%20interior%20products%21"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
                </span>
                WhatsApp Us
              </a>
            </div>

            {/* Mobile Header Elements */}
            <div className="flex items-center gap-1 md:hidden">
              {/* Search Icon */}
              <button
                onClick={() => navigate('/search')}
                className="p-2 text-brand-navy hover:text-brand-orange rounded-full transition-colors"
                aria-label="Search Catalog"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* WhatsApp Icon */}
              <a
                href="https://wa.me/919999999999?text=Hello%20WallDecor99%2C%20I%20am%20interested%20in%20your%20interior%20products%21"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-whatsapp rounded-full hover:bg-whatsapp/10 transition-colors"
                aria-label="WhatsApp Us"
              >
                <Phone className="h-5 w-5 fill-whatsapp/10 text-whatsapp" />
              </a>

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-brand-navy hover:text-brand-orange rounded-full transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay & Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="relative flex w-full max-w-xs flex-col bg-white p-6 shadow-2xl transition-transform duration-300">
            <div className="flex items-center justify-between border-b border-brand-navy/10 pb-4">
              <Link
                to="/"
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-navy text-sm font-extrabold text-white">
                  W
                </span>
                <span className="font-display text-lg font-black tracking-tight text-brand-navy">
                  Wall<span className="text-brand-orange">Decor99</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full p-2 hover:bg-brand-ivory text-brand-navy"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 py-6 space-y-3">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                    isActive ? 'bg-brand-ivory text-brand-orange' : 'text-brand-navy hover:bg-brand-ivory'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                    isActive ? 'bg-brand-ivory text-brand-orange' : 'text-brand-navy hover:bg-brand-ivory'
                  }`
                }
              >
                Explore Categories
              </NavLink>
              <NavLink
                to="/search"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                    isActive ? 'bg-brand-ivory text-brand-orange' : 'text-brand-navy hover:bg-brand-ivory'
                  }`
                }
              >
                Search Catalog
              </NavLink>
              <NavLink
                to="/enquiry"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                    isActive ? 'bg-brand-ivory text-brand-orange' : 'text-brand-navy hover:bg-brand-ivory'
                  }`
                }
              >
                Enquiry Basket ({basketCount})
              </NavLink>
              <NavLink
                to="/calculator"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                    isActive ? 'bg-brand-ivory text-brand-orange' : 'text-brand-navy hover:bg-brand-ivory'
                  }`
                }
              >
                Area Calculator
              </NavLink>
              <NavLink
                to="/visualizer"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                    isActive ? 'bg-brand-ivory text-brand-orange' : 'text-brand-navy hover:bg-brand-ivory'
                  }`
                }
              >
                Studio Room Visualizer
              </NavLink>

              <NavLink
                to="/consultation"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                    isActive ? 'bg-brand-ivory text-brand-orange' : 'text-brand-navy hover:bg-brand-ivory'
                  }`
                }
              >
                Free Consultation
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                    isActive ? 'bg-brand-ivory text-brand-orange' : 'text-brand-navy hover:bg-brand-ivory'
                  }`
                }
              >
                Contact Showroom
              </NavLink>
              <NavLink
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                    isActive ? 'bg-brand-ivory text-brand-orange' : 'text-brand-navy hover:bg-brand-ivory'
                  }`
                }
              >
                ⚙️ Admin Panel
              </NavLink>
            </div>

            <div className="border-t border-brand-navy/10 pt-4 space-y-3">
              <a
                href="https://wa.me/919999999999?text=Hello%20WallDecor99%2C%20I%20am%20interested%20in%20your%20interior%20products%21"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
              >
                WhatsApp Chat
              </a>
              <a
                href="tel:+919999999999"
                className="flex items-center justify-center gap-2 rounded-xl border border-brand-navy/10 py-3 text-sm font-semibold text-brand-navy hover:bg-brand-ivory"
              >
                Call Support
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
