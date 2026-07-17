/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Product, Category } from '../types';
import {
  Upload, Trash2, Edit, Plus, Search, Settings, Layers, Box, Sparkles, Check, CheckCircle2,
  TrendingUp, FolderHeart, ArrowLeft, RefreshCw, AlertCircle, Image as ImageIcon, Sparkle, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminPage: React.FC = () => {
  const { products, categories, addProduct, editProduct, deleteProduct } = useApp();
  const navigate = useNavigate();

  // Navigation / Tabs
  const [activeTab, setActiveTab] = useState<'products' | 'add-product' | 'categories'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Product form state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [category, setCategory] = useState('Wall Panels');
  const [subcategory, setSubcategory] = useState('');
  const [material, setMaterial] = useState('');
  const [colour, setColour] = useState('');
  const [size, setSize] = useState('');
  const [thickness, setThickness] = useState('');
  const [finish, setFinish] = useState('');
  const [unit, setUnit] = useState('Piece');
  const [sellingPrice, setSellingPrice] = useState('');
  const [installationCharge, setInstallationCharge] = useState('');
  const [stockQuantity, setStockQuantity] = useState('50');
  const [description, setDescription] = useState('');
  const [suitableFor, setSuitableFor] = useState('Living Room, Bedroom, Office');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Success Notification Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // List of Preset Premium textures so the user can easily select high-quality materials without having to upload
  const PRESET_TEXTURES = [
    {
      name: 'Charcoal Oak Wood',
      url: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Classic White Carrara Marble',
      url: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Travertine Stone Beige',
      url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Royal Emerald Flutes',
      url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=600&q=80',
    }
  ];

  // Populate subcategories list based on selected category
  const activeSubcategories = React.useMemo(() => {
    const foundCat = categories.find((c) => c.name.toLowerCase() === category.toLowerCase());
    return foundCat ? foundCat.subcategories : [];
  }, [category, categories]);

  // Handle Drag & Drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  // Convert image file to Base64 data url for offline-friendly storage in localStorage
  const processImageFile = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('❌ Please upload a valid image file.', 'error');
      return;
    }

    // Limit to 2MB to avoid overflowing localStorage
    if (file.size > 2 * 1024 * 1024) {
      showToast('⚠️ Image file is too large (limit: 2MB for storage performance).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedImage(reader.result);
        showToast('📸 Photo uploaded and processed successfully!', 'success');
      }
    };
    reader.onerror = () => {
      showToast('❌ Error reading file.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  // Submit Handler for Products
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName || !productCode || !sellingPrice) {
      showToast('❌ Name, code, and selling price are strictly required fields.', 'error');
      return;
    }

    const finalImage = uploadedImage || 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=400&q=80';

    const cleanCategory = category.trim();
    const finalSubcategory = subcategory || (activeSubcategories[0] || 'Premium Wall Panels');

    const productPayload: Product = {
      id: editingProductId || `product-${Date.now()}`,
      mainProduct: 'Interior Products',
      category: cleanCategory,
      subcategory: finalSubcategory,
      productName,
      productCode,
      material: material || 'Premium Grade Materials',
      colour: colour || 'Standard Hue',
      size: size || '8ft x 4ft',
      thickness: thickness || '12mm',
      finish: finish || 'Premium Matt Finish',
      unit: unit || 'Piece',
      sellingPrice: parseFloat(sellingPrice),
      installationCharge: parseFloat(installationCharge) || 0,
      stockQuantity: parseInt(stockQuantity) || 50,
      images: [finalImage],
      roomPreviewImages: [finalImage],
      description: description || `Premium ${productName} engineered for sophisticated, luxurious spaces. Durable, elegant, and versatile.`,
      suitableFor: suitableFor.split(',').map(s => s.trim()).filter(Boolean),
      featured: false,
      active: true,
      
      // Visualizer variables for instant 3D rendering
      width: 12,
      height: 12,
      dimensionUnit: 'inch',
      sellingUnit: unit as any || 'piece',
      repeatMode: cleanCategory.toLowerCase().includes('wallpaper') ? 'tile' : 'panel-strip',
      mainImage: finalImage,
      textureImage: finalImage,
      roomPreviewImage: finalImage,
      visualizerSettings: {
        repeatable: true,
        preserveAspectRatio: false,
        defaultScale: 1,
        defaultPosition: 'center'
      },
      visualizer: {
        imageUrl: finalImage,
        textureUrl: finalImage,
        repeatMode: cleanCategory.toLowerCase().includes('wallpaper') ? 'tile' : 'panel-strip',
        repeatable: true,
        preserveAspectRatio: false,
        defaultScale: 1,
        textureDirection: 'vertical'
      }
    };

    if (editingProductId) {
      editProduct(productPayload);
      showToast(`📝 Product "${productName}" successfully updated!`, 'success');
      setEditingProductId(null);
    } else {
      addProduct(productPayload);
      showToast(`🎉 New Product "${productName}" added and initialized into catalog!`, 'success');
    }

    // Reset Form
    resetForm();
    setActiveTab('products');
  };

  const handleEditClick = (p: Product) => {
    setEditingProductId(p.id);
    setProductName(p.productName);
    setProductCode(p.productCode);
    setCategory(p.category);
    setSubcategory(p.subcategory);
    setMaterial(p.material);
    setColour(p.colour);
    setSize(p.size);
    setThickness(p.thickness);
    setFinish(p.finish);
    setUnit(p.unit);
    setSellingPrice(p.sellingPrice.toString());
    setInstallationCharge(p.installationCharge?.toString() || '');
    setStockQuantity(p.stockQuantity?.toString() || '50');
    setDescription(p.description || '');
    setSuitableFor(p.suitableFor ? p.suitableFor.join(', ') : 'Living Room, Bedroom');
    setUploadedImage(p.images[0] || '');
    setActiveTab('add-product');
  };

  const handleDeleteClick = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      deleteProduct(id);
      showToast(`🗑️ Product "${name}" deleted from store context.`, 'info');
    }
  };

  const resetForm = () => {
    setEditingProductId(null);
    setProductName('');
    setProductCode('');
    setCategory('Wall Panels');
    setSubcategory('');
    setMaterial('');
    setColour('');
    setSize('');
    setThickness('');
    setFinish('');
    setUnit('Piece');
    setSellingPrice('');
    setInstallationCharge('');
    setStockQuantity('50');
    setDescription('');
    setSuitableFor('Living Room, Bedroom, Office');
    setUploadedImage('');
  };

  // Filter products for dashboard view
  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.productCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat =
        selectedCategoryFilter === 'All' || p.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, selectedCategoryFilter]);

  // Dashboard Stats calculation
  const totalProductsCount = products.length;
  const categoriesCount = categories.length;
  const lowStockCount = products.filter((p) => (p.stockQuantity !== undefined && p.stockQuantity < 10 && p.stockQuantity > 0)).length;
  const outOfStockCount = products.filter((p) => p.stockQuantity === 0).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32 pt-6 font-sans text-brand-navy">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-2xl shadow-xl border text-xs font-bold ${
              toast.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200/50'
                : toast.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200/50'
                : 'bg-slate-50 text-slate-800 border-slate-200/50'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" /> : <AlertCircle className="w-4.5 h-4.5 text-rose-600" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-navy text-xs font-black uppercase tracking-wider mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
          </button>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-brand-navy flex items-center gap-2">
            ⚙️ Admin Panel <span className="text-xs bg-brand-orange/10 text-brand-orange border border-brand-orange/20 px-2.5 py-0.5 rounded-full font-bold uppercase">Store Manager</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Seamlessly create, upload textures, manage quantities, and optimize catalog metadata dynamically.
          </p>
        </div>

        {/* Shortcuts */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              resetForm();
              setActiveTab('add-product');
            }}
            className="px-4 py-2 bg-brand-orange hover:bg-brand-orange/95 text-white text-xs font-black rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
          <button
            onClick={() => navigate('/visualizer')}
            className="px-4 py-2 bg-brand-navy text-white hover:bg-brand-navy/95 text-xs font-black rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" /> Open 3D Studio
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Catalog Products', value: totalProductsCount, color: 'text-brand-navy bg-slate-50 border-slate-100', icon: <Box className="w-5 h-5 text-brand-navy/60" /> },
          { label: 'Active Design Categories', value: categoriesCount, color: 'text-indigo-900 bg-indigo-50/50 border-indigo-100/50', icon: <Layers className="w-5 h-5 text-indigo-500/60" /> },
          { label: 'Low Stock Alert (<10)', value: lowStockCount, color: 'text-amber-900 bg-amber-50/50 border-amber-100/50', icon: <TrendingUp className="w-5 h-5 text-amber-500" /> },
          { label: 'Out of Stock Items', value: outOfStockCount, color: outOfStockCount > 0 ? 'text-rose-900 bg-rose-50 border-rose-200/50' : 'text-emerald-900 bg-emerald-50/40 border-emerald-100/30', icon: <FolderHeart className="w-5 h-5 text-rose-500/60" /> }
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${stat.color} flex items-center justify-between`}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">{stat.label}</span>
              <span className="text-xl sm:text-2xl font-black">{stat.value}</span>
            </div>
            {stat.icon}
          </div>
        ))}
      </div>

      {/* TABS CONTAINER */}
      <div className="border-b border-slate-100 mb-6 flex gap-4">
        {[
          { id: 'products', label: '📦 Product Directory' },
          { id: 'add-product', label: editingProductId ? '📝 Edit Specifications' : '➕ Create New Product' },
          { id: 'categories', label: '🗂️ Categories List' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id !== 'add-product') resetForm();
              setActiveTab(tab.id as any);
            }}
            className={`pb-3.5 text-xs font-black tracking-wide uppercase border-b-2 transition relative ${
              activeTab === tab.id
                ? 'border-brand-orange text-brand-orange font-bold'
                : 'border-transparent text-slate-400 hover:text-brand-navy'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ACTIVE VIEW CONTENT */}
      <div>
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Search and Filters bar */}
            <div className="flex flex-col sm:flex-row gap-3.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search catalog by name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-white border border-slate-200/80 rounded-xl px-4 py-2 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table/List */}
            <div className="bg-white rounded-2xl border border-brand-navy/5 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4.5">Item Preview</th>
                      <th className="py-3.5 px-4.5">Metadata / Code</th>
                      <th className="py-3.5 px-4.5">Design Space</th>
                      <th className="py-3.5 px-4.5">Retail Price (INR)</th>
                      <th className="py-3.5 px-4.5">Stock Status</th>
                      <th className="py-3.5 px-4.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-xs text-slate-400 font-bold">
                          No matching design items found. Click "Add Product" above to create one.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => {
                        const isLow = p.stockQuantity !== undefined && p.stockQuantity < 10 && p.stockQuantity > 0;
                        const isOut = p.stockQuantity === 0;

                        return (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-3 px-4.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.images[0] || p.mainImage}
                                  alt={p.productName}
                                  className="w-12 h-12 object-cover rounded-lg border border-slate-100"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <span className="text-xs font-black text-brand-navy block leading-snug">{p.productName}</span>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.productCode}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4.5">
                              <div className="space-y-0.5">
                                <span className="text-[10px] text-slate-600 block"><strong className="font-bold">Finish:</strong> {p.finish}</span>
                                <span className="text-[10px] text-slate-600 block"><strong className="font-bold">Size:</strong> {p.size} ({p.thickness})</span>
                              </div>
                            </td>
                            <td className="py-3 px-4.5">
                              <div className="space-y-0.5">
                                <span className="text-xs font-bold text-indigo-950 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded text-[10px] inline-block">{p.category}</span>
                                <span className="text-[10px] text-slate-400 block italic leading-none mt-1">{p.subcategory}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4.5">
                              <div className="space-y-0.5">
                                <span className="text-xs font-black text-brand-navy">₹{p.sellingPrice.toLocaleString()}<span className="text-[10px] text-slate-400 font-normal">/{p.unit}</span></span>
                                {p.installationCharge && (
                                  <span className="text-[10px] text-slate-400 block font-semibold">+ ₹{p.installationCharge}/sqft installation</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4.5">
                              {isOut ? (
                                <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-black rounded-md">OUT OF STOCK</span>
                              ) : isLow ? (
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black rounded-md">LOW: {p.stockQuantity} Left</span>
                              ) : (
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100/50 text-[10px] font-black rounded-md">{p.stockQuantity || 50} Available</span>
                              )}
                            </td>
                            <td className="py-3 px-4.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleEditClick(p)}
                                  className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-brand-navy rounded-lg transition"
                                  title="Edit Specifications"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(p.id, p.productName)}
                                  className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                                  title="Delete Item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add-product' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-navy/10 shadow-xs space-y-6">
            <h2 className="text-sm font-black text-brand-navy uppercase tracking-wider pb-3 border-b border-slate-50 flex items-center gap-2">
              <span>📐</span> {editingProductId ? 'Edit Product Details & Texture' : 'Add New Decor Specification'}
            </h2>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Specs Inputs */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Emerald WPC Flutes"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Product SKU/Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. WD-WPC-09"
                      value={productCode}
                      onChange={(e) => setProductCode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setSubcategory(''); // Reset subcategory so it chooses from new category list
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Subcategory *</label>
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
                    >
                      <option value="">Select Subcategory</option>
                      {activeSubcategories.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                      {activeSubcategories.length === 0 && (
                        <option value="Premium Panels">Premium Panels</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Primary Material</label>
                    <input
                      type="text"
                      placeholder="e.g. PVC Composite, Paper, Wood"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Colour / Hue</label>
                    <input
                      type="text"
                      placeholder="e.g. Emerald Green & Gold"
                      value={colour}
                      onChange={(e) => setColour(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Dimensions</label>
                    <input
                      type="text"
                      placeholder="e.g. 8ft x 4ft"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Thickness</label>
                    <input
                      type="text"
                      placeholder="e.g. 12mm"
                      value={thickness}
                      onChange={(e) => setThickness(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Surface Finish</label>
                    <input
                      type="text"
                      placeholder="e.g. High Gloss, Matte"
                      value={finish}
                      onChange={(e) => setFinish(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Selling Unit</label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
                    >
                      <option value="Piece">Piece</option>
                      <option value="Roll">Roll</option>
                      <option value="Sheet">Sheet</option>
                      <option value="Panel">Panel</option>
                      <option value="Box">Box</option>
                      <option value="SqFt">Sq.Ft.</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Retail Price (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 2450"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Installation/sqft (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 35"
                      value={installationCharge}
                      onChange={(e) => setInstallationCharge(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Initial Stock Quantity</label>
                    <input
                      type="number"
                      placeholder="50"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Design Applications (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. TV Unit Backdrop, Bedroom Flutes, Accent Wall"
                    value={suitableFor}
                    onChange={(e) => setSuitableFor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Detailed Specifications & Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide premium architectural details about suitability, composition, resistance parameters..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              {/* Right Column: Photo Upload Section & Texture Preview */}
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide block">
                    Product Photo Upload Section
                  </label>
                  <p className="text-[10px] text-slate-400 font-semibold leading-normal mb-2">
                    Provide a seamless high-resolution material texture image. Supported formats: JPG, PNG. Under 2MB limit.
                  </p>

                  {/* Drag-and-Drop Area */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition duration-250 flex flex-col items-center justify-center min-h-[190px] gap-2.5 ${
                      dragOver
                        ? 'border-brand-orange bg-brand-orange/5'
                        : 'border-slate-200 hover:border-brand-navy/30 bg-slate-50/50'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <div className="p-3.5 bg-white rounded-2xl shadow-xs border border-slate-100 text-brand-orange">
                      <Upload className="w-5 h-5" />
                    </div>

                    <div>
                      <span className="text-xs font-black text-brand-navy block">Drag & Drop Material Image Here</span>
                      <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">or click to browse local files</span>
                    </div>
                  </div>
                </div>

                {/* Option to Pick Premium Presets */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide block">
                    Or select from high-resolution decor presets:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_TEXTURES.map((p, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => {
                          setUploadedImage(p.url);
                          showToast(`✨ Selected ${p.name} as product texture!`, 'success');
                        }}
                        className={`flex items-center gap-2 p-1.5 border rounded-xl text-left hover:bg-slate-50 transition ${
                          uploadedImage === p.url ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange' : 'border-slate-100'
                        }`}
                      >
                        <img
                          src={p.url}
                          alt={p.name}
                          className="w-7 h-7 object-cover rounded-md border border-slate-100"
                        />
                        <span className="text-[10px] font-black text-brand-navy truncate leading-tight flex-1">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo Preview Card */}
                {uploadedImage && (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-brand-orange" /> Live Material Preview
                      </span>
                      <button
                        type="button"
                        onClick={() => setUploadedImage('')}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Styled frame to simulate 3D surface repetition */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Single Specimen</span>
                        <div className="aspect-square bg-white border border-slate-100 rounded-xl overflow-hidden relative shadow-inner">
                          <img
                            src={uploadedImage}
                            alt="Uploaded material"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">3D Wall Repeat Pattern</span>
                        <div className="aspect-square border border-slate-100 rounded-xl overflow-hidden relative shadow-inner" style={{
                          backgroundImage: `url(${uploadedImage})`,
                          backgroundSize: category.toLowerCase().includes('wallpaper') ? '40%' : '100% 100%',
                          backgroundRepeat: 'repeat'
                        }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setActiveTab('products');
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-brand-orange hover:bg-brand-orange/95 text-white text-xs font-black rounded-xl shadow-xs transition flex items-center gap-2"
              >
                {editingProductId ? 'Update Catalog Specifications' : 'Initialize Product into Catalog'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="bg-white border border-brand-navy/5 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🗂️</span>
                  <div>
                    <h3 className="text-xs font-black text-brand-navy uppercase tracking-wider leading-tight">{c.name}</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">{c.slug}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-500 uppercase block tracking-wider">Subcategories:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {c.subcategories.map((sub, idx) => (
                      <span key={idx} className="bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-bold">
                  <span>Products in active state:</span>
                  <span className="text-brand-navy font-black">{products.filter((p) => p.category.toLowerCase() === c.name.toLowerCase()).length} items</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
