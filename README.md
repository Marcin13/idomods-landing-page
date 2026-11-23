# SOLLUX Landing Page

Responsywny landing page marki SOLLUX, wykonany według projektu w Figmie jako zadanie rekrutacyjne IdoMods na stanowisko Programista Frontend + AI.

## Co zawiera strona

- Układ na telefon, tablet i desktop, oparty na tokenach z Figmy
- Hero z automatycznym sliderem i interaktywnymi lampami
- Animacje menu i kafelków zgodne z wytycznymi z projektu
- Płynny shader WebGL w sekcji CTA
- Obsługę klawiatury i ustawienia `prefers-reduced-motion`

**Stack:** HTML, SCSS i JavaScript bez frameworka.

## Uruchomienie od zera

Wymagania: Git, Node.js 24 z npm 11 oraz aktualna przeglądarka. Projekt testowano na Node 24.16.0 i npm 11.13.0.

```bash
git clone https://github.com/Marcin13/idomods-landing-page.git
cd idomods-landing-page
npm ci
npm run build
```

Następnie otwórz plik `index.html` w przeglądarce. Serwer nie jest potrzebny.

Podczas pracy nad stylami uruchom `npm run dev`, aby SCSS kompilował się automatycznie.

## Publikacja

Strona: https://marcin13.github.io/idomods-landing-page/

Po każdym wypchnięciu na `main` GitHub Actions uruchamia `npm run build:site` i publikuje katalog `_site`. Trafiają do niego tylko pliki używane przez stronę, bez README, dokumentacji, źródeł SCSS i konfiguracji.

## Struktura

| Ścieżka | Zawartość |
|---|---|
| `index.html` | Treść strony |
| `src/styles/` | SCSS i tokeny projektu (`_tokens.scss`) |
| `src/js/main.js` | Menu mobilne |
| `src/js/hero.js` | Slider i interaktywne lampy |
| `src/js/shader.js` | Animacja WebGL w sekcji CTA |
| `src/assets/` | Ikony, logotypy, fonty i obrazy (`web/` to wersje zoptymalizowane) |
| `dist/main.css` | Skompilowany CSS |
| `docs/design/` | Wzorce wizualne i obrazy referencyjne |
| `figma-content.md` | Treści, style i wytyczne odczytane z Figmy |

Zależności deweloperskie to `sass` do kompilacji SCSS oraz `@fontsource-variable/red-hat-display` jako źródło fontu, który strona hostuje lokalnie.

## Animacje

- **Menu:** po najechaniu nagłówek przechodzi na białe tło, a tekst, ikony i logo na czarne w 250 ms.
- **Górny pasek:** elementy wchodzą kolejno po załadowaniu, złota linia przesuwa się między linkami, a ikony mają mikroanimacje. Przy przewijaniu w dół pasek się chowa, a w górę wraca.
- **Rozwijane menu:** na desktopie panel wjeżdża z kolejno pojawiającymi się linkami, a na telefonie działa jako akordeon.
- **Lampy:** unoszą się, reagują na kursor i włączają po kliknięciu, dotknięciu lub klawiszem Enter. Snop i plama światła na skale korzystają z tej samej pozycji co lampa.
- **Slider:** zmienia slajd co 3 s, z przenikaniem 600 ms, skalowaniem 800 ms i liniowym paskiem postępu.
- **Kafelki:** obraz powiększa się o 10% w 500 ms, a przycisk zmienia kolor na `#4A4A4A` w 200 ms.
- **Shader:** działa w WebGL jako bezszwowa pętla 25 s, maksymalnie 30 kl./s, i zatrzymuje się poza ekranem.
- **Ograniczenie ruchu:** przy `prefers-reduced-motion` autoplay i ruch lamp są wyłączone, a shader pokazuje jedną klatkę.

## Decyzje projektowe

Figma zawiera tylko widok desktop 1920 px, dlatego poniższe zachowania są decyzjami implementacyjnymi:

- Punkty przełamania to 768 px i 1280 px.
- Wzorzec `docs/design/mobile-390.png` to zaakceptowany zrzut implementacji, a nie ramka z Figmy.
- Poniżej 1280 px linki nawigacji są w menu otwieranym przyciskiem i zamykanym klawiszem Escape.
- Na telefonie wyszukiwarka zajmuje osobny wiersz, a zdjęcie hero przechodzi w ciemne tło pod tekstem.
- Poniżej 360 px skrót do konfiguratora znika z nagłówka, a link pozostaje w stopce.
- Na telefonie kafelki tworzą jedną kolumnę, a kafelek THORO ma gradient poprawiający kontrast tekstu.
- Tło hero odtworzono bez lamp, aby mogły poruszać się jako osobne warstwy.
- Slider czeka, gdy lampa jest włączona, kursor jest na lampie lub fokus klawiatury znajduje się w hero.
- Dodano przycisk pauzy, którego nie ma w Figmie, aby użytkownik mógł zatrzymać automatyczny ruch.
- Kolor tekstu i filtr ikon w menu to wyjątki od zasady „animuj tylko transform i opacity”, bo wytyczna menu wprost wymaga przejścia z białego na czarny.
- Figma pokazuje strzałki przy Lampy, Kolory i Pomieszczenia, ale nie zawiera ich podmenu. Kategorie i układ paneli są propozycją do potwierdzenia.
- Górny pasek jest przypięty do ekranu. Poza hero ma białe tło, a na telefonie chowa wtedy wyszukiwarkę, aby zajmować mniej miejsca.
- W tekstach poprawiono „Wpsółpraca” na „Współpraca” oraz „Pobierz aplikacje” na „Pobierz aplikację”.

## Testy i znane ograniczenia

Stronę sprawdzono w Chromium przy szerokościach 320, 390, 768, 1024, 1280 i 1920 px, w tym obsługę myszy, klawiatury, emulowanego dotyku i ograniczonego ruchu.

- Nie testowano jeszcze strony na fizycznym telefonie, w Safari ani w Firefoksie.
- Płynności shadera nie mierzono na sprzętowej karcie graficznej.
- Większość linków prowadzi do `#`, bo projekt nie określa adresów. Telefon i e-mail działają.

## Przebieg pracy

Projekt powstał przy współpracy z Claude Code. Historię commitów uporządkowano po zakończeniu pierwszej wersji w logiczne etapy, dlatego ich daty są zbliżone. Pełny przebieg pracy pokazuje dołączony zapis rozmowy.
