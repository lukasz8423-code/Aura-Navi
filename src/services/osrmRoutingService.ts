import { LatLng, PresetRoute, TurnInstruction, TransportMode } from '../types/navigation';

export interface GeocodedPlace {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

// Fetch Real Places Geocoding from OpenStreetMap Nominatim API
export async function searchPlacesNominatim(query: string): Promise<GeocodedPlace[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&addressdetails=1&limit=5&accept-language=pl`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'AuraNavi-GPS-App/1.0',
      },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data || [];
  } catch (err) {
    console.warn('Nominatim geocoding error:', err);
    return [];
  }
}

// Fetch Real Turn-by-Turn Route from OSRM (Open Source Routing Machine)
export async function fetchOSRMRoute(
  origin: LatLng,
  destination: LatLng,
  mode: TransportMode = 'car'
): Promise<{ path: LatLng[]; instructions: TurnInstruction[]; distanceKm: number; durationMin: number } | null> {
  try {
    const osrmProfile = mode === 'bike' ? 'biking' : mode === 'walk' ? 'foot' : 'driving';
    const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&steps=true`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.routes || data.routes.length === 0) return null;

    const routeData = data.routes[0];
    const coordinates: [number, number][] = routeData.geometry.coordinates;

    // Convert [lng, lat] to LatLng objects
    const path: LatLng[] = coordinates.map((coord) => ({
      lat: coord[1],
      lng: coord[0],
    }));

    // Convert OSRM steps to TurnInstruction objects
    const osrmSteps = routeData.legs[0]?.steps || [];
    const instructions: TurnInstruction[] = osrmSteps.map((step: any, idx: number) => {
      const stepCoord: LatLng = {
        lat: step.maneuver.location[1],
        lng: step.maneuver.location[0],
      };

      const modifier = step.maneuver.modifier || '';
      const type = step.maneuver.type || '';

      let iconType: TurnInstruction['iconType'] = 'straight';
      if (type === 'turn' || type === 'new name') {
        if (modifier.includes('left')) iconType = 'turn-left';
        else if (modifier.includes('right')) iconType = 'turn-right';
      } else if (type === 'slight turn') {
        if (modifier.includes('left')) iconType = 'slight-left';
        else if (modifier.includes('right')) iconType = 'slight-right';
      } else if (type === 'roundabout' || type === 'rotary') {
        iconType = 'roundabout';
      } else if (type === 'arrive') {
        iconType = 'destination';
      }

      const streetName = step.name || step.ref || 'Trasa Bez Nazwy';
      const instructionText =
        type === 'arrive'
          ? 'Osiągnięto cel podróży'
          : `${step.maneuver.instruction || 'Jedź dalej'} (${streetName})`;

      return {
        stepIndex: idx,
        instructionText,
        streetName,
        iconType,
        distanceMeters: Math.round(step.distance),
        durationSeconds: Math.round(step.duration),
        coordinate: stepCoord,
      };
    });

    const distanceKm = Number((routeData.distance / 1000).toFixed(1));
    const durationMin = Math.ceil(routeData.duration / 60);

    return {
      path,
      instructions: instructions.length > 0 ? instructions : [
        {
          stepIndex: 0,
          instructionText: 'Kieruj się do celu wyznaczoną trasą',
          streetName: 'Trasa Nawigacyjna',
          iconType: 'straight',
          distanceMeters: Math.round(routeData.distance),
          durationSeconds: Math.round(routeData.duration),
          coordinate: origin,
        }
      ],
      distanceKm,
      durationMin,
    };
  } catch (err) {
    console.warn('OSRM routing fetch failed:', err);
    return null;
  }
}
