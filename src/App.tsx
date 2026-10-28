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
import { TopHeader } from './components/TopHeader';
import { LeftDock } from './components/LeftDock';
import { MapView } from './components/MapView';
import { BottomDock } from './components/BottomDock';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PresetRoute>(PRESET_ROUTES[0]);
  const [transportMode, setTransportMode] = useState<TransportMode>('car');
  const [mapLayer, setMapLayer] = useState<MapLayerStyle>('dark');
  const [is3dView, setIs3dView] = useState(false);

  // Gemini AI Route Insights State
  const [insight, setInsight] = useState<RouteInsight | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  // Simulation State
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isPlaying: false,
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

    // Reset Simulation on Route Change
    resetSimulation(currentRoute);

    return () => {
      isMounted = false;
    };
  }, [currentRoute]);

  // Reset Simulation Helper
  const resetSimulation = (route: PresetRoute) => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    setSimulationState({
      isPlaying: false,
      speedMultiplier: 2,
      currentStepIndex: 0,
      progressPercent: 0,
      currentSpeedKmh: 0,
      headingDegrees: calculateHeading(route.path[0], route.path[1] || route.path[0]),
      distanceRemainingMeters: route.distanceKm * 1000,
      timeRemainingSeconds: route.durationMin * 60,
      currentCoords: route.path[0],
    });
  };

  // Calculate Heading Angle in degrees (0-360) between two coordinates
  function calculateHeading(from: LatLng, to: LatLng): number {
    const dLng = to.lng - from.lng;
    const dLat = to.lat - from.lat;
    let angle = (Math.atan2(dLng, dLat) * 180) / Math.PI;
    if (angle < 0) angle += 360;
    return Math.round(angle);
  }

  // Drive Simulation Loop Animation Engine
  useEffect(() => {
    if (!simulationState.isPlaying) {
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

        // Advance progress percent
        const speedFactor = prev.speedMultiplier * 2.5;
        const newProgress = prev.progressPercent + deltaSec * speedFactor;

        if (newProgress >= 100) {
          // Finished route
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

        // Map progress (0-100) to path segment index
        const exactIndex = (newProgress / 100) * (totalPoints - 1);
        const idx1 = Math.floor(exactIndex);
        const idx2 = Math.min(idx1 + 1, totalPoints - 1);
        const segmentFraction = exactIndex - idx1;

        const p1 = path[idx1];
        const p2 = path[idx2];

        // Interpolate LatLng
        const currentCoords: LatLng = {
          lat: p1.lat + (p2.lat - p1.lat) * segmentFraction,
          lng: p1.lng + (p2.lng - p1.lng) * segmentFraction,
        };

        // Heading
        const headingDegrees = calculateHeading(p1, p2);

        // Speed calculation based on transport mode
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

        // Distance & Time remaining
        const remainingKm = currentRoute.distanceKm * (1 - newProgress / 100);
        const distanceRemainingMeters = Math.max(0, remainingKm * 1000);
        const timeRemainingSeconds = Math.max(
          0,
          currentRoute.durationMin * 60 * (1 - newProgress / 100)
        );

        // Step instruction index
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
  }, [simulationState.isPlaying, simulationState.speedMultiplier, currentRoute, transportMode]);

  // Current & Next Turn Instruction Helpers
  const currentTurnInstruction =
    currentRoute.instructions[simulationState.currentStepIndex] || currentRoute.instructions[0];
  const nextTurnInstruction =
    currentRoute.instructions[simulationState.currentStepIndex + 1] || null;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#0A0D14] text-slate-100 select-none">
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
          setSimulationState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
        }}
        isSimulating={simulationState.isPlaying}
      />

      {/* ZONE 2: MAIN WORKSPACE CANVAS (Left Dock + Interactive Map Engine) */}
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
          />
        </div>
      </main>

      {/* ZONE 3: BOTTOM SIMULATION HUD DOCK */}
      <BottomDock
        isPlaying={simulationState.isPlaying}
        onTogglePlay={() => {
          setSimulationState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
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
      />
    </div>
  );
}
