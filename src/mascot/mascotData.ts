// Datenmodell für die Maskottchen-Coaches.
// Die drei Ausdruckszustände und Kontextfarben folgen exakt dem Design-Handoff.

export type MascotState = 'neutral' | 'freude' | 'aufmuntern'
export type MascotCharacter = 'momo' | 'pi' | 'gauss'

// Alle SVGs aus assets/mascots als URL einlesen (Vite bündelt sie als Assets).
// Als <img>-Quelle gerendert bleibt jede Figur ein isoliertes Dokument –
// keine ID-Kollisionen, pixelgenaue Übernahme aus dem Handoff.
const files = import.meta.glob('../assets/mascots/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

function resolve(character: MascotCharacter, state: MascotState): string | null {
  const key = `../assets/mascots/${character}-${state}.svg`
  return files[key] ?? null
}

// Kontextfarben je Zustand (Hintergrund der Sprechblase / Feedback-Fläche).
export const stateContext: Record<
  MascotState,
  { bg: string; accent: string; label: string }
> = {
  neutral: { bg: '#EEF5FF', accent: '#2B2340', label: 'Neutral' },
  freude: { bg: '#EEF9E4', accent: '#5BBF1E', label: 'Freude' },
  aufmuntern: { bg: '#FFEFEF', accent: '#FF4B4B', label: 'Aufmuntern' },
}

// Beispiel-Voice pro Figur & Zustand (aus dem Handoff bzw. im selben Ton).
export const voiceLines: Record<MascotCharacter, Record<MascotState, string[]>> = {
  momo: {
    neutral: ["Hm, spannend! Was passiert wohl, wenn wir's so probieren?"],
    freude: ['Stark! Wusste ich doch, dass du das kannst.', 'Yes! Weiter so.'],
    aufmuntern: [
      'Kein Ding — noch mal von vorn, ich bin dabei.',
      'Fast! Lass uns das zusammen anschauen.',
    ],
  },
  pi: {
    neutral: ["Hm, spannend! Was passiert wohl, wenn wir's so probieren?"],
    freude: ['Sauber gerechnet!', 'Genau so — π wäre stolz.'],
    aufmuntern: ['Halb so wild, wir kriegen das raus.', 'Nächster Versuch, ganz ruhig.'],
  },
  gauss: {
    neutral: ['Hmpf. Na gut — zeig mal her. Das kriegen wir hin.'],
    freude: ['Nicht schlecht. Gar nicht schlecht.'],
    aufmuntern: ['Ruhig Blut — jede Aufgabe hat einen Weg.'],
  },
}

export const characters: MascotCharacter[] = ['momo', 'pi', 'gauss']
export const states: MascotState[] = ['neutral', 'freude', 'aufmuntern']

export function mascotSrc(
  character: MascotCharacter,
  state: MascotState,
): string | null {
  return resolve(character, state)
}

export function hasCharacter(character: MascotCharacter): boolean {
  return states.every((s) => resolve(character, s) !== null)
}
