# AAU Volleyball

A commissioner-style college volleyball dynasty, women's and men's. It's 2030: the NCAA
has collapsed and the **Association of American Universities** runs college
athletics. This dynasty covers **every AAU member with women's volleyball**,
72 programs from every level (57 from NCAA Division I, 13 from Division III
and the two Canadian members from U SPORTS): set-by-set scores, standings, the RPI, a voters' poll,
conference play, the **AAU National Tournament** (what the NCAA tournament became) through the Final Four, coaches, the
offseason and a record book.

It's built on the MCS Dynasty engine (the softball dynasty) and works the same
way, with volleyball's rules, schedule and tournament.

Open `index.html` through any static web server (GitHub Pages works: Settings
→ Pages → Deploy from a branch → `main`, `/ (root)`). The dynasty saves in the
browser; **Settings → Download backup** keeps a copy or moves it to another
device.

## Women's and men's

The switch at the top of every page flips between two **completely separate
dynasties**, women's and men's. Each has its own teams, conferences,
schedule, ratings, coaches, polls, postseason, history, records, settings
and backups; switching saves the one you're on and opens the other right
where you left it. Everything below works the same way in both.

**Men's** starts with the 14 AAU schools that play men's volleyball, in two
men's-only conferences of seven (each with its own logo):

| Conference | Teams |
|---|---|
| Pacific Volleyball Federation (PVF) | UCLA, UC Irvine, USC, UC Santa Barbara, UC San Diego, Stanford, UC Santa Cruz |
| Eastern Volleyball Association (EVA) | Penn State, Ohio State, Princeton, Harvard, MIT, NYU, Toronto |

Ratings come from the 2026 season (UCLA 29-2 and the No. 1 seed, UC Irvine
the national runner-up, USC and Penn State in the 2026 NCAA field, and so on);
coaches are the real 2026-27 head coaches (UC Santa Cruz's couldn't be
confirmed, so that job starts open). More schools can start men's programs:
add them as teams in the offseason. Men's schedule (the default, changeable in **Settings → Schedule format →
Non-conference schedule**): everyone in your conference twice, home and
away, and everyone in the other conference once, 19 matches. The
non-conference matches come first (Friday and Saturday, ending the week
before conference play), then the conference. The AAU National Tournament is **6 teams, single elimination at
one site** (at Pauley Pavilion; change it in
Settings): 3 v 6 and 4 v 5 on Wednesday, the 1 and 2 seeds waiting for them
in Friday's semifinals, the final Sunday.

## The league

72 schools in the commissioner's eight conferences (the alignment from the
AAU Dynasty), each with a logo drawn for this dynasty: transparent
backgrounds, in `img/conf/` (redraw them with `python3 tools/conf_logos.py`).
Change the alignment yourself: move any team on its page (then **Settings →
Rebuild schedule** before the first match) or in the offseason, add
conferences and teams, or make a team independent.

| Conference | Teams |
|---|---|
| Big Ten | Illinois, Indiana, Iowa, Michigan, Michigan State, Minnesota, Northwestern, Ohio State, Penn State, Purdue, Wisconsin |
| Coastal Atlantic Conference (CAC) | Duke, Florida, Georgia Tech, Maryland, Miami, North Carolina, Notre Dame, South Florida, Virginia |
| Ivy League | Brown, Columbia, Cornell, Dartmouth, Harvard, Penn, Princeton, Yale |
| Metro Conference | Buffalo, George Washington, Georgetown, McGill, Pittsburgh, Rutgers, Stony Brook, Toronto |
| Pacific-10 Conference | Arizona, Arizona State, California, Colorado, Oregon, Stanford, UCLA, USC, Utah, Washington |
| Southwest Conference (SWC) | Kansas, Missouri, Rice, Texas, Texas A&M, Tulane, UAB, Vanderbilt |
| UC Athletic Association (UCAA) | Caltech, UC Davis, UC Irvine, UC Riverside, UC San Diego, UC Santa Barbara, UC Santa Cruz |
| University Athletic Association (UAA) | Brandeis, Carnegie Mellon, Case Western, Chicago, Emory, Johns Hopkins, MIT, NYU, Rochester, Tufts, WashU |

Division I, Division III and Canadian schools all play in one league; every
conference champion takes an automatic bid.

Every team has its real colors, mascot, home arena and city. Head coaches are
each program's real head coach for the 2026 season (from the schools'
athletics sites, checked October 2026; USC's Brad Keller is on leave, with
Megan Moenoa interim). By 2030 some will have moved on; rename anyone on the
Coaches page.

## Ratings

Three ratings, 40–99:

- **ATK**: attack (hitting and kills)
- **SRV**: serving and passing
- **DEF**: blocking and digging

**OVR** = 40% ATK + 30% SRV + 30% DEF.

Starting OVRs come from each program's 2025 season, using Wikipedia's *2025
NCAA Division I women's volleyball tournament* page (Texas A&M beat Kentucky
for the title). The RPI and AVCA Top 25 from early November 2025 were used
too, plus each program's level for teams that missed the tournament. The
2025 Final Four teams among AAU schools, Texas A&M, Pittsburgh and Wisconsin,
start near the top with Texas and Stanford.

Division III and Canadian programs start well below Division I, at 42–50
OVR, ordered by their 2025 seasons where results were found: Carnegie Mellon
(24-8, first UAA title, beating No. 17 WashU in the final) and WashU (24-9,
D-III Sweet 16) at the top, then Tufts (24-6, NESCAC champion) and Emory
(20-8, 29th straight NCAA tournament), Chicago (UAA regular-season champion),
Case Western (17-14) and Rochester (4-20) at the bottom. NYU, Brandeis, Johns
Hopkins, MIT, Caltech, UC Santa Cruz, McGill and Toronto are estimates from
each program's usual level. Each OVR is split into ATK, SRV and DEF a few
points apart so teams have a style. Edit any rating on the Teams page or a
team's page.

Ratings move during the season with results (beating a better team moves
them up; the part of the match that won it, kills, ball control or holding
the other team down, moves most), and between seasons in the offseason.

## Matches

Every match is played rally by rally: best of five, sets 1–4 to 25 and the
fifth to 15, each won by two. The receiving team wins most rallies (a
side-out, about 58% between equal teams), more often when its attack beats the
other team's block and defense and its passing beats the serve. Each point is
a kill, an ace, a block or an error.

A team 10 OVR points better wins about 77% of the time, 20 points better
about 92%; home court is worth about 3 points of win chance. Box scores show
each set's points, sets won, kills (K) and errors (E). Enter any score by hand
(set by set; kills and errors are estimated when left blank), simulate one
match, a day, a week or the season.

## The season

13 weeks by default, late August to late November (Settings → Schedule
format):

- **Non-conference**: invitationals (the women's default, below) or **play
  every non-conference team once** (the men's default), set in Settings →
  Schedule format.
- **Invitationals** (weeks 1–4): every team plays a weekend round robin,
  usually four teams and three matches, **one a day with no doubleheaders**:
  some events run Thursday to Saturday, others Friday to Sunday. Each is
  hosted by one of its teams and named for it (the *Texas Invitational*). No
  two teams from one conference, rarely a repeat opponent, and teams lean
  toward events near home. A big conference needs more events than
  four-team ones allow, so some events have three teams; each day one of
  them sits out, and teams sitting out the same day meet in a third match.
  The Schedule page has **Tournament standings** for each event.
- **Conference play** fills the rest, two matches a week against different
  opponents: the first on Thursday or Friday, the second on Saturday or
  Sunday (each conference picks: Friday/Saturday by default, or
  Friday/Sunday, Thursday/Saturday, Thursday/Sunday). Every team plays
  everyone in its conference home and away, or **18 conference matches** if
  that's fewer: the 7-team UCAA plays 12, the 8-team conferences 14, the
  9-team ones 16, the 10-team Pac-10 18, and the 11-team Big Ten and UAA 18
  (everyone once, eight of them twice; which ones changes every season). The 18 is a setting. **Every member plays
  the same number of conference matches, half at home.** A conference that
  needs fewer weeks starts later; one that needs ten weeks starts in the last
  invitational week.
- Teams with an open date (a bye in an odd-sized conference, or an
  independent) play a non-conference match when there's an opponent.
- About **28–30 matches** per team (the most is a setting).

Standings, tiebreakers, the RPI (25% winning percentage, 50% opponents', 25%
opponents' opponents'), strength of schedule, quadrants, power ratings and a
**Top 25-style poll** with 23 voters (Top 15 by default; Settings changes it)
all work as in MCS Dynasty, with sets in place of runs.

## The postseason

1. **Conference tournaments**: most volleyball conferences don't have one, so
   none is held by default and the regular-season champion takes the
   automatic bid. Turn one on per conference (Standings → Commissioner): top
   2–16 teams, single elimination, double elimination or play-in then double
   elimination, at a host school you can change.
2. **Selection**: as in MCS. Every conference champion gets an automatic
   bid; the committee picks the at-large teams in committee order (RPI, Q1
   wins, Q4 losses, then SOS, head-to-head and so on), teams below .500 can't
   take an at-large spot, you check and uncheck teams, confirm them, drag
   seeds, watch the regional preview, and announce the field. **Bracketology**
   projects it from week 4.
3. **AAU National Tournament** (Settings → AAU National Tournament), every round one match:
   - **Regionals**: 32 teams in 4 regionals of 8, hosted by the top 4
     national seeds and built serpentine. Every team has a **regional seed**
     inside its regional (1–8), shown on the bracket, schedule and box
     scores. Three rounds, Thursday to Saturday: 1 v 8, 4 v 5, 2 v 7 and 3 v
     6, then 1/8 v 4/5 and 2/7 v 3/6, then the regional final (the Elite
     Eight). With 6 per regional (24 teams) the 1 and 2 seeds wait a round;
     with 4 (16 teams) it's 1 v 4 and 2 v 3, then the final.
   - **Final Four** at T-Mobile Center in Kansas City (change the name, arena
     and city in Settings): semifinals Thursday, national final Sunday. The
     semifinals keep the bracket by the hosts' national seeds: the 1 seed's
     regional meets the 4 seed's, and 2 meets 3.

   Other shapes: no regionals at all (2 to 8 teams single elimination at the
   finals site, the men's default), 2–8 teams per regional, 8 regionals whose winners meet in
   super regionals (one match at the higher national seed), or 8 teams at
   the finals. A dynasty saved on the old default (8 regionals of 4) moves
   to 4 of 8 for any season whose field hasn't been announced.

The final poll comes out after the final, with the champion at #1.

## The offseason

As in MCS Dynasty: realign conferences, add teams and conferences, make
teams independent, the coaching carousel and hot seat, coach and program
prestige, and rating points to place on ATK, SRV and DEF.

## History and records

Team pages (season, schedule with set scores, ratings, poll history,
program history, head-to-head), coach pages, conference pages with champions
by season, and the **Records** page: program records, single-season records
(most sets won, fewest sets lost, best set differential, winning streaks),
single-match records (most points, most kills, most one-sided sweep, most
combined points, longest five-setters, longest sets), poll records and
coaching records.

## Logos

From the college football logo list MCS uses (ESPN logos), plus ESPN's
women's college volleyball team list for schools without football. Both are
fetched by the browser and cached. Any team can get its own logo on its page.

## Development

Plain ES modules, no build step. Before every commit:

```
python3 tools/stamp.py      # version-stamp script and stylesheet links
sh tools/check.sh           # every module parses
node tests/logic.test.mjs   # engine tests
python3 tests/ui_test.py    # browser test (Playwright + Chromium)
```

| File | What it does |
|---|---|
| `js/data.js` | Teams, conferences, arenas, ratings, coaches |
| `js/sim.js` | Rally-by-rally match simulator and win chances |
| `js/ratings.js` | In-season rating movement |
| `js/schedule.js` | Invitationals and conference schedules |
| `js/standings.js` | Records, standings, tiebreakers, RPI, quadrants |
| `js/polls.js` | Power ratings and the voters' poll |
| `js/postseason.js` | Conference tournaments, selection, the AAU National Tournament |
| `js/league.js` | Seasons, results, coaches, offseason |
| `js/records.js`, `js/hotseat.js` | Record book, hot seat |
| `js/views-*.js`, `js/ui.js` | Pages |
