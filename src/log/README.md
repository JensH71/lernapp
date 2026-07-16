# Datenmodell — Lern-Inhalte (`src/inhalt/`)

Vier Ebenen im Duolingo-Muster: **Leitidee → Einheit → Skill → Lektion**
(Curriculum.md §1). Inhalt ist **reine Daten**; Prüfen liegt in `pruefung/`;
Fortschritt/Mastery kommt aus dem Log (`@/log`), nicht von hier.

## Dateien
| Datei | Rolle |
|---|---|
| `modell.ts` | Struktur-Typen + `Aufgabe`-Union (Typen 1–3) |
| `pruefung/term.ts` | Polynom-Normalizer für Term-Äquivalenz |
| `pruefung/pruefe.ts` | `pruefe(aufgabe, eingabe)` → richtig + fehlerkat + erklärung |
| `validierung.ts` | Dev-Check: ID-Eindeutigkeit, Struktur, Term-Lösungen |
| `kurse/rechensicherheit.ts` | erste Einheit (empfohlener Start) |
| `index.ts` | öffentliche API |

## Andocken an `@/log`
- **Geteiltes Vokabular:** `Aufgabentyp`, `Hilfsmittel`, `Fehlerkategorie`,
  `FehlerRegel` werden aus `@/log` importiert, nicht dupliziert. Richtung
  `inhalt → log`, kein Zyklus.
- **Klassifikation:** `pruefe(...)` liefert bei falscher Antwort die `fehlerkat`
  gleich mit (Choice: aus dem Distraktor; Zahl/Term: aus `fehlerRegeln`). Beim
  Loggen an `protokolliere({ …, fehlerkat })` durchreichen — dort hat das Feld
  **Vorrang** vor der eingebauten Heuristik. *(Dafür wurde `ProtokollEingabe` in
  `nutzungslog.ts` um das optionale `fehlerkat` erweitert.)*

## Prüfen (`pruefe`)
```ts
import { pruefe } from '@/inhalt';
const r = pruefe(aufgabe, { art: 'text', wert: '-27' }); // Zahl/Term
// { richtig, fehlerkat?, erklaerung?, antwortRoh }
pruefe(aufgabe, { art: 'auswahl', optionIds: ['b'] });    // Choice
```
- **Zahl:** Toleranz optional; deutsches Komma wird verstanden.
- **Term:** Polynom-Äquivalenz — `(a-b)^2` = `a^2-2ab+b^2`. Reichweite:
  ganzzahlige/rationale Koeffizienten, `+ − * / ^`, Klammern, unäres Minus,
  nicht-neg. ganze Exponenten, Division nur durch Konstante. Außerhalb (Wurzel,
  `sin`, Variable im Nenner, Dezimalkoeffizient) → Rückfall auf `akzeptiert`-Formen
  bzw. String-Vergleich. Für solche Fälle `akzeptiert: [...]` an der Aufgabe pflegen.

## Neue Aufgabentypen (4–7)
`lueckentext`/`matching`/`sortieren`/`graph` kommen als weiteres Union-Mitglied in
`modell.ts` **plus** ein `case` in `pruefe.ts` dazu — der `never`-Zweig dort
erzwingt den neuen Fall beim Compilieren.

## Dev-Validierung
```ts
import { validiereInhalt, fundament } from '@/inhalt';
const probleme = validiereInhalt([fundament]); // [] = ok
```

Verifiziert: `tsc --strict` sauber; Normalizer (23 Fälle) und `pruefe` gegen den
Seed-Content (15 Fälle) per Laufzeit-Check bestätigt.
