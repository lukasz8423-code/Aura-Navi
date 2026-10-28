import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  ArrowRight,
  TrendingUp,
  Clock,
  Navigation,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Heart,
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  RotateCw,
  ShieldAlert,
  Music,
  Map,
  Fuel
} from 'lucide-react';
import { PresetRoute, RouteInsight } from '../types/navigation';
import { PRESET_ROUTES } from '../data/presetRoutes';

interface LeftDockProps {
  currentRoute: PresetRoute;
  onSelectRoute: (route: PresetRoute) => void;
  insight: RouteInsight | null;
  isLoadingInsight: boolean;
  currentStepIndex: number;
}

export const LeftDock: React.FC<LeftDockProps> = ({
  currentRoute,
  onSelectRoute,
  insight,
  isLoadingInsight,
  currentStepIndex,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'turnByTurn' | 'routes' | 'ai'>('turnByTurn');

  const getStepIcon = (iconType: string) => {
    switch (iconType) {
      case 'turn-left':
        return <CornerUpLeft className="w-4 h-4 text-cyan-400" />;
      case 'turn-right':
        return <CornerUpRight className="w-4 h-4 text-cyan-400" />;
      case 'slight-left':
        return <CornerUpLeft className="w-4 h-4 text-cyan-300 transform -rotate-45" />;
      case 'slight-right':
        return <CornerUpRight className="w-4 h-4 text-cyan-300 transform rotate-45" />;
      case 'roundabout':
        return <RotateCw className="w-4 h-4 text-violet-400" />;
      case 'destination':
        return <MapPin className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />;
      default:
        return <ArrowUp className="w-4 h-4 text-slate-300" />;
    }
  };

  if (isCollapsed) {
    return (
      <div className="h-full w-12 bg-[#0F141E]/95 border-r border-slate-800 flex flex-col items-center py-4 justify-between z-30 shrink-0">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-cyan-950 text-cyan-400 transition-colors"
          title="Rozwiń panel nawigacyjny"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="flex flex-col gap-4 text-slate-400">
          <Compass className="w-5 h-5 text-cyan-400" />
          <Navigation className="w-5 h-5 text-violet-400" />
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>
        <div className="text-[10px] font-mono text-slate-500 transform -rotate-90 whitespace-nowrap">
          AURA DOCK
        </div>
      </div>
    );
  }

  return (
    <aside className="h-full w-[360px] lg:w-[400px] bg-[#0F141E]/95 border-r border-cyan-500/20 flex flex-col z-30 shrink-0 backdrop-blur-md overflow-hidden">
      {/* Top Header Panel Control */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Planer Nawigacji Aura
          </span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Zwiń panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Route Summary Card */}
      <div className="p-4 border-b border-slate-800/80 bg-gradient-to-br from-cyan-950/20 to-slate-900/60">
        <div className="text-sm font-bold text-white mb-2 leading-tight">{currentRoute.title}</div>

        {/* Origin & Destination Badges */}
        <div className="space-y-2 mb-3 text-xs">
          <div className="flex items-start gap-2 text-slate-300">
            <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0 aura-glow-cyan" />
            <div className="truncate">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Start</span>
              <span className="truncate">{currentRoute.originName}</span>
            </div>
          </div>
          <div className="flex items-start gap-2 text-slate-300">
            <div className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0 aura-glow-violet" />
            <div className="truncate">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Cel</span>
              <span className="font-semibold text-white truncate">{currentRoute.destinationName}</span>
            </div>
          </div>
        </div>

        {/* Route Stats Pills */}
        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800/60">
          <div className="bg-slate-900/80 rounded-xl p-2 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Dystans</span>
            <span className="text-sm font-mono font-bold text-cyan-400">{currentRoute.distanceKm} km</span>
          </div>
          <div className="bg-slate-900/80 rounded-xl p-2 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Czas ETA</span>
            <span className="text-sm font-mono font-bold text-violet-400">{currentRoute.durationMin} min</span>
          </div>
          <div className="bg-slate-900/80 rounded-xl p-2 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Wzniesienie</span>
            <span className="text-sm font-mono font-bold text-emerald-400">+{currentRoute.elevationGainM}m</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950/80 p-1">
        <button
          onClick={() => setActiveTab('turnByTurn')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'turnByTurn'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Krok po Kroku</span>
        </button>
        <button
          onClick={() => setActiveTab('routes')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'routes'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Inne Trasy</span>
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'ai'
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Aura AI</span>
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeTab === 'turnByTurn' && (
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between mb-2">
              <span>Instrukcje Manewrów ({currentRoute.instructions.length})</span>
              <span className="text-cyan-400 font-bold">Krok {currentStepIndex + 1}</span>
            </div>

            {currentRoute.instructions.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              const isPassed = idx < currentStepIndex;

              return (
                <div
                  key={step.stepIndex}
                  className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    isActive
                      ? 'bg-cyan-950/60 border-cyan-500/60 aura-glass-subtle aura-glow-cyan'
                      : isPassed
                      ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isActive ? 'bg-cyan-500/20 border border-cyan-400' : 'bg-slate-800'
                    }`}
                  >
                    {getStepIcon(step.iconType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-bold text-white truncate">{step.streetName}</span>
                      <span className="font-mono text-[11px] text-cyan-400 shrink-0 ml-2">
                        {step.distanceMeters} m
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-snug">{step.instructionText}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'routes' && (
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
              Wybierz Gotową Trasę GPS
            </div>
            {PRESET_ROUTES.map((route) => (
              <button
                key={route.id}
                onClick={() => onSelectRoute(route)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1.5 ${
                  currentRoute.id === route.id
                    ? 'bg-cyan-950/60 border-cyan-400 aura-glow-cyan'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">{route.title}</span>
                  <span className="text-xs font-mono font-bold text-cyan-400 shrink-0">
                    {route.distanceKm} km
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{route.subtitle}</div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-violet-400" />
                    {route.durationMin} min
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    +{route.elevationGainM}m
                  </span>
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3 h-3 text-amber-400" />
                    Limit {route.speedLimitKmh} km/h
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-950/40 via-slate-900/80 to-cyan-950/30 border border-violet-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5 font-display">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Rekomendacje Gemini AI
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-violet-900/60 px-2 py-0.5 rounded-full border border-violet-500/30">
                  Aura Route Engine
                </span>
              </div>

              {isLoadingInsight ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="text-xs text-slate-400 font-mono">Analizowanie parametrów trasy...</div>
                </div>
              ) : insight ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Klimat Trasy (Vibe)</span>
                    <p className="font-semibold text-cyan-300">{insight.auraVibe}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Podsumowanie Drogi</span>
                    <p className="text-slate-300 leading-snug">{insight.summary}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Ocena Przejezdności</span>
                    <p className="text-emerald-400 font-medium">{insight.trafficAssessment}</p>
                  </div>

                  {insight.scenicPoints && insight.scenicPoints.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Atrakcje i Punkty POI</span>
                      <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                        {insight.scenicPoints.map((poi, idx) => (
                          <li key={idx} className="truncate">{poi}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-bold">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Wskazówka Bezpieczeństwa
                    </div>
                    <p className="text-[11px] text-slate-300">{insight.safetyTip}</p>
                  </div>

                  <div className="flex items-center gap-2 text-violet-300 text-[11px] pt-1">
                    <Music className="w-3.5 h-3.5 text-violet-400" />
                    <span>Muzyka: <strong className="text-white">{insight.recommendedMusicMood}</strong></span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 py-4 text-center">Brak danych rekomendacji</div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
