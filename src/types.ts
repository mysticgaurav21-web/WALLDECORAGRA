/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VisualizerSettings {
  repeatable: boolean;
  preserveAspectRatio: boolean;
  defaultScale: number;
  defaultPosition: string;
}

export interface Product {
  id: string;
  mainProduct: string;
  category: string;
  subcategory: string;
  productName: string;
  productCode: string;
  material: string;
  colour: string;
  design?: string;
  size: string;
  thickness?: string;
  finish: string;
  unit: string;
  sellingPrice: number; // in INR (₹)
  installationCharge?: number; // in INR (₹)
  stockQuantity: number;
  images: string[];
  roomPreviewImages: string[];
  description: string;
  suitableFor: string[];
  warranty?: string;
  featured: boolean;
  popular?: boolean;
  active: boolean;

  // Visualizer and physical layouts fields
  width?: number;
  height?: number;
  dimensionUnit?: "inch" | "ft" | "cm" | "m";
  sellingUnit?: "panel" | "sheet" | "roll" | "piece" | "box" | "sq.ft" | "sq.m" | "unit";
  coveragePerUnit?: number;
  defaultOrientation?: "vertical" | "horizontal";
  repeatMode?: "tile" | "stretch" | "strip" | "single-sheet" | "panel-strip" | "wallpaper-roll" | "floor-plank" | "window-overlay";
  recommendedWastage?: number;
  mainImage?: string;
  textureImage?: string;
  transparentProductImage?: string;
  roomPreviewImage?: string;
  visualizerSettings?: VisualizerSettings;

  physicalDimensions?: {
    width: number;
    height: number;
    thickness?: number;
    unit: "inch" | "ft" | "cm" | "m";
  };

  visualizer?: {
    imageUrl: string;
    textureUrl?: string;
    normalMapUrl?: string;
    roughnessMapUrl?: string;
    transparentOverlayUrl?: string;
    repeatMode: "panel-strip" | "tile" | "sheet" | "wallpaper-roll" | "floor-plank" | "window-overlay" | "stretch" | "single-sheet";
    repeatable: boolean;
    preserveAspectRatio: boolean;
    defaultScale: number;
    textureDirection: "vertical" | "horizontal" | "free";
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string; // installed room preview
  subcategories: string[];
}

export interface EnquiryBasketItem {
  product: Product;
  quantity: number;
}

export interface EnquiryFormInput {
  name: string;
  mobile: string;
  whatsapp: string;
  email?: string;
  city: string;
  address?: string;
  estimatedArea?: string;
  message?: string;
  preferredContact: 'WhatsApp' | 'Phone' | 'Email';
}

export interface ConsultationFormInput {
  name: string;
  mobile: string;
  city: string;
  propertyType: string;
  roomType: string;
  interestedCategory: string;
  approximateArea?: string;
  budgetRange: string;
  preferredVisitDate: string;
  message?: string;
}
