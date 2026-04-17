// ══════════════════════════════════════════════════════════════════
//  MON CIEL DES RÊVES — DATA FILE
//  This is the single source of truth for the starry-sky dreams page.
//  Edit this file to add, update, or archive dreams.
// ══════════════════════════════════════════════════════════════════
//
//  ┌─ HOW TO ADD A NEW DREAM ────────────────────────────────────┐
//  │                                                              │
//  │  1. Choose a constellation that fits your dream's theme:    │
//  │       'mercurius'  →  Entrepreneurship & ambition           │
//  │       'peregrina'  →  Travel & exploration                  │
//  │       'musea'      →  Arts, writing, creative expression    │
//  │       'sophia'     →  Knowledge & personal growth           │
//  │                                                              │
//  │  2. Append a new entry to the DREAMS array:                 │
//  │     {                                                        │
//  │       id:            <unique number, increment by 1>        │
//  │       title:         'The name of your dream',              │
//  │       desc:          'A short, poetic description.',        │
//  │       constellation: 'mercurius' | 'peregrina' | ...        │
//  │       status:        'dream'    = future aspiration         │
//  │                      'ongoing'  = currently pursuing        │
//  │                      'done'     = accomplished ✦            │
//  │       x:  0.0–1.0   horizontal position (0 = left rim)     │
//  │       y:  0.0–1.0   vertical position   (0 = top)          │
//  │       size: 7–18    star radius in px (larger = brighter)   │
//  │       date: 'Horizon 2026' | 'En cours' | 'Accompli ✦'     │
//  │     }                                                        │
//  │                                                              │
//  │  3. Save — the sky rebuilds automatically. Done!            │
//  └──────────────────────────────────────────────────────────────┘
//
//  ┌─ HOW TO ADD A NEW CONSTELLATION ───────────────────────────┐
//  │                                                              │
//  │  Add a key to CONSTELLATIONS with:                          │
//  │    name:   Latin-inspired display name                      │
//  │    label:  Short French subtitle                            │
//  │    color:  [R, G, B] — the constellation's signature hue   │
//  │    links:  Array of [indexA, indexB] pairs that draw the    │
//  │            connecting lines between stars. Index 0 = first  │
//  │            dream added to that constellation, and so on.    │
//  │                                                              │
//  │  Then use that key in your new dream's `constellation`      │
//  │  field and position the stars with x/y so they don't       │
//  │  overlap existing constellations.                           │
//  └──────────────────────────────────────────────────────────────┘

// ── Types ─────────────────────────────────────────────────────────

export type DreamStatus = 'dream' | 'ongoing' | 'done';

export interface Constellation {
  name: string;
  label: string;
  /** RGB color tuple used for nebula, constellation lines, and star tint. */
  color: [number, number, number];
  /** Pairs of star indices (within this constellation) to connect with lines. */
  links: [number, number][];
}

export interface Dream {
  /** Unique numeric identifier. Always increment from the highest existing id. */
  id: number;
  /** Star label shown on hover and as the modal heading. */
  title: string;
  /** Poetic description shown inside the modal (2–4 sentences). */
  desc: string;
  /** Which constellation this dream belongs to (must be a key in CONSTELLATIONS). */
  constellation: keyof typeof CONSTELLATIONS;
  /** Pursuit status — drives star color and legend. */
  status: DreamStatus;
  /** Horizontal canvas position: 0.0 = far left, 1.0 = far right. */
  x: number;
  /** Vertical canvas position: 0.0 = top edge, 1.0 = bottom edge. */
  y: number;
  /** Star radius in pixels. 7 = faint / 16+ = brilliant & central. */
  size: number;
  /** Human-readable horizon label shown in the modal footer. */
  date: string;
}

// ── Constellations ────────────────────────────────────────────────

export const CONSTELLATIONS: Record<string, Constellation> = {
  mercurius: {
    name: 'Mercurius',
    label: "L'Entrepreneur",
    color: [255, 210, 80],
    links: [[0, 1], [1, 2], [2, 0]],
  },
  peregrina: {
    name: 'Peregrina',
    label: 'Le Voyageur',
    color: [80, 190, 255],
    links: [[0, 1], [1, 2], [2, 3], [0, 2]],
  },
  musea: {
    name: 'Musea',
    label: 'La Muse',
    color: [210, 130, 255],
    links: [[0, 1], [1, 2], [2, 0]],
  },
  sophia: {
    name: 'Sophia',
    label: 'Le Savoir',
    color: [90, 240, 185],
    links: [[0, 1], [1, 2], [0, 2]],
  },
};

// ── Dreams ────────────────────────────────────────────────────────
// Grouped by constellation for readability.
// ↓ ADD YOUR NEW DREAM AT THE END OF ITS CONSTELLATION GROUP ↓

export const DREAMS: Dream[] = [

  // ── MERCURIUS · Entrepreneurship · top-left zone ─────────────
  {
    id: 1,
    title: 'Ouvrir Barkers Club',
    desc: "Un café dog-friendly à Los Angeles. Un flat white parfait, un golden retriever sous la table, et des gens qui prennent le temps d'être là.",
    constellation: 'mercurius', status: 'ongoing',
    x: 0.21, y: 0.26, size: 14, date: 'Horizon 2025',
  },
  {
    id: 2,
    title: 'Lancer ma startup',
    desc: "Transformer une idée en quelque chose de réel. Bâtir de zéro, trouver des gens qui y croient autant que moi, regarder quelque chose grandir.",
    constellation: 'mercurius', status: 'ongoing',
    x: 0.34, y: 0.17, size: 12, date: 'En gestation',
  },
  {
    id: 3,
    title: "Maîtriser l'art du café",
    desc: "Comprendre la chimie derrière chaque extraction. Rôtir ses propres grains. Atteindre cet équilibre parfait entre acidité et douceur.",
    constellation: 'mercurius', status: 'dream',
    x: 0.16, y: 0.42, size: 8, date: 'Un jour',
  },

  // ── PEREGRINA · Travel · top-right zone ──────────────────────
  {
    id: 4,
    title: "Vivre à l'étranger",
    desc: "S'installer dans une ville inconnue. Apprendre à exister dans une autre langue, sous une autre lumière. Devenir légèrement quelqu'un d'autre.",
    constellation: 'peregrina', status: 'dream',
    x: 0.70, y: 0.20, size: 10, date: 'Un jour',
  },
  {
    id: 5,
    title: 'Voyager au Japon',
    desc: "Les temples à l'aube, le ramen à minuit, les cerisiers qui durent trop peu. Vivre le Japon lentement, sans itinéraire trop serré.",
    constellation: 'peregrina', status: 'dream',
    x: 0.82, y: 0.33, size: 11, date: 'Bientôt',
  },
  {
    id: 6,
    title: 'Road trip côte Ouest USA',
    desc: "Partir vers l'ouest sans trop planifier. Des déserts orangés, des diners déserts à 2h du matin, des couchers de soleil sur l'autoroute.",
    constellation: 'peregrina', status: 'dream',
    x: 0.87, y: 0.18, size: 8, date: 'Un jour',
  },
  {
    id: 7,
    title: 'Explorer la Patagonie',
    desc: "Marcher plusieurs jours avec un sac à dos. Le vent, les glaciers, et rien d'autre à faire que d'avancer et de regarder.",
    constellation: 'peregrina', status: 'dream',
    x: 0.75, y: 0.40, size: 9, date: 'Un jour',
  },

  // ── MUSEA · Arts & creativity · bottom-left zone ──────────────
  {
    id: 8,
    title: 'Écrire un livre',
    desc: "Quelque chose d'honnête. Peut-être sur l'entrepreneuriat, peut-être une fiction. Peu importe, pourvu que chaque phrase mérite d'exister.",
    constellation: 'musea', status: 'dream',
    x: 0.20, y: 0.68, size: 10, date: 'Un jour',
  },
  {
    id: 9,
    title: 'Apprendre le piano',
    desc: "Jouer Satie le soir, juste pour soi. Pas de performance, pas de public — juste les touches et le silence entre elles.",
    constellation: 'musea', status: 'dream',
    x: 0.31, y: 0.80, size: 8, date: 'Un jour',
  },
  {
    id: 10,
    title: 'Créer un court-métrage',
    desc: "Une histoire courte, filmée avec ce qu'on a. Apprendre à voir une scène, à la découper, à la faire résonner.",
    constellation: 'musea', status: 'dream',
    x: 0.14, y: 0.78, size: 7, date: 'Un jour',
  },

  // ── SOPHIA · Knowledge & growth · bottom-right zone ──────────
  {
    id: 11,
    title: 'Obtenir mon diplôme',
    desc: "Finir UC Berkeley avec fierté. Tout ce travail, toutes ces nuits, chaque doute qu'il a fallu traverser — ça valait la peine.",
    constellation: 'sophia', status: 'done',
    x: 0.70, y: 0.65, size: 16, date: 'Accompli ✦',
  },
  {
    id: 12,
    title: "Parler l'espagnol couramment",
    desc: "Une troisième langue. Ouvrir une troisième fenêtre sur le monde. Peut-être se perdre un peu à Barcelone, sans avoir à traduire.",
    constellation: 'sophia', status: 'dream',
    x: 0.80, y: 0.76, size: 8, date: 'Un jour',
  },
  {
    id: 13,
    title: 'Lire 50 livres en un an',
    desc: "Pas par performance. Juste l'habitude de s'asseoir avec un livre chaque soir, et de laisser quelqu'un d'autre penser à ma place pour un moment.",
    constellation: 'sophia', status: 'dream',
    x: 0.64, y: 0.78, size: 7, date: 'Un jour',
  },

];
