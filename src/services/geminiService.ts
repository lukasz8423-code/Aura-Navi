import { GoogleGenAI } from '@google/genai';
import { PresetRoute, RouteInsight } from '../types/navigation';

export async function fetchGeminiRouteInsight(route: PresetRoute): Promise<RouteInsight> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return getDefaultInsight(route);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
Jesteś inteligentnym asystentem nawigacji "Aura-Navi". Przeanalizuj poniższą trasę nawigacyjną i zwróć zwięzłą odpowiedź w formacie JSON:

Trasa: ${route.title}
Skąd: ${route.originName}
Dokąd: ${route.destinationName}
Dystans: ${route.distanceKm} km
Czas: ${route.durationMin} minut
Środek transportu: ${route.transportMode}

Zwróć TYLKO czysty obiekt JSON bez markdown w formacie:
{
  "summary": "1-2 zdania podsumowania charakteru trasy i płynności ruchu",
  "auraVibe": "Krótkie określenie klimatu trasy (np. Energetyczna Trasa Miejska, Spokojny Szlak Nadmorski, Górski Wyzwanie HUD)",
  "trafficAssessment": "Ocena przejezdności (np. Płynny ruch, znikome spowolnienia na skrzyżowaniach)",
  "scenicPoints": ["3 ciekawe punkty lub widoki po drodze"],
  "safetyTip": "Krótka praktyczna wskazówka dotycząca nawierzchni lub zakrętów",
  "recommendedMusicMood": "Propozycja gatunku muzycznego lub klimatu audio na tę trasę"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        summary: parsed.summary || getDefaultInsight(route).summary,
        auraVibe: parsed.auraVibe || getDefaultInsight(route).auraVibe,
        trafficAssessment: parsed.trafficAssessment || getDefaultInsight(route).trafficAssessment,
        scenicPoints: Array.isArray(parsed.scenicPoints) ? parsed.scenicPoints : getDefaultInsight(route).scenicPoints,
        safetyTip: parsed.safetyTip || getDefaultInsight(route).safetyTip,
        recommendedMusicMood: parsed.recommendedMusicMood || getDefaultInsight(route).recommendedMusicMood,
      };
    }
  } catch (err) {
    console.warn('Gemini AI route insight fallback:', err);
  }

  return getDefaultInsight(route);
}

function getDefaultInsight(route: PresetRoute): RouteInsight {
  return {
    summary: `Trasa ${route.title} oferuje płynny przejazd o długości ${route.distanceKm} km z optymalnym czasowo prowadzeniem.`,
    auraVibe: route.transportMode === 'car' ? 'Dynamiczny Futurystyczny HUD Cruise' : 'Malowniczy Szlak Rekreacyjny',
    trafficAssessment: 'Płynne warunki drogowe z zieloną falą na kluczowych arteriach',
    scenicPoints: route.poiHighlights.map(p => p.name),
    safetyTip: 'Zachowaj przepisowy odstęp od poprzedzających pojazdów i obserwuj zmiany pasów.',
    recommendedMusicMood: 'Synthwave / Cyberpunk Chill Automotive'
  };
}
