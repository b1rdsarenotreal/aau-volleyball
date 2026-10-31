# AAU Volleyball

A women's college volleyball dynasty for the 57 AAU schools with Division I
volleyball, set in 2030. It started as a copy of the owner's MCS Dynasty
(softball) and keeps its engine and features, adapted to volleyball.

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
- Postseason stage names stay internal from MCS: `regionals` = first- and
  second-round sites (single elimination), `supers` = regional finals (one
  match), `mcws` = the Final Four. User-facing text never says MCWS,
  regional (for the sites), super regional, series, innings, runs or hits.
- On-screen text says "match", not "game".
- Teams start in their real 2025 volleyball conferences; ratings come from
  the 2025 season (Wikipedia). Coaches are made-up names.

## Before every commit

- `python3 tools/stamp.py`
- `sh tools/check.sh`
- `node tests/logic.test.mjs`
- `python3 tests/ui_test.py` (Playwright; Chromium is preinstalled)
