// ---------------------------------------------------------------------------
// Nutzungslog · Event-Schema
// ---------------------------------------------------------------------------
// Grundprinzip: Wir speichern ROHE Events, keine vorab aggregierten Kennzahlen.
// Jeder Aufgabendurchlauf ist ein append-only Ereignis; alle KPIs werden beim
// Lesen daraus abgeleitet (siehe derive.ts). Das hält den Feedback-Loop
// nachträglich re-interpretierbar: Schwierigkeits-/Wiederholungslogik lässt sich
// ändern, ohne Historie zu verlieren.
// ---------------------------------------------------------------------------

/** Schema-Version des Event-Formats. Bei Format-Änderungen hochzählen und in
 *  store.ts eine Migration ergänzen. Historie bleibt so lesbar. */
export const LOG_SCHEMA_VERSION = 1;

/** Aufgabentypen — deckungsgleich mit Curriculum.md §3. */
export type Aufgabentyp =
  | 'choice'
  | 'zahl'
  | 'term'
  | 'lueckentext'
  | 'matching'
  | 'sortieren'
  | 'graph';

/** Pflichtteil (ohne) vs. Teil mit Hilfsmittel (WTR: TI-30X Plus MathPrint). */
export type Hilfsmittel = 'ohne' | 'wtr';

/** Ausgang eines Durchlaufs. skip/abbruch fließen NICHT in die Trefferquote,
 *  werden aber fürs Pacing ausgewertet. */
export type Ausgang = 'richtig' | 'falsch' | 'skip' | 'abbruch';

/**
 * Fehlerkategorie — der eigentliche Hebel, um auf Aglajas Schwächen zu
 * optimieren. Mappt 1:1 auf die bestätigten Lücken (Curriculum.md, Phase 0).
 * 'fluechtigkeit' = korrektes Verfahren, Ausrutscher; 'unklar' = nicht
 * zuordenbar.
 */
export type Fehlerkategorie =
  | 'vorzeichen'
  | 'potenz'
  | 'binomisch'
  | 'substitution'
  | 'definitionsmenge'
  | 'umformung'
  | 'ablesen'
  | 'fluechtigkeit'
  | 'unklar';

/** Ein einzelner protokollierter Aufgabendurchlauf. */
export interface AufgabenEvent {
  /** Primärschlüssel (UUID) im IndexedDB-Store. */
  id: string;
  /** Zeitstempel (ms seit Epoch). */
  ts: number;
  skillId: string;
  aufgabeId: string;
  typ: Aufgabentyp;
  hilfsmittel: Hilfsmittel;
  /** Anleitungsgrad zum Zeitpunkt (0 = stark geführt … höher = frei). */
  kronenLevel: number;
  ausgang: Ausgang;
  /** Die konkrete (Fehl-)Eingabe — Gold für die Fehler-Klassifikation. */
  antwortRoh?: string;
  /** Aus antwortRoh abgeleitet (nur bei ausgang === 'falsch'). */
  fehlerkat?: Fehlerkategorie;
  /** n-ter Versuch an diesem Item innerhalb der Session (1-basiert). */
  versuchNr: number;
  /** ms bis zur ersten Eingabe (Zögern/„leerer Blick"). */
  tErstEingabe?: number;
  /** ms bis zum Absenden. */
  tGesamt: number;
  /** Kam die Aufgabe aus Fehler-Eimer / Verblassung zurück? */
  wiederholung: boolean;
  /** Freie Item-Tags (z. B. adressierter Denkfehler) — roh gespeichert, KPI-Ableitung später. */
  tags?: string[];
}
