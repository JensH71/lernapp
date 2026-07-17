// ---------------------------------------------------------------------------
// Nutzungslog · Laufzeit-Zähler (Sitzung)
// ---------------------------------------------------------------------------
// Winziges, geteiltes Modul: der Writer (nutzungslog.ts) meldet hier jeden
// Schreibversuch und -fehler, der Export (export.ts) und die Diagnose lesen es.
// Zweck: stille Persistenz-Fehler sichtbar machen, ohne dass die Lektion je
// unterbrochen wird. Bewusst getrennt, um einen Import-Zyklus writer↔export
// zu vermeiden. Zustand lebt nur für die laufende Sitzung (kein Persistenz-Bedarf).
// ---------------------------------------------------------------------------

let schreibVersuche = 0;
let schreibFehler = 0;
let letzterSchreibFehler: string | undefined;

export function merkeSchreibVersuch(): void {
  schreibVersuche += 1;
}

export function merkeSchreibFehler(nachricht: string): void {
  schreibFehler += 1;
  letzterSchreibFehler = nachricht;
}

export interface LaufzeitStatus {
  /** Schreibversuche seit App-Start (diese Sitzung). */
  schreibVersuche: number;
  /** Davon fehlgeschlagen (Event NICHT persistiert). */
  schreibFehler: number;
  /** Meldung des letzten Schreibfehlers, falls vorhanden. */
  letzterSchreibFehler?: string;
}

export function laufzeitStatus(): LaufzeitStatus {
  return { schreibVersuche, schreibFehler, letzterSchreibFehler };
}
