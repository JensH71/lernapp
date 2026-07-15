/**
 * Datenmodell für die Lern-Inhalte (Curriculum §1 & §3).
 *
 *   Leitidee → Einheit → Skill → Lektion → Aufgabe
 *
 * Eine Lektion = 5–8 Aufgaben (~3–5 Min). Ein Skill hat mehrere Kronen-Level,
 * die von "stark angeleitet" zu "frei" werden (Krone 1 mit Hinweisen, höher ohne).
 *
 * KONVENTIONEN
 * ------------
 * - `frage` / Optionstexte: Anzeigetext. Unicode-Hochzahlen und echtes Minus (−)
 *   sind erlaubt und erwünscht (z. B. "(−3)³", "x⁸").
 * - `loesung` bei Term-Eingabe: normalisierer-freundliche ASCII-Syntax mit
 *   `^` = Potenz, `*` = Mal, `/` = geteilt (z. B. "x^8", "8*a^3", "-x^3").
 *   Der Vergleich läuft über den symbolischen Normalisierer aus dem
 *   Einstufungstest — NICHT Zeichen-für-Zeichen. Bei Formen, die der
 *   Normalisierer (noch) nicht kann (mehrere Variablen, Brüche), lieber
 *   single-choice verwenden.
 * - `hilfsmittel` steuert den A-/B-Teil-Tag. Fehlt es, gilt "ohne".
 *   Diese erste Einheit ist komplett "ohne".
 */

/** Teil A der Abiturprüfung = "ohne", Teil B = "wtr" (TI-30X Plus MathPrint). */
export type Hilfsmittel = "ohne" | "wtr";

/** Aufgabentypen aus dem Curriculum (§3). Diese Einheit nutzt 1–3. */
export type AufgabenTyp =
  | "single-choice" // Typ 1: genau eine richtige Option
  | "multiple-choice" // Typ 1: mehrere richtige Optionen
  | "zahl" // Typ 2: Zahleneingabe, Vergleich mit Toleranz
  | "term"; // Typ 3: Term-Eingabe, symbolische Äquivalenz

interface AufgabeBasis {
  id: string;
  typ: AufgabenTyp;
  /** Anzeigetext der Frage (Unicode-Hochzahlen / echtes Minus erlaubt). */
  frage: string;
  /** Optionaler LaTeX-Quelltext für spätere KaTeX-Darstellung. */
  latex?: string;
  /** Kleine Stütze, die man sich VOR dem Antworten holen kann (Krone-1-Level). */
  hinweis?: string;
  /**
   * Der "kein Scham"-Mikroschritt: erscheint bei falscher Antwort, erklärt den
   * richtigen Weg und adressiert den typischen Denkfehler — nie ein Vorwurf.
   */
  erklaerung: string;
  /** Standard "ohne", wenn nicht gesetzt. */
  hilfsmittel?: Hilfsmittel;
  /** Frei taggbar, z. B. der adressierte Denkfehler (für spätere Auswertung). */
  tags?: string[];
}

export interface Option {
  id: string;
  text: string;
}

export interface SingleChoiceAufgabe extends AufgabeBasis {
  typ: "single-choice";
  optionen: Option[];
  richtig: string; // Option.id
}

export interface MultipleChoiceAufgabe extends AufgabeBasis {
  typ: "multiple-choice";
  optionen: Option[];
  richtig: string[]; // Option.id[]
}

export interface ZahlAufgabe extends AufgabeBasis {
  typ: "zahl";
  loesung: number;
  /** Absolute Toleranz für den Vergleich. Standard 0 (exakte Zahl). */
  toleranz?: number;
  /** Optionale Einheit zur Anzeige (z. B. "°C"). */
  einheit?: string;
}

export interface TermAufgabe extends AufgabeBasis {
  typ: "term";
  /** Kanonische Lösung in ASCII (siehe Konventionen oben). */
  loesung: string;
  /** Weitere akzeptierte Schreibweisen, falls der Normalisierer sie nicht abdeckt. */
  akzeptiert?: string[];
}

export type Aufgabe =
  | SingleChoiceAufgabe
  | MultipleChoiceAufgabe
  | ZahlAufgabe
  | TermAufgabe;

export interface Lektion {
  id: string;
  titel: string;
  /** Kronen-Level: 1 = stark angeleitet … höher = freier (Curriculum §1). */
  krone: number;
  aufgaben: Aufgabe[];
}

export interface Skill {
  id: string;
  titel: string;
  /** Einzeiler für die Skill-Kachel. */
  kurz: string;
  lektionen: Lektion[];
}

export interface Einheit {
  id: string;
  titel: string;
  /** Kurzbeschreibung wie auf der Lernkarte. */
  beschreibung: string;
  skills: Skill[];
}

export interface Leitidee {
  id: string;
  titel: string;
  einheiten: Einheit[];
}
