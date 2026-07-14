# Mathe mit Momo — Lern-App (PWA-Gerüst)

Persönliche Mathe-Lern-App für Aglaja. Progressive Web App mit **Vite + React +
TypeScript**, installierbar auf iPhone/iPad über Safari
(„Zum Home-Bildschirm hinzufügen"), offline-fähig.

## Loslegen

```bash
npm install        # einmalig
npm run dev        # Entwicklungsserver (http://localhost:5173)
npm run build      # Produktions-Build nach dist/
npm run preview    # gebauten Build lokal ansehen
```

## Auf dem iPad/iPhone installieren

1. `dist/` irgendwo hosten (z. B. Netlify, Vercel, GitHub Pages) — oder im
   selben WLAN `npm run dev -- --host` und die Netzwerk-URL in Safari öffnen.
2. In **Safari** öffnen → Teilen-Symbol → **„Zum Home-Bildschirm"**.
3. Die App startet danach im Vollbild wie eine native App und läuft offline.

## Projektstruktur

```
src/
  main.tsx              Einstiegspunkt
  App.tsx               Demo-Screen (Feedback-Loop, Zustand-/Figur-Umschalter)
  index.css             Design-Tokens + „Press"-Buttons
  mascot/
    Mascot.tsx          Die Maskottchen-Komponente
    Mascot.css          Zustands-Animationen + Sprechblase
    mascotData.ts       Zustände, Kontextfarben, Voice-Zeilen, SVG-Zuordnung
  assets/mascots/       Die Maskottchen-SVGs (aus dem Design-Handoff)
public/                 PWA-Icons (aus dem Maskottchen gerendert)
vite.config.ts          Vite + PWA-Konfiguration (Manifest, Service Worker)
```

## Die `Mascot`-Komponente

```tsx
<Mascot character="momo" state="neutral" size="hero" />
<Mascot character="pi" state="freude" size="coach" speech />
<Mascot state="aufmuntern" speech="Kein Ding — noch mal von vorn!" />
```

| Prop        | Werte                                             | Standard  |
| ----------- | ------------------------------------------------- | --------- |
| `character` | `momo` · `pi` · `gauss`                           | `momo`    |
| `state`     | `neutral` · `freude` · `aufmuntern`               | `neutral` |
| `size`      | `coach` (~66px) · `hero` (~120px) · Pixelzahl     | `coach`   |
| `speech`    | `true` (Auto-Voice) · eigener Text · weglassen    | –         |

Die SVGs werden als `<img>` gerendert: jede Figur bleibt ein isoliertes
Dokument (keine ID-Kollisionen), pixelgenau aus dem Handoff. Pro Zustand gibt es
eine dezente Mikro-Animation (Atmen / Hüpfen / Wippen), die bei
`prefers-reduced-motion` automatisch aussetzt.

## Stand der Maskottchen-Assets

- **Momo** (3 Zustände): **byte-genau** aus dem Design-Handoff übernommen.
- **Pi** (3 Zustände): aus den verifizierten Momo-Dateien abgeleitet — exakte
  Fell-Hexwerte laut Handoff-README plus π-Abzeichen — und visuell gegen die
  Referenz geprüft.
- **Gauß** (3 Zustände): **importiert und aktiv.** Als direkter SVG-Text
  eingefügt (der zuverlässige Weg — kein Konvertierungsverlust), validiert und
  gerendert. Gauß ist ein eigenständiger Gorilla mit eigener Geometrie; die
  x-Kontur des Helmabzeichens ist in allen drei Zuständen konsistent Gold
  (`#E8B33C`) als seine Signaturfarbe. Der Gauß-Button ist in der App aktiv.

Damit sind **alle drei Figuren in allen drei Zuständen vollständig** (9/9 SVGs).
