import React from 'react';
import { HelpCircle, Info, Layers } from 'lucide-react';
import { CalculatorState, CalculationResult } from '../types/calculator';
import { calculateWallpaperRolls } from '../utils/wallpaperRollMath';

interface WallpaperVisualizerProps {
  state: CalculatorState;
  results: CalculationResult;
}

export const WallpaperVisualizer: React.FC<WallpaperVisualizerProps> = ({ state, results }) => {
  const { productCoverage, rows, unit, installationPattern } = state;

  const activeRowIdx = state.activeWallIndex ?? 0;
  const activeRow = rows[activeRowIdx] || rows[0] || { width: 10, height: 10 };

  const getWallDimInFeet = (val: number) => {
    switch (unit) {
      case 'Feet': return val;
      case 'Inches': return val / 12;
      case 'Metres': return val * 3.28084;
      case 'Centimetres': return val * 0.0328084;
      default: return val;
    }
  };

  const wallWidthFt = getWallDimInFeet(activeRow.width);
  const wallHeightFt = getWallDimInFeet(activeRow.height);

  const rollW = productCoverage.width || 1.75; // 21 inches
  const rollL = productCoverage.height || 33.0; // 33 feet
  const repeatInches = 21; // standard repeat

  const wallpaperRes = calculateWallpaperRolls(
    wallWidthFt,
    wallHeightFt,
    rollW,
    rollL,
    repeatInches,
    installationPattern
  );

  const {
    stripsNeeded,
    stripsPerRoll,
    rollsRequired,
    patternRepeatFt,
    cutLossPerStripFt,
    dropLengthFt,
  } = wallpaperRes;

  // Render SVG
  const padding = 35;
  const maxDim = 300;
  const ratio = wallHeightFt / wallWidthFt;
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

  // Strips array for SVG rendering
  const strips: Array<{ x: number; w: number }> = [];
  for (let s = 0; s < stripsNeeded; s++) {
    const startX = s * rollW;
    const stripW = Math.min(rollW, wallWidthFt - startX);
    if (stripW > 0) {
      strips.push({ x: startX, w: stripW });
    }
  }

  const formatFtIn = (ft: number) => {
    const f = Math.floor(ft);
    const i = Math.round((ft - f) * 12);
    if (i === 0) return `${f} ft`;
    return `${f} ft ${i} in`;
  };

  return (
    <div className="space-y-4 font-sans" id="wallpaper-visualizer-container">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left SVG container */}
        <div className="lg:col-span-7 bg-brand-ivory/20 rounded-xl border border-brand-navy/5 p-4 flex flex-col items-center justify-center min-h-[280px]">
          <svg viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} className="w-full max-w-[340px] drop-shadow-xs h-auto">
            {/* Wall Outline */}
            <rect
              x={padding}
              y={padding}
              width={renderWidth}
              height={renderHeight}
              fill="#f8fafc"
              stroke="#64748b"
              strokeWidth="2.5"
            />

            {/* Strips vertical layout */}
            {strips.map((strip, index) => {
              const cx = padding + (strip.x / wallWidthFt) * renderWidth;
              const cy = padding;
              const cw = (strip.w / wallWidthFt) * renderWidth;
              const ch = renderHeight;

              return (
                <g key={index}>
                  <rect
                    x={cx}
                    y={cy}
                    width={cw}
                    height={ch}
                    fill={index % 2 === 0 ? '#eff6ff' : '#f8fafc'}
                    stroke="#2563eb"
                    strokeWidth="1.2"
                    strokeOpacity="0.4"
                  />
                  {/* Pattern lines inside strip to simulate wallpaper rolls */}
                  <line
                    x1={cx}
                    y1={cy + ch * 0.3}
                    x2={cx + cw}
                    y2={cy + ch * 0.3}
                    stroke="#3b82f6"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    strokeOpacity="0.3"
                  />
                  <line
                    x1={cx}
                    y1={cy + ch * 0.6}
                    x2={cx + cw}
                    y2={cy + ch * 0.6}
                    stroke="#3b82f6"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    strokeOpacity="0.3"
                  />
                  {cw > 15 && (
                    <text
                      x={cx + cw / 2}
                      y={cy + ch / 2}
                      textAnchor="middle"
                      className="text-[9px] font-mono font-extrabold fill-blue-900"
                    >
                      D{index + 1}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Width dimension label */}
            <line x1={padding} y1={padding - 12} x2={padding + renderWidth} y2={padding - 12} stroke="#1e3a8a" strokeWidth="1" />
            <text x={padding + renderWidth / 2} y={padding - 18} textAnchor="middle" className="text-[10px] font-extrabold fill-brand-navy">
              W: {formatFtIn(wallWidthFt)}
            </text>

            {/* Height dimension label */}
            <line x1={padding - 12} y1={padding} x2={padding - 12} y2={padding + renderHeight} stroke="#1e3a8a" strokeWidth="1" />
            <text
              x={padding - 18}
              y={padding + renderHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90 ${padding - 18} ${padding + renderHeight / 2})`}
              className="text-[10px] font-extrabold fill-brand-navy"
            >
              H: {formatFtIn(wallHeightFt)}
            </text>
          </svg>

          {/* Subtitle details */}
          <div className="flex items-center gap-1.5 mt-3 text-[10px] text-brand-navy font-semibold">
            <div className="h-3.5 w-6 rounded border border-blue-400 bg-blue-50/50" />
            <span>Wallpaper Vertical Drops (D1, D2, D3...)</span>
          </div>
        </div>

        {/* Right Details */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-brand-navy text-white p-4 rounded-xl space-y-2.5">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-brand-orange">
              Wallpaper Roll Formulas
            </h4>
            <div className="space-y-1.5 text-xs font-medium">
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Wall Width:</span>
                <span className="font-mono">{formatFtIn(wallWidthFt)}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Standard Roll Width:</span>
                <span className="font-mono">{formatFtIn(rollW)}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Drops Across Width:</span>
                <span className="font-mono font-bold text-brand-orange">{stripsNeeded} drops</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Pattern Repeat:</span>
                <span className="font-mono">21 inches ({formatFtIn(patternRepeatFt)})</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Individual Drop Length:</span>
                <span className="font-mono text-emerald-300 font-bold">{formatFtIn(dropLengthFt)}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Pattern Cut Loss/Drop:</span>
                <span className="font-mono text-red-300">{formatFtIn(cutLossPerStripFt)}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Drops per Roll:</span>
                <span className="font-mono">{stripsPerRoll} drops / roll</span>
              </div>
              <div className="flex justify-between pt-1 text-white font-extrabold text-sm">
                <span>Rolls Required:</span>
                <span className="font-mono text-brand-orange">{rollsRequired} rolls</span>
              </div>
            </div>
          </div>

          <div className="bg-brand-ivory/30 p-3 rounded-xl border border-brand-navy/5 text-[11px] text-brand-navy font-light leading-relaxed">
            <span className="font-extrabold text-[9px] uppercase tracking-wider text-brand-navy block mb-1">
              📋 Industry Standard Drop Fitting
            </span>
            Our formula adjusts individual strip drops up to the nearest pattern repeat (straight or offset) so patterns align perfectly across panels during wall hanger glue setups.
          </div>
        </div>
      </div>
    </div>
  );
};
