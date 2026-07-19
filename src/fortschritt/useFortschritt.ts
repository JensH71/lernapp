// ---------------------------------------------------------------------------
// Fortschritt · React-Hook
// ---------------------------------------------------------------------------
// Dünne React-Schicht über zustand.ts. Hält den Zustand in useState (initial
// aus localStorage geladen) und schreibt bei jeder Änderung durch. Die
// eigentliche Logik lebt in den pure Updatern — hier nur Verdrahtung.
// ---------------------------------------------------------------------------

import { useCallback, useState } from 'react';
import {
  type AppZustand,
  ladeZustand,
  speichereZustand,
  mitAbschluss,
  istAbgeschlossen,
  istSpeicherOk,
  fortschrittZuruecksetzen,
} from './zustand';

export interface FortschrittApi {
  zustand: AppZustand;
  /** Eine Lektion als abgeschlossen verbuchen (aktualisiert Streak-Grundlage). */
  lektionAbschliessen: (lektionId: string, krone: number) => void;
  /** Ist diese Lektion schon einmal abgeschlossen? */
  abgeschlossen: (lektionId: string) => boolean;
  /** Fortschritt zurücksetzen (Debug/Datenschutz). */
  zuruecksetzen: () => void;
  /** false, wenn localStorage nicht schreibbar ist (ehrliches Signal). */
  speicherOk: boolean;
}

export function useFortschritt(): FortschrittApi {
  const [zustand, setZustand] = useState<AppZustand>(() => ladeZustand());

  const lektionAbschliessen = useCallback((lektionId: string, krone: number) => {
    setZustand((z) => {
      const next = mitAbschluss(z, lektionId, krone);
      speichereZustand(next);
      return next;
    });
  }, []);

  const abgeschlossen = useCallback(
    (lektionId: string) => istAbgeschlossen(zustand, lektionId),
    [zustand],
  );

  const zuruecksetzen = useCallback(() => {
    fortschrittZuruecksetzen();
    setZustand(ladeZustand());
  }, []);

  return { zustand, lektionAbschliessen, abgeschlossen, zuruecksetzen, speicherOk: istSpeicherOk() };
}
