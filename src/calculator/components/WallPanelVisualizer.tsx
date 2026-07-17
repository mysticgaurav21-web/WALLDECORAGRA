import React, { useState } from 'react';
import { Columns, Eye, Info, RefreshCw, Trash2, Sliders } from 'lucide-react';
import { CalculatorState, CalculationResult } from '../types/calculator';
import { calculatePanelLayout } from '../utils/panelLayoutMath';
import { formatCurrency } from '../utils/unitConversions';
import { PanelCell } from '../types/visualizer';

interface WallPanelVisualizerProps {
  state: CalculatorState;
  results: CalculationResult;
  onChange: (fields: any) => void;
}

export const WallPanelVisualizer: React.FC<WallPanelVisualizerProps> = ({ state, results, onChange }) => {
  const { productCoverage, rows, deductions, wastage, unit, reuseOffcuts } = state;
  const [hoveredCell, setHoveredCell] = useState<PanelCell | null>(null);

  const activeRowIdx = state.activeWallIndex ?? 0;
  const activeRow = rows[activeRowIdx] || rows[0] || { width: 10, height: 10, label: 'Wall 1' };

  // Convert wall dimension to feet for layout math
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

  const pWidth = productCoverage.panelWidth || 10;
  const pHeight = productCoverage.panelHeight || 120;
  const pUnit = productCoverage.panelUnit || 'Inches';
  const orientation = productCoverage.panelOrientation || 'Vertical';
  const gapWidth = productCoverage.jointGapWidth || 0;

  const layoutResult = calculatePanelLayout({
    wallWidth: wallWidthFt,
    wallHeight: wallHeightFt,
    panelWidth: pWidth,
    panelHeight: pHeight,
    panelUnit: pUnit,
    orientation,
    wastagePercent: wastage,
    jointGapWidth: gapWidth,
    reuseOffcuts,
    openings: deductions.map((d) => ({
      width: getWallDimInFeet(d.width),
      height: getWallDimInFeet(d.height),
      distanceLeft: d.distanceLeft || 0,
      distanceFloor: d.distanceFloor || 0,
      label: d.label,
    })),
  });

  const {
    panelWidthFt,
    panelHeightFt,
    cols,
    rows: visualRows,
    fullPanelsCount,
    cutPanelsCount,
    exactPanelsRequired,
    reusedOffcutsCount,
    cells,
    unusableWastageSqFt,
  } = layoutResult;

  // Format feet/inches helper
  const formatFtIn = (ft: number) => {
    const f = Math.floor(ft);
    const i = Math.round((ft - f) * 12);
    if (i === 0) return `${f} ft`;
    return `${f} ft ${i} in`;
  };

  // SVG Scaler coordinates
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

  const toSvgX = (x: number) => padding + (x / wallWidthFt) * renderWidth;
  const toSvgY = (y: number) => padding + (y / wallHeightFt) * renderHeight;
  const toSvgW = (w: number) => (w / wallWidthFt) * renderWidth;
  const toSvgH = (h: number) => (h / wallHeightFt) * renderHeight;

  return (
    <div className="space-y-4 font-sans" id="wall-panel-visualizer-container">
      {/* Offcut Reuse & Pattern settings toggles */}
      <div className="bg-brand-ivory/50 p-4 rounded-xl border border-brand-navy/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black text-brand-orange uppercase tracking-wider block">
            Offcut Recovery Engine
          </span>
          <span className="text-[11px] font-bold text-brand-navy block">
            Intelligent Reuse of Panel Leftovers
          </span>
          <span className="text-[9px] text-brand-secondary font-light block leading-normal max-w-md">
            When enabled, the layout engine calculates if leftover pieces from cut corners are tall/wide enough to fill other edge rows, reducing panel waste and purchase totals.
          </span>
        </div>
        <button
          type="button"
          onClick={() => onChange({ reuseOffcuts: !reuseOffcuts })}
          className={`px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            reuseOffcuts
              ? 'bg-brand-orange text-white border-brand-orange shadow-xs'
              : 'bg-white text-brand-navy border-brand-navy/15 hover:bg-brand-ivory/30'
          }`}
        >
          <RefreshCw className={`h-3 w-3 ${reuseOffcuts ? 'animate-spin' : ''}`} />
          {reuseOffcuts ? 'Offcuts Reused: ON' : 'Offcuts Reused: OFF'}
        </button>
      </div>

      {/* SVG Canvas and Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: SVG Layout Visualizer Map */}
        <div className="lg:col-span-7 bg-brand-ivory/20 rounded-xl border border-brand-navy/5 p-4 flex flex-col items-center justify-center min-h-[280px] relative select-none">
          <svg viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} className="w-full max-w-[340px] drop-shadow-xs h-auto">
            <defs>
              <pattern id="cutPanelStripe" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="4" height="8" fill="#fff7ed" />
                <rect x="4" width="4" height="8" fill="#ffedd5" />
                <line x1="0" y1="0" x2="0" y2="8" stroke="#f97316" strokeWidth="1.2" />
              </pattern>
              <pattern id="reusedStripe" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
                <rect width="4" height="8" fill="#ecfdf5" />
                <rect x="4" width="4" height="8" fill="#f0fdf4" />
                <line x1="0" y1="0" x2="0" y2="8" stroke="#10b981" strokeWidth="1.2" />
              </pattern>
            </defs>

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

            {/* Render Cells */}
            {cells.map((cell) => {
              const cx = toSvgX(cell.x);
              const cy = toSvgY(cell.y);
              const cw = toSvgW(cell.width);
              const ch = toSvgH(cell.height);
              const isHovered = hoveredCell?.id === cell.id;

              let cellFill = '#f1f5f9';
              let cellStroke = '#cbd5e1';

              if (cell.isOpening) {
                cellFill = '#e2e8f0';
                cellStroke = '#94a3b8';
              } else if (cell.isOffcutReused) {
                cellFill = 'url(#reusedStripe)';
                cellStroke = '#10b981';
              } else if (cell.isCut) {
                cellFill = 'url(#cutPanelStripe)';
                cellStroke = '#f97316';
              } else {
                // Standard full panel
                cellFill = '#dcfce7';
                cellStroke = '#16a34a';
              }

              return (
                <g
                  key={cell.id}
                  onMouseEnter={() => setHoveredCell(cell)}
                  onMouseLeave={() => setHoveredCell(null)}
                  className="cursor-help transition-all duration-150"
                >
                  <rect
                    x={cx}
                    y={cy}
                    width={cw}
                    height={ch}
                    fill={cellFill}
                    stroke={cellStroke}
                    strokeWidth={isHovered ? '2.5' : '1.2'}
                  />
                  {cw > 15 && ch > 15 && !cell.isOpening && (
                    <text
                      x={cx + cw / 2}
                      y={cy + ch / 2 + 3}
                      textAnchor="middle"
                      className={`font-mono text-[9px] font-extrabold ${
                        cell.isOffcutReused ? 'fill-emerald-800' : cell.isCut ? 'fill-orange-800' : 'fill-green-800'
                      }`}
                    >
                      {cell.isOffcutReused ? '♻️' : cell.label}
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

          {/* Hover Overlay */}
          {hoveredCell && (
            <div className="absolute bottom-2 left-2 right-2 bg-brand-navy text-white text-[10px] px-3 py-1.5 rounded-lg flex items-center justify-between shadow-md">
              <div>
                <span className="font-extrabold text-brand-orange">
                  {hoveredCell.isOpening ? 'Opening' : `Panel Grid ${hoveredCell.label}`}
                </span>
                :{' '}
                {hoveredCell.isOpening ? (
                  <span>Deduction Opening</span>
                ) : hoveredCell.isOffcutReused ? (
                  <span className="text-emerald-300">Reused Offcut Piece</span>
                ) : hoveredCell.isCut ? (
                  <span>Cut Piece ({formatFtIn(hoveredCell.cutWidth)} × {formatFtIn(hoveredCell.cutHeight)})</span>
                ) : (
                  <span>Full Standard Panel</span>
                )}
              </div>
              <span className="text-white/40 text-[8px]">Row {hoveredCell.rowIdx + 1}, Col {hoveredCell.colIdx + 1}</span>
            </div>
          )}
        </div>

        {/* Right: Technical Details Panel */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-brand-navy text-white p-4 rounded-xl border border-brand-navy/10 space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-brand-orange">
              Layout Breakdown
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/75">Grid Columns:</span>
                <span className="font-mono font-bold">{cols} panels</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/75">Full Panels:</span>
                <span className="font-mono font-bold text-emerald-400">{fullPanelsCount}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-white/75">Cut Panels:</span>
                <span className="font-mono font-bold text-brand-orange">{cutPanelsCount}</span>
              </div>
              {reuseOffcuts && (
                <div className="flex justify-between border-b border-white/10 pb-1 bg-white/5 px-2 py-0.5 rounded text-emerald-300">
                  <span>Recovered Offcuts:</span>
                  <span className="font-mono font-bold">-{reusedOffcutsCount} panels</span>
                </div>
              )}
              <div className="flex justify-between border-b border-white/10 pb-1 pt-1 text-white font-extrabold">
                <span>Panels Needed (This wall):</span>
                <span className="font-mono text-brand-orange text-sm">{exactPanelsRequired} sheets</span>
              </div>
            </div>
          </div>

          <div className="bg-brand-ivory/30 p-3 rounded-xl border border-brand-navy/5 text-[11px] text-brand-navy leading-normal space-y-1.5 font-light">
            <span className="font-extrabold text-[9px] uppercase tracking-wider text-brand-navy block">
              💡 Panel Fit Note
            </span>
            <p>
              Our layout calculator estimates <b>{exactPanelsRequired} sheets</b> are required to cover this wall. For an 11 ft wall, 14 panels are positioned across, and the leftovers are captured in the offcut ledger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
