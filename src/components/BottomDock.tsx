import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock, Navigation, Flag, CheckCircle } from 'lucide-react';

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
}) => {
  // Calculate estimated arrival time
  const now = new Date();
  const etaDate = new Date(now.getTime() + timeRemainingMin * 60 * 1000);
  const formattedEta = etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <footer className="h-20 w-full bg-[#0A0D14]/95 border-t border-cyan-500/20 backdrop-blur-md px-4 flex items-center justify-between gap-4 z-40 shrink-0">
      {/* ETA & Remaining Distance Cluster */}
      <div className="flex items-center gap-4 min-w-0 shrink-0">
        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-1 text-center shrink-0">
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">ETA</span>
          <span className="text-base font-mono font-bold text-cyan-400 leading-none">{formattedEta}</span>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <span className="font-mono text-cyan-300 text-base">{timeRemainingMin} min</span>
            <span className="text-slate-600">·</span>
            <span className="font-mono text-slate-300">{distanceRemainingKm.toFixed(1)} km</span>
          </div>
          <div className="text-xs text-slate-400 truncate flex items-center gap-1">
            <Flag className="w-3 h-3 text-violet-400 shrink-0" />
            <span className="truncate">{destinationName}</span>
          </div>
        </div>
      </div>

      {/* Simulation Controller Bar */}
      <div className="flex-1 max-w-lg mx-2 flex flex-col gap-1.5 items-center">
        {/* Playback Controls & Speed Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Resetuj Symulację od Początku"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className={`px-5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg ${
              isPlaying
                ? 'bg-violet-600 hover:bg-violet-500 text-white aura-glow-violet'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black aura-glow-cyan'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pauza</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black" />
                <span>Jazda Symulacyjna</span>
              </>
            )}
          </button>

          {/* Speed Multiplier Segmented Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            {[1, 2, 5, 10].map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeedMultiplier(s)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  speedMultiplier === s
                    ? 'bg-cyan-500 text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 w-8 text-right">
            {Math.round(progressPercent)}%
          </span>
          <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-cyan-400 w-8">100%</span>
        </div>
      </div>

      {/* End Navigation Action */}
      <div className="shrink-0">
        <button
          onClick={onReset}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-600/60 text-slate-300 hover:text-rose-400 text-xs font-semibold transition-all flex items-center gap-1.5"
        >
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Gotowe / Reset</span>
        </button>
      </div>
    </footer>
  );
};
