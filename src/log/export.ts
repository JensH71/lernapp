// ---------------------------------------------------------------------------
// Nutzungslog · Export an ein privates Google Sheet
// ---------------------------------------------------------------------------
// Für GitHub-Pages-Hosting (statisch, kein eigener Server): Der „Fertig für
// heute"-Knopf schickt den gesamten Log an ein Apps-Script-`doPost`, das die
// Zeilen an ein privates Sheet in deinem Drive anhängt.
//
// Warum den GANZEN Log statt eines Cursors: bei einer Lernerin ist das Volumen
// winzig, und das Apps-Script dedupliziert über die Event-`id` — wiederholtes
// Senden ist damit unbedenklich und wir brauchen keinen Sync-Zustand.
//
// Ziel-URL + Token kommen aus Vite-Env-Variablen (siehe .env.example). Auf der
// öffentlichen Seite landet die URL im Bundle; das Token ist nur eine Bremse
// gegen Zufallsmüll, der Schutz liegt darin, dass das Sheet privat ist.
// ---------------------------------------------------------------------------

import type { AufgabenEvent } from './events';
import { alleEvents } from './store';

const env = import.meta.env ?? {};
const ZIEL_URL: string | undefined = env.VITE_LOG_SHEET_URL;
const TOKEN: string | undefined = env.VITE_LOG_SHEET_TOKEN;

export function logZielKonfiguriert(): boolean {
  return typeof ZIEL_URL === 'string' && ZIEL_URL.length > 0;
}

export interface SendeErgebnis {
  ok: boolean;
  anzahl: number;
  grund?: 'nicht-konfiguriert' | 'leer' | 'netzwerk';
}

/** Gesamten Log an das Sheet senden. Idempotent (Server dedupliziert per id). */
export async function sendeLog(): Promise<SendeErgebnis> {
  if (!logZielKonfiguriert()) return { ok: false, anzahl: 0, grund: 'nicht-konfiguriert' };

  let events: AufgabenEvent[] = [];
  try {
    events = await alleEvents();
  } catch {
    events = [];
  }
  if (events.length === 0) return { ok: false, anzahl: 0, grund: 'leer' };

  try {
    // no-cors + text/plain: fire-and-forget, kein CORS-Preflight. Die Antwort
    // ist opak (nicht lesbar) — „ok" heißt hier „Request rausgegangen". Dank
    // Dedup ist ein evtl. serverseitiger Fehlschlag beim nächsten Mal geheilt.
    await fetch(ZIEL_URL as string, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ token: TOKEN ?? '', events }),
      keepalive: true,
    });
    return { ok: true, anzahl: events.length };
  } catch {
    return { ok: false, anzahl: events.length, grund: 'netzwerk' };
  }
}
