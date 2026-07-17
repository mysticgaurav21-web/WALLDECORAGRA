/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex py-3 text-xs font-medium text-brand-secondary overflow-x-auto whitespace-nowrap scrollbar-none" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-brand-secondary hover:text-brand-orange transition-colors gap-1"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center">
              <ChevronRight className="h-3.5 w-3.5 text-brand-navy/20 mx-1 shrink-0" />
              {isLast || !item.url ? (
                <span className="text-brand-text font-semibold max-w-40 sm:max-w-none truncate">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.url}
                  className="text-brand-secondary hover:text-brand-orange transition-colors truncate max-w-40 sm:max-w-none"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
