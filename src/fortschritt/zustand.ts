// ---------------------------------------------------------------------------
// Fortschritt · Persistenter App-Zustand (localStorage)
// ---------------------------------------------------------------------------
// B1-Fundament: überlebt Reloads. GETRENNT vom Nutzungslog (IndexedDB, roh) —
// hier liegt der kleine, kuratierte App-Zustand, auf dem Streak (B2), Kronen
// (B3) und das Status-Label (M3) aufsetzen.
//
// Haltung wie beim Log-Fix: NIE werfen. localStorage kann auf iOS-Safari im
// Private-Modus oder bei Quota-Problemen fehlschlagen — dann In-Memory-Fallback
// + `speicherOk`-Flag, damit ein Fehler sichtbar statt lautlos ist.
//
// Diese Datei ist rein (keine React-Abhängigkeit): die Updater sind pure
// Funktionen mit injizierbarem Datum, damit sie ohne DOM testbar sind.
// ---------------------------------------------------------------------------

export const FORTSCHRITT_SCHEMA_VERSION = 1;
const LS_KEY = 'lernapp:fortschritt';

/** Fortschritt einer einzelnen Lektion. */
export interface LektionFortschritt {
  /** Höchste bisher abgeschlossene Krone (Curriculum §1). */
  krone: number;
  /** Wie oft insgesamt abgeschlossen (auch „Nochmal üben"). */
  abschluesse: number;
  /** ISO-Zeitstempel des letzten Abschlusses. */
  zuletzt: string;
}

/** Streak-Grundlage. Anzeige & Vierdaagse-Freeze folgen in B2. */
export interface StreakZustand {
  /** Aufeinanderfolgende aktive Kalendertage. */
  aktuellerLauf: number;
  /** Längster je erreichter Lauf. */
  laengsterLauf: number;
  /** Letzter aktiver Tag als lokales YYYY-MM-DD (null = noch nie aktiv). */
  letzterAktivTag: string | null;
}

export interface AppZustand {
  schemaVersion: number;
  /** ISO-Zeitstempel der ersten Nutzung. */
  erstellt: string;
  /** lektionId → Fortschritt. */
  lektionen: Record<string, LektionFortschritt>;
  streak: StreakZustand;
}

// --- Datums-Helfer (lokaler Kalendertag, DST-fest) --------------------------

/** Lokaler Kalendertag als YYYY-MM-DD (bewusst NICHT UTC — Streaks folgen der
 *  Wohnzeitzone der Lernerin). */
export function heutigerTag(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const t = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${t}`;
}

/** Ganze Tage von a nach b (b − a). Über UTC-Mitternacht gerechnet, damit
 *  Sommer-/Winterzeit-Sprünge das Ergebnis nicht verfälschen. */
export function tagDifferenz(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const da = Date.UTC(ay, am - 1, ad);
  const db = Date.UTC(by, bm - 1, bd);
  return Math.round((db - da) / 86_400_000);
}

// --- Reine Updater ----------------------------------------------------------

export function leererZustand(jetzt: Date = new Date()): AppZustand {
  return {
    schemaVersion: FORTSCHRITT_SCHEMA_VERSION,
    erstellt: jetzt.toISOString(),
    lektionen: {},
    streak: { aktuellerLauf: 0, laengsterLauf: 0, letzterAktivTag: null },
  };
}

/** Streak fortschreiben für einen aktiven Tag. Pure. */
function mitAktivemTag(streak: StreakZustand, tag: string): StreakZustand {
  if (streak.letzterAktivTag === null) {
    return { aktuellerLauf: 1, laengsterLauf: Math.max(1, streak.laengsterLauf), letzterAktivTag: tag };
  }
  const diff = tagDifferenz(streak.letzterAktivTag, tag);
  let lauf: number;
  if (diff === 0) lauf = streak.aktuellerLauf; // heute schon gezählt
  else if (diff === 1) lauf = streak.aktuellerLauf + 1; // gestern → +1
  else if (diff > 1) lauf = 1; // Lücke → neu ab 1
  else return streak; // Uhr zurückgestellt / früherer Tag → unverändert
  return {
    aktuellerLauf: lauf,
    laengsterLauf: Math.max(streak.laengsterLauf, lauf),
    letzterAktivTag: diff === 0 ? streak.letzterAktivTag : tag,
  };
}

/** Zustand nach Abschluss einer Lektion. Pure — kein Seiteneffekt. */
export function mitAbschluss(
  z: AppZustand,
  lektionId: string,
  krone: number,
  jetzt: Date = new Date(),
): AppZustand {
  const vorher = z.lektionen[lektionId];
  const lektion: LektionFortschritt = {
    krone: Math.max(krone, vorher?.krone ?? 0),
    abschluesse: (vorher?.abschluesse ?? 0) + 1,
    zuletzt: jetzt.toISOString(),
  };
  return {
    ...z,
    lektionen: { ...z.lektionen, [lektionId]: lektion },
    streak: mitAktivemTag(z.streak, heutigerTag(jetzt)),
  };
}

export function istAbgeschlossen(z: AppZustand, lektionId: string): boolean {
  return z.lektionen[lektionId] != null;
}

// --- Migration --------------------------------------------------------------

/** Roh-Objekt aus localStorage in einen gültigen Zustand überführen. Toleriert
 *  Teilobjekte und ältere Schemata (aktuell nur v1 → Defaults auffüllen). */
export function migriere(roh: unknown): AppZustand {
  const basis = leererZustand();
  if (typeof roh !== 'object' || roh === null) return basis;
  const p = roh as Partial<AppZustand>;
  return {
    schemaVersion: FORTSCHRITT_SCHEMA_VERSION,
    erstellt: typeof p.erstellt === 'string' ? p.erstellt : basis.erstellt,
    lektionen: (typeof p.lektionen === 'object' && p.lektionen !== null)
      ? (p.lektionen as Record<string, LektionFortschritt>)
      : {},
    streak: {
      aktuellerLauf: p.streak?.aktuellerLauf ?? 0,
      laengsterLauf: p.streak?.laengsterLauf ?? 0,
      letzterAktivTag: p.streak?.letzterAktivTag ?? null,
    },
  };
}

// --- Persistenz (localStorage, defensiv) ------------------------------------

let speicherOk = true;
let cache: AppZustand | null = null;

/** true, solange Lesen/Schreiben funktioniert. false nach einem Fehlschlag
 *  (z. B. Safari Private-Modus / Quota) — für ehrliche UI/Diagnose. */
export function istSpeicherOk(): boolean {
  return speicherOk;
}

export function ladeZustand(): AppZustand {
  if (cache) return cache;
  try {
    const roh = localStorage.getItem(LS_KEY);
    cache = roh ? migriere(JSON.parse(roh)) : leererZustand();
    speicherOk = true;
  } catch {
    speicherOk = false;
    cache = leererZustand();
  }
  return cache;
}

/** Zustand persistieren. Gibt zurück, ob das Schreiben klappte (nie werfen). */
export function speichereZustand(z: AppZustand): boolean {
  cache = z;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(z));
    speicherOk = true;
    return true;
  } catch {
    speicherOk = false;
    return false;
  }
}

/** Kompletten Fortschritt löschen (Debug-/Datenschutz-Menü). */
export function fortschrittZuruecksetzen(): void {
  cache = null;
  try {
    localStorage.removeItem(LS_KEY);
  } catch {
    /* egal — Cache ist bereits geleert */
  }
}
