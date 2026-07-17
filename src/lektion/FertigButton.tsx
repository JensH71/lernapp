import { useState } from "react";
import { sendeLog } from "../log";

type Status =
  | "idle" | "sende" | "ok"
  | "leer" | "speicher" | "netzwerk" | "unkonfig";

// Eigene, helle Grün-Palette — bewusst abgesetzt vom Akzent-Orange der
// Lern-Buttons und vom kräftigen „Richtig"-Grün (#5BBF1E).
const HELLGRUEN = "#DFF3C7";
const HELLGRUEN_KANTE = "#B4DC86";
const GRUEN_TEXT = "#3D7A16";

// Warm-neutrale Palette für „etwas stimmt nicht" — kein Rot, kein Scham,
// aber sichtbar anders als der Erfolgs-Zustand.
const HELLSAND = "#FFF2E0";
const HELLSAND_KANTE = "#EBD3AE";
const SAND_TEXT = "#8A5A1E";

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

    // Reihenfolge bewusst: stille Schreibfehler zuerst — genau der Fall, in dem
    // Übungen abgeschlossen wurden, aber nichts im Speicher landete.
    let s: Status;
    if (r.grund === "nicht-konfiguriert") s = "unkonfig";
    else if (r.schreibfehlerSession > 0) s = "speicher";
    else if (r.grund === "speicher") s = "speicher";
    else if (r.grund === "leer") s = "leer";
    else if (r.grund === "netzwerk") s = "netzwerk";
    else s = "ok";
    setStatus(s);
  }

  const text: Record<Status, string> = {
    idle: "Fertig für heute! 🌇",
    sende: "Sende …",
    ok: "Tagesbericht gesendet ✓",
    // „leer" heißt jetzt wirklich: Speicher lesbar, aber kein Verlauf drin.
    // Kein falsches „heute" mehr (es gibt keinen Tages-Filter).
    leer: "Noch kein Verlauf zum Senden",
    speicher: "Konnte den Lernstand nicht speichern — bitte Bescheid geben 🙈",
    netzwerk: "Senden hat nicht geklappt — nochmal? 🌇",
    unkonfig: "Senden ist noch nicht eingerichtet",
  };

  // Fehler-/Hinweiszustände warm-neutral, Erfolg grün.
  const problem = status === "speicher" || status === "netzwerk" || status === "leer";
  const palBg = problem ? HELLSAND : HELLGRUEN;
  const palKante = problem ? HELLSAND_KANTE : HELLGRUEN_KANTE;
  const palText = problem ? SAND_TEXT : GRUEN_TEXT;

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
          color: palText,
          background: palBg,
          border: "none",
          borderRadius: 14,
          padding: "14px 18px",
          cursor: deaktiviert ? "default" : "pointer",
          boxShadow: gedrueckt ? `0 0 0 ${palKante}` : `0 4px 0 ${palKante}`,
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
