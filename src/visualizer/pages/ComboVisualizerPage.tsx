import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../data/mockData';
import { Product } from '../../types';
import { Visualizer3DCanvas } from '../components/Visualizer3DCanvas';
import { PresetRoomSelector } from '../components/PresetRoomSelector';
import { DimensionForm } from '../components/DimensionForm';
import { SavedDesignsList } from '../components/SavedDesignsList';
import { RoomPresetId, WallSurfaceId, ProductLayerState, SavedDesign, CalculationResult } from '../types/visualizer';
import { calculateRequirements, ftToFtIn } from '../utils/visualizerMath';

// Predefined product shortcuts for our template combos
const getWpcPanel = () => PRODUCTS.find(p => p.id === 'pastel-geometric-pvc-wall-panel') || PRODUCTS[0];
const getUvMarble = () => PRODUCTS.find(p => p.id === 'white-marble-uv-sheet') || PRODUCTS[1] || PRODUCTS[0];
const getBlackMarble = () => PRODUCTS.find(p => p.id === 'black-marble-uv-sheet') || PRODUCTS[1] || PRODUCTS[0];

export const ComboVisualizerPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToBasket, products } = useApp();

  // DIMENSIONS STATE
  const [dimensions, setDimensions] = useState({
    roomWidthFt: 12,
    roomLengthFt: 14,
    roomHeightFt: 10,
    wallWidthFt: 12,
    wallHeightFt: 10,
  });

  const [roomPresetId, setRoomPresetId] = useState<RoomPresetId>('tv-wall');
  const [selectedSurfaceId, setSelectedSurfaceId] = useState<WallSurfaceId>('front-wall');

  // LAYER STATE MANAGER
  const [layers, setLayers] = useState<ProductLayerState[]>(() => [
    // Layer 1: Background PVC Panels flanking left & right (rendered as a single layered backdrop)
    {
      id: 'layer_bg',
      product: getWpcPanel(),
      orientation: 'vertical',
      scale: 1,
      visible: true,
      zIndex: 1,
      widthPercent: 100,
      heightPercent: 100,
      leftPercent: 0,
      topPercent: 0,
    },
    // Layer 2: Glossy White Marble centerpiece overlay
    {
      id: 'layer_center',
      product: getUvMarble(),
      orientation: 'vertical',
      scale: 1,
      visible: true,
      zIndex: 2,
      widthPercent: 50,
      heightPercent: 100,
      leftPercent: 25,
      topPercent: 0,
    }
  ]);

  const [activeLayerId, setActiveLayerId] = useState<string>('layer_center');
  
  // Search/Filter for Product Picker
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // BEFORE/AFTER STATE
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonSplitPercent, setComparisonSplitPercent] = useState<number>(50);

  // TOAST NOTIFICATIONS
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeLayer = useMemo(() => {
    return layers.find(l => l.id === activeLayerId) || layers[0];
  }, [layers, activeLayerId]);

  // CATEGORIES LIST
  const categories = useMemo(() => {
    const list = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(list)];
  }, [products]);

  // FILTERED PRODUCTS FOR PICKER
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.productCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  // TRIGGER TOAST TO USER
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // APPLY COMBINATION PRESETS
  const applyPresetCombination = (preset: 'slat-centerpiece' | 'double-deck' | 'luxury-focus') => {
    const bgPanel = getWpcPanel();
    const uvSheet = getUvMarble();
    const blackUv = getBlackMarble();

    if (preset === 'slat-centerpiece') {
      // Wood slat flanking layers with a central marble lamination
      setLayers([
        {
          id: 'layer_left_flank',
          product: bgPanel,
          orientation: 'vertical',
          scale: 1,
          visible: true,
          zIndex: 1,
          widthPercent: 25,
          heightPercent: 100,
          leftPercent: 0,
          topPercent: 0,
        },
        {
          id: 'layer_right_flank',
          product: bgPanel,
          orientation: 'vertical',
          scale: 1,
          visible: true,
          zIndex: 1,
          widthPercent: 25,
          heightPercent: 100,
          leftPercent: 75,
          topPercent: 0,
        },
        {
          id: 'layer_marble_center',
          product: uvSheet,
          orientation: 'vertical',
          scale: 1,
          visible: true,
          zIndex: 2,
          widthPercent: 50,
          heightPercent: 100,
          leftPercent: 25,
          topPercent: 0,
        }
      ]);
      setActiveLayerId('layer_marble_center');
      triggerToast('🪄 Applied "Slat & Marble Centerpiece" Combination Preset!');
    } else if (preset === 'double-deck') {
      // Top half wood, bottom half marble UV sheet split horizontally
      setLayers([
        {
          id: 'layer_top_half',
          product: bgPanel,
          orientation: 'horizontal',
          scale: 1,
          visible: true,
          zIndex: 1,
          widthPercent: 100,
          heightPercent: 50,
          leftPercent: 0,
          topPercent: 50,
        },
        {
          id: 'layer_bottom_half',
          product: uvSheet,
          orientation: 'vertical',
          scale: 1,
          visible: true,
          zIndex: 2,
          widthPercent: 100,
          heightPercent: 50,
          leftPercent: 0,
          topPercent: 0,
        }
      ]);
      setActiveLayerId('layer_bottom_half');
      triggerToast('🪄 Applied "Double-Deck Horizontal" Combination Preset!');
    } else if (preset === 'luxury-focus') {
      // Dramatic centered contrast frame
      setLayers([
        {
          id: 'layer_backdrop',
          product: uvSheet,
          orientation: 'vertical',
          scale: 1,
          visible: true,
          zIndex: 1,
          widthPercent: 100,
          heightPercent: 100,
          leftPercent: 0,
          topPercent: 0,
        },
        {
          id: 'layer_accent_block',
          product: blackUv,
          orientation: 'vertical',
          scale: 1,
          visible: true,
          zIndex: 2,
          widthPercent: 60,
          heightPercent: 80,
          leftPercent: 20,
          topPercent: 10,
        }
      ]);
      setActiveLayerId('layer_accent_block');
      triggerToast('🪄 Applied "Luxury Accent Focal Block" Preset!');
    }
  };

  // MULTI-LAYER CALCULATOR AGGREGATOR
  const layerCalculations = useMemo(() => {
    return layers.map((layer) => {
      // Base dimensions for target wall surface
      const targetW = selectedSurfaceId === 'floor' ? dimensions.roomWidthFt : dimensions.wallWidthFt;
      const targetH = selectedSurfaceId === 'floor' ? dimensions.roomLengthFt : dimensions.wallHeightFt;

      const calc = calculateRequirements(
        layer.product,
        targetW,
        targetH,
        layer.orientation,
        layer.scale,
        layer.widthPercent,
        layer.heightPercent
      );

      return {
        layerId: layer.id,
        visible: layer.visible,
        calc,
      };
    });
  }, [layers, dimensions, selectedSurfaceId]);

  // COMBINED TOTAL FINANCIAL COST
  const totals = useMemo(() => {
    let productCost = 0;
    let installationCost = 0;
    let totalCost = 0;
    let totalArea = 0;

    layerCalculations.forEach(({ visible, calc }) => {
      if (visible) {
        productCost += calc.productCost;
        installationCost += calc.installationCost;
        totalCost += calc.totalCost;
        totalArea += calc.targetAreaSqFt;
      }
    });

    return {
      productCost,
      installationCost,
      totalCost,
      totalArea,
    };
  }, [layerCalculations]);

  // ADD COMPONENT TO LAYERS
  const handleAddLayer = () => {
    const newId = `layer_${Date.now()}`;
    const newLayer: ProductLayerState = {
      id: newId,
      product: products[0],
      orientation: 'vertical',
      scale: 1,
      visible: true,
      zIndex: layers.length + 1,
      widthPercent: 50,
      heightPercent: 50,
      leftPercent: 25,
      topPercent: 25,
    };
    setLayers([...layers, newLayer]);
    setActiveLayerId(newId);
    triggerToast('➕ Created a new product layer! Select a product for it below.');
  };

  // REMOVE LAYER
  const handleRemoveLayer = (id: string) => {
    if (layers.length <= 1) {
      triggerToast('⚠️ You must have at least one layer in your combination!');
      return;
    }
    const filtered = layers.filter(l => l.id !== id);
    setLayers(filtered);
    if (activeLayerId === id) {
      setActiveLayerId(filtered[0].id);
    }
    triggerToast('🗑️ Removed layer from combination.');
  };

  // UPDATE LAYER FIELD
  const updateLayerField = (id: string, updates: Partial<ProductLayerState>) => {
    console.log('[DEBUG] updateLayerField in Multi-Product Combiner:', {
      layerId: id,
      updates,
      isProductSwap: !!updates.product,
      newProductMetadata: updates.product ? {
        id: updates.product.id,
        productName: updates.product.productName,
        productCode: updates.product.productCode,
        textureUrl: updates.product.visualizer?.textureUrl || updates.product.textureImage || updates.product.mainImage || '',
      } : undefined
    });
    setLayers(prev => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  // ADD ALL COMBINATION MATERIALS TO ENQUIRY BASKET
  const handleAddComboToBasket = () => {
    let addedCount = 0;
    layerCalculations.forEach(({ visible, calc }) => {
      if (visible) {
        const product = products.find(p => p.id === calc.productId);
        const qty = Math.ceil(calc.unitsNeededWithWastage);
        if (product && qty > 0) {
          addToBasket(product, qty);
          addedCount++;
        }
      }
    });

    if (addedCount > 0) {
      triggerToast(`🛒 Successfully added ${addedCount} estimated items from this combination to your Enquiry Basket!`);
    } else {
      triggerToast('⚠️ No active layers with measurable area found.');
    }
  };

  // WHATSAPP COMBINATION EXPORTER
  const handleShareComboWhatsApp = () => {
    const spaceW = ftToFtIn(dimensions.wallWidthFt);
    const spaceH = ftToFtIn(dimensions.wallHeightFt);
    
    let itemsText = '';
    layerCalculations.forEach(({ visible, calc }, idx) => {
      if (visible) {
        itemsText += `\n*Layer ${idx + 1}:* ${calc.productName} (${calc.productCode})
- Est: ${calc.unitsNeededWithWastage} ${calc.sellingUnit}s (incl. ${calc.recommendedWastagePercent}% wastage)
- Cost: ₹${calc.totalCost.toLocaleString()}\n`;
      }
    });

    const text = `*WallDecor99 Multi-Product Combination*
---------------------------------------
*Surface:* ${selectedSurfaceId.replace('-', ' ').toUpperCase()}
*Wall Size:* ${spaceW.ft} ft ${spaceW.in} in × ${spaceH.ft} ft ${spaceH.in} in
*Total Cover Area:* ${totals.totalArea.toFixed(1)} Sq.Ft

*Configured Combinations:*${itemsText}
---------------------------------------
*Product Total:* ₹${totals.productCost.toLocaleString()}
*Installation Total:* ₹${totals.installationCost.toLocaleString()}
*PROJECT GRAND TOTAL:* *₹${totals.totalCost.toLocaleString()}*

_Designed and estimated via WallDecor99 Studio Combiner._`;

    const url = `https://wa.me/919999999999?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // SAVE COMBINATION DESIGN LOCALLY
  const handleSaveComboDesign = () => {
    const namePrompt = window.prompt('Enter a memorable name for this multi-product combination:', 'My Designer Combination');
    if (!namePrompt) return;

    const newDesign: SavedDesign = {
      id: `design_${Date.now()}`,
      name: namePrompt,
      date: new Date().toISOString(),
      roomPresetId,
      dimensions,
      selectedSurfaceId,
      layers,
    };

    try {
      const stored = localStorage.getItem('wall_decor_99_saved_visualizer_designs');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newDesign);
      localStorage.setItem('wall_decor_99_saved_visualizer_designs', JSON.stringify(list));
      triggerToast('💾 Combination design saved successfully to your browser cache!');
    } catch (e) {
      console.error(e);
      triggerToast('❌ Failed to save design.');
    }
  };

  // LOAD SAVED COMBINATION DESIGN
  const handleLoadSavedCombo = (design: SavedDesign) => {
    setRoomPresetId(design.roomPresetId);
    setDimensions(design.dimensions);
    setSelectedSurfaceId(design.selectedSurfaceId);
    setLayers(design.layers);
    if (design.layers.length > 0) {
      setActiveLayerId(design.layers[0].id);
    }
    triggerToast(`🔓 Loaded saved combination: "${design.name}"!`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-6" id="combo-visualizer-page-container">
      
      {/* TOAST PANEL */}
      {toastMessage && (
        <div className="fixed top-24 right-6 bg-slate-900 border border-brand-orange text-white text-xs font-black px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER WITH PAGE TABS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-brand-navy/10 shadow-xs">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-brand-navy tracking-tight">
            🎨 Multi-Product Combination Designer
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build modern interior combinations by layering multiple panels, marble UV sheets, and wallpapers simultaneously.
          </p>
        </div>
        
        {/* Navigation Tabs between Single and Combination visualizer */}
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl self-stretch md:self-auto" id="visualizer-tabs-nav">
          <NavLinkToTab path="/visualizer" label="Single-Product Visualizer" active={false} />
          <NavLinkToTab path="/visualizer/combo" label="Multi-Product Combiner" active />
        </div>
      </div>

      {/* INTERACTIVE COMBINATION TEMPLATES / PRESETS BANNER */}
      <div className="bg-gradient-to-r from-brand-navy to-slate-800 rounded-3xl p-5 border border-slate-700/50 shadow-md text-white flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="text-xs font-black text-brand-orange uppercase tracking-wider flex items-center gap-1">
            <span>🪄</span> Premium Interior Slat & Panel Combinations
          </div>
          <p className="text-xs text-slate-300">
            Click one of our templates to quickly generate stunning high-contrast panels & lamination mockups.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyPresetCombination('slat-centerpiece')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs transition border border-white/10"
          >
            🛋️ Louvers & Marble Centerpiece
          </button>
          <button
            onClick={() => applyPresetCombination('double-deck')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs transition border border-white/10"
          >
            🛏️ Double-Deck Horizontal Split
          </button>
          <button
            onClick={() => applyPresetCombination('luxury-focus')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs transition border border-white/10"
          >
            📺 Modern Luxury Accent Block
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: 3D CANVAS AND CONTROLS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* THE 3D PREVIEW */}
          <Visualizer3DCanvas
            roomPresetId={roomPresetId}
            roomWidthFt={dimensions.roomWidthFt}
            roomLengthFt={dimensions.roomLengthFt}
            roomHeightFt={dimensions.roomHeightFt}
            selectedSurfaceId={selectedSurfaceId}
            onSelectSurface={setSelectedSurfaceId}
            layers={layers}
            comparisonSplitPercent={comparisonSplitPercent}
            showComparison={showComparison}
          />

          {/* ROOM PRESETS BACKDROP SELECTOR */}
          <PresetRoomSelector
            selectedPresetId={roomPresetId}
            onSelectPreset={setRoomPresetId}
          />

          {/* ROOM WALL DIMENSIONS ENVELOPE INPUT FORM */}
          <DimensionForm
            roomWidthFt={dimensions.roomWidthFt}
            roomLengthFt={dimensions.roomLengthFt}
            roomHeightFt={dimensions.roomHeightFt}
            wallWidthFt={dimensions.wallWidthFt}
            wallHeightFt={dimensions.wallHeightFt}
            onChange={(dims) => setDimensions(dims)}
          />

          {/* SAVE/LOAD DESIGNS COMPONENT */}
          <SavedDesignsList
            onLoadDesign={handleLoadSavedCombo}
          />

        </div>

        {/* RIGHT COLUMN: LAYER MANAGER AND GRAND CALCULATOR SUMMARY (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* LAYER MANAGER BLOCK */}
          <div className="bg-white rounded-3xl p-5 border border-brand-navy/10 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-brand-navy uppercase tracking-wider flex items-center gap-1.5 pb-1">
                <span>🥞</span> Combination Layers ({layers.length})
              </h3>
              <button
                onClick={handleAddLayer}
                className="text-[10px] bg-brand-orange hover:bg-orange-600 text-white font-black px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-sm"
              >
                <span>➕</span> Add Slat/Panel Layer
              </button>
            </div>

            {/* List of active layers with eye controls, select-indicator, and trash */}
            <div className="space-y-2">
              {layers.map((layer, idx) => {
                const isActive = layer.id === activeLayerId;
                const { calc } = layerCalculations.find(lc => lc.layerId === layer.id)!;
                
                return (
                  <div
                    key={layer.id}
                    onClick={() => setActiveLayerId(layer.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange'
                        : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                    id={`layer-manager-item-${layer.id}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-200 text-[10px] font-black text-slate-700">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[11px] font-black text-brand-navy truncate">
                          {layer.product.productName}
                        </div>
                        <div className="text-[9px] text-slate-400 font-bold">
                          Width: {layer.widthPercent.toFixed(0)}% | Left: {layer.leftPercent.toFixed(0)}% | Code: {layer.product.productCode}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Hide/Show Layer Toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateLayerField(layer.id, { visible: !layer.visible });
                        }}
                        className={`text-xs p-1.5 rounded transition ${
                          layer.visible ? 'text-slate-600 hover:text-slate-800' : 'text-slate-300'
                        }`}
                        title={layer.visible ? 'Hide layer' : 'Show layer'}
                      >
                        {layer.visible ? '👁️' : '👁️‍🗨️'}
                      </button>

                      {/* Remove layer button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLayer(layer.id);
                        }}
                        className="text-slate-400 hover:text-red-500 p-1.5 rounded transition"
                        title="Delete Layer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LAYER RE-DIMENSIONING TUNER */}
          <div className="bg-white rounded-3xl p-5 border border-brand-navy/10 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-brand-orange/15 text-[10px] font-black text-brand-orange">
                ⚙️
              </span>
              <div>
                <h4 className="text-xs font-black text-brand-navy">Modify Active Layer Properties</h4>
                <p className="text-[9px] text-slate-400 leading-none">Currently modifying layer: {activeLayer.product.productName}</p>
              </div>
            </div>

            {/* Selected Product Picker inside Tuning section */}
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 block">Swap Layer Product Material</label>
                <div className="flex gap-2">
                  <select
                    value={activeLayer.product.id}
                    onChange={(e) => {
                      const found = products.find(p => p.id === e.target.value);
                      if (found) {
                        updateLayerField(activeLayer.id, { product: found });
                        if (found.defaultOrientation) {
                          updateLayerField(activeLayer.id, { orientation: found.defaultOrientation });
                        }
                      }
                    }}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
                    id="swap-layer-product-select"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.productName} ({p.productCode})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sliders for Sizing and Alignments of the active overlay layer */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Horizontal Width:</span>
                    <span>{Math.round(activeLayer.widthPercent)}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={activeLayer.widthPercent}
                    onChange={(e) => updateLayerField(activeLayer.id, { widthPercent: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Vertical Height:</span>
                    <span>{Math.round(activeLayer.heightPercent)}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={activeLayer.heightPercent}
                    onChange={(e) => updateLayerField(activeLayer.id, { heightPercent: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Align Left Offset:</span>
                    <span>{Math.round(activeLayer.leftPercent)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(0, 100 - activeLayer.widthPercent)}
                    value={activeLayer.leftPercent}
                    onChange={(e) => updateLayerField(activeLayer.id, { leftPercent: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Align Top Offset:</span>
                    <span>{Math.round(activeLayer.topPercent)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(0, 100 - activeLayer.heightPercent)}
                    value={activeLayer.topPercent}
                    onChange={(e) => updateLayerField(activeLayer.id, { topPercent: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                  />
                </div>
              </div>

              {/* Orientation and Zoom */}
              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 block">Rotate Orientation</label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-100 p-0.5 rounded-lg">
                    <button
                      onClick={() => updateLayerField(activeLayer.id, { orientation: 'vertical' })}
                      className={`px-1 py-1 text-[9px] font-black rounded-md transition ${
                        activeLayer.orientation === 'vertical' ? 'bg-white text-brand-navy shadow-xs' : 'text-slate-500 hover:text-brand-navy'
                      }`}
                    >
                      Vertical
                    </button>
                    <button
                      onClick={() => updateLayerField(activeLayer.id, { orientation: 'horizontal' })}
                      className={`px-1 py-1 text-[9px] font-black rounded-md transition ${
                        activeLayer.orientation === 'horizontal' ? 'bg-white text-brand-navy shadow-xs' : 'text-slate-500 hover:text-brand-navy'
                      }`}
                    >
                      Horizontal
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black text-slate-500">
                    <span>Zoom Texture:</span>
                    <span>{Math.round(activeLayer.scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={activeLayer.scale}
                    onChange={(e) => updateLayerField(activeLayer.id, { scale: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange mt-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEPARATE ITEM DETAILED BILL OF MATERIALS (BOM) FOR COMBO */}
          <div className="bg-white rounded-3xl p-5 border border-brand-navy/10 shadow-xs space-y-4">
            <h3 className="text-xs font-black text-brand-navy uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-50">
              <span>📋</span> Combination Itemized Estimate Details
            </h3>

            <div className="space-y-3">
              {layerCalculations.map(({ layerId, visible, calc }, idx) => {
                if (!visible) return null;
                return (
                  <div key={layerId} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <div className="text-[10px] font-extrabold text-brand-orange bg-brand-orange/5 px-2 py-0.5 rounded-md inline-block mb-1">
                          Layer {idx + 1}
                        </div>
                        <h4 className="text-[11px] font-black text-brand-navy leading-tight truncate">{calc.productName}</h4>
                      </div>
                      <span className="text-[10px] font-black text-slate-600">₹{calc.totalCost.toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-500 font-bold border-t border-slate-100/50 pt-2">
                      <div>Quantity: <span className="text-brand-navy font-black">{calc.unitsNeededWithWastage} {calc.sellingUnit}s</span></div>
                      <div>Coverage: <span className="text-brand-navy font-black">{calc.targetAreaSqFt.toFixed(1)} Sq.Ft</span></div>
                      <div>Wastage: <span className="text-brand-navy font-black">+{calc.recommendedWastagePercent}%</span></div>
                      <div>Material Size: <span className="text-brand-navy font-black">{calc.physicalWidthFt.toFixed(1)}′ × {calc.physicalHeightFt.toFixed(1)}′</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GRAND TOTAL COMBINATION COST CARD */}
          <div className="bg-brand-navy text-white rounded-3xl p-5 border border-brand-navy/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>🧮</span> Project Grand Estimate
              </h3>
              <span className="text-[9px] font-black text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-2 py-0.5 rounded-lg uppercase">
                Aggregated Combo
              </span>
            </div>

            {/* Calculations List */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold">Aggregate Material Cost:</span>
                <span className="text-white font-extrabold">₹{totals.productCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold">Aggregate Installation Charges:</span>
                <span className="text-white font-extrabold">₹{totals.installationCost.toLocaleString()}</span>
              </div>
              
              {/* Grand Total Row */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center mt-3">
                <div>
                  <span className="text-[10px] text-slate-300 font-black uppercase tracking-wider block">Grand Combo Total</span>
                  <span className="text-[9px] text-slate-400">Materials + Expert Installation + Wastage</span>
                </div>
                <span className="text-2xl font-black text-brand-orange">
                  ₹{totals.totalCost.toLocaleString()}
                </span>
              </div>
            </div>

            {/* CTA ACTION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleAddComboToBasket}
                className="w-full bg-brand-orange hover:bg-orange-600 active:scale-95 text-white py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                id="btn-add-combo-to-basket"
              >
                <span>🛒</span> Add All to Enquiry
              </button>
              <button
                onClick={handleShareComboWhatsApp}
                className="w-full bg-whatsapp hover:bg-emerald-600 active:scale-95 text-white py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                id="btn-share-combo-whatsapp"
              >
                <span>💬</span> Ask on WhatsApp
              </button>
            </div>

            <button
              onClick={handleSaveComboDesign}
              className="w-full bg-white/10 hover:bg-white/20 active:scale-95 text-white py-2.5 rounded-xl font-black text-xs transition border border-white/10 flex items-center justify-center gap-1"
              id="btn-save-combo-design"
            >
              <span>💾</span> Save Current Combination
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

// Simple visual active link helper for tab switching
const NavLinkToTab: React.FC<{ path: string; label: string; active: boolean }> = ({ path, label, active }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className={`px-4 py-2 text-xs font-black rounded-xl transition ${
        active
          ? 'bg-white text-brand-navy shadow-xs border border-brand-navy/5'
          : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {label}
    </button>
  );
};
