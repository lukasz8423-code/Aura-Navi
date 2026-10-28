import { PresetRoute } from '../types/navigation';

export const PRESET_ROUTES: PresetRoute[] = [
  {
    id: 'warsaw-airport-center',
    title: 'Warszawa: Dworzec Centralny ➔ Lotnisko Chopina',
    subtitle: 'Szybki dojazd trasą Wisłostrada & Aleje Jerozolimskie',
    originName: 'Warszawa Centralna, Aleje Jerozolimskie 54',
    destinationName: 'Lotnisko Chopina (WAW), ul. Żwirki i Wigury 1',
    originCoords: { lat: 52.2288, lng: 21.0032 },
    destinationCoords: { lat: 52.1657, lng: 20.9671 },
    distanceKm: 8.4,
    durationMin: 14,
    speedLimitKmh: 70,
    elevationGainM: 18,
    transportMode: 'car',
    path: [
      { lat: 52.2288, lng: 21.0032 }, // Dworzec Centralny
      { lat: 52.2272, lng: 20.9995 }, // Aleje Jerozolimskie / Chałubińskiego
      { lat: 52.2235, lng: 20.9961 }, // Plac Starynkiewicza
      { lat: 52.2185, lng: 20.9912 }, // Rondo Zesłańców Syberyjskich
      { lat: 52.2091, lng: 20.9854 }, // Aleje Jerozolimskie / Krotoszyńska
      { lat: 52.1985, lng: 20.9811 }, // ul. Łopuszańska
      { lat: 52.1892, lng: 20.9781 }, // ul. Hynka
      { lat: 52.1784, lng: 20.9725 }, // ul. Żwirki i Wigury
      { lat: 52.1695, lng: 20.9698 }, // Dojazd do terminala
      { lat: 52.1657, lng: 20.9671 }, // Terminal Lotniska Chopina
    ],
    instructions: [
      {
        stepIndex: 0,
        instructionText: 'Ruszaj na południowy zachód w stronę ul. Chałubińskiego',
        streetName: 'Aleje Jerozolimskie',
        iconType: 'straight',
        distanceMeters: 450,
        durationSeconds: 35,
        coordinate: { lat: 52.2288, lng: 21.0032 }
      },
      {
        stepIndex: 1,
        instructionText: 'Skręć w lewo w ul. Tytusa Chałubińskiego',
        streetName: 'ul. Tytusa Chałubińskiego',
        iconType: 'turn-left',
        distanceMeters: 800,
        durationSeconds: 60,
        coordinate: { lat: 52.2272, lng: 20.9995 }
      },
      {
        stepIndex: 2,
        instructionText: 'Lekko w prawo na estakadę w stronę Alei Jerozolimskich',
        streetName: 'Aleje Jerozolimskie (DK7)',
        iconType: 'slight-right',
        distanceMeters: 1800,
        durationSeconds: 120,
        coordinate: { lat: 52.2235, lng: 20.9961 }
      },
      {
        stepIndex: 3,
        instructionText: 'Na Rondzie Zesłańców Syberyjskich weź 2. zjazd w ul. Bitwy Warszawskiej',
        streetName: 'Rondo Zesłańców Syberyjskich',
        iconType: 'roundabout',
        distanceMeters: 1200,
        durationSeconds: 90,
        coordinate: { lat: 52.2185, lng: 20.9912 }
      },
      {
        stepIndex: 4,
        instructionText: 'Zjedź z węzła w prawo na ul. Żwirki i Wigury',
        streetName: 'ul. Żwirki i Wigury',
        iconType: 'turn-right',
        distanceMeters: 2800,
        durationSeconds: 210,
        coordinate: { lat: 52.1892, lng: 20.9781 }
      },
      {
        stepIndex: 5,
        instructionText: 'Jedź prosto Aleją Lipową do Terminalu A',
        streetName: 'Lotnisko Chopina - Przyloty/Odloty',
        iconType: 'destination',
        distanceMeters: 1350,
        durationSeconds: 100,
        coordinate: { lat: 52.1657, lng: 20.9671 }
      }
    ],
    poiHighlights: [
      { name: 'Park Pola Mokotowskie', category: 'Park', coords: { lat: 52.212, lng: 20.998 } },
      { name: 'Pomnik Lotnika', category: 'Zabytek', coords: { lat: 52.216, lng: 20.989 } },
      { name: 'Terminal A WAW', category: 'Lotnisko', coords: { lat: 52.1657, lng: 20.9671 } }
    ]
  },
  {
    id: 'krakow-wawel-kazimierz',
    title: 'Kraków: Rynek Główny ➔ Zamek na Wawelu ➔ Kazimierz',
    subtitle: 'Widokowa trasa piesza/rowerowa przez serce Krakowa',
    originName: 'Rynek Główny, Kraków',
    destinationName: 'Plac Nowy, Kazimierz, Kraków',
    originCoords: { lat: 50.0619, lng: 19.9373 },
    destinationCoords: { lat: 50.0521, lng: 19.9448 },
    distanceKm: 3.2,
    durationMin: 22,
    speedLimitKmh: 30,
    elevationGainM: 12,
    transportMode: 'bike',
    path: [
      { lat: 50.0619, lng: 19.9373 }, // Rynek Główny
      { lat: 50.0592, lng: 19.9381 }, // ul. Grodzka
      { lat: 50.0568, lng: 19.9379 }, // Kościół św. Piotra i Pawła
      { lat: 50.0541, lng: 19.9355 }, // Wzgórze Wawelskie
      { lat: 50.0528, lng: 19.9382 }, // ul. Stradomska
      { lat: 50.0519, lng: 19.9415 }, // ul. Miodowa
      { lat: 50.0521, lng: 19.9448 }  // Plac Nowy Kazimierz
    ],
    instructions: [
      {
        stepIndex: 0,
        instructionText: 'Kieruj się na południe zabytkową ulicą Grodzką',
        streetName: 'ul. Grodzka',
        iconType: 'straight',
        distanceMeters: 400,
        durationSeconds: 120,
        coordinate: { lat: 50.0619, lng: 19.9373 }
      },
      {
        stepIndex: 1,
        instructionText: 'Mijając Planty Krakowskie, spójrz na Wzgórze Wawelskie',
        streetName: 'ul. Podzamcze',
        iconType: 'slight-right',
        distanceMeters: 650,
        durationSeconds: 180,
        coordinate: { lat: 50.0568, lng: 19.9379 }
      },
      {
        stepIndex: 2,
        instructionText: 'Skręć w lewo w stronę Stradomia i dzielnicy Kazimierz',
        streetName: 'ul. Stradomska',
        iconType: 'turn-left',
        distanceMeters: 800,
        durationSeconds: 240,
        coordinate: { lat: 50.0541, lng: 19.9355 }
      },
      {
        stepIndex: 3,
        instructionText: 'Skręć w prawo w ul. Miodową i jedź do Placu Nowego',
        streetName: 'Plac Nowy (Kazimierz)',
        iconType: 'destination',
        distanceMeters: 1350,
        durationSeconds: 380,
        coordinate: { lat: 50.0521, lng: 19.9448 }
      }
    ],
    poiHighlights: [
      { name: 'Sukiennice', category: 'Zabytek', coords: { lat: 50.0616, lng: 19.9373 } },
      { name: 'Zamek Królewski na Wawelu', category: 'Zamek', coords: { lat: 50.0541, lng: 19.9355 } },
      { name: 'Okrąglak na Kazimierzu', category: 'Gastronomia', coords: { lat: 50.0521, lng: 19.9448 } }
    ]
  },
  {
    id: 'gdansk-sopot-molo',
    title: 'Trójmiasto: Dworzec Główny Gdańsk ➔ Molo w Sopocie',
    subtitle: 'Nadmorska trasa widokowa Aleją Zwycięstwa i Niepodległości',
    originName: 'Gdańsk Główny, ul. Podwale Grodzkie',
    destinationName: 'Molo w Sopocie, Plac Zdrojowy 2',
    originCoords: { lat: 54.3551, lng: 18.6449 },
    destinationCoords: { lat: 54.4452, lng: 18.5721 },
    distanceKm: 12.8,
    durationMin: 18,
    speedLimitKmh: 70,
    elevationGainM: 25,
    transportMode: 'car',
    path: [
      { lat: 54.3551, lng: 18.6449 }, // Gdańsk Główny
      { lat: 54.3685, lng: 18.6382 }, // Aleja Zwycięstwa / Brama Oliwska
      { lat: 54.3821, lng: 18.6015 }, // Wrzeszcz Aleja Grunwaldzka
      { lat: 54.4082, lng: 18.5752 }, // Oliwa Park
      { lat: 54.4321, lng: 18.5684 }, // Sopot Wyścigi
      { lat: 54.4425, lng: 18.5695 }, // ul. Bohaterów Monte Cassino
      { lat: 54.4452, lng: 18.5721 }  // Sopot Molo
    ],
    instructions: [
      {
        stepIndex: 0,
        instructionText: 'Ruszaj na północ Aleją Zwycięstwa w stronę Wrzeszcza',
        streetName: 'Aleja Zwycięstwa',
        iconType: 'straight',
        distanceMeters: 2100,
        durationSeconds: 140,
        coordinate: { lat: 54.3551, lng: 18.6449 }
      },
      {
        stepIndex: 1,
        instructionText: 'Kontynuuj prosto Aleją Grunwaldzką przez Gdańsk Wrzeszcz',
        streetName: 'Aleja Grunwaldzka',
        iconType: 'straight',
        distanceMeters: 4800,
        durationSeconds: 280,
        coordinate: { lat: 54.3821, lng: 18.6015 }
      },
      {
        stepIndex: 2,
        instructionText: 'Wjeżdżając do Sopotu wjedź w Aleję Niepodległości',
        streetName: 'Aleja Niepodległości',
        iconType: 'straight',
        distanceMeters: 3900,
        durationSeconds: 220,
        coordinate: { lat: 54.4321, lng: 18.5684 }
      },
      {
        stepIndex: 3,
        instructionText: 'Skręć w prawo w ul. Podjazd w stronę Molo',
        streetName: 'ul. Bohaterów Monte Cassino',
        iconType: 'turn-right',
        distanceMeters: 1200,
        durationSeconds: 160,
        coordinate: { lat: 54.4425, lng: 18.5695 }
      },
      {
        stepIndex: 4,
        instructionText: 'Osiągnięto cel: Molo i Plac Zdrojowy w Sopocie',
        streetName: 'Molo w Sopocie',
        iconType: 'destination',
        distanceMeters: 800,
        durationSeconds: 100,
        coordinate: { lat: 54.4452, lng: 18.5721 }
      }
    ],
    poiHighlights: [
      { name: 'Politechnika Gdańska', category: 'Uczelnia', coords: { lat: 54.371, lng: 18.618 } },
      { name: 'Park Oliwski & Katedra', category: 'Park', coords: { lat: 54.410, lng: 18.558 } },
      { name: 'Krzywy Domek & Molo', category: 'Atrakcja', coords: { lat: 54.4452, lng: 18.5721 } }
    ]
  },
  {
    id: 'tatry-zakopane-morskie-oko',
    title: 'Góry: Zakopane Krupówki ➔ Palenica Białczańska (Morskie Oko)',
    subtitle: 'Górska malownicza trasa przez Jaszczurówkę i Łysą Polanę',
    originName: 'Zakopane, ul. Krupówki',
    destinationName: 'Palenica Białczańska (Start na Morskie Oko)',
    originCoords: { lat: 49.299, lng: 19.949 },
    destinationCoords: { lat: 49.255, lng: 20.103 },
    distanceKm: 21.5,
    durationMin: 28,
    speedLimitKmh: 60,
    elevationGainM: 320,
    transportMode: 'car',
    path: [
      { lat: 49.299, lng: 19.949 }, // Zakopane Krupówki
      { lat: 49.291, lng: 19.972 }, // Jaszczurówka
      { lat: 49.282, lng: 20.021 }, // Cyrhla
      { lat: 49.271, lng: 20.065 }, // Wierch Poroniec
      { lat: 49.261, lng: 20.091 }, // Łysa Polana
      { lat: 49.255, lng: 20.103 }  // Palenica Białczańska
    ],
    instructions: [
      {
        stepIndex: 0,
        instructionText: 'Ruszaj ul. Oswalda Balzera na wschód w stronę Jaszczurówki',
        streetName: 'ul. Droga na Bystre',
        iconType: 'straight',
        distanceMeters: 2500,
        durationSeconds: 200,
        coordinate: { lat: 49.299, lng: 19.949 }
      },
      {
        stepIndex: 1,
        instructionText: 'Mijaj Kaplicę na Jaszczurówce i pnij się zakrętami w górę',
        streetName: 'Droga Oswalda Balzera',
        iconType: 'slight-right',
        distanceMeters: 6200,
        durationSeconds: 420,
        coordinate: { lat: 49.291, lng: 19.972 }
      },
      {
        stepIndex: 2,
        instructionText: 'Na skrzyżowaniu Wierch Poroniec skręć w prawo na Łysą Polanę',
        streetName: 'Droga DK49',
        iconType: 'turn-right',
        distanceMeters: 7800,
        durationSeconds: 520,
        coordinate: { lat: 49.271, lng: 20.065 }
      },
      {
        stepIndex: 3,
        instructionText: 'Jedź prosto do tradycyjnego taboru w Palenicy Białczańskiej',
        streetName: 'Palenica Białczańska Parking',
        iconType: 'destination',
        distanceMeters: 5000,
        durationSeconds: 340,
        coordinate: { lat: 49.255, lng: 20.103 }
      }
    ],
    poiHighlights: [
      { name: 'Kaplica w Jaszczurówce', category: 'Zabytek', coords: { lat: 49.291, lng: 19.972 } },
      { name: 'Punkt widokowy Wierch Poroniec', category: 'Panorama', coords: { lat: 49.271, lng: 20.065 } },
      { name: 'Wodogrzmoty Mickiewicza', category: 'Natura', coords: { lat: 49.231, lng: 20.088 } }
    ]
  }
];
