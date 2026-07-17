import React, { useState, useEffect } from 'react';
import { SavedDesign } from '../types/visualizer';

interface SavedDesignsListProps {
  onLoadDesign: (design: SavedDesign) => void;
  onClose?: () => void;
}

export const SavedDesignsList: React.FC<SavedDesignsListProps> = ({
  onLoadDesign,
  onClose,
}) => {
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);

  // Fetch designs from localStorage
  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('wall_decor_99_saved_visualizer_designs');
      if (stored) {
        setSavedDesigns(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to read saved designs', e);
    }
  };

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm('Are you sure you want to delete this saved design?');
    if (!confirmed) return;

    try {
      const stored = localStorage.getItem('wall_decor_99_saved_visualizer_designs');
      if (stored) {
        const list = JSON.parse(stored) as SavedDesign[];
        const filtered = list.filter((item) => item.id !== id);
        localStorage.setItem('wall_decor_99_saved_visualizer_designs', JSON.stringify(filtered));
        setSavedDesigns(filtered);
      }
    } catch (e) {
      console.error('Failed to delete saved design', e);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-brand-navy/10 shadow-xs space-y-4" id="saved-designs-list-card">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
          <span>💾</span> Your Saved Custom Combinations ({savedDesigns.length})
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[10px] px-2.5 py-1 rounded-lg hover:bg-slate-100 font-bold text-slate-500 border border-slate-200 transition"
          >
            Close Panel
          </button>
        )}
      </div>

      {savedDesigns.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-1.5">
          <div className="text-2xl">📁</div>
          <div className="text-xs font-black text-slate-700">No custom designs found</div>
          <p className="text-[10px] text-slate-400 max-w-[280px] mx-auto">
            Design a custom combination of products using the Combination Designer, then hit "Save Current Design" to store it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
          {savedDesigns.map((design) => {
            return (
              <div
                key={design.id}
                onClick={() => onLoadDesign(design)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-brand-orange rounded-xl p-3.5 transition cursor-pointer flex flex-col justify-between space-y-3 relative group"
                id={`saved-design-item-${design.id}`}
              >
                {/* Delete button floating */}
                <button
                  onClick={(e) => handleDelete(design.id, e)}
                  className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition"
                  title="Delete saved design"
                >
                  🗑️
                </button>

                <div className="space-y-1">
                  <div className="text-xs font-black text-brand-navy pr-6 truncate">{design.name}</div>
                  <div className="text-[9px] text-slate-400">
                    Saved: {new Date(design.date).toLocaleDateString()} at {new Date(design.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-2 border border-slate-100 space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold">
                    <span>Room Presets:</span>
                    <span className="text-brand-navy">{design.roomPresetId.toUpperCase().replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold">
                    <span>Active Wall Surface:</span>
                    <span className="text-brand-navy">{design.selectedSurfaceId.toUpperCase().replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold">
                    <span>Layered Products:</span>
                    <span className="text-brand-navy bg-orange-50 px-1.5 py-0.5 rounded text-[8px] font-black">{design.layers.length} items</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-[9px] font-black text-brand-orange uppercase tracking-wider">
                    Click to load design →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
