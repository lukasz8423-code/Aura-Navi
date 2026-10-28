import React from 'react';
import { Compass, Mountain, AlertCircle } from 'lucide-react';

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
    <div className="aura-glass rounded-2xl p-2 sm:p-2.5 shadow-2xl border border-cyan-500/30 flex items-center gap-2.5 sm:gap-3.5 aura-glow-cyan">
      {/* Speedometer Gauge Dial */}
      <div className="relative flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-slate-950/90 rounded-xl border border-slate-800 p-0.5">
        <span
          className={`text-xl sm:text-2xl font-mono font-black tracking-tight tabular-nums ${
            isSpeeding ? 'text-rose-500 animate-pulse' : 'text-cyan-400'
          }`}
        >
          {Math.round(currentSpeedKmh)}
        </span>
        <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest -mt-1">
          KM/H
        </span>

        {isSpeeding && (
          <div className="absolute -top-1 -right-1 bg-rose-600 text-white p-0.5 rounded-full shadow-lg">
            <AlertCircle className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Speed Limit & Compass Stats */}
      <div className="flex flex-col gap-1">
        {/* Speed Limit Sign Badge */}
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-red-600 flex items-center justify-center shadow-md shrink-0">
            <span className="text-[10px] sm:text-xs font-black text-black font-mono">{speedLimitKmh}</span>
          </div>
          <div className="text-[9px] font-mono text-slate-400">
            <span className="block font-bold text-slate-300 leading-none">LIMIT</span>
          </div>
        </div>

        {/* Compass Heading & Elevation */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs border-t border-slate-800/80 pt-1">
          <div className="flex items-center gap-0.5 text-slate-300 font-mono">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span className="font-bold text-white">{getCompassDirection(headingDegrees)}</span>
          </div>

          <div className="flex items-center gap-0.5 text-slate-300 font-mono">
            <Mountain className="w-3 h-3 text-emerald-400" />
            <span className="font-bold text-slate-200">+{elevationMeters}m</span>
          </div>
        </div>
      </div>
    </div>
  );
};
