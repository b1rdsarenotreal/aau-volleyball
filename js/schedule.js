// Regular-season schedule for women's volleyball. Its length comes from the
// season's settings (13 weeks by default, late August to late November).
//
// - Non-conference invitationals: in the first weeks (4 by default, a
//   setting), every team plays a weekend round robin, usually of 4 teams (3
//   matches: Friday, then two on Saturday). Never two teams from the same
//   conference, rarely a repeat opponent, and teams lean toward events near
//   home. One team hosts, so the event is named for it (the "Texas
//   Invitational"). A big conference needs more events than 4-team ones
//   allow, so some events have 3 teams; those teams play a third match on
//   Sunday.
// - Conference play fills the rest of the season, two matches a week against
//   different opponents (the days are set per conference: Friday and
//   Saturday by default). A conference plays a double round robin when it
//   fits, home and away; a big one plays as much of a second round as fits.
//   Every member always plays the same number of conference matches (a
//   fail-safe in the schedule builder). A conference that needs fewer weeks
//   starts later, and its teams play invitationals until then.
// - Teams with an open date in a conference week (a bye in an odd-sized
//   conference, or an independent) are paired with each other for a
//   non-conference match when they can.
// When `prev` (last season) is given, conference opponents who met once last
// year swap home and away.

import { isIndependent } from './standings.js?v=20261031131611';
import { cityPoint, miles } from './geo.js?v=20261031131611';
import { rng, shuffle, hashStr } from './util.js?v=20261031131611';

export const DEFAULT_REG_WEEKS = 13;
export const DEFAULT_TOURNEY_WEEKS = 4;
export const MAX_CONF_WEEKS = 11;
export const PER_WEEK = 2; // conference matches a week
export const DEFAULT_CONF_MATCHES = 18; // conference matches a team aims for
export const DEFAULT_MAX_MATCHES = 30;  // most regular-season matches (NCAA limit is about 28 plus exempt events)

// How many times a conference of n teams plays through its round robin to
// reach about `target` matches: at least twice (home and away), at most 4.
export const confCycles = (n, target = DEFAULT_CONF_MATCHES) => Math.max(2, Math.min(4, Math.round(target / Math.max(1, n - 1))));
const TOURNEY_NAMES = ['Classic', 'Invitational', 'Challenge', 'Showcase', 'Kickoff', 'Volleyball Classic'];

// Kept for older code paths that read these (no midweek games in volleyball).
export const MIDWEEK = {}; export const MIDWEEK_FREQ = {};

export const DAY_ORDER = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

// Conference weeks in a season of `regWeeks` with `tourneyWeeks` of
// invitationals first.
export function confWeeksFor(regWeeks, tourneyWeeks = DEFAULT_TOURNEY_WEEKS) { return Math.max(1, Math.min(MAX_CONF_WEEKS, regWeeks - tourneyWeeks)); }
const rrRounds = n => (n < 2 ? 0 : n % 2 ? n : n - 1);

export function blankGame(season, fields) {
  return {
    id: season.nextId++, type: 'regular', week: 1, day: 'Fri', order: DAY_ORDER.Fri,
    home: null, away: null, neutral: false, confGame: false, series: null, label: '',
    final: false, homeLine: [], awayLine: [], homeR: null, homeH: null, homeE: null, awayR: null, awayH: null, awayE: null,
    pitching: null, source: null, ...fields,
  };
}

// The two days a conference plays its matches each week. Set per conference
// (Standings → Commissioner).
export const CONF_WEEKENDS = [
  ['fs', 'Friday and Saturday'],
  ['fsu', 'Friday and Sunday'],
  ['ts', 'Thursday and Saturday'],
  ['ws', 'Wednesday and Saturday'],
  ['tsu', 'Thursday and Sunday'],
];
export function seriesDays(fmt) {
  const days = { fs: ['Fri', 'Sat'], fsu: ['Fri', 'Sun'], ts: ['Thu', 'Sat'], ws: ['Wed', 'Sat'], tsu: ['Thu', 'Sun'] }[fmt] || ['Fri', 'Sat'];
  return days.map(day => ({ day, order: DAY_ORDER[day] }));
}
// Re-lay a conference's unplayed conference matches after its days change.
export function applyConfWeekend(season, conf) {
  const days = seriesDays(season.settings?.confWeekend?.[conf]);
  let n = 0;
  for (const g of season.games) {
    if (g.type !== 'regular' || !g.confGame || g.final || season.teams[g.home]?.conference !== conf || g.slot == null) continue;
    Object.assign(g, days[g.slot]);
    n++;
  }
  return n;
}

// Count each team's conference matches in a set of rounds.
export function confSeriesCounts(rounds, list) {
  const n = Object.fromEntries(list.map(t => [t, 0]));
  for (const pairs of rounds) for (const [a, b] of pairs) if (a && b) { n[a]++; n[b]++; }
  return n;
}

// Pick matches to drop so every team ends with the same number: team t must
// lose `need[t]` matches, each shared with another team that has matches to
// lose. Small conferences, so a backtracking search is quick.
function pickDrops(edges, need, r) {
  const left = { ...need }, chosen = [], used = new Set();
  let steps = 0;
  const solve = () => {
    if (++steps > 20000) return false;
    const todo = Object.keys(left).filter(t => left[t] > 0);
    if (!todo.length) return true;
    const opts = t => edges.filter((e, i) => !used.has(i) && (e.a === t ? left[e.b] > 0 : e.b === t && left[e.a] > 0));
    const t = todo.reduce((x, y) => (opts(y).length - left[y] < opts(x).length - left[x] ? y : x));
    for (const e of shuffle(opts(t), r)) {
      const i = edges.indexOf(e);
      used.add(i); left[e.a]--; left[e.b]--; chosen.push(i);
      if (solve()) return true;
      used.delete(i); left[e.a]++; left[e.b]++; chosen.pop();
    }
    return false;
  };
  return solve() ? chosen : null;
}

// A conference's rounds for the season: `cycles` round robins (each one with
// home and away swapped from the last), cut to `maxRounds`. Fail-safe: every
// member plays the same number of conference matches. When the cut leaves
// some teams with an extra match, those extra matches are dropped (the
// teams get a non-conference match or an open date instead). If no clean
// set of drops exists, the round robin is redrawn and tried again.
export function confRounds(list, maxRounds, r, cycles = 2) {
  if (list.length < 2) return [];
  for (let attempt = 0; attempt < 40; attempt++) {
    const first = roundRobin(list, r);
    let rounds = [];
    for (let c = 0; c < cycles; c++) rounds.push(...first.map(pairs => (c % 2 ? pairs.map(([a, b]) => [b, a]) : pairs)));
    if (rounds.length > maxRounds) rounds = rounds.slice(0, maxRounds);
    const counts = confSeriesCounts(rounds, list);
    let k = Math.min(...Object.values(counts));
    if (Object.values(counts).every(c => c === k)) return rounds;
    if ((list.length * k) % 2) k--;
    const edges = rounds.flatMap((pairs, ri) => pairs.filter(([a, b]) => a && b).map(([a, b]) => ({ a, b, ri })));
    const need = Object.fromEntries(list.map(t => [t, counts[t] - k]));
    const drops = pickDrops(edges, need, r);
    if (!drops) continue;
    const gone = new Set(drops.map(i => edges[i]));
    return rounds.map((pairs, ri) => pairs.filter(([a, b]) => !(a && b) || !edges.some(e => gone.has(e) && e.ri === ri && e.a === a && e.b === b)));
  }
  throw new Error(`Couldn't give every team in a ${list.length}-team conference the same number of conference matches.`);
}

// Circle-method round robin. Returns rounds of [a, b] pairs (null = bye).
export function roundRobin(teams, r) {
  const list = shuffle(teams, r);
  if (list.length % 2) list.push(null);
  const n = list.length, rounds = [];
  for (let k = 0; k < n - 1; k++) {
    const pairs = [];
    for (let i = 0; i < n / 2; i++) {
      const a = list[i], b = list[n - 1 - i];
      pairs.push(k % 2 ? [b, a] : [a, b]);
    }
    rounds.push(pairs);
    list.splice(1, 0, list.pop());
  }
  return rounds;
}

const key = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
// Conference rivals; independents are nobody's rivals.
const rival = (teams, a, b) => teams[a].conference === teams[b].conference && !isIndependent(teams[a].conference);

// Pair teams across conferences, avoiding repeat opponents when possible.
function crossPairs(pool, teams, met, r) {
  for (let attempt = 0; attempt < 200; attempt++) {
    const left = shuffle(pool, r), pairs = [];
    let ok = true;
    while (left.length > 1) {
      const a = left.shift();
      let j = left.findIndex(b => !rival(teams, a, b) && !met.has(key(a, b)));
      if (j < 0) j = left.findIndex(b => !rival(teams, a, b));
      if (j < 0) { ok = false; break; }
      pairs.push([a, left.splice(j, 1)[0]]);
    }
    if (ok) return { pairs, idle: left };
  }
  return { pairs: [], idle: [...pool] };
}

// Event sizes for n teams in `events` events, as even as possible.
export function eventSizes(n, events = Math.floor(n / 4)) {
  if (n < 3 || events < 1) return [];
  const base = Math.floor(n / events), extra = n % events;
  return Array.from({ length: events }, (_, i) => base + (i < extra ? 1 : 0));
}

export function generateSchedule(season, seed = hashStr(String(season.year)), prev = null) {
  const r = rng(seed);
  const teams = season.teams;
  const names = Object.keys(teams);
  const homeCount = Object.fromEntries(names.map(n => [n, 0]));
  const played = Object.fromEntries(names.map(n => [n, 0]));
  const met = new Set();
  const games = [];
  const REG = season.settings?.regWeeks ?? DEFAULT_REG_WEEKS;
  const TW = Math.max(0, Math.min(season.settings?.tourneyWeeks ?? DEFAULT_TOURNEY_WEEKS, REG - 1));
  season.regWeeks = REG;

  // Who hosted each conference match last season, for pairs that met once.
  const hosts = new Map();
  for (const g of prev?.games || []) if (g.type === 'regular' && g.confGame) { const k = key(g.home, g.away); hosts.set(k, hosts.has(k) ? 'both' : g.home); }
  const orient = (a, b) => {
    if (homeCount[a] > homeCount[b]) return [b, a];
    if (homeCount[a] < homeCount[b]) return [a, b];
    return r() < 0.5 ? [a, b] : [b, a];
  };
  const add = (week, home, away, extra) => {
    games.push(blankGame(season, { week, home, away, ...extra }));
    if (!extra.neutral) homeCount[home]++;
    played[home]++; played[away]++;
    met.add(key(home, away));
  };

  // ---- conference rounds, two a week, ending on the last weekend ----
  const byConf = {};
  for (const n of names) if (!isIndependent(teams[n].conference)) (byConf[teams[n].conference] ||= []).push(n);
  const confWeeks = confWeeksFor(REG, TW);
  const slotPairs = {}; // `${week}|${slot}` -> [[a, b, conf]]
  for (const [conf, list] of Object.entries(byConf).sort((a, b) => a[0].localeCompare(b[0]))) {
    if (list.length < 2) continue;
    const rounds = confRounds(list, confWeeks * PER_WEEK, r, confCycles(list.length, season.settings?.confMatches ?? DEFAULT_CONF_MATCHES));
    const weeksNeeded = Math.ceil(rounds.length / PER_WEEK);
    const firstWeek = REG - weeksNeeded + 1;
    // A double round robin's second meeting swaps home and away; a pair that
    // only meets once this year swaps from last year.
    const meetings = {};
    for (const pairs of rounds) for (const [a, b] of pairs) if (a && b) meetings[key(a, b)] = (meetings[key(a, b)] || 0) + 1;
    rounds.forEach((pairs, i) => {
      const week = firstWeek + Math.floor(i / PER_WEEK), slot = i % PER_WEEK;
      for (let [a, b] of pairs) {
        if (!a || !b) continue;
        const k = key(a, b), h = hosts.get(k);
        if (meetings[k] === 1 && h && h !== 'both') [a, b] = h === a ? [b, a] : [a, b];
        (slotPairs[`${week}|${slot}`] ||= []).push([a, b, conf]);
      }
    });
  }

  // ---- invitationals ----
  const pts = Object.fromEntries(names.map(n => [n, cityPoint(teams[n].city)]));
  const dist = (a, b) => (pts[a] && pts[b] ? miles(pts[a], pts[b]) : 900);
  let tNo = 1;
  const invitationals = (week, free) => {
    // Enough events that no event needs two teams from one conference.
    const confCount = {};
    for (const n of free) if (!isIndependent(teams[n].conference)) confCount[teams[n].conference] = (confCount[teams[n].conference] || 0) + 1;
    // At most five a site (a five-team round robin fills Thursday to Saturday).
    const E = Math.max(1, Math.floor(free.length / 4), Math.ceil(free.length / 5), ...Object.values(confCount));
    const sizes = eventSizes(free.length, E);
    if (!sizes.length) return free;
    const events = sizes.map(() => []);
    // Place the biggest conferences first, each team in the open event that
    // suits it best: no rival there, nearby, not played yet, some randomness.
    const order = shuffle(free, r).sort((a, b) => (confCount[teams[b].conference] || 0) - (confCount[teams[a].conference] || 0));
    const leftovers = [];
    for (const t of order) {
      let best = -1, bs = Infinity;
      events.forEach((ev, i) => {
        if (ev.length >= sizes[i] || ev.some(x => rival(teams, x, t))) return;
        const sc = (ev.length ? ev.reduce((s2, x) => s2 + dist(x, t) * 1.6 + (met.has(key(x, t)) ? 2500 : 0), 0) / ev.length : 900) + r() * 600 - ev.length * 60;
        if (sc < bs) { bs = sc; best = i; }
      });
      if (best < 0) leftovers.push(t); else events[best].push(t);
    }
    const three = [];
    for (const ev of events) {
      if (ev.length < 3) { leftovers.push(...ev); continue; }
      const host = [...ev].sort((a, b) => homeCount[a] - homeCount[b] || (r() - 0.5))[0];
      const id = `${season.year}-t${tNo++}`;
      const name = `${host} ${TOURNEY_NAMES[hashStr(`${season.year}|${host}|${week}`) % TOURNEY_NAMES.length]}`;
      const rounds = roundRobin(ev, r);
      const slots = ev.length >= 5 ? [['Thu', 0], ['Fri', 0], ['Fri', 0.5], ['Sat', 0], ['Sat', 0.5]] : [['Fri', 0], ['Sat', 0], ['Sat', 0.5]];
      rounds.forEach((pairs, k) => {
        const [day, half] = slots[k] || ['Sun', 0];
        pairs.filter(([a, b]) => a && b).forEach(([a, b], i) => {
          let home, away;
          if (a === host || b === host) { home = host; away = a === host ? b : a; } else [home, away] = orient(a, b);
          const atHost = home === host;
          add(week, home, away, { day, order: DAY_ORDER[day] + half + i * 0.01, tourney: id, label: name, ...(atHost ? {} : { neutral: true, site: host }) });
        });
      });
      if (ev.length === 3) three.push(...ev);
    }
    // Teams in a 3-team event (two matches) and any left over get one more
    // match on Sunday, so everyone plays about three that weekend.
    const { pairs } = crossPairs([...three, ...leftovers], teams, met, r);
    for (const [a, b] of pairs) { const [h, aw] = orient(a, b); add(week, h, aw, { day: 'Sun', order: DAY_ORDER.Sun }); }
  };

  const cap = season.settings?.maxMatches ?? DEFAULT_MAX_MATCHES;
  // Matches each team still has to play in conference, so extra matches
  // don't push a team past the cap.
  const confLeft = Object.fromEntries(names.map(n => [n, 0]));
  for (const pairs of Object.values(slotPairs)) for (const [a, b] of pairs) { confLeft[a]++; confLeft[b]++; }
  const room = n => cap - played[n] - confLeft[n];
  for (let week = 1; week <= REG; week++) {
    const busy = new Set();
    for (let slot = 0; slot < PER_WEEK; slot++) for (const [a, b] of slotPairs[`${week}|${slot}`] || []) { busy.add(a); busy.add(b); }
    // Teams with no conference matches this week play an invitational (after
    // the invitational weeks, only those with room under the cap).
    const free = names.filter(n => !busy.has(n) && (week <= TW || room(n) >= 3));
    if (free.length >= 3) invitationals(week, free);
    if (!busy.size) continue;
    for (let slot = 0; slot < PER_WEEK; slot++) {
      const pairs = slotPairs[`${week}|${slot}`] || [];
      const inSlot = new Set();
      for (const [a, b, conf] of pairs) {
        const days = seriesDays(season.settings?.confWeekend?.[conf]);
        add(week, a, b, { ...days[slot], confGame: true, slot });
        confLeft[a]--; confLeft[b]--;
        inSlot.add(a); inSlot.add(b);
      }
      // Open dates: teams with conference play this week but not this slot
      // (byes), plus independents, meet across conferences.
      const open = names.filter(n => !inSlot.has(n) && (busy.has(n) || (free.length < 3 && !free.length) || isIndependent(teams[n].conference) && !free.includes(n)) && room(n) >= 1);
      const { pairs: extra } = crossPairs(open, teams, met, r);
      for (const [a, b] of extra) { const [h, aw] = orient(a, b); add(week, h, aw, { ...seriesDays('fs')[slot], slot }); }
    }
  }
  return games;
}
