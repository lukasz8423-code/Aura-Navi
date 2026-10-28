import React from 'react';
import {
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  RotateCw,
  MapPin,
  Navigation
} from 'lucide-react';
import { TurnInstruction } from '../types/navigation';

interface NextTurnHUDProps {
  currentInstruction: TurnInstruction | null;
  nextInstruction: TurnInstruction | null;
  distanceToStepMeters: number;
}

export const NextTurnHUD: React.FC<NextTurnHUDProps> = ({
  currentInstruction,
  nextInstruction,
  distanceToStepMeters,
}) => {
  if (!currentInstruction) return null;

  const renderTurnIcon = (iconType: string, size = 'w-8 h-8') => {
    switch (iconType) {
      case 'turn-left':
        return <CornerUpLeft className={`${size} text-black`} />;
      case 'turn-right':
        return <CornerUpRight className={`${size} text-black`} />;
      case 'slight-left':
        return <CornerUpLeft className={`${size} text-black transform -rotate-45`} />;
      case 'slight-right':
        return <CornerUpRight className={`${size} text-black transform rotate-45`} />;
      case 'roundabout':
        return <RotateCw className={`${size} text-black`} />;
      case 'destination':
        return <MapPin className={`${size} text-black`} />;
      default:
        return <ArrowUp className={`${size} text-black`} />;
    }
  };

  const displayDistance =
    distanceToStepMeters > 1000
      ? `${(distanceToStepMeters / 1000).toFixed(1)} km`
      : `${Math.round(distanceToStepMeters)} m`;

  return (
    <div className="aura-glass rounded-2xl p-3.5 shadow-2xl border border-cyan-500/40 w-72 md:w-80 aura-glow-cyan">
      <div className="flex items-center gap-3.5">
        {/* Glowing Maneuver Icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg aura-glow-cyan">
          {renderTurnIcon(currentInstruction.iconType)}
        </div>

        {/* Distance & Main Instruction */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-black text-white tracking-tight tabular-nums">
              {displayDistance}
            </span>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
              Do manewru
            </span>
          </div>

          <div className="text-sm font-bold text-cyan-300 truncate leading-tight">
            {currentInstruction.streetName}
          </div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300 leading-snug line-clamp-1">
        {currentInstruction.instructionText}
      </div>

      {/* Next Upcoming Maneuver Preview */}
      {nextInstruction && (
        <div className="mt-2 pt-1.5 border-t border-slate-800/50 flex items-center gap-2 text-[11px] text-slate-400">
          <span className="text-slate-500 font-mono text-[10px]">NASTĘPNIE:</span>
          <div className="flex items-center gap-1.5 truncate text-slate-300 font-medium">
            <div className="w-3.5 h-3.5 text-cyan-400">
              {renderTurnIcon(nextInstruction.iconType, 'w-3.5 h-3.5 text-cyan-400')}
            </div>
            <span className="truncate">{nextInstruction.streetName}</span>
          </div>
        </div>
      )}
    </div>
  );
};
