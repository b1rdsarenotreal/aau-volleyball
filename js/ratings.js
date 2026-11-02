// In-season rating movement. Each team keeps its preseason ratings in
// `base`; its current ATK / SRV / DEF (stored as off / pit / def) come from
// replaying every final match in order. Beating a better team (or losing to
// a worse one) moves ratings, and the part of the match that decided it gets
// most of the change (see `shares`). Because it's a replay, edited or
// cleared results always give consistent ratings.

import { winProbability, OVR_WEIGHTS } from './sim.js?v=20261101192332';
import { isFinal } from './standings.js?v=20261101192332';
import { clamp } from './util.js?v=20261101192332';

export const FORM_LEVELS = { none: 0, small: 0.45, normal: 0.8, big: 1.2 };
const KEYS = ['off', 'pit', 'def'];
const MAX_DRIFT = 10; // furthest a rating can move from preseason in one season

export function ensureBase(t) {
  if (!t.base) t.base = { off: t.off, pit: t.pit, def: t.def };
  return t.base;
}

// Change of rating `k` for one match. `surprise` = result − win chance
// (positive when the team did better than expected). The part of the match
// that decided it gets most of the change: lots of kills moves ATK, few
// errors moves SRV (ball control), holding the other team's kills down moves
// DEF. Per set: about 12 kills and 7 errors is average.
function shares(surprise, kills, oppKills, err, sets) {
  const n = Math.max(3, sets || 4);
  const off = clamp((kills / n - 12) / 3, -1, 1), pit = clamp((7 - err / n) / 3, -1, 1), def = clamp((12 - oppKills / n) / 3, -1, 1);
  const sign = surprise >= 0 ? 1 : -1;
  const w = [Math.max(0.15, 0.5 + (sign * off) / 2), Math.max(0.15, 0.5 + (sign * pit) / 2), Math.max(0.15, 0.5 + (sign * def) / 2)];
  // Scale so the overall rating (OVR) moves by `surprise` × level.
  const ovrShare = OVR_WEIGHTS.off * w[0] + OVR_WEIGHTS.pit * w[1] + OVR_WEIGHTS.def * w[2];
  return w.map(x => x / ovrShare);
}

export function replayRatings(season) {
  const level = FORM_LEVELS[season.settings.form ?? 'normal'] ?? FORM_LEVELS.normal;
  const cur = {};
  for (const [name, t] of Object.entries(season.teams)) cur[name] = { ...ensureBase(t) };
  if (level) {
    const games = season.games.filter(isFinal).sort((a, b) => a.week - b.week || a.order - b.order || a.id - b.id);
    for (const g of games) {
      const h = cur[g.home], a = cur[g.away];
      if (!h || !a) continue;
      const p = winProbability(h, a, g);
      const s = (g.homeR > g.awayR ? 1 : 0) - p;
      const sets = g.homeLine?.length || 4;
      for (const [r, sur, k, ok, err, name] of [[h, s, g.homeH ?? 12 * sets, g.awayH ?? 12 * sets, g.homeE ?? 7 * sets, g.home], [a, -s, g.awayH ?? 12 * sets, g.homeH ?? 12 * sets, g.awayE ?? 7 * sets, g.away]]) {
        const sh = shares(sur, k, ok, err, sets);
        const base = season.teams[name].base;
        KEYS.forEach((k, i) => { r[k] = clamp(r[k] + level * sur * sh[i], base[k] - MAX_DRIFT, base[k] + MAX_DRIFT); });
      }
    }
  }
  for (const [name, t] of Object.entries(season.teams)) {
    for (const k of KEYS) t[k] = clamp(Math.round(cur[name][k]), 40, 99);
  }
}

// The commissioner sets a rating: shift the preseason base so the current
// value becomes `value` after results are replayed.
export function setRating(t, k, value) {
  ensureBase(t);
  t.base[k] = clamp(t.base[k] + (value - t[k]), 30, 109);
  t[k] = value;
}
