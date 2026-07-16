import { useState } from "react";
import { sendeLog } from "../log";

type Status = "idle" | "sende" | "ok" | "leer" | "fehler" | "unkonfig";

// Eigene, helle Grün-Palette — bewusst abgesetzt vom Akzent-Orange der
// Lern-Buttons und vom kräftigen „Richtig"-Grün (#5BBF1E).
const HELLGRUEN = "#DFF3C7";
const HELLGRUEN_KANTE = "#B4DC86";
const GRUEN_TEXT = "#3D7A16";

/**
 * „Fertig für heute" — schickt den Tages-Log an das private Sheet.
 * Kein Scham: zeigt nur eine warme Bestätigung, nie Quoten/Fehler.
 */
export function FertigButton() {
  const [status, setStatus] = useState<Status>("idle");
  const [gedrueckt, setGedrueckt] = useState(false);

  async function fertig() {
    if (status === "sende") return;
    setStatus("sende");
    const r = await sendeLog();
    setStatus(
      r.ok
        ? "ok"
        : r.grund === "leer"
          ? "leer"
          : r.grund === "nicht-konfiguriert"
            ? "unkonfig"
            : "fehler",
    );
  }

  const text: Record<Status, string> = {
    idle: "Fertig für heute! 🌇",
    sende: "Sende …",
    ok: "Tagesbericht gesendet ✓",
    leer: "Heute noch nichts geübt",
    fehler: "Hat nicht geklappt — nochmal? 🌇",
    unkonfig: "Senden ist noch nicht eingerichtet",
  };

  const deaktiviert = status === "sende" || status === "unkonfig";

  return (
    <div style={{ marginTop: 28 }}>
      <button
        onClick={fertig}
        disabled={deaktiviert}
        onPointerDown={() => setGedrueckt(true)}
        onPointerUp={() => setGedrueckt(false)}
        onPointerLeave={() => setGedrueckt(false)}
        style={{
          width: "100%",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "1.05rem",
          color: GRUEN_TEXT,
          background: HELLGRUEN,
          border: "none",
          borderRadius: 14,
          padding: "14px 18px",
          cursor: deaktiviert ? "default" : "pointer",
          boxShadow: gedrueckt ? `0 0 0 ${HELLGRUEN_KANTE}` : `0 4px 0 ${HELLGRUEN_KANTE}`,
          transform: gedrueckt ? "translateY(4px)" : "none",
          transition: "transform 60ms, box-shadow 60ms",
          opacity: status === "sende" ? 0.6 : 1,
        }}
      >
        {text[status]}
      </button>
    </div>
  );
}
