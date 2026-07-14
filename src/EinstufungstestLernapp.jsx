import React, { useState, useMemo } from "react";

/* ------------------------------------------------------------------ *
 *  EINSTUFUNGSTEST · Lernapp (Mathe-LK, BW)                          *
 *  Gebaut auf dem Phase-0-Profil + WTR-Kontext (Casio FX-87DE Plus). *
 *                                                                    *
 *  Die ITEMS-Liste ist bewusst als reines Datenobjekt gehalten und   *
 *  lässt sich 1:1 ins TypeScript-Datenmodell (Aufgabentypen 1–3 + 5) *
 *  übernehmen. Skill-Areale spiegeln die Prioritäten der Lückenkarte.*
 * ------------------------------------------------------------------ */

const T = {
  ink: "#2B2340",
  accent: "#FF8A3D",
  accentEdge: "#E06B1E",
  green: "#5BBF1E",
  greenEdge: "#479613",
  red: "#FF4B4B",
  redEdge: "#D63A3A",
  bubble: "#EEF5FF",
  page: "#FBFAFF",
  line: "#E9E6F2",
};

// Skill-Areale: prio = Reihenfolge aus der Lückenkarte (1 = wichtigste Lücke)
const AREAS = {
  rechnen:   { label: "Rechensicherheit — Vorzeichen & Potenzen", prio: 1, kind: "gap" },
  terme:     { label: "Terme umformen & Nullstellen ablesen",     prio: 2, kind: "gap" },
  hoehere:   { label: "Nullstellen höheren Grades (Substitution)", prio: 3, kind: "gap" },
  umstellen: { label: "Gleichungen umstellen",                    prio: 4, kind: "gap" },
  defmenge:  { label: "Definitionsmengen — Bruch vs. Wurzel",     prio: 5, kind: "gap" },
  linear:    { label: "Lineare Funktionen",                       prio: 90, kind: "strength" },
  analyse:   { label: "Funktionsanalyse — Symmetrie & Nullstellenart", prio: 91, kind: "strength" },
  ableitung: { label: "Ableitungen (LK-Vorschau)",               prio: 50, kind: "preview" },
};

// Ein warmer Coach-Satz pro Aufgabe (neutral/ermutigend)
const ITEMS = [
  {
    id: "f2", area: "linear", tool: "wtr",
    coach: "Locker zum Warmwerden.",
    type: "single",
    prompt: "Eine Gerade geht durch die Punkte (0 | 1) und (2 | 5). Welche Steigung hat sie?",
    options: ["m = 2", "m = 4", "m = 0,5", "m = −2"],
    correct: 0,
  },
  {
    id: "a1", area: "rechnen", tool: "ohne",
    coach: "Kopf-Rechnung, ganz ohne Rechner.",
    type: "number",
    prompt: "Berechne (−3)³.",
    answer: -27, tol: 0.001,
  },
  {
    id: "g1", area: "analyse", tool: "ohne",
    coach: "Nur hinschauen, nicht rechnen.",
    type: "single",
    prompt: "Welche Symmetrie hat f(x) = x⁴ − 10x² + 9 ?",
    options: [
      "achsensymmetrisch zur y-Achse",
      "punktsymmetrisch zum Ursprung",
      "keine Symmetrie",
    ],
    correct: 0,
  },
  {
    id: "b2", area: "terme", tool: "ohne",
    coach: "Ein Produkt ist genau dann 0, wenn …",
    type: "single",
    prompt: "Gegeben ist f(x) = x · (x² − 4). Welche Nullstellen hat f ?",
    options: [
      "x = 0 ; x = 2 ; x = −2",
      "nur x = 2",
      "x = −0,5",
      "x = 0 ; x = 4",
    ],
    correct: 0,
  },
  {
    id: "a2", area: "rechnen", tool: "ohne",
    coach: "Vorsicht beim Quadrieren.",
    type: "number",
    prompt: "Berechne (−4)².",
    answer: 16, tol: 0.001,
  },
  {
    id: "d2", area: "defmenge", tool: "ohne",
    coach: "Was darf unter der Wurzel stehen?",
    type: "single",
    prompt: "Größtmögliche Definitionsmenge von g(x) = √(x − 2) ?",
    options: ["[2 ; ∞[", "]2 ; ∞[", "ℝ \\ {2}", "ℝ"],
    correct: 0,
  },
  {
    id: "c1", area: "hoehere", tool: "ohne",
    coach: "Welcher Trick macht die Gleichung handlich?",
    type: "single",
    prompt: "Wie löst du x⁴ − 13x² + 36 = 0 am geschicktesten?",
    options: [
      "Substitution u = x²",
      "pq-Formel direkt auf x anwenden",
      "x² ausklammern",
      "gar nicht — hat keine Lösung",
    ],
    correct: 0,
  },
  {
    id: "a3", area: "rechnen", tool: "ohne",
    coach: "Schritt für Schritt einsetzen — jede Potenz einzeln.",
    type: "number",
    prompt: "f(x) = −2 · (x + 2)³ · (x − 4)². Berechne f(0).",
    answer: -256, tol: 0.001,
  },
  {
    id: "b1", area: "terme", tool: "ohne",
    coach: "Erst die Klammer, dann mal x. Tippe den Term ein.",
    type: "term",
    prompt: "Multipliziere aus: (x − 2)² · x",
    canonical: "x^3-4x^2+4x",
    placeholder: "z. B. x^3-4x^2+4x",
  },
  {
    id: "d1", area: "defmenge", tool: "ohne",
    coach: "Bruch heißt: der Nenner darf nicht …",
    type: "single",
    prompt: "Größtmögliche Definitionsmenge von f(x) = 1 / (x − 3) ?",
    options: ["ℝ \\ {3}", "[3 ; ∞[", "]3 ; ∞[", "ℝ (alle reellen Zahlen)"],
    correct: 0,
  },
  {
    id: "c2", area: "hoehere", tool: "wtr",
    coach: "Substituieren, lösen, zurück zu x.",
    type: "number",
    prompt: "Löse x⁴ − 13x² + 36 = 0 und gib die größte Lösung an.",
    answer: 3, tol: 0.001,
  },
  {
    id: "f1", area: "linear", tool: "wtr",
    coach: "Zwei Angebote gleichsetzen.",
    type: "number",
    prompt:
      "Angebot U kostet U(x) = 11x + 120, Angebot S kostet S(x) = 20x + 60. " +
      "Bei welcher Stundenzahl x kosten beide gleich viel? (auf 2 Stellen)",
    answer: 6.67, tol: 0.05,
  },
  {
    id: "e1", area: "umstellen", tool: "ohne",
    coach: "Nach T auflösen — die Potenz muss weg.",
    type: "single",
    prompt: "Die Formel P = k · T⁴ soll nach T umgestellt werden. Wie lautet T ?",
    options: [
      "T = ⁴√(P / k)",
      "T = (P / k)⁴",
      "T = P / (4k)",
      "T = √(P / k)",
    ],
    correct: 0,
  },
  {
    id: "g2", area: "analyse", tool: "ohne",
    coach: "Ordne jedem Faktor seine Nullstellen-Art zu.",
    type: "assign",
    prompt: "Welche Art von Nullstelle erzeugt jeder Faktor?",
    options: [
      "einfache Nullstelle",
      "Berührpunkt (doppelt)",
      "Sattelpunkt (dreifach)",
    ],
    rows: [
      { left: "(x − 1)", correct: 0 },
      { left: "(x − 4)²", correct: 1 },
      { left: "(x + 2)³", correct: 2 },
    ],
  },
  {
    id: "h1", area: "ableitung", tool: "ohne",
    coach: "LK-Vorschau — kein Problem, wenn's neu ist.",
    type: "single",
    prompt: "Falls du es schon kennst: Wie lautet die Ableitung von f(x) = x³ ?",
    options: ["3x²", "x²", "3x", "Kenne ich noch nicht — kommt im Camp"],
    correct: 0,
    softMiss: 3, // diese Antwort ist ausdrücklich okay (keine Lücke, nur „neu")
  },
];

/* --------------------------- Prüf-Logik --------------------------- */

function normalizePoly(input) {
  if (input == null) return null;
  let s = String(input).toLowerCase().trim();
  s = s.replace(/²/g, "^2").replace(/³/g, "^3").replace(/⁴/g, "^4").replace(/⁵/g, "^5");
  s = s.replace(/[–—−]/g, "-").replace(/\s+/g, "").replace(/[*·]/g, "").replace(/,/g, ".");
  if (s === "") return null;
  if (s[0] !== "+" && s[0] !== "-") s = "+" + s;
  const terms = s.match(/[+-][^+-]+/g);
  if (!terms) return null;
  const map = {};
  for (const t of terms) {
    const sign = t[0] === "-" ? -1 : 1;
    const body = t.slice(1);
    let coeff, power;
    if (body.includes("x")) {
      const [c, pRaw] = body.split("x");
      coeff = c === "" ? 1 : parseFloat(c);
      if (isNaN(coeff)) return null;
      let p = pRaw;
      if (p === undefined || p === "") power = 1;
      else { if (p[0] === "^") p = p.slice(1); power = parseInt(p, 10); if (isNaN(power)) return null; }
    } else {
      coeff = parseFloat(body);
      if (isNaN(coeff)) return null;
      power = 0;
    }
    map[power] = (map[power] || 0) + sign * coeff;
  }
  const powers = Object.keys(map).map(Number).sort((a, b) => b - a);
  const parts = powers.filter((p) => Math.abs(map[p]) > 1e-9).map((p) => `${map[p]}x^${p}`);
  return parts.length ? parts.join("|") : "0";
}

function isCorrect(item, resp) {
  if (resp == null || resp === "" || resp === "__skip__") return false;
  if (item.type === "single") return resp === item.correct;
  if (item.type === "number") {
    const v = parseFloat(String(resp).replace(",", ".").trim());
    return !isNaN(v) && Math.abs(v - item.answer) <= (item.tol ?? 0.01);
  }
  if (item.type === "term") {
    const a = normalizePoly(resp), b = normalizePoly(item.canonical);
    return a != null && a === b;
  }
  if (item.type === "assign") {
    return item.rows.every((r, i) => resp[i] === r.correct);
  }
  return false;
}

/* ----------------------------- UI-Teile ---------------------------- */

function PressButton({ children, onClick, disabled, variant = "accent", style = {} }) {
  const map = {
    accent: [T.accent, T.accentEdge, "#fff"],
    ghost: ["#fff", T.line, T.ink],
    green: [T.green, T.greenEdge, "#fff"],
  };
  const [bg, edge, fg] = map[variant];
  return (
    <button
      className="press"
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "#EFEDF5" : bg,
        color: disabled ? "#B7B2C6" : fg,
        boxShadow: `0 4px 0 ${disabled ? "#DAD6E6" : edge}`,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Choice({ label, selected, onClick }) {
  return (
    <button
      className="choice"
      onClick={onClick}
      style={{
        borderColor: selected ? T.accent : T.line,
        background: selected ? "#FFF3EA" : "#fff",
        boxShadow: selected ? `0 4px 0 ${T.accentEdge}` : `0 3px 0 ${T.line}`,
      }}
    >
      <span
        className="dot"
        style={{
          borderColor: selected ? T.accent : "#CFC9DD",
          background: selected ? T.accent : "#fff",
        }}
      />
      <span>{label}</span>
    </button>
  );
}

export default function EinstufungstestLernapp() {
  const [screen, setScreen] = useState("intro"); // intro | quiz | result
  const [idx, setIdx] = useState(0);
  const [responses, setResponses] = useState({});
  const [draft, setDraft] = useState(null);

  const item = ITEMS[idx];
  const total = ITEMS.length;

  function start() {
    setResponses({});
    setIdx(0);
    setDraft(null);
    setScreen("quiz");
  }

  function commit(value) {
    const next = { ...responses, [item.id]: value };
    setResponses(next);
    setDraft(null);
    if (idx + 1 < total) setIdx(idx + 1);
    else setScreen("result");
  }

  const answered =
    draft != null &&
    !(item?.type === "assign" && item.rows.some((_, i) => draft?.[i] == null));

  /* ------------------------- Ergebnis-Auswertung ------------------------- */
  const result = useMemo(() => {
    const byArea = {};
    for (const it of ITEMS) {
      const a = it.area;
      byArea[a] = byArea[a] || { total: 0, correct: 0, soft: 0 };
      byArea[a].total++;
      const r = responses[it.id];
      if (isCorrect(it, r)) byArea[a].correct++;
      else if (it.softMiss != null && r === it.softMiss) byArea[a].soft++;
    }
    const rows = Object.entries(byArea).map(([key, s]) => {
      const meta = AREAS[key];
      const ratio = s.correct / s.total;
      let status;
      if (meta.kind === "preview") status = "preview";
      else if (ratio >= 0.999) status = "sicher";
      else if (ratio >= 0.5) status = "teilweise";
      else status = "ansetzen";
      return { key, ...meta, ...s, ratio, status };
    });
    const gaps = rows
      .filter((r) => r.kind === "gap" && r.status !== "sicher")
      .sort((a, b) => a.prio - b.prio);
    const start = gaps[0] || null;
    const sortForDisplay = (arr) =>
      arr.sort((a, b) => {
        const rank = { ansetzen: 0, teilweise: 1, preview: 2, sicher: 3 };
        if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
        return a.prio - b.prio;
      });
    return { rows: sortForDisplay(rows), start };
  }, [responses]);

  const STATUS = {
    sicher:    { text: "schon sicher",     color: T.green,  bg: "#EEF9E6" },
    teilweise: { text: "teilweise sicher", color: "#C98A1E", bg: "#FFF6E6" },
    ansetzen:  { text: "hier ansetzen",    color: T.accent, bg: "#FFF3EA" },
    preview:   { text: "neu — im Camp",    color: "#5C7CCB", bg: T.bubble },
  };

  return (
    <div style={{ background: T.page, minHeight: "100%", color: T.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .wrap { font-family: 'Nunito', sans-serif; max-width: 560px; margin: 0 auto; padding: 22px 18px 40px; }
        h1,h2,h3,.fred { font-family: 'Fredoka', sans-serif; }
        .press { border: none; border-radius: 16px; padding: 15px 22px; font-family: 'Fredoka', sans-serif;
          font-size: 17px; font-weight: 600; cursor: pointer; transition: transform .06s ease, box-shadow .06s ease; }
        .press:active:not(:disabled) { transform: translateY(3px); box-shadow: 0 1px 0 currentColor; }
        .press:disabled { cursor: default; }
        .choice { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left;
          border: 2px solid ${T.line}; border-radius: 15px; padding: 15px 17px; margin: 9px 0;
          font-family: 'Nunito', sans-serif; font-size: 16px; font-weight: 600; color: ${T.ink};
          cursor: pointer; transition: transform .06s ease; }
        .choice:active { transform: translateY(2px); }
        .dot { width: 18px; height: 18px; border-radius: 50%; border: 2px solid; flex: 0 0 auto; }
        .bubble { background: ${T.bubble}; border-radius: 16px; padding: 12px 15px; font-size: 15px;
          font-weight: 600; display: flex; gap: 11px; align-items: center; }
        .coach { width: 40px; height: 40px; border-radius: 50%; flex: 0 0 auto; display: grid; place-items: center;
          background: ${T.accent}; color: #fff; font-family: 'Fredoka'; font-weight: 700; font-size: 20px;
          box-shadow: 0 3px 0 ${T.accentEdge}; }
        .field { width: 100%; border: 2px solid ${T.line}; border-radius: 15px; padding: 15px 17px;
          font-family: 'Fredoka', sans-serif; font-size: 20px; color: ${T.ink}; background: #fff; }
        .field:focus { outline: none; border-color: ${T.accent}; }
        .tag { display: inline-block; font-family:'Fredoka'; font-weight:600; font-size: 12px;
          padding: 4px 10px; border-radius: 999px; letter-spacing: .2px; }
        .progressTrack { height: 12px; background: #ECE8F4; border-radius: 999px; overflow: hidden; }
        .progressFill { height: 100%; background: ${T.accent}; border-radius: 999px; transition: width .3s ease; }
        .card { background:#fff; border:2px solid ${T.line}; border-radius: 18px; padding: 16px 18px; margin: 11px 0; }
        .link { background:none; border:none; color:#8C85A0; font-family:'Nunito'; font-weight:700;
          font-size: 15px; cursor: pointer; text-decoration: underline; padding: 8px; }
        select.field { font-family:'Nunito'; font-weight:700; font-size:15px; padding: 11px 13px; }
        button:focus-visible, select:focus-visible, .choice:focus-visible {
          outline: 3px solid ${T.accent}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
      `}</style>

      <div className="wrap">
        {/* ============================ INTRO ============================ */}
        {screen === "intro" && (
          <div>
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <div className="coach" style={{ width: 68, height: 68, fontSize: 34, margin: "0 auto 14px" }}>
                {/* Platzhalter: hier das echte Maskottchen (Momo/Pi/Gauß) als <img> einsetzen */}+
              </div>
              <h1 style={{ fontSize: 27, margin: "0 0 8px" }}>Kurzer Einstufungs-Check</h1>
            </div>
            <p style={{ fontSize: 16.5, lineHeight: 1.55 }}>
              Kein Test mit Noten — wir schauen nur, <b>wo du am besten startest</b>.
              Was du schon sicher kannst, überspringen wir; wo es noch hakt, holen wir dich ab.
            </p>
            <div className="bubble" style={{ margin: "16px 0" }}>
              <div className="coach" style={{ fontSize: 18 }}>+</div>
              <div>
                Ein paar Aufgaben sind <b>ohne Taschenrechner</b> — das ist Absicht.
                Genau das ist das Handwerk, das dir dein Casio nicht abnimmt. Raten ist erlaubt,
                und „weiß ich noch nicht" ist völlig okay.
              </div>
            </div>
            <p style={{ fontSize: 15, color: "#6F6883" }}>
              {total} Aufgaben · etwa 6–8 Minuten
            </p>
            <PressButton onClick={start} style={{ width: "100%", marginTop: 6 }}>
              Los geht's
            </PressButton>
          </div>
        )}

        {/* ============================ QUIZ ============================ */}
        {screen === "quiz" && item && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div className="progressTrack" style={{ flex: 1 }}>
                <div className="progressFill" style={{ width: `${(idx / total) * 100}%` }} />
              </div>
              <span className="fred" style={{ fontSize: 14, color: "#6F6883" }}>
                {idx + 1}/{total}
              </span>
            </div>

            <span
              className="tag"
              style={{
                background: item.tool === "ohne" ? "#FFF3EA" : T.bubble,
                color: item.tool === "ohne" ? T.accentEdge : "#5C7CCB",
              }}
            >
              {item.tool === "ohne" ? "ohne Hilfsmittel" : "mit Taschenrechner"}
            </span>

            <h2 style={{ fontSize: 21, lineHeight: 1.4, margin: "14px 0 16px" }}>{item.prompt}</h2>

            <div className="bubble" style={{ marginBottom: 16 }}>
              <div className="coach" style={{ fontSize: 18 }}>+</div>
              <div style={{ color: "#4A4360" }}>{item.coach}</div>
            </div>

            {/* --- Antwort-Eingabe je nach Typ --- */}
            {item.type === "single" && (
              <div>
                {item.options.map((opt, i) => (
                  <Choice key={i} label={opt} selected={draft === i} onClick={() => setDraft(i)} />
                ))}
              </div>
            )}

            {item.type === "number" && (
              <input
                className="field"
                inputMode="text"
                placeholder="Ergebnis eingeben"
                value={draft ?? ""}
                onChange={(e) => setDraft(e.target.value)}
                autoFocus
              />
            )}

            {item.type === "term" && (
              <div>
                <input
                  className="field"
                  placeholder={item.placeholder}
                  value={draft ?? ""}
                  onChange={(e) => setDraft(e.target.value)}
                  autoFocus
                />
                <p style={{ fontSize: 13.5, color: "#8C85A0", margin: "8px 2px 0" }}>
                  Potenzen mit ^ schreiben, z. B. x^2. Reihenfolge egal.
                </p>
              </div>
            )}

            {item.type === "assign" && (
              <div>
                {item.rows.map((row, ri) => (
                  <div
                    key={ri}
                    style={{ display: "flex", alignItems: "center", gap: 12, margin: "10px 0" }}
                  >
                    <span className="fred" style={{ fontSize: 20, minWidth: 74 }}>{row.left}</span>
                    <span style={{ color: "#C4BFD2" }}>→</span>
                    <select
                      className="field"
                      style={{ flex: 1 }}
                      value={draft?.[ri] ?? ""}
                      onChange={(e) => {
                        const v = e.target.value === "" ? null : Number(e.target.value);
                        setDraft({ ...(draft || {}), [ri]: v });
                      }}
                    >
                      <option value="">bitte wählen …</option>
                      {item.options.map((o, oi) => (
                        <option key={oi} value={oi}>{o}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            <PressButton
              onClick={() => commit(draft)}
              disabled={!answered}
              style={{ width: "100%", marginTop: 20 }}
            >
              {idx + 1 < total ? "Weiter" : "Fertig"}
            </PressButton>

            <div style={{ textAlign: "center" }}>
              <button className="link" onClick={() => commit("__skip__")}>
                weiß ich noch nicht
              </button>
            </div>
          </div>
        )}

        {/* =========================== RESULT =========================== */}
        {screen === "result" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 6 }}>
              <div className="coach" style={{ width: 64, height: 64, fontSize: 32, margin: "0 auto 12px" }}>+</div>
              <h1 style={{ fontSize: 25, margin: "0 0 6px" }}>Deine Lernkarte</h1>
              <p style={{ color: "#6F6883", fontSize: 15.5, margin: 0 }}>
                Kein Ranking — nur ein Wegweiser, wo's losgeht.
              </p>
            </div>

            {result.start && (
              <div
                className="card"
                style={{ borderColor: T.accent, background: "#FFF3EA", boxShadow: `0 4px 0 ${T.accentEdge}` }}
              >
                <div className="tag" style={{ background: T.accent, color: "#fff" }}>Empfohlener Start</div>
                <h3 style={{ fontSize: 19, margin: "10px 0 4px" }}>{result.start.label}</h3>
                <p style={{ fontSize: 15, color: "#4A4360", margin: 0 }}>
                  Hier holst du am meisten heraus — die Basis, auf der alles andere aufbaut.
                  Kurze Häppchen, ohne Taschenrechner.
                </p>
              </div>
            )}

            <h3 style={{ fontSize: 15, color: "#6F6883", margin: "22px 2px 4px" }}>Alle Bereiche</h3>
            {result.rows.map((r) => {
              const s = STATUS[r.status];
              return (
                <div key={r.key} className="card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div className="fred" style={{ fontSize: 16.5, fontWeight: 600 }}>{r.label}</div>
                    <div style={{ fontSize: 13.5, color: "#8C85A0", marginTop: 2 }}>
                      {r.kind === "preview"
                        ? "kommt neu im Camp — noch keine Lücke"
                        : `${r.correct} von ${r.total} sicher`}
                    </div>
                  </div>
                  <span className="tag" style={{ background: s.bg, color: s.color, whiteSpace: "nowrap" }}>
                    {s.text}
                  </span>
                </div>
              );
            })}

            <PressButton onClick={() => setScreen("intro")} variant="ghost" style={{ width: "100%", marginTop: 18 }}>
              Zurück zum Start
            </PressButton>
          </div>
        )}
      </div>
    </div>
  );
}
