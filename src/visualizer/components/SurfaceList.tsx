import React from 'react';
import { WallSurfaceId, WallSurface } from '../types/visualizer';

interface SurfaceListProps {
  selectedSurfaceId: WallSurfaceId;
  onSelectSurface: (id: WallSurfaceId) => void;
  surfaceWidthFt: number;
  surfaceHeightFt: number;
  
  // Custom Section Settings (for positioning on the feature wall)
  sectionSettings: {
    widthPercent: number;
    heightPercent: number;
    leftPercent: number;
    topPercent: number;
  };
  onUpdateSectionSettings: (settings: {
    widthPercent: number;
    heightPercent: number;
    leftPercent: number;
    topPercent: number;
  }) => void;
}

const SURFACE_ITEMS: { id: WallSurfaceId; name: string; icon: string; desc: string }[] = [
  {
    id: 'front-wall',
    name: '🖼️ Front Accent Wall',
    icon: '🧱',
    desc: 'The primary accent canvas. Best for UV sheets, designer panels, and fluted louver combos.'
  },
  {
    id: 'left-wall',
    name: '◀️ Left Side Wall',
    icon: '⬅️',
    desc: 'Side paint/covering panel. Adjusts perspective angle to review left corner installations.'
  },
  {
    id: 'right-wall',
    name: '▶️ Right Side Wall',
    icon: '➡️',
    desc: 'Opposing side panel. Fits side view configurations and overlaps.'
  },
  {
    id: 'floor',
    name: '🪵 Floor Board Area',
    icon: '🪵',
    desc: 'Durable flooring SPC planks, parquet layout grids, or laminate boards.'
  },
  {
    id: 'window',
    name: '🪟 Window Coverings',
    icon: '🪟',
    desc: 'Zebra blinds, motorized roller draperies, or custom window shades.'
  },
  {
    id: 'custom-section',
    name: '📐 Custom Wall Section',
    icon: '📐',
    desc: 'Target a specific portion of the front feature wall. Perfect for partial designs.'
  }
];

export const SurfaceList: React.FC<SurfaceListProps> = ({
  selectedSurfaceId,
  onSelectSurface,
  surfaceWidthFt,
  surfaceHeightFt,
  sectionSettings,
  onUpdateSectionSettings,
}) => {
  
  // Quick presets for custom sections
  const handleApplyPreset = (preset: 'full' | 'left' | 'centre' | 'right' | 'upper' | 'lower') => {
    switch (preset) {
      case 'full':
        onUpdateSectionSettings({ widthPercent: 100, heightPercent: 100, leftPercent: 0, topPercent: 0 });
        break;
      case 'left':
        onUpdateSectionSettings({ widthPercent: 33.3, heightPercent: 100, leftPercent: 0, topPercent: 0 });
        break;
      case 'centre':
        onUpdateSectionSettings({ widthPercent: 33.3, heightPercent: 100, leftPercent: 33.3, topPercent: 0 });
        break;
      case 'right':
        onUpdateSectionSettings({ widthPercent: 33.4, heightPercent: 100, leftPercent: 66.6, topPercent: 0 });
        break;
      case 'upper':
        onUpdateSectionSettings({ widthPercent: 100, heightPercent: 50, leftPercent: 0, topPercent: 50 });
        break;
      case 'lower':
        onUpdateSectionSettings({ widthPercent: 100, heightPercent: 50, leftPercent: 0, topPercent: 0 });
        break;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-brand-navy/10 shadow-xs space-y-4" id="surface-list-card">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
          <span>🎯</span> Select Target Installation Surface
        </h3>
        <span className="text-[10px] font-extrabold text-brand-navy bg-brand-navy/5 px-2 py-0.5 rounded-md">
          Active: {selectedSurfaceId.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {SURFACE_ITEMS.map((surf) => {
          const isSelected = selectedSurfaceId === surf.id;
          return (
            <button
              key={surf.id}
              onClick={() => onSelectSurface(surf.id)}
              className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange text-brand-navy shadow-xs'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
              id={`surf-btn-${surf.id}`}
            >
              <div className="text-xs font-black leading-tight flex items-center gap-1.5 mb-1">
                <span>{surf.icon}</span>
                <span>{surf.name}</span>
              </div>
              <div className="text-[9px] text-slate-400 leading-normal line-clamp-2">
                {surf.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* RENDER CUSTOM SELECTION CONTROLS ONLY IF CUSTOM-SECTION IS SELECTED */}
      {selectedSurfaceId === 'custom-section' && (
        <div className="mt-3 bg-brand-ivory/50 border border-brand-navy/5 rounded-xl p-4 space-y-3 animate-fade-in" id="custom-section-control-panel">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-brand-navy/5 pb-2">
            <div>
              <div className="text-xs font-black text-brand-navy">📐 Quick Target Section Templates</div>
              <p className="text-[9px] text-slate-400">Position your layered layout on specific areas of the accent wall.</p>
            </div>
          </div>

          {/* Quick Buttons Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            <button
              onClick={() => handleApplyPreset('full')}
              className="px-2 py-1.5 text-[9px] font-black rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition text-center"
            >
              Full Wall
            </button>
            <button
              onClick={() => handleApplyPreset('left')}
              className="px-2 py-1.5 text-[9px] font-black rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition text-center"
            >
              Left 1/3
            </button>
            <button
              onClick={() => handleApplyPreset('centre')}
              className="px-2 py-1.5 text-[9px] font-black rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition text-center"
            >
              Centre 1/3
            </button>
            <button
              onClick={() => handleApplyPreset('right')}
              className="px-2 py-1.5 text-[9px] font-black rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition text-center"
            >
              Right 1/3
            </button>
            <button
              onClick={() => handleApplyPreset('upper')}
              className="px-2 py-1.5 text-[9px] font-black rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition text-center"
            >
              Top Half
            </button>
            <button
              onClick={() => handleApplyPreset('lower')}
              className="px-2 py-1.5 text-[9px] font-black rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition text-center"
            >
              Bottom Half
            </button>
          </div>

          {/* Custom Sliders for Rectangle Definition */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-slate-500">
                <span>Width Scale:</span>
                <span>{Math.round(sectionSettings.widthPercent)}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={sectionSettings.widthPercent}
                onChange={(e) => onUpdateSectionSettings({ ...sectionSettings, widthPercent: parseFloat(e.target.value) })}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-slate-500">
                <span>Height Scale:</span>
                <span>{Math.round(sectionSettings.heightPercent)}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={sectionSettings.heightPercent}
                onChange={(e) => onUpdateSectionSettings({ ...sectionSettings, heightPercent: parseFloat(e.target.value) })}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-slate-500">
                <span>Left Position Offset:</span>
                <span>{Math.round(sectionSettings.leftPercent)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(0, 100 - sectionSettings.widthPercent)}
                value={sectionSettings.leftPercent}
                onChange={(e) => onUpdateSectionSettings({ ...sectionSettings, leftPercent: parseFloat(e.target.value) })}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-slate-500">
                <span>Top Position Offset:</span>
                <span>{Math.round(sectionSettings.topPercent)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(0, 100 - sectionSettings.heightPercent)}
                value={sectionSettings.topPercent}
                onChange={(e) => onUpdateSectionSettings({ ...sectionSettings, topPercent: parseFloat(e.target.value) })}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
              />
            </div>
          </div>
          <div className="text-[9px] text-brand-orange font-bold text-center">
            Target Canvas Area: {(surfaceWidthFt * (sectionSettings.widthPercent / 100)).toFixed(1)} ft × {(surfaceHeightFt * (sectionSettings.heightPercent / 100)).toFixed(1)} ft
          </div>
        </div>
      )}
    </div>
  );
};
