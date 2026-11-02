// Men's volleyball: every AAU member with a men's varsity team (2026), in
// men's-only conferences. Only 14 AAU schools play men's volleyball: ten in
// NCAA Division I/II, three in Division III and Toronto (U SPORTS). Real
// life splits them across the MPSF, Big West, EIVA and MIVA; here they start
// in two conferences of seven, West and East, which the commissioner can
// rename, realign or add to (schools can start men's programs in the
// offseason).
//
// Ratings come from the 2026 season (Wikipedia, "2026 NCAA men's volleyball
// tournament", and school sites): UCLA went 29-2 and was the No. 1 seed; UC
// Irvine (21-9) beat UCLA and reached the national final, losing to Hawai'i;
// USC (19-7) and Penn State (22-7, EIVA champion) made the field; UCSB
// (14-12) and UC San Diego (13-13) were ranked in the top 13; Ohio State
// was around 16th; Stanford went 11-15; Princeton reached the EIVA final;
// Harvard went 6-17. Division III: MIT (21-7) beat NYU (19-6) in the UVC
// semifinals. Toronto went 15-5 in the OUA in 2024-25. UC Santa Cruz is an
// estimate.
//
// Head coaches are the real ones for 2026-27 (Penn State's Mark Pavlik
// retired after 2026; Colin McMillan took over). UC Santa Cruz's coach
// couldn't be confirmed, so that job starts open.

export const MEN_CONFERENCES = {
  'Pacific Volleyball Federation': { abbr: 'PVF', color: '#1B4F8A', altColor: '#F2B33D', logo: 'img/conf/pvf.svg' },
  'Eastern Volleyball Association': { abbr: 'EVA', color: '#7A1F2B', altColor: '#B9C2CC', logo: 'img/conf/eva.svg' },
};

const W = 'Pacific Volleyball Federation', E = 'Eastern Volleyball Association';
// [school, conference, abbr, mascot, color, altColor, OVR, arena, city]
export const MEN_TEAMS = [
  ['UCLA', W, 'UCLA', 'Bruins', '#2D68C4', '#F2A900', 93, 'Pauley Pavilion', 'Los Angeles, Calif.'],
  ['UC Irvine', W, 'UCI', 'Anteaters', '#0064A4', '#FFD200', 88, 'Bren Events Center', 'Irvine, Calif.'],
  ['USC', W, 'USC', 'Trojans', '#990000', '#FFC72C', 84, 'Galen Center', 'Los Angeles, Calif.'],
  ['UC Santa Barbara', W, 'UCSB', 'Gauchos', '#003660', '#FEBC11', 76, 'Robertson Gymnasium', 'Santa Barbara, Calif.'],
  ['UC San Diego', W, 'UCSD', 'Tritons', '#182B49', '#C69214', 74, 'LionTree Arena', 'La Jolla, Calif.'],
  ['Stanford', W, 'STAN', 'Cardinal', '#8C1515', '#FFFFFF', 70, 'Burnham Pavilion', 'Stanford, Calif.'],
  ['UC Santa Cruz', W, 'UCSC', 'Banana Slugs', '#003C6C', '#FDC700', 44, 'East Field House', 'Santa Cruz, Calif.'],
  ['Penn State', E, 'PSU', 'Nittany Lions', '#041E42', '#FFFFFF', 80, 'Rec Hall', 'University Park, Pa.'],
  ['Ohio State', E, 'OSU', 'Buckeyes', '#BB0000', '#666666', 72, 'Covelli Center', 'Columbus, Ohio'],
  ['Princeton', E, 'PRIN', 'Tigers', '#E77500', '#000000', 66, 'Dillon Gym', 'Princeton, N.J.'],
  ['Harvard', E, 'HARV', 'Crimson', '#A51C30', '#1E1E1E', 58, 'Malkin Athletic Center', 'Cambridge, Mass.'],
  ['MIT', E, 'MIT', 'Engineers', '#A31F34', '#8A8B8C', 50, 'Rockwell Cage', 'Cambridge, Mass.'],
  ['NYU', E, 'NYU', 'Violets', '#57068C', '#FFFFFF', 49, 'Paulson Center', 'New York, N.Y.'],
  ['Toronto', E, 'TOR', 'Varsity Blues', '#1E3765', '#FFFFFF', 48, 'Goldring Centre', 'Toronto, Ont.'],
];

export const MEN_COACHES = {
  UCLA: 'John Hawks',
  'UC Irvine': 'David Kniffin',
  USC: 'Jeff Nygaard',
  'UC Santa Barbara': 'Rick McLaughlin',
  'UC San Diego': 'Brad Rostratter',
  Stanford: 'John Kosty',
  'Penn State': 'Colin McMillan',
  'Ohio State': 'Kevin Burch',
  Princeton: 'Sam Shweisky',
  Harvard: 'Brian Baise',
  MIT: 'Todd Elwell',
  NYU: 'José Piña',
  Toronto: 'John Barrett',
};
