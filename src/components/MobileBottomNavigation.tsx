/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Grid, Search, ShoppingBag, PhoneCall } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileBottomNavigation: React.FC = () => {
  const { pathname } = useLocation();
  const { basket } = useApp();
  const basketCount = basket.reduce((acc, item) => acc + item.quantity, 0);

  // If we are on a product details page, we hide the global mobile bottom nav
  // because the product details page has its own sticky mobile call-to-action bar.
  if (pathname.startsWith('/products/')) {
    return null;
  }

  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center py-1.5 text-[11px] font-bold tracking-tight transition-all ${
      isActive ? 'text-brand-orange font-extrabold scale-105' : 'text-brand-navy/70 hover:text-brand-orange'
    }`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-navy/10 px-2 shadow-[0_-4px_16px_rgba(8,35,74,0.06)] pb-safe">
      <div className="flex items-center justify-around h-16">
        {/* Home */}
        <NavLink to="/" className={linkStyle}>
          <Home className="h-5 w-5 mb-0.5" />
          <span>Home</span>
        </NavLink>

        {/* Categories */}
        <NavLink to="/categories" className={linkStyle}>
          <Grid className="h-5 w-5 mb-0.5" />
          <span>Categories</span>
        </NavLink>

        {/* Search */}
        <NavLink to="/search" className={linkStyle}>
          <Search className="h-5 w-5 mb-0.5" />
          <span>Search</span>
        </NavLink>

        {/* Enquiry */}
        <NavLink to="/enquiry" className={linkStyle}>
          <div className="relative">
            <ShoppingBag className="h-5 w-5 mb-0.5" />
            {basketCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-orange text-[9px] font-bold text-white leading-none">
                {basketCount}
              </span>
            )}
          </div>
          <span>Enquiry</span>
        </NavLink>

        {/* WhatsApp */}
        <a
          href="https://wa.me/919999999999?text=Hello%20WallDecor99%2C%20I%20am%20interested%20in%20your%20interior%20products%21"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 text-[11px] font-extrabold text-whatsapp transition-transform active:scale-95"
        >
          <PhoneCall className="h-5 w-5 text-whatsapp mb-0.5 fill-whatsapp/10" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
