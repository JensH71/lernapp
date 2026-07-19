// ---------------------------------------------------------------------------
// Fortschritt · öffentliche API
// ---------------------------------------------------------------------------
export type {
  AppZustand, LektionFortschritt, StreakZustand,
} from './zustand';
export {
  FORTSCHRITT_SCHEMA_VERSION,
  heutigerTag, tagDifferenz,
  leererZustand, mitAbschluss, istAbgeschlossen, migriere,
  ladeZustand, speichereZustand, istSpeicherOk, fortschrittZuruecksetzen,
} from './zustand';

export type { FortschrittApi } from './useFortschritt';
export { useFortschritt } from './useFortschritt';
