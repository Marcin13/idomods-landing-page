# SOLLUX Landing Page

Responsywny, animowany landing page marki oświetleniowej SOLLUX, napisany w HTML, SCSS i JavaScript bez frameworka.

**Strona online:** <https://marcin13.github.io/idomods-landing-page/>

## Spis treści

- [Cel projektu](#cel-projektu)
- [Szybki start](#szybki-start)
- [Funkcje i sposób korzystania](#funkcje-i-sposób-korzystania)
- [Architektura](#architektura)
- [Wymagania i konfiguracja](#wymagania-i-konfiguracja)
- [Praca lokalna i budowanie](#praca-lokalna-i-budowanie)
- [Testowanie](#testowanie)
- [Wdrożenie](#wdrożenie)
- [Przykłady rozwoju](#przykłady-rozwoju)
- [Decyzje projektowe](#decyzje-projektowe)
- [Ograniczenia](#ograniczenia)
- [Planowane](#planowane)
- [Przebieg pracy](#przebieg-pracy)

## Cel projektu

Projekt powstał jako zadanie rekrutacyjne IdoMods na stanowisko Programista Frontend + AI. Zadanie polegało na zakodowaniu landing page'a według projektu w Figmie, razem z animacjami opisanymi w komentarzach do projektu.

Strona przenosi statyczny projekt desktopowy 1920 px do działającej witryny. Dodaje układ na telefon i tablet, interakcje, obsługę klawiatury oraz publikację wyłącznie plików potrzebnych w produkcji.

To front-end demonstracyjny. Nie ma backendu, koszyka, logowania ani działającej wyszukiwarki.

## Szybki start

Potrzebujesz Gita, Node.js 24 z npm 11 oraz aktualnej przeglądarki.

```bash
git clone https://github.com/Marcin13/idomods-landing-page.git
cd idomods-landing-page
npm ci
npm run build
```

Następnie otwórz `index.html` w przeglądarce. Serwer nie jest wymagany.

Aby zobaczyć dokładnie tę wersję, która trafia na produkcję, zbuduj `_site` i uruchom lokalny serwer:

```bash
npm run build:site
python3 -m http.server 4173 --bind 127.0.0.1 --directory _site
```

Strona będzie dostępna pod adresem <http://127.0.0.1:4173/>.

## Funkcje i sposób korzystania

### Nagłówek i nawigacja

| Funkcja | Jak działa | Jak użyć |
|---|---|---|
| Stan po najechaniu | Tło przechodzi na białe, a tekst, ikony i logo na czarne w 250 ms | Najedź kursorem na nagłówek |
| Rozwijane menu | Panel z kategoriami i grafiką na desktopie, akordeon poniżej 1280 px | Najedź lub kliknij Lampy, Kolory albo Pomieszczenia |
| Złota linia | Przesuwa się pod aktywnym linkiem na desktopie | Przesuń kursor po menu lub użyj klawisza Tab |
| Menu mobilne | Otwiera nawigację w przypiętym nagłówku | Dotknij ikony menu, zamknij ją ponownie lub klawiszem Escape |
| Inteligentne przewijanie | Poza hero pasek jest biały, chowa się przy ruchu w dół i wraca przy ruchu w górę | Przewiń stronę |
| Wejście elementów | Logo, linki, wyszukiwarka i ikony pojawiają się kolejno | Załaduj stronę |

### Hero

- **Slider** zmienia slajd co 3 s, z przenikaniem 600 ms, skalowaniem 800 ms i żółtym paskiem postępu.
- **Strzałki** przełączają slajdy, a **przycisk pauzy** zatrzymuje autoplay.
- Autoplay czeka, gdy lampa jest włączona, kursor jest na lampie, fokus klawiatury jest w hero albo karta jest ukryta.
- **Lampy** na pierwszym slajdzie unoszą się i reagują na kursor. Włączysz je kliknięciem, dotknięciem albo klawiszem Enter.
- **Światło lampy** ma kształt dyfuzora. Snop i plama światła na skale korzystają z tej samej pozycji co lampa.

### Treść strony

- **Korzyści:** pięć argumentów zakupowych pod hero.
- **Kafelki:** po najechaniu lub fokusie obraz powiększa się o 10% w 500 ms, a przycisk zmienia kolor na `#4A4A4A` w 200 ms.
- **Stopka:** linki, media społecznościowe, płatności, nagrody, sklepy i dane firmy. Numer telefonu i e-mail są aktywne.

### Sekcja CTA

- **Shader WebGL** rysuje złote fale w bezszwowej pętli 25 s, maksymalnie 30 kl./s. Bez WebGL widoczny jest gradient CSS.
- **Światło z drzwi** to osobna warstwa nad shaderem. Miękka smuga powoli rozszerza się i zwęża w lekko nieregularnym tempie.
- Obie animacje zatrzymują się poza ekranem i na ukrytej karcie.

### Dostępność

- Wszystkie kontrolki działają z klawiatury i mają widoczny fokus.
- Link „Przejdź do treści” pojawia się po pierwszym naciśnięciu Tab.
- Escape zamyka otwarty panel lub menu i przywraca fokus na przycisk.
- Przy `prefers-reduced-motion` autoplay, ruch lamp i wejście nagłówka są wyłączone. Shader pokazuje jedną klatkę, a drzwi zostają lekko uchylone.

## Architektura

```text
.
├── index.html                 Treść i znaczniki całej strony
├── src/
│   ├── styles/
│   │   ├── _tokens.scss       Kolory, typografia, odstępy i czasy animacji
│   │   └── main.scss          Style wszystkich sekcji
│   ├── js/
│   │   ├── main.js            Nagłówek, menu, złota linia i przewijanie
│   │   ├── hero.js            Slider, lampy i światło lamp
│   │   ├── shader.js          Animacja WebGL w sekcji CTA
│   │   └── door-light.js      Warstwa światła z drzwi
│   └── assets/                Ikony, logotypy, fonty i obrazy
├── dist/main.css              Skompilowany CSS, wersjonowany w repozytorium
├── scripts/build-site.mjs     Składa katalog produkcyjny _site
├── .github/workflows/static.yml  Wdrożenie na GitHub Pages
├── docs/design/               Wzorce wizualne i materiały referencyjne
├── figma-content.md           Treści, style i wytyczne odczytane z Figmy
└── CLAUDE.md                  Instrukcje dla asystenta AI
```

### Jak współpracują moduły

1. `index.html` ładuje `dist/main.css` oraz cztery klasyczne skrypty z atrybutem `defer`.
2. `src/styles/main.scss` importuje `_tokens.scss`. Tokeny trafiają też do zmiennych CSS w `:root`.
3. Skrypty nie importują się nawzajem. Znajdują swoje elementy przez atrybuty `data-*` i zmieniają klasy, atrybuty ARIA oraz transformacje.
4. `hero.js` odczytuje z CSS położenie i kąt każdej lampy (`--face-x`, `--face-y`, `--beam-rotate`), a potem w jednej klatce ustawia lampę, snop i plamę światła.
5. `door-light.js` rysuje na osobnym płótnie nad płótnem shadera i nie korzysta z jego kodu.
6. `scripts/build-site.mjs` czyta odwołania z HTML i CSS, po czym kopiuje tylko te pliki do `_site`.

| Atrybut | Element | Używa go |
|---|---|---|
| `data-header` | Nagłówek | `main.js` |
| `data-menu-toggle` | Przycisk menu mobilnego | `main.js` |
| `data-nav-item` | Pozycja z rozwijanym panelem | `main.js` |
| `data-nav-indicator` | Złota linia | `main.js` |
| `data-hero` | Sekcja hero | `main.js`, `hero.js` |
| `data-slide`, `data-segment` | Slajd i segment paska postępu | `hero.js` |
| `data-prev`, `data-next`, `data-pause` | Kontrolki slidera | `hero.js` |
| `data-lamp`, `data-pool` | Lampa i plama światła | `hero.js` |
| `data-shader` | Płótno WebGL | `shader.js` |
| `data-door-light` | Płótno światła z drzwi | `door-light.js` |

## Wymagania i konfiguracja

### Wymagania

- **Node.js 24 i npm 11.** Projekt sprawdzono na Node 24.16.0 i npm 11.13.0, a workflow używa Node 24.
- **Python 3** jest potrzebny tylko do opcjonalnego serwera lokalnego z przykładów.
- **Przeglądarka** musi obsługiwać m.in. CSS `:has()`, container queries i `ResizeObserver`. WebGL jest opcjonalny.

### Zależności deweloperskie

| Pakiet | Wersja | Rola |
|---|---|---|
| `sass` | 1.108.1 | Kompilacja SCSS do `dist/main.css` |
| `@fontsource-variable/red-hat-display` | 5.3.0 | Źródło fontu Red Hat Display |

Strona nie ma zależności uruchomieniowych ani zewnętrznych skryptów. Używane pliki fontu są skopiowane do `src/assets/fonts/`, więc `npm run build` ich nie aktualizuje.

### Zmienne środowiskowe

Projekt **nie używa zmiennych środowiskowych** ani plików `.env`, a do zbudowania i uruchomienia nie są potrzebne żadne sekrety.

Ustawienia znajdują się w kodzie:

| Co zmienić | Gdzie |
|---|---|
| Kolory, typografia, odstępy i czasy CSS | `src/styles/_tokens.scss` |
| Punkty przełamania 768 px i 1280 px | `$bp-md`, `$bp-lg` w `src/styles/main.scss` |
| Pozycje i kąty światła lamp | `.lamp--terracotta`, `.lamp--cream`, `.lamp--olive` w `src/styles/main.scss` |
| Ruch lamp i kształt skały | `MOTION`, `ROCK` w `src/js/hero.js` |
| Czas pętli shadera | `CYCLE_MS` w `src/js/shader.js` |
| Tempo i siła światła z drzwi | `CYCLE_MS`, `SHADOW`, `GLOW` w `src/js/door-light.js` |

## Praca lokalna i budowanie

| Polecenie | Działanie |
|---|---|
| `npm ci` | Instaluje dokładne wersje z `package-lock.json` |
| `npm run dev` | Obserwuje SCSS i na bieżąco kompiluje `dist/main.css` |
| `npm run build` | Tworzy skompresowany `dist/main.css` |
| `npm run build:site` | Buduje CSS i tworzy katalog produkcyjny `_site` |

Typowy cykl pracy:

1. Uruchom `npm run dev`.
2. Otwórz `index.html` w przeglądarce.
3. Edytuj HTML, SCSS lub JavaScript i odśwież stronę.
4. Przed commitem uruchom `npm run build`, ponieważ `dist/main.css` jest wersjonowany.

Katalog `_site` jest ignorowany przez Gita i przy każdym `npm run build:site` powstaje od nowa.

## Testowanie

**Repozytorium nie zawiera testów automatycznych ani polecenia `npm test`.** Przed zmianą sprawdź ręcznie:

1. `npm run build:site` kończy się bez błędu.
2. Strona działa przy szerokościach 320, 390, 768, 1024, 1280 i 1920 px, bez poziomego przewijania.
3. Konsola przeglądarki nie pokazuje błędów.
4. Menu, slider, pauza, lampy i kafelki działają myszą, klawiaturą i dotykiem.
5. Po włączeniu ograniczenia ruchu animacje automatyczne są zatrzymane.
6. Układ zgadza się ze wzorcami `docs/design/desktop-1920.png` i `docs/design/mobile-390.png`.

Wzorce pokazują wersję sprzed poprawki tekstu „Pobierz aplikację”, a przy porównaniu trzeba zatrzymać animacje i pominąć obszar shadera.

## Wdrożenie

Stronę publikuje workflow `.github/workflows/static.yml` na GitHub Pages:

1. Uruchamia się po każdym wypchnięciu na `main` albo ręcznie przez **Actions → Deploy static website to GitHub Pages → Run workflow**.
2. Instaluje zależności przez `npm ci` i wykonuje `npm run build:site`.
3. Publikuje wyłącznie katalog `_site`.

W nowym forku ustaw **Settings → Pages → Source: GitHub Actions**. Sekrety nie są potrzebne.

Do `_site` nie trafiają README, `CLAUDE.md`, `docs/`, źródła SCSS, `package.json` ani konfiguracja. Jeśli repozytorium jest publiczne, te pliki nadal można zobaczyć na GitHubie.

## Przykłady rozwoju

### Zmiana koloru akcentu

W `src/styles/_tokens.scss` zmień wartość:

```scss
$color-accent: #f2bf25;
```

Potem uruchom `npm run build`. Shader i światło z drzwi mają własne kolory, więc zaktualizuj też `GOLD` i `HOT` w `src/js/shader.js` oraz `GLOW` w `src/js/door-light.js`.

### Dodanie slajdu

W `index.html` dodaj slajd obok istniejących, wewnątrz `.hero__stage`:

```html
<div class="hero__slide" data-slide role="group" aria-roledescription="slajd" aria-label="3 z 3" inert>
  <img class="hero__image" src="src/assets/web/hero-3-1920.webp" alt="Opis zdjęcia" width="1920" height="1080">
</div>
```

W `.hero__progress`, przed przyciskiem pauzy, dodaj segment:

```html
<span data-segment><i></i></span>
```

Zaktualizuj też `aria-label` pozostałych slajdów. Zdjęcie powinno mieć proporcje 16:9.

### Dodanie pozycji do rozwijanego menu

W wybranym panelu dopisz element listy `.mega__links`:

```html
<li><a href="/kategoria">Nowa kategoria</a></li>
```

Opóźnione wejście jest zdefiniowane dla pierwszych siedmiu pozycji. Dla większej liczby zwiększ zakres pętli `@for $i from 1 through 7` w `src/styles/main.scss`.

## Decyzje projektowe

Figma zawiera tylko widok desktop 1920 px, dlatego poniższe zachowania są decyzjami implementacyjnymi:

- Wzorzec `docs/design/mobile-390.png` to zaakceptowany zrzut implementacji, a nie ramka z Figmy.
- Na telefonie wyszukiwarka zajmuje osobny wiersz, a zdjęcie hero przechodzi w ciemne tło pod tekstem.
- Poniżej 360 px skrót do konfiguratora znika z nagłówka, a link pozostaje w stopce.
- Na telefonie kafelki tworzą jedną kolumnę, a kafelek THORO ma gradient poprawiający kontrast tekstu.
- Tło hero odtworzono bez lamp, aby mogły poruszać się jako osobne warstwy.
- Dodano przycisk pauzy, którego nie ma w Figmie, aby użytkownik mógł zatrzymać automatyczny ruch.
- Kolor tekstu i filtr ikon w menu to wyjątki od zasady „animuj tylko transform i opacity”, bo wytyczna menu wprost wymaga przejścia z białego na czarny.
- Figma pokazuje strzałki przy Lampy, Kolory i Pomieszczenia, ale nie zawiera ich podmenu. Kategorie i układ paneli są propozycją do potwierdzenia.
- Górny pasek jest przypięty do ekranu. Poza hero ma białe tło, a na telefonie chowa wtedy wyszukiwarkę.
- Warstwa światła z drzwi dodaje delikatną poświatę w kolorze akcentu, ponieważ sam cień nie dawał widocznej smugi.
- W tekstach poprawiono „Wpsółpraca” na „Współpraca” oraz „Pobierz aplikacje” na „Pobierz aplikację”.

## Ograniczenia

- Większość linków prowadzi do `#`, bo projekt nie określa adresów. Działają tylko telefon i e-mail.
- Wyszukiwarka, koszyk, konto, konfigurator i przełączanie sklepów są elementami interfejsu bez logiki.
- Strony nie sprawdzono na fizycznym telefonie, w Safari ani w Firefoksie.
- Płynności animacji nie mierzono na sprzętowej karcie graficznej.
- Pozycje światła i kształt skały są dopasowane do obecnych obrazów, więc po ich wymianie trzeba je zmierzyć ponownie.
- Obrazy w `src/assets/web/` wygenerowano poza repozytorium. Nie ma skryptu, który odtworzy je ze źródeł.
- `scripts/build-site.mjs` wykrywa tylko pliki użyte w HTML i CSS. Plik wczytywany wyłącznie z JavaScriptu nie trafi do `_site`.
- Skrypty są klasyczne, a `main.js` deklaruje nazwy w zakresie globalnym, więc nowe skrypty nie mogą używać tych samych nazw, na przykład `header`.
- `docs/design/reference/shader-example.gif` jest wykluczony z Gita ze względu na rozmiar, dlatego nie ma go w świeżym klonie.

## Planowane

- Dodanie oczyszczonego zapisu rozmowy z AI w `transcript/`, razem z listą użytych skilli, pluginów i serwerów MCP.

## Przebieg pracy

Projekt powstał przy współpracy z Claude Code. Historię commitów uporządkowano po zakończeniu pierwszej wersji w logiczne etapy, dlatego daty części commitów są zbliżone.
