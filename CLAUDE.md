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

## Before every commit

- `python3 tools/stamp.py`
- `sh tools/check.sh`
- `node tests/logic.test.mjs`
- `python3 tests/ui_test.py` (Playwright; Chromium is preinstalled)
