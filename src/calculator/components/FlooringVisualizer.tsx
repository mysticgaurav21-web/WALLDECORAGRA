import React from 'react';
import { HelpCircle, Info, LayoutGrid } from 'lucide-react';
import { CalculatorState, CalculationResult } from '../types/calculator';
import { calculateFlooringLayout } from '../utils/flooringLayoutMath';

interface FlooringVisualizerProps {
  state: CalculatorState;
  results: CalculationResult;
}

export const FlooringVisualizer: React.FC<FlooringVisualizerProps> = ({ state, results }) => {
  const { productCoverage, rows, unit } = state;

  const activeRowIdx = state.activeWallIndex ?? 0;
  const activeRow = rows[activeRowIdx] || rows[0] || { width: 12, height: 10 };

  const getWallDimInFeet = (val: number) => {
    switch (unit) {
      case 'Feet': return val;
      case 'Inches': return val / 12;
      case 'Metres': return val * 3.28084;
      case 'Centimetres': return val * 0.0328084;
      default: return val;
    }
  };

  const roomLength = getWallDimInFeet(activeRow.width);
  const roomBreadth = getWallDimInFeet(activeRow.height);

  const plankWInches = 8;
  const plankLFt = 4;
  const boxCoverage = productCoverage.coveragePerUnit || 18;

  const flooringRes = calculateFlooringLayout(
    roomLength,
    roomBreadth,
    plankWInches,
    plankLFt,
    boxCoverage,
    'Along room length'
  );

  const {
    rowsCount,
    colsCount,
    totalPlanks,
    exactBoxes,
    roundedBoxes,
  } = flooringRes;

  // SVG dimensions
  const padding = 35;
  const maxDim = 300;
  const ratio = roomBreadth / roomLength;
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
    <div className="space-y-4 font-sans" id="flooring-visualizer-container">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left SVG Room Outline */}
        <div className="lg:col-span-7 bg-brand-ivory/20 rounded-xl border border-brand-navy/5 p-4 flex flex-col items-center justify-center min-h-[280px]">
          <svg viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} className="w-full max-w-[340px] drop-shadow-xs h-auto">
            {/* Room Boundary */}
            <rect
              x={padding}
              y={padding}
              width={renderWidth}
              height={renderHeight}
              fill="#fafaf9"
              stroke="#78716c"
              strokeWidth="2.5"
            />

            {/* Simulated Grid of floor planks with offsets */}
            {Array.from({ length: rowsCount }).map((_, r) => {
              const plankH = renderHeight / rowsCount;
              const yPos = padding + r * plankH;

              // stagger effect on alternate rows
              const staggerOffset = (r % 2 === 0) ? 0 : 0.3 * (renderWidth / colsCount);

              return (
                <g key={r}>
                  {Array.from({ length: colsCount + 1 }).map((_, c) => {
                    const plankW = renderWidth / colsCount;
                    const xPos = padding + c * plankW - staggerOffset;

                    // Clip planks to room width bounds
                    const finalX = Math.max(padding, xPos);
                    const finalW = Math.min(padding + renderWidth - finalX, plankW - (xPos < padding ? padding - xPos : 0));

                    if (finalW <= 0) return null;

                    return (
                      <rect
                        key={c}
                        x={finalX}
                        y={yPos}
                        width={finalW}
                        height={plankH}
                        fill={c % 2 === 0 ? '#f5f5f4' : '#fafaf9'}
                        stroke="#d6d3d1"
                        strokeWidth="1"
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Room length label */}
            <line x1={padding} y1={padding - 12} x2={padding + renderWidth} y2={padding - 12} stroke="#1e3a8a" strokeWidth="1" />
            <text x={padding + renderWidth / 2} y={padding - 18} textAnchor="middle" className="text-[10px] font-extrabold fill-brand-navy">
              Length: {roomLength.toFixed(1)} ft
            </text>

            {/* Room breadth label */}
            <line x1={padding - 12} y1={padding} x2={padding - 12} y2={padding + renderHeight} stroke="#1e3a8a" strokeWidth="1" />
            <text
              x={padding - 18}
              y={padding + renderHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90 ${padding - 18} ${padding + renderHeight / 2})`}
              className="text-[10px] font-extrabold fill-brand-navy"
            >
              Breadth: {roomBreadth.toFixed(1)} ft
            </text>
          </svg>

          {/* Subtitle */}
          <div className="flex items-center gap-1.5 mt-3 text-[10px] text-brand-navy font-semibold">
            <LayoutGrid className="h-4 w-4 text-brand-orange" />
            <span>Staggered Brick Plank Alignment top view</span>
          </div>
        </div>

        {/* Right Info */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-brand-navy text-white p-4 rounded-xl space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-brand-orange">
              Floor Board Calculations
            </h4>
            <div className="space-y-1.5 text-xs font-medium">
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Estimated Plank Count:</span>
                <span className="font-mono font-bold text-emerald-400">~{totalPlanks} planks</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Required Coverage:</span>
                <span className="font-mono">{results.finalRequiredCoverageSqFt.toFixed(1)} sq.ft</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Coverage per Box:</span>
                <span className="font-mono">{boxCoverage} sq.ft / box</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/70">Exact Boxes Needed:</span>
                <span className="font-mono">{exactBoxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1 text-white font-extrabold text-sm">
                <span>Recommended Box Qty:</span>
                <span className="font-mono text-brand-orange">{roundedBoxes} boxes</span>
              </div>
            </div>
          </div>

          <div className="bg-brand-ivory/30 p-3 rounded-xl border border-brand-navy/5 text-[11px] text-brand-navy font-light leading-relaxed">
            <span className="font-extrabold text-[9px] uppercase tracking-wider text-brand-navy block mb-1">
              🔧 Installer Tip
            </span>
            Planks are staggered by 1/3 of their length on consecutive rows to prevent continuous joint weaknesses and look elegant. Always buy 8% extra for end cuts.
          </div>
        </div>
      </div>
    </div>
  );
};
