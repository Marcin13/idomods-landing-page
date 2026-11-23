# SOLLUX Landing Page

Landing page przygotowany według projektu w Figmie jako zadanie rekrutacyjne IdoMods (Frontend + AI).

## Wymagania

- Node.js 24 z npm 11 (projekt testowano na Node 24.16.0 i npm 11.13.0)
- Aktualna przeglądarka

## Uruchomienie od zera

```bash
npm ci
npm run build
```

Następnie otwórz plik `index.html` w przeglądarce. Serwer nie jest potrzebny.

Podczas pracy nad stylami uruchom `npm run dev`, aby SCSS kompilował się automatycznie.

## Struktura

- `index.html`: treść strony
- `src/styles/`: SCSS i tokeny projektu (`_tokens.scss`)
- `src/js/main.js`: menu mobilne
- `src/js/hero.js`: slider i interaktywne lampy
- `src/js/shader.js`: animacja WebGL w sekcji CTA
- `src/assets/`: ikony, logotypy, fonty i zoptymalizowane obrazy (`web/`)
- `dist/main.css`: skompilowany CSS
- `docs/design/`: wzorce z Figmy i obrazy referencyjne

## Zależności

- `sass`: kompilacja SCSS
- `@fontsource-variable/red-hat-display`: źródło fontu z projektu, hostowanego lokalnie w `src/assets/fonts/`

## Decyzje projektowe

Figma zawiera tylko widok desktop 1920 px, dlatego poniższe zachowania są decyzjami implementacyjnymi:

- Wzorzec `docs/design/mobile-390.png` to zaakceptowany zrzut implementacji, a nie ramka z Figmy.
- Punkty przełamania to 768 px i 1280 px.
- Poniżej 1280 px linki nawigacji są w menu otwieranym przyciskiem i zamykanym klawiszem Escape.
- Na telefonie wyszukiwarka zajmuje osobny wiersz pod logo.
- Na telefonie zdjęcie hero zajmuje górną część sekcji i przechodzi w ciemne tło, aby lampy i tekst pozostały czytelne.
- Poniżej 360 px skrót do konfiguratora znika z nagłówka, a link pozostaje w stopce.
- Na telefonie kafelki są ułożone w jednej kolumnie, z grafiką nad tekstem.
- Kafelek THORO ma na telefonie ciemny gradient, który poprawia kontrast tekstu.
- Stopka na telefonie ma dwie kolumny linków i większe pola dotyku.
- Literówkę „Wpsółpraca” z projektu poprawiono na „Współpraca”.
- Adresy linków są tymczasowe (`#`), bo projekt ich nie określa. Telefon i e-mail działają.

## Animacje

- **Menu:** biały nagłówek pojawia się przez `opacity`. Kolor tekstu to jedyny wyjątek od zasady „tylko transform i opacity”, bo wytyczna menu wprost wymaga przejścia z białego na czarny.
- **Lampy:** lampy unoszą się, reagują na kursor i włączają po kliknięciu, dotknięciu lub klawiszem Enter. Tło hero odtworzono bez lamp, aby mogły poruszać się jako osobne warstwy.
- **Slider:** zmienia slajd co 3 s. Czeka, gdy lampa jest włączona, kursor jest na lampie lub fokus klawiatury znajduje się w hero.
- **Przycisk pauzy:** nie ma go w Figmie, ale dodano go, aby użytkownik mógł zatrzymać automatyczny ruch.
- **Kafelki:** obraz powiększa się o 10%, a przycisk zmienia kolor na `#4A4A4A`, także przy fokusie klawiatury.
- **Shader:** działa w WebGL jako bezszwowa pętla 25 s, maksymalnie 30 kl./s. Zatrzymuje się poza ekranem, a bez WebGL widoczny jest gradient CSS.
- **Ograniczenie ruchu:** przy ustawieniu `prefers-reduced-motion` autoplay i ruch lamp są wyłączone, a shader pokazuje jedną klatkę.
