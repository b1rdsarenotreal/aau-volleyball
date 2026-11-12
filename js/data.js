// Starting league: every member of the Association of American Universities
// with a women's volleyball team, in the 2030 season after the AAU took over
// college athletics: 57 from NCAA Division I, 13 from Division III and the two
// Canadian members (U SPORTS). Teams start in the commissioner's conferences
// (below). Realign in the offseason, or before the first serve from each team
// page. Colors are each school's real colors.
//
// Ratings: ATK (attack), SRV (serving and passing) and DEF (blocking and
// digging), 40–99. Stored internally as off / pit / def. They come from each
// program's 2025 season: the 2025 NCAA tournament (Wikipedia: "2025 NCAA
// Division I women's volleyball tournament"; champion Texas A&M), the RPI and
// AVCA Top 25 from early November 2025, and each program's level for teams
// that didn't make the tournament. See README → Ratings.
// Division III and Canadian programs sit well below Division I (OVR 42–50),
// ordered by their real 2025 results where found: Carnegie Mellon won its
// first UAA title over No. 17 WashU (24-8), WashU reached the D-III Sweet 16
// (24-9), Tufts won the NESCAC and hosted a regional (24-6), Emory made its
// 29th straight NCAA tournament (20-8), Chicago won the UAA regular season
// (14-12), Case Western was fifth in the UAA (17-14) and Rochester went 4-20.
// The rest (NYU, Brandeis, Johns Hopkins, MIT, Caltech, UC Santa Cruz, McGill,
// Toronto) are estimates from each program's usual level.

import { DEFAULT_LOGOS } from './logo-import.js?v=20261111225337';
import { MEN_CONFERENCES, MEN_TEAMS, MEN_COACHES } from './data-men.js?v=20261111225337';

export const START_YEAR = 2030;

// The commissioner's conference alignment (from the AAU Dynasty), each with a
// logo drawn for this dynasty (img/conf/, made by tools/conf_logos.py,
// transparent backgrounds). Volleyball-only members are full members here;
// affiliates for other sports (UAB in Pac-10 men's soccer, UC Davis in UAA
// football) don't apply.
// Conference logos the owner picked from the web (linked, not copied; the
// drawn ones in img/conf/ stay for CAC, SWC, UCAA and as fallbacks).
export const CONF_LOGO_LINKS = {
  bigten: 'https://content.sportslogos.net/logos/153/4661/full/big_ten_conference_logo_primary_20115933.png',
  ivy: 'https://content.sportslogos.net/logos/153/4824/full/ivy_league_logo_primary_2019_sportslogosnet-9024.png',
  metro: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/METRO_Primary_LtBG.png/500px-METRO_Primary_LtBG.png',
  pac10: 'https://content.sportslogos.net/logos/153/4945/full/pacific-10_conference_logo_wordmark_1995_sportslogosnet-1134.png',
  uaa: 'https://dbukjj6eu5tsf.cloudfront.net/uaasports.info/images/responsive_2023/logo-main.svg',
};
const L = f => CONF_LOGO_LINKS[f] || `img/conf/${f}.svg`;
export const CONFERENCES = {
  'Big Ten': { abbr: 'B1G', color: '#0088CE', altColor: '#0B2A4A', logo: L('bigten') },
  'Coastal Atlantic Conference': { abbr: 'CAC', color: '#3A4A5C', altColor: '#5CC6C2', logo: L('cac') },
  'Ivy League': { abbr: 'IVY', color: '#026937', altColor: '#C9B37E', logo: L('ivy') },
  'Metro Conference': { abbr: 'METRO', color: '#E03A3E', altColor: '#23262D', logo: L('metro') },
  'Pacific-10 Conference': { abbr: 'P10', color: '#092346', altColor: '#D6A84B', logo: L('pac10') },
  'Southwest Conference': { abbr: 'SWC', color: '#719AE8', altColor: '#F28C38', logo: L('swc') },
  'UC Athletic Association': { abbr: 'UCAA', color: '#0F6E7A', altColor: '#F2C14E', logo: L('ucaa') },
  'University Athletic Association': { abbr: 'UAA', color: '#003087', altColor: '#F2B33D', logo: L('uaa') },
};

// [school, conference, abbr, mascot, color, altColor, OVR]
// OVR is split into ATK / SRV / DEF a few points apart (see seedTeams).
const T = [
  ['Illinois', 'Big Ten', 'ILL', 'Fighting Illini', '#13294B', '#E84A27', 74],
  ['Indiana', 'Big Ten', 'IND', 'Hoosiers', '#990000', '#EEEDEB', 83],
  ['Iowa', 'Big Ten', 'IOWA', 'Hawkeyes', '#000000', '#FFCD00', 63],
  ['Maryland', 'Coastal Atlantic Conference', 'MD', 'Terrapins', '#E21833', '#FFD200', 66],
  ['Michigan', 'Big Ten', 'MICH', 'Wolverines', '#00274C', '#FFCB05', 77],
  ['Michigan State', 'Big Ten', 'MSU', 'Spartans', '#18453B', '#FFFFFF', 75],
  ['Minnesota', 'Big Ten', 'MINN', 'Golden Gophers', '#7A0019', '#FFCC33', 83],
  ['Northwestern', 'Big Ten', 'NU', 'Wildcats', '#4E2A84', '#FFFFFF', 64],
  ['Ohio State', 'Big Ten', 'OSU', 'Buckeyes', '#BB0000', '#666666', 72],
  ['Oregon', 'Pacific-10 Conference', 'ORE', 'Ducks', '#154733', '#FEE123', 71],
  ['Penn State', 'Big Ten', 'PSU', 'Nittany Lions', '#041E42', '#FFFFFF', 80],
  ['Purdue', 'Big Ten', 'PUR', 'Boilermakers', '#000000', '#CFB991', 87],
  ['Rutgers', 'Metro Conference', 'RUTG', 'Scarlet Knights', '#CC0033', '#5F6A72', 59],
  ['UCLA', 'Pacific-10 Conference', 'UCLA', 'Bruins', '#2D68C4', '#F2A900', 78],
  ['USC', 'Pacific-10 Conference', 'USC', 'Trojans', '#990000', '#FFC72C', 82],
  ['Washington', 'Pacific-10 Conference', 'UW', 'Huskies', '#4B2E83', '#B7A57A', 72],
  ['Wisconsin', 'Big Ten', 'WIS', 'Badgers', '#C5050C', '#FFFFFF', 89],
  ['California', 'Pacific-10 Conference', 'CAL', 'Golden Bears', '#003262', '#FDB515', 64],
  ['Duke', 'Coastal Atlantic Conference', 'DUKE', 'Blue Devils', '#00539B', '#FFFFFF', 67],
  ['Georgia Tech', 'Coastal Atlantic Conference', 'GT', 'Yellow Jackets', '#003057', '#B3A369', 74],
  ['Miami', 'Coastal Atlantic Conference', 'MIA', 'Hurricanes', '#005030', '#F47321', 81],
  ['North Carolina', 'Coastal Atlantic Conference', 'UNC', 'Tar Heels', '#7BAFD4', '#13294B', 79],
  ['Notre Dame', 'Coastal Atlantic Conference', 'ND', 'Fighting Irish', '#0C2340', '#C99700', 67],
  ['Pittsburgh', 'Metro Conference', 'PITT', 'Panthers', '#003594', '#FFB81C', 91],
  ['Stanford', 'Pacific-10 Conference', 'STAN', 'Cardinal', '#8C1515', '#FFFFFF', 89],
  ['Virginia', 'Coastal Atlantic Conference', 'UVA', 'Cavaliers', '#232D4B', '#E57200', 63],
  ['Florida', 'Coastal Atlantic Conference', 'FLA', 'Gators', '#0021A5', '#FA4616', 78],
  ['Missouri', 'Southwest Conference', 'MIZ', 'Tigers', '#000000', '#F1B82D', 67],
  ['Texas', 'Southwest Conference', 'TEX', 'Longhorns', '#BF5700', '#FFFFFF', 92],
  ['Texas A&M', 'Southwest Conference', 'TAMU', 'Aggies', '#500000', '#FFFFFF', 93],
  ['Vanderbilt', 'Southwest Conference', 'VAN', 'Commodores', '#000000', '#CFAE70', 59],
  ['Arizona', 'Pacific-10 Conference', 'ARIZ', 'Wildcats', '#0C234B', '#AB0520', 76],
  ['Arizona State', 'Pacific-10 Conference', 'ASU', 'Sun Devils', '#8C1D40', '#FFC627', 86],
  ['Colorado', 'Pacific-10 Conference', 'COLO', 'Buffaloes', '#000000', '#CFB87C', 80],
  ['Kansas', 'Southwest Conference', 'KU', 'Jayhawks', '#0051BA', '#E8000D', 84],
  ['Utah', 'Pacific-10 Conference', 'UTAH', 'Utes', '#CC0000', '#000000', 73],
  ['Brown', 'Ivy League', 'BRWN', 'Bears', '#4E3629', '#C00404', 53],
  ['Columbia', 'Ivy League', 'CLMB', 'Lions', '#1D4F91', '#9BCBEB', 55],
  ['Cornell', 'Ivy League', 'COR', 'Big Red', '#B31B1B', '#FFFFFF', 53],
  ['Dartmouth', 'Ivy League', 'DART', 'Big Green', '#00693E', '#FFFFFF', 51],
  ['Harvard', 'Ivy League', 'HARV', 'Crimson', '#A51C30', '#1E1E1E', 57],
  ['Penn', 'Ivy League', 'PENN', 'Quakers', '#011F5B', '#990000', 55],
  ['Princeton', 'Ivy League', 'PRIN', 'Tigers', '#E77500', '#000000', 68],
  ['Yale', 'Ivy League', 'YALE', 'Bulldogs', '#00356B', '#FFFFFF', 62],
  ['UC Davis', 'UC Athletic Association', 'UCD', 'Aggies', '#022851', '#FFBF00', 61],
  ['UC Irvine', 'UC Athletic Association', 'UCI', 'Anteaters', '#0064A4', '#FFD200', 60],
  ['UC Riverside', 'UC Athletic Association', 'UCR', 'Highlanders', '#003DA5', '#FFB81C', 53],
  ['UC San Diego', 'UC Athletic Association', 'UCSD', 'Tritons', '#182B49', '#C69214', 63],
  ['UC Santa Barbara', 'UC Athletic Association', 'UCSB', 'Gauchos', '#003660', '#FEBC11', 64],
  ['Rice', 'Southwest Conference', 'RICE', 'Owls', '#00205B', '#7C7E7F', 74],
  ['South Florida', 'Coastal Atlantic Conference', 'USF', 'Bulls', '#006747', '#CFC493', 75],
  ['Tulane', 'Southwest Conference', 'TULN', 'Green Wave', '#006747', '#418FDE', 64],
  ['UAB', 'Southwest Conference', 'UAB', 'Blazers', '#1E6B52', '#F4C300', 65],
  ['Buffalo', 'Metro Conference', 'BUFF', 'Bulls', '#005BBB', '#FFFFFF', 59],
  ['George Washington', 'Metro Conference', 'GW', 'Revolutionaries', '#033C5A', '#AA9868', 57],
  ['Georgetown', 'Metro Conference', 'GTWN', 'Hoyas', '#041E42', '#63666A', 61],
  ['Stony Brook', 'Metro Conference', 'SBU', 'Seawolves', '#990000', '#16243E', 59],
  // Division III
  ['Brandeis', 'University Athletic Association', 'BRAN', 'Judges', '#003478', '#FFFFFF', 44],
  ['Carnegie Mellon', 'University Athletic Association', 'CMU', 'Tartans', '#C41230', '#6D6E71', 50],
  ['Case Western', 'University Athletic Association', 'CWRU', 'Spartans', '#0A304E', '#FFFFFF', 45],
  ['Chicago', 'University Athletic Association', 'UCHI', 'Maroons', '#800000', '#FFFFFF', 46],
  ['Emory', 'University Athletic Association', 'EMRY', 'Eagles', '#012169', '#F2A900', 49],
  ['NYU', 'University Athletic Association', 'NYU', 'Violets', '#57068C', '#FFFFFF', 47],
  ['Rochester', 'University Athletic Association', 'ROCH', 'Yellowjackets', '#001E5F', '#FFD100', 42],
  ['WashU', 'University Athletic Association', 'WUSTL', 'Bears', '#A51417', '#007360', 50],
  // Division III
  ['Johns Hopkins', 'University Athletic Association', 'JHU', 'Blue Jays', '#002D72', '#68ACE5', 46],
  ['MIT', 'University Athletic Association', 'MIT', 'Engineers', '#A31F34', '#8A8B8C', 46],
  ['Tufts', 'University Athletic Association', 'TUFT', 'Jumbos', '#3E8EDE', '#002E6D', 49],
  ['Caltech', 'UC Athletic Association', 'CIT', 'Beavers', '#FF6C0C', '#333333', 42],
  ['UC Santa Cruz', 'UC Athletic Association', 'UCSC', 'Banana Slugs', '#003C6C', '#FDC700', 43],
  // Canada (U SPORTS: RSEQ and OUA)
  ['McGill', 'Metro Conference', 'MCG', 'Martlets', '#ED1B2F', '#FFFFFF', 45],
  ['Toronto', 'Metro Conference', 'TOR', 'Varsity Blues', '#1E3765', '#FFFFFF', 48],
];

// Home arenas: [arena, city]. Every one can be edited on the team page.
export const SITES = {
  'Arizona': ['McKale Center', 'Tucson, Ariz.'],
  'Brandeis': ['Red Auerbach Arena', 'Waltham, Mass.'],
  'Caltech': ['Braun Athletic Center', 'Pasadena, Calif.'],
  'Carnegie Mellon': ['Skibo Gymnasium', 'Pittsburgh, Pa.'],
  'Case Western': ['Horsburgh Gymnasium', 'Cleveland, Ohio'],
  'Chicago': ['Ratner Athletics Center', 'Chicago, Ill.'],
  'Emory': ['Woodruff P.E. Center', 'Atlanta, Ga.'],
  'Johns Hopkins': ['Goldfarb Gymnasium', 'Baltimore, Md.'],
  'McGill': ['Love Competition Hall', 'Montreal, Que.'],
  'MIT': ['Rockwell Cage', 'Cambridge, Mass.'],
  'NYU': ['Paulson Center', 'New York, N.Y.'],
  'Rochester': ['Louis Alexander Palestra', 'Rochester, N.Y.'],
  'Toronto': ['Goldring Centre', 'Toronto, Ont.'],
  'Tufts': ['Cousens Gym', 'Medford, Mass.'],
  'UC Santa Cruz': ['East Field House', 'Santa Cruz, Calif.'],
  'WashU': ['WashU Field House', 'St. Louis, Mo.'],
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
export const LOGO_ALIASES = { 'Penn': 'Pennsylvania', 'Miami': 'Miami', 'UC Santa Barbara': 'UC Santa Barbara', 'George Washington': 'George Washington', 'UConn': 'Connecticut' };

// Head coaches: each program's real head coach for the 2026 season (school
// athletics sites, checked October 2026). USC's Brad Keller has been on leave
// since October 2026 (Megan Moenoa is interim). By 2030 some will have moved
// on; rename anyone on the Coaches page.
export const COACHES = {
  "Illinois": "Chris Tamas",
  "Indiana": "Steve Aird",
  "Iowa": "Jim Barnes",
  "Maryland": "Adam Hughes",
  "Michigan": "Erin Virtue",
  "Michigan State": "Kristen Kelsay",
  "Minnesota": "Keegan Cook",
  "Northwestern": "Tim Nollan",
  "Ohio State": "Jen Flynn Oldenburg",
  "Oregon": "Trent Kersten",
  "Penn State": "Katie Schumacher-Cawley",
  "Purdue": "Dave Shondell",
  "Rutgers": "Caitlin Schweihofer",
  "UCLA": "Matt Werle",
  "USC": "Brad Keller",
  "Washington": "Leslie Gabriel",
  "Wisconsin": "Kelly Sheffield",
  "California": "Jen Malcom",
  "Duke": "Ahen Kim",
  "Georgia Tech": "Michelle Collier",
  "Miami": "Jose \"Keno\" Gandara",
  "North Carolina": "Mike Schall",
  "Notre Dame": "Salima Rockwell",
  "Pittsburgh": "Dan Fisher",
  "Stanford": "Kevin Hambly",
  "Virginia": "Shannon Wells",
  "Florida": "Ryan Theis",
  "Missouri": "Dawn Sullivan",
  "Texas": "Jerritt Elliott",
  "Texas A&M": "Jamie Morrison",
  "Vanderbilt": "Anders Nelson",
  "Arizona": "Charita Stubbs",
  "Arizona State": "JJ Van Niel",
  "Colorado": "Jesse Mahoney",
  "Kansas": "Matt Ulmer",
  "Utah": "Alyssa D'Errico",
  "Brown": "Taylor Virtue",
  "Columbia": "Patric Santiago",
  "Cornell": "Trudy Vande Berg",
  "Dartmouth": "Kevin Maureen Campbell",
  "Harvard": "Jennifer Weiss",
  "Penn": "Tyler Hagstrom",
  "Princeton": "Sabrina King",
  "Yale": "Erin Appleman",
  "UC Davis": "Dan Conners",
  "UC Irvine": "Ashlie Hain",
  "UC Riverside": "Branden Higa",
  "UC San Diego": "Spencer McLachlin",
  "UC Santa Barbara": "Michael Henchy",
  "Rice": "Genny Volpe",
  "South Florida": "Jolene Shepardson",
  "Tulane": "Derek Schroeder",
  "UAB": "Betsy Freeburg",
  "Buffalo": "Scott Smith",
  "George Washington": "Katie Reifert",
  "Georgetown": "AJ Bonetti",
  "Stony Brook": "Kristin Belzung",
  "Brandeis": "Alesia Bennett",
  "Carnegie Mellon": "Anne Bock",
  "Case Western": "Karen Farrell",
  "Chicago": "Mitchell McPartland",
  "Emory": "Brianna Ike",
  "NYU": "Andrew Brown",
  "Rochester": "Ladi Iya",
  "WashU": "Vanessa Walby",
  "Johns Hopkins": "Bayleigh Braswell",
  "MIT": "Paul Dill",
  "Tufts": "Cora Thompson",
  "Caltech": "Tom Gardner",
  "UC Santa Cruz": "Chad Koenegstein",
  "McGill": "Marie-Christine Lapointe",
  "Toronto": "Kristine Drakich",
};

function hashName(s) { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; return h; }

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

// Women's and men's are separate leagues (the switch at the top of the
// page). `side` is 'women' (the default) or 'men'.
export const SIDES = {
  women: { label: "Women's", name: 'AAU Volleyball' },
  men: { label: "Men's", name: "AAU Men's Volleyball" },
};
export const sideOf = league => (league?.side === 'men' ? 'men' : 'women');

export function seedTeams(side = 'women') {
  const teams = {};
  if (side === 'men') {
    for (const [school, conference, abbr, mascot, color, altColor, ovr, stadium, city] of MEN_TEAMS) {
      teams[school] = makeTeam({ school, conference, abbr, mascot, coach: MEN_COACHES[school] || '', color, altColor, stadium, city, ...splitOvr(school, ovr) });
      teams[school].logoOverride = DEFAULT_LOGOS[school] || null;
    }
    return teams;
  }
  for (const [school, conference, abbr, mascot, color, altColor, ovr] of T) {
    teams[school] = makeTeam({ school, conference, abbr, mascot, coach: COACHES[school] || '', color, altColor, ...splitOvr(school, ovr) });
    // The AAU Dynasty's logos win over the automatic logo lists.
    teams[school].logoOverride = DEFAULT_LOGOS[school] || null;
  }
  return teams;
}
export const conferencesFor = side => (side === 'men' ? MEN_CONFERENCES : CONFERENCES);
