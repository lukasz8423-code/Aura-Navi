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
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  RotateCw,
  ShieldAlert,
  Music,
  Map,
  Fuel,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { PresetRoute, RouteInsight } from '../types/navigation';
import { PRESET_ROUTES } from '../data/presetRoutes';

interface LeftDockProps {
  currentRoute: PresetRoute;
  onSelectRoute: (route: PresetRoute) => void;
  insight: RouteInsight | null;
  isLoadingInsight: boolean;
  currentStepIndex: number;
  isOpenMobile: boolean;
  onToggleMobileOpen: () => void;
}

export const LeftDock: React.FC<LeftDockProps> = ({
  currentRoute,
  onSelectRoute,
  insight,
  isLoadingInsight,
  currentStepIndex,
  isOpenMobile,
  onToggleMobileOpen,
}) => {
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

  return (
    <>
      {/* MOBILE FLOATING TRIGGER BUTTON (When sheet is collapsed on phone screens) */}
      {!isOpenMobile && (
        <div className="lg:hidden absolute bottom-16 left-3 right-3 z-30 flex items-center justify-between p-2.5 bg-[#0F141E]/95 border border-cyan-500/30 rounded-2xl shadow-2xl backdrop-blur-md pointer-events-auto">
          <div className="flex items-center gap-2 truncate">
            <Navigation className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="truncate text-xs">
              <span className="font-bold text-white block truncate">{currentRoute.title}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentRoute.distanceKm} km · {currentRoute.durationMin} min
              </span>
            </div>
          </div>
          <button
            onClick={onToggleMobileOpen}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 text-black font-bold text-xs flex items-center gap-1 shrink-0"
          >
            <span>Szczegóły</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SIDEBAR DOCK (Desktop) / SLIDING BOTTOM SHEET (Mobile) */}
      <aside
        className={`
          z-30 transition-all duration-300 ease-in-out bg-[#0F141E]/95 border-cyan-500/20 backdrop-blur-md overflow-hidden flex flex-col
          /* Desktop layout: Left sidebar */
          lg:static lg:h-full lg:w-[360px] xl:w-[400px] lg:border-r lg:translate-y-0
          /* Mobile layout: Bottom Drawer Sheet */
          max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:rounded-t-3xl max-lg:border-t max-lg:max-h-[70vh] max-lg:shadow-2xl
          ${isOpenMobile ? 'max-lg:translate-y-0' : 'max-lg:translate-y-full'}
        `}
      >
        {/* Drag handle for mobile drawer */}
        <div className="lg:hidden pt-2 pb-1 bg-slate-950/80 cursor-pointer" onClick={onToggleMobileOpen}>
          <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto" />
          <div className="flex items-center justify-between px-4 pt-1">
            <span className="text-xs font-bold font-mono text-cyan-400">PLANER AURA NAVI</span>
            <button className="text-slate-400 text-xs p-1">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop Top Header Control */}
        <div className="hidden lg:flex p-3 border-b border-slate-800 items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Planer Nawigacji Aura
            </span>
          </div>
        </div>

        {/* Route Summary Card */}
        <div className="p-3 lg:p-4 border-b border-slate-800/80 bg-gradient-to-br from-cyan-950/20 to-slate-900/60">
          <div className="text-xs lg:text-sm font-bold text-white mb-2 leading-tight">{currentRoute.title}</div>

          <div className="space-y-1.5 mb-2.5 text-xs">
            <div className="flex items-start gap-2 text-slate-300">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0 aura-glow-cyan" />
              <div className="truncate">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Start</span>
                <span className="truncate">{currentRoute.originName}</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <div className="w-2 h-2 rounded-full bg-violet-500 mt-1 shrink-0 aura-glow-violet" />
              <div className="truncate">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Cel</span>
                <span className="font-semibold text-white truncate">{currentRoute.destinationName}</span>
              </div>
            </div>
          </div>

          {/* Stats pills */}
          <div className="grid grid-cols-3 gap-1.5 text-center pt-2 border-t border-slate-800/60">
            <div className="bg-slate-900/80 rounded-xl p-1.5 border border-slate-800">
              <span className="text-[9px] font-mono text-slate-400 uppercase block">Dystans</span>
              <span className="text-xs font-mono font-bold text-cyan-400">{currentRoute.distanceKm} km</span>
            </div>
            <div className="bg-slate-900/80 rounded-xl p-1.5 border border-slate-800">
              <span className="text-[9px] font-mono text-slate-400 uppercase block">Czas ETA</span>
              <span className="text-xs font-mono font-bold text-violet-400">{currentRoute.durationMin} min</span>
            </div>
            <div className="bg-slate-900/80 rounded-xl p-1.5 border border-slate-800">
              <span className="text-[9px] font-mono text-slate-400 uppercase block">Wzniesienie</span>
              <span className="text-xs font-mono font-bold text-emerald-400">+{currentRoute.elevationGainM}m</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/80 p-1">
          <button
            onClick={() => setActiveTab('turnByTurn')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
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
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
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
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
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
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {activeTab === 'turnByTurn' && (
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between mb-1">
                <span>Manewry ({currentRoute.instructions.length})</span>
                <span className="text-cyan-400 font-bold">Krok {currentStepIndex + 1}</span>
              </div>

              {currentRoute.instructions.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex;

                return (
                  <div
                    key={step.stepIndex}
                    className={`p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                      isActive
                        ? 'bg-cyan-950/60 border-cyan-500/60 aura-glass-subtle aura-glow-cyan'
                        : isPassed
                        ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isActive ? 'bg-cyan-500/20 border border-cyan-400' : 'bg-slate-800'
                      }`}
                    >
                      {getStepIcon(step.iconType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-0.5">
                        <span className="font-bold text-white truncate">{step.streetName}</span>
                        <span className="font-mono text-[10px] text-cyan-400 shrink-0 ml-1">
                          {step.distanceMeters} m
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">{step.instructionText}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Wybierz Gotową Trasę GPS
              </div>
              {PRESET_ROUTES.map((route) => (
                <button
                  key={route.id}
                  onClick={() => {
                    onSelectRoute(route);
                    if (isOpenMobile) onToggleMobileOpen();
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex flex-col gap-1 ${
                    currentRoute.id === route.id
                      ? 'bg-cyan-950/60 border-cyan-400 aura-glow-cyan'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{route.title}</span>
                    <span className="text-xs font-mono font-bold text-cyan-400 shrink-0 ml-1">
                      {route.distanceKm} km
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{route.subtitle}</div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-950/40 via-slate-900/80 to-cyan-950/30 border border-violet-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-violet-300 flex items-center gap-1 font-display">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Rekomendacje Gemini AI
                  </span>
                </div>

                {isLoadingInsight ? (
                  <div className="py-4 text-center space-y-1.5">
                    <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <div className="text-[10px] text-slate-400 font-mono">Analizowanie parametrów...</div>
                  </div>
                ) : insight ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">Aura Vibe</span>
                      <p className="font-semibold text-cyan-300 text-xs">{insight.auraVibe}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">Opis Trasy</span>
                      <p className="text-slate-300 leading-snug text-[11px]">{insight.summary}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
