// ---------------------------------------------------------------------------
// Camp · Zeitlogik (rein, testbar)
// ---------------------------------------------------------------------------
// Naher Anker (Curriculum §5): das Feriencamp macht das Ziel sichtbar.
// Camp-Zeitraum laut Timeline: 08.–22.08.2026 (Mathe-Schwerpunkt Woche 1).
// ---------------------------------------------------------------------------

import { heutigerTag, tagDifferenz } from '../fortschritt/zustand';

export const CAMP_START = '2026-08-08';
export const CAMP_ENDE = '2026-08-22';

export type CampStatus =
  | { phase: 'vor'; tage: number }            // tage ≥ 2 bis zum Start
  | { phase: 'morgen' }                       // Start ist morgen
  | { phase: 'start' }                         // heute ist der Starttag
  | { phase: 'laeuft'; tag: number; von: number } // im Camp: Tag `tag` von `von`
  | { phase: 'vorbei' };                       // nach dem Camp

export function campStatus(heute: Date = new Date()): CampStatus {
  const tag = heutigerTag(heute);
  const bisStart = tagDifferenz(tag, CAMP_START); // > 0 → Start liegt in der Zukunft
  const bisEnde = tagDifferenz(tag, CAMP_ENDE);

  if (bisStart >= 2) return { phase: 'vor', tage: bisStart };
  if (bisStart === 1) return { phase: 'morgen' };
  if (bisStart === 0) return { phase: 'start' };
  // bisStart < 0 → Camp hat begonnen
  if (bisEnde >= 0) {
    const von = tagDifferenz(CAMP_START, CAMP_ENDE) + 1; // inklusive beider Enden
    return { phase: 'laeuft', tag: -bisStart + 1, von };
  }
  return { phase: 'vorbei' };
}
