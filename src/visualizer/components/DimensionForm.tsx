import React, { useState, useEffect } from 'react';
import { ftToFtIn, ftInToFt } from '../utils/visualizerMath';

interface DimensionFormProps {
  roomWidthFt: number;
  roomLengthFt: number;
  roomHeightFt: number;
  wallWidthFt: number;
  wallHeightFt: number;
  onChange: (dims: {
    roomWidthFt: number;
    roomLengthFt: number;
    roomHeightFt: number;
    wallWidthFt: number;
    wallHeightFt: number;
  }) => void;
}

export const DimensionForm: React.FC<DimensionFormProps> = ({
  roomWidthFt,
  roomLengthFt,
  roomHeightFt,
  wallWidthFt,
  wallHeightFt,
  onChange,
}) => {
  // Convert current decimals to separate ft and in state variables for editing
  const [roomW, setRoomW] = useState(ftToFtIn(roomWidthFt));
  const [roomL, setRoomL] = useState(ftToFtIn(roomLengthFt));
  const [roomH, setRoomH] = useState(ftToFtIn(roomHeightFt));
  const [wallW, setWallW] = useState(ftToFtIn(wallWidthFt));
  const [wallH, setWallH] = useState(ftToFtIn(wallHeightFt));

  // Sync state with props
  useEffect(() => {
    setRoomW(ftToFtIn(roomWidthFt));
    setRoomL(ftToFtIn(roomLengthFt));
    setRoomH(ftToFtIn(roomHeightFt));
    setWallW(ftToFtIn(wallWidthFt));
    setWallH(ftToFtIn(wallHeightFt));
  }, [roomWidthFt, roomLengthFt, roomHeightFt, wallWidthFt, wallHeightFt]);

  const handleUpdate = (
    field: 'roomW' | 'roomL' | 'roomH' | 'wallW' | 'wallH',
    type: 'ft' | 'in',
    value: string
  ) => {
    const numericVal = Math.max(0, parseInt(value) || 0);
    
    // Create copy of target state
    let nextFt = 0;
    let nextIn = 0;

    switch (field) {
      case 'roomW':
        nextFt = type === 'ft' ? numericVal : roomW.ft;
        nextIn = type === 'in' ? Math.min(11, numericVal) : roomW.in;
        setRoomW({ ft: nextFt, in: nextIn });
        break;
      case 'roomL':
        nextFt = type === 'ft' ? numericVal : roomL.ft;
        nextIn = type === 'in' ? Math.min(11, numericVal) : roomL.in;
        setRoomL({ ft: nextFt, in: nextIn });
        break;
      case 'roomH':
        nextFt = type === 'ft' ? numericVal : roomH.ft;
        nextIn = type === 'in' ? Math.min(11, numericVal) : roomH.in;
        setRoomH({ ft: nextFt, in: nextIn });
        break;
      case 'wallW':
        nextFt = type === 'ft' ? numericVal : wallW.ft;
        nextIn = type === 'in' ? Math.min(11, numericVal) : wallW.in;
        setWallW({ ft: nextFt, in: nextIn });
        break;
      case 'wallH':
        nextFt = type === 'ft' ? numericVal : wallH.ft;
        nextIn = type === 'in' ? Math.min(11, numericVal) : wallH.in;
        setWallH({ ft: nextFt, in: nextIn });
        break;
    }

    // Trigger parent callback with calculated decimal feet
    onChange({
      roomWidthFt: field === 'roomW' ? ftInToFt(nextFt, nextIn) : ftInToFt(roomW.ft, roomW.in),
      roomLengthFt: field === 'roomL' ? ftInToFt(nextFt, nextIn) : ftInToFt(roomL.ft, roomL.in),
      roomHeightFt: field === 'roomH' ? ftInToFt(nextFt, nextIn) : ftInToFt(roomH.ft, roomH.in),
      wallWidthFt: field === 'wallW' ? ftInToFt(nextFt, nextIn) : ftInToFt(wallW.ft, wallW.in),
      wallHeightFt: field === 'wallH' ? ftInToFt(nextFt, nextIn) : ftInToFt(wallH.ft, wallH.in),
    });
  };

  // Helper inputs component
  const FtInInputs = ({
    label,
    field,
    ftVal,
    inVal,
  }: {
    label: string;
    field: 'roomW' | 'roomL' | 'roomH' | 'wallW' | 'wallH';
    ftVal: number;
    inVal: number;
  }) => (
    <div className="space-y-1.5">
      <label className="text-[11px] font-extrabold text-slate-600 block">{label}</label>
      <div className="flex items-center space-x-1.5">
        <div className="relative flex-1">
          <input
            type="number"
            min="1"
            max="100"
            value={ftVal === 0 ? '' : ftVal}
            onChange={(e) => handleUpdate(field, 'ft', e.target.value)}
            placeholder="0"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange text-center pr-6"
            id={`input-${field}-ft`}
          />
          <span className="absolute right-2 top-2 text-[9px] font-black text-slate-400 select-none">ft</span>
        </div>
        <div className="relative flex-1">
          <input
            type="number"
            min="0"
            max="11"
            value={inVal}
            onChange={(e) => handleUpdate(field, 'in', e.target.value)}
            placeholder="0"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-orange text-center pr-6"
            id={`input-${field}-in`}
          />
          <span className="absolute right-2 top-2 text-[9px] font-black text-slate-400 select-none">in</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-5 border border-brand-navy/10 shadow-xs space-y-4" id="dimension-form-card">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
          <span>📏</span> Enter Dimensions (Feet & Inches)
        </h3>
        <span className="text-[10px] font-extrabold text-brand-orange bg-brand-orange/5 px-2 py-0.5 rounded-md">
          Internal Scale: 1 unit = 1 ft
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Room Boundaries Grid */}
        <div className="space-y-3.5 border-r border-slate-100 pr-0 md:pr-4">
          <div className="text-[11px] font-black text-brand-navy/60 uppercase tracking-widest border-b border-slate-50 pb-1">
            General Room Envelope
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <FtInInputs label="Room Width" field="roomW" ftVal={roomW.ft} inVal={roomW.in} />
            <FtInInputs label="Room Length" field="roomL" ftVal={roomL.ft} inVal={roomL.in} />
            <FtInInputs label="Room Height" field="roomH" ftVal={roomH.ft} inVal={roomH.in} />
          </div>
        </div>

        {/* Selected Surface Boundaries */}
        <div className="space-y-3.5">
          <div className="text-[11px] font-black text-brand-navy/60 uppercase tracking-widest border-b border-slate-50 pb-1">
            Target Surface Bounds
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <FtInInputs label="Surface Width" field="wallW" ftVal={wallW.ft} inVal={wallW.in} />
            <FtInInputs label="Surface Height" field="wallH" ftVal={wallH.ft} inVal={wallH.in} />
          </div>
        </div>
      </div>
    </div>
  );
};
