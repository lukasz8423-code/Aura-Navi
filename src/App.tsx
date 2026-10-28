import React, { useState, useEffect, useRef } from 'react';
import { PRESET_ROUTES } from './data/presetRoutes';
import {
  PresetRoute,
  TransportMode,
  MapLayerStyle,
  SimulationState,
  RouteInsight,
  LatLng,
} from './types/navigation';
import { fetchGeminiRouteInsight } from './services/geminiService';
import {
  fetchOSRMRoute,
  searchPlacesNominatim,
  fetchOverpassSpeedLimit,
  GeocodedPlace,
} from './services/osmServices';
import { TopHeader } from './components/TopHeader';
import { LeftDock } from './components/LeftDock';
import { MapView } from './components/MapView';
import { BottomDock } from './components/BottomDock';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PresetRoute>(PRESET_ROUTES[0]);
  const [transportMode, setTransportMode] = useState<TransportMode>('car');
  const [mapLayer, setMapLayer] = useState<MapLayerStyle>('dark');
  const [is3dView, setIs3dView] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [liveSpeedLimit, setLiveSpeedLimit] = useState<number | null>(null);

  // Gemini AI Route Insights State
  const [insight, setInsight] = useState<RouteInsight | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  // Simulation & Live GPS State
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isPlaying: false,
    isLiveGps: false,
    speedMultiplier: 2,
    currentStepIndex: 0,
    progressPercent: 0,
    currentSpeedKmh: 0,
    headingDegrees: 45,
    distanceRemainingMeters: PRESET_ROUTES[0].distanceKm * 1000,
    timeRemainingSeconds: PRESET_ROUTES[0].durationMin * 60,
    currentCoords: PRESET_ROUTES[0].path[0],
  });

  const animFrameRef = useRef<number | null>(null);
  const watchGpsIdRef = useRef<number | null>(null);

  // Auto-Detect Real User GPS Location on App Startup
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const liveUserCoords: LatLng = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

          // Fetch real OSRM route from user's current GPS position to destination
          const osrmResult = await fetchOSRMRoute(
            liveUserCoords,
            currentRoute.destinationCoords,
            transportMode
          );

          if (osrmResult) {
            const gpsRoute: PresetRoute = {
              ...currentRoute,
              originName: 'Twoja Lokalizacja GPS',
              originCoords: liveUserCoords,
              distanceKm: osrmResult.distanceKm,
              durationMin: osrmResult.durationMin,
              path: osrmResult.path,
              instructions: osrmResult.instructions,
            };

            setCurrentRoute(gpsRoute);
            setSimulationState((prev) => ({
              ...prev,
              currentCoords: liveUserCoords,
              isLiveGps: true,
              distanceRemainingMeters: osrmResult.distanceKm * 1000,
              timeRemainingSeconds: osrmResult.durationMin * 60,
            }));
          }
        },
        (err) => {
          console.warn('Auto GPS location prompt skipped:', err);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  // Fetch Overpass API Speed Limit when current coords change in Live GPS mode
  useEffect(() => {
    if (!simulationState.isLiveGps) return;

    const timer = setTimeout(async () => {
      const speedLimit = await fetchOverpassSpeedLimit(simulationState.currentCoords);
      if (speedLimit) setLiveSpeedLimit(speedLimit);
    }, 1500);

    return () => clearTimeout(timer);
  }, [simulationState.currentCoords, simulationState.isLiveGps]);

  // Fetch AI Route Insight whenever route changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingInsight(true);

    fetchGeminiRouteInsight(currentRoute).then((res) => {
      if (isMounted) {
        setInsight(res);
        setIsLoadingInsight(false);
      }
    });

    resetSimulation(currentRoute);

    return () => {
      isMounted = false;
    };
  }, [currentRoute]);

  // Fetch Real OSRM Route when transport mode changes
  useEffect(() => {
    let isMounted = true;

    fetchOSRMRoute(currentRoute.originCoords, currentRoute.destinationCoords, transportMode).then((osrmResult) => {
      if (isMounted && osrmResult) {
        const updatedRoute: PresetRoute = {
          ...currentRoute,
          distanceKm: osrmResult.distanceKm,
          durationMin: osrmResult.durationMin,
          path: osrmResult.path,
          instructions: osrmResult.instructions,
          transportMode,
        };
        setCurrentRoute(updatedRoute);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [transportMode]);

  // Handle Real Custom Destination Search from Nominatim Geocoding
  const handleSearchCustomDestination = async (place: GeocodedPlace) => {
    const destCoords: LatLng = {
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    };

    const destName = place.display_name.split(',')[0] || place.display_name;

    const osrmResult = await fetchOSRMRoute(simulationState.currentCoords, destCoords, transportMode);

    if (osrmResult) {
      const newCustomRoute: PresetRoute = {
        id: `custom-${Date.now()}`,
        title: `Trasa: ${destName}`,
        subtitle: place.display_name,
        originName: 'Aktualna Pozycja GPS',
        destinationName: place.display_name,
        originCoords: simulationState.currentCoords,
        destinationCoords: destCoords,
        distanceKm: osrmResult.distanceKm,
        durationMin: osrmResult.durationMin,
        speedLimitKmh: 70,
        elevationGainM: 15,
        transportMode,
        path: osrmResult.path,
        instructions: osrmResult.instructions,
        poiHighlights: [{ name: destName, category: 'Cel', coords: destCoords }],
        isCustomOSRM: true,
      };

      setCurrentRoute(newCustomRoute);
    }
  };

  // Live GPS Tracking Toggle
  const handleToggleLiveGps = () => {
    if (simulationState.isLiveGps) {
      if (watchGpsIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchGpsIdRef.current);
        watchGpsIdRef.current = null;
      }
      setSimulationState((prev) => ({ ...prev, isLiveGps: false }));
    } else {
      if (!('geolocation' in navigator)) {
        alert('Geolokalizacja GPS nie jest wspierana na Twoim urządzeniu');
        return;
      }

      setSimulationState((prev) => ({ ...prev, isLiveGps: true, isPlaying: false }));

      watchGpsIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const liveCoords: LatLng = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

          const liveSpeed = pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 0;
          const liveHeading = pos.coords.heading || 0;

          setSimulationState((prev) => ({
            ...prev,
            currentCoords: liveCoords,
            currentSpeedKmh: liveSpeed,
            headingDegrees: Math.round(liveHeading),
          }));
        },
        (err) => {
          console.warn('GPS error:', err);
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
      );
    }
  };

  // Reset Simulation
  const resetSimulation = (route: PresetRoute) => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    setSimulationState((prev) => ({
      ...prev,
      isPlaying: false,
      speedMultiplier: 2,
      currentStepIndex: 0,
      progressPercent: 0,
      currentSpeedKmh: 0,
      headingDegrees: calculateHeading(route.path[0], route.path[1] || route.path[0]),
      distanceRemainingMeters: route.distanceKm * 1000,
      timeRemainingSeconds: route.durationMin * 60,
      currentCoords: route.path[0],
    }));
  };

  function calculateHeading(from: LatLng, to: LatLng): number {
    const dLng = to.lng - from.lng;
    const dLat = to.lat - from.lat;
    let angle = (Math.atan2(dLng, dLat) * 180) / Math.PI;
    if (angle < 0) angle += 360;
    return Math.round(angle);
  }

  // Drive Simulation Animation Loop
  useEffect(() => {
    if (!simulationState.isPlaying || simulationState.isLiveGps) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTimestamp = performance.now();

    const tick = (now: number) => {
      const deltaSec = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      setSimulationState((prev) => {
        if (!prev.isPlaying) return prev;

        const path = currentRoute.path;
        const totalPoints = path.length;

        const speedFactor = prev.speedMultiplier * 2.5;
        const newProgress = prev.progressPercent + deltaSec * speedFactor;

        if (newProgress >= 100) {
          return {
            ...prev,
            isPlaying: false,
            progressPercent: 100,
            currentSpeedKmh: 0,
            distanceRemainingMeters: 0,
            timeRemainingSeconds: 0,
            currentCoords: path[totalPoints - 1],
            currentStepIndex: currentRoute.instructions.length - 1,
          };
        }

        const exactIndex = (newProgress / 100) * (totalPoints - 1);
        const idx1 = Math.floor(exactIndex);
        const idx2 = Math.min(idx1 + 1, totalPoints - 1);
        const segmentFraction = exactIndex - idx1;

        const p1 = path[idx1];
        const p2 = path[idx2];

        const currentCoords: LatLng = {
          lat: p1.lat + (p2.lat - p1.lat) * segmentFraction,
          lng: p1.lng + (p2.lng - p1.lng) * segmentFraction,
        };

        const headingDegrees = calculateHeading(p1, p2);

        const baseSpeed =
          transportMode === 'car' || transportMode === 'ev'
            ? currentRoute.speedLimitKmh * 0.85
            : transportMode === 'bike'
            ? 22
            : 5;
        const currentSpeedKmh = Math.min(
          currentRoute.speedLimitKmh + 5,
          baseSpeed + (Math.sin(newProgress) * 6 + prev.speedMultiplier * 4)
        );

        const remainingKm = currentRoute.distanceKm * (1 - newProgress / 100);
        const distanceRemainingMeters = Math.max(0, remainingKm * 1000);
        const timeRemainingSeconds = Math.max(
          0,
          currentRoute.durationMin * 60 * (1 - newProgress / 100)
        );

        const totalSteps = currentRoute.instructions.length;
        const currentStepIndex = Math.min(
          totalSteps - 1,
          Math.floor((newProgress / 100) * totalSteps)
        );

        return {
          ...prev,
          progressPercent: newProgress,
          currentCoords,
          headingDegrees,
          currentSpeedKmh,
          distanceRemainingMeters,
          timeRemainingSeconds,
          currentStepIndex,
        };
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [simulationState.isPlaying, simulationState.isLiveGps, simulationState.speedMultiplier, currentRoute, transportMode]);

  const currentTurnInstruction =
    currentRoute.instructions[simulationState.currentStepIndex] || currentRoute.instructions[0];
  const nextTurnInstruction =
    currentRoute.instructions[simulationState.currentStepIndex + 1] || null;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#0A0D14] text-slate-100 select-none relative">
      {/* ZONE 1: TOP HEADER */}
      <TopHeader
        currentRoute={currentRoute}
        onSelectRoute={(r) => {
          setCurrentRoute(r);
          resetSimulation(r);
        }}
        transportMode={transportMode}
        onSelectTransportMode={(mode) => setTransportMode(mode)}
        onStartSimulation={() => {
          setSimulationState((prev) => ({ ...prev, isPlaying: !prev.isPlaying, isLiveGps: false }));
        }}
        isSimulating={simulationState.isPlaying}
        onUseLiveGps={handleToggleLiveGps}
        isLiveGps={simulationState.isLiveGps}
        onSearchCustomDestination={handleSearchCustomDestination}
      />

      {/* ZONE 2: MAIN WORKSPACE CANVAS */}
      <main className="flex-1 w-full h-full flex overflow-hidden relative">
        {/* ZONE 2A: LEFT DOCK PANEL */}
        <LeftDock
          currentRoute={currentRoute}
          onSelectRoute={(r) => {
            setCurrentRoute(r);
            resetSimulation(r);
          }}
          insight={insight}
          isLoadingInsight={isLoadingInsight}
          currentStepIndex={simulationState.currentStepIndex}
          isOpenMobile={isOpenMobile}
          onToggleMobileOpen={() => setIsOpenMobile(!isOpenMobile)}
        />

        {/* ZONE 2B: CENTRAL MAP CANVAS WITH ANCHORED HUD OVERLAYS */}
        <div className="flex-1 h-full relative overflow-hidden">
          <MapView
            currentRoute={currentRoute}
            simulationState={simulationState}
            mapLayer={mapLayer}
            onChangeMapLayer={(layer) => setMapLayer(layer)}
            is3dView={is3dView}
            onToggle3dView={() => setIs3dView(!is3dView)}
            currentTurnInstruction={currentTurnInstruction}
            nextTurnInstruction={nextTurnInstruction}
            liveSpeedLimit={liveSpeedLimit}
          />
        </div>
      </main>

      {/* ZONE 3: BOTTOM CONTROLS DOCK */}
      <BottomDock
        isPlaying={simulationState.isPlaying}
        onTogglePlay={() => {
          setSimulationState((prev) => ({ ...prev, isPlaying: !prev.isPlaying, isLiveGps: false }));
        }}
        onReset={() => resetSimulation(currentRoute)}
        speedMultiplier={simulationState.speedMultiplier}
        onChangeSpeedMultiplier={(mult) => {
          setSimulationState((prev) => ({ ...prev, speedMultiplier: mult }));
        }}
        progressPercent={simulationState.progressPercent}
        distanceRemainingKm={simulationState.distanceRemainingMeters / 1000}
        timeRemainingMin={Math.ceil(simulationState.timeRemainingSeconds / 60)}
        destinationName={currentRoute.destinationName}
        isLiveGps={simulationState.isLiveGps}
        onToggleLiveGps={handleToggleLiveGps}
      />
    </div>
  );
}
