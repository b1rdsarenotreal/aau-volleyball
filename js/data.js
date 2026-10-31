// Starting league: the 57 members of the Association of American
// Universities that sponsor Division I women's volleyball, in the 2030
// season after the AAU took over college athletics. Teams start in the
// conferences they play volleyball in today (realign them in the offseason,
// or before the first serve from each team page). Colors are each school's
// real colors.
//
// Ratings: ATK (attack), SRV (serving and passing) and DEF (blocking and
// digging), 40–99. Stored internally as off / pit / def. They come from each
// program's 2025 season: the 2025 NCAA tournament (Wikipedia: "2025 NCAA
// Division I women's volleyball tournament"; champion Texas A&M), the RPI and
// AVCA Top 25 from early November 2025, and each program's level for teams
// that didn't make the tournament. See README → Ratings.

export const START_YEAR = 2030;

export const CONFERENCES = {
  'ACC':        { abbr: 'ACC', color: '#013CA6' },
  'American':   { abbr: 'AAC', color: '#0B2240' },
  'Big 12':     { abbr: 'B12', color: '#B3261E' },
  'Big Ten':    { abbr: 'B1G', color: '#0088CE' },
  'Big West':   { abbr: 'BW',  color: '#0E7C86' },
  'Ivy League': { abbr: 'IVY', color: '#00693E' },
  'SEC':        { abbr: 'SEC', color: '#1F4A8C' },
};

// [school, conference, abbr, mascot, color, altColor, OVR]
// OVR is split into ATK / SRV / DEF a few points apart (see seedTeams).
const T = [
  ['Illinois', 'Big Ten', 'ILL', 'Fighting Illini', '#13294B', '#E84A27', 74],
  ['Indiana', 'Big Ten', 'IND', 'Hoosiers', '#990000', '#EEEDEB', 83],
  ['Iowa', 'Big Ten', 'IOWA', 'Hawkeyes', '#000000', '#FFCD00', 63],
  ['Maryland', 'Big Ten', 'MD', 'Terrapins', '#E21833', '#FFD200', 66],
  ['Michigan', 'Big Ten', 'MICH', 'Wolverines', '#00274C', '#FFCB05', 77],
  ['Michigan State', 'Big Ten', 'MSU', 'Spartans', '#18453B', '#FFFFFF', 75],
  ['Minnesota', 'Big Ten', 'MINN', 'Golden Gophers', '#7A0019', '#FFCC33', 83],
  ['Northwestern', 'Big Ten', 'NU', 'Wildcats', '#4E2A84', '#FFFFFF', 64],
  ['Ohio State', 'Big Ten', 'OSU', 'Buckeyes', '#BB0000', '#666666', 72],
  ['Oregon', 'Big Ten', 'ORE', 'Ducks', '#154733', '#FEE123', 71],
  ['Penn State', 'Big Ten', 'PSU', 'Nittany Lions', '#041E42', '#FFFFFF', 80],
  ['Purdue', 'Big Ten', 'PUR', 'Boilermakers', '#000000', '#CFB991', 87],
  ['Rutgers', 'Big Ten', 'RUTG', 'Scarlet Knights', '#CC0033', '#5F6A72', 59],
  ['UCLA', 'Big Ten', 'UCLA', 'Bruins', '#2D68C4', '#F2A900', 78],
  ['USC', 'Big Ten', 'USC', 'Trojans', '#990000', '#FFC72C', 82],
  ['Washington', 'Big Ten', 'UW', 'Huskies', '#4B2E83', '#B7A57A', 72],
  ['Wisconsin', 'Big Ten', 'WIS', 'Badgers', '#C5050C', '#FFFFFF', 89],
  ['California', 'ACC', 'CAL', 'Golden Bears', '#003262', '#FDB515', 64],
  ['Duke', 'ACC', 'DUKE', 'Blue Devils', '#00539B', '#FFFFFF', 67],
  ['Georgia Tech', 'ACC', 'GT', 'Yellow Jackets', '#003057', '#B3A369', 74],
  ['Miami', 'ACC', 'MIA', 'Hurricanes', '#005030', '#F47321', 81],
  ['North Carolina', 'ACC', 'UNC', 'Tar Heels', '#7BAFD4', '#13294B', 79],
  ['Notre Dame', 'ACC', 'ND', 'Fighting Irish', '#0C2340', '#C99700', 67],
  ['Pittsburgh', 'ACC', 'PITT', 'Panthers', '#003594', '#FFB81C', 91],
  ['Stanford', 'ACC', 'STAN', 'Cardinal', '#8C1515', '#FFFFFF', 89],
  ['Virginia', 'ACC', 'UVA', 'Cavaliers', '#232D4B', '#E57200', 63],
  ['Florida', 'SEC', 'FLA', 'Gators', '#0021A5', '#FA4616', 78],
  ['Missouri', 'SEC', 'MIZ', 'Tigers', '#000000', '#F1B82D', 67],
  ['Texas', 'SEC', 'TEX', 'Longhorns', '#BF5700', '#FFFFFF', 92],
  ['Texas A&M', 'SEC', 'TAMU', 'Aggies', '#500000', '#FFFFFF', 93],
  ['Vanderbilt', 'SEC', 'VAN', 'Commodores', '#000000', '#CFAE70', 59],
  ['Arizona', 'Big 12', 'ARIZ', 'Wildcats', '#0C234B', '#AB0520', 76],
  ['Arizona State', 'Big 12', 'ASU', 'Sun Devils', '#8C1D40', '#FFC627', 86],
  ['Colorado', 'Big 12', 'COLO', 'Buffaloes', '#000000', '#CFB87C', 80],
  ['Kansas', 'Big 12', 'KU', 'Jayhawks', '#0051BA', '#E8000D', 84],
  ['Utah', 'Big 12', 'UTAH', 'Utes', '#CC0000', '#000000', 73],
  ['Brown', 'Ivy League', 'BRWN', 'Bears', '#4E3629', '#C00404', 53],
  ['Columbia', 'Ivy League', 'CLMB', 'Lions', '#1D4F91', '#9BCBEB', 55],
  ['Cornell', 'Ivy League', 'COR', 'Big Red', '#B31B1B', '#FFFFFF', 53],
  ['Dartmouth', 'Ivy League', 'DART', 'Big Green', '#00693E', '#FFFFFF', 51],
  ['Harvard', 'Ivy League', 'HARV', 'Crimson', '#A51C30', '#1E1E1E', 57],
  ['Penn', 'Ivy League', 'PENN', 'Quakers', '#011F5B', '#990000', 55],
  ['Princeton', 'Ivy League', 'PRIN', 'Tigers', '#E77500', '#000000', 68],
  ['Yale', 'Ivy League', 'YALE', 'Bulldogs', '#00356B', '#FFFFFF', 62],
  ['UC Davis', 'Big West', 'UCD', 'Aggies', '#022851', '#FFBF00', 61],
  ['UC Irvine', 'Big West', 'UCI', 'Anteaters', '#0064A4', '#FFD200', 60],
  ['UC Riverside', 'Big West', 'UCR', 'Highlanders', '#003DA5', '#FFB81C', 53],
  ['UC San Diego', 'Big West', 'UCSD', 'Tritons', '#182B49', '#C69214', 63],
  ['UC Santa Barbara', 'Big West', 'UCSB', 'Gauchos', '#003660', '#FEBC11', 64],
  ['Rice', 'American', 'RICE', 'Owls', '#00205B', '#7C7E7F', 74],
  ['South Florida', 'American', 'USF', 'Bulls', '#006747', '#CFC493', 75],
  ['Tulane', 'American', 'TULN', 'Green Wave', '#006747', '#418FDE', 64],
  ['UAB', 'American', 'UAB', 'Blazers', '#1E6B52', '#F4C300', 65],
  ['Buffalo', 'Independent', 'BUFF', 'Bulls', '#005BBB', '#FFFFFF', 59],
  ['George Washington', 'Independent', 'GW', 'Revolutionaries', '#033C5A', '#AA9868', 57],
  ['Georgetown', 'Independent', 'GTWN', 'Hoyas', '#041E42', '#63666A', 61],
  ['Stony Brook', 'Independent', 'SBU', 'Seawolves', '#990000', '#16243E', 59],
];

// Home arenas: [arena, city]. Every one can be edited on the team page.
export const SITES = {
  'Arizona': ['McKale Center', 'Tucson, Ariz.'],
  'Arizona State': ['Desert Financial Arena', 'Tempe, Ariz.'],
  'Brown': ['Pizzitola Sports Center', 'Providence, R.I.'],
  'Buffalo': ['Alumni Arena', 'Amherst, N.Y.'],
  'California': ['Haas Pavilion', 'Berkeley, Calif.'],
  'Colorado': ['CU Events Center', 'Boulder, Colo.'],
  'Columbia': ['Levien Gymnasium', 'New York, N.Y.'],
  'Cornell': ['Newman Arena', 'Ithaca, N.Y.'],
  'Dartmouth': ['Leede Arena', 'Hanover, N.H.'],
  'Duke': ['Cameron Indoor Stadium', 'Durham, N.C.'],
  'Florida': ['Exactech Arena', 'Gainesville, Fla.'],
  'George Washington': ['Charles E. Smith Center', 'Washington, D.C.'],
  'Georgetown': ['McDonough Arena', 'Washington, D.C.'],
  'Georgia Tech': ["O'Keefe Gymnasium", 'Atlanta, Ga.'],
  'Harvard': ['Malkin Athletic Center', 'Cambridge, Mass.'],
  'Illinois': ['Huff Hall', 'Champaign, Ill.'],
  'Indiana': ['Wilkinson Hall', 'Bloomington, Ind.'],
  'Iowa': ['Xtream Arena', 'Coralville, Iowa'],
  'Kansas': ['Horejsi Family Volleyball Arena', 'Lawrence, Kan.'],
  'Maryland': ['XFINITY Pavilion', 'College Park, Md.'],
  'Miami': ['Knight Sports Complex', 'Coral Gables, Fla.'],
  'Michigan': ['Cliff Keen Arena', 'Ann Arbor, Mich.'],
  'Michigan State': ['Jenison Field House', 'East Lansing, Mich.'],
  'Minnesota': ['Maturi Pavilion', 'Minneapolis, Minn.'],
  'Missouri': ['Hearnes Center', 'Columbia, Mo.'],
  'North Carolina': ['Carmichael Arena', 'Chapel Hill, N.C.'],
  'Northwestern': ['Welsh-Ryan Arena', 'Evanston, Ill.'],
  'Notre Dame': ['Purcell Pavilion', 'Notre Dame, Ind.'],
  'Ohio State': ['Covelli Center', 'Columbus, Ohio'],
  'Oregon': ['Matthew Knight Arena', 'Eugene, Ore.'],
  'Penn': ['The Palestra', 'Philadelphia, Pa.'],
  'Penn State': ['Rec Hall', 'University Park, Pa.'],
  'Pittsburgh': ['Fitzgerald Field House', 'Pittsburgh, Pa.'],
  'Princeton': ['Dillon Gym', 'Princeton, N.J.'],
  'Purdue': ['Holloway Gymnasium', 'West Lafayette, Ind.'],
  'Rice': ['Tudor Fieldhouse', 'Houston, Texas'],
  'Rutgers': ['College Avenue Gym', 'New Brunswick, N.J.'],
  'South Florida': ['Yuengling Center', 'Tampa, Fla.'],
  'Stanford': ['Maples Pavilion', 'Stanford, Calif.'],
  'Stony Brook': ['Island Federal Arena', 'Stony Brook, N.Y.'],
  'Texas': ['Gregory Gymnasium', 'Austin, Texas'],
  'Texas A&M': ['Reed Arena', 'College Station, Texas'],
  'Tulane': ['Devlin Fieldhouse', 'New Orleans, La.'],
  'UAB': ['Bartow Arena', 'Birmingham, Ala.'],
  'UC Davis': ['University Credit Union Center', 'Davis, Calif.'],
  'UC Irvine': ['Bren Events Center', 'Irvine, Calif.'],
  'UC Riverside': ['SRC Arena', 'Riverside, Calif.'],
  'UC San Diego': ['LionTree Arena', 'La Jolla, Calif.'],
  'UC Santa Barbara': ['Robertson Gymnasium', 'Santa Barbara, Calif.'],
  'UCLA': ['Pauley Pavilion', 'Los Angeles, Calif.'],
  'USC': ['Galen Center', 'Los Angeles, Calif.'],
  'Utah': ['Jon M. Huntsman Center', 'Salt Lake City, Utah'],
  'Vanderbilt': ['Memorial Gymnasium', 'Nashville, Tenn.'],
  'Virginia': ['Memorial Gymnasium', 'Charlottesville, Va.'],
  'Washington': ['Alaska Airlines Arena', 'Seattle, Wash.'],
  'Wisconsin': ['UW Field House', 'Madison, Wis.'],
  'Yale': ['John J. Lee Amphitheater', 'New Haven, Conn.'],
};

// Names the logo lists may know a school by.
export const LOGO_ALIASES = { 'Penn': 'Pennsylvania', 'Miami': 'Miami', 'UC Santa Barbara': 'UC Santa Barbara', 'George Washington': 'George Washington' };

// Head coaches for 2030. Five years on, nobody knows who will be coaching,
// so these are made-up names (rename anyone on the Coaches page).
const FIRST = ['Alexa', 'Brooke', 'Carla', 'Dana', 'Elena', 'Fiona', 'Gina', 'Hailey', 'Iris', 'Jenna', 'Kara', 'Lena', 'Maya', 'Nora', 'Olivia', 'Paige', 'Renee', 'Sofia', 'Tess', 'Vera',
  'Adam', 'Ben', 'Chris', 'Dan', 'Erik', 'Grant', 'Henry', 'Jake', 'Kyle', 'Luis', 'Marco', 'Nate', 'Owen', 'Paul', 'Reid', 'Sam', 'Tom', 'Wes'];
const LAST = ['Andersen', 'Baptiste', 'Carver', 'Dominguez', 'Ellery', 'Foster', 'Garland', 'Hayes', 'Iverson', 'Jessup', 'Kowalski', 'Larkin', 'Mendez', 'Novak', 'Ortega', 'Pruitt',
  'Quinlan', 'Reyes', 'Sorensen', 'Tanaka', 'Underwood', 'Vasquez', 'Whitfield', 'Yates', 'Zimmer', 'Brennan', 'Castellanos', 'Delgado', 'Fairbanks', 'Holm', 'Kessler', 'Lindqvist',
  'Marchetti', 'Okafor', 'Petrova', 'Rasmussen', 'Sato', 'Thibodeaux', 'Vance', 'Wexler'];
function hashName(s) { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; return h; }
export const COACHES = (() => {
  const out = {}, used = new Set();
  for (const [school] of T) {
    let h = hashName(school), name;
    do { name = `${FIRST[h % FIRST.length]} ${LAST[(h >>> 8) % LAST.length]}`; h = hashName(name + h); } while (used.has(name));
    used.add(name); out[school] = name;
  }
  return out;
})();

export function makeTeam({ school, conference, abbr, mascot = '', coach = '', coachId = null, color = '#555555', altColor = '#dddddd', off = 65, pit = 65, def = 65, stadium, city }) {
  const known = SITES[school] || [];
  return {
    school, conference, abbr: abbr || school.replace(/[^A-Za-z ]/g, '').split(/\s+/).map(w => w[0]).join('').slice(0, 4).toUpperCase(),
    mascot, coach, coachId, color, altColor, off, pit, def, base: { off, pit, def }, logoOverride: null,
    stadium: stadium || known[0] || '', city: city || known[1] || '',
  };
}

// Gives a team its home arena from SITES if it has none yet (older saves).
export function fillSite(t) {
  if (t.stadium !== undefined && t.city !== undefined) return;
  const known = SITES[t.school] || [];
  t.stadium ??= known[0] || '';
  t.city ??= known[1] || '';
}

// OVR → ATK / SRV / DEF: each team leans a little one way (a big attacking
// team, a ball-control team, a blocking team), keeping the same OVR.
export function splitOvr(school, ovr) {
  const h = hashName(school);
  const a = (h % 7) - 3, b = ((h >>> 4) % 5) - 2;
  const off = ovr + a, pit = ovr + b, def = Math.round(ovr - (0.4 * a + 0.3 * b) / 0.3);
  const c = x => Math.max(40, Math.min(99, x));
  return { off: c(off), pit: c(pit), def: c(def) };
}

export function seedTeams() {
  const teams = {};
  for (const [school, conference, abbr, mascot, color, altColor, ovr] of T) {
    teams[school] = makeTeam({ school, conference, abbr, mascot, coach: COACHES[school] || '', color, altColor, ...splitOvr(school, ovr) });
  }
  return teams;
}
