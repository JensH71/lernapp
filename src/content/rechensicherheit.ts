import type { Einheit } from "./types";

/**
 * Erste echte Einheit — empfohlener Start aus dem Einstufungstest (1 von 3 sicher),
 * größte Lücke, rein hilfsmittelfrei. Adressiert die im Phase-0-Profil bestätigten
 * Fehlerbilder: Potenzen negativer Zahlen (z. B. (−3)³), Vorzeichen bei Klammern,
 * Potenzgesetze.
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
              id: "a1",
              typ: "single-choice",
              frage: "Was ist −3 · (−4)?",
              hinweis: "Bei · und : gilt: gleiche Vorzeichen → plus.",
              optionen: [
                { id: "a", text: "12" },
                { id: "b", text: "−12" },
                { id: "c", text: "−7" },
                { id: "d", text: "7" },
              ],
              richtig: "a",
              erklaerung:
                "Minus mal Minus ergibt Plus. Die zwei negativen Faktoren heben ihr " +
                "Vorzeichen auf: (−3)·(−4) = +12.",
              tags: ["vorzeichenregel", "produkt"],
            },
            {
              id: "a2",
              typ: "zahl",
              frage: "Berechne: −4 − 5",
              hinweis:
                "Beide Schritte gehen nach unten: erst auf −4, dann noch 5 weiter ins Minus.",
              loesung: -9,
              erklaerung:
                "Hier wird nichts abgezogen-vom-Positiven, sondern zweimal ins Minus " +
                "gegangen: −4 und dann −5 dazu → −9. Auf dem Zahlenstrahl fünf Schritte " +
                "links von −4.",
              tags: ["addition-negativ"],
            },
            {
              id: "a3",
              typ: "zahl",
              frage: "Berechne: 5 − (−8)",
              hinweis: "Ein Minus vor einer Klammer dreht das Vorzeichen darin um.",
              loesung: 13,
              erklaerung:
                "−(−8) = +8. Also 5 − (−8) = 5 + 8 = 13. Zwei Minuszeichen " +
                "hintereinander werden zu einem Plus.",
              tags: ["minusklammer"],
            },
            {
              id: "a4",
              typ: "single-choice",
              frage: "Was ist −(2 − 7)?",
              hinweis: "Erst die Klammer ausrechnen, dann das äußere Minus anwenden.",
              optionen: [
                { id: "a", text: "5" },
                { id: "b", text: "−5" },
                { id: "c", text: "9" },
                { id: "d", text: "−9" },
              ],
              richtig: "a",
              erklaerung:
                "Innen zuerst: 2 − 7 = −5. Das Minus vor der Klammer dreht das " +
                "ganze Ergebnis: −(−5) = 5.",
              tags: ["minusklammer"],
            },
            {
              id: "a5",
              typ: "zahl",
              frage: "Berechne: −2 · (−3) · (−1)",
              hinweis: "Zähle die Minuszeichen: gerade Anzahl → plus, ungerade → minus.",
              loesung: -6,
              erklaerung:
                "Drei Minuszeichen (ungerade) → das Produkt ist negativ. Der Betrag " +
                "ist 2·3·1 = 6, also −6.",
              tags: ["vorzeichen-zaehlen", "produkt"],
            },
            {
              id: "a6",
              typ: "single-choice",
              frage: "Welcher Term ist gleich −(a − b)?",
              hinweis: "Das äußere Minus dreht JEDES Vorzeichen in der Klammer.",
              optionen: [
                { id: "a", text: "b − a" },
                { id: "b", text: "a − b" },
                { id: "c", text: "−a − b" },
                { id: "d", text: "−b − a" },
              ],
              richtig: "a",
              erklaerung:
                "−(a − b) = −a + b. Umsortiert: b − a. Wichtig: das Minus wirkt auf " +
                "beide Summanden, nicht nur auf den ersten.",
              tags: ["minusklammer", "term"],
            },
            {
              id: "a7",
              typ: "zahl",
              frage:
                "Nachteinsatz: Die Temperatur fällt pro Stunde um 3 °C, Start bei 0 °C. " +
                "Welchen Wert hat sie nach 4 Stunden? (Rechne 4 · (−3).)",
              loesung: -12,
              einheit: "°C",
              erklaerung:
                "Jede Stunde −3 °C, über 4 Stunden: 4 · (−3) = −12. Positiv mal " +
                "negativ ergibt negativ → −12 °C.",
              tags: ["kontext", "produkt", "feuerwehr"],
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
              id: "b1",
              typ: "single-choice",
              frage: "Was ist (−3)²?",
              hinweis: "Die Klammer sagt: das Minus wird mitquadriert.",
              optionen: [
                { id: "a", text: "9" },
                { id: "b", text: "−9" },
                { id: "c", text: "6" },
                { id: "d", text: "−6" },
              ],
              richtig: "a",
              erklaerung:
                "(−3)² heißt (−3)·(−3). Minus mal Minus = plus, also +9.",
              tags: ["potenz-negativ", "klammer"],
            },
            {
              id: "b2",
              typ: "single-choice",
              frage: "Was ist −3²?",
              hinweis: "Ohne Klammer wirkt die Hochzahl nur auf die 3.",
              optionen: [
                { id: "a", text: "−9" },
                { id: "b", text: "9" },
                { id: "c", text: "−6" },
                { id: "d", text: "6" },
              ],
              richtig: "a",
              erklaerung:
                "Ohne Klammer gilt −3² = −(3²) = −(9) = −9. Merke den Unterschied: " +
                "(−3)² = 9, aber −3² = −9. Die Klammer entscheidet.",
              tags: ["potenz-negativ", "ohne-klammer"],
            },
            {
              id: "b3",
              typ: "zahl",
              frage: "Berechne: (−3)³",
              hinweis:
                "Rechne Schritt für Schritt und achte am Ende auf das Vorzeichen.",
              loesung: -27,
              erklaerung:
                "(−3)³ = (−3)·(−3)·(−3). Erst (−3)·(−3) = +9, dann +9·(−3) = −27. " +
                "Ungerade Hochzahl → das Ergebnis bleibt negativ. Der Betrag 27 stimmt, " +
                "nur das Vorzeichen kippt.",
              tags: ["potenz-negativ", "ungerade"],
            },
            {
              id: "b4",
              typ: "single-choice",
              frage: "Für welche Hochzahl n ist (−1)ⁿ = 1?",
              hinweis: "Paarweise heben sich zwei Minuszeichen zu einem Plus auf.",
              optionen: [
                { id: "a", text: "wenn n gerade ist" },
                { id: "b", text: "wenn n ungerade ist" },
                { id: "c", text: "immer" },
                { id: "d", text: "nie" },
              ],
              richtig: "a",
              erklaerung:
                "Gerade Hochzahl → die Minuszeichen heben sich paarweise auf → +1. " +
                "Ungerade Hochzahl → ein Minus bleibt übrig → −1.",
              tags: ["potenz-negativ", "gerade-ungerade"],
            },
            {
              id: "b5",
              typ: "single-choice",
              frage: "Welche Aussage stimmt?",
              hinweis: "Vergleiche, wo das Minus steht: innen (Klammer) oder außen.",
              optionen: [
                { id: "a", text: "(−5)² = 25 und −5² = −25" },
                { id: "b", text: "(−5)² = −25 und −5² = 25" },
                { id: "c", text: "(−5)² und −5² sind dasselbe" },
                { id: "d", text: "beide sind −25" },
              ],
              richtig: "a",
              erklaerung:
                "Mit Klammer wird das Vorzeichen mitquadriert: (−5)² = 25. Ohne " +
                "Klammer bleibt das Minus außen vor: −5² = −(25) = −25.",
              tags: ["potenz-negativ", "klammer-vergleich"],
            },
            {
              id: "b6",
              typ: "zahl",
              frage: "Berechne: (−4)²",
              hinweis: "Gerade Hochzahl auf einer eingeklammerten negativen Basis.",
              loesung: 16,
              erklaerung: "(−4)² = (−4)·(−4) = +16. Gerade Hochzahl → positiv.",
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
              id: "b7",
              typ: "zahl",
              frage: "Berechne: −2⁴",
              loesung: -16,
              erklaerung:
                "Ohne Klammer gilt die Hochzahl nur für die 2: −2⁴ = −(2⁴) = −16.",
              tags: ["potenz-negativ", "ohne-klammer"],
            },
            {
              id: "b8",
              typ: "zahl",
              frage: "Berechne: (−2)⁴",
              loesung: 16,
              erklaerung:
                "Mit Klammer wird das Minus mit-potenziert. Gerade Hochzahl (4) → +16.",
              tags: ["potenz-negativ", "gerade"],
            },
            {
              id: "b9",
              typ: "single-choice",
              frage: "Welcher Ausdruck ist positiv?",
              optionen: [
                { id: "a", text: "(−7)⁴" },
                { id: "b", text: "(−7)³" },
                { id: "c", text: "−7⁴" },
                { id: "d", text: "−(7²)" },
              ],
              richtig: "a",
              erklaerung:
                "Positiv wird es nur, wenn eine gerade Hochzahl auf einer " +
                "eingeklammerten negativen Basis sitzt: (−7)⁴ > 0. Bei ungerader " +
                "Hochzahl oder wenn das Minus außen steht, bleibt es negativ.",
              tags: ["potenz-negativ", "vergleich"],
            },
            {
              id: "b10",
              typ: "term",
              frage: "Vereinfache: (−x)²",
              loesung: "x^2",
              erklaerung:
                "(−x)² = (−x)·(−x) = x². Das Quadrat macht das Vorzeichen positiv. " +
                "Aufpassen: −x² ist etwas anderes, nämlich −(x²).",
              tags: ["potenz-negativ", "term", "gerade"],
            },
            {
              id: "b11",
              typ: "term",
              frage: "Vereinfache: (−x)³",
              loesung: "-x^3",
              erklaerung:
                "(−x)³ = (−x)·(−x)·(−x) = −x³. Ungerade Hochzahl → das Minus überlebt.",
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
              id: "c1",
              typ: "term",
              frage: "Vereinfache: x³ · x⁵",
              hinweis: "Gleiche Basis, multiplizieren → Hochzahlen …?",
              loesung: "x^8",
              erklaerung:
                "Gleiche Basis, Multiplikation → Hochzahlen addieren: " +
                "x³·x⁵ = x^(3+5) = x⁸.",
              tags: ["potenzgesetz", "produkt"],
            },
            {
              id: "c2",
              typ: "term",
              frage: "Vereinfache: a⁷ : a²",
              hinweis: "Gleiche Basis, dividieren → Hochzahlen …?",
              loesung: "a^5",
              erklaerung:
                "Gleiche Basis, Division → Hochzahlen subtrahieren: " +
                "a⁷ : a² = a^(7−2) = a⁵.",
              tags: ["potenzgesetz", "quotient"],
            },
            {
              id: "c3",
              typ: "term",
              frage: "Vereinfache: (x²)⁴",
              hinweis: "Potenz einer Potenz — hier wird nicht addiert.",
              loesung: "x^8",
              erklaerung:
                "Potenz einer Potenz → Hochzahlen multiplizieren: (x²)⁴ = x^(2·4) = x⁸. " +
                "Nicht mit x²·x⁴ verwechseln (das wäre addieren).",
              tags: ["potenzgesetz", "potenz-von-potenz"],
            },
            {
              id: "c4",
              typ: "single-choice",
              frage: "Was ist 5⁰?",
              hinweis: "Jede Zahl außer 0 hoch 0 ergibt denselben Wert.",
              optionen: [
                { id: "a", text: "1" },
                { id: "b", text: "0" },
                { id: "c", text: "5" },
                { id: "d", text: "undefiniert" },
              ],
              richtig: "a",
              erklaerung:
                "Jede Zahl (außer 0) hoch 0 ergibt 1: 5⁰ = 1. Grund: aⁿ : aⁿ = a⁰ und " +
                "gleichzeitig = 1.",
              tags: ["potenzgesetz", "nuller"],
            },
            {
              id: "c5",
              typ: "term",
              frage: "Vereinfache: (2a)³",
              hinweis: "Die Hochzahl gilt für JEDEN Faktor in der Klammer.",
              loesung: "8*a^3",
              akzeptiert: ["8a^3"],
              erklaerung:
                "(2a)³ = 2³·a³ = 8a³. Achtung: die 2 wird auch potenziert, nicht nur " +
                "das a.",
              tags: ["potenzgesetz", "produkt-in-klammer"],
            },
            {
              id: "c6",
              typ: "single-choice",
              frage: "Was ist x⁻²?",
              hinweis: "Ein negativer Exponent macht die Zahl nicht negativ.",
              optionen: [
                { id: "a", text: "1/x²" },
                { id: "b", text: "−x²" },
                { id: "c", text: "−2x" },
                { id: "d", text: "1/x⁻²" },
              ],
              richtig: "a",
              erklaerung:
                "Ein negativer Exponent bedeutet Kehrwert: x⁻² = 1/x². Das Minus " +
                "„schickt“ die Potenz in den Nenner — es macht sie nicht negativ.",
              tags: ["potenzgesetz", "negativer-exponent"],
            },
            {
              id: "c7",
              typ: "single-choice",
              frage: "Was ist x² · x³?",
              hinweis: "Multiplizieren gleicher Basen — addieren, nicht multiplizieren.",
              optionen: [
                { id: "a", text: "x⁵" },
                { id: "b", text: "x⁶" },
                { id: "c", text: "x¹" },
                { id: "d", text: "2x⁵" },
              ],
              richtig: "a",
              erklaerung:
                "Multiplikation gleicher Basis → Hochzahlen addieren: x²·x³ = x⁵. " +
                "x⁶ käme von (x²)³ — das ist Potenz einer Potenz.",
              tags: ["potenzgesetz", "produkt", "verwechsler"],
            },
          ],
        },
      ],
    },
  ],
};
