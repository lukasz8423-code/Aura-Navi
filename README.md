# Aura Navi

Bezpłatny prototyp nawigacji jako aplikacja webowa/PWA. Nie wymaga klucza API ani płatnej subskrypcji.

## Bezpłatne źródła
- Mapa: OpenFreeMap + dane OpenStreetMap; renderowanie przez MapLibre GL JS.
- Wyszukiwanie i adres GPS: OpenStreetMap Nominatim. Wyszukiwanie odbywa się po wybraniu przycisku „Wyznacz trasę”, bez autocomplete.
- Wyznaczanie trasy i manewry: publiczny serwer demonstracyjny OSRM.
- Odczyt ograniczeń prędkości: dane OpenStreetMap przez Overpass API.

## Ważne ograniczenia
Publiczne usługi są bezpłatne, ale mogą mieć limity, przerwy i zmieniać warunki dostępu. Nominatim ma limit maksymalnie 1 zapytania na sekundę; publiczny serwer OSRM jest demonstracyjny i działa w trybie best-effort. Aplikacja wykonuje wyszukiwanie dopiero po świadomym działaniu użytkownika i nie wysyła żądań geokodowania przy każdym wpisanym znaku.

Nie ma wiarygodnych alertów live o korkach, wypadkach, policji ani radarach. Informacja o ograniczeniu prędkości może być niedostępna lub niepełna — zawsze stosuj się do znaków drogowych. To prototyp, nie certyfikowany zamiennik nawigacji samochodowej.

## Uruchomienie
GitHub Pages publikuje pliki z katalogu głównego gałęzi main. Otwórz przez HTTPS, zezwól na lokalizację, wpisz cel i naciśnij „Wyznacz trasę”.

## Polityki źródeł
- OpenFreeMap: https://openfreemap.org/tos/
- Nominatim: https://operations.osmfoundation.org/policies/nominatim/
- OSRM demo server: https://github.com/Project-OSRM/osrm-backend/wiki/Demo-server
