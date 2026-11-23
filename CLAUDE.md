# Zadanie rekrutacyjne: Programista Frontend + AI, IdoMods

Cel: zakodować landing page jednego produktu (SOLLUX) według Figmy. Działasz jako frontend developer.
Termin: 7 dni od otrzymania maila. Data maila: **do uzupełnienia przez autora zadania**.

## 1. Projekt w Figmie

- Oryginał: https://www.figma.com/design/0IEndSXVS1EK98fLXYNnYN/IdoMods-rekrutacja-frontend-AI?node-id=0-1
  Serwer MCP nie ma do niego dostępu, bo konto nie ma uprawnień edycji.
- Kopia robocza, używana przez MCP: https://www.figma.com/design/MnGSZ6AzTIoDZGit9hi6ox/IdoMods-rekrutacja-frontend-AI--Copy-?node-id=0-1
- Węzły: projekt `1:505`, wytyczne animacji `16:91`, lampy `1:1002`–`1:1004`, drugi slajd hero `1:1005`.
- Treści, style i wytyczne animacji są w `figma-content.md`. Tekst sekcji shader odczytano ze zrzutu, więc potwierdź go przed użyciem.
- Przed implementacją obejrzyj projekt: widoki, treści, typografię, odstępy i assety. Sprawdź też, czy istnieje widok mobilny.
- Pobierz assety do projektu. Linki Figma MCP wygasają po 7 dniach i nie mogą trafić do kodu.
- Jeśli stracisz dostęp do projektu, poproś o dostęp albo eksport ekranów i assetów. Nie zgaduj brakującej treści.

## 2. Stack

- Wybierz możliwie prosty stack. Jeśli wystarczą HTML, CSS i JavaScript, użyj ich bez frameworka i kroku budowania.
- Uwzględnij istniejącą konfigurację repozytorium, jeśli się pojawi. Na start nie ma żadnej.
- Zależność dodawaj tylko wtedy, gdy realnie upraszcza zadanie, i uzasadnij ją w README.

## 3. Implementacja i weryfikacja

- Odwzoruj projekt i stosuj wytyczne animacji z `figma-content.md`.
- Sprawdź stronę w przeglądarce na telefonie i desktopie, porównując ją z projektem.
- Sprawdź nawigację klawiaturą, widoczny fokus, wszystkie linki i główne CTA.
- Gdy Figma nie określa zachowania na danym ekranie, podejmij rozsądną decyzję i dopisz ją do sekcji „Decyzje projektowe” w README.
- Raportuj tylko to, co faktycznie sprawdzono. Niesprawdzone elementy nazwij wprost.

## 4. README

- Dodaj README z wymaganiami i dokładną instrukcją uruchomienia od zera.
- Przed oddaniem wykonaj tę instrukcję na czystej kopii projektu i potwierdź, że strona działa.

## 5. Zapis rozmowy z AI

- Zachowuj pełny zapis od początku pracy, w tym wiadomość z tymi wymaganiami.
- Claude Code zapisuje każdą sesję w osobnym pliku JSONL. Identyfikatory sesji i lokalne ścieżki trzymaj w prywatnej pamięci projektu, nigdy w repozytorium.
- Nie edytuj ani nie usuwaj oryginałów. Surową kopię trzymaj poza repozytorium.
- Format do przekazania: JSONL, po oczyszczeniu kopii w `transcript/`.
- Zapisz w `transcript/README.md` użyte skille, pluginy i serwery MCP w zakresie widocznym w sesji. Na start: serwer MCP `figma` dodany przez użytkownika oraz instrukcja `figma-design-to-code` wczytana z jego zasobów.
- Jeśli czegoś nie da się ustalić lub wyeksportować automatycznie, powiedz o tym użytkownikowi od razu.
- Przed przekazaniem usuń z kopii sekrety oraz dane osobowe niezwiązane z zadaniem, w tym e-mail, identyfikatory kont i organizacji, tokeny, adresy podpisanych zasobów i lokalne ścieżki. Sprawdź wynik wyszukiwaniem tych wartości.

## 6. Oddanie

- Przygotuj kod, README i oczyszczony zapis rozmowy.
- Gdy użytkownik wybierze sposób udostępnienia, sprawdź dostęp dla rekruterów, najlepiej bez zalogowania na konto autora.
- **Publikacja i wysłanie odpowiedzi należą do użytkownika.** Nie publikuj, nie wysyłaj i nie wypychaj kodu do zdalnego repozytorium bez wyraźnego polecenia.
