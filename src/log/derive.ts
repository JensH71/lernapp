// ---------------------------------------------------------------------------
// Nutzungslog · Ableitungen (KPIs)
// ---------------------------------------------------------------------------
// Reine Funktionen über AufgabenEvent[] — kein Store, kein Browser, testbar.
// Sie füttern drei Loop-Entscheidungen:
//   1) WANN kommt etwas zurück?      → skillMastery / faelligkeitsListe / fehlerEimer
//   2) WELCHE Variante/Schwierigkeit? → itemDifficulty
//   3) Auf WELCHE Schwäche zielen?    → fehlerVerteilung (skill-übergreifend)
//
// Bei EINER Lernerin bewusst kein Signifikanz-Theater: kleine n werden als
// „vorläufig" behandelt (Wilson-Untergrenze + n-Gate), rollende Zeitfenster
// statt harter Schwellen. Alle Konstanten unten sind tunebare Heuristik-Knöpfe,
// keine statistische Populations-Inferenz.
// ---------------------------------------------------------------------------

import type { AufgabenEvent, Fehlerkategorie } from './events';

const TAG_MS = 86_400_000;

export const KONFIG = {
  /** Recency-Halbwertszeit: nach so vielen Tagen zählt ein Event halb. */
  halbwertszeitTage: 30,
  /** Wilson-z. Bewusst mild (≈80 % einseitig) für Einzel-Lernerin, nicht 1.96. */
  wilsonZ: 1.28,
  /** Effektive Stichprobe darunter → Status 'unbekannt' (dünne Evidenz).
   *  1.5 lässt zwei frische Events als echte Evidenz zählen, hält aber 1/1 und
   *  verblasste Skills (< ~1.5 effektiv) auf 'unbekannt'. */
  schwelleN: 1.5,
  /** Wilson-Untergrenze ab hier → 'sicher'. */
  schwelleSicher: 0.8,
  /** Wilson-Untergrenze ab hier → 'teilweise'. */
  schwelleTeilweise: 0.5,
  /** „langsam" = tGesamt über Faktor × Median der korrekten Zeit. */
  langsamFaktor: 1.8,
  /** Session-Trenner: Lücke größer als das → neue Sitzung. */
  sessionLueckeMs: 20 * 60 * 1000,
};

// --- kleine Helfer -----------------------------------------------------------

/** Nur gewertete Versuche (skip/abbruch zählen nicht in Quoten). */
const gewertet = (e: AufgabenEvent) => e.ausgang === 'richtig' || e.ausgang === 'falsch';

export function medianZahl(werte: number[]): number | null {
  if (werte.length === 0) return null;
  const s = [...werte].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

/** Wilson-Untergrenze — macht kleine Stichproben demütig. 1/1 → ~0.38. */
export function wilsonUntereSchranke(erfolge: number, n: number, z = KONFIG.wilsonZ): number {
  if (n <= 0) return 0;
  const p = erfolge / n;
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const center = p + z2 / (2 * n);
  const margin = z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n));
  return Math.max(0, (center - margin) / denom);
}

// --- 1) Skill-Mastery --------------------------------------------------------

export type MasteryStatus = 'unbekannt' | 'luecke' | 'teilweise' | 'sicher';

/** Nur die ermutigende Ableitung wird UI-seitig gezeigt — nie n/Quote/Zeit. */
export const STATUS_LABEL: Record<MasteryStatus, string> = {
  unbekannt: 'hier ansetzen',
  luecke: 'hier ansetzen',
  teilweise: 'teilweise sicher',
  sicher: 'schon sicher',
};

export interface SkillMastery {
  skillId: string;
  /** Gewertete Versuche (richtig|falsch), ungewichtet. */
  nGesamt: number;
  /** Recency-gewichtete Stichprobengröße Σw. */
  nEffektiv: number;
  /** Ungewichtete Trefferquote. */
  trefferRoh: number;
  /** Recency-gewichtete Trefferquote. */
  trefferGewichtet: number;
  /** Konservativer Mastery-Wert (Wilson). DIESER steuert Entscheidungen. */
  untereSchranke: number;
  status: MasteryStatus;
  tageSeitLetztKorrekt: number | null;
  /** 0..1 — Dringlichkeit einer Wiederholung (fürs Scheduling). */
  faelligkeit: number;
}

export function skillMastery(
  events: AufgabenEvent[],
  skillId: string,
  jetzt: number = Date.now(),
): SkillMastery {
  const ev = events.filter((e) => e.skillId === skillId && gewertet(e));

  if (ev.length === 0) {
    return {
      skillId, nGesamt: 0, nEffektiv: 0, trefferRoh: 0, trefferGewichtet: 0,
      untereSchranke: 0, status: 'unbekannt', tageSeitLetztKorrekt: null,
      faelligkeit: 1,
    };
  }

  let wSum = 0;
  let wRichtig = 0;
  let richtigRoh = 0;
  let letztKorrektTs: number | null = null;

  for (const e of ev) {
    const alterTage = (jetzt - e.ts) / TAG_MS;
    const w = Math.pow(0.5, Math.max(0, alterTage) / KONFIG.halbwertszeitTage);
    wSum += w;
    if (e.ausgang === 'richtig') {
      wRichtig += w;
      richtigRoh += 1;
      if (letztKorrektTs == null || e.ts > letztKorrektTs) letztKorrektTs = e.ts;
    }
  }

  const trefferRoh = richtigRoh / ev.length;
  const trefferGewichtet = wSum > 0 ? wRichtig / wSum : 0;
  const untereSchranke = wilsonUntereSchranke(wRichtig, wSum);

  let status: MasteryStatus;
  if (wSum < KONFIG.schwelleN) status = 'unbekannt';
  else if (untereSchranke >= KONFIG.schwelleSicher) status = 'sicher';
  else if (untereSchranke >= KONFIG.schwelleTeilweise) status = 'teilweise';
  else status = 'luecke';

  const tageSeitLetztKorrekt =
    letztKorrektTs == null ? null : (jetzt - letztKorrektTs) / TAG_MS;

  // Fälligkeit: stärkere Skills „vergessen" langsamer. Nie korrekt → maximal.
  let faelligkeit: number;
  if (tageSeitLetztKorrekt == null) {
    faelligkeit = 1;
  } else {
    const stabilitaet = KONFIG.halbwertszeitTage * (0.5 + untereSchranke);
    const recall = Math.pow(0.5, tageSeitLetztKorrekt / stabilitaet);
    faelligkeit = 1 - recall;
  }

  return {
    skillId,
    nGesamt: ev.length,
    nEffektiv: wSum,
    trefferRoh,
    trefferGewichtet,
    untereSchranke,
    status,
    tageSeitLetztKorrekt,
    faelligkeit,
  };
}

// --- 2) Item-Schwierigkeit ---------------------------------------------------

export interface ItemDifficulty {
  aufgabeId: string;
  /** Anzahl Erstversuche (versuchNr === 1, gewertet). */
  nErstversuch: number;
  /** Erstversuch-Trefferquote (null bei nErstversuch === 0). */
  trefferErstversuch: number | null;
  /** 1 − trefferErstversuch (Schwierigkeits-Proxy). */
  schwierigkeit: number | null;
  medianZeitKorrektMs: number | null;
  /** korrekt, aber überwiegend langsam → wackelig, in Rotation halten. */
  fragil: boolean;
}

/**
 * @param langsamSchwelleMs optionaler Vergleichs-Median (z. B. Skill-Median),
 *   ab dem eine korrekte Lösung als „langsam" gilt. Ohne Angabe kein Fragil-Urteil.
 */
export function itemDifficulty(
  events: AufgabenEvent[],
  aufgabeId: string,
  langsamSchwelleMs?: number,
): ItemDifficulty {
  const ev = events.filter((e) => e.aufgabeId === aufgabeId);
  const erst = ev.filter((e) => e.versuchNr === 1 && gewertet(e));
  const richtigErst = erst.filter((e) => e.ausgang === 'richtig').length;

  const trefferErstversuch = erst.length > 0 ? richtigErst / erst.length : null;
  const schwierigkeit = trefferErstversuch == null ? null : 1 - trefferErstversuch;

  const korrektZeiten = ev
    .filter((e) => e.ausgang === 'richtig')
    .map((e) => e.tGesamt);
  const medianZeitKorrektMs = medianZahl(korrektZeiten);

  let fragil = false;
  if (langsamSchwelleMs != null && korrektZeiten.length > 0) {
    const langsam = korrektZeiten.filter((t) => t > langsamSchwelleMs).length;
    fragil = langsam / korrektZeiten.length > 0.5;
  }

  return { aufgabeId, nErstversuch: erst.length, trefferErstversuch, schwierigkeit, medianZeitKorrektMs, fragil };
}

/** Alle Items eines Skills mit gemeinsamem „langsam"-Median als Baseline. */
export function itemUebersicht(events: AufgabenEvent[], skillId: string): ItemDifficulty[] {
  const skillEv = events.filter((e) => e.skillId === skillId);
  const median = medianZahl(
    skillEv.filter((e) => e.ausgang === 'richtig').map((e) => e.tGesamt),
  );
  const schwelle = median == null ? undefined : median * KONFIG.langsamFaktor;
  const ids = [...new Set(skillEv.map((e) => e.aufgabeId))];
  return ids.map((id) => itemDifficulty(skillEv, id, schwelle));
}

// --- 3) Fehlerverteilung -----------------------------------------------------

export interface FehlerAnteil {
  kategorie: Fehlerkategorie;
  anzahl: number;
  anteil: number;
}

/**
 * Verteilung der Fehlerkategorien, absteigend. Ohne skillId → SKILL-ÜBERGREIFEND:
 * genau das Signal, ob dieselbe Wurzel (z. B. Vorzeichen/Potenzen) durch Terme,
 * Substitution und später Ableiten zieht — belegt den „empfohlenen Start".
 */
export function fehlerVerteilung(
  events: AufgabenEvent[],
  opts: { skillId?: string } = {},
): FehlerAnteil[] {
  const ev = events.filter(
    (e) => e.ausgang === 'falsch' && e.fehlerkat != null &&
      (opts.skillId == null || e.skillId === opts.skillId),
  );
  const zaehler = new Map<Fehlerkategorie, number>();
  for (const e of ev) zaehler.set(e.fehlerkat!, (zaehler.get(e.fehlerkat!) ?? 0) + 1);

  const gesamt = ev.length || 1;
  return [...zaehler.entries()]
    .map(([kategorie, anzahl]) => ({ kategorie, anzahl, anteil: anzahl / gesamt }))
    .sort((a, b) => b.anzahl - a.anzahl);
}

/** Dominierende Fehlerquelle über alle Skills (oder null bei zu wenig Daten). */
export function dominierendeFehlerquelle(
  events: AufgabenEvent[],
  minAnzahl = 3,
): FehlerAnteil | null {
  const v = fehlerVerteilung(events).filter((f) => f.kategorie !== 'unklar');
  const top = v[0];
  return top && top.anzahl >= minAnzahl ? top : null;
}

// --- Scheduling: Fälligkeit & Fehler-Eimer -----------------------------------

/** Skills nach Wiederholungs-Dringlichkeit sortiert (fällig zuerst). */
export function faelligkeitsListe(
  events: AufgabenEvent[],
  skillIds: string[],
  jetzt: number = Date.now(),
): SkillMastery[] {
  return skillIds
    .map((id) => skillMastery(events, id, jetzt))
    .sort((a, b) => b.faelligkeit - a.faelligkeit);
}

export interface EimerEintrag {
  aufgabeId: string;
  skillId: string;
  /** Wie oft zuletzt (im Fenster) daneben. */
  fehlversuche: number;
  letzterTs: number;
}

/**
 * Fehler-Eimer: Items, deren jüngster gewerteter Ausgang 'falsch' war — sie sind
 * eine Wiederholung „schuldig". Priorität nach Fehlversuchen.
 */
export function fehlerEimer(events: AufgabenEvent[]): EimerEintrag[] {
  const proItem = new Map<string, AufgabenEvent[]>();
  for (const e of events.filter(gewertet)) {
    (proItem.get(e.aufgabeId) ?? proItem.set(e.aufgabeId, []).get(e.aufgabeId)!).push(e);
  }
  const eimer: EimerEintrag[] = [];
  for (const [aufgabeId, evs] of proItem) {
    evs.sort((a, b) => a.ts - b.ts);
    const letzter = evs[evs.length - 1]!;
    if (letzter.ausgang === 'falsch') {
      eimer.push({
        aufgabeId,
        skillId: letzter.skillId,
        fehlversuche: evs.filter((e) => e.ausgang === 'falsch').length,
        letzterTs: letzter.ts,
      });
    }
  }
  return eimer.sort((a, b) => b.fehlversuche - a.fehlversuche);
}

// --- Pacing (nur Steuerung, nie Bewertung) -----------------------------------

export interface Sitzung {
  vonTs: number;
  bisTs: number;
  events: AufgabenEvent[];
}

/** Events in Sitzungen schneiden (Lücke > sessionLueckeMs → neue Sitzung). */
export function sitzungen(events: AufgabenEvent[]): Sitzung[] {
  const sortiert = [...events].sort((a, b) => a.ts - b.ts);
  const out: Sitzung[] = [];
  for (const e of sortiert) {
    const akt = out[out.length - 1];
    if (akt && e.ts - akt.bisTs <= KONFIG.sessionLueckeMs) {
      akt.events.push(e);
      akt.bisTs = e.ts;
    } else {
      out.push({ vonTs: e.ts, bisTs: e.ts, events: [e] });
    }
  }
  return out;
}

export interface PacingKennzahlen {
  sitzungen: number;
  medianAufgabenProSitzung: number | null;
  medianDauerMinuten: number | null;
  abbruchQuote: number; // Anteil Events mit ausgang 'abbruch'
  skipQuote: number;    // Anteil Events mit ausgang 'skip'
}

export function pacingKennzahlen(events: AufgabenEvent[]): PacingKennzahlen {
  const s = sitzungen(events);
  const gesamt = events.length || 1;
  return {
    sitzungen: s.length,
    medianAufgabenProSitzung: medianZahl(s.map((x) => x.events.length)),
    medianDauerMinuten: medianZahl(s.map((x) => (x.bisTs - x.vonTs) / 60000)),
    abbruchQuote: events.filter((e) => e.ausgang === 'abbruch').length / gesamt,
    skipQuote: events.filter((e) => e.ausgang === 'skip').length / gesamt,
  };
}
