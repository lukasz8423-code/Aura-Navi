# Aura-Navi: Modern Cyber-HUD GPS Navigation & Turn-by-Turn Route Planner

Zaawansowany system nawigacji GPS "Aura-Navi" łączący interaktywne mapy, cyjanowo-fioletowy motyw HUD z poświatą Aura, bezpośrednie wyszukiwanie celów z geokodowaniem, trasowanie w czasie rzeczywistym z instrukcjami krok po kroku, rygorystyczne pozycjonowanie układu bez nachodzących na siebie elementów UI oraz realistyczny symulator jazdy z telemetrią.

## User Review & Critical Decisions

> [!IMPORTANT] Potwierdzone i zaktualizowane decyzje z etapu konsultacji:
- **Typ Aplikacji**: Zaawansowana nawigacja GPS z interaktywną mapą i planowaniem tras.
- **Główne Funkcje**: Wyszukiwanie celów, nawigacja krok po kroku, interaktywna symulacja jazdy z dopasowaniem do ścieżki i telemetrią.
- **Motyw Wizualny**: Ciemny motyw HUD ze świecącymi akcentami Aura w odcieniach cyjanu (`#00F2FE`) i fioletu (`#9D4EDD`).
- **Rygorystyczny Layout CSS (Grid/Flexbox)**: Gwarancja czystych, odseparowanych stref dla interfejsu (prędkościomierz, przyciski sterujące mapą, pasek ETA, lista manewrów) bez losowych pozycji absolutnych i bez nachodzenia na siebie elementów.
- **Realizm Ruchu Drogowego**: Wyeliminowanie fikcyjnych korków na spokojnych drogach lokalnych i wiejskich.

---

### 1. Overview & Core Concept

- **Co robi aplikacja**: Aura-Navi to zaawansowany system nawigacji nowej generacji. Pozwala użytkownikowi szukać dowolnego miejsca na świecie (lub wybierać z przygotowanych atrakcyjnych celów podróży), obliczać optymalne trasy (samochodowe, rowerowe, piesze), oglądać podsumowanie czasowe i dystansowe, przełączać nawigację w tryb symulacji w czasie rzeczywistym (z płynnie poruszającym się symulatorem pojazdu po trasie, aktualnymi komunikatami turn-by-turn, cyfrowym prędkościomierzem i powiadomieniami o manewrach) oraz korzystać z asystenta tras Gemini AI.
- **Grupa docelowa**: Kierowcy, entuzjaści nowoczesnych interfejsów HUD, podróżnicy oraz osoby poszukujące precyzyjnego narzędzia do nawigacji i planowania podróży.
- **Kluczowa wartość**: Połączenie precyzyjnego wyszukiwania tras, estetyki cyfrowego kokpitu samochodowego z dynamicznym symulatorem jazdy, wskaźnikami telemetrii i asystentem podróży.

---

### 2. User Experience & Visual Design & Strict Zoning

- **Struktura Viewportu i Bezpieczne Strefy (CSS Grid / Flex System)**:
  Cała aplikacja wykorzystuje pełnoekranowy układ `h-screen w-screen overflow-hidden grid grid-rows-[auto_1fr_auto]`:

  1. **Zone 1: Top Bar Header (`h-14` / Flex Row)**:
     - Dedykowany, niezasłonięty pasek górny zawieszony na samej górze.
     - Lewa strona: Wordmark "Aura-Navi" z efektem poświaty Aura + wskaźnik GPS.
     - Środek: Główny wyszukiwarka punktu docelowego (Destination Search).
     - Prawa strona: Przełącznik trybu transportu (Auto / Rower / Pieszo).

  2. **Zone 2: Main Workspace (`1fr` / Grid Layout)**:
     - **Zone 2A: Left Dock (Panel Boczny `w-[360px] md:w-[400px]`)**:
       - Przeznaczony wyłącznie na formularz planowania tras, profil wysokościowy, pełną listę manewrów turn-by-turn oraz moduł AI Aura Insights.
       - Możliwość zwijania panelu do zaledwie `w-12` na mniejszych ekranach, co odsłania widok mapy.
     - **Zone 2B: Central Map Canvas with Non-Overlapping Control Anchors**:
       - Mapa zajmuje pełną dostępną przestrzeń.
       - Wszystkie kontrolki na mapie znajdują się w dedykowanych kontenerach zakotwiczonych na krawędziach z włączonym `pointer-events-none` na kontenerze nadrzędnym i `pointer-events-auto` na samych przyciskach:
         - *Top-Left Anchor*: Widżet Nastepnego Manewru (Next Turn HUD Card) – odległość i kierunek skrętu.
         - *Top-Right Anchor*: Pionowa kolumna przycisków kontroli mapy (Zoom In/Out, Zmiana Warstwy, Wyśrodkowanie Pojazdu).
         - *Bottom-Right Anchor*: Cyfrowy Prędkościomierz HUD (Speedometer) z podglądem aktualnej prędkości i dopuszczalnego limitu.

  3. **Zone 3: Bottom Control Bar (`h-20` / Fixed Grid/Flex Dock)**:
     - Dedykowana dolna strefa nawigacyjna.
     - Lewa strona: Szacowany czas przybycia (ETA) i pozostały dystans.
     - Środek: Kontrolki symulatora jazdy (Play/Pause, Przeskok, Suwak prędkości 1x/2x/5x).
     - Prawa strona: Przycisk Zakończ Nawigację / Przełącz Widok 3D.

- **Identyfikacja Wizualna i Motyw**:
  - **Aesthetic Direction**: Cyber-HUD Automotive Cockpit ze świecącą poświatą Aura Glow (akcenty neonu cyan `#00F2FE` oraz neonu violet `#9D4EDD`).
  - **Paleta Barw**:
    - **60% Neutral Canvas**: Głęboka ciemna tarcza kokpitu HUD (`#0A0D14` / `#0D111A`)
    - **30% Structural Surfaces**: Półprzezroczyste szkło kart kokpitu (`rgba(18, 24, 36, 0.85)`) z delikatną obwódką cyjanową (`border-cyan-500/20`)
    - **10% Accent Budget**: Świecący ślad trasy Aura Track (`#00F2FE`), fioletowe punkty zwrotne (`#9D4EDD`) oraz szmaragdowa zielona sygnalizacja (`#10B981`)
  - **Typografia**: `Outfit` oraz `Plus Jakarta Sans` dla nagłówków i czytelnych widżetów HUD, `JetBrains Mono` z `tabular-nums` dla prędkościomierza, dystansu, koordynatów GPS i timera.

---

### 3. Key Product Decisions & Trade-Offs

- **Decyzja 1: Sztywna Architektura Kontenerów Zamiast Niekontrolowanych Absolute Overlay**:
  - *Wybrane Podejście*: Kontenery nakładek na mapie używają dedykowanej siatki krawędziowej z odstępami (`p-4 gap-4`), uniemożliwiając elementom nachodzenie na siebie niezależnie od rozmiaru ekranu.
  - *Dlaczego*: Zapewnia to 100% czytelności i reagowanie na dotyk/kliknięcia bez zasłaniania innych kontrolek.

- **Decyzja 2: Realizm Danych i Natężenia Ruchu**:
  - *Wybrane Podejście*: Rzeczywiste trasowanie i wskaźniki przejezdności bez generowania sztucznych korków na trasach lokalnych/wiejskich.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ZONE 1: TOP BAR (Brand · GPS Status · Destination Search · Transport Mode)      │
├──────────────────────────────┬──────────────────────────────────────────────────┤
│ ZONE 2A: LEFT DOCK           │ ZONE 2B: MAP CANVAS & ANCHORED HUD CONTROLS      │
│  - Origin / Destination Input│ ┌──────────────────────┐  ┌────────────────────┐ │
│  - Route Options & Altitude  │ │ Top-Left: Turn HUD   │  │ Top-Right: Map Ctrls│ │
│  - Turn-by-Turn Instruction  │ └──────────────────────┘  └────────────────────┘ │
│    List                      │                           ┌────────────────────┐ │
│  - Gemini AI Insights        │                           │ Btm-Right: Speedo  │ │
│  - Saved Favorite Places     │                           └────────────────────┘ │
├──────────────────────────────┴──────────────────────────────────────────────────┤
│ ZONE 3: BOTTOM HUD DOCK (ETA Status · Simulation Play/Pause/Speed · End Nav)    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### 5. Implementation Steps

1. **Konfiguracja Projektu i Stylizacja Aura HUD**:
   - Aktualizacja `metadata.json` i `index.html` z nazwą i opisem Aura-Navi.
   - Zaimportowanie czcionek `Outfit` i `JetBrains Mono` w `index.html`.
   - Przygotowanie tokenów kolorystycznych cyjanu `#00F2FE` i fioletu `#9D4EDD` w Tailwind / CSS.

2. **Budowa Sztywnego Layoutu CSS i Silnika Mapy**:
   - Stworzenie pełnoekranowego szkieletu CSS Grid ze strefami Top, Left Dock, Map Canvas i Bottom Dock.
   - Stworzenie komponentu mapy z motywem Dark HUD i wsparciem dla rysowania tras z efektami neonowymi.
   - Zaimplementowanie silnika symulacji jazdy z płynną interpolacją współrzędnych i przeliczaniem orientacji pojazdu.

3. **Interfejs Użytkownika i Kontrolki HUD w Zakotwiczonych Strefach**:
   - Pasek górny z czystym układem Flex i wyszukiwarką miast/punktów.
   - Widżet nastpnego manewru w lewym górnym rogu mapy.
   - Przyciski kontroli mapy w prawym górnym rogu.
   - Prędkościomierz HUD w prawym dolnym rogu.
   - Konsola dolna z czasem ETA i kontrolowaniem symulacji.

4. **Integracja Gemini AI dla Aura Route Insights**:
   - Utworzenie endpointu / modułu AI analizującego wybraną trasę, podającego rekomendacje podróżne i ciekawostki.

5. **Weryfikacja i Testy Compilation**:
   - Przetestowanie działania symulatora tras, wyszukiwania i przełączania perspektywy mapy.
