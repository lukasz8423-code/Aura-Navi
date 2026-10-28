import React from 'react';
import {
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  RotateCw,
  MapPin,
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

  const renderTurnIcon = (iconType: string, size = 'w-5 h-5 sm:w-7 sm:h-7') => {
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
    <div className="aura-glass rounded-2xl p-2 sm:p-3 shadow-2xl border border-cyan-500/40 w-56 sm:w-72 lg:w-80 aura-glow-cyan">
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Glowing Maneuver Icon */}
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg aura-glow-cyan">
          {renderTurnIcon(currentInstruction.iconType)}
        </div>

        {/* Distance & Main Instruction */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-2xl font-mono font-black text-white tracking-tight tabular-nums">
              {displayDistance}
            </span>
            <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider hidden sm:inline">
              Manewr
            </span>
          </div>

          <div className="text-xs sm:text-sm font-bold text-cyan-300 truncate leading-tight">
            {currentInstruction.streetName}
          </div>
        </div>
      </div>

      <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 text-[11px] sm:text-xs text-slate-300 leading-snug truncate">
        {currentInstruction.instructionText}
      </div>
    </div>
  );
};
