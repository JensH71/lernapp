// ---------------------------------------------------------------------------
// Nutzungslog · Fehler-Klassifikation
// ---------------------------------------------------------------------------
// Der wertvollste Teil des Loops: aus antwortRoh das WARUM ableiten, nicht nur
// „falsch" buchen. (-3)³ als -9 verrät einen Potenz-, nicht Vorzeichenfehler.
//
// Zuverlässigkeit ehrlich eingeordnet:
//   • ZUVERLÄSSIG  = itemspezifische Autorenregeln (bekannte Distraktoren →
//     Kategorie). Das ist der primäre Pfad. Pro Aufgabe im Datenmodell zu
//     hinterlegen (optionaler Integrations-Haken, siehe README).
//   • APPROXIMIERT = die eingebaute Heuristik. Bewusst konservativ: sie fängt
//     nur den eindeutigen Fall (exakter Vorzeichen-Flip bei Zahleneingabe) und
//     lässt sonst 'unklar' stehen, statt zu raten.
//
// Term-Äquivalenz (richtig/falsch) prüft weiterhin dein Polynom-Normalizer aus
// dem Einstufungstest — DIESE Datei beantwortet nur „warum falsch".
// ---------------------------------------------------------------------------

import type { Aufgabentyp, Fehlerkategorie } from './events';

export interface KlassifikationsKontext {
  skillId: string;
  typ: Aufgabentyp;
  /** Erwartete Lösung (für die Zahleneingabe-Heuristik). */
  erwartet?: string;
}

/** Itemspezifische Regel: bekannter Fehler-Distraktor → Kategorie. */
export interface FehlerRegel {
  /** RegExp gegen die normalisierte Antwort ODER eigenes Prädikat. */
  wenn: RegExp | ((antwort: string, kontext: KlassifikationsKontext) => boolean);
  kategorie: Fehlerkategorie;
}

/** Vereinheitlicht Eingaben: trim, klein, ohne Leerraum, Komma→Punkt. */
export function normalisiere(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, '').replace(/,/g, '.');
}

/**
 * Ordnet einer Falsch-Antwort eine Fehlerkategorie zu.
 * @param antwortRoh die tatsächliche Eingabe
 * @param kontext    Skill/Typ/erwartete Lösung
 * @param regeln     itemspezifische Autorenregeln (empfohlen)
 */
export function klassifiziereFehler(
  antwortRoh: string | undefined,
  kontext: KlassifikationsKontext,
  regeln: FehlerRegel[] = [],
): Fehlerkategorie {
  if (antwortRoh == null || antwortRoh.trim() === '') return 'unklar';
  const a = normalisiere(antwortRoh);

  // 1) Autorenregeln (zuverlässig, itemspezifisch) — haben Vorrang.
  for (const r of regeln) {
    const treffer = r.wenn instanceof RegExp
      ? r.wenn.test(a)
      : r.wenn(antwortRoh, kontext);
    if (treffer) return r.kategorie;
  }

  // 2) Heuristik (nur Zahleneingabe, nur der eindeutige Vorzeichen-Flip).
  if (kontext.typ === 'zahl' && kontext.erwartet != null) {
    const soll = Number(normalisiere(kontext.erwartet));
    const ist = Number(a);
    if (Number.isFinite(soll) && Number.isFinite(ist) && soll !== 0 && ist === -soll) {
      return 'vorzeichen';
    }
  }

  return 'unklar';
}
