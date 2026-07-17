import React from 'react';
import { LayoutGrid, Grid } from 'lucide-react';
import { CalculatorState, CalculationResult } from '../types/calculator';
import { WallPanelVisualizer } from './WallPanelVisualizer';
import { WallpaperVisualizer } from './WallpaperVisualizer';
import { FlooringVisualizer } from './FlooringVisualizer';
import { GlassFilmVisualizer } from './GlassFilmVisualizer';
import { BlindVisualizer } from './BlindVisualizer';

interface CoverageVisualizerProps {
  state: CalculatorState;
  results: CalculationResult;
  onChange: (fields: any) => void;
  updateActiveWallIndex: (idx: number) => void;
}

export const CoverageVisualizer: React.FC<CoverageVisualizerProps> = ({
  state,
  results,
  onChange,
  updateActiveWallIndex,
}) => {
  const { category, rows } = state;
  const activeIdx = state.activeWallIndex ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-brand-navy/10 p-4 sm:p-5 shadow-xs space-y-4" id="coverage-visualizer-card">
      {/* Visualizer Title */}
      <div className="flex items-center justify-between border-b border-brand-navy/5 pb-3">
        <div className="flex items-center gap-2">
          <Grid className="h-5 w-5 text-brand-orange shrink-0" />
          <div>
            <h3 className="font-display font-extrabold text-sm text-brand-navy">
              Product Coverage Visualizer
            </h3>
            <p className="text-[10px] text-brand-secondary font-medium mt-0.5 leading-none">
              Interactive layout simulator for actual site coverage
            </p>
          </div>
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-md">
          {category === 'Wall Panels' ? 'Interactive 2D' : 'Simulated Layout'}
        </span>
      </div>

      {/* Multiple Wall Tab Selector Bar if rows.length > 1 */}
      {rows.length > 1 && (
        <div className="border-b border-brand-navy/10 flex flex-wrap gap-1 pb-1">
          {rows.map((row, index) => {
            const isSelected = index === activeIdx;
            return (
              <button
                key={row.id}
                type="button"
                onClick={() => updateActiveWallIndex(index)}
                className={`py-1.5 px-3.5 text-xs font-bold rounded-t-xl transition-all border-t border-x cursor-pointer ${
                  isSelected
                    ? 'border-brand-navy bg-white text-brand-navy shadow-xs z-10 -mb-[1.5px]'
                    : 'border-transparent bg-brand-ivory/40 text-brand-secondary hover:text-brand-navy'
                }`}
              >
                {row.label || `Area ${index + 1}`} ({row.width}×{row.height})
              </button>
            );
          })}
        </div>
      )}

      {/* Render matching category visualizer */}
      {category === 'Wall Panels' && (
        <WallPanelVisualizer state={state} results={results} onChange={onChange} />
      )}
      {category === 'Wallpapers' && (
        <WallpaperVisualizer state={state} results={results} />
      )}
      {category === 'Flooring' && (
        <FlooringVisualizer state={state} results={results} />
      )}
      {category === 'Glass Films' && (
        <GlassFilmVisualizer state={state} results={results} />
      )}
      {category === 'Blinds' && (
        <BlindVisualizer state={state} results={results} />
      )}
    </div>
  );
};
