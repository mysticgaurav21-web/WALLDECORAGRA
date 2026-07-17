import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { Visualizer3DCanvas } from '../components/Visualizer3DCanvas';
import { PresetRoomSelector } from '../components/PresetRoomSelector';
import { DimensionForm } from '../components/DimensionForm';
import { SurfaceList } from '../components/SurfaceList';
import { SavedDesignsList } from '../components/SavedDesignsList';
import { RoomPresetId, WallSurfaceId, ProductLayerState, SavedDesign } from '../types/visualizer';
import { calculateRequirements, getProductPhysicalSize, ftToFtIn } from '../utils/visualizerMath';

export const ProductVisualizerPage: React.FC = () => {
  const { productId } = useParams<{ productId?: string }>();
  const navigate = useNavigate();
  const { addToBasket, products } = useApp();

  // STATE FOR SELECTED PRODUCT
  const [selectedProduct, setSelectedProduct] = useState<Product>(() => {
    if (productId) {
      const found = products.find((p) => p.id === productId || p.productCode === productId);
      if (found) return found;
    }
    // Fallback to first panel product or any default
    return products.find((p) => p.category.toLowerCase().includes('panel')) || products[0];
  });

  // Search/Filter state for Product Picker
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // DIMENSIONS STATE
  const [dimensions, setDimensions] = useState({
    roomWidthFt: 12,
    roomLengthFt: 14,
    roomHeightFt: 10,
    wallWidthFt: 12,
    wallHeightFt: 10,
  });

  // TARGET SURFACE STATE
  const [selectedSurfaceId, setSelectedSurfaceId] = useState<WallSurfaceId>('front-wall');
  const [roomPresetId, setRoomPresetId] = useState<RoomPresetId>('living-room');

  // CUSTOM WALL SECTION STATE (if selectedSurfaceId === 'custom-section')
  const [sectionSettings, setSectionSettings] = useState({
    widthPercent: 100,
    heightPercent: 100,
    leftPercent: 0,
    topPercent: 0,
  });

  // MATERIAL CONFIG STATE
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>('vertical');
  const [scale, setScale] = useState<number>(1);

  // STATE FOR SAVED APPLIED SURFACE MATERIALS (PERSISTENT ACCROSS SURFACES IN SINGLE VIEW)
  const [appliedSurfaces, setAppliedSurfaces] = useState<Record<WallSurfaceId, {
    product: Product;
    orientation: 'vertical' | 'horizontal';
    scale: number;
  } | null>>(() => {
    // Initial active product
    const initialProduct = productId
      ? (products.find((p) => p.id === productId || p.productCode === productId) || products[0])
      : (products.find((p) => p.category.toLowerCase().includes('panel')) || products[0]);
    
    return {
      'front-wall': {
        product: initialProduct,
        orientation: initialProduct.defaultOrientation || 'vertical',
        scale: 1,
      },
      'left-wall': null,
      'right-wall': null,
      'floor': null,
      'window': null,
      'glass-partition': null,
      'custom-section': null,
    };
  });

  // Synchronize active selections to appliedSurfaces
  useEffect(() => {
    if (selectedProduct) {
      console.log('[DEBUG] Synchronizing active product selection to appliedSurfaces:', {
        surfaceId: selectedSurfaceId,
        productName: selectedProduct.productName,
        productCode: selectedProduct.productCode,
        orientation,
        scale,
        textureUrl: selectedProduct.visualizer?.textureUrl || selectedProduct.textureImage || selectedProduct.mainImage || '',
      });
      setAppliedSurfaces((prev) => ({
        ...prev,
        [selectedSurfaceId]: {
          product: selectedProduct,
          orientation,
          scale,
        },
      }));
    }
  }, [selectedProduct, orientation, scale, selectedSurfaceId]);

  // Handle switching active surface
  const handleSelectSurface = (surfaceId: WallSurfaceId) => {
    console.log('[DEBUG] Switching active selected surface:', surfaceId);
    setSelectedSurfaceId(surfaceId);
    
    const applied = appliedSurfaces[surfaceId];
    if (applied) {
      console.log(`[DEBUG] Surface "${surfaceId}" has existing applied product:`, {
        productName: applied.product.productName,
        productCode: applied.product.productCode,
        orientation: applied.orientation,
        scale: applied.scale,
      });
      setSelectedProduct(applied.product);
      setOrientation(applied.orientation);
      setScale(applied.scale);
    } else {
      // Find a suitable default product for the newly selected surface category
      let defaultProd: Product | undefined;
      if (surfaceId === 'floor') {
        defaultProd = products.find((p) => p.category.toLowerCase().includes('floor'));
      } else if (surfaceId === 'window') {
        defaultProd = products.find((p) => p.category.toLowerCase().includes('blind'));
      } else {
        // Wallpapers or Panels for other walls
        defaultProd = products.find((p) => p.category.toLowerCase().includes('panel')) || products.find((p) => p.category.toLowerCase().includes('wallpaper'));
      }
      
      if (defaultProd) {
        console.log(`[DEBUG] Surface "${surfaceId}" has no applied product. Applying default product for category:`, {
          category: defaultProd.category,
          productName: defaultProd.productName,
          productCode: defaultProd.productCode,
        });
        setSelectedProduct(defaultProd);
        setOrientation(defaultProd.defaultOrientation || 'vertical');
        setScale(1);
        
        // Save to applied surfaces so it immediately renders
        setAppliedSurfaces((prev) => ({
          ...prev,
          [surfaceId]: {
            product: defaultProd!,
            orientation: defaultProd!.defaultOrientation || 'vertical',
            scale: 1,
          },
        }));
      }
    }
  };

  // BEFORE/AFTER STATE
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonSplitPercent, setComparisonSplitPercent] = useState<number>(50);

  // NOTIFICATION TOAST
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // SYNC PATH PARAM IF CHANGED
  useEffect(() => {
    if (productId) {
      const found = products.find((p) => p.id === productId || p.productCode === productId);
      if (found) {
        setSelectedProduct(found);
        // Automatically default orientation based on product metadata if available
        if (found.defaultOrientation) {
          setOrientation(found.defaultOrientation);
        }
      }
    }
  }, [productId, products]);

  // CATEGORIES LIST
  const categories = useMemo(() => {
    const list = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(list)];
  }, [products]);

  // FILTERED PRODUCTS
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.productCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  // ACTIVE 3D LAYERS
  // For the single product visualizer, we build a layer list from all currently applied surface materials
  const activeLayers = useMemo<ProductLayerState[]>(() => {
    const layersList: ProductLayerState[] = [];

    Object.entries(appliedSurfaces).forEach(([surfId, data]) => {
      if (!data) return;

      const isCustom = surfId === 'custom-section';

      layersList.push({
        id: surfId, // This acts as the surface/layer identifier
        product: data.product,
        orientation: data.orientation,
        scale: data.scale,
        visible: true,
        zIndex: 1,
        widthPercent: isCustom ? sectionSettings.widthPercent : 100,
        heightPercent: isCustom ? sectionSettings.heightPercent : 100,
        leftPercent: isCustom ? sectionSettings.leftPercent : 0,
        topPercent: isCustom ? sectionSettings.topPercent : 0,
      });
    });

    return layersList;
  }, [appliedSurfaces, sectionSettings]);

  // CALCULATED REQUIREMENTS
  const calculation = useMemo(() => {
    // If we are visualizing custom section, target bounds are defined by sectionSettings
    const targetW = selectedSurfaceId === 'custom-section' 
      ? dimensions.wallWidthFt * (sectionSettings.widthPercent / 100)
      : (selectedSurfaceId === 'floor' ? dimensions.roomWidthFt : dimensions.wallWidthFt);

    const targetH = selectedSurfaceId === 'custom-section' 
      ? dimensions.wallHeightFt * (sectionSettings.heightPercent / 100)
      : (selectedSurfaceId === 'floor' ? dimensions.roomLengthFt : dimensions.wallHeightFt);

    return calculateRequirements(
      selectedProduct,
      targetW,
      targetH,
      orientation,
      scale
    );
  }, [selectedProduct, dimensions, selectedSurfaceId, sectionSettings, orientation, scale]);

  // SHOW TOAST UTILITY
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // ADD TO ENQUIRY BASKET
  const handleAddToBasket = () => {
    const qty = Math.ceil(calculation.unitsNeededWithWastage);
    if (qty <= 0) {
      triggerToast('⚠️ Area must be greater than zero to estimate!');
      return;
    }
    addToBasket(selectedProduct, qty);
    triggerToast(`🛒 Added ${qty} ${calculation.sellingUnit}s of ${selectedProduct.productName} to Enquiry Basket!`);
  };

  // WHATSAPP SHARE GENERATOR
  const handleShareWhatsApp = () => {
    const spaceW = ftToFtIn(dimensions.wallWidthFt);
    const spaceH = ftToFtIn(dimensions.wallHeightFt);
    
    const text = `*WallDecor99 Visualizer Estimate*
---------------------------------------
*Product:* ${selectedProduct.productName} (${selectedProduct.productCode})
*Category:* ${selectedProduct.category}
*Surface:* ${selectedSurfaceId.replace('-', ' ').toUpperCase()}
*Target Size:* ${spaceW.ft} ft ${spaceW.in} in × ${spaceH.ft} ft ${spaceH.in} in
*Area:* ${calculation.targetAreaSqFt.toFixed(1)} Sq.Ft

*Estimated Requirements:*
- *Total Quantity:* ${calculation.unitsNeededWithWastage} ${calculation.sellingUnit}s (incl. ${calculation.recommendedWastagePercent}% wastage)
- *Product Cost:* ₹${calculation.productCost.toLocaleString()}
- *Installation:* ₹${calculation.installationCost.toLocaleString()}
- *Total Project Cost:* *₹${calculation.totalCost.toLocaleString()}*

_Estimated via WallDecor99 Studio Visualizer._`;

    const url = `https://wa.me/919999999999?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // SAVE DESIGN LOCALLY
  const handleSaveDesign = () => {
    const namePrompt = window.prompt('Enter a memorable name for this design:', `My ${selectedProduct.productName} Design`);
    if (!namePrompt) return;

    const newDesign: SavedDesign = {
      id: `design_${Date.now()}`,
      name: namePrompt,
      date: new Date().toISOString(),
      roomPresetId,
      dimensions,
      selectedSurfaceId,
      layers: activeLayers,
    };

    try {
      const stored = localStorage.getItem('wall_decor_99_saved_visualizer_designs');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newDesign);
      localStorage.setItem('wall_decor_99_saved_visualizer_designs', JSON.stringify(list));
      triggerToast('💾 Design successfully saved to your browser cache!');
    } catch (e) {
      console.error(e);
      triggerToast('❌ Failed to save design.');
    }
  };

  // LOAD SAVED DESIGN
  const handleLoadSavedDesign = (design: SavedDesign) => {
    setRoomPresetId(design.roomPresetId);
    setDimensions(design.dimensions);
    setSelectedSurfaceId(design.selectedSurfaceId);
    if (design.layers.length > 0) {
      setSelectedProduct(design.layers[0].product);
      setOrientation(design.layers[0].orientation);
      setScale(design.layers[0].scale);
    }
    triggerToast(`🔓 Loaded saved design: "${design.name}"!`);
  };

  const { widthFt: pW, heightFt: pH, thicknessInch: pTh } = getProductPhysicalSize(selectedProduct);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-6" id="product-visualizer-page-container">
      
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
            🎨 Professional Studio Room Visualizer
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Design, estimate, and visualize panels, wallpapers, UV sheets and flooring in real-time.
          </p>
        </div>
        
        {/* Navigation Tabs between Single and Combination visualizer */}
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl self-stretch md:self-auto" id="visualizer-tabs-nav">
          <NavLinkToTab path="/visualizer" label="Single-Product Visualizer" active />
          <NavLinkToTab path="/visualizer/combo" label="Multi-Product Combiner" active={false} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: 3D PREVIEW AND ROOM SETUP (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* THE 3D VIEW CANVAS */}
          <Visualizer3DCanvas
            roomPresetId={roomPresetId}
            roomWidthFt={dimensions.roomWidthFt}
            roomLengthFt={dimensions.roomLengthFt}
            roomHeightFt={dimensions.roomHeightFt}
            selectedSurfaceId={selectedSurfaceId}
            onSelectSurface={handleSelectSurface}
            layers={activeLayers}
            comparisonSplitPercent={comparisonSplitPercent}
            showComparison={showComparison}
          />

          {/* BEFORE / AFTER CONTROLLER ROW */}
          <div className="bg-white rounded-2xl p-4 border border-brand-navy/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showComparison}
                  onChange={(e) => setShowComparison(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-orange"></div>
              </label>
              <div>
                <span className="text-xs font-black text-brand-navy block">Before / After Slider Comparison</span>
                <span className="text-[10px] text-slate-400">Split render front feature wall in halves</span>
              </div>
            </div>

            {showComparison && (
              <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-xs">
                <span className="text-[10px] font-bold text-slate-500">Original Paint</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={comparisonSplitPercent}
                  onChange={(e) => setComparisonSplitPercent(parseInt(e.target.value))}
                  className="h-1 flex-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                />
                <span className="text-[10px] font-bold text-brand-orange">Studio Design</span>
              </div>
            )}
          </div>

          {/* ROOM PRESETS ENVIRONMENT SELECTOR */}
          <PresetRoomSelector
            selectedPresetId={roomPresetId}
            onSelectPreset={setRoomPresetId}
          />

          {/* ROOM DIMENSIONS ENVELOPE INPUT FORM */}
          <DimensionForm
            roomWidthFt={dimensions.roomWidthFt}
            roomLengthFt={dimensions.roomLengthFt}
            roomHeightFt={dimensions.roomHeightFt}
            wallWidthFt={dimensions.wallWidthFt}
            wallHeightFt={dimensions.wallHeightFt}
            onChange={(dims) => setDimensions(dims)}
          />

          {/* SAVE AND LOAD DESIGNS EXPANDABLE ACCORDION */}
          <SavedDesignsList
            onLoadDesign={handleLoadSavedDesign}
          />

        </div>

        {/* RIGHT COLUMN: PRODUCT SPECIFICATION AND QUANTITY ESTIMATOR (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* PRODUCT SELECTION PANEL */}
          <div className="bg-white rounded-3xl p-5 border border-brand-navy/10 shadow-xs space-y-4">
            <h3 className="text-xs font-black text-brand-navy uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-50">
              <span>🛍️</span> Select Catalog Product
            </h3>

            {/* Filter by Category */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[10px] font-black rounded-lg transition ${
                    selectedCategory === cat
                      ? 'bg-brand-navy text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
              />
              <span className="absolute right-3.5 top-2.5 text-slate-400">🔍</span>
            </div>

            {/* Products List Scroll Container */}
            <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const isSelected = selectedProduct.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      console.log('[DEBUG] Catalog Product Clicked in Single-Product Visualizer Page:', {
                        id: p.id,
                        productName: p.productName,
                        productCode: p.productCode,
                        category: p.category,
                        textureUrl: p.visualizer?.textureUrl || p.textureImage || p.mainImage || '',
                        allMetadata: p
                      });
                      setSelectedProduct(p);
                      if (p.defaultOrientation) setOrientation(p.defaultOrientation);
                    }}
                    className={`flex items-center gap-3 p-2 rounded-xl text-left border transition ${
                      isSelected
                        ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange'
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={p.mainImage || p.images[0]}
                      alt={p.productName}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-grow min-w-0">
                      <div className="text-[11px] font-black text-brand-navy truncate">
                        {p.productName}
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-slate-400 mt-0.5">
                        <span>Code: {p.productCode}</span>
                        <span className="font-extrabold text-slate-600">₹{p.sellingPrice}/{p.unit}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE TARGET SURFACE AND MATERIAL TUNER */}
          <SurfaceList
            selectedSurfaceId={selectedSurfaceId}
            onSelectSurface={handleSelectSurface}
            surfaceWidthFt={dimensions.wallWidthFt}
            surfaceHeightFt={dimensions.wallHeightFt}
            sectionSettings={sectionSettings}
            onUpdateSectionSettings={setSectionSettings}
          />

          {/* SELECTED PRODUCT SPECS CARD */}
          <div className="bg-white rounded-3xl p-5 border border-brand-navy/10 shadow-xs space-y-3.5">
            <div className="flex items-center gap-3.5 pb-3 border-b border-slate-50">
              <img
                src={selectedProduct.mainImage || selectedProduct.images[0]}
                alt={selectedProduct.productName}
                className="w-14 h-14 object-cover rounded-xl border border-slate-100 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <span className="text-[9px] font-extrabold text-brand-orange uppercase tracking-widest">{selectedProduct.category}</span>
                <h4 className="text-xs font-black text-brand-navy leading-snug truncate">{selectedProduct.productName}</h4>
                <div className="text-[10px] text-slate-400 mt-0.5 font-bold">
                  Code: {selectedProduct.productCode} | Orientation: {orientation.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Sizing Matrix */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 flex flex-col">
                <span className="text-slate-400 font-bold mb-0.5">Physical Sizing</span>
                <span className="text-brand-navy font-black">
                  {selectedProduct.size} ({(pW * 12).toFixed(0)}″ × {(pH).toFixed(0)}′)
                </span>
              </div>
              <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 flex flex-col">
                <span className="text-slate-400 font-bold mb-0.5">Repeat Style</span>
                <span className="text-brand-navy font-black capitalize">
                  {selectedProduct.visualizer?.repeatMode || selectedProduct.repeatMode || 'Tile Repeat'}
                </span>
              </div>
            </div>

            {/* Material Tuners */}
            <div className="grid grid-cols-2 gap-3.5 pt-1.5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 block">Rotate Orientation</label>
                <div className="grid grid-cols-2 gap-1 bg-slate-100 p-0.5 rounded-lg">
                  <button
                    onClick={() => setOrientation('vertical')}
                    className={`px-1 py-1 text-[9px] font-black rounded-md transition ${
                      orientation === 'vertical' ? 'bg-white text-brand-navy shadow-xs' : 'text-slate-500 hover:text-brand-navy'
                    }`}
                  >
                    Vertical
                  </button>
                  <button
                    onClick={() => setOrientation('horizontal')}
                    className={`px-1 py-1 text-[9px] font-black rounded-md transition ${
                      orientation === 'horizontal' ? 'bg-white text-brand-navy shadow-xs' : 'text-slate-500 hover:text-brand-navy'
                    }`}
                  >
                    Horizontal
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-black text-slate-500">
                  <span>Zoom Texture:</span>
                  <span>{Math.round(scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange mt-2"
                />
              </div>
            </div>
          </div>

          {/* INTERACTIVE QUANTITY AND COST ESTIMATOR */}
          <div className="bg-brand-navy text-white rounded-3xl p-5 border border-brand-navy/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>🧮</span> Quantity & Cost Estimator
              </h3>
              <span className="text-[9px] font-black text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-2 py-0.5 rounded-lg uppercase">
                Offline Safe
              </span>
            </div>

            {/* Sizing Summary Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                <div className="text-[9px] text-slate-400 font-bold mb-0.5">Target Area</div>
                <div className="text-xs font-black text-white">{calculation.targetAreaSqFt.toFixed(1)} <span className="text-[9px]">Sq.Ft</span></div>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                <div className="text-[9px] text-slate-400 font-bold mb-0.5">Unit Coverage</div>
                <div className="text-xs font-black text-white">{calculation.coveragePerUnitSqFt.toFixed(1)} <span className="text-[9px]">Sq.Ft</span></div>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                <div className="text-[9px] text-slate-400 font-bold mb-0.5">Wastage Cushion</div>
                <div className="text-xs font-black text-brand-orange">+{calculation.recommendedWastagePercent}%</div>
              </div>
            </div>

            {/* Core Calculations Block */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold">Base requirements:</span>
                <span className="text-white font-extrabold">{calculation.unitsNeededBeforeWastage} {calculation.sellingUnit}s</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold">Total with wastage cushion:</span>
                <span className="text-brand-orange font-black text-sm">{calculation.unitsNeededWithWastage} {calculation.sellingUnit}s</span>
              </div>
              <div className="border-t border-white/10 my-2 pt-2" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold">Product price (₹{selectedProduct.sellingPrice}/{calculation.sellingUnit}):</span>
                <span className="text-white font-extrabold">₹{calculation.productCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold">Installation (₹{selectedProduct.installationCharge || 0}/{calculation.sellingUnit}):</span>
                <span className="text-white font-extrabold">₹{calculation.installationCost.toLocaleString()}</span>
              </div>
              
              {/* Grand Total Row */}
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 flex justify-between items-center mt-3">
                <div>
                  <span className="text-[9px] text-slate-300 font-black uppercase tracking-wider block">Total Estimated Cost</span>
                  <span className="text-[9px] text-slate-400">Product + Expert Installation</span>
                </div>
                <span className="text-xl font-black text-brand-orange">
                  ₹{calculation.totalCost.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Layout layout hints */}
            <div className="text-[10px] text-slate-400 bg-black/10 p-2.5 rounded-xl border border-white/5 leading-relaxed space-y-1">
              <div className="font-bold text-white flex items-center gap-1">
                <span>📋</span> Installation Layout Guide:
              </div>
              <div>• Fits <b>{calculation.colsNeeded} column segments</b> horizontally on the selected surface area.</div>
              {calculation.rowsNeeded > 1 && (
                <div>• Stacks <b>{calculation.rowsNeeded} rows</b> vertically to reach target surface ceiling.</div>
              )}
              <div>• Redundant waste offcuts: <b>{calculation.wastageSqFt.toFixed(1)} Sq.Ft</b>. Leftovers: <b>{calculation.remainingAreaSqFt.toFixed(1)} Sq.Ft</b>.</div>
            </div>

            {/* CTA ACTION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleAddToBasket}
                className="w-full bg-brand-orange hover:bg-orange-600 active:scale-95 text-white py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                id="btn-add-visual-to-basket"
              >
                <span>🛒</span> Add to Enquiry
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="w-full bg-whatsapp hover:bg-emerald-600 active:scale-95 text-white py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                id="btn-share-visual-whatsapp"
              >
                <span>💬</span> Ask on WhatsApp
              </button>
            </div>

            <button
              onClick={handleSaveDesign}
              className="w-full bg-white/10 hover:bg-white/20 active:scale-95 text-white py-2.5 rounded-xl font-black text-xs transition border border-white/10 flex items-center justify-center gap-1"
              id="btn-save-visual-design"
            >
              <span>💾</span> Save Current Design
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
