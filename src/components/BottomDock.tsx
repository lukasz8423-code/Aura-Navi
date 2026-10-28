import React from 'react';
import { Play, Pause, RotateCcw, LocateFixed, Flag, CheckCircle } from 'lucide-react';

interface BottomDockProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  speedMultiplier: number;
  onChangeSpeedMultiplier: (multiplier: number) => void;
  progressPercent: number;
  distanceRemainingKm: number;
  timeRemainingMin: number;
  destinationName: string;
  isLiveGps: boolean;
  onToggleLiveGps: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  isPlaying,
  onTogglePlay,
  onReset,
  speedMultiplier,
  onChangeSpeedMultiplier,
  progressPercent,
  distanceRemainingKm,
  timeRemainingMin,
  destinationName,
  isLiveGps,
  onToggleLiveGps,
}) => {
  const now = new Date();
  const etaDate = new Date(now.getTime() + timeRemainingMin * 60 * 1000);
  const formattedEta = etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <footer className="h-14 lg:h-18 w-full bg-[#0A0D14]/95 border-t border-cyan-500/20 backdrop-blur-md px-2 sm:px-4 flex items-center justify-between gap-2 z-40 shrink-0">
      {/* ETA & Distance Cluster */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-0.5 text-center shrink-0">
          <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">ETA</span>
          <span className="text-xs sm:text-sm font-mono font-bold text-cyan-400 leading-none">{formattedEta}</span>
        </div>

        <div className="min-w-0 max-w-[120px] sm:max-w-none">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white">
            <span className="font-mono text-cyan-300 text-xs sm:text-sm">{timeRemainingMin} min</span>
            <span className="text-slate-600">·</span>
            <span className="font-mono text-slate-300 text-xs">{distanceRemainingKm.toFixed(1)} km</span>
          </div>
          <div className="text-[10px] text-slate-400 truncate hidden sm:flex items-center gap-1">
            <Flag className="w-3 h-3 text-violet-400 shrink-0" />
            <span className="truncate">{destinationName}</span>
          </div>
        </div>
      </div>

      {/* Simulation / Live Controls */}
      <div className="flex-1 max-w-sm sm:max-w-md mx-1 flex flex-col gap-1 items-center">
        <div className="flex items-center gap-2">
          {/* Live GPS Toggle */}
          <button
            onClick={onToggleLiveGps}
            className={`min-h-[36px] px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              isLiveGps
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                : 'bg-slate-900 border border-slate-800 text-slate-300'
            }`}
            title="Śledzenie Żywej Lokalizacji GPS"
          >
            <LocateFixed className={`w-3.5 h-3.5 ${isLiveGps ? 'animate-spin' : 'text-emerald-400'}`} />
            <span className="text-[11px]">{isLiveGps ? 'GPS Żywo' : 'Śledź GPS'}</span>
          </button>

          {/* Drive Simulation Button */}
          <button
            onClick={onTogglePlay}
            className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg ${
              isPlaying
                ? 'bg-violet-600 text-white aura-glow-violet'
                : 'bg-cyan-500 text-black aura-glow-cyan'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>Pauza</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Symuluj</span>
              </>
            )}
          </button>

          {/* Speed Multiplier Pill */}
          <div className="hidden sm:flex items-center gap-0.5 p-0.5 bg-slate-900 rounded-xl border border-slate-800">
            {[1, 2, 5].map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeedMultiplier(s)}
                className={`px-1.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  speedMultiplier === s ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full flex items-center gap-1.5">
          <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
          <span className="text-[9px] font-mono text-cyan-400 shrink-0">
            {Math.round(progressPercent)}%
          </span>
        </div>
      </div>

      {/* Reset Action */}
      <div className="shrink-0">
        <button
          onClick={onReset}
          className="min-h-[36px] p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Resetuj"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};
