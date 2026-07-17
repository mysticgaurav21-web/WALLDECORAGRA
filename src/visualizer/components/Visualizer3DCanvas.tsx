import React, { useState, useMemo } from 'react';
import { Product } from '../../types';
import { WallSurfaceId, RoomPresetId, ProductLayerState } from '../types/visualizer';
import { getProductPhysicalSize } from '../utils/visualizerMath';

interface Visualizer3DCanvasProps {
  roomPresetId: RoomPresetId;
  roomWidthFt: number;
  roomLengthFt: number;
  roomHeightFt: number;
  selectedSurfaceId: WallSurfaceId;
  onSelectSurface?: (id: WallSurfaceId) => void;
  layers: ProductLayerState[];
  comparisonSplitPercent?: number; // 0 to 100
  showComparison?: boolean;
}

// Helper to resolve texture image URL
const getProductImageUrl = (product: Product) => {
  return product.visualizer?.textureUrl || product.textureImage || product.mainImage || '';
};

// Helper to calculate repeating background style based on actual physical dimensions
const getTextureStyle = (
  layer: ProductLayerState,
  surfaceWidthFt: number,
  surfaceHeightFt: number
) => {
  const imageUrl = getProductImageUrl(layer.product);
  if (!imageUrl) {
    // Fallback solid colors if no image url is found
    const code = layer.product.productCode.toUpperCase();
    let color = '#cbd5e1'; // gray
    if (code.includes('WP')) color = '#ebdcb9'; // wallpaper cream
    if (code.includes('WPC') || code.includes('PN')) color = '#c084fc'; // purple panels
    if (code.includes('UV') || code.includes('MB')) color = '#f1f5f9'; // marble white
    if (code.includes('FL')) color = '#b7791f'; // wood floor
    return { backgroundColor: color };
  }

  // Get physical sizes, fallback if undefined
  const pSize = getProductPhysicalSize(layer.product);
  const pW = pSize.widthFt || 1.5;
  const pH = pSize.heightFt || 4;

  const isHorizontal = layer.orientation === 'horizontal';
  const effectiveScale = layer.scale || 1;

  // Calculate percentage of the parent surface that one tile occupies
  const tileWFt = (isHorizontal ? pH : pW) * effectiveScale;
  const tileHFt = (isHorizontal ? pW : pH) * effectiveScale;

  const sizeW = (tileWFt / surfaceWidthFt) * 100;
  const sizeH = (tileHFt / surfaceHeightFt) * 100;

  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundRepeat: 'repeat' as const,
    backgroundPosition: 'center center',
    backgroundSize: `${sizeW.toFixed(2)}% ${sizeH.toFixed(2)}%`,
    width: '100%',
    height: '100%',
  };
};

export const Visualizer3DCanvas: React.FC<Visualizer3DCanvasProps> = ({
  roomPresetId,
  roomWidthFt,
  roomLengthFt,
  roomHeightFt,
  selectedSurfaceId,
  onSelectSurface,
  layers,
  comparisonSplitPercent = 50,
  showComparison = false,
}) => {
  const [viewMode, setViewMode] = useState<'front' | 'left' | 'right' | 'floor' | 'window'>('front');
  const [showFurniture, setShowFurniture] = useState(true);

  // Sync viewMode if active selectedSurfaceId changes
  React.useEffect(() => {
    if (selectedSurfaceId === 'left-wall') setViewMode('left');
    else if (selectedSurfaceId === 'right-wall') setViewMode('right');
    else if (selectedSurfaceId === 'floor') setViewMode('floor');
    else if (selectedSurfaceId === 'window') setViewMode('window');
    else if (selectedSurfaceId === 'custom-section' || selectedSurfaceId === 'front-wall') {
      setViewMode('front');
    }
  }, [selectedSurfaceId]);

  // Helper to filter and render layers onto a 2D surface
  const renderLayers2D = (surfaceId: WallSurfaceId, wFt: number, hFt: number, isComparisonBase: boolean = false) => {
    const matchedLayers = layers.filter((l) => {
      if (!l.visible) return false;

      // 1. Explicit surface matching
      if (l.surfaceId) {
        return l.surfaceId === surfaceId;
      }

      // 2. ID matching standard surfaces
      const standardSurfaces = ['front-wall', 'left-wall', 'right-wall', 'floor', 'window', 'custom-section'];
      if (standardSurfaces.includes(l.id)) {
        return l.id === surfaceId;
      }

      // 3. Fallback: custom sections and default layers render on front-wall
      return surfaceId === 'front-wall';
    });

    if (matchedLayers.length === 0) {
      // Return beautiful clean paint fallback
      let baseColor = '#e2e8f0'; // Default gray plaster
      if (surfaceId === 'left-wall' || surfaceId === 'right-wall') baseColor = '#ebdcb9'; // Warm tan paint
      if (surfaceId === 'floor') baseColor = '#edd8c1'; // Oak wood tone floor
      if (surfaceId === 'window') baseColor = '#f8fafc'; // Clean window glass
      return <div className="w-full h-full" style={{ backgroundColor: baseColor }} />;
    }

    return (
      <div className="absolute inset-0 overflow-hidden w-full h-full select-none">
        {matchedLayers.map((layer) => {
          // Calculate sizing and position offsets
          const widthPct = layer.widthPercent ?? 100;
          const heightPct = layer.heightPercent ?? 100;
          const leftPct = layer.leftPercent ?? 0;
          const topPct = layer.topPercent ?? 0;

          const containerStyle: React.CSSProperties = {
            position: 'absolute',
            width: `${widthPct}%`,
            height: `${heightPct}%`,
            left: `${leftPct}%`,
            top: `${topPct}%`,
            zIndex: layer.zIndex ?? 1,
            overflow: 'hidden',
          };

          return (
            <div key={layer.id} style={containerStyle}>
              <div style={getTextureStyle(layer, wFt * (widthPct / 100), hFt * (heightPct / 100))} />
            </div>
          );
        })}
      </div>
    );
  };

  // Furniture SVG elements for realistic overlays
  const renderFurniture = () => {
    if (!showFurniture) return null;

    switch (roomPresetId) {
      case 'living-room':
        return (
          <div className="absolute inset-x-0 bottom-0 h-[38%] pointer-events-none z-20 flex flex-col justify-end items-center px-8">
            <svg viewBox="0 0 800 240" className="w-[85%] h-auto drop-shadow-2xl">
              {/* Modern Minimalist Sofa */}
              {/* Back cushions */}
              <rect x="150" y="50" width="240" height="100" rx="16" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              <rect x="410" y="50" width="240" height="100" rx="16" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              {/* Left/Right Pillows */}
              <rect x="170" y="80" width="70" height="70" rx="8" fill="#f97316" opacity="0.9" transform="rotate(-10 205 115)" />
              <rect x="560" y="80" width="70" height="70" rx="8" fill="#38bdf8" opacity="0.9" transform="rotate(10 595 115)" />
              {/* Arm rests */}
              <rect x="100" y="90" width="60" height="110" rx="12" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
              <rect x="640" y="90" width="60" height="110" rx="12" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
              {/* Seating cushions */}
              <rect x="155" y="130" width="240" height="65" rx="12" fill="#334155" stroke="#475569" strokeWidth="2" />
              <rect x="405" y="130" width="240" height="65" rx="12" fill="#334155" stroke="#475569" strokeWidth="2" />
              {/* Sofa legs */}
              <rect x="130" y="200" width="16" height="30" rx="4" fill="#78350f" />
              <rect x="380" y="200" width="16" height="25" rx="4" fill="#78350f" />
              <rect x="420" y="200" width="16" height="25" rx="4" fill="#78350f" />
              <rect x="654" y="200" width="16" height="30" rx="4" fill="#78350f" />
              {/* Cozy Coffee Table in front */}
              <ellipse cx="400" cy="225" rx="110" ry="15" fill="#000" opacity="0.3" />
              <rect x="320" y="215" width="160" height="10" rx="5" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
              <line x1="340" y1="225" x2="330" y2="240" stroke="#1e293b" strokeWidth="4" />
              <line x1="460" y1="225" x2="470" y2="240" stroke="#1e293b" strokeWidth="4" />
            </svg>
          </div>
        );
      case 'bedroom':
        return (
          <div className="absolute inset-x-0 bottom-0 h-[45%] pointer-events-none z-20 flex flex-col justify-end items-center px-12">
            <svg viewBox="0 0 800 280" className="w-[82%] h-auto drop-shadow-2xl">
              {/* Wooden Headboard */}
              <rect x="180" y="60" width="440" height="160" rx="12" fill="#78350f" stroke="#451a03" strokeWidth="3" />
              {/* Pillows */}
              <rect x="220" y="110" width="160" height="70" rx="14" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
              <rect x="420" y="110" width="160" height="70" rx="14" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
              {/* Accent bolster pillows */}
              <rect x="260" y="150" width="100" height="40" rx="8" fill="#f97316" />
              <rect x="440" y="150" width="100" height="40" rx="8" fill="#f97316" />
              {/* Mattress and Sheets */}
              <rect x="190" y="170" width="420" height="90" rx="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
              {/* Comfy Duvet cover folded back */}
              <rect x="190" y="195" width="420" height="65" rx="8" fill="#0284c7" />
              <path d="M 190 195 Q 400 180 610 195" stroke="#0284c7" strokeWidth="5" fill="#0284c7" />
              {/* Bedside stand on left */}
              <rect x="80" y="160" width="80" height="100" rx="6" fill="#1e293b" stroke="#0f172a" />
              <circle cx="120" cy="185" r="5" fill="#f59e0b" />
              {/* Bedside lamp glowing */}
              <path d="M 105 160 L 135 160 L 145 130 L 95 130 Z" fill="#fef08a" opacity="0.8" />
              <rect x="117" y="160" width="6" height="10" fill="#f59e0b" />
            </svg>
          </div>
        );
      case 'tv-wall':
        return (
          <div className="absolute inset-x-0 bottom-0 h-[42%] pointer-events-none z-20 flex flex-col justify-end items-center px-10">
            <svg viewBox="0 0 800 260" className="w-[85%] h-auto drop-shadow-2xl">
              {/* Floor Media Console */}
              <rect x="100" y="190" width="600" height="50" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              {/* Glass shelves inside console */}
              <line x1="120" y1="215" x2="680" y2="215" stroke="#475569" strokeWidth="2" />
              <rect x="160" y="200" width="100" height="15" rx="4" fill="#0f172a" /> {/* TV Receiver */}
              <rect x="540" y="200" width="80" height="30" rx="4" fill="#334155" /> {/* Decor box */}
              {/* Mounted TV Screen */}
              <rect x="200" y="40" width="400" height="130" rx="8" fill="#0f172a" stroke="#1e293b" strokeWidth="5" />
              {/* TV Screen Reflection Glow */}
              <path d="M 200 40 L 400 40 L 200 170 Z" fill="#ffffff" opacity="0.04" />
              {/* Modern Soundbar */}
              <rect x="320" y="177" width="160" height="8" rx="4" fill="#000000" />
              {/* Tall Floor Plant on the right */}
              <path d="M 720 180 C 700 120 670 140 680 240" stroke="#15803d" strokeWidth="8" fill="none" />
              <path d="M 710 160 C 730 110 750 130 720 240" stroke="#16a34a" strokeWidth="6" fill="none" />
              <ellipse cx="715" cy="235" rx="20" ry="15" fill="#b45309" />
            </svg>
          </div>
        );
      case 'office-reception':
        return (
          <div className="absolute inset-x-0 bottom-0 h-[42%] pointer-events-none z-20 flex flex-col justify-end items-center px-12">
            <svg viewBox="0 0 800 260" className="w-[80%] h-auto drop-shadow-2xl">
              {/* Modern Reception Desk with geometric design */}
              <path d="M 120 100 L 680 100 L 680 240 L 120 240 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
              {/* Front Accent Panel */}
              <path d="M 180 100 L 500 100 L 420 240 L 180 240 Z" fill="#0f172a" />
              <text x="210" y="170" fill="#f59e0b" className="text-xl font-black tracking-widest font-sans">RECEPTION</text>
              {/* Computer monitor peaking out */}
              <rect x="320" y="75" width="80" height="50" rx="4" fill="#334155" />
              <line x1="360" y1="125" x2="360" y2="100" stroke="#334155" strokeWidth="6" />
              {/* Sleek office chair peaking out */}
              <rect x="520" y="60" width="80" height="70" rx="10" fill="#1e293b" />
              {/* Potted desk plant */}
              <ellipse cx="620" cy="90" rx="12" ry="8" fill="#15803d" />
              <rect x="612" y="90" width="16" height="15" fill="#d97706" rx="2" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  // Switcher tab rendering helpers
  const renderViewControls = () => {
    const views: { id: typeof viewMode; label: string; icon: string }[] = [
      { id: 'front', label: 'Feature Wall View', icon: '⏹️' },
      { id: 'left', label: 'Left Wall View', icon: '◀️' },
      { id: 'right', label: 'Right Wall View', icon: '▶️' },
      { id: 'floor', label: 'Flooring View', icon: '🔼' },
      { id: 'window', label: 'Window View', icon: '🪟' },
    ];

    return (
      <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-30" id="camera-perspective-buttons">
        {views.map((v) => {
          const isActive = viewMode === v.id;
          return (
            <button
              key={v.id}
              onClick={() => {
                setViewMode(v.id);
                // Propagate selected surface if appropriate
                if (v.id === 'left') onSelectSurface?.('left-wall');
                else if (v.id === 'right') onSelectSurface?.('right-wall');
                else if (v.id === 'floor') onSelectSurface?.('floor');
                else if (v.id === 'window') onSelectSurface?.('window');
                else if (v.id === 'front') onSelectSurface?.('front-wall');
              }}
              className={`px-3 py-1.5 text-[10px] font-black rounded-xl shadow-md transition flex items-center gap-1 ${
                isActive
                  ? 'bg-brand-orange text-white ring-1 ring-orange-500'
                  : 'bg-slate-900/95 text-slate-300 hover:bg-slate-800 border border-slate-700/50'
              }`}
            >
              <span>{v.icon}</span>
              <span>{v.label}</span>
            </button>
          );
        })}

        {/* Toggle Furniture Visibility */}
        <button
          onClick={() => setShowFurniture(!showFurniture)}
          className={`px-3 py-1.5 text-[10px] font-black rounded-xl shadow-md transition flex items-center gap-1 ${
            showFurniture
              ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-600'
              : 'bg-slate-950/90 text-slate-500 hover:text-slate-300 border border-slate-900'
          }`}
          title="Toggle room furniture overlays on or off"
        >
          <span>🛋️</span>
          <span>{showFurniture ? 'Hide Furniture' : 'Show Furniture'}</span>
        </button>
      </div>
    );
  };

  // Perspective 3D Room Box Layout in CSS
  const renderPerspectiveRoom = () => {
    return (
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center p-8 bg-slate-950" style={{ perspective: '1200px' }}>
        {/* Sky/Ceiling lighting glow */}
        <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-slate-900 to-transparent opacity-50 pointer-events-none" />

        {/* THE ROOM PROJECTION BLOCK */}
        <div className="relative w-[85%] h-[80%] flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* LEFT WALL */}
          <div
            onClick={() => onSelectSurface?.('left-wall')}
            style={{
              transform: 'rotateY(48deg) translateZ(5px)',
              transformOrigin: 'left center',
              width: '24%',
            }}
            className={`absolute left-0 top-[8%] bottom-[16%] bg-slate-800 border-y-2 border-r border-slate-700/70 cursor-pointer overflow-hidden transition-all duration-300 ${
              selectedSurfaceId === 'left-wall'
                ? 'ring-4 ring-brand-orange shadow-orange-500/20 shadow-2xl z-20 scale-[1.01]'
                : 'hover:bg-slate-700/50 z-10'
            }`}
          >
            {renderLayers2D('left-wall', roomLengthFt, roomHeightFt)}
            {/* Ambient lighting mask */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent pointer-events-none" />
            <div className="absolute top-2 left-2 text-[8px] bg-black/60 text-slate-300 font-black px-1.5 py-0.5 rounded uppercase">
              Left Wall
            </div>
          </div>

          {/* RIGHT WALL */}
          <div
            onClick={() => onSelectSurface?.('right-wall')}
            style={{
              transform: 'rotateY(-48deg) translateZ(5px)',
              transformOrigin: 'right center',
              width: '24%',
            }}
            className={`absolute right-0 top-[8%] bottom-[16%] bg-slate-800 border-y-2 border-l border-slate-700/70 cursor-pointer overflow-hidden transition-all duration-300 ${
              selectedSurfaceId === 'right-wall'
                ? 'ring-4 ring-brand-orange shadow-orange-500/20 shadow-2xl z-20 scale-[1.01]'
                : 'hover:bg-slate-700/50 z-10'
            }`}
          >
            {renderLayers2D('right-wall', roomLengthFt, roomHeightFt)}
            {/* Ambient lighting mask */}
            <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />
            {/* Overlay Window bounds inside right wall */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelectSurface?.('window');
              }}
              className={`absolute top-[20%] left-[20%] right-[20%] bottom-[25%] border-4 border-slate-600 shadow-lg cursor-pointer overflow-hidden ${
                selectedSurfaceId === 'window' ? 'ring-4 ring-orange-500 scale-105 z-20' : 'hover:border-white'
              }`}
            >
              {renderLayers2D('window', 5, 4)}
              {/* Grid outline */}
              <div className="absolute inset-0 border border-white/20 flex">
                <div className="w-1/2 border-r border-white/20 h-full" />
                <div className="w-full flex flex-col justify-center">
                  <div className="w-full border-b border-white/20 h-[1px]" />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 text-[7px] bg-black/80 text-white font-black px-1 rounded uppercase">
                Window Blinds
              </div>
            </div>
            <div className="absolute top-2 right-2 text-[8px] bg-black/60 text-slate-300 font-black px-1.5 py-0.5 rounded uppercase">
              Right Wall
            </div>
          </div>

          {/* FLOOR */}
          <div
            onClick={() => onSelectSurface?.('floor')}
            style={{
              transform: 'rotateX(48deg) translateZ(5px)',
              transformOrigin: 'center bottom',
              height: '24%',
            }}
            className={`absolute left-[16.5%] right-[16.5%] bottom-0 bg-slate-900 border-x-2 border-t border-slate-800 cursor-pointer overflow-hidden transition-all duration-300 ${
              selectedSurfaceId === 'floor'
                ? 'ring-4 ring-brand-orange shadow-orange-500/20 shadow-2xl z-20 scale-[1.01]'
                : 'hover:bg-slate-800 z-10'
            }`}
          >
            {renderLayers2D('floor', roomWidthFt, roomLengthFt)}
            {/* Floor depth shading */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-2 text-[8px] bg-black/60 text-slate-300 font-black px-1.5 py-0.5 rounded uppercase">
              Flooring ({roomWidthFt}x{roomLengthFt} ft)
            </div>
          </div>

          {/* FRONT FEATURE WALL */}
          <div
            onClick={() => onSelectSurface?.('front-wall')}
            className={`absolute left-[16.2%] right-[16.2%] top-[8%] bottom-[15.8%] bg-slate-850 border-2 border-slate-700 cursor-pointer overflow-hidden transition-all duration-300 ${
              selectedSurfaceId === 'front-wall' || selectedSurfaceId === 'custom-section'
                ? 'ring-4 ring-brand-orange shadow-orange-500/20 shadow-2xl z-15 scale-[1.005]'
                : 'hover:bg-slate-800/80'
            }`}
          >
            {/* Double layer render for Before / After slider split */}
            {showComparison ? (
              <div className="relative w-full h-full">
                {/* Before state (Base neutral plaster wall) */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 shadow-inner flex items-center justify-center">
                  <div className="text-[10px] font-black text-slate-500/40 uppercase tracking-widest">Original Paint Color</div>
                </div>

                {/* After state (Applied product layers) */}
                <div
                  className="absolute inset-0 w-full h-full overflow-hidden transition-all"
                  style={{
                    clipPath: `polygon(0 0, ${comparisonSplitPercent}% 0, ${comparisonSplitPercent}% 100%, 0 100%)`,
                  }}
                >
                  {renderLayers2D('front-wall', roomWidthFt, roomHeightFt)}
                </div>

                {/* Slider divider bar overlay */}
                <div
                  style={{ left: `${comparisonSplitPercent}%` }}
                  className="absolute top-0 bottom-0 w-[2px] bg-brand-orange shadow-2xl pointer-events-none z-35 flex items-center justify-center"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-orange border-2 border-white text-[9px] text-white flex items-center justify-center font-black shadow-lg">
                    ↔
                  </div>
                </div>
              </div>
            ) : (
              renderLayers2D('front-wall', roomWidthFt, roomHeightFt)
            )}

            {/* Custom section dashed preview outline overlay */}
            {selectedSurfaceId === 'custom-section' && (
              <div className="absolute inset-2 border-4 border-dashed border-brand-orange/80 bg-brand-orange/5 rounded-xl z-25 flex flex-col justify-center items-center pointer-events-none">
                <span className="text-[9px] font-black text-brand-orange bg-white px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider animate-pulse">
                  Custom Overlay Target Area
                </span>
              </div>
            )}

            {/* Accent Shadow in Room Corners */}
            <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/25 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-2.5 bg-gradient-to-l from-black/25 to-transparent pointer-events-none" />

            <div className="absolute top-2 left-2 text-[8px] bg-black/60 text-slate-300 font-black px-1.5 py-0.5 rounded uppercase">
              Front Wall (Feature Wall)
            </div>
          </div>

        </div>

        {/* Furniture Overlay placed on top of the depth layer */}
        {renderFurniture()}
      </div>
    );
  };

  // Zoomed-in flat Elevation View of a specific surface
  const renderFlatElevation = (surfaceId: WallSurfaceId, label: string, wFt: number, hFt: number) => {
    return (
      <div className="relative w-full h-full bg-slate-900 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-3">
          <span className="text-xs font-black text-slate-400 tracking-widest uppercase">
            {label} Elevation View
          </span>
          <span className="text-[10px] text-slate-500 block">
            {wFt} ft Width × {hFt} ft Height
          </span>
        </div>

        <div className="relative w-[75%] max-w-[480px] aspect-[4/3] bg-slate-800 border-4 border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
          {/* Double layer render for Feature Wall in flat view too! */}
          {surfaceId === 'front-wall' && showComparison ? (
            <div className="relative w-full h-full">
              {/* Paint side */}
              <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Original Paint</span>
              </div>
              {/* Product side */}
              <div
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{
                  clipPath: `polygon(0 0, ${comparisonSplitPercent}% 0, ${comparisonSplitPercent}% 100%, 0 100%)`,
                }}
              >
                {renderLayers2D(surfaceId, wFt, hFt)}
              </div>
              {/* Split Bar handle */}
              <div
                style={{ left: `${comparisonSplitPercent}%` }}
                className="absolute top-0 bottom-0 w-[2px] bg-brand-orange z-35 flex items-center justify-center"
              >
                <div className="w-5 h-5 rounded-full bg-brand-orange border-2 border-white text-[8px] text-white flex items-center justify-center font-black shadow-lg">
                  ↔
                </div>
              </div>
            </div>
          ) : (
            renderLayers2D(surfaceId, wFt, hFt)
          )}

          {/* Custom section dashed indicator box overlay inside flat feature wall */}
          {surfaceId === 'front-wall' && selectedSurfaceId === 'custom-section' && (
            <div className="absolute inset-4 border-2 border-dashed border-brand-orange bg-brand-orange/10 z-20 flex items-center justify-center rounded-xl pointer-events-none">
              <span className="text-[9px] font-black text-brand-orange bg-white px-2.5 py-1 rounded-xl shadow-lg">
                Custom Segment Selected
              </span>
            </div>
          )}

          {/* Minimal shadow edges */}
          <div className="absolute inset-0 ring-1 ring-white/10 pointer-events-none" />
        </div>

        {/* Zoomed Flat elevation furniture overlay if appropriate */}
        {surfaceId === 'front-wall' && (
          <div className="absolute bottom-6 w-[75%] max-w-[480px] pointer-events-none h-[25%] flex items-end justify-center">
            {renderFurniture()}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-[480px] md:h-[580px] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800" id="visualizer-2d-studio-container">
      {/* Top Floating Controls */}
      {renderViewControls()}

      {/* RENDER ACTIVE VISUAL CONTAINER */}
      <div className="w-full h-full pt-16 pb-12">
        {viewMode === 'front' && renderFlatElevation('front-wall', 'Feature Wall', roomWidthFt, roomHeightFt)}
        {viewMode === 'left' && renderFlatElevation('left-wall', 'Left Wall', roomLengthFt, roomHeightFt)}
        {viewMode === 'right' && renderFlatElevation('right-wall', 'Right Wall', roomLengthFt, roomHeightFt)}
        {viewMode === 'floor' && renderFlatElevation('floor', 'Floor Tiling', roomWidthFt, roomLengthFt)}
        {viewMode === 'window' && renderFlatElevation('window', 'Window Blinds', 5, 4)}
      </div>

      {/* Floating Instructions */}
      <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700 text-[10px] text-slate-400 select-none flex items-center gap-2 max-w-[280px] z-30">
        <span>💡</span>
        <p>Interactive 2D elevation planner: Click any surface inside the room layout to assign and test materials.</p>
      </div>

      {/* Selected Surface Status Label */}
      <div className="absolute bottom-4 left-4 bg-orange-950/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-orange-800 text-[11px] text-orange-400 font-extrabold flex items-center gap-2 z-30">
        <span className="animate-pulse">●</span>
        <span>Studio Target: {selectedSurfaceId.replace('-', ' ').toUpperCase()}</span>
      </div>
    </div>
  );
};
