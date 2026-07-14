import { useMemo } from 'react'
import {
  mascotSrc,
  stateContext,
  voiceLines,
  type MascotCharacter,
  type MascotState,
} from './mascotData'
import './Mascot.css'

type Size = 'coach' | 'hero' | number

interface MascotProps {
  /** Welche Figur (Standard: Momo). */
  character?: MascotCharacter
  /** Ausdruckszustand: neutral | freude | aufmuntern. */
  state?: MascotState
  /**
   * Größe: 'coach' (~66px, in der Sprechblase),
   * 'hero' (~120px, Belohnung am Einheitsende) oder eine Pixelzahl.
   */
  size?: Size
  /**
   * Sprechblasen-Text. `true` = automatische Beispiel-Voice zum Zustand,
   * ein String = eigener Text, weglassen = keine Blase.
   */
  speech?: string | boolean
}

function pxFor(size: Size): number {
  if (size === 'coach') return 66
  if (size === 'hero') return 120
  return size
}

export function Mascot({
  character = 'momo',
  state = 'neutral',
  size = 'coach',
  speech,
}: MascotProps) {
  const src = mascotSrc(character, state)
  const px = pxFor(size)
  const ctx = stateContext[state]

  const bubbleText = useMemo(() => {
    if (speech === undefined || speech === false) return null
    if (typeof speech === 'string') return speech
    const options = voiceLines[character][state]
    return options[Math.floor(Math.random() * options.length)]
  }, [speech, character, state])

  if (!src) {
    // Figur (noch) nicht importiert — sichtbarer Platzhalter statt stillem Fehler.
    return (
      <div
        className="mascot mascot--missing"
        style={{ width: px, height: px }}
        role="img"
        aria-label={`${character} (${state}) – Asset fehlt`}
        title={`${character}-${state}.svg fehlt noch`}
      >
        {character[0].toUpperCase()}
      </div>
    )
  }

  const img = (
    <img
      className={`mascot mascot--${state}`}
      src={src}
      width={px}
      height={px}
      alt={`${character}, Zustand ${ctx.label.toLowerCase()}`}
      draggable={false}
    />
  )

  if (!bubbleText) return img

  return (
    <div className="mascot-row">
      {img}
      <div
        className="mascot-bubble"
        style={{ background: ctx.bg, borderColor: ctx.accent }}
      >
        {bubbleText}
      </div>
    </div>
  )
}
