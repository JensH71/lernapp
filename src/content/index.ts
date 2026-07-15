import type { Aufgabe, Einheit, Leitidee } from "./types";
import { rechensicherheit } from "./rechensicherheit";

export * from "./types";
export { rechensicherheit };

/**
 * Foundational-Leitidee für die Rechen- und Term-Grundlagen (nicht eine der drei
 * Abitur-Leitideen Analysis/Geometrie/Stochastik, sondern deren Voraussetzung).
 * Die weiteren Einstufungstest-Bereiche (Terme umformen, Substitution,
 * Definitionsmengen) reihen sich später hier ein.
 */
export const fundament: Leitidee = {
  id: "fundament",
  titel: "Fundament — Rechnen & Terme",
  einheiten: [rechensicherheit],
};

/** Flache Liste aller Aufgaben einer Einheit — praktisch für Zähler/Tests. */
export function alleAufgaben(einheit: Einheit): Aufgabe[] {
  return einheit.skills.flatMap((s) =>
    s.lektionen.flatMap((l) => l.aufgaben),
  );
}
