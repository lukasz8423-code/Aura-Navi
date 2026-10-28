import React from 'react';
import { Gauge, Compass, Mountain, AlertCircle } from 'lucide-react';

interface SpeedometerHUDProps {
  currentSpeedKmh: number;
  speedLimitKmh: number;
  headingDegrees: number;
  elevationMeters: number;
}

export const SpeedometerHUD: React.FC<SpeedometerHUDProps> = ({
  currentSpeedKmh,
  speedLimitKmh,
  headingDegrees,
  elevationMeters,
}) => {
  const isSpeeding = currentSpeedKmh > speedLimitKmh;

  const getCompassDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const idx = Math.round(deg / 45) % 8;
    return directions[idx];
  };

  return (
    <div className="aura-glass rounded-2xl p-3 shadow-2xl border border-cyan-500/30 flex items-center gap-4 aura-glow-cyan">
      {/* Speedometer Gauge Dial */}
      <div className="relative flex flex-col items-center justify-center w-20 h-20 bg-slate-950/80 rounded-2xl border border-slate-800 p-1">
        <span
          className={`text-3xl font-mono font-black tracking-tight tabular-nums ${
            isSpeeding ? 'text-rose-500 animate-pulse' : 'text-cyan-400'
          }`}
        >
          {Math.round(currentSpeedKmh)}
        </span>
        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest -mt-1">
          KM/H
        </span>

        {/* Speed Warning Tag */}
        {isSpeeding && (
          <div className="absolute -top-2 -right-2 bg-rose-600 text-white p-1 rounded-full shadow-lg">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Speed Limit & Compass Stats */}
      <div className="flex flex-col gap-2">
        {/* Speed Limit Sign Badge */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white border-2 border-red-600 flex items-center justify-center shadow-md shrink-0">
            <span className="text-xs font-black text-black font-mono">{speedLimitKmh}</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            <span className="block font-bold text-slate-300">LIMIT</span>
            <span className="text-slate-500">PRĘDKOŚCI</span>
          </div>
        </div>

        {/* Compass Heading & Elevation */}
        <div className="flex items-center gap-3 text-xs border-t border-slate-800/80 pt-1.5">
          <div className="flex items-center gap-1 text-slate-300 font-mono">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-white">{getCompassDirection(headingDegrees)}</span>
            <span className="text-[10px] text-slate-500">{Math.round(headingDegrees)}°</span>
          </div>

          <div className="flex items-center gap-1 text-slate-300 font-mono">
            <Mountain className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold text-slate-200">+{elevationMeters}m</span>
          </div>
        </div>
      </div>
    </div>
  );
};
