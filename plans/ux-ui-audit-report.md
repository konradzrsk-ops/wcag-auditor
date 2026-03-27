# Raport Audytu UX/UI - WCAG Auditor

**Data audytu:** 2026-03-26  
**Zakres:** src/App.tsx (~5000 linii, 40+ komponentów)  
**Metodologia:** Analiza kodu źródłowego, identyfikacja wzorców

---

## Podsumowanie Krytycznych Problemów

| Kategoria | Liczba wystąpień | Poziom niespójności |
|-----------|------------------|---------------------|
| Zaokrąglenia (rounded) | 172 | 🔴 Krytyczny |
| Paddingi (px/py/p) | 300+ | 🔴 Krytyczny |
| Przyciski | 45+ wariantów | 🔴 Krytyczny |
| Inputy/Selecty | 12+ wariantów | 🟡 Wysoki |
| Badge | 8+ wariantów | 🟡 Wysoki |
| Cienie (shadow) | 6+ wariantów | 🟡 Wysoki |

---

## 1. Niespójności w Zaokrągleniach (rounded)

### Znalezione warianty:
- `rounded-xl` - 48 wystąpień
- `rounded-lg` - 124 wystąpień
- `rounded-2xl` - 15 wystąpień
- `rounded-md` - 3 wystąpienia
- `rounded-full` - 25 wystąpień

### Problemy szczegółowe:

#### Przyciski:
```
rounded-xl: 1719, 1886, 1890, 2354, 2560, 2564, 2978, 2982...
rounded-lg: 3375 (SubNavButton)
```

#### Inputy/Selecty:
```
rounded-xl: 1365, 2262, 2958, 2969, 3518, 4777...
rounded-lg: 2262 (audytorzy), 3567 (audytorzy w raportowaniu)
```

#### Cardy:
```
rounded-2xl: 1297 (komponent Card)
rounded-xl: 2604, 2617, 2630, 2643 (ikony w kartach)
```

#### Badge:
```
rounded-lg: 1317, 1353
rounded-md: 2459, 2917, 3067
rounded-full: 1728, 1662
```

### Rekomendacja:
**Używać tylko `rounded-xl` (16px)** dla wszystkich elementów interaktywnych i kontenerów.

---

## 2. Niespójności w Przyciskach

### Paddingi pionowe (py):
- `py-2` - 1219, 2364, 2670, 2758
- `py-2.5` - 1379, 1719, 1886, 1890, 2560, 2564, 2874, 3148...
- `py-3` - 2354, 3648
- `py-3.5` - 2978, 2982
- `py-4` - 516 (logowanie)

### Paddingi poziome (px):
- `px-4` - 537, 567, 1719, 2670, 2758, 2978, 3214...
- `px-5` - 1719, 1886, 1890, 2560, 2564, 2874, 5756...
- `px-6` - 2978

### Style wizualne:
```
// Primary (niebieski)
bg-[#0038F8] hover:bg-[#002ECC] - 1719, 1886, 1890, 2354...

// Secondary (biały)
bg-white border border-slate-200 - 1885, 2560, 3214...

// Tertiary (tekstowy)
text-slate-500 hover:text-slate-700 - 2364, 3660
```

### Rekomendacja:
**Trzy standardowe warianty przycisków:**

```tsx
// Primary
px-5 py-2.5 rounded-xl bg-[#0038F8] hover:bg-[#002ECC] text-white font-bold shadow-sm

// Secondary
px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold shadow-sm

// Tertiary
px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 font-bold
```

---

## 3. Niespójności w Inputach i Selectach

### Inputy:
```
// Wariant 1 (logowanie)
pl-12 pr-4 py-3.5 rounded-xl - 456, 484

// Wariant 2 (filtry)
pl-11 pr-4 py-3.5 rounded-xl - 1366

// Wariant 3 (sidebar)
px-4 py-3.5 rounded-xl - 1366
```

### Selecty:
```
// Wariant 1 (raporty)
px-3 py-2.5 rounded-lg - 2262, 3518

// Wariant 2 (raportowanie)
px-2 py-1.5 rounded-lg - 3567

// Wariant 3 (baza usług)
px-4 py-3.5 rounded-xl - 2958, 2969

// Wariant 4 (raportowanie - sortowanie)
px-4 py-2.5 rounded-xl - 3928, 4490
```

### Rekomendacja:
**Jeden standardowy input:**
```tsx
w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50
```

---

## 4. Niespójności w Badge'ach

### Rozmiary tekstu:
- `text-[10px]` - 1186, 2459, 3067, 3716
- `text-[11px]` - 1271, 1838, 2030, 4092
- `text-xs` - 1317, 1353, 2544

### Paddingi:
- `px-2 py-0.5` - 939, 1189, 1326, 2917
- `px-2.5 py-0.5` - 1326
- `px-3 py-1` - 2544, 2548
- `px-3 py-1.5` - 1317

### Zaokrąglenia:
- `rounded-lg` - 1317, 1353
- `rounded-md` - 2459, 2917, 3067
- `rounded-full` - 1728, 1662

### Rekomendacja:
**Uproszczony komponent Badge z wariantami:**
```tsx
// success, warning, danger, info, neutral, lightBlue
px-2.5 py-1 rounded-lg text-xs font-semibold
```

---

## 5. Niespójności w Cardach

### Zaokrąglenia:
- `rounded-2xl` - 1297 (komponent Card)
- `rounded-xl` - 2604, 2617, 2630, 2643 (ikony wewnątrz)

### Cienie:
- `shadow-sm` - 1297 (komponent Card)
- `shadow-md` - 1798 (ProcessCard hover)
- `shadow-lg` - 1039 (tooltip)
- `shadow-xl` - 833 (dropdown)

### Paddingi:
- `p-4` - 2395, 2603, 2678
- `p-5` - 1798
- `p-6` - 907, 1297 (domyślny Card)

### Rekomendacja:
```tsx
// Standardowy Card
bg-white rounded-2xl shadow-sm border border-slate-200 p-6

// Card z hover
hover:shadow-md transition-shadow
```

---

## 6. Niespójności w Sidebar/Filtrach

### Nagłówki sidebar:
```
// Raporty
p-4 md:p-6 - 2180

// Raportowanie
p-4 md:p-6 - 3420
```

### Inputy w filtrach:
```
// Raporty - select
px-3 py-2.5 rounded-lg - 2262

// Raportowanie - select
px-2 py-1.5 rounded-lg - 3567

// Raportowanie - input daty
px-2 py-1.5 rounded-lg - 3793, 3798
```

### Przyciski akcji:
```
// Raporty - Szukaj
py-2.5 md:py-3 rounded-xl - 2354

// Raporty - Wyczyść
py-2 rounded-xl - 2364

// Raportowanie - Generuj
py-2.5 md:py-3 rounded-xl - 3648

// Raportowanie - Wyczyść
py-2 rounded-xl - 3659
```

### Rekomendacja:
**Sidebar filtrów powinien używać tych samych komponentów co reszta aplikacji.**

---

## 7. Niespójności w Tabelach i Listach

### Nagłówki tabel:
```
// Raport-bledy
px-4 py-4 - 4315

// Baza-bledow
px-5 py-4 - 4970

// SLA
px-6 py-4 - 5498
```

### Wiersze:
```
// Standardowe
p-3 rounded-xl - 1179, 1247

// Z border
p-3 rounded-xl border border-slate-100 - 1179

// Bez border
p-3 rounded-xl border border-transparent - 1247
```

### Rekomendacja:
```tsx
// Nagłówek tabeli
px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider

// Wiersz
px-5 py-4 hover:bg-slate-50 transition-colors
```

---

## 8. Niespójności w Kolorach

### Niebieski (Primary):
- `#0038F8` - główny niebieski
- `#002ECC` - hover
- `#001766` - ciemny (gradient)

### Szarości (Slate):
- `slate-50` - tła
- `slate-100` - borderki, tła
- `slate-200` - borderki
- `slate-400` - tekst pomocniczy
- `slate-500` - tekst
- `slate-600` - tekst
- `slate-700` - tekst główny
- `slate-800` - tekst nagłówków
- `slate-900` - tekst nagłówków

### Status colors:
- `emerald-500` - sukces
- `amber-500` - ostrzeżenie
- `red-500` - błąd/danger

### Problemy:
- Mieszanie `slate-700` i `slate-800` dla nagłówków
- Różne odcienie tła dla hover (`slate-50`, `blue-50`, `[#0038F8]/5`)

### Rekomendacja:
```
Tekst główny: slate-900
Tekst drugorzędny: slate-600
Tekst pomocniczy: slate-400
Border: slate-200
Tło hover: slate-50
Primary: #0038F8
```

---

## 9. Niespójności w Typografii

### Rozmiary nagłówków:
```
text-[24px] sm:text-[32px] - 1716, 1877, 2209, 3210
text-[15px] sm:text-[17px] - 1965
text-[16px] sm:text-[18px] - 2764
text-[15px] md:text-lg - 2209, 3449
```

### Rozmiary tekstu:
```
text-[10px] - 939, 1186, 2459
text-[11px] - 939, 1199, 1271, 1662
text-[12px] - 1179, 2466
text-[13px] - 1195, 1219
text-sm - 456, 516
```

### Rekomendacja:
```
H1: text-[32px] font-extrabold text-slate-900
H2: text-[24px] font-bold text-slate-900
H3: text-[18px] font-bold text-slate-900
Body: text-sm text-slate-700
Small: text-xs text-slate-500
```

---

## 10. Niespójności w Odstępach (Gap/Space)

### Gapy w gridach:
```
gap-4 - 905, 996
gap-6 - 905, 996
sm:gap-6 - 905
```

### Gapy w flex:
```
gap-2 - 1031, 1059
gap-3 - 747, 1148
gap-4 - 1801, 1959
gap-6 - 1959
```

### Rekomendacja:
```
Małe elementy: gap-2, gap-3
Średnie sekcje: gap-4
Duże sekcje: gap-6
Padding sekcji: p-6
Padding komponentów: p-4, p-5
```

---

## Priorytety Implementacji

### 🔴 Krytyczny (P0) - Natychmiast
1. Ujednolicenie zaokrągleń do `rounded-xl`
2. Ujednolicenie przycisków (3 warianty)
3. Ujednolicenie inputów/selectów

### 🟡 Wysoki (P1) - W tym sprincie
4. Ujednolicenie badge'ów
5. Ujednolicenie paddingów w tabelach
6. Ujednolicenie kolorów tekstu

### 🟢 Średni (P2) - Następny sprint
7. Ujednolicenie cieni
8. Ujednolicenie odstępów (gap)
9. Refaktoryzacja duplikowanych komponentów

### ⚪ Niski (P3) - Backlog
10. Dokumentacja Design System
11. Storybook dla komponentów
12. Testy wizualne

---

## Rekomendowana Architektura Design System

### Komponenty bazowe do wydzielenia:

```
/components
  /ui
    Button.tsx         // 3 warianty: primary, secondary, tertiary
    Input.tsx          // 1 wariant z opcjonalnym icon
    Select.tsx         // 1 wariant
    Badge.tsx          // 6 wariantów kolorystycznych
    Card.tsx           // 1 wariant z opcjami
    Checkbox.tsx       // 1 wariant
    Accordion.tsx      // 1 wariant
  /layout
    Sidebar.tsx        // Reużywalny sidebar
    Header.tsx         // Nagłówek sekcji
    Table.tsx          // Tabela z sortowaniem
    FilterSection.tsx  // Sekcja filtrów
```

### Style guide:

```css
/* Zaokrąglenia */
--radius-sm: 8px;    /* rounded-lg */
--radius-md: 12px;   /* rounded-xl */
--radius-lg: 16px;   /* rounded-2xl */

/* Użycie:
   - rounded-xl: wszystkie elementy interaktywne
   - rounded-2xl: cardy
   - rounded-lg: małe elementy (badge, tag)
*/

/* Kolory */
--color-primary: #0038F8;
--color-primary-hover: #002ECC;
--color-text-primary: #0f172a; /* slate-900 */
--color-text-secondary: #475569; /* slate-600 */
--color-text-tertiary: #94a3b8; /* slate-400 */
--color-border: #e2e8f0; /* slate-200 */
--color-bg-hover: #f8fafc; /* slate-50 */

/* Paddingi */
--padding-button: 10px 20px; /* py-2.5 px-5 */
--padding-input: 12px 16px;  /* py-3 px-4 */
--padding-card: 24px;        /* p-6 */

/* Cienie */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
```

---

## Szacunkowy nakład pracy

| Zadanie | Szacunkowy czas |
|---------|-----------------|
| Stworzenie komponentów bazowych (Button, Input, Badge, Card) | 4h |
| Refaktoryzacja wszystkich przycisków w aplikacji | 3h |
| Refaktoryzacja inputów/selectów | 2h |
| Ujednolicenie badge'ów | 1h |
| Ujednolicenie tabel i list | 2h |
| Testowanie i poprawki | 2h |
| **Razem** | **~14h** |

---

## Wnioski

Aplikacja wymaga kompleksowej refaktoryzacji UI. Główne problemy to:

1. **Brak Design System** - każdy komponent jest stylowany indywidualnie
2. **Duplikacja kodu** - te same wzorce powtarzane w wielu miejscach
3. **Niespójne wartości** - 172 różne użycia zaokrągleń, 300+ paddingów
4. **Brak komponentów reużywalnych** - Card, Badge są zdefiniowane ale niekonsekwentnie używane

**Rekomendacja:** Implementacja zaproponowanego Design System w 4 fazach, zaczynając od komponentów krytycznych (P0).
