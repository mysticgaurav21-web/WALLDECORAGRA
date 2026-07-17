import React from 'react';
import { AlertTriangle, HelpCircle, Info } from 'lucide-react';
import { CalculatorState, CalculationResult } from '../types/calculator';
import { calculateGlassFilmLayout } from '../utils/glassFilmMath';

interface GlassFilmVisualizerProps {
  state: CalculatorState;
  results: CalculationResult;
}

export const GlassFilmVisualizer: React.FC<GlassFilmVisualizerProps> = ({ state, results }) => {
  const { rows, unit } = state;

  const activeRowIdx = state.activeWallIndex ?? 0;
  const activeRow = rows[activeRowIdx] || rows[0] || { width: 6, height: 4 };

  const getWallDimInFeet = (val: number) => {
    switch (unit) {
      case 'Feet': return val;
      case 'Inches': return val / 12;
      case 'Metres': return val * 3.28084;
      case 'Centimetres': return val * 0.0328084;
      default: return val;
    }
  };

  const glassW = getWallDimInFeet(activeRow.width);
  const glassH = getWallDimInFeet(activeRow.height);

  const filmWInches = 36; // 3 feet wide
  const layout = calculateGlassFilmLayout(glassW, glassH, filmWInches);

  const { stripsCount, needsSeam, filmWidthFt } = layout;

  // SVG Scalers
  const padding = 35;
  const maxDim = 300;
  const ratio = glassH / glassW;
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

  return (
    <div className="space-y-4 font-sans" id="glass-film-visualizer-container">
      {needsSeam && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl flex items-start gap-2 text-[11px] font-semibold leading-relaxed">
          <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span>⚠️ Seam Joint Warning (Wide Panel)</span>
            <p className="font-medium text-amber-700/90 mt-0.5">
              The window width ({glassW.toFixed(1)} ft) exceeds the standard film roll width ({filmWidthFt} ft). The installer will need to merge <b>{stripsCount} vertical strips</b> together, creating seams.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left SVG Glass Pane */}
        <div className="lg:col-span-7 bg-brand-ivory/20 rounded-xl border border-brand-navy/5 p-4 flex flex-col items-center justify-center min-h-[280px]">
          <svg viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} className="w-full max-w-[340px] drop-shadow-xs h-auto">
            {/* Glass Boundary */}
            <rect
              x={padding}
              y={padding}
              width={renderWidth}
              height={renderHeight}
              fill="#ecfeff"
              stroke="#06b6d4"
              strokeWidth="2.5"
            />

            {/* Glass Sheen Accents */}
            <line x1={padding + 10} y1={padding + 10} x2={padding + renderWidth - 10} y2={padding + renderHeight - 10} stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.4" />
            <line x1={padding + 40} y1={padding + 10} x2={padding + renderWidth - 10} y2={padding + renderHeight - 40} stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.2" />

            {/* Vertical Seams */}
            {Array.from({ length: stripsCount - 1 }).map((_, idx) => {
              const seamX = padding + ((idx + 1) * filmWidthFt / glassW) * renderWidth;
              return (
                <g key={idx}>
                  <line
                    x1={seamX}
                    y1={padding}
                    x2={seamX}
                    y2={padding + renderHeight}
                    stroke="#dc2626"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={seamX + 5}
                    y={padding + 20}
                    className="text-[7px] font-mono font-bold fill-red-600"
                  >
                    Seam {idx + 1}
                  </text>
                </g>
              );
            })}

            {/* Width label */}
            <line x1={padding} y1={padding - 12} x2={padding + renderWidth} y2={padding - 12} stroke="#1e3a8a" strokeWidth="1" />
            <text x={padding + renderWidth / 2} y={padding - 18} textAnchor="middle" className="text-[10px] font-extrabold fill-brand-navy">
              W: {glassW.toFixed(1)} ft
            </text>

            {/* Height label */}
            <line x1={padding - 12} y1={padding} x2={padding - 12} y2={padding + renderHeight} stroke="#1e3a8a" strokeWidth="1" />
            <text
              x={padding - 18}
              y={padding + renderHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90 ${padding - 18} ${padding + renderHeight / 2})`}
              className="text-[10px] font-extrabold fill-brand-navy"
            >
              H: {glassH.toFixed(1)} ft
            </text>
          </svg>
        </div>

        {/* Right Info */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-brand-navy text-white p-4 rounded-xl space-y-2.5">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-brand-orange">
              Glass Film Parameters
            </h4>
            <div className="space-y-1.5 text-xs font-medium">
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Glass Width:</span>
                <span className="font-mono">{glassW.toFixed(1)} ft</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Roll Width:</span>
                <span className="font-mono">{filmWidthFt} ft (36")</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Strips Needed:</span>
                <span className="font-mono font-bold text-brand-orange">{stripsCount} strips</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Requires Seaming:</span>
                <span className={`font-mono font-bold ${needsSeam ? 'text-amber-300' : 'text-emerald-400'}`}>
                  {needsSeam ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-brand-ivory/30 p-3 rounded-xl border border-brand-navy/5 text-[11px] text-brand-navy font-light leading-relaxed">
            <span className="font-extrabold text-[9px] uppercase tracking-wider text-brand-navy block mb-1">
              🧼 Installation Guide
            </span>
            Installer will wet-spray the glass with mild soapy water first, peel the backing, slide the film into place, squeeze out water, and trim the excess edges.
          </div>
        </div>
      </div>
    </div>
  );
};
