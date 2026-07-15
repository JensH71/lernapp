import { useState, type CSSProperties } from "react";
import { Mascot } from "../mascot/Mascot";
import type { MascotCharacter } from "../mascot/mascotData";
import {
  fundament,
  type Aufgabe,
  type Lektion,
  type Leitidee,
} from "../content";

/* ──────────────────────────────────────────────────────────────────────────
 * Maskottchen-Adapter — die EINZIGE Stelle, die deine Mascot.tsx berührt.
 * Sollte deine Komponente eine andere Signatur haben (named statt default
 * export, andere Prop-Namen), musst du nur hier eine Zeile anpassen.
 * Erwartete API laut Projekt-README:
 *   <Mascot character="momo|pi|gauss" state="neutral|freude|aufmuntern"
 *           size="coach|hero" | pixelzahl />
 * ────────────────────────────────────────────────────────────────────────── */
type CoachState = "neutral" | "freude" | "aufmuntern";
function Coach({
  character,
  state,
  size = "coach",
}: {
  character: MascotCharacter;
  state: CoachState;
  size?: "coach" | "hero";
}) {
  return <Mascot character={character} state={state} size={size} />;
}

/** Eine der drei Figuren zufällig wählen (pro Aufgabe, nicht pro Render). */
const FIGUREN: MascotCharacter[] = ["momo", "pi", "gauss"];
function zufallsFigur(): MascotCharacter {
  return FIGUREN[Math.floor(Math.random() * FIGUREN.length)];
}

/* ──────────────────────────────────────────────────────────────────────────
 * Antwort-Prüfung
 * ────────────────────────────────────────────────────────────────────────── */

/** Symbolischer Term-Normalisierer (validiert gegen alle Term-Formen der
 *  Rechensicherheit-Einheit). Vergleicht NICHT Zeichen-für-Zeichen. */
function normalizeTerm(raw: string): string {
  let s = raw.toLowerCase().trim();
  const sup: Record<string, string> = {
    "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
    "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-",
  };
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (m) =>
    "^" + m.split("").map((c) => sup[c]).join(""),
  );
  s = s.replace(/[−–—]/g, "-").replace(/[·×✕*]/g, "*").replace(/:/g, "/");
  s = s.replace(/\s+/g, "");
  s = s.replace(/([a-z])(\d+)/g, "$1^$2"); // x3 -> x^3
  s = s.replace(/(\d)([a-z])/g, "$1*$2"); // 8a -> 8*a
  s = s.replace(/\^1(?![0-9])/g, "").replace(/^\+/, "");
  return s;
}

/** Deutsche Zahleneingabe: echtes Minus und Komma erlaubt. */
function parseZahl(raw: string): number {
  return parseFloat(raw.replace(/[−–—]/g, "-").replace(",", ".").trim());
}

function istRichtig(
  aufgabe: Aufgabe,
  eingabe: string,
  auswahl: string[],
): boolean {
  switch (aufgabe.typ) {
    case "single-choice":
      return auswahl[0] === aufgabe.richtig;
    case "multiple-choice": {
      const a = [...auswahl].sort();
      const b = [...aufgabe.richtig].sort();
      return a.length === b.length && a.every((x, i) => x === b[i]);
    }
    case "zahl": {
      const wert = parseZahl(eingabe);
      if (Number.isNaN(wert)) return false;
      const tol = (aufgabe.toleranz ?? 0) + 1e-9;
      return Math.abs(wert - aufgabe.loesung) <= tol;
    }
    case "term": {
      const u = normalizeTerm(eingabe);
      return [aufgabe.loesung, ...(aufgabe.akzeptiert ?? [])].some(
        (l) => normalizeTerm(l) === u,
      );
    }
  }
}

/* ──────────────────────────────────────────────────────────────────────────
 * Gemeinsame Styles (Design-Tokens aus index.css)
 * ────────────────────────────────────────────────────────────────────────── */
const wrap: CSSProperties = {
  maxWidth: 480,
  margin: "0 auto",
  padding: "16px 18px 40px",
  minHeight: "100%",
};
const karte: CSSProperties = {
  background: "#fff",
  border: "1px solid #ece9f4",
  borderRadius: 18,
  padding: "18px 20px",
  boxShadow: "0 1px 0 #efecf6",
};
const chip = (bg: string, fg: string): CSSProperties => ({
  display: "inline-block",
  fontFamily: "var(--font-display)",
  fontSize: ".78rem",
  fontWeight: 600,
  color: fg,
  background: bg,
  borderRadius: 999,
  padding: "4px 12px",
});

/* ──────────────────────────────────────────────────────────────────────────
 * Auswahl-Screen: Einheiten → Skills → Lektionen
 * ────────────────────────────────────────────────────────────────────────── */
function Auswahl({
  leitidee,
  onWaehlen,
}: {
  leitidee: Leitidee;
  onWaehlen: (l: Lektion) => void;
}) {
  return (
    <div style={wrap}>
      {leitidee.einheiten.map((einheit) => (
        <section key={einheit.id} style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: "1.7rem", lineHeight: 1.15 }}>
            {einheit.titel}
          </h1>
          <p style={{ color: "#6f6786", margin: "8px 0 22px", lineHeight: 1.5 }}>
            {einheit.beschreibung}
          </p>

          {einheit.skills.map((skill) => (
            <div key={skill.id} style={{ marginBottom: 26 }}>
              <h2 style={{ fontSize: "1.15rem", marginBottom: 2 }}>
                {skill.titel}
              </h2>
              <p style={{ color: "#8b839d", fontSize: ".92rem", margin: "0 0 12px" }}>
                {skill.kurz}
              </p>

              <div style={{ display: "grid", gap: 12 }}>
                {skill.lektionen.map((lektion) => (
                  <button
                    key={lektion.id}
                    onClick={() => onWaehlen(lektion)}
                    style={{
                      ...karte,
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 14,
                      font: "inherit",
                      color: "var(--ink)",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                          fontSize: "1.05rem",
                          display: "block",
                        }}
                      >
                        {lektion.titel}
                      </span>
                      <span style={{ color: "#8b839d", fontSize: ".88rem" }}>
                        {lektion.aufgaben.length} Aufgaben
                      </span>
                    </span>
                    <span style={chip("#fff3ea", "var(--accent-edge)")}>
                      Krone {lektion.krone}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Player: spielt eine Lektion Aufgabe für Aufgabe durch
 * "Kein Scham"-Loop: falsch → aufmuntern + Mikroschritt, Aufgabe kommt in
 * derselben Session ans Ende der Schlange zurück (Fehler-Eimer). Kein Abzug.
 * ────────────────────────────────────────────────────────────────────────── */
function LektionSpielen({
  lektion,
  onBack,
}: {
  lektion: Lektion;
  onBack: () => void;
}) {
  const gesamt = lektion.aufgaben.length;
  const [queue, setQueue] = useState<Aufgabe[]>(lektion.aufgaben);
  const [gemeistert, setGemeistert] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<"eingabe" | "feedback">("eingabe");
  const [korrekt, setKorrekt] = useState(false);
  const [eingabe, setEingabe] = useState("");
  const [auswahl, setAuswahl] = useState<string[]>([]);
  const [hinweisOffen, setHinweisOffen] = useState(false);
  const [figur, setFigur] = useState<MascotCharacter>(zufallsFigur);

  const fertig = queue.length === 0;
  const aufgabe = queue[0];

  function reset() {
    setEingabe("");
    setAuswahl([]);
    setHinweisOffen(false);
    setPhase("eingabe");
    setFigur(zufallsFigur()); // neue Figur für die nächste Aufgabe
  }

  function neuStarten() {
    setQueue(lektion.aufgaben);
    setGemeistert(new Set());
    reset();
  }

  function pruefen() {
    setKorrekt(istRichtig(aufgabe, eingabe, auswahl));
    setPhase("feedback");
  }

  function weiter() {
    if (korrekt) {
      setGemeistert((g) => new Set(g).add(aufgabe.id));
      setQueue((q) => q.slice(1));
    } else {
      setQueue((q) => [...q.slice(1), q[0]]); // zurück in den Fehler-Eimer
    }
    reset();
  }

  /* ── Abschluss-Screen ── */
  if (fertig) {
    return (
      <div style={{ ...wrap, textAlign: "center" }}>
        <div style={{ marginTop: 40, marginBottom: 8 }}>
          <Coach character={figur} state="freude" size="hero" />
        </div>
        <h1 style={{ fontSize: "1.9rem" }}>Geschafft!</h1>
        <p style={{ color: "#6f6786", margin: "10px 0 30px", lineHeight: 1.5 }}>
          Alle {gesamt} Aufgaben aus „{lektion.titel}“ sitzen. Stark dranbleiben —
          genau so wächst die Sicherheit.
        </p>
        <div style={{ display: "grid", gap: 12 }}>
          <button className="press-btn press-btn--green" onClick={neuStarten}>
            Nochmal üben
          </button>
          <button className="press-btn press-btn--ghost" onClick={onBack}>
            Zurück zur Auswahl
          </button>
        </div>
      </div>
    );
  }

  const pct = Math.round((gemeistert.size / gesamt) * 100);
  const beantwortbar =
    aufgabe.typ === "zahl" || aufgabe.typ === "term"
      ? eingabe.trim() !== ""
      : auswahl.length > 0;

  return (
    <div style={wrap}>
      {/* Kopf: zurück + Fortschritt */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <button
          onClick={onBack}
          aria-label="Zurück"
          style={{
            border: "none",
            background: "transparent",
            fontSize: "1.4rem",
            color: "#8b839d",
            cursor: "pointer",
            padding: 4,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
        <div
          style={{
            flex: 1,
            height: 12,
            background: "#ece9f4",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background: "var(--green)",
              borderRadius: 999,
              transition: "width .25s ease",
            }}
          />
        </div>
      </div>

      {/* Coach + Frage */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
        <Coach character={figur} state={phase === "feedback" ? (korrekt ? "freude" : "aufmuntern") : "neutral"} />
        <div
          style={{
            background: "var(--bubble)",
            borderRadius: "4px 16px 16px 16px",
            padding: "14px 16px",
            flex: 1,
          }}
        >
          <span style={chip("#e9eefc", "#4a6bd6")}>
            {aufgabe.hilfsmittel === "wtr" ? "mit WTR" : "ohne Hilfsmittel"}
          </span>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "1.2rem",
              lineHeight: 1.35,
              margin: "10px 0 0",
              whiteSpace: "pre-wrap",
            }}
          >
            {aufgabe.frage}
          </p>
        </div>
      </div>

      {/* Hinweis (Krone-1-Stütze) */}
      {aufgabe.hinweis && phase === "eingabe" && (
        <div style={{ marginBottom: 14 }}>
          {hinweisOffen ? (
            <p
              style={{
                background: "#fff9f3",
                border: "1px solid #ffe0c7",
                borderRadius: 12,
                padding: "10px 14px",
                color: "#8a5a2b",
                fontSize: ".92rem",
                margin: 0,
              }}
            >
              {aufgabe.hinweis}
            </p>
          ) : (
            <button
              onClick={() => setHinweisOffen(true)}
              style={{
                border: "none",
                background: "transparent",
                color: "var(--accent-edge)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: ".95rem",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Hinweis zeigen
            </button>
          )}
        </div>
      )}

      {/* Antwort-Eingabe je nach Typ */}
      <div style={{ marginBottom: 20 }}>
        {(aufgabe.typ === "single-choice" || aufgabe.typ === "multiple-choice") && (
          <div style={{ display: "grid", gap: 10 }}>
            {aufgabe.optionen.map((opt) => {
              const gewaehlt = auswahl.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  disabled={phase === "feedback"}
                  onClick={() =>
                    setAuswahl((cur) =>
                      aufgabe.typ === "single-choice"
                        ? [opt.id]
                        : cur.includes(opt.id)
                          ? cur.filter((x) => x !== opt.id)
                          : [...cur, opt.id],
                    )
                  }
                  style={{
                    ...karte,
                    textAlign: "left",
                    cursor: phase === "feedback" ? "default" : "pointer",
                    borderColor: gewaehlt ? "var(--accent)" : "#ece9f4",
                    borderWidth: 2,
                    background: gewaehlt ? "#fff6ef" : "#fff",
                    font: "inherit",
                    color: "var(--ink)",
                    fontSize: "1.05rem",
                  }}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        )}

        {(aufgabe.typ === "zahl" || aufgabe.typ === "term") && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              value={eingabe}
              onChange={(e) => setEingabe(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && beantwortbar && phase === "eingabe") pruefen();
              }}
              disabled={phase === "feedback"}
              inputMode="text"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder={aufgabe.typ === "zahl" ? "Zahl eingeben" : "z. B. x^2"}
              style={{
                flex: 1,
                fontFamily: "var(--font-display)",
                fontSize: "1.3rem",
                padding: "14px 16px",
                borderRadius: 14,
                border: "2px solid #ece9f4",
                background: "#fff",
                color: "var(--ink)",
                width: "100%",
              }}
            />
            {aufgabe.typ === "zahl" && aufgabe.einheit && (
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "#8b839d" }}>
                {aufgabe.einheit}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Feedback-Banner */}
      {phase === "feedback" && (
        <div
          style={{
            borderRadius: 14,
            padding: "14px 16px",
            marginBottom: 18,
            background: korrekt ? "#eefbe6" : "#fff0f0",
            border: `1px solid ${korrekt ? "#bfe6a3" : "#ffc9c9"}`,
          }}
        >
          <strong
            style={{
              fontFamily: "var(--font-display)",
              color: korrekt ? "var(--green-edge)" : "var(--red-edge)",
              display: "block",
              marginBottom: korrekt ? 0 : 6,
            }}
          >
            {korrekt ? "Richtig!" : "Fast — schau mal:"}
          </strong>
          {!korrekt && (
            <p style={{ margin: 0, lineHeight: 1.5, color: "var(--ink)" }}>
              {aufgabe.erklaerung}
            </p>
          )}
        </div>
      )}

      {/* Aktions-Button */}
      {phase === "eingabe" ? (
        <button
          className="press-btn"
          onClick={pruefen}
          disabled={!beantwortbar}
          style={{ width: "100%", opacity: beantwortbar ? 1 : 0.45 }}
        >
          Prüfen
        </button>
      ) : (
        <button
          className={`press-btn ${korrekt ? "press-btn--green" : "press-btn--red"}`}
          onClick={weiter}
          style={{ width: "100%" }}
        >
          Weiter
        </button>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Einstieg: Auswahl ↔ Player
 * ────────────────────────────────────────────────────────────────────────── */
export default function Lernpfad() {
  const [lektion, setLektion] = useState<Lektion | null>(null);

  return lektion ? (
    <LektionSpielen lektion={lektion} onBack={() => setLektion(null)} />
  ) : (
    <Auswahl leitidee={fundament} onWaehlen={setLektion} />
  );
}
