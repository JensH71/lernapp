import type { Einheit } from "./types";

/**
 * Erste echte Einheit — empfohlener Start aus dem Einstufungstest (1 von 3 sicher),
 * größte Lücke, rein hilfsmittelfrei. Adressiert die im Phase-0-Profil bestätigten
 * Fehlerbilder: Potenzen negativer Zahlen (z. B. (−3)³), Vorzeichen bei Klammern,
 * Potenzgesetze.
 *
 * FRISCHER AUFGABENSATZ (gleicher Schwierigkeitsgrad, neue Items/IDs) — damit
 * Aglaja unverbrauchte Aufgaben rechnet und wir saubere reale Logdaten bekommen.
 *
 * Aufbau: Skill A (Vorzeichen) → Skill B (Potenzen mit Vorzeichen, 2 Kronen-Level)
 * → Skill C (Potenzgesetze). Krone-1-Lektionen tragen `hinweis`; freiere Level nicht.
 */
export const rechensicherheit: Einheit = {
  id: "rechensicherheit",
  titel: "Rechensicherheit — Vorzeichen & Potenzen",
  beschreibung:
    "Hier holst du am meisten heraus — die Basis, auf der alles andere aufbaut. " +
    "Kurze Häppchen, ohne Taschenrechner.",
  skills: [
    // ───────────────────────────── Skill A ─────────────────────────────
    {
      id: "vorzeichen",
      titel: "Vorzeichen sicher",
      kurz: "Minus mal Minus, Klammern auflösen, Vorzeichen zählen.",
      lektionen: [
        {
          id: "vorzeichen-l1",
          titel: "Vorzeichen im Griff",
          krone: 1,
          aufgaben: [
            {
              id: "a8",
              typ: "single-choice",
              frage: "Was ist −6 · (−5)?",
              hinweis: "Bei · und : gilt: gleiche Vorzeichen → plus.",
              optionen: [
                { id: "a", text: "30" },
                { id: "b", text: "−30" },
                { id: "c", text: "−11" },
                { id: "d", text: "11" },
              ],
              richtig: "a",
              erklaerung:
                "Minus mal Minus ergibt Plus: (−6)·(−5) = +30. Die zwei negativen " +
                "Faktoren heben ihr Vorzeichen auf.",
              tags: ["vorzeichenregel", "produkt"],
            },
            {
              id: "a9",
              typ: "zahl",
              frage: "Berechne: −7 − 6",
              hinweis:
                "Beide Schritte gehen nach unten: erst auf −7, dann noch 6 weiter ins Minus.",
              loesung: -13,
              erklaerung:
                "Kein Abziehen von etwas Positivem, sondern zweimal ins Minus: −7 und " +
                "dann −6 dazu → −13. Auf dem Zahlenstrahl sechs Schritte links von −7.",
              tags: ["addition-negativ"],
            },
            {
              id: "a10",
              typ: "zahl",
              frage: "Berechne: 4 − (−9)",
              hinweis: "Ein Minus vor einer Klammer dreht das Vorzeichen darin um.",
              loesung: 13,
              erklaerung:
                "−(−9) = +9. Also 4 − (−9) = 4 + 9 = 13. Zwei Minuszeichen " +
                "hintereinander werden zu einem Plus.",
              tags: ["minusklammer"],
            },
            {
              id: "a11",
              typ: "single-choice",
              frage: "Was ist −(3 − 8)?",
              hinweis: "Erst die Klammer ausrechnen, dann das äußere Minus anwenden.",
              optionen: [
                { id: "a", text: "−5" },
                { id: "b", text: "5" },
                { id: "c", text: "11" },
                { id: "d", text: "−11" },
              ],
              richtig: "b",
              erklaerung:
                "Innen zuerst: 3 − 8 = −5. Das Minus vor der Klammer dreht das " +
                "Ergebnis: −(−5) = 5.",
              tags: ["minusklammer"],
            },
            {
              id: "a12",
              typ: "zahl",
              frage: "Berechne: −3 · (−1) · (−2)",
              hinweis: "Zähle die Minuszeichen: gerade Anzahl → plus, ungerade → minus.",
              loesung: -6,
              erklaerung:
                "Drei Minuszeichen (ungerade) → das Produkt ist negativ. Der Betrag " +
                "ist 3·1·2 = 6, also −6.",
              tags: ["vorzeichen-zaehlen", "produkt"],
            },
            {
              id: "a13",
              typ: "single-choice",
              frage: "Welcher Term ist gleich −(x − y)?",
              hinweis: "Das äußere Minus dreht JEDES Vorzeichen in der Klammer.",
              optionen: [
                { id: "a", text: "x − y" },
                { id: "b", text: "y − x" },
                { id: "c", text: "−x − y" },
                { id: "d", text: "−y − x" },
              ],
              richtig: "b",
              erklaerung:
                "−(x − y) = −x + y. Umsortiert: y − x. Das Minus wirkt auf beide " +
                "Summanden, nicht nur auf den ersten.",
              tags: ["minusklammer", "term"],
            },
            {
              id: "a14",
              typ: "zahl",
              frage:
                "Erste Hilfe: Ein Kühlpack senkt die Temperatur pro Minute um 2 °C, " +
                "Start bei 0 °C. Welchen Wert hat sie nach 5 Minuten? (Rechne 5 · (−2).)",
              loesung: -10,
              einheit: "°C",
              erklaerung:
                "Jede Minute −2 °C, über 5 Minuten: 5 · (−2) = −10. Positiv mal " +
                "negativ ergibt negativ → −10 °C.",
              tags: ["kontext", "produkt", "erste-hilfe"],
            },
          ],
        },
      ],
    },

    // ───────────────────────────── Skill B ─────────────────────────────
    {
      id: "potenzen-vorzeichen",
      titel: "Potenzen mit Vorzeichen",
      kurz: "(−3)² gegen −3², und was ungerade Hochzahlen mit dem Minus machen.",
      lektionen: [
        {
          id: "potenzen-vorzeichen-l1",
          titel: "Die Klammer entscheidet",
          krone: 1,
          aufgaben: [
            {
              id: "b12",
              typ: "single-choice",
              frage: "Was ist (−6)²?",
              hinweis: "Die Klammer sagt: das Minus wird mitquadriert.",
              optionen: [
                { id: "a", text: "36" },
                { id: "b", text: "−36" },
                { id: "c", text: "12" },
                { id: "d", text: "−12" },
              ],
              richtig: "a",
              erklaerung:
                "(−6)² heißt (−6)·(−6). Minus mal Minus = plus, also +36.",
              tags: ["potenz-negativ", "klammer"],
            },
            {
              id: "b13",
              typ: "single-choice",
              frage: "Was ist −4²?",
              hinweis: "Ohne Klammer wirkt die Hochzahl nur auf die 4.",
              optionen: [
                { id: "a", text: "−16" },
                { id: "b", text: "16" },
                { id: "c", text: "−8" },
                { id: "d", text: "8" },
              ],
              richtig: "a",
              erklaerung:
                "Ohne Klammer gilt −4² = −(4²) = −(16) = −16. Merke: (−4)² = 16, " +
                "aber −4² = −16. Die Klammer entscheidet.",
              tags: ["potenz-negativ", "ohne-klammer"],
            },
            {
              id: "b14",
              typ: "zahl",
              frage: "Berechne: (−2)³",
              hinweis:
                "Rechne Schritt für Schritt und achte am Ende auf das Vorzeichen.",
              loesung: -8,
              erklaerung:
                "(−2)³ = (−2)·(−2)·(−2). Erst (−2)·(−2) = +4, dann +4·(−2) = −8. " +
                "Ungerade Hochzahl → das Ergebnis bleibt negativ.",
              tags: ["potenz-negativ", "ungerade"],
            },
            {
              id: "b15",
              typ: "single-choice",
              frage: "Für welche Hochzahl n ist (−1)ⁿ = −1?",
              hinweis: "Ein einzelnes übrig bleibendes Minus macht das Ergebnis negativ.",
              optionen: [
                { id: "a", text: "wenn n ungerade ist" },
                { id: "b", text: "wenn n gerade ist" },
                { id: "c", text: "immer" },
                { id: "d", text: "nie" },
              ],
              richtig: "a",
              erklaerung:
                "Ungerade Hochzahl → ein Minus bleibt übrig → −1. Bei gerader Hochzahl " +
                "heben sich die Minuszeichen paarweise auf → +1.",
              tags: ["potenz-negativ", "gerade-ungerade"],
            },
            {
              id: "b16",
              typ: "single-choice",
              frage: "Welche Aussage stimmt?",
              hinweis: "Vergleiche, wo das Minus steht: innen (Klammer) oder außen.",
              optionen: [
                { id: "a", text: "(−6)² = 36 und −6² = −36" },
                { id: "b", text: "(−6)² = −36 und −6² = 36" },
                { id: "c", text: "(−6)² und −6² sind dasselbe" },
                { id: "d", text: "beide sind −36" },
              ],
              richtig: "a",
              erklaerung:
                "Mit Klammer wird das Vorzeichen mitquadriert: (−6)² = 36. Ohne " +
                "Klammer bleibt das Minus außen vor: −6² = −(36) = −36.",
              tags: ["potenz-negativ", "klammer-vergleich"],
            },
            {
              id: "b17",
              typ: "zahl",
              frage: "Berechne: (−5)²",
              hinweis: "Gerade Hochzahl auf einer eingeklammerten negativen Basis.",
              loesung: 25,
              erklaerung: "(−5)² = (−5)·(−5) = +25. Gerade Hochzahl → positiv.",
              tags: ["potenz-negativ", "gerade"],
            },
          ],
        },
        {
          id: "potenzen-vorzeichen-l2",
          titel: "Freier gemischt",
          krone: 2,
          aufgaben: [
            {
              id: "b18",
              typ: "zahl",
              frage: "Berechne: −3⁴",
              loesung: -81,
              erklaerung:
                "Ohne Klammer gilt die Hochzahl nur für die 3: −3⁴ = −(81) = −81.",
              tags: ["potenz-negativ", "ohne-klammer"],
            },
            {
              id: "b19",
              typ: "zahl",
              frage: "Berechne: (−3)⁴",
              loesung: 81,
              erklaerung:
                "Mit Klammer wird das Minus mit-potenziert. Gerade Hochzahl (4) → +81.",
              tags: ["potenz-negativ", "gerade"],
            },
            {
              id: "b20",
              typ: "single-choice",
              frage: "Welcher Ausdruck ist negativ?",
              optionen: [
                { id: "a", text: "(−5)⁴" },
                { id: "b", text: "(−5)³" },
                { id: "c", text: "(−5)²" },
                { id: "d", text: "5⁴" },
              ],
              richtig: "b",
              erklaerung:
                "Negativ wird es nur bei ungerader Hochzahl auf einer eingeklammerten " +
                "negativen Basis: (−5)³ < 0. Gerade Hochzahlen und positive Basen bleiben positiv.",
              tags: ["potenz-negativ", "vergleich"],
            },
            {
              id: "b21",
              typ: "term",
              frage: "Vereinfache: (−y)²",
              loesung: "y^2",
              erklaerung:
                "(−y)² = (−y)·(−y) = y². Das Quadrat macht das Vorzeichen positiv. " +
                "Aufpassen: −y² ist etwas anderes, nämlich −(y²).",
              tags: ["potenz-negativ", "term", "gerade"],
            },
            {
              id: "b22",
              typ: "term",
              frage: "Vereinfache: (−a)³",
              loesung: "-a^3",
              erklaerung:
                "(−a)³ = (−a)·(−a)·(−a) = −a³. Ungerade Hochzahl → das Minus überlebt.",
              tags: ["potenz-negativ", "term", "ungerade"],
            },
          ],
        },
      ],
    },

    // ───────────────────────────── Skill C ─────────────────────────────
    {
      id: "potenzgesetze",
      titel: "Potenzgesetze",
      kurz: "Hochzahlen addieren, subtrahieren, multiplizieren — und der Nuller.",
      lektionen: [
        {
          id: "potenzgesetze-l1",
          titel: "Rechnen mit Hochzahlen",
          krone: 1,
          aufgaben: [
            {
              id: "c8",
              typ: "term",
              frage: "Vereinfache: y⁴ · y⁶",
              hinweis: "Gleiche Basis, multiplizieren → Hochzahlen …?",
              loesung: "y^10",
              erklaerung:
                "Gleiche Basis, Multiplikation → Hochzahlen addieren: " +
                "y⁴·y⁶ = y^(4+6) = y¹⁰.",
              tags: ["potenzgesetz", "produkt"],
            },
            {
              id: "c9",
              typ: "term",
              frage: "Vereinfache: b⁹ : b⁴",
              hinweis: "Gleiche Basis, dividieren → Hochzahlen …?",
              loesung: "b^5",
              erklaerung:
                "Gleiche Basis, Division → Hochzahlen subtrahieren: " +
                "b⁹ : b⁴ = b^(9−4) = b⁵.",
              tags: ["potenzgesetz", "quotient"],
            },
            {
              id: "c10",
              typ: "term",
              frage: "Vereinfache: (a³)³",
              hinweis: "Potenz einer Potenz — hier wird nicht addiert.",
              loesung: "a^9",
              erklaerung:
                "Potenz einer Potenz → Hochzahlen multiplizieren: (a³)³ = a^(3·3) = a⁹. " +
                "Nicht mit a³·a³ verwechseln (das wäre addieren).",
              tags: ["potenzgesetz", "potenz-von-potenz"],
            },
            {
              id: "c11",
              typ: "single-choice",
              frage: "Was ist 12⁰?",
              hinweis: "Jede Zahl außer 0 hoch 0 ergibt denselben Wert.",
              optionen: [
                { id: "a", text: "1" },
                { id: "b", text: "0" },
                { id: "c", text: "12" },
                { id: "d", text: "undefiniert" },
              ],
              richtig: "a",
              erklaerung:
                "Jede Zahl (außer 0) hoch 0 ergibt 1: 12⁰ = 1. Grund: aⁿ : aⁿ = a⁰ und " +
                "gleichzeitig = 1.",
              tags: ["potenzgesetz", "nuller"],
            },
            {
              id: "c12",
              typ: "term",
              frage: "Vereinfache: (3x)²",
              hinweis: "Die Hochzahl gilt für JEDEN Faktor in der Klammer.",
              loesung: "9*x^2",
              akzeptiert: ["9x^2"],
              erklaerung:
                "(3x)² = 3²·x² = 9x². Achtung: die 3 wird auch quadriert, nicht nur " +
                "das x.",
              tags: ["potenzgesetz", "produkt-in-klammer"],
            },
            {
              id: "c13",
              typ: "single-choice",
              frage: "Was ist x⁻³?",
              hinweis: "Ein negativer Exponent macht die Zahl nicht negativ.",
              optionen: [
                { id: "a", text: "1/x³" },
                { id: "b", text: "−x³" },
                { id: "c", text: "−3x" },
                { id: "d", text: "1/x⁻³" },
              ],
              richtig: "a",
              erklaerung:
                "Ein negativer Exponent bedeutet Kehrwert: x⁻³ = 1/x³. Das Minus " +
                "„schickt“ die Potenz in den Nenner — es macht sie nicht negativ.",
              tags: ["potenzgesetz", "negativer-exponent"],
            },
            {
              id: "c14",
              typ: "single-choice",
              frage: "Was ist y³ · y²?",
              hinweis: "Multiplizieren gleicher Basen — addieren, nicht multiplizieren.",
              optionen: [
                { id: "a", text: "y⁵" },
                { id: "b", text: "y⁶" },
                { id: "c", text: "y¹" },
                { id: "d", text: "2y⁵" },
              ],
              richtig: "a",
              erklaerung:
                "Multiplikation gleicher Basis → Hochzahlen addieren: y³·y² = y⁵. " +
                "y⁶ käme von (y³)² — das ist Potenz einer Potenz.",
              tags: ["potenzgesetz", "produkt", "verwechsler"],
            },
          ],
        },
      ],
    },
  ],
};