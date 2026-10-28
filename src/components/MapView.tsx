import React, { useEffect, useRef } from 'react';
import * as LeafletModule from 'leaflet';
import { PresetRoute, MapLayerStyle, SimulationState, TurnInstruction } from '../types/navigation';
import { NextTurnHUD } from './NextTurnHUD';
import { SpeedometerHUD } from './SpeedometerHUD';
import { MapControlsHUD } from './MapControlsHUD';

const L: typeof import('leaflet') = (LeafletModule as any).default || LeafletModule;

interface MapViewProps {
  currentRoute: PresetRoute;
  simulationState: SimulationState;
  mapLayer: MapLayerStyle;
  onChangeMapLayer: (layer: MapLayerStyle) => void;
  is3dView: boolean;
  onToggle3dView: () => void;
  currentTurnInstruction: TurnInstruction | null;
  nextTurnInstruction: TurnInstruction | null;
  liveSpeedLimit: number | null;
  onOpenMobilePlanner?: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  currentRoute,
  simulationState,
  mapLayer,
  onChangeMapLayer,
  is3dView,
  onToggle3dView,
  currentTurnInstruction,
  nextTurnInstruction,
  liveSpeedLimit,
  onOpenMobilePlanner,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const polylineGlowRef = useRef<L.Polyline | null>(null);
  const polylineCoreRef = useRef<L.Polyline | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      if (!mapInstanceRef.current) {
        const container = mapContainerRef.current as any;
        if (container._leaflet_id) {
          container._leaflet_id = null;
        }

        const initialMap = L.map(mapContainerRef.current, {
          center: [currentRoute.originCoords.lat, currentRoute.originCoords.lng],
          zoom: 14,
          zoomControl: false,
          attributionControl: true,
        });

        mapInstanceRef.current = initialMap;
      }

      const map = mapInstanceRef.current;

      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }

      // 100% Free OpenStreetMap keyless tiles with Dark HUD CSS filter
      let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      let className = '';

      if (mapLayer === 'dark') {
        tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        className = 'osm-hud-tiles';
      } else if (mapLayer === 'street') {
        tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        className = '';
      } else if (mapLayer === 'satellite') {
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attribution = 'Tiles &copy; Esri';
        className = '';
      }

      const newTileLayer = L.tileLayer(tileUrl, {
        attribution,
        maxZoom: 19,
        subdomains: 'abc',
        className,
      });

      newTileLayer.addTo(map);
      tileLayerRef.current = newTileLayer;

      // Invalidate size multiple times to guarantee immediate rendering on mobile
      map.invalidateSize();
      const timer1 = setTimeout(() => mapInstanceRef.current?.invalidateSize(), 100);
      const timer2 = setTimeout(() => mapInstanceRef.current?.invalidateSize(), 500);

      const handleResize = () => {
        mapInstanceRef.current?.invalidateSize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        window.removeEventListener('resize', handleResize);
      };
    } catch (err: any) {
      console.error('Map init error:', err);
    }
  }, [mapLayer]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Route Polylines & Waypoint Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    try {
      if (polylineGlowRef.current) map.removeLayer(polylineGlowRef.current);
      if (polylineCoreRef.current) map.removeLayer(polylineCoreRef.current);
      if (startMarkerRef.current) map.removeLayer(startMarkerRef.current);
      if (endMarkerRef.current) map.removeLayer(endMarkerRef.current);

      const latLngs: [number, number][] = currentRoute.path.map((p) => [p.lat, p.lng]);

      const polylineGlow = L.polyline(latLngs, {
        color: '#9D4EDD',
        weight: 12,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      const polylineCore = L.polyline(latLngs, {
        color: '#00F2FE',
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      polylineGlowRef.current = polylineGlow;
      polylineCoreRef.current = polylineCore;

      const startIcon = L.divIcon({
        className: 'custom-start-marker',
        html: `<div class="w-6 h-6 rounded-full bg-cyan-400 border-2 border-white flex items-center justify-center shadow-lg aura-glow-cyan">
                 <div class="w-2 h-2 rounded-full bg-black"></div>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const endIcon = L.divIcon({
        className: 'custom-end-marker',
        html: `<div class="w-7 h-7 rounded-full bg-violet-600 border-2 border-cyan-400 flex items-center justify-center shadow-xl aura-glow-violet">
                 <div class="w-2.5 h-2.5 rounded-full bg-white"></div>
               </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const startMarker = L.marker([currentRoute.originCoords.lat, currentRoute.originCoords.lng], {
        icon: startIcon,
      }).addTo(map);

      const endMarker = L.marker([currentRoute.destinationCoords.lat, currentRoute.destinationCoords.lng], {
        icon: endIcon,
      }).addTo(map);

      startMarkerRef.current = startMarker;
      endMarkerRef.current = endMarker;

      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [40, 40] });
    } catch (err) {
      console.warn('Polyline render warning:', err);
    }
  }, [currentRoute]);

  // Update Vehicle Marker Position & Follow Camera
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    try {
      const { currentCoords, headingDegrees, isPlaying, isLiveGps } = simulationState;

      if (!vehicleMarkerRef.current) {
        const vehicleIcon = L.divIcon({
          className: 'vehicle-marker-hud',
          html: `<div id="vehicle-icon-element" class="relative w-10 h-10 flex items-center justify-center">
                   <div class="absolute inset-0 rounded-full bg-cyan-400/30 vehicle-marker-pulse"></div>
                   <div class="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-white shadow-2xl flex items-center justify-center transform transition-transform duration-200">
                     <svg class="w-5 h-5 text-black fill-current transform -rotate-45" viewBox="0 0 24 24">
                       <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                     </svg>
                   </div>
                 </div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const marker = L.marker([currentCoords.lat, currentCoords.lng], {
          icon: vehicleIcon,
          zIndexOffset: 1000,
        }).addTo(map);

        vehicleMarkerRef.current = marker;
      } else {
        vehicleMarkerRef.current.setLatLng([currentCoords.lat, currentCoords.lng]);

        const el = document.getElementById('vehicle-icon-element');
        if (el) {
          el.style.transform = `rotate(${headingDegrees}deg)`;
        }
      }

      if (isPlaying || isLiveGps) {
        map.panTo([currentCoords.lat, currentCoords.lng], { animate: true, duration: 0.3 });
      }
    } catch (err) {
      console.warn('Vehicle marker update warning:', err);
    }
  }, [simulationState]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleCenterVehicle = () => {
    if (mapInstanceRef.current && simulationState.currentCoords) {
      mapInstanceRef.current.setView(
        [simulationState.currentCoords.lat, simulationState.currentCoords.lng],
        16,
        { animate: true }
      );
    }
  };

  return (
    <div className="relative w-full h-full min-h-[300px] overflow-hidden bg-[#0A0D14]">
      {/* Leaflet Map DOM Container */}
      <div
        ref={mapContainerRef}
        className={`w-full h-full min-h-[300px] transition-transform duration-500 ease-out ${
          is3dView ? 'scale-105 perspective-3d' : ''
        }`}
        style={
          is3dView
            ? {
                transform: 'rotateX(25deg) scale(1.04)',
                transformOrigin: 'center bottom',
              }
            : undefined
        }
      />

      {/* ANCHORED NON-OVERLAPPING HUD OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none p-2 sm:p-4 flex flex-col justify-between z-20">
        {/* TOP ROW: Left = Next Turn HUD, Right = Map Controls */}
        <div className="flex items-start justify-between gap-2 w-full">
          <div className="pointer-events-auto">
            <NextTurnHUD
              currentInstruction={currentTurnInstruction}
              nextInstruction={nextTurnInstruction}
              distanceToStepMeters={simulationState.distanceRemainingMeters}
            />
          </div>

          <MapControlsHUD
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onCenterVehicle={handleCenterVehicle}
            mapLayer={mapLayer}
            onChangeMapLayer={onChangeMapLayer}
            is3dView={is3dView}
            onToggle3dView={onToggle3dView}
          />
        </div>

        {/* BOTTOM ROW: Left = Mobile Maneuvers Button, Right = Speedometer HUD */}
        <div className="flex items-end justify-between w-full">
          {onOpenMobilePlanner && (
            <div className="pointer-events-auto lg:hidden">
              <button
                onClick={onOpenMobilePlanner}
                className="px-3 py-2 rounded-2xl aura-glass text-cyan-300 font-bold text-xs flex items-center gap-1.5 shadow-xl border border-cyan-500/40 aura-glow-cyan"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Lista Manewrów</span>
              </button>
            </div>
          )}

          <div className="pointer-events-auto ml-auto">
            <SpeedometerHUD
              currentSpeedKmh={simulationState.currentSpeedKmh}
              speedLimitKmh={liveSpeedLimit || currentRoute.speedLimitKmh}
              headingDegrees={simulationState.headingDegrees}
              elevationMeters={currentRoute.elevationGainM}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
