# AAU Volleyball

A women's college volleyball dynasty for all 72 AAU schools with women's
volleyball (57 Division I, 13 Division III, 2 Canadian), set in 2030. It
started as a copy of the owner's MCS Dynasty (softball) and keeps its engine
and features, adapted to volleyball.

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
- Teams start in the owner's eight conferences (the AAU Dynasty alignment),
  set in `js/data.js` with drawn logos (`tools/conf_logos.py`, transparent
  SVGs in `img/conf/`); ratings come from the 2025 season
  (Wikipedia, school sites), with D-III and Canadian programs at 42–50.
  Coaches are the real 2026 head coaches.

## Before every commit

- `python3 tools/stamp.py`
- `sh tools/check.sh`
- `node tests/logic.test.mjs`
- `python3 tests/ui_test.py` (Playwright; Chromium is preinstalled)
