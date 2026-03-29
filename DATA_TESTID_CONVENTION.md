# Konwencja data-testid w projekcie WCAG Auditor

## Wprowadzenie

Atrybuty `data-testid` zostały dodane do kluczowych elementów interfejsu, aby ułatwić ich identyfikację podczas pisania poleceń zmian. Dzięki temu możesz precyzyjnie wskazać, który element ma zostać zmodyfikowany.

## Konwencja nazewnictwa

Format: `data-testid="nazwa-elementu"`

### Główne zasady:
1. **Nazwy w języku angielskim** - używamy nazw angielskich dla spójności
2. **Format kebab-case** - słowa oddzielone myślnikami (np. `login-form`, `sidebar-menu`)
3. **Hierarchiczna struktura** - nazwy odzwierciedlają strukturę komponentów
4. **Opisowość** - nazwy jasno opisują, co dany element reprezentuje

## Lista dodanych atrybutów data-testid

### Komponenty główne aplikacji:
- `app-container` - główny kontener aplikacji
- `mobile-header` - nagłówek mobilny
- `main-content` - główna zawartość strony
- `sidebar` - panel boczny (desktopowy)
- `dashboard-view` - widok głównego dashboardu

### Ekran logowania:
- `login-view` - kontener ekranu logowania
- `login-form-container` - kontener formularza logowania
- `login-form` - sam formularz logowania
- `login-email-input` - pole wprowadzania emaila
- `login-password-input` - pole wprowadzania hasła
- `login-submit-button` - przycisk logowania

### Komponenty UI (wielokrotnego użytku):
- `card` - komponent Card
- `badge` - komponent Badge
- `priority-badge` - komponent PriorityBadge
- `input-container` - kontener pola input
- `input` - pole input
- `show-more-toggle` - przycisk "Pokaż więcej"
- `priority-stats` - statystyki priorytetów
- `priority-critical` - licznik błędów krytycznych
- `priority-important` - licznek błędów ważnych
- `priority-marginal` - licznik błędów marginalnych

### Widoki Bazy Usług:
- `baza-uslug-container` - kontener bazy usług
- `process-list-view` - widok listy procesów
- `process-details-view` - widok szczegółów procesu
- `process-card` - karta procesu
- `step-item` - element kroku procesu

### Widok Audytów (Raporty):
- `raporty-view` - główny widok audytów
- `report-summary-view` - widok podsumowania raportu
- `report-errors-view` - widok błędów raportu
- `report-card` - karta raportu
- `tested-element-item` - element testowany

### Moduł Raportowania:
- `reporting-module-view` - główny moduł raportowania
- `audit-report-view` - widok raportu audytów
- `audit-node` - węzeł audytu
- `audit-view-node` - węzeł widoku audytu
- `audit-errors-report-view` - widok raportu błędów audytów
- `audit-error-table-row` - wiersz tabeli błędów audytu

### Raport Operacyjny:
- `operational-report` - raport operacyjny
- `service-node` - węzeł usługi
- `process-node` - węzeł procesu
- `view-node` - węzeł widoku

### Raport Postępu:
- `progress-report` - raport postępu
- `progress-service-node` - węzeł usługi w raporcie postępu
- `progress-process-node` - węzeł procesu w raporcie postępu
- `sparkline-chart` - wykres sparkline

### Raport Błędów Usług:
- `services-error-report` - raport błędów usług
- `service-error-table-row` - wiersz tabeli błędów usługi

### Raport Zarządczy:
- `management-report` - raport zarządczy

### Raport Regulacyjny:
- `regulatory-report-view` - widok raportu regulacyjnego

### Komponenty Filtrów:
- `filter-accordion` - akordeon filtra
- `filter-checkbox` - pole wyboru filtra
- `filter-date-range` - zakres dat filtra
- `filter-number-range` - zakres liczbowy filtra

### Inne Komponenty:
- `error-accordion-item` - element akordeonu błędu

## Jak używać data-testid w poleceniach zmian

### Przykład 1: Zmiana koloru przycisku logowania
```
Zmień kolor przycisku logowania na zielony.
Element: login-submit-button
```

### Przykład 2: Dodanie nowego pola formularza
```
Dodaj pole "Imię" przed polem email w formularzu logowania.
Element: login-form
```

### Przykład 3: Zmiana stylu karty
```
Zmień obramowanie wszystkich kart na czerwone.
Element: card
```

### Przykład 4: Modyfikacja nagłówka mobilnego
```
Dodaj logo po lewej stronie nagłówka mobilnego.
Element: mobile-header
```

## Korzyści z używania data-testid

1. **Precyzyjna identyfikacja** - jednoznaczne wskazanie elementu do modyfikacji
2. **Czytelność** - nazwy są zrozumiałe dla osób nietechnicznych
3. **Stabilność** - data-testid nie zmienia się przy modyfikacjach CSS czy struktury
4. **Testowalność** - ułatwia pisanie testów automatycznych
5. **Dokumentacja** - służy jako dokumentacja struktury interfejsu

## Dodawanie nowych data-testid

Przy dodawaniu nowych komponentów, stosuj się do następujących zasad:

1. **Dodaj data-testid do głównego elementu komponentu**
2. **Użyj opisowej nazwy w formacie kebab-case**
3. **Dodaj data-testid do kluczowych elementów wewnętrznych** (przyciski, formularze, ważne sekcje)
4. **Aktualizuj tę dokumentację** po dodaniu nowych atrybutów

## Przykłady implementacji

### Przed dodaniem data-testid:
```jsx
function LoginButton() {
  return (
    <button className="login-btn">
      Zaloguj się
    </button>
  );
}
```

### Po dodaniu data-testid:
```jsx
function LoginButton() {
  return (
    <button 
      data-testid="login-submit-button"
      className="login-btn"
    >
      Zaloguj się
    </button>
  );
}
```

## Wzorce dynamicznych identyfikatorów

Niektóre komponenty generują dynamiczne identyfikatory na podstawie swoich właściwości:

### TreeItem
Komponent `TreeItem` generuje identyfikator na podstawie tytułu elementu:
```
data-testid="tree-item-{title}"
```

Gdzie `{title}` to tytuł elementu przekształcony na małe litery z spacjami zamienionymi na myślniki.

**Przykłady:**
- `tree-item-przelew-krajowy`
- `tree-item-przelew-sepa`
- `tree-item-zlecenie-stale-zalorzenie`

## Podsumowanie

Dzięki zastosowaniu atrybutów `data-testid`, proces identyfikacji elementów do modyfikacji stał się znacznie prostszy i bardziej precyzyjny. Każdy kluczowy element interfejsu ma teraz unikalny identyfikator, który można łatwo wskazać w poleceniach zmian.
