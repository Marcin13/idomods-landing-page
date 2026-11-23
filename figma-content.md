# SOLLUX landing page: treść z Figmy

Źródło: plik `MnGSZ6AzTIoDZGit9hi6ox` (kopia), strona `0:1` „Landing Page”.
Projekt: ramka `1:505`, 1920 x 4048 px. Wytyczne: ramka `16:91`.

## Wytyczne animacji

### 01 Zasady ogólne
- Krótkie interakcje (hover): 200–250 ms; większe ruchy: 500–800 ms
- Jeden easing wszędzie: ease-in-out (`cubic-bezier(0.4, 0, 0.2, 1)`), ease-out dla powiększeń
- Animuj tylko transform i opacity

### 02 Menu
Na hover w menu, zmiana tła na czyste białe tło + zmiana kolorów elementów na czarne, dla zachowania kontrastu.
- Tło nagłówka: przezroczyste → #FFFFFF, 250 ms, ease-in-out
- Kolor tekstu, ikon i logo: biały → czarny, 250 ms, ease-in-out (ten sam timing co tło, żeby zmiana była jednoczesna)
- Powrót po zjechaniu kursorem: 250 ms, ease-in-out

### 03 Lampy w hero
Pokaż swoją kreatywność w animacji, np. włączanie lampy po wciśnięciu na nią, ruszające się lampy przy ruszaniu kursorem.

### 04 Slider
Automatyczny slider ze zmianą obrazu, delay 3s.
- Autoplay co 3 s, crossfade między slajdami: 600 ms, ease-in-out
- Lekki scale obrazu 1.05 → 1.0 w trakcie przejścia (800 ms, ease-out)
- Pasek postępu (żółty) wypełnia się liniowo przez 3 s, reset po zmianie slajdu

### 05 Kafelki
Na hover, gdy najeżdżamy na pojedynczy kafelek:
- animacja powiększania obrazu +10%
- zmiana koloru czarnego przycisku na szary
- Obraz: scale 1 → 1.1, 500 ms, ease-out (overflow hidden na kafelku)
- Przycisk: tło czarny → szary (#4A4A4A), 200 ms, ease-in-out

### 06 Sekcja shader
Dodanie animacji typu shader.

Uwagi: przesłany przykład to gif, w którym animacja się ucina. Docelowo animacja ma działać bez zacięcia, w ciągłej płynności.
- Płynna pętla bez cięć, animacja ciągła (nieskończony loop, bez widocznego początku/końca)
- Wolne tempo, ok. 20–30 s na cykl, ruch falujący (ease-in-out / noise-based)
- Realizacja jako WebGL/shader w czasie rzeczywistym, nie GIF/wideo, żeby uniknąć zacięcia na pętli
- Tekst i przycisk statyczne, nad animacją

## Treść strony

### Nawigacja
- Linki: Lampy ▾, Kolory ▾, Pomieszczenia ▾, Nowości, Bestsellery, Promocje
- Wyszukiwarka: Czego szukasz?
- Przycisk: Stwórz swoją lampę
- Ikony: konto, koszyk

### Hero (1080 px)
- Nadtytuł: Bestsellery SOLLUX
- Tytuł: Kolor i forma / w nowym świetle
- Przycisk: Sprawdź bestsellery
- Ocena: 4.8, Uwielbiany przez klientów
- Strzałki slidera, pasek postępu z 2 segmentami

### Korzyści
| Tytuł | Podtytuł |
|---|---|
| Zwroty nawet do 100 dni | szybkie i proste |
| 5 lat gwarancji | na wszystkie produkty |
| Darmowa dostawa | już za 299 zł |
| Polskie produkty | sprawdzona jakość |
| Oficjalny sklep producenta | gwarancja satysfakcji |

### Kafelki
| Kafelek | Rozmiar | Tło | Nadtytuł | Tytuł | Przycisk |
|---|---|---|---|---|---|
| THORO | 648 x 518 | zdjęcie | Marka THORO | Poznaj lampy premium | Odwiedź sklep THORO |
| Konfigurator | 936 x 518 | #72A3F3 | Konfigurator 3D | Wybierz projekt i dostosuj go do swojego wnętrza | Stwórz swój projekt |
| Katalog | 936 x 518 | #FDF8EB | Katalog | Odkryj najnowszy katalog | Sprawdź katalog |
| SOLLUX SMART | 648 x 518 | #E8E4DF | SOLLUX SMART | Przymierz lampę w aplikacji | Pobierz aplikacje na telefon |

### Sekcja shader (1920 x 835)
Ta sekcja jest w Figmie obrazem. Tekst odczytano z oryginału 2560 x 1305 (`docs/design/reference/shader-section.png`).
- Tytuł: Twoje wnętrze zasługuje na wyjątkowe światło
- Przycisk: Kup teraz
- Podpis: Od 119 zł na oficjalnej stronie producenta SOLLUX

### Stopka
- **Moje zamówienia:** Status zamówienia, Śledzenie przesyłki, Chcę zareklamować produkt, Informacje o wymianie, Kontakt
- **Moje konto:** Zarejestruj się, Koszyk, Listy zakupowe, Lista zakupionych produktów, Historia transakcji, Moje rabaty
- **Regulaminy:** Sposoby wysyłki, Sposoby płatności, Regulamin sklepu, Polityka prywatności, Polityka bezpieczeństwa, Zmień ustawienia ciasteczek
- **Informacje:** O nas, FAQ, Kurs światła, Inspiracje, Marka premium, Gwarancja, Konfigurator 3D
- **Współpraca** (w Figmie literówka „Wpsółpraca”): Dla Architekta, Modele 3D, Dystrybucja
- **Sekcje z logotypami:** Płatności i dostawy (10), Nagrody (6), Nasze sklepy (8 flag)
- **Social media:** Facebook, Instagram, TikTok, YouTube
- W sklepie prezentujemy ceny brutto (z VAT). Stawki VAT dla konsumentów z kraju: Polska.
- NIP: 6070082443
- +48 668 806 323 (Pn - Pt 7:00 - 15:00)
- sklep@sollux.pl
- Sollux Lighting Sp. z o.o.
- Władysława Łokietka 35, 64-840 Budzyń (POLSKA)

## Style

Plik nie definiuje zmiennych Figmy, więc poniższe wartości pochodzą bezpośrednio z warstw.

### Kolory
| Rola | Wartość |
|---|---|
| Akcent, CTA, postęp | #F2BF25 |
| Tekst na akcencie, tekst stopki | #1E1E1E |
| Czarny, przyciski, nagłówki | #101011 |
| Hover przycisku | #4A4A4A |
| Obramowania | #E7E7E7 |
| Tło strony | #FFFFFF |
| Przyciski okrągłe w hero | rgba(16,16,17,.2) |
| Odznaka oceny | rgba(16,16,17,.4) |
| Nieaktywny segment postępu | rgba(231,231,231,.5) |

### Typografia: Red Hat Display
| Element | Rozmiar | Grubość | Interlinia |
|---|---|---|---|
| Tytuł hero | 56 px | 700 | 1 |
| Tytuł kafelka | 32 px | 700 | 1.1 |
| Nadtytuł kafelka, tytuł korzyści | 21 px | 700 | 1.1 |
| Przycisk | 16 px | 700 | 1.2 |
| Nadtytuł hero | 16 px | 500 | 1.2 |
| Nawigacja | 14 px | 700 | 1.2 |
| Podtytuł korzyści | 14 px | 500 | 1.2 |
| Linki stopki | 13 px | 500 | 1.1 |
| Nagłówki stopki | 13 px | 700 | 1.1 |
| Dane firmy | 12 px | 500 | 1.1 |

### Układ
- Kontener: maks. 1600 px, marginesy boczne 16 px
- Sekcja korzyści: padding pionowy 86 px, odstęp do siatki 64 px, 5 kolumn z odstępem 32 px
- Siatka kafelków: odstęp 16 px, promień 24 px, padding treści 48 px
- Przyciski: padding 16 px / 24 px, pełne zaokrąglenie
- Przyciski okrągłe: 48 px

## Warstwy poza głównym projektem
- `1:1004` lampa1 (372 x 419)
- `1:1003` lampa2 (470 x 428)
- `1:1002` lampa3 (423 x 393)
- `1:1005` HERO Baner2 (1920 x 1080), prawdopodobnie drugi slajd
