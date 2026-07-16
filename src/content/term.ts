// ---------------------------------------------------------------------------
// Term-Äquivalenz über Polynom-Normalisierung
// ---------------------------------------------------------------------------
// Prüft, ob zwei Term-Eingaben mathematisch gleich sind — nicht Zeichen für
// Zeichen. (a-b)² und a²-2ab+b² gelten als gleich. Ansatz: parsen → zu einer
// Summe von Monomen ausmultiplizieren → kanonisch vergleichen.
//
// BEWUSSTE GRENZE (ehrlich): abgedeckt ist die Polynom-Algebra, die die
// Fundament-/Terme-Einheiten brauchen — ganzzahlige/rationale Koeffizienten,
// Variablen, + − * , Klammern, unäres Minus, nicht-negative ganzzahlige
// Exponenten, Division NUR durch eine konstante Zahl. Alles andere (Variable im
// Nenner, Wurzeln, e/ln/sin, negative/gebrochene Exponenten) → null. Für solche
// Fälle trägt die Aufgabe `akzeptiert`-Alternativen (siehe pruefe.ts).
// ---------------------------------------------------------------------------

// --- Bruch (rationale Koeffizienten, gekürzt, Vorzeichen im Zähler) ----------

interface Bruch {
  z: number; // Zähler
  n: number; // Nenner > 0
}

function ggt(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

function bruch(z: number, n: number): Bruch {
  if (n === 0) throw new Error('Division durch 0');
  if (n < 0) { z = -z; n = -n; }
  const g = ggt(z, n);
  return { z: z / g, n: n / g };
}

const bAdd = (a: Bruch, b: Bruch) => bruch(a.z * b.n + b.z * a.n, a.n * b.n);
const bMul = (a: Bruch, b: Bruch) => bruch(a.z * b.z, a.n * b.n);
const bIstNull = (a: Bruch) => a.z === 0;

// --- Polynom = Map<Monom-Schlüssel, Koeffizient> -----------------------------
// Monom-Schlüssel: Variablen alphabetisch sortiert, z. B. "a^1*b^2"; "" = Konstante.

type Polynom = Map<string, Bruch>;

function monomSchluessel(vars: Map<string, number>): string {
  return [...vars.entries()]
    .filter(([, e]) => e !== 0)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([v, e]) => `${v}^${e}`)
    .join('*');
}

function polySetze(p: Polynom, schluessel: string, koeff: Bruch): void {
  const alt = p.get(schluessel);
  const neu = alt ? bAdd(alt, koeff) : koeff;
  if (bIstNull(neu)) p.delete(schluessel);
  else p.set(schluessel, neu);
}

const polyKonst = (b: Bruch): Polynom => (bIstNull(b) ? new Map() : new Map([['', b]]));
const polyVar = (v: string): Polynom => new Map([[`${v}^1`, bruch(1, 1)]]);

function polyAdd(a: Polynom, b: Polynom): Polynom {
  const out: Polynom = new Map(a);
  for (const [k, v] of b) polySetze(out, k, v);
  return out;
}

/** Monom-Schlüssel in Variablen-Exponenten-Map zurückwandeln. */
function parseSchluessel(k: string): Map<string, number> {
  const m = new Map<string, number>();
  if (k === '') return m;
  for (const teil of k.split('*')) {
    const [v, e] = teil.split('^');
    m.set(v!, (m.get(v!) ?? 0) + Number(e));
  }
  return m;
}

function polyMul(a: Polynom, b: Polynom): Polynom {
  const out: Polynom = new Map();
  for (const [ka, va] of a) {
    for (const [kb, vb] of b) {
      const vars = parseSchluessel(ka);
      for (const [v, e] of parseSchluessel(kb)) vars.set(v, (vars.get(v) ?? 0) + e);
      polySetze(out, monomSchluessel(vars), bMul(va, vb));
    }
  }
  return out;
}

function polyPot(a: Polynom, e: number): Polynom {
  let out = polyKonst(bruch(1, 1));
  for (let i = 0; i < e; i++) out = polyMul(out, a);
  return out;
}

/** Ist das Polynom eine reine (von 0 verschiedene) Konstante? → Bruch, sonst null. */
function alsKonstante(p: Polynom): Bruch | null {
  if (p.size === 0) return bruch(0, 1);
  if (p.size === 1 && p.has('')) return p.get('')!;
  return null;
}

// --- Tokenizer ---------------------------------------------------------------

type Token =
  | { t: 'zahl'; wert: number }
  | { t: 'var'; wert: string }
  | { t: 'op'; wert: '+' | '-' | '*' | '/' | '^' }
  | { t: '(' } | { t: ')' };

/** Funktionsnamen, die klar außerhalb der Polynom-Reichweite liegen. */
const FUNKTIONEN = new Set([
  'sin', 'cos', 'tan', 'cot', 'sinh', 'cosh', 'tanh',
  'arcsin', 'arccos', 'arctan', 'ln', 'log', 'lg', 'exp', 'sqrt', 'abs', 'wurzel',
]);

function tokenize(s: string): Token[] | null {
  const tokens: Token[] = [];
  let i = 0;
  const clean = s.replace(/\s+/g, '');
  while (i < clean.length) {
    const c = clean[i]!;
    if (c >= '0' && c <= '9') {
      let j = i;
      while (j < clean.length && clean[j]! >= '0' && clean[j]! <= '9') j++;
      tokens.push({ t: 'zahl', wert: Number(clean.slice(i, j)) });
      i = j;
    } else if (/[a-zA-Z]/.test(c)) {
      // Zusammenhängenden Buchstabenlauf lesen: bekannter Funktionsname →
      // außerhalb der Reichweite; sonst jeder Buchstabe eine Variable (ab = a*b).
      let j = i;
      while (j < clean.length && /[a-zA-Z]/.test(clean[j]!)) j++;
      const lauf = clean.slice(i, j);
      if (FUNKTIONEN.has(lauf.toLowerCase())) return null;
      for (const ch of lauf) tokens.push({ t: 'var', wert: ch });
      i = j;
    } else if (c === '+' || c === '-' || c === '*' || c === '/' || c === '^') {
      tokens.push({ t: 'op', wert: c });
      i++;
    } else if (c === '(') { tokens.push({ t: '(' }); i++; }
    else if (c === ')') { tokens.push({ t: ')' }); i++; }
    else return null; // unbekanntes Zeichen (z. B. '.') → außerhalb der Reichweite
  }
  return tokens;
}

// --- Recursive-Descent-Parser mit impliziter Multiplikation ------------------

class Parser {
  private pos = 0;
  constructor(private readonly tok: Token[]) {}

  private peek(): Token | undefined { return this.tok[this.pos]; }
  private next(): Token | undefined { return this.tok[this.pos++]; }

  parse(): Polynom {
    const p = this.expr();
    if (this.pos !== this.tok.length) throw new Error('Unerwartetes Token');
    return p;
  }

  // expr := term (('+'|'-') term)*
  private expr(): Polynom {
    let links = this.term();
    for (;;) {
      const t = this.peek();
      if (t?.t === 'op' && (t.wert === '+' || t.wert === '-')) {
        this.next();
        const rechts = this.term();
        links = t.wert === '+'
          ? polyAdd(links, rechts)
          : polyAdd(links, polyMul(polyKonst(bruch(-1, 1)), rechts));
      } else break;
    }
    return links;
  }

  // term := faktor (('*'|'/'|implizit) faktor)*
  private term(): Polynom {
    let links = this.faktor();
    for (;;) {
      const t = this.peek();
      if (t?.t === 'op' && t.wert === '*') { this.next(); links = polyMul(links, this.faktor()); }
      else if (t?.t === 'op' && t.wert === '/') {
        this.next();
        const teiler = this.faktor();
        const k = alsKonstante(teiler);
        if (k == null || bIstNull(k)) throw new Error('Division nur durch Konstante ≠ 0');
        links = polyMul(links, polyKonst(bruch(k.n, k.z)));
      } else if (t?.t === 'zahl' || t?.t === 'var' || t?.t === '(') {
        // implizite Multiplikation: 2a, ab, 3(x+1), (a+b)(a-b)
        links = polyMul(links, this.faktor());
      } else break;
    }
    return links;
  }

  // faktor := basis ('^' zahl)?
  private faktor(): Polynom {
    const basis = this.basis();
    const t = this.peek();
    if (t?.t === 'op' && t.wert === '^') {
      this.next();
      const e = this.next();
      if (e?.t !== 'zahl' || !Number.isInteger(e.wert) || e.wert < 0) {
        throw new Error('Exponent muss nicht-negativ ganzzahlig sein');
      }
      return polyPot(basis, e.wert);
    }
    return basis;
  }

  // basis := zahl | var | '(' expr ')' | '-' faktor | '+' faktor
  private basis(): Polynom {
    const t = this.next();
    if (t == null) throw new Error('Unerwartetes Ende');
    if (t.t === 'zahl') return polyKonst(bruch(t.wert, 1));
    if (t.t === 'var') return polyVar(t.wert);
    if (t.t === '(') {
      const p = this.expr();
      if (this.next()?.t !== ')') throw new Error('Klammer nicht geschlossen');
      return p;
    }
    if (t.t === 'op' && t.wert === '-') return polyMul(polyKonst(bruch(-1, 1)), this.faktor());
    if (t.t === 'op' && t.wert === '+') return this.faktor();
    throw new Error('Unerwartetes Token in basis');
  }
}

/**
 * Anzeige-Schreibweisen auf die ASCII-Syntax des Parsers bringen:
 * Unicode-Hochzahlen → ^ziffern, echtes Minus/Gedankenstrich → -, ·×✕ → *, : → /.
 * (Deckt die Eingaben ab, die der Lektions-Player von der Tastatur / aus `frage` bekommt.)
 */
const HOCHZAHL: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-',
};
function vorverarbeite(s: string): string {
  return s
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (m) => '^' + m.split('').map((c) => HOCHZAHL[c]).join(''))
    .replace(/[−–—]/g, '-')
    .replace(/[·×✕]/g, '*')
    .replace(/:/g, '/');
}

/** Kanonische Form eines Terms, oder null wenn außerhalb der Polynom-Reichweite. */
export function normalisiereTerm(roh: string): string | null {
  const s = vorverarbeite(roh);
  if (s.trim() === '') return null;
  const tok = tokenize(s);
  if (tok == null) return null;
  try {
    const poly = new Parser(tok).parse();
    return kanonisch(poly);
  } catch {
    return null;
  }
}

function kanonisch(p: Polynom): string {
  const teile = [...p.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${v.z}/${v.n}${k ? '·' + k : ''}`);
  return teile.length ? teile.join(' + ') : '0';
}

/** Sind zwei Terme mathematisch äquivalent? (null, wenn einer nicht parsebar ist) */
export function termeGleich(a: string, b: string): boolean | null {
  const na = normalisiereTerm(a);
  const nb = normalisiereTerm(b);
  if (na == null || nb == null) return null;
  return na === nb;
}