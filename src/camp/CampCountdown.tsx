// ---------------------------------------------------------------------------
// Camp · Countdown-Banner
// ---------------------------------------------------------------------------
// Sichtbares, ermutigendes Ziel im Gamification-Layer (Curriculum §5). Kein
// Druck, kein Countdown-Alarmismus — ein warmer Hinweis „darauf arbeiten wir hin".
// ---------------------------------------------------------------------------

import type { CSSProperties } from 'react';
import { campStatus } from './campZeit';

function texte(): { titel: string; unterzeile: string } | null {
  const s = campStatus();
  switch (s.phase) {
    case 'vor':
      return { titel: `Noch ${s.tage} Tage bis zum Camp`, unterzeile: 'Schritt für Schritt — genau darauf arbeiten wir hin. 🏕️' };
    case 'morgen':
      return { titel: 'Morgen geht’s los!', unterzeile: 'Das Camp startet morgen. Du hast das vorbereitet. 🏕️' };
    case 'start':
      return { titel: 'Heute startet das Camp!', unterzeile: 'Viel Freude — du bist bereit. 🎉' };
    case 'laeuft':
      return { titel: `Camp läuft — Tag ${s.tag} von ${s.von}`, unterzeile: 'Dranbleiben, du machst das stark. 🔥' };
    case 'vorbei':
      return null; // nach dem Camp kein Banner
  }
}

const banner: CSSProperties = {
  background: 'linear-gradient(135deg, #fff3ea, #ffe6d3)',
  border: '1px solid #ffd9bd',
  borderRadius: 18,
  padding: '14px 18px',
  margin: '4px 0 22px',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export function CampCountdown() {
  const t = texte();
  if (!t) return null;
  return (
    <div style={banner} role="status" aria-live="polite">
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: '1.15rem',
          color: 'var(--accent-edge)',
        }}
      >
        {t.titel}
      </span>
      <span style={{ color: '#8a5a2b', fontSize: '.92rem', lineHeight: 1.4 }}>
        {t.unterzeile}
      </span>
    </div>
  );
}
