// ---------------------------------------------------------------------------
// Nutzungslog · öffentliche API
// ---------------------------------------------------------------------------
// App-Code importiert nur von hier:
//   import { protokolliere, lueckenkarte } from '@/log';
// ---------------------------------------------------------------------------

export type {
  AufgabenEvent, Aufgabentyp, Ausgang, Fehlerkategorie, Hilfsmittel,
} from './events';
export { LOG_SCHEMA_VERSION } from './events';

export type { FehlerRegel, KlassifikationsKontext } from './klassifikation';
export { klassifiziereFehler, normalisiere } from './klassifikation';

export type {
  SkillMastery, MasteryStatus, ItemDifficulty, FehlerAnteil,
  EimerEintrag, Sitzung, PacingKennzahlen,
} from './derive';
export {
  KONFIG, STATUS_LABEL,
  skillMastery, itemDifficulty, itemUebersicht,
  fehlerVerteilung, dominierendeFehlerquelle,
  faelligkeitsListe, fehlerEimer,
  sitzungen, pacingKennzahlen,
  wilsonUntereSchranke, medianZahl,
} from './derive';

export type { ProtokollEingabe } from './nutzungslog';
export {
  protokolliere,
  skillStatus, lueckenkarte, naechsteWiederholung,
  schwerpunktFehler, skillItems, pacing, logZuruecksetzen,
} from './nutzungslog';

export type { SendeErgebnis } from './export';
export { sendeLog, logZielKonfiguriert } from './export';
