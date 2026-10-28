import React, { useState } from 'react';
import { Navigation, Search, Car, Bike, Footprints, Zap, Radio, Sparkles } from 'lucide-react';
import { TransportMode, PresetRoute } from '../types/navigation';
import { PRESET_ROUTES } from '../data/presetRoutes';

interface TopHeaderProps {
  currentRoute: PresetRoute;
  onSelectRoute: (route: PresetRoute) => void;
  transportMode: TransportMode;
  onSelectTransportMode: (mode: TransportMode) => void;
  onStartSimulation: () => void;
  isSimulating: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentRoute,
  onSelectRoute,
  transportMode,
  onSelectTransportMode,
  onStartSimulation,
  isSimulating,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredRoutes = PRESET_ROUTES.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.destinationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.originName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="h-14 w-full bg-[#0A0D14]/90 border-b border-cyan-500/20 backdrop-blur-md px-4 flex items-center justify-between gap-4 z-40 shrink-0">
      {/* Brand Zone: 1-line title with Aura glow badge */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center aura-glow-cyan shadow-lg">
          <Navigation className="w-5 h-5 text-black font-bold transform -rotate-45" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display font-extrabold text-xl tracking-wider text-white">
            AURA<span className="text-aura-cyan">-NAVI</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            GPS 3D 12 SAT
          </span>
        </div>
      </div>

      {/* Central Search Bar & Route Selector */}
      <div className="relative flex-1 max-w-md mx-2">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Szukaj celu np. Lotnisko Chopina, Kazimierz, Molo..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full bg-[#121824]/90 border border-slate-800 focus:border-cyan-500/60 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition-all"
          />
        </div>

        {/* Search Autocomplete Overlay Dropdown */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#121824] border border-cyan-500/30 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
            <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 bg-slate-900/60 uppercase tracking-wider flex items-center justify-between">
              <span>Proponowane Trasy Nawigacyjne</span>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                Zamknij
              </button>
            </div>
            {filteredRoutes.length > 0 ? (
              filteredRoutes.map((route) => (
                <button
                  key={route.id}
                  onClick={() => {
                    onSelectRoute(route);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left px-3 py-2.5 hover:bg-cyan-950/40 transition-colors flex items-center justify-between gap-2 ${
                    currentRoute.id === route.id ? 'bg-cyan-950/60 border-l-2 border-cyan-400' : ''
                  }`}
                >
                  <div className="truncate">
                    <div className="text-xs font-semibold text-white truncate">{route.title}</div>
                    <div className="text-[11px] text-slate-400 truncate">{route.destinationName}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-cyan-400">{route.distanceKm} km</span>
                    <div className="text-[10px] text-slate-400">{route.durationMin} min</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-3 text-xs text-slate-400 text-center">Brak pasujących tras</div>
            )}
          </div>
        )}
      </div>

      {/* Transport Mode & Action Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Transport Mode Toggles */}
        <div className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          <button
            onClick={() => onSelectTransportMode('car')}
            title="Samochód"
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              transportMode === 'car'
                ? 'bg-cyan-500 text-black font-semibold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Auto</span>
          </button>

          <button
            onClick={() => onSelectTransportMode('bike')}
            title="Rower"
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              transportMode === 'bike'
                ? 'bg-cyan-500 text-black font-semibold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Rower</span>
          </button>

          <button
            onClick={() => onSelectTransportMode('walk')}
            title="Pieszo"
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              transportMode === 'walk'
                ? 'bg-cyan-500 text-black font-semibold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Pieszo</span>
          </button>

          <button
            onClick={() => onSelectTransportMode('ev')}
            title="Pojazd Elektryczny EV"
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              transportMode === 'ev'
                ? 'bg-violet-600 text-white font-semibold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">EV</span>
          </button>
        </div>

        {/* Start / Play Simulation Button */}
        <button
          onClick={onStartSimulation}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg whitespace-nowrap ${
            isSimulating
              ? 'bg-violet-600 hover:bg-violet-500 text-white aura-glow-violet'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black aura-glow-cyan'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isSimulating ? 'Nawigacja W Toku' : 'Rozpocznij Symulację'}</span>
        </button>
      </div>
    </header>
  );
};
