import React from 'react';
import { CalculationResult, ProductCategory } from '../types/calculator';

interface LiveCalculationSummaryProps {
  category: ProductCategory;
  results: CalculationResult;
  wastage: number;
}

export const LiveCalculationSummary: React.FC<LiveCalculationSummaryProps> = ({
  category,
  results,
  wastage,
}) => {
  const {
    totalAreaSqFt,
    totalAreaSqM,
    totalDeductionSqFt,
    netAreaSqFt,
    wastageAreaSqFt,
    finalRequiredCoverageSqFt,
  } = results;

  const showDeductions = category === 'Wallpapers' || category === 'Wall Panels';

  return (
    <div className="bg-white rounded-2xl border border-brand-navy/10 p-4 shadow-xs space-y-3" id="calc-live-summary">
      <div className="border-b border-brand-navy/5 pb-1.5 flex items-center justify-between">
        <div>
          <span className="text-[9px] font-bold text-brand-orange uppercase tracking-wider block">
            Live Area Calculations
          </span>
          <h3 className="font-display text-xs font-extrabold text-brand-navy">
            Real-Time Sizing Insights
          </h3>
        </div>
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 border border-emerald-100">
          ● Live updates
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs">
        <div className="flex flex-col">
          <span className="text-brand-secondary text-[9px] uppercase font-bold tracking-wider">Gross Measured Area</span>
          <span className="font-bold text-brand-navy font-mono mt-0.5">
            {totalAreaSqFt.toFixed(1)} <span className="text-[9px] font-normal text-brand-secondary font-sans">sq.ft</span>
          </span>
        </div>

        {showDeductions && (
          <div className="flex flex-col">
            <span className="text-brand-secondary text-[9px] uppercase font-bold tracking-wider">Opening Deductions</span>
            <span className="font-bold text-red-500 font-mono mt-0.5">
              -{totalDeductionSqFt.toFixed(1)} <span className="text-[9px] font-normal text-brand-secondary font-sans">sq.ft</span>
            </span>
          </div>
        )}

        {showDeductions && (
          <div className="flex flex-col col-span-2 bg-brand-ivory/50 px-2 py-1 rounded-lg border border-brand-navy/5">
            <span className="text-brand-navy text-[9px] uppercase font-bold tracking-wider">Net Working Area</span>
            <span className="font-extrabold text-brand-navy font-mono mt-0.5 text-xs sm:text-sm">
              {netAreaSqFt.toFixed(1)} <span className="text-[10px] font-semibold text-brand-secondary font-sans">sq.ft</span>
            </span>
          </div>
        )}

        <div className="flex flex-col">
          <span className="text-brand-secondary text-[9px] uppercase font-bold tracking-wider">Wastage Buffer ({wastage}%)</span>
          <span className="font-bold text-brand-navy font-mono mt-0.5">
            +{wastageAreaSqFt.toFixed(1)} <span className="text-[9px] font-normal text-brand-secondary font-sans">sq.ft</span>
          </span>
        </div>

        <div className="flex flex-col bg-brand-navy/5 p-2 rounded-lg col-span-2 border border-brand-navy/5">
          <span className="text-brand-navy text-[9px] uppercase font-bold tracking-wider">Final Required Area</span>
          <span className="font-black text-brand-navy font-mono mt-0.5 text-sm sm:text-base">
            {finalRequiredCoverageSqFt.toFixed(1)} <span className="text-[10px] font-semibold text-brand-navy font-sans">sq.ft</span>
          </span>
        </div>
      </div>
    </div>
  );
};
