/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-navy text-white/90 border-t border-brand-navy/10 mt-12">
      {/* Top Footer Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info & Socials */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange text-lg font-extrabold text-white">
                W
              </span>
              <span className="font-display text-xl font-black tracking-tight text-white">
                Wall<span className="text-brand-orange">Decor99</span>
              </span>
            </Link>
            <p className="text-xs text-brand-ivory/60 leading-relaxed font-light">
              Premium interior products catalogue and customer enquiry showroom platform. Elevate your spaces with wallpapers, custom wall panels, luxury glass films, bespoke blinds, robust flooring, and maintenance-free vertical green walls.
            </p>
            {/* Social Links */}
            <div className="flex space-x-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/5 rounded-lg hover:bg-brand-orange hover:text-white text-brand-ivory/70 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/5 rounded-lg hover:bg-brand-orange hover:text-white text-brand-ivory/70 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/5 rounded-lg hover:bg-brand-orange hover:text-white text-brand-ivory/70 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/5 rounded-lg hover:bg-brand-orange hover:text-white text-brand-ivory/70 transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Categories Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-brand-orange tracking-wider uppercase mb-4">
              Main Products
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-ivory/75">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/categories/${cat.slug}`}
                    className="hover:text-brand-orange transition-colors flex items-center gap-1.5"
                  >
                    <span className="h-1 w-1 rounded-full bg-brand-orange/40" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links & Hours */}
          <div>
            <h4 className="font-display text-sm font-semibold text-brand-orange tracking-wider uppercase mb-4">
              Showroom Hours
            </h4>
            <div className="space-y-3 text-xs text-brand-ivory/75">
              <div className="flex gap-2.5 items-start">
                <Clock className="h-4 w-4 text-brand-orange shrink-0" />
                <div>
                  <p className="font-semibold text-white">Mon – Sat: 10 AM – 8 PM</p>
                  <p className="text-[10px] text-brand-ivory/55">Sunday: Closed / Prior Appointments Only</p>
                </div>
              </div>
              <ul className="space-y-2 pt-2 border-t border-white/5">
                <li>
                  <Link to="/consultation" className="hover:text-brand-orange transition-colors">
                    Book Free Consultation
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-brand-orange transition-colors">
                    Find Showroom Location
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-display text-sm font-semibold text-brand-orange tracking-wider uppercase mb-4">
              Connect With Us
            </h4>
            <ul className="space-y-3.5 text-xs text-brand-ivory/75">
              <li className="flex gap-2.5 items-start">
                <MapPin className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  WallDecor99 Showroom, <br />
                  Ground Floor, Sector 45, <br />
                  Gurugram, Haryana - 122003
                </span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Phone className="h-4 w-4 text-brand-orange shrink-0" />
                <a href="tel:+919999999999" className="hover:text-brand-orange transition-colors font-mono">
                  +91 99999 99999
                </a>
              </li>
              <li className="flex gap-2.5 items-center">
                <Mail className="h-4 w-4 text-brand-orange shrink-0" />
                <a href="mailto:enquiry@walldecor99.com" className="hover:text-brand-orange transition-colors">
                  enquiry@walldecor99.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-brand-ivory/40">
          <p>© 2026 WallDecor99. All rights reserved. Interior Catalog & Enquiry Platform.</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
