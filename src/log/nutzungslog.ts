// ---------------------------------------------------------------------------
// Nutzungslog · Fassade
// ---------------------------------------------------------------------------
// Was der Lektions-Player wirklich anfasst:
//   • protokolliere(...)  → ein Event schreiben (klassifiziert + persistiert).
//   • skillStatus / lueckenkarte / naechsteWiederholung / … → Read-Ableitungen.
// WICHTIG: Logging darf die Lektion NIE unterbrechen — Fehler werden geschluckt.
// ---------------------------------------------------------------------------

import type {
  AufgabenEvent, Aufgabentyp, Ausgang, Fehlerkategorie, Hilfsmittel,
} from './events';
import { klassifiziereFehler, type FehlerRegel } from './klassifikation';
import {
  appendEvent, alleEvents, eventsNachSkill, leereLog, speicherVerfuegbar,
} from './store';
import { merkeSchreibVersuch, merkeSchreibFehler, laufzeitStatus } from './laufzeit';
import {
  skillMastery, faelligkeitsListe, fehlerEimer, fehlerVerteilung,
  dominierendeFehlerquelle, itemUebersicht, pacingKennzahlen,
  type SkillMastery,
} from './derive';

function neueId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Eingabe des Lektions-Players — alles außer id/ts/fehlerkat, die wir setzen. */
export interface ProtokollEingabe {
  skillId: string;
  aufgabeId: string;
  typ: Aufgabentyp;
  hilfsmittel: Hilfsmittel;
  kronenLevel: number;
  ausgang: Ausgang;
  antwortRoh?: string;
  versuchNr: number;
  tErstEingabe?: number;
  tGesamt: number;
  wiederholung: boolean;
  /** Erwartete Lösung — nur für die Klassifikations-Heuristik. */
  erwartet?: string;
  /** Itemspezifische Fehlerregeln (empfohlen, zuverlässigster Klassifikationspfad). */
  fehlerRegeln?: FehlerRegel[];
  /** Vom Content-Layer vorab bestimmte Kategorie (z. B. gewählter Choice-Distraktor).
   *  Hat Vorrang vor Regeln/Heuristik — wer die Aufgabe kennt, klassifiziert am besten. */
  fehlerkat?: Fehlerkategorie;
  /** Freie Item-Tags — roh mitgeloggt. */
  tags?: string[];
}

/** Ein Event bauen, klassifizieren, persistieren. Wirft nie nach oben.
 *  Rückgabe: true = persistiert, false = Schreiben fehlgeschlagen (bereits geloggt). */
export async function protokolliere(e: ProtokollEingabe): Promise<boolean> {
  merkeSchreibVersuch();
  try {
    const fehlerkat: Fehlerkategorie | undefined =
      e.ausgang === 'falsch'
        ? (e.fehlerkat ?? klassifiziereFehler(
            e.antwortRoh,
            { skillId: e.skillId, typ: e.typ, erwartet: e.erwartet },
            e.fehlerRegeln ?? [],
          ))
        : undefined;

    const ev: AufgabenEvent = {
      id: neueId(),
      ts: Date.now(),
      skillId: e.skillId,
      aufgabeId: e.aufgabeId,
      typ: e.typ,
      hilfsmittel: e.hilfsmittel,
      kronenLevel: e.kronenLevel,
      ausgang: e.ausgang,
      antwortRoh: e.antwortRoh,
      fehlerkat,
      versuchNr: e.versuchNr,
      tErstEingabe: e.tErstEingabe,
      tGesamt: e.tGesamt,
      wiederholung: e.wiederholung,
      tags: e.tags,
    };
    await appendEvent(ev);
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    merkeSchreibFehler(msg);
    console.warn('[nutzungslog] Event nicht gespeichert (Lektion läuft weiter):', err);
    return false;
  }
}

// --- Read-Ableitungen (async Wrapper um Store + derive) ----------------------

export async function skillStatus(skillId: string): Promise<SkillMastery> {
  return skillMastery(await eventsNachSkill(skillId), skillId);
}

/** Lückenkarte: alle übergebenen Skills nach Fälligkeit sortiert. */
export async function lueckenkarte(skillIds: string[]): Promise<SkillMastery[]> {
  return faelligkeitsListe(await alleEvents(), skillIds);
}

export async function naechsteWiederholung() {
  return fehlerEimer(await alleEvents());
}

/** Skill-übergreifende Fehlerquelle — belegt/kippt den „empfohlenen Start". */
export async function schwerpunktFehler() {
  const ev = await alleEvents();
  return { verteilung: fehlerVerteilung(ev), dominierend: dominierendeFehlerquelle(ev) };
}

export async function skillItems(skillId: string) {
  return itemUebersicht(await eventsNachSkill(skillId), skillId);
}

export async function pacing() {
  return pacingKennzahlen(await alleEvents());
}

/** Reset (z. B. für ein Debug-/Datenschutz-Menü). */
export async function logZuruecksetzen(): Promise<void> {
  return leereLog();
}

export interface LogDiagnose {
  /** Lässt sich der Store überhaupt öffnen? */
  verfuegbar: boolean;
  /** Anzahl gespeicherter Events (null = Lesen fehlgeschlagen). */
  anzahl: number | null;
  /** Fehlermeldung, falls das Lesen scheiterte. */
  lesefehler?: string;
  /** Schreibversuche seit App-Start (diese Sitzung). */
  schreibVersuche: number;
  /** Davon fehlgeschlagen — der eigentliche „stille Datenverlust"-Zähler. */
  schreibFehler: number;
  /** Meldung des letzten Schreibfehlers. */
  letzterSchreibFehler?: string;
}

/**
 * Ehrlicher Gesundheits-Check. Für ein Debug-Menü und dafür, „Store leer" von
 * „Store kaputt" / „Schreiben schlug fehl" zu unterscheiden. Wirft nie.
 */
export async function logDiagnose(): Promise<LogDiagnose> {
  const rt = laufzeitStatus();
  let verfuegbar = false;
  let anzahl: number | null = null;
  let lesefehler: string | undefined;
  try {
    verfuegbar = await speicherVerfuegbar();
    anzahl = (await alleEvents()).length;
  } catch (err) {
    lesefehler = err instanceof Error ? err.message : String(err);
  }
  return {
    verfuegbar,
    anzahl,
    lesefehler,
    schreibVersuche: rt.schreibVersuche,
    schreibFehler: rt.schreibFehler,
    letzterSchreibFehler: rt.letzterSchreibFehler,
  };
}
