import React, { useState, useEffect } from 'react';
import { Navigation, Search, Car, Bike, Footprints, Radio, Sparkles, MapPin, LocateFixed, Loader2, X } from 'lucide-react';
import { TransportMode, PresetRoute } from '../types/navigation';
import { PRESET_ROUTES } from '../data/presetRoutes';
import { searchPlacesNominatim, GeocodedPlace } from '../services/osmServices';

interface TopHeaderProps {
  currentRoute: PresetRoute | null;
  onSelectRoute: (route: PresetRoute) => void;
  transportMode: TransportMode;
  onSelectTransportMode: (mode: TransportMode) => void;
  onStartSimulation: () => void;
  isSimulating: boolean;
  onUseLiveGps: () => void;
  isLiveGps: boolean;
  onSearchCustomDestination: (place: GeocodedPlace) => void;
  onOpenMobilePlanner: () => void;
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
  onOpenMobilePlanner,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [geocodedResults, setGeocodedResults] = useState<GeocodedPlace[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);

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

  return (
    <header className="h-14 w-full bg-[#0A0D14] border-b border-cyan-500/30 px-2 sm:px-4 flex items-center justify-between gap-2 z-50 shrink-0 relative">
      {/* Brand Zone */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center aura-glow-cyan shadow-lg">
          <Navigation className="w-5 h-5 text-black font-bold transform -rotate-45" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
          <span className="font-display font-extrabold text-base sm:text-xl tracking-wider text-white leading-none">
            AURA<span className="text-aura-cyan">-NAVI</span>
          </span>
          <span className="text-[9px] font-mono text-cyan-400 flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
            FREE GPS
          </span>
        </div>
      </div>

      {/* Central Search Input with Nominatim Geocoding */}
      <div className="relative flex-1 max-w-sm sm:max-w-md mx-1">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-cyan-400" />
          <input
            type="text"
            placeholder="Wpisz dokąd chcesz jechać..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full bg-[#121824] border border-cyan-500/40 focus:border-cyan-400 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 shadow-inner transition-all"
          />
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setGeocodedResults([]);
              }}
              className="absolute right-2.5 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : isSearchingApi ? (
            <Loader2 className="absolute right-2.5 w-3.5 h-3.5 text-cyan-400 animate-spin" />
          ) : null}
        </div>

        {/* Live Search Autocomplete Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#121824] border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800 max-h-80 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-mono text-slate-400 bg-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Wpisz Miejscowość lub Wybierz z Listy</span>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-cyan-400 font-bold text-xs px-2 py-0.5 rounded bg-cyan-950/60"
              >
                Zamknij
              </button>
            </div>

            {/* Nominatim Search Results */}
            {geocodedResults.length > 0 && (
              <div className="p-1 space-y-1">
                <div className="text-[9px] font-mono text-cyan-400 px-2 pt-1 uppercase font-bold">
                  Rzeczywiste Miejsca w OpenStreetMap
                </div>
                {geocodedResults.map((place) => (
                  <button
                    key={place.place_id}
                    onClick={() => {
                      onSearchCustomDestination(place);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-cyan-950/60 rounded-xl transition-colors flex items-start gap-2.5"
                  >
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">
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

            {/* Popular Places List */}
            <div className="p-1 space-y-1">
              <div className="text-[9px] font-mono text-slate-400 px-2 pt-1 uppercase">
                Przykładowe Trasy w Polsce
              </div>
              {PRESET_ROUTES.map((route) => (
                <button
                  key={route.id}
                  onClick={() => {
                    onSelectRoute(route);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-between gap-2"
                >
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate">{route.title}</div>
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

      {/* Action Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Live GPS Button */}
        <button
          onClick={onUseLiveGps}
          className={`h-9 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            isLiveGps
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
              : 'bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-200'
          }`}
          title="Użyj Żywej Lokalizacji GPS ze Smartfona"
        >
          <LocateFixed className={`w-4 h-4 ${isLiveGps ? 'animate-spin text-black' : 'text-emerald-400'}`} />
          <span className="hidden sm:inline">{isLiveGps ? 'GPS Aktywny' : 'Mój GPS'}</span>
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

        {/* Mobile Details Drawer Button */}
        <button
          onClick={onOpenMobilePlanner}
          className="lg:hidden h-9 px-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1"
        >
          <span>Trasa</span>
        </button>
      </div>
    </header>
  );
};
