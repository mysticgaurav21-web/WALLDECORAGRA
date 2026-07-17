/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PackageX, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onActionClick?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onActionClick,
  icon,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-2xl border border-brand-navy/10 max-w-lg mx-auto shadow-xs">
      <div className="p-4 rounded-full bg-brand-ivory text-brand-orange mb-4.5">
        {icon || <PackageX className="h-10 w-10 stroke-1.5" />}
      </div>
      <h3 className="font-display text-lg font-bold text-brand-navy mb-2">{title}</h3>
      <p className="text-sm text-brand-secondary max-w-sm mb-6 leading-relaxed font-sans">{description}</p>
      {(actionLabel || onActionClick) && (
        <button
          onClick={onActionClick || (() => navigate('/categories'))}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-5 py-3 text-xs font-semibold text-white shadow-sm hover:bg-opacity-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {actionLabel || 'Back to Catalogue'}
        </button>
      )}
    </div>
  );
};
