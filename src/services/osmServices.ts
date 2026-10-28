import { LatLng, TurnInstruction, TransportMode } from '../types/navigation';

export interface GeocodedPlace {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

// 1. Nominatim Forward Geocoding (Address/Place Search)
export async function searchPlacesNominatim(query: string): Promise<GeocodedPlace[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&addressdetails=1&limit=5&accept-language=pl`;

    const res = await fetch(url, {
      headers: { 'User-Agent': 'AuraNavi-GPS-App/1.0' },
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn('Nominatim search error:', err);
    return [];
  }
}

// 2. Nominatim Reverse Geocoding (GPS Coords to Address)
export async function reverseGeocodeNominatim(coords: LatLng): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&accept-language=pl`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'AuraNavi-GPS-App/1.0' },
    });

    if (!res.ok) return `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
    const data = await res.json();
    return data.display_name ? data.display_name.split(',')[0] + ', ' + (data.address?.city || data.address?.town || '') : `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
  } catch (err) {
    return `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
  }
}

// 3. OSRM Route Calculation (Car, Bike, Foot)
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

    const path: LatLng[] = coordinates.map((coord) => ({
      lat: coord[1],
      lng: coord[0],
    }));

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

      const streetName = step.name || step.ref || 'Droga bez nazwy';
      const instructionText =
        type === 'arrive'
          ? 'Osiągnięto cel podróży'
          : `${step.maneuver.instruction || 'Jedź prosto'} (${streetName})`;

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

    return {
      path,
      instructions,
      distanceKm: Number((routeData.distance / 1000).toFixed(1)),
      durationMin: Math.ceil(routeData.duration / 60),
    };
  } catch (err) {
    console.warn('OSRM route fetch failed:', err);
    return null;
  }
}

// 4. Overpass API - Real Speed Limit Query for Current Location
export async function fetchOverpassSpeedLimit(coords: LatLng): Promise<number | null> {
  try {
    const query = `[out:json];way(around:25,${coords.lat},${coords.lng})[maxspeed];out tags;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for Overpass

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = await res.json();

    if (data.elements && data.elements.length > 0) {
      const maxspeedVal = data.elements[0].tags?.maxspeed;
      if (maxspeedVal) {
        const parsed = parseInt(maxspeedVal, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    }
  } catch (err) {
    // Overpass rate-limit or timeout
  }
  return null;
}
