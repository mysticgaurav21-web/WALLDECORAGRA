import React from 'react';
import { RoomPreset, RoomPresetId } from '../types/visualizer';

export const ROOM_PRESETS: RoomPreset[] = [
  {
    id: 'living-room',
    name: '🛋️ Living Room',
    description: 'Modern room with a cozy sofa, accent pillows, and wooden coffee table.'
  },
  {
    id: 'bedroom',
    name: '🛏️ Bedroom Cozy',
    description: 'Charming master bedroom with pillow set, comfortable duvet, headboard, and bedside lamps.'
  },
  {
    id: 'tv-wall',
    name: '📺 TV Accent Wall',
    description: 'Sleek living room segment displaying a high-gloss flat screen and rich walnut floating media console.'
  },
  {
    id: 'office-reception',
    name: '🏢 Office Reception',
    description: 'Corporate front desk lobby with elegant wooden panels and leather visitor seating.'
  },
  {
    id: 'showroom',
    name: '✨ Modern Showroom',
    description: 'Bright display studio featuring sample material tracks and spotlight tracks.'
  },
  {
    id: 'window-wall',
    name: '🪟 Window Wall Accent',
    description: 'Chic room segment containing full-sized glass partitions, black metal frames, and blinds.'
  },
  {
    id: 'empty-room',
    name: '📦 Bare Empty Room',
    description: 'Clear geometric studio with walls and floor, ideal for focused accent visual reviews.'
  }
];

interface PresetRoomSelectorProps {
  selectedPresetId: RoomPresetId;
  onSelectPreset: (id: RoomPresetId) => void;
}

export const PresetRoomSelector: React.FC<PresetRoomSelectorProps> = ({
  selectedPresetId,
  onSelectPreset,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-brand-navy/10 shadow-xs space-y-3" id="preset-room-selector-card">
      <h3 className="text-xs font-black text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
        <span>🏠</span> Choose 3D Room Preset Environment
      </h3>
      <p className="text-[11px] text-slate-500">
        Change the furniture backdrop instantly. Your customized sizes, materials, and quantity calculations will carry over.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
        {ROOM_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange text-brand-navy shadow-xs'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
              id={`preset-btn-${preset.id}`}
            >
              <div className="text-xs font-black leading-tight mb-1">{preset.name}</div>
              <div className="text-[9px] text-slate-400 leading-normal line-clamp-2">
                {preset.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
