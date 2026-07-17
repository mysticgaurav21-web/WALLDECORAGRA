import React from 'react';

interface CostEstimatorProps {
  transport: number;
  additional: number;
  onChange: (transport: number, additional: number) => void;
}

export const CostEstimator: React.FC<CostEstimatorProps> = ({
  transport,
  additional,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-brand-navy/10 p-5 sm:p-6 shadow-xs space-y-4" id="calc-cost-estimator">
      <div>
        <h2 className="font-display text-sm font-bold text-brand-navy flex items-center gap-1.5">
          Step 6: Transport & Additional Charges (Optional)
        </h2>
        <p className="text-[10px] text-brand-secondary font-light mt-0.5">
          Include logistics and additional custom work estimates for a complete quote.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Transport Charge */}
        <div>
          <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1.5">
            Transport / Delivery Cost (₹)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-xs font-bold text-brand-navy">₹</span>
            <input
              type="number"
              min="0"
              step="any"
              value={transport || ''}
              onChange={(e) => onChange(parseFloat(e.target.value) || 0, additional)}
              className="w-full rounded-xl border border-brand-navy/15 py-3 pl-8 pr-4 text-xs font-bold text-brand-navy focus:border-brand-orange focus:outline-none bg-white"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Miscellaneous / Custom charge */}
        <div>
          <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1.5">
            Additional Charges (₹)
            <span className="text-[9px] text-brand-secondary font-light lowercase ml-1">e.g. wall prep</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-xs font-bold text-brand-navy">₹</span>
            <input
              type="number"
              min="0"
              step="any"
              value={additional || ''}
              onChange={(e) => onChange(transport, parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-brand-navy/15 py-3 pl-8 pr-4 text-xs font-bold text-brand-navy focus:border-brand-orange focus:outline-none bg-white"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
