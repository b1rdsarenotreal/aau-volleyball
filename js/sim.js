// Volleyball match simulator. Plays every rally from the teams' ratings:
// ATK (attack, stored as `off`), SRV (serving and passing, `pit`) and DEF
// (blocking and digging, `def`). NCAA rules: rally scoring, best of five
// sets, sets 1–4 to 25 and the fifth to 15, each won by two.
//
// Each rally starts with a serve. The receiving team wins it (a "side-out")
// more often than not; how often depends on its attack against the serving
// team's block and defense, and its passing against the other team's serve.
// Points are credited as kills, aces, blocks or the other team's errors, so a
// match has kills (shown where softball shows hits) and errors.
//
// The result keeps the field names the rest of the app uses for every game:
// homeLine / awayLine are points per set, R is sets won, H is kills, E is
// errors, and `innings` is the number of sets played.
// A simulation is only a suggestion — the commissioner reviews and saves it.

import { rng as makeRng } from './util.js?v=20261113225434';

export const OVR_WEIGHTS = { off: 0.4, pit: 0.3, def: 0.3 };
const ovrExact = t => t.off * OVR_WEIGHTS.off + t.pit * OVR_WEIGHTS.pit + t.def * OVR_WEIGHTS.def;
export function ovr(t) { return Math.round(ovrExact(t)); }

export const SET_TO = 25, FIFTH_TO = 15, SETS = 5;
const SIDEOUT = 0.585; // NCAA Division I side-out rate between equal teams
const TALENT = 85;     // rating points per unit of log-odds (lower = fewer upsets)

// Chance the receiving team wins the rally.
function sideoutProb(recv, serve, recvHome, vol) {
  const x = Math.log(SIDEOUT / (1 - SIDEOUT))
    + ((recv.off - serve.def) * 0.55 + (recv.pit - serve.pit) * 0.45) / TALENT / vol
    + (recvHome ? 0.02 : 0);
  return 1 / (1 + Math.exp(-x));
}

// One rally: returns { won: true if the receiving team won, how }.
function rally(recv, serve, recvHome, vol, r) {
  const p = sideoutProb(recv, serve, recvHome, vol);
  if (r() < p) return { won: true, how: r() < 0.66 ? 'kill' : r() < 0.25 ? 'block' : 'error' };
  return { won: false, how: r() < 0.1 ? 'ace' : r() < 0.5 ? 'kill' : r() < 0.45 ? 'block' : 'error' };
}

// One set. `server` is 'home' or 'away' (who serves first).
function playSet(sides, to, server, neutral, vol, r, stats) {
  const pts = { home: 0, away: 0 };
  let srv = server;
  while (!((pts.home >= to || pts.away >= to) && Math.abs(pts.home - pts.away) >= 2)) {
    const recv = srv === 'home' ? 'away' : 'home';
    const res = rally(sides[recv], sides[srv], recv === 'home' && !neutral, vol, r);
    const winner = res.won ? recv : srv, loser = winner === 'home' ? 'away' : 'home';
    pts[winner]++;
    if (res.how === 'error') stats[loser].E++;
    else if (res.how === 'kill') stats[winner].H++;
    srv = winner; // the team that wins the rally serves next
    if (pts.home + pts.away > 200) break; // never happens; a guard
  }
  return pts;
}

export function simulateGame(homeTeam, awayTeam, game = {}, { seed, volatility = 1 } = {}) {
  const r = makeRng(seed);
  const neutral = !!game.neutral;
  const sides = { home: homeTeam, away: awayTeam };
  const stats = { home: { H: 0, E: 0 }, away: { H: 0, E: 0 } };
  const homeLine = [], awayLine = [];
  const won = { home: 0, away: 0 };
  let first = r() < 0.5 ? 'home' : 'away';
  for (let set = 1; set <= SETS && won.home < 3 && won.away < 3; set++) {
    const to = set === SETS ? FIFTH_TO : SET_TO;
    const server = set === SETS ? (r() < 0.5 ? 'home' : 'away') : set % 2 ? first : (first === 'home' ? 'away' : 'home');
    const pts = playSet(sides, to, server, neutral, volatility, r, stats);
    homeLine.push(pts.home); awayLine.push(pts.away);
    won[pts.home > pts.away ? 'home' : 'away']++;
  }
  return {
    homeLine, awayLine,
    home: { R: won.home, H: stats.home.H, E: stats.home.E },
    away: { R: won.away, H: stats.away.H, E: stats.away.E },
    innings: homeLine.length, runRule: false,
  };
}

// Kills and errors for a score entered by hand: about 60% of a team's points
// are kills, and the other team's errors give it about 30% more.
export function estimateHitsErrors(homeTeam, awayTeam, game, homeLine, awayLine, { seed } = {}) {
  const r = makeRng(seed ?? 1);
  const pts = l => l.reduce((a, b) => a + (Number(b) || 0), 0);
  const one = n => ({ H: Math.round(n * (0.57 + r() * 0.06)), E: Math.round(n * (0.27 + r() * 0.06)) });
  const h = one(pts(homeLine)), a = one(pts(awayLine));
  // Errors are counted against the team that made them: each side's errors
  // gave the other side points.
  return { home: { H: h.H, E: a.E }, away: { H: a.H, E: h.E } };
}

// Home team's chance to win the match. A logistic fit to thousands of
// simulated matches (see tests): each point of OVR edge is worth about 0.12
// on the log-odds scale, so a team 10 points better wins ~77% and one 20
// points better ~92%. Home court is worth about 3 percentage points.
export const WP_SLOPE = 0.122, WP_HOME = 0.12;
export function winProbability(homeTeam, awayTeam, game = {}, { volatility = 1 } = {}) {
  const d = ovrExact(homeTeam) - ovrExact(awayTeam);
  const x = (WP_SLOPE * d) / volatility + (game.neutral ? 0 : WP_HOME);
  return 1 / (1 + Math.exp(-x));
}

// Slower check of the formula above by simulating the matchup.
export function simulatedWinRate(homeTeam, awayTeam, game = {}, opts = {}, n = 2000) {
  let wins = 0;
  for (let i = 0; i < n; i++) { const res = simulateGame(homeTeam, awayTeam, game, { ...opts, seed: i * 7919 + 1 }); if (res.home.R > res.away.R) wins++; }
  return wins / n;
}
