import React from 'react';
import { HelpCircle, Info, Maximize } from 'lucide-react';
import { CalculatorState, CalculationResult } from '../types/calculator';
import { calculateBlindLayout } from '../utils/blindMath';

interface BlindVisualizerProps {
  state: CalculatorState;
  results: CalculationResult;
}

export const BlindVisualizer: React.FC<BlindVisualizerProps> = ({ state, results }) => {
  const { rows, unit, measurementType } = state;

  const activeRowIdx = state.activeWallIndex ?? 0;
  const activeRow = rows[activeRowIdx] || rows[0] || { width: 4, height: 5 };

  const getWallDimInFeet = (val: number) => {
    switch (unit) {
      case 'Feet': return val;
      case 'Inches': return val / 12;
      case 'Metres': return val * 3.28084;
      case 'Centimetres': return val * 0.0328084;
      default: return val;
    }
  };

  const windowW = getWallDimInFeet(activeRow.width);
  const windowH = getWallDimInFeet(activeRow.height);

  const isInside = measurementType === 'Inside Mount';
  const layout = calculateBlindLayout(windowW, windowH, isInside);

  const { finalWidthInches, finalHeightInches, areaSqFt, minChargeableAreaApplied } = layout;

  // SVG parameters
  const padding = 35;
  const maxDim = 300;
  const ratio = windowH / windowW;
  let renderWidth = maxDim;
  let renderHeight = maxDim * ratio;

  if (ratio > 1.2) {
    renderHeight = maxDim;
    renderWidth = maxDim / ratio;
  }
  renderWidth = Math.max(120, renderWidth);
  renderHeight = Math.max(120, renderHeight);

  const viewBoxW = renderWidth + padding * 2;
  const viewBoxH = renderHeight + padding * 2;

  // Blind overlap borders
  const blindOffsetW = isInside ? -2 : 12;
  const blindOffsetH = isInside ? 0 : 12;

  return (
    <div className="space-y-4 font-sans" id="blind-visualizer-container">
      {minChargeableAreaApplied && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-xl flex items-start gap-2 text-[11px] font-semibold leading-relaxed animate-fade-in">
          <Info className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span>Min Chargeable Area Rule (12 sq.ft Applied)</span>
            <p className="font-medium text-blue-700/90 mt-0.5">
              The window area is smaller than the manufacturer’s minimum billing size. The price is calculated using the minimum standard 12 sq.ft.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Window Visualizer Map */}
        <div className="lg:col-span-7 bg-brand-ivory/20 rounded-xl border border-brand-navy/5 p-4 flex flex-col items-center justify-center min-h-[280px]">
          <svg viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} className="w-full max-w-[340px] drop-shadow-xs h-auto">
            {/* Window Frame Outline */}
            <rect
              x={padding}
              y={padding}
              width={renderWidth}
              height={renderHeight}
              fill="#f1f5f9"
              stroke="#475569"
              strokeWidth="4"
            />

            {/* Window Glass Panes Grid lines */}
            <line x1={padding + renderWidth / 2} y1={padding} x2={padding + renderWidth / 2} y2={padding + renderHeight} stroke="#cbd5e1" strokeWidth="2" />
            <line x1={padding} y1={padding + renderHeight / 2} x2={padding + renderWidth} y2={padding + renderHeight / 2} stroke="#cbd5e1" strokeWidth="2" />

            {/* Blind covering overlap overlay */}
            <rect
              x={padding - (isInside ? 1 : 10)}
              y={padding - (isInside ? 0 : 10)}
              width={renderWidth + (isInside ? 2 : 20)}
              height={renderHeight * 0.7 + (isInside ? 0 : 10)} // halfway drawn blinds
              fill="#fed7aa"
              fillOpacity="0.8"
              stroke="#f97316"
              strokeWidth="1.5"
            />

            {/* Horizontal blind slats slits lines */}
            {Array.from({ length: 8 }).map((_, idx) => {
              const slatY = padding - (isInside ? 0 : 10) + ((renderHeight * 0.7 + (isInside ? 0 : 10)) / 8) * idx;
              return (
                <line
                  key={idx}
                  x1={padding - (isInside ? 1 : 10)}
                  y1={slatY}
                  x2={padding + renderWidth + (isInside ? 1 : 10)}
                  y2={slatY}
                  stroke="#ea580c"
                  strokeWidth="0.8"
                  strokeOpacity="0.4"
                />
              );
            })}

            {/* Width and Height label */}
            <line x1={padding} y1={padding - 12} x2={padding + renderWidth} y2={padding - 12} stroke="#1e3a8a" strokeWidth="1" />
            <text x={padding + renderWidth / 2} y={padding - 18} textAnchor="middle" className="text-[10px] font-extrabold fill-brand-navy">
              W: {windowW.toFixed(1)} ft
            </text>

            <line x1={padding - 12} y1={padding} x2={padding - 12} y2={padding + renderHeight} stroke="#1e3a8a" strokeWidth="1" />
            <text
              x={padding - 18}
              y={padding + renderHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90 ${padding - 18} ${padding + renderHeight / 2})`}
              className="text-[10px] font-extrabold fill-brand-navy"
            >
              H: {windowH.toFixed(1)} ft
            </text>
          </svg>

          {/* Legend */}
          <div className="flex gap-4 mt-3 text-[10px] font-semibold text-brand-navy">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-4 rounded bg-slate-100 border border-slate-400" />
              <span>Window Frame</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-4 rounded bg-orange-100 border border-orange-500" />
              <span>Blind Cover ({isInside ? 'Inside Mount' : 'Outside Overlap'})</span>
            </div>
          </div>
        </div>

        {/* Right Info */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-brand-navy text-white p-4 rounded-xl space-y-2.5">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-brand-orange">
              Blind Specifications
            </h4>
            <div className="space-y-1.5 text-xs font-medium">
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Mount Preference:</span>
                <span>{isInside ? 'Inside casing' : 'Outside overlap'}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Calculated Width:</span>
                <span className="font-mono text-brand-orange font-bold">{(finalWidthInches).toFixed(1)} inches</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Calculated Height:</span>
                <span className="font-mono text-brand-orange font-bold">{(finalHeightInches).toFixed(1)} inches</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Chargeable Area:</span>
                <span className="font-mono text-emerald-300 font-extrabold">{areaSqFt.toFixed(1)} sq.ft</span>
              </div>
            </div>
          </div>

          <div className="bg-brand-ivory/30 p-3 rounded-xl border border-brand-navy/5 text-[11px] text-brand-navy font-light leading-relaxed">
            <span className="font-extrabold text-[9px] uppercase tracking-wider text-brand-navy block mb-1">
              📏 Inside vs Outside Rules
            </span>
            <b>Inside Mount</b> locks blinds flush with window molding (perfect for modern recess frames). <b>Outside Mount</b> extends 2 inches beyond borders for absolute blackout seals and blocks halo leakages.
          </div>
        </div>
      </div>
    </div>
  );
};
