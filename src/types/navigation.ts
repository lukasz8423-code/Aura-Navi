export type TransportMode = 'car' | 'bike' | 'walk' | 'ev';

export type MapLayerStyle = 'dark' | 'satellite' | 'street' | 'traffic';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface TurnInstruction {
  stepIndex: number;
  instructionText: string;
  streetName: string;
  iconType: 'straight' | 'turn-left' | 'turn-right' | 'slight-left' | 'slight-right' | 'roundabout' | 'destination' | 'highway';
  distanceMeters: number;
  durationSeconds: number;
  coordinate: LatLng;
}

export interface PresetRoute {
  id: string;
  title: string;
  subtitle: string;
  originName: string;
  destinationName: string;
  originCoords: LatLng;
  destinationCoords: LatLng;
  distanceKm: number;
  durationMin: number;
  speedLimitKmh: number;
  elevationGainM: number;
  transportMode: TransportMode;
  path: LatLng[];
  instructions: TurnInstruction[];
  poiHighlights: { name: string; category: string; coords: LatLng }[];
}

export interface SimulationState {
  isPlaying: boolean;
  speedMultiplier: number; // 1x, 2x, 5x, 10x
  currentStepIndex: number;
  progressPercent: number; // 0 to 100
  currentSpeedKmh: number;
  headingDegrees: number;
  distanceRemainingMeters: number;
  timeRemainingSeconds: number;
  currentCoords: LatLng;
}

export interface RouteInsight {
  summary: string;
  auraVibe: string;
  trafficAssessment: string;
  scenicPoints: string[];
  safetyTip: string;
  recommendedMusicMood: string;
}
