// Logic tests: run with `node tests/logic.test.mjs`
import assert from 'node:assert/strict';
import { ALIGNMENT, newLeague, currentSeason, simGames, startNextSeason, beginOffseason, draftWarnings, applyResult, estimateHE, migrateLeague, addConference, rebuildSchedule, weekName } from '../js/league.js';
import { simulateGame, winProbability, simulatedWinRate, ovr } from '../js/sim.js';
import { generateSchedule, confRounds, confSeriesCounts, eventSizes, confTarget, DEFAULT_REG_WEEKS } from '../js/schedule.js';
import { records, rpi, confStandings, isFinal, winnerOf, INDEPENDENT } from '../js/standings.js';
import { gameVenue, postseasonFinish, postseasonDetail, mcwsPlaces, wsTeams, ncaaProblems, fieldSize, DEFAULT_NCAA, confirmField, setConfHost } from '../js/postseason.js';
import { recordBook } from '../js/records.js';
import { seedTeams, splitOvr, COACHES, CONFERENCES } from '../js/data.js';
import { existsSync } from 'node:fs';
import { rng } from '../js/util.js';

const t0 = Date.now();
let n = 0;
const check = (name, fn) => { fn(); n++; };

check('72 AAU volleyball programs in the commissioner\'s conferences', () => {
  const teams = seedTeams();
  assert.equal(Object.keys(teams).length, 72);
  const count = {};
  for (const t of Object.values(teams)) count[t.conference] = (count[t.conference] || 0) + 1;
  assert.deepEqual(count, { 'Big Ten': 11, 'Coastal Atlantic Conference': 9, 'Pacific-10 Conference': 10, 'Metro Conference': 8, 'Southwest Conference': 8, 'Ivy League': 8, 'UC Athletic Association': 7, 'University Athletic Association': 11 });
  for (const c of Object.keys(CONFERENCES)) assert.ok(existsSync(new URL(`../${CONFERENCES[c].logo}`, import.meta.url)), `${c} logo`);
  assert.ok(Object.values(teams).every(t => t.stadium && t.city && t.color && t.mascot), 'every team has an arena, city, colors and mascot');
  assert.equal(Object.keys(COACHES).length, 72);
  assert.ok(Object.values(teams).every(t => t.coach === COACHES[t.school]));
  assert.equal(new Set(Object.values(COACHES)).size, 72, 'every coach is a different person');
  // The OVR split keeps the overall rating.
  for (const t of Object.values(teams)) assert.ok(Math.abs(ovr(t) - (t.off * 0.4 + t.pit * 0.3 + t.def * 0.3)) < 1);
  const s = splitOvr('Texas', 90);
  assert.ok(Math.abs(0.4 * s.off + 0.3 * s.pit + 0.3 * s.def - 90) <= 0.5);
});

check('an unstarted saved dynasty picks up the commissioner\'s conferences', () => {
  const L = newLeague(), s0 = currentSeason(L);
  // An older save: the old conferences, Boston University, a missing team.
  delete L.alignment;
  L.conferences.SEC = { abbr: 'SEC', color: '#1F4A8C' }; L.conferences.ACC = { abbr: 'ACC', color: '#013CA6' };
  s0.teams.Texas.conference = 'SEC'; s0.teams.Stanford.conference = 'ACC';
  s0.teams['Boston University'] = { ...s0.teams.Harvard, school: 'Boston University', conference: 'ACC' };
  delete s0.teams.Caltech;
  migrateLeague(L);
  assert.equal(L.alignment, ALIGNMENT);
  assert.equal(s0.teams.Texas.conference, 'Southwest Conference');
  assert.equal(s0.teams.Stanford.conference, 'Pacific-10 Conference');
  assert.ok(!s0.teams['Boston University'] && s0.teams.Caltech?.coachId);
  assert.ok(!L.conferences.SEC && !L.conferences.ACC && L.conferences['Metro Conference'].logo);
  assert.ok(s0.games.every(g => g.home !== 'Boston University' && g.away !== 'Boston University'));
  // Not once matches are played.
  const L2 = newLeague(); delete L2.alignment; const s2 = currentSeason(L2);
  simGames(s2, g => g.week === 1, { max: 1 });
  s2.teams.Texas.conference = 'Big Ten'; migrateLeague(L2);
  assert.equal(s2.teams.Texas.conference, 'Big Ten');
});

check('matches are legal best-of-five volleyball', () => {
  const r = rng(3);
  for (let i = 0; i < 2000; i++) {
    const h = { off: 50 + r() * 45, pit: 50 + r() * 45, def: 50 + r() * 45 }, a = { off: 50 + r() * 45, pit: 50 + r() * 45, def: 50 + r() * 45 };
    const g = simulateGame(h, a, {}, { seed: i });
    assert.ok(g.homeLine.length >= 3 && g.homeLine.length <= 5);
    assert.equal(Math.max(g.home.R, g.away.R), 3);
    let hw = 0, aw = 0;
    g.homeLine.forEach((x, k) => {
      const y = g.awayLine[k], to = k === 4 ? 15 : 25, hi = Math.max(x, y), lo = Math.min(x, y);
      assert.ok(hi >= to && hi - lo >= 2 && (hi === to || hi - lo === 2), `set ${k + 1}: ${x}-${y}`);
      x > y ? hw++ : aw++;
      if (k < g.homeLine.length - 1) assert.ok(hw < 3 && aw < 3, 'no sets after the match is decided');
    });
    assert.equal(hw, g.home.R); assert.equal(aw, g.away.R);
    assert.ok(g.home.H > 0 && g.home.E >= 0);
  }
});

check('win chances match the simulator', () => {
  for (const gap of [0, 10, 20]) {
    const H = { off: 70 + gap / 2, pit: 70 + gap / 2, def: 70 + gap / 2 }, A = { off: 70 - gap / 2, pit: 70 - gap / 2, def: 70 - gap / 2 };
    const sim = simulatedWinRate(H, A, { neutral: true }, {}, 1500), est = winProbability(H, A, { neutral: true });
    assert.ok(Math.abs(sim - est) < 0.05, `gap ${gap}: sim ${sim} vs formula ${est}`);
  }
  assert.ok(winProbability({ off: 70, pit: 70, def: 70 }, { off: 70, pit: 70, def: 70 }, {}) > 0.5, 'home court helps');
});

check('hand-entered scores get kills and errors', () => {
  const L = newLeague(), s = currentSeason(L);
  const g = s.games[0];
  const e = estimateHE(s, g, [25, 23, 25, 25], [20, 25, 18, 21]);
  assert.ok(e.home.H > 40 && e.away.H > 30 && e.home.E > 0);
});

const league = newLeague();
const s = currentSeason(league);
const reg = s.games.filter(g => g.type === 'regular');

check('schedule: invitationals, then conference play two matches a week', () => {
  assert.equal(s.regWeeks, DEFAULT_REG_WEEKS);
  assert.ok(reg.every(g => g.week >= 1 && g.week <= s.regWeeks));
  // Conference rivals only meet in conference play.
  assert.ok(reg.every(g => g.confGame || s.teams[g.home].conference !== s.teams[g.away].conference || s.teams[g.home].conference === INDEPENDENT));
  // Nobody plays twice in one slot.
  const slot = new Set();
  for (const g of reg) for (const t of [g.home, g.away]) { const k = `${t}|${g.week}|${g.day}|${g.order}`; assert.ok(!slot.has(k), k); slot.add(k); }
  // Invitationals: weekend round robins, never two teams from one conference.
  const events = {};
  for (const g of reg.filter(g => g.tourney)) (events[g.tourney] ||= new Set()).add(g.home).add(g.away);
  assert.ok(Object.keys(events).length > 40);
  for (const teams of Object.values(events)) {
    const confs = [...teams].map(t => s.teams[t].conference).filter(c => c !== INDEPENDENT);
    assert.equal(new Set(confs).size, confs.length, 'no conference rivals in one invitational');
    assert.ok(teams.size >= 3 && teams.size <= 5);
  }
  assert.ok(reg.filter(g => g.week === 1).every(g => !g.confGame), 'week 1 is non-conference');
  // Every member of a conference plays the same number of conference matches.
  const conf = {};
  for (const g of reg.filter(g => g.confGame)) for (const t of [g.home, g.away]) conf[t] = (conf[t] || 0) + 1;
  for (const c of Object.keys(league.conferences).filter(c => c !== INDEPENDENT)) {
    const counts = Object.values(s.teams).filter(t => t.conference === c).map(t => conf[t.school]);
    assert.equal(new Set(counts).size, 1, `${c}: ${counts}`);
  }
  assert.equal(conf.Texas, 14); // 8-team Southwest: everyone home and away
  assert.equal(conf.Duke, 16); // 9-team Coastal
  assert.equal(conf['UC Davis'], 12); // 7-team UCAA
  assert.equal(conf.Harvard, 14); // 8-team Ivy: everyone home and away
  assert.equal(conf.Emory, 18); // 11-team UAA: the most, 18
  assert.equal(conf.Stanford, 18); // 10-team Pac-10: 18, everyone twice
  assert.equal(conf.Purdue, 18); // 11-team Big Ten: the most, 18
  // Conference matches: half at home, Thursday or Friday then Saturday or Sunday.
  const ch = {};
  for (const g of reg.filter(g => g.confGame)) { ch[g.home] = (ch[g.home] || 0) + 1; assert.ok(g.slot === 0 ? ['Thu', 'Fri'].includes(g.day) : ['Sat', 'Sun'].includes(g.day), `${g.day} slot ${g.slot}`); }
  for (const t of Object.keys(conf)) assert.equal(ch[t] * 2, conf[t], `${t} hosts half its conference matches`);
  // Two conference matches a week, on the conference's days.
  const pw = {};
  for (const g of reg.filter(g => g.confGame)) for (const t of [g.home, g.away]) { const k = `${t}|${g.week}`; pw[k] = (pw[k] || 0) + 1; }
  assert.ok(Object.values(pw).every(x => x <= 2));
  // Totals stay within a few matches of each other and under the cap.
  const tot = {};
  for (const g of reg) for (const t of [g.home, g.away]) tot[t] = (tot[t] || 0) + 1;
  const v = Object.values(tot);
  assert.ok(Math.max(...v) <= 30 && Math.min(...v) >= 24, `${Math.min(...v)}–${Math.max(...v)}`);
});

check('conference round robins are fair at every size', () => {
  for (let k = 2; k <= 20; k++) {
    const names = Array.from({ length: k }, (_, i) => `t${i}`);
    const rounds = confRounds(names, 22, rng(k));
    const c = Object.values(confSeriesCounts(rounds, names));
    assert.equal(new Set(c).size, 1, `${k} teams`);
    assert.equal(c[0], Math.min(2 * (k - 1), 18), `${k} teams: everyone twice or 18`);
    assert.ok(rounds.length <= 22);
    // Half at home; a pair that meets twice has one home each.
    const home = {}, pair = {};
    for (const p of rounds) for (const [h, a] of p) if (h && a) { home[h] = (home[h] || 0) + 1; (pair[[h, a].sort().join()] ||= []).push(h); }
    for (const t of names) assert.equal(home[t] || 0, c[0] / 2, `${k} teams: ${t} hosts half`);
    for (const hs of Object.values(pair)) { assert.ok(hs.length <= 2); if (hs.length === 2) assert.notEqual(hs[0], hs[1]); }
    // Nobody meets a team a second time before meeting everyone once.
    if (c[0] >= k - 1) for (const t of names) assert.equal(Object.keys(pair).filter(p => p.split(',').includes(t)).length, k - 1);
  }
  assert.deepEqual(eventSizes(57, 17).reduce((a, b) => a + b), 57);
});

check('a game is at the home team\'s arena; week names', () => {
  const g = reg.find(x => !x.neutral);
  assert.equal(gameVenue(s, g).stadium, s.teams[g.home].stadium);
  assert.equal(weekName(1, s), 'Week 1');
});

check('NCAA format checks', () => {
  assert.deepEqual(ncaaProblems(DEFAULT_NCAA, 57), []);
  assert.equal(fieldSize(DEFAULT_NCAA), 32);
  assert.ok(ncaaProblems({ regionals: 16, perRegional: 4, wsSize: 4 }, 57).length);
  assert.deepEqual(ncaaProblems({ regionals: 4, perRegional: 4, wsSize: 4 }, 57), []);
});

// A conference tournament for the Ivy League (most conferences have none).
s.settings.confTourney = { 'Ivy League': 4 };

simGames(s, g => g.type === 'regular');
check('regular season results', () => {
  assert.ok(reg.every(isFinal));
  const recs = records(s), r = rpi(s);
  assert.ok(Object.values(recs).every(x => x.w + x.l >= 24));
  assert.ok(Object.values(r).every(x => x.rpi > 0 && x.rpi < 1));
  assert.ok(confStandings(s, 'Big Ten').length === 11);
  assert.ok(Object.keys(s.polls).length >= 10, 'weekly polls');
});

simGames(s, undefined, { autoLock: true });
check('postseason: conference tournament, 8 sites of 4, regional finals, Final Four', () => {
  const p = s.post;
  assert.equal(s.phase, 'complete');
  assert.ok(p.confT['Ivy League'] && p.confT['Ivy League'].champion);
  assert.equal(Object.keys(p.confT).length, 1, 'only the Ivy League held a tournament');
  assert.equal(p.field.length, 32);
  const autos = p.field.filter(f => f.bid === 'auto');
  assert.ok(autos.some(f => f.team === p.confT['Ivy League'].champion), 'the tournament champion gets the bid');
  assert.equal(p.regionals.length, 8);
  assert.ok(p.regionals.every(ev => ev.seeds.length === 4 && ev.host === ev.seeds[0] && ev.champion));
  assert.equal(p.supers.length, 4);
  assert.ok(p.supers.every(ev => ev.champion));
  assert.equal(wsTeams(s).length, 4);
  // Bracket kept: the 1 seed's path meets the 4 seed's path in the semifinals.
  // Regional final i pairs site i with site 7 - i (seed 1's site with seed 8's).
  p.supers.forEach((ev, i) => assert.deepEqual(new Set(ev.seeds), new Set([p.regionals[i].champion, p.regionals[7 - i].champion])));
  const path = t => p.supers.findIndex(ev => ev.seeds.includes(t));
  const semi = s.games.filter(g => g.type === 'mcws' && g.node?.startsWith('R1-'));
  assert.equal(semi.length, 2);
  for (const g of semi) assert.equal(path(g.home) + path(g.away), 3, 'semifinals: paths 1 v 4 and 2 v 3');
  // Every NCAA match is one match.
  for (const g of s.games.filter(g => ['regional', 'super', 'mcws'].includes(g.type))) assert.ok(isFinal(g) && !g.series);
  assert.ok(p.champion && p.runnerUp && p.champion !== p.runnerUp);
  const places = mcwsPlaces(s);
  assert.equal(places[p.champion].place, 1);
  assert.equal(Object.values(places).filter(x => x.place === 3).length, 2);
  assert.equal(postseasonFinish(s, p.champion), 'National champion');
  assert.equal(postseasonFinish(s, p.runnerUp), 'National runner-up');
  const elite = p.supers.flatMap(ev => ev.seeds).find(t => !wsTeams(s).includes(t));
  assert.equal(postseasonFinish(s, elite), 'Elite Eight');
  const out1 = p.regionals[0].seeds.find(t => t !== p.regionals[0].champion);
  assert.equal(postseasonFinish(s, out1), 'NCAA tournament');
  assert.match(postseasonDetail(s, out1).text, /Site · out in the (first|second) round/);
  assert.ok(s.polls.final, 'final poll');
  assert.equal(s.polls.final.ranks[0].team, p.champion, 'the champion is #1 in the final poll');
});

check('record book', () => {
  const B = recordBook(league);
  assert.ok(B.games.length > 800 && B.games.every(g => g.homeLine.length >= 3));
  assert.ok(B.programs.some(x => x.titles === 1));
});

check('offseason and the next season', () => {
  beginOffseason(league);
  assert.ok(Array.isArray(draftWarnings(league)));
  addConference(league, 'Pacific Coast', { abbr: 'PAC', color: '#123456' });
  for (const t of ['UCLA', 'USC', 'Stanford', 'California', 'Oregon', 'Washington', 'Arizona', 'Arizona State', 'Utah', 'Colorado']) league.draft.teams[t].conference = 'Pacific Coast';
  const s2 = startNextSeason(league);
  assert.equal(s2.year, 2031);
  const conf = s2.games.filter(g => g.confGame && s2.teams[g.home].conference === 'Pacific Coast');
  assert.ok(conf.length > 0);
  const c = {};
  for (const g of conf) for (const t of [g.home, g.away]) c[t] = (c[t] || 0) + 1;
  assert.equal(new Set(Object.values(c)).size, 1, 'the new conference plays a fair schedule');
  rebuildSchedule(s2, s);
  assert.ok(s2.games.some(g => g.type === 'regular'));
});

check('a saved league loads again', () => {
  const copy = JSON.parse(JSON.stringify(league));
  migrateLeague(copy);
  assert.equal(copy.currentYear, 2031);
});

console.log(`${n} checks ok in ${Date.now() - t0} ms`);
