# Curriculum — Lern-Inhalte & Aufgabentypen (Mathe-LK)

*Designgrundlage für die Lern-App. Orientiert am Bildungsplan 2016, Leistungsfach
Baden-Württemberg. Stand: Entwurf zur weiteren Bearbeitung.*

## Grundlage & Rahmen

Dem Unterricht und der Prüfung liegen die im Bildungsplan 2016 ausgewiesenen
Inhalte und Kompetenzen zugrunde. Zwei Dinge prägen das Aufgaben-Design direkt:

- **Zweigeteilte Prüfung:** Seit dem Abitur ab 2024 gibt es ein Formeldokument
  (Merkhilfe) und eine Ausrichtung an den IQB-Aufgabenpools — d. h. einen
  **hilfsmittelfreien** Prüfungsteil neben dem **GTR-Teil**.
- **Nicht prüfungsrelevant** (bewusst weggelassen): Mittelwertberechnung mithilfe
  der Integralrechnung, uneigentliche Integrale, Näherungsverfahren, Beweise mit
  Vektoren.

> Offen: Nutzt Aglajas Kurs einen **GTR** oder einen **CAS**? Das bestimmt, was
> „ohne Hilfsmittel" bei ihr genau heißt, und beeinflusst die Term-Eingabe-Aufgaben.

---

## 1 · Struktur (wie der Stoff in die App passt)

Vier Ebenen, im Duolingo-Muster:

**Leitidee → Einheit → Skill → Lektion**

- Eine **Lektion** = 5–8 Aufgaben (~3–5 Min).
- Ein **Skill** (z. B. „Kettenregel") hat mehrere **Kronen-Level**, die von stark
  angeleitet zu frei werden.
- Skills „verblassen" mit der Zeit und tauchen zur **Wiederholung** wieder auf
  (wichtig, weil zwischen Lernen und Abitur viele Monate liegen).
- Optionaler **Einstufungs-Check**, damit Bekanntes übersprungen werden kann
  (sie ist schon im LK — keine Langeweile).

---

## 2 · Die LK-Themen (drei Leitideen)

### Analysis (größter Block)
- **Funktionen & Scharen** — ganzrational, gebrochenrational, e-Funktion, ln,
  sin/cos, Wurzel; Funktionen mit Parametern
- **Ableitung** — Änderungsrate; Summen-, Faktor-, Produkt-, Quotienten-,
  Kettenregel; Ableitung von e/ln/sin/cos; im LK auch aktives Verketten
- **Kurvendiskussion** — Nullstellen, Monotonie, Extrem-/Wendepunkte, Symmetrie,
  Verhalten im Unendlichen, Scharen untersuchen
- **Integral** — Stammfunktion, Hauptsatz, bestimmtes Integral, Fläche
  unter/zwischen Kurven, Rekonstruktion
- **Anwendungen** — Extremwert-/Optimierungsprobleme, Änderungsraten im Sachkontext

### Analytische Geometrie (Vektoren & Raum)
- **Vektoren** — Rechnen, Betrag, Skalarprodukt, Winkel, lineare Abhängigkeit
- **Geraden** — Parameterform, Lagebeziehungen (parallel/schneidend/windschief),
  Schnittpunkt & -winkel
- **Ebenen** — Parameter-, Normalen-, Koordinatenform + Umwandlungen;
  Lagebeziehungen Gerade–Ebene, Ebene–Ebene
- **Abstände & Winkel** — Punkt–Gerade, Punkt–Ebene, windschiefe Geraden;
  Hessesche Normalenform

### Stochastik (Daten & Zufall)
- **Wahrscheinlichkeit** — Baumdiagramm, bedingte W., Vierfeldertafel, Unabhängigkeit
- **Zufallsgröße** — Erwartungswert, Varianz, Standardabweichung
- **Binomialverteilung** — Formel, kumuliert, µ/σ, Sigma-Regeln
- **Normalverteilung**
- **Hypothesentest** — ein-/zweiseitig, Fehler 1. & 2. Art (im LK vertieft)

> Jeder Skill bekommt einen Tag **„ohne Hilfsmittel"** oder **„mit GTR"**, um
> gezielt den Pflichtteil trainieren zu können.

---

## 3 · Aufgabentypen

**Leitgedanke:** Jede Aufgabe muss die App *automatisch* prüfen können — sonst
kein sofortiges Grün/Rot. „Diskutiere die Funktion" als Ganzes fällt damit weg;
stattdessen zerlegen wir genau solche Abituraufgaben in prüfbare Mikroschritte.

Grob von schnell nach anspruchsvoll:

1. **Single/Multiple Choice** — Konzept-Checks und Graph-Zuordnung („Welcher
   Graph gehört zu f′?"). Sekundenschnell, ideal fürs Warmwerden.
2. **Zahleneingabe** — das Arbeitspferd: Nullstelle, Extremwert, Wahrscheinlichkeit,
   Abstand. Prüfung mit Toleranz.
3. **Term-Eingabe** — Ableitung/Stammfunktion eintippen, geprüft über symbolische
   Äquivalenz (nicht Zeichen-für-Zeichen). Kernstück fürs hilfsmittelfreie
   Ableiten/Integrieren.
4. **Geführter Lückentext** — eine echte Abituraufgabe (komplette Kurvendiskussion,
   Hypothesentest) Schritt für Schritt, jeder Schritt einzeln prüfbar. Die
   „kein Scham"-Waffe: große Aufgaben werden zur Treppe statt zur Wand.
5. **Zuordnen (Matching)** — Funktion ↔ Graph, Term ↔ Ableitung, Verteilung ↔
   Erwartungswert. Drag & Drop.
6. **Reihenfolge sortieren** — Schritte eines Verfahrens ordnen (Extremwertproblem,
   Testablauf). Trainiert Prozess-Sicherheit.
7. **Graph antippen** *(später, ambitioniert)* — Extrempunkt antippen, Tangente
   ziehen. Sehr „haptisch", aber mehr Bauaufwand → Stretch-Ziel.

### Signatur-Typ: Kontextaufgabe aus Aglajas Welt
Eine kurze Anwendungsaufgabe, intern aus den Typen 2–4 zusammengesetzt, thematisch
in **Medizin / Erste Hilfe / Feuerwehr** verankert. Hier wird „Mathe zu ihrem
Werkzeug" konkret:

- **Medikamenten-Abbau im Blut** → e-Funktion, Halbwertszeit, Ableitung =
  Abbaurate, Integral = Gesamtdosis (Analysis komplett).
- **Feuerwehr-Wasserstrahl** → Wurfparabel: Scheitel = Extremwert, Reichweite =
  Nullstelle. **Drehleiter an der Hauswand** → Gerade trifft Ebene, Winkel,
  Abstand (analytische Geometrie zum Anfassen).
- **Erste-Hilfe-Quiz / „wirkt der neue Kurs besser?"** → Binomialverteilung und
  Hypothesentest mit echter Fragestellung.
- **EKG-/Pulskurve** → periodische Funktion: Amplitude, Periode, Ableitung.

Verbindet das Maskottchen-Motiv (Ersthelfer) direkt mit dem Lernen — und ist für
eine angehende Medizinerin motivierender als „ein Landwirt zäunt eine Weide ein".

---

## 4 · Mechanik, die zum Ton passt

Falsche Antwort → Maskottchen im *aufmuntern*-Zustand, sofort ein erklärender
Mikroschritt, und die Aufgabe kommt später in derselben Session nochmal
(Duolingo-„Fehler-Eimer") — **nie** ein Punktabzug. Der Streak belohnt
*Dranbleiben*, nicht Fehlerfreiheit. Genau der „Fortschritt statt Notendruck"-Anker.

---

## 5 · Naher Anker: Camp-Vorbereitung (August)

Kurzfristig einen kuratierten **„Camp-Vorbereitung"-Pfad** priorisieren:
Analysis-Grundlagen (Funktionstypen, alle Ableitungsregeln, Kettenregel) plus die
hilfsmittelfreien Ableiten-/Integrieren-Sprints. Das ist das Fundament, auf dem im
Camp fast alles aufbaut — mit Countdown wird das Camp selbst zum sichtbaren Ziel im
Gamification-Layer.

---

## Nächster Schritt

Diese Aufteilung in ein **TypeScript-Datenmodell** gießen (Leitidee / Einheit /
Skill / Lektion + Aufgabentyp-Definitionen) und **eine erste echte Einheit**
füllen — Vorschlag: **„Ableitungsregeln"** (zählt fürs Camp am meisten und zeigt
die Basis-Aufgabentypen 2, 3, 4 auf einmal).
