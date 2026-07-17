// ---------------------------------------------------------------------------
// Nutzungslog · Persistenz (IndexedDB, append-only)
// ---------------------------------------------------------------------------
// Bewusst IndexedDB statt localStorage: strukturiert, indexierbar, wächst mit.
// Diese Datei macht AUSSCHLIESSLICH Persistenz — keine KPI-Logik. Dadurch sind
// die Ableitungsfunktionen (derive.ts) rein und ohne Browser testbar.
// ---------------------------------------------------------------------------

import type { AufgabenEvent } from './events';

const DB_NAME = 'lernapp-log';
const DB_VERSION = 1;
const STORE = 'events';

let dbPromise: Promise<IDBDatabase> | null = null;

function oeffneDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB nicht verfügbar (kein Browser-Kontext).'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const os = db.createObjectStore(STORE, { keyPath: 'id' });
        os.createIndex('skillId', 'skillId', { unique: false });
        os.createIndex('aufgabeId', 'aufgabeId', { unique: false });
        os.createIndex('ts', 'ts', { unique: false });
      }
    };
    // Blockiert = eine ältere Verbindung hält die DB offen. Auf iOS-Safari kann
    // das nach App-Wechseln vorkommen; als Fehler behandeln statt ewig hängen.
    req.onblocked = () => reject(new Error('IndexedDB-Öffnen blockiert (andere Verbindung offen).'));
    req.onsuccess = () => {
      const conn = req.result;
      // Verbindung, die serverseitig weg-migriert oder geschlossen wird, nicht
      // weiter im Cache halten — sonst scheitern alle Folge-Transaktionen still.
      conn.onversionchange = () => { conn.close(); dbPromise = null; };
      conn.onclose = () => { dbPromise = null; };
      resolve(conn);
    };
    req.onerror = () => reject(req.error);
  });
}

function db(): Promise<IDBDatabase> {
  if (!dbPromise) {
    const p = oeffneDb();
    // Eine ABGELEHNTE Promise niemals cachen: sonst ist der Store nach einem
    // einzigen fehlgeschlagenen open für die ganze Sitzung vergiftet (jeder
    // spätere Write/Read reitet auf derselben toten Promise). Beim Fehlschlag
    // Cache leeren, damit der nächste Aufruf frisch öffnet (iOS flaket beim
    // ersten open nach Kaltstart gern).
    p.catch(() => { if (dbPromise === p) dbPromise = null; });
    dbPromise = p;
  }
  return dbPromise;
}

/**
 * Leichte Verfügbarkeits-Probe: Kann der Store geöffnet werden? Wirft nie.
 * Für Diagnose/UI — unterscheidet „Store kaputt/unlesbar" von „Store leer".
 */
export async function speicherVerfuegbar(): Promise<boolean> {
  try {
    await db();
    return true;
  } catch {
    return false;
  }
}

/** Ein Event anhängen (append-only; bestehende werden nie überschrieben). */
export async function appendEvent(ev: AufgabenEvent): Promise<void> {
  const conn = await db();
  await new Promise<void>((resolve, reject) => {
    const tx = conn.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).add(ev);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Alle Events (für Gesamt-Ableitungen wie fehlerVerteilung über alle Skills). */
export async function alleEvents(): Promise<AufgabenEvent[]> {
  const conn = await db();
  return new Promise((resolve, reject) => {
    const tx = conn.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result as AufgabenEvent[]);
    req.onerror = () => reject(req.error);
  });
}

/** Events eines Skills (indexiert). */
export async function eventsNachSkill(skillId: string): Promise<AufgabenEvent[]> {
  const conn = await db();
  return new Promise((resolve, reject) => {
    const tx = conn.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).index('skillId').getAll(skillId);
    req.onsuccess = () => resolve(req.result as AufgabenEvent[]);
    req.onerror = () => reject(req.error);
  });
}

/** Events einer Aufgabe (indexiert). */
export async function eventsNachAufgabe(aufgabeId: string): Promise<AufgabenEvent[]> {
  const conn = await db();
  return new Promise((resolve, reject) => {
    const tx = conn.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).index('aufgabeId').getAll(aufgabeId);
    req.onsuccess = () => resolve(req.result as AufgabenEvent[]);
    req.onerror = () => reject(req.error);
  });
}

/** Events ab Zeitpunkt (indexiert, für Zeitfenster/Sessions). */
export async function eventsSeit(ts: number): Promise<AufgabenEvent[]> {
  const conn = await db();
  return new Promise((resolve, reject) => {
    const tx = conn.transaction(STORE, 'readonly');
    const range = IDBKeyRange.lowerBound(ts);
    const req = tx.objectStore(STORE).index('ts').getAll(range);
    req.onsuccess = () => resolve(req.result as AufgabenEvent[]);
    req.onerror = () => reject(req.error);
  });
}

/** Die n jüngsten Events (Cursor rückwärts über den ts-Index). */
export async function letzteEvents(n: number): Promise<AufgabenEvent[]> {
  const conn = await db();
  return new Promise((resolve, reject) => {
    const tx = conn.transaction(STORE, 'readonly');
    const cursorReq = tx.objectStore(STORE).index('ts').openCursor(null, 'prev');
    const out: AufgabenEvent[] = [];
    cursorReq.onsuccess = () => {
      const cur = cursorReq.result;
      if (cur && out.length < n) {
        out.push(cur.value as AufgabenEvent);
        cur.continue();
      } else {
        resolve(out);
      }
    };
    cursorReq.onerror = () => reject(cursorReq.error);
  });
}

/** Kompletten Log leeren (Reset-Option / Tests). */
export async function leereLog(): Promise<void> {
  const conn = await db();
  await new Promise<void>((resolve, reject) => {
    const tx = conn.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
