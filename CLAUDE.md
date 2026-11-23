# AAU Volleyball

A college volleyball dynasty set in 2030, women's and men's as two separate
dynasties behind a switch in the top bar: women's has all 72 AAU schools
with women's volleyball (57 Division I, 13 Division III, 2 Canadian), men's
the 14 with men's volleyball. It started as a copy of the owner's MCS
Dynasty (softball) and keeps its engine and features, adapted to volleyball.

**It is not synced with MCS Dynasty, SACAA Dynasty or AAU Dynasty.** Changes
here aren't ported to those repos, and theirs aren't ported here, unless the
owner asks. (MCS and SACAA keep each other in sync; that rule doesn't
include this repo.)

## Volleyball adaptations to keep in mind

- Game fields keep the MCS names: `homeLine`/`awayLine` are points per set,
  `homeR`/`awayR` sets won, `homeH`/`awayH` kills, `homeE`/`awayE` errors,
  and a record's `rs`/`ra` are sets won and lost.
- Ratings are stored as `off`, `pit`, `def` and shown as ATK (attack), SRV
  (serving and passing), DEF (blocking and digging). OVR = 0.4/0.3/0.3.
- Postseason stages keep the MCS internal names: `regionals` = regionals
  (single elimination, 2–8 teams, each team with a regional seed 1–N shown
  inside its regional), `supers` = super regionals (one match between two
  regional winners), `mcws` = the Final Four. The owner chose the names
  Regional and Super Regional. User-facing text never says MCWS, series,
  innings, runs or hits.
- The AAU look (Nov. 2026, ported from AAU Field Hockey, built to match the
  owner's mockups): a two-row top bar (brand row, then the menu); scoreboard
  cards (`gameCard`: the conference's color bar and logo, a row per team with
  the points in each set and the final, the loser faded); standings with the conference
  list down the side (`st-*`), each conference in its colors (`confVars`,
  `confHead`; conference W-L, GB), All conferences compact, the last 5 (postseason
  included) opening the poll's match pop-up; the poll as a board (`pb-*`)
  beside movers, receiving votes and dropped out, under the No. 1 team's
  card; the team page header in the team's colors with title banners and a
  numbers strip (`teamHero`) and schedule boxes (`ts2-*`: one regular-season
  box, conference logo on conference matchs, a box per tournament, a venue
  column, the result opening the box score); Postseason → Full bracket
  (`renderBoard`). Navy `--board`, gold `--optic`; Oswald, Saira Condensed,
  Inter.
- On-screen text says "match", not "game".
- Women's and men's: `league.side` is 'women' (or missing, older saves) or
  'men'. Each side has its own save key (`js/store.js`), seed data
  (`js/data.js`, `js/data-men.js`), default settings (`defaultSettings(side)`:
  men's NCAA is `regionals: 0`, a 6-team single-elimination field at one
  site) and migrations (the women's conference alignment never touches the
  men's league). Keep features shared; put differences in data or settings.
- Women's teams start in the owner's eight conferences (the AAU Dynasty alignment),
  set in `js/data.js` with drawn logos (`tools/conf_logos.py`, transparent
  SVGs in `img/conf/`); ratings come from the 2025 season
  (Wikipedia, school sites), with D-III and Canadian programs at 42–50.
  Coaches are the real 2026 head coaches. Men's teams start in two men's-only
  conferences (PVF and EVA), rated from the 2026 season.
- Men's non-conference play (`settings.nonConf`): 'mixed' by default, four
  weekends before conference play where about half the teams play a hosted
  invitational (2 + 2 teams from two conferences, each playing the other
  conference's two, Friday and Saturday) and the rest a two-match series
  against a team from another conference; 'once' (everyone in the other
  conference once) is still a setting. Women's uses 'invitationals'.
- Invitationals: no team plays a match outside its event in the middle of
  it, away or at home (the owner's rule, Nov. 2026). In a three-team event
  the host sits out the middle day and rests; teams sitting out the first
  or last day may play a match elsewhere that day.
- Travel partners (`js/partners.js`, the owner's ask, Nov. 2026): in a
  conference of four or more, nearby schools travel as a pair (picked by
  distance, `autoPartners`; the commissioner can re-pair them or turn them
  off in Standings → Commissioner: `settings.partners[conf]`,
  `settings.partnersOff[conf]`). A pair visits a pair for a weekend: each
  visitor plays one host on the first day and the other on the second.
  Partners meet on their pair's open weekend (or a rivalry weekend); a
  school without a partner (the odd one out, or any the commissioner sets:
  `settings.partnerSolos[conf]`; every school's partner is a menu) plays
  both schools of a pair in a weekend, or one match against another school on
  its own. No team is away more than two conference weekends in a row, or
  home more than three (the owner's rule, Nov. 2026: hosts and the order of
  weekends are searched for it). A partner match can't share a weekend with
  a school on its own (three schools need three days).
  `partnerRounds` builds everyone-once, everyone-twice or in between (second
  meetings left out by whole weekends where it can), with hosts chosen so
  each team is home for half (one off at most when meetings aren't all
  doubled); when it can't (an 8-team single round robin, for one), the
  conference gets the plain round robin. `season.partnerConfs` lists the
  conferences scheduled in pairs.
- Conference home and away (`js/homeaway.js`, the owner's rule, Nov. 2026):
  no team plays more than two conference weekends in a row away (`MAX_AWAY`)
  or three at home (`MAX_HOME`); a week without a conference match ends a
  run. `generateSchedule` draws the season (`drawSchedule`), then
  `spreadConfHomes` trades hosts between a pair's two meetings, turns around
  triangles of single meetings or a single meeting (every team within one
  match or series of half), and trades two conference weeks when every team
  plays on the same days in both. A pair meeting twice keeps one at each
  school. Travel-partner conferences are left alone (they're built that
  way). A once-a-year pair swaps hosts from last year unless the rule needs
  otherwise.
- Seeds on screen in the national tournament (`shownSeed` in
  `js/postseason.js`, the owner's rule, Nov. 2026): every team keeps its
  regional seed all the way through, so a 1 seed is still a 1 at the finals,
  whatever regional it came from. National seeds (`shownNationalSeed`) show
  only where they're named (a regional's top seeds) and with no regionals.
- Regionals avoid first-round matchups between conference rivals
  (`avoidConferenceMatchups` in `js/postseason.js`, the owner's rule): after
  the serpentine, teams on one seed line trade regionals (lowest lines
  first), then, as a last resort, a team moves one seed line; the top line
  never moves. `pods(field, n, season)` applies it, so bracketology, the
  selection preview and the announced field agree. Bracketology and the
  preview show each regional's first-round matchups.
- The Greater South Conference (the owner's, coming in; Kansas, Missouri,
  Tulane, UAB, Vanderbilt, Iowa State, Saint Louis, Memphis) has its logo
  ready (`gsc.svg`, the owner's pick: slanted GSC, striped S, compass in the
  G; Saira Black): it's in the Add conference pick (`AAU_CONFERENCES`), and
  a Greater South made by hand gets it on load (`migrateLeague`).
- The Horizon Valley Conference (the owner's, coming in; Loyola Chicago, UIC,
  IU Indianapolis, UMKC, Missouri S&T, Cincinnati, Dayton, West Virginia,
  Ohio, Southern Illinois) has its logo ready the same way (`hvc.svg`, the
  owner's pick: slanted HVC in Archivo Expanded Black with white, orange and
  plum outlines, a striped orange sun rising behind).
- The Western Athletic Conference is coming back (the owner's; Northern
  Arizona, San Diego State, Nevada, UNLV, Oregon State, BYU, Utah State,
  Washington State) with the owner's pick for its logo, the 1992–2010 WAC
  logo linked from the web (`CONF_LOGO_LINKS.wac`), ready the same way.
- The Rocky West Conference (the owner's, coming in; Colorado State, Denver,
  Colorado School of Mines, Montana, Montana State, North Dakota, North
  Dakota State, New Mexico, New Mexico State, UTEP, UTSA) and the Colonial 10
  (Northeastern, UMass Amherst, Lehigh, Temple, Rhode Island, East Carolina,
  Charlotte, George Mason, VCU) have their logos ready the same way, the
  owner's picks (Nov. 2026): `rwc.svg`, RWC slanted in Saira Black, forest
  green, before a snow-capped range and a gold sun; `c10.svg`, a block C in
  red and white stripes and a navy 10 in Bungee, a red star over the 1.
  The three conferences' thirty schools, and Boston College (suggested for
  the Metro), are in the Add team pick
  (`AAU_SCHOOLS`, `crop: 4`: ESPN logos, `AAU_PROGRAMS` venues for the
  sports each plays, coaches added by hand), not in the starting league.
- Realignment from AAU Dynasty (`js/realign.js`, Nov. 2026): the hub's
  Realignment page leaves a plan in IndexedDB `aau-realignment` (read
  when the app loads or comes back into view, never created here); the
  Offseason page shows it (`realignBanner`) with a review where each move,
  join and leave can be unticked (`realignModal`). Only teams in the AAU's
  all-sports conferences move; schools join only if they play this sport
  (`AAU_PROGRAMS`), at `JOIN_RATING` (60) with their venue and logo; new
  conferences get their logo; empty ones can be retired. Applied or skipped
  is kept in `league.realign[planId]`.

## Before every commit

- `python3 tools/stamp.py`
- `sh tools/check.sh`
- `node tests/logic.test.mjs`
- `python3 tests/ui_test.py` (Playwright; Chromium is preinstalled)
