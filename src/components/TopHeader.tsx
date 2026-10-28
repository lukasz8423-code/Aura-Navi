import React, { useState, useEffect } from 'react';
import { Navigation, Search, Car, Bike, Footprints, Zap, Radio, Sparkles, MapPin, LocateFixed, Loader2 } from 'lucide-react';
import { TransportMode, PresetRoute } from '../types/navigation';
import { PRESET_ROUTES } from '../data/presetRoutes';
import { searchPlacesNominatim, GeocodedPlace } from '../services/osrmRoutingService';

interface TopHeaderProps {
  currentRoute: PresetRoute;
  onSelectRoute: (route: PresetRoute) => void;
  transportMode: TransportMode;
  onSelectTransportMode: (mode: TransportMode) => void;
  onStartSimulation: () => void;
  isSimulating: boolean;
  onUseLiveGps: () => void;
  isLiveGps: boolean;
  onSearchCustomDestination: (place: GeocodedPlace) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentRoute,
  onSelectRoute,
  transportMode,
  onSelectTransportMode,
  onStartSimulation,
  isSimulating,
  onUseLiveGps,
  isLiveGps,
  onSearchCustomDestination,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [geocodedResults, setGeocodedResults] = useState<GeocodedPlace[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);

  // Debounced search for Nominatim OpenStreetMap real geocoding
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setGeocodedResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingApi(true);
      const results = await searchPlacesNominatim(searchQuery);
      setGeocodedResults(results);
      setIsSearchingApi(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredPresetRoutes = PRESET_ROUTES.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.destinationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="h-12 lg:h-14 w-full bg-[#0A0D14]/95 border-b border-cyan-500/20 backdrop-blur-md px-2 sm:px-4 flex items-center justify-between gap-2 z-40 shrink-0">
      {/* Brand Zone */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center aura-glow-cyan shadow-lg">
          <Navigation className="w-4 h-4 lg:w-5 lg:h-5 text-black font-bold transform -rotate-45" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-display font-extrabold text-base sm:text-xl tracking-wider text-white">
            AURA<span className="text-aura-cyan">-NAVI</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-medium bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
            <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
            LIVE GPS
          </span>
        </div>
      </div>

      {/* Central Search Bar & Geocoding Overlay */}
      <div className="relative flex-1 max-w-sm lg:max-w-md mx-1">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Szukaj adresu w Polsce..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full bg-[#121824] border border-slate-800 focus:border-cyan-500/60 rounded-xl pl-8 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
          />
          {isSearchingApi && (
            <Loader2 className="absolute right-2.5 w-3.5 h-3.5 text-cyan-400 animate-spin" />
          )}
        </div>

        {/* Live Search Autocomplete Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#121824] border border-cyan-500/40 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800 max-h-72 overflow-y-auto">
            <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 bg-slate-900/80 uppercase tracking-wider flex items-center justify-between">
              <span>Wyniki Wyszukiwania OpenStreetMap</span>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-0.5"
              >
                Zamknij
              </button>
            </div>

            {/* Real Geocoded Places from OpenStreetMap API */}
            {geocodedResults.length > 0 && (
              <div className="p-1 space-y-1">
                <div className="text-[9px] font-mono text-cyan-400 px-2 pt-1 uppercase">
                  Rzeczywiste Miejsca (Geokodowanie)
                </div>
                {geocodedResults.map((place) => (
                  <button
                    key={place.place_id}
                    onClick={() => {
                      onSearchCustomDestination(place);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-2.5 py-2 hover:bg-cyan-950/60 rounded-lg transition-colors flex items-start gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {place.display_name.split(',')[0]}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {place.display_name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Preset Default Routes */}
            <div className="p-1 space-y-1">
              <div className="text-[9px] font-mono text-slate-500 px-2 pt-1 uppercase">
                Gotowe Trasy
              </div>
              {filteredPresetRoutes.map((route) => (
                <button
                  key={route.id}
                  onClick={() => {
                    onSelectRoute(route);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-2.5 py-2 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-between gap-2"
                >
                  <div className="truncate">
                    <div className="text-xs font-semibold text-white truncate">{route.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">{route.destinationName}</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400 shrink-0">
                    {route.distanceKm} km
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons & Mode Toggles */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Live GPS Button */}
        <button
          onClick={onUseLiveGps}
          className={`min-h-[36px] px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            isLiveGps
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
              : 'bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-300'
          }`}
          title="Użyj Żywej Lokalizacji GPS ze Smartfona"
        >
          <LocateFixed className={`w-3.5 h-3.5 ${isLiveGps ? 'animate-spin text-black' : 'text-emerald-400'}`} />
          <span className="hidden sm:inline">Mój GPS</span>
        </button>

        {/* Transport Mode Toggles */}
        <div className="hidden sm:flex items-center gap-0.5 p-0.5 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => onSelectTransportMode('car')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              transportMode === 'car' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
            title="Samochód"
          >
            <Car className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSelectTransportMode('bike')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              transportMode === 'bike' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
            title="Rower"
          >
            <Bike className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSelectTransportMode('walk')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              transportMode === 'walk' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
            title="Pieszo"
          >
            <Footprints className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Start Drive Simulation Button */}
        <button
          onClick={onStartSimulation}
          className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            isSimulating
              ? 'bg-violet-600 text-white aura-glow-violet'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black aura-glow-cyan'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{isSimulating ? 'Pauza' : 'Jedź'}</span>
        </button>
      </div>
    </header>
  );
};
