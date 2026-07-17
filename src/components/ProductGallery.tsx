/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  roomPreviewImages: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  roomPreviewImages,
  productName,
}) => {
  // Combine product shots and room previews for a diverse rich gallery
  const allImages = [
    ...images,
    ...roomPreviewImages,
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80', // Close up placeholder
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', // Texture/Detail placeholder
  ].slice(0, 6); // Max 6 gallery items: Main, Close-up, Full, Room Preview, Texture, Colour

  const labels = [
    'Main Product',
    'Close-Up View',
    'Full Product View',
    'Installed Room Preview',
    'Texture Detail',
    'Colour Preview',
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStartDist, setTouchStartDist] = useState<number | null>(null);

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    resetZoom();
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    resetZoom();
  };

  // Keyboard navigation & Close support
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        setIsOpen(false);
        resetZoom();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom === 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch gesture handlers for mobile pinch & swipe drag
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchStartDist(dist);
    } else if (e.touches.length === 1 && zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && touchStartDist !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchStartDist;
      setZoom((prevZoom) => {
        const nextZoom = Math.min(Math.max(prevZoom * factor, 1), 4);
        return parseFloat(nextZoom.toFixed(2));
      });
      setTouchStartDist(dist);
    } else if (e.touches.length === 1 && isDragging) {
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchStartDist(null);
  };

  // Mouse wheel zoom support
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const scaleFactor = 0.08;
    const direction = e.deltaY < 0 ? 1 : -1;
    setZoom((prevZoom) => {
      const nextZoom = Math.min(Math.max(prevZoom + direction * scaleFactor * prevZoom, 1), 4);
      return parseFloat(nextZoom.toFixed(2));
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Stage */}
      <div className="relative aspect-4/3 sm:aspect-square overflow-hidden rounded-xl border border-brand-navy/10 bg-white group shadow-xs">
        <div
          onClick={() => setIsOpen(true)}
          className="w-full h-full cursor-zoom-in"
          title="Click to Zoom & Inspect Texture"
        >
          <img
            src={allImages[activeIndex]}
            alt={`${productName} - ${labels[activeIndex]}`}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center transition-all duration-500"
          />
        </div>

        {/* Floating Tag */}
        <span className="absolute bottom-4 left-4 z-10 rounded-lg bg-brand-navy/85 backdrop-blur-xs px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-white tracking-wide shadow-sm">
          {labels[activeIndex] || 'Gallery View'}
        </span>

        {/* Floating Inspect Texture Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="absolute top-3 right-3 z-10 p-2 sm:p-2.5 rounded-xl bg-white/95 backdrop-blur-xs text-brand-navy hover:text-brand-orange shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer text-[10px] sm:text-xs font-bold border border-brand-navy/5"
          title="Zoom & Inspect Texture"
        >
          <Maximize2 className="h-4 w-4" />
          <span>Inspect Texture</span>
        </button>

        {/* Gallery Slider Controls (Swipe/Click Arrow on stage) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-xs text-brand-navy hover:text-brand-orange shadow-md opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-xs text-brand-navy hover:text-brand-orange shadow-md opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Thumbnails Navigation */}
      <div className="grid grid-cols-6 gap-2 sm:gap-3">
        {allImages.map((img, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveIndex(index);
              resetZoom();
            }}
            className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-white transition-all active:scale-95 ${
              activeIndex === index
                ? 'border-brand-orange shadow-xs ring-1 ring-brand-orange'
                : 'border-brand-navy/5 hover:border-brand-navy/20'
            }`}
            title={labels[index]}
          >
            <img
              src={img}
              alt={`${productName} thumbnail ${index + 1}`}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Tap-To-Expand & Interactive Pinch/Scroll-To-Zoom Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-between bg-brand-navy/95 backdrop-blur-md p-4 transition-all duration-300">
          {/* Header Controls */}
          <div className="flex items-center justify-between w-full border-b border-white/10 pb-3">
            <div className="text-white">
              <h3 className="font-display text-sm sm:text-base font-extrabold tracking-tight">
                {productName}
              </h3>
              <p className="text-[10px] sm:text-xs font-medium text-brand-orange tracking-wide uppercase mt-0.5">
                {labels[activeIndex]} — Zoom: {Math.round(zoom * 100)}%
              </p>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                resetZoom();
              }}
              className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-brand-orange hover:text-white transition-all cursor-pointer active:scale-95 border border-white/5"
              aria-label="Close interactive gallery"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Interactive Zoom Stage */}
          <div
            className="relative flex-1 flex items-center justify-center overflow-hidden my-4 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            {/* Gallery Navigation: Left Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 z-20 p-3 rounded-full bg-white/10 hover:bg-brand-orange text-white shadow-lg transition-all active:scale-90 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Main Interactive Zoomable Image */}
            <div
              className="max-w-full max-h-[65vh] aspect-square flex items-center justify-center transition-transform duration-75"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
              }}
            >
              <img
                src={allImages[activeIndex]}
                alt={labels[activeIndex]}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[65vh] object-contain rounded-lg pointer-events-none"
              />
            </div>

            {/* Gallery Navigation: Right Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-brand-orange text-white shadow-lg transition-all active:scale-90 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Footer Controls & Instructions */}
          <div className="border-t border-white/10 pt-4 flex flex-col gap-3 items-center justify-center">
            {/* Gesture Helper Instruction text */}
            <p className="text-[10px] sm:text-xs text-brand-ivory/80 text-center font-sans tracking-wide max-w-md">
              💡 <span className="text-brand-orange font-bold">Touch:</span> Pinch to zoom, drag to pan. <span className="text-brand-orange font-bold">Desktop:</span> Scroll wheel to zoom, click & drag to inspect close-up panel flutes or marble veins.
            </p>

            {/* Interactive Control buttons */}
            <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/10">
              <button
                onClick={() => setZoom((prev) => Math.max(prev - 0.25, 1))}
                disabled={zoom <= 1}
                className="p-2 rounded-xl text-white hover:bg-white/10 hover:text-brand-orange disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer active:scale-95"
                title="Zoom Out"
              >
                <ZoomOut className="h-4.5 w-4.5" />
              </button>

              <span className="text-xs font-mono font-bold text-white px-3 min-w-[4.5rem] text-center">
                {Math.round(zoom * 100)}%
              </span>

              <button
                onClick={() => setZoom((prev) => Math.min(prev + 0.25, 4))}
                disabled={zoom >= 4}
                className="p-2 rounded-xl text-white hover:bg-white/10 hover:text-brand-orange disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer active:scale-95"
                title="Zoom In"
              >
                <ZoomIn className="h-4.5 w-4.5" />
              </button>

              <div className="w-px h-6 bg-white/10 mx-1" />

              <button
                onClick={resetZoom}
                className="p-2 rounded-xl text-white hover:bg-white/10 hover:text-brand-orange transition-all cursor-pointer active:scale-95"
                title="Reset View"
              >
                <RotateCcw className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
