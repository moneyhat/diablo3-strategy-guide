// Sanctuary Grimoire — ArcGIS-Quality Map Data
// Comprehensive zone data with polygons, connections, density, elevation, and all POI types
// Coordinate system: 0-1000 x 0-700 normalized space per Act

export type ZoneType = "town" | "outdoor" | "dungeon" | "boss-arena" | "special" | "transition";
export type PoiType = "waypoint" | "boss" | "keywarden" | "elite" | "chest" | "goblin" | "event" | "dungeon-entrance" | "exit" | "entry" | "npc" | "quest" | "shrine";
export type DensityLevel = 1 | 2 | 3 | 4 | 5;
export type LayerType = "zones" | "connections" | "waypoints" | "bosses" | "elites" | "loot" | "keywardens" | "entrances" | "density" | "farming-route" | "grid" | "labels";

export interface ZonePolygon {
  id: string;
  name: string;
  type: ZoneType;
  // Polygon points as percentage of viewBox (0-100)
  polygon: [number, number][];
  centroid: [number, number];
  level?: string;           // e.g. "Level 1-4", "70+"
  monsterTypes: string[];
  density: DensityLevel;    // 1=sparse 5=extremely dense
  farmingRating: 1 | 2 | 3 | 4 | 5;
  eliteCount: number;       // avg elite packs per run
  description: string;
  farmingTip: string;
  connectedTo: string[];    // zone ids this connects to
}

export interface ZoneConnection {
  from: string;
  to: string;
  type: "main-path" | "optional" | "dungeon" | "act-transition";
  bidirectional: boolean;
  // Path as percentage points
  path: [number, number][];
}

export interface GisPoi {
  id: string;
  x: number; // 0-100 percentage
  y: number;
  type: PoiType;
  name: string;
  sublabel?: string;
  zoneId: string;
  details: {
    description: string;
    tip: string;
    drops?: string;
    difficulty?: string;
  };
}

export interface FarmingRoute {
  id: string;
  name: string;
  tier: "S" | "A" | "B";
  description: string;
  stops: string[]; // POI ids in order
  estimatedTime: string;
  xpPerHour?: string;
  goldPerHour?: string;
}

export interface ActGisData {
  actId: string;
  actName: string;
  subtitle: string;
  accentColor: string;
  parchmentImage: string;
  viewBox: string;
  zones: ZonePolygon[];
  connections: ZoneConnection[];
  pois: GisPoi[];
  farmingRoutes: FarmingRoute[];
}

// ─── ACT I ────────────────────────────────────────────────────────────────────
export const act1GisData: ActGisData = {
  actId: "act1",
  actName: "Act I",
  subtitle: "The Fallen Star — Khanduras",
  accentColor: "#8b0000",
  parchmentImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/map-act1-parchment-DGSg9KqnwRY2ZobePaARtX.webp",
  viewBox: "0 0 1000 700",
  zones: [
    {
      id: "new-tristram",
      name: "New Tristram",
      type: "town",
      polygon: [[5,32],[20,32],[20,48],[5,48]],
      centroid: [12.5, 40],
      level: "1–10",
      monsterTypes: ["Undead", "Fallen"],
      density: 2,
      farmingRating: 2,
      eliteCount: 0,
      description: "The main hub of Act I. Home to the Blacksmith, Jeweler, and Mystic. Surrounded by undead risen by the fallen star.",
      farmingTip: "Not a farming zone — use as a base to repair, craft, and restock between runs.",
      connectedTo: ["old-tristram-road", "northern-highlands"],
    },
    {
      id: "old-tristram-road",
      name: "Old Tristram Road",
      type: "outdoor",
      polygon: [[20,34],[35,34],[35,46],[20,46]],
      centroid: [27.5, 40],
      level: "1–15",
      monsterTypes: ["Undead", "Fallen", "Khazra"],
      density: 3,
      farmingRating: 2,
      eliteCount: 1,
      description: "The road leading from New Tristram to the ruins of Old Tristram and the Cathedral. Dense with undead.",
      farmingTip: "Quick run for early levels. Contains Musty Cellar and Dank Cellar dungeons.",
      connectedTo: ["new-tristram", "cathedral-l1", "weeping-hollow"],
    },
    {
      id: "weeping-hollow",
      name: "Weeping Hollow",
      type: "outdoor",
      polygon: [[35,20],[58,20],[58,40],[35,40]],
      centroid: [46.5, 30],
      level: "5–20",
      monsterTypes: ["Undead", "Fallen", "Grotesque"],
      density: 4,
      farmingRating: 4,
      eliteCount: 3,
      description: "A haunted graveyard teeming with undead. Contains the Cemetery of the Forsaken and multiple Defiled Crypts.",
      farmingTip: "Excellent early farming zone. 3+ elite packs guaranteed. Check all 3 Defiled Crypts for Resplendent Chests.",
      connectedTo: ["old-tristram-road", "fields-of-misery", "cemetery-forsaken"],
    },
    {
      id: "cemetery-forsaken",
      name: "Cemetery of the Forsaken",
      type: "outdoor",
      polygon: [[40,38],[58,38],[58,52],[40,52]],
      centroid: [49, 45],
      level: "8–22",
      monsterTypes: ["Undead", "Skeletal"],
      density: 4,
      farmingRating: 4,
      eliteCount: 3,
      description: "Ancient graveyard with 3 Defiled Crypts. Waypoint zone. High density of undead and guaranteed elite packs.",
      farmingTip: "Always check all 3 Defiled Crypts — each has a chance for a Resplendent Chest and unique elite.",
      connectedTo: ["weeping-hollow", "defiled-crypt-west", "defiled-crypt-south", "defiled-crypt-east"],
    },
    {
      id: "defiled-crypt-west",
      name: "Defiled Crypt (West)",
      type: "dungeon",
      polygon: [[38,52],[50,52],[50,62],[38,62]],
      centroid: [44, 57],
      level: "10–25",
      monsterTypes: ["Undead", "Skeletal Summoner"],
      density: 5,
      farmingRating: 5,
      eliteCount: 2,
      description: "One of three Defiled Crypts in the Cemetery. Guaranteed elite pack and chance for Resplendent Chest.",
      farmingTip: "Two levels deep. Boss on Level 2. Always worth clearing for the chest.",
      connectedTo: ["cemetery-forsaken"],
    },
    {
      id: "fields-of-misery",
      name: "Fields of Misery",
      type: "outdoor",
      polygon: [[55,12],[82,12],[82,38],[55,38]],
      centroid: [68.5, 25],
      level: "15–30",
      monsterTypes: ["Khazra", "Fallen", "Grotesque", "Zombie"],
      density: 5,
      farmingRating: 5,
      eliteCount: 5,
      description: "The largest outdoor zone in Act I. Sprawling fields packed with Khazra and Fallen. Contains multiple dungeons including the Decaying Crypt and Scavenger's Den.",
      farmingTip: "Best Act I farming zone. 5+ elite packs, multiple dungeons, Odeg the Keywarden spawns here. Run the full zone for maximum density.",
      connectedTo: ["weeping-hollow", "cemetery-forsaken", "decaying-crypt", "scavengers-den", "drowned-temple", "festering-woods"],
    },
    {
      id: "decaying-crypt",
      name: "Decaying Crypt",
      type: "dungeon",
      polygon: [[62,36],[76,36],[76,50],[62,50]],
      centroid: [69, 43],
      level: "18–32",
      monsterTypes: ["Undead", "Defiled Patriarch"],
      density: 5,
      farmingRating: 5,
      eliteCount: 2,
      description: "Two-level dungeon in the Fields of Misery. Boss: Defiled Patriarch. Guaranteed elite packs on both levels.",
      farmingTip: "Always run both levels. The boss room on Level 2 guarantees a rare drop.",
      connectedTo: ["fields-of-misery"],
    },
    {
      id: "festering-woods",
      name: "Festering Woods",
      type: "outdoor",
      polygon: [[72,42],[92,42],[92,62],[72,62]],
      centroid: [82, 52],
      level: "20–35",
      monsterTypes: ["Undead", "Fallen", "Grotesque"],
      density: 4,
      farmingRating: 4,
      eliteCount: 3,
      description: "A dense forest zone east of the Fields of Misery. Contains Warrior's Rest and Enchanted Forest dungeons. Waypoint zone.",
      farmingTip: "Check both dungeons for Resplendent Chests. Good density of elites throughout.",
      connectedTo: ["fields-of-misery", "warriors-rest", "enchanted-forest"],
    },
    {
      id: "northern-highlands",
      name: "Northern Highlands",
      type: "outdoor",
      polygon: [[18,10],[45,10],[45,22],[18,22]],
      centroid: [31.5, 16],
      level: "12–25",
      monsterTypes: ["Khazra", "Fallen", "Undead"],
      density: 3,
      farmingRating: 3,
      eliteCount: 2,
      description: "Highland region north of New Tristram leading to Leoric's Manor. Waypoint zone.",
      farmingTip: "Moderate density. Mainly a transit zone to reach Leoric's Manor and Highlands Crossing.",
      connectedTo: ["new-tristram", "leoric-manor-courtyard", "southern-highlands"],
    },
    {
      id: "leoric-manor-courtyard",
      name: "Leoric's Manor Courtyard",
      type: "outdoor",
      polygon: [[44,6],[62,6],[62,18],[44,18]],
      centroid: [53, 12],
      level: "20–35",
      monsterTypes: ["Undead", "Skeletal", "Coven"],
      density: 4,
      farmingRating: 3,
      eliteCount: 2,
      description: "The courtyard of the mad king's manor. Waypoint zone. Leads to the manor interior and Halls of Agony.",
      farmingTip: "Good for bounties. Contains unique events and guaranteed elite encounters.",
      connectedTo: ["northern-highlands", "leoric-manor", "halls-of-agony-l1"],
    },
    {
      id: "cathedral-l1",
      name: "Cathedral Level 1",
      type: "dungeon",
      polygon: [[22,48],[38,48],[38,62],[22,62]],
      centroid: [30, 55],
      level: "3–15",
      monsterTypes: ["Undead", "Fallen", "Skeletal"],
      density: 4,
      farmingRating: 3,
      eliteCount: 2,
      description: "The first level of Tristram Cathedral. Dark gothic dungeon with multiple branching corridors.",
      farmingTip: "Contains Leoric's Passage shortcut. Good for early leveling.",
      connectedTo: ["old-tristram-road", "cathedral-l2"],
    },
    {
      id: "cathedral-l2",
      name: "Cathedral Level 2–3",
      type: "dungeon",
      polygon: [[22,62],[38,62],[38,76],[22,76]],
      centroid: [30, 69],
      level: "8–22",
      monsterTypes: ["Undead", "Fallen", "Coven"],
      density: 4,
      farmingRating: 3,
      eliteCount: 2,
      description: "Deeper cathedral levels. Waypoint on Level 3. Contains the Royal Crypts.",
      farmingTip: "Waypoint on Level 3 makes this a good starting point for Cathedral runs.",
      connectedTo: ["cathedral-l1", "royal-crypts"],
    },
    {
      id: "royal-crypts",
      name: "Royal Crypts",
      type: "dungeon",
      polygon: [[22,76],[38,76],[38,88],[22,88]],
      centroid: [30, 82],
      level: "12–25",
      monsterTypes: ["Undead", "Skeletal King's Guard"],
      density: 5,
      farmingRating: 4,
      eliteCount: 3,
      description: "The deepest cathedral level. Boss: The Skeleton King. Waypoint zone.",
      farmingTip: "Boss drops guaranteed rare. Skeleton King can drop Legendary items at higher difficulties.",
      connectedTo: ["cathedral-l2"],
    },
    {
      id: "halls-of-agony-l1",
      name: "Halls of Agony L1–2",
      type: "dungeon",
      polygon: [[38,70],[58,70],[58,88],[38,88]],
      centroid: [48, 79],
      level: "25–40",
      monsterTypes: ["Coven", "Undead", "Demon"],
      density: 5,
      farmingRating: 4,
      eliteCount: 4,
      description: "The torture chambers beneath Leoric's Manor. Two waypoints. Extremely dense with Coven cultists.",
      farmingTip: "High density makes this excellent for XP. Multiple elite packs guaranteed.",
      connectedTo: ["leoric-manor-courtyard", "halls-of-agony-l3"],
    },
    {
      id: "halls-of-agony-l3",
      name: "Halls of Agony L3 — The Butcher",
      type: "boss-arena",
      polygon: [[38,88],[58,88],[58,98],[38,98]],
      centroid: [48, 93],
      level: "30–45",
      monsterTypes: ["The Butcher", "Demon"],
      density: 5,
      farmingRating: 5,
      eliteCount: 1,
      description: "The final chamber of Act I. Boss: The Butcher. Waypoint zone. Completing this opens Act II.",
      farmingTip: "The Butcher drops guaranteed rare items. At high Torment, chance for Legendary drops.",
      connectedTo: ["halls-of-agony-l1"],
    },
  ],
  connections: [
    { from: "new-tristram", to: "old-tristram-road", type: "main-path", bidirectional: true, path: [[20,40],[20,40]] },
    { from: "old-tristram-road", to: "weeping-hollow", type: "main-path", bidirectional: true, path: [[35,37],[35,30]] },
    { from: "old-tristram-road", to: "cathedral-l1", type: "main-path", bidirectional: true, path: [[27,46],[27,48]] },
    { from: "weeping-hollow", to: "cemetery-forsaken", type: "main-path", bidirectional: true, path: [[46,40],[46,38]] },
    { from: "weeping-hollow", to: "fields-of-misery", type: "main-path", bidirectional: true, path: [[58,30],[58,25]] },
    { from: "cemetery-forsaken", to: "defiled-crypt-west", type: "dungeon", bidirectional: true, path: [[44,52],[44,52]] },
    { from: "fields-of-misery", to: "decaying-crypt", type: "dungeon", bidirectional: true, path: [[69,38],[69,36]] },
    { from: "fields-of-misery", to: "festering-woods", type: "main-path", bidirectional: true, path: [[82,30],[82,42]] },
    { from: "new-tristram", to: "northern-highlands", type: "main-path", bidirectional: true, path: [[12,32],[18,16]] },
    { from: "northern-highlands", to: "leoric-manor-courtyard", type: "main-path", bidirectional: true, path: [[45,16],[44,12]] },
    { from: "leoric-manor-courtyard", to: "halls-of-agony-l1", type: "main-path", bidirectional: true, path: [[53,18],[48,70]] },
    { from: "cathedral-l1", to: "cathedral-l2", type: "main-path", bidirectional: true, path: [[30,62],[30,62]] },
    { from: "cathedral-l2", to: "royal-crypts", type: "main-path", bidirectional: true, path: [[30,76],[30,76]] },
    { from: "halls-of-agony-l1", to: "halls-of-agony-l3", type: "main-path", bidirectional: true, path: [[48,88],[48,88]] },
  ],
  pois: [
    // Waypoints
    { id: "wp-new-tristram", x: 12.5, y: 40, type: "waypoint", name: "New Tristram", sublabel: "Act Hub", zoneId: "new-tristram", details: { description: "The main waypoint of Act I. All artisans and followers are available here.", tip: "Always activate this first. It is your base of operations for the entire act." } },
    { id: "wp-old-ruins", x: 27, y: 37, type: "waypoint", name: "The Old Ruins", sublabel: "Old Tristram Road", zoneId: "old-tristram-road", details: { description: "Waypoint in Old Tristram Road near the entrance to the Cathedral.", tip: "Use this to quickly access the Cathedral without running from New Tristram." } },
    { id: "wp-cathedral-garden", x: 30, y: 52, type: "waypoint", name: "Cathedral Garden", sublabel: "Cathedral L1", zoneId: "cathedral-l1", details: { description: "First waypoint inside the Cathedral.", tip: "Useful for Cathedral bounties and early leveling runs." } },
    { id: "wp-cathedral-l3", x: 30, y: 66, type: "waypoint", name: "Cathedral Level 3", sublabel: "Cathedral L2–3", zoneId: "cathedral-l2", details: { description: "Waypoint on Cathedral Level 3.", tip: "Start Cathedral runs from here to skip the first two levels." } },
    { id: "wp-royal-crypts", x: 30, y: 82, type: "waypoint", name: "The Royal Crypts", sublabel: "Cathedral L4", zoneId: "royal-crypts", details: { description: "Waypoint in the Royal Crypts, just before the Skeleton King.", tip: "Use for Skeleton King farming runs." } },
    { id: "wp-cemetery", x: 49, y: 42, type: "waypoint", name: "Cemetery of the Forsaken", sublabel: "Weeping Hollow", zoneId: "cemetery-forsaken", details: { description: "Central waypoint for the Weeping Hollow / Cemetery area.", tip: "Ideal starting point for farming all 3 Defiled Crypts." } },
    { id: "wp-fields", x: 68, y: 22, type: "waypoint", name: "Fields of Misery", sublabel: "Fields of Misery", zoneId: "fields-of-misery", details: { description: "Main waypoint for the Fields of Misery — the best farming zone in Act I.", tip: "Start here and sweep the entire zone for 5+ elite packs and multiple dungeons." } },
    { id: "wp-festering", x: 82, y: 50, type: "waypoint", name: "The Festering Woods", sublabel: "Festering Woods", zoneId: "festering-woods", details: { description: "Waypoint in the Festering Woods east of Fields of Misery.", tip: "Check both dungeons (Warrior's Rest, Enchanted Forest) for Resplendent Chests." } },
    { id: "wp-northern-highlands", x: 31, y: 16, type: "waypoint", name: "Northern Highlands", sublabel: "Northern Highlands", zoneId: "northern-highlands", details: { description: "Waypoint in the Northern Highlands.", tip: "Use for Highlands bounties and access to Leoric's Manor." } },
    { id: "wp-leoric-manor", x: 53, y: 10, type: "waypoint", name: "Leoric's Manor", sublabel: "Leoric's Manor Courtyard", zoneId: "leoric-manor-courtyard", details: { description: "Waypoint at Leoric's Manor Courtyard.", tip: "Starting point for Halls of Agony runs and Coven bounties." } },
    { id: "wp-halls-l2", x: 48, y: 76, type: "waypoint", name: "Halls of Agony Level 2", sublabel: "Halls of Agony", zoneId: "halls-of-agony-l1", details: { description: "Waypoint on Halls of Agony Level 2.", tip: "Skip Level 1 and start here for faster Butcher runs." } },
    { id: "wp-halls-l3", x: 48, y: 90, type: "waypoint", name: "Halls of Agony Level 3", sublabel: "Halls of Agony", zoneId: "halls-of-agony-l3", details: { description: "Waypoint directly outside The Butcher's arena.", tip: "Fastest access for Butcher farming." } },
    // Bosses
    { id: "boss-skeleton-king", x: 30, y: 85, type: "boss", name: "The Skeleton King", sublabel: "Royal Crypts", zoneId: "royal-crypts", details: { description: "Leoric, the Mad King, risen as an undead monstrosity. First major boss of Act I.", tip: "Interrupt his Summon Skeleton ability. At Torment+, he can drop Leoric's Crown.", drops: "Leoric's Crown (Legendary Helm), rare items", difficulty: "Easy — manageable at any level" } },
    { id: "boss-queen-araneae", x: 78, y: 32, type: "boss", name: "Queen Araneae", sublabel: "Caverns of Araneae", zoneId: "fields-of-misery", details: { description: "Spider queen lurking in the Caverns of Araneae, accessible from the Highlands.", tip: "Avoid her web pools. She teleports frequently — stay mobile.", drops: "Rare items, chance for Legendary", difficulty: "Moderate" } },
    { id: "boss-butcher", x: 48, y: 94, type: "boss", name: "The Butcher", sublabel: "Halls of Agony Level 3", zoneId: "halls-of-agony-l3", details: { description: "The horrific demon who imprisoned Tyrael. Final boss of Act I.", tip: "Stay out of fire chains. Use the pillars to break line of sight during his charge.", drops: "Guaranteed rare, chance for Legendary at Torment+", difficulty: "Moderate — dangerous fire mechanics" } },
    // Keywarden
    { id: "kw-odeg", x: 72, y: 18, type: "keywarden", name: "Odeg the Keywarden", sublabel: "Fields of Misery", zoneId: "fields-of-misery", details: { description: "Keywarden of Act I. Drops the Key of Destruction on Torment difficulty.", tip: "Spawns in the Fields of Misery. Required for Infernal Machine event. Only drops key on Torment I+.", drops: "Key of Destruction (Torment only)", difficulty: "Moderate elite pack" } },
    // Elite packs
    { id: "elite-fields-1", x: 60, y: 20, type: "elite", name: "Elite Pack", sublabel: "Fields of Misery — NW", zoneId: "fields-of-misery", details: { description: "Guaranteed elite pack spawn in the northwest Fields of Misery.", tip: "Check for dangerous affixes before engaging. Arcane Enchanted + Molten is lethal at low gear." } },
    { id: "elite-fields-2", x: 75, y: 16, type: "elite", name: "Elite Pack", sublabel: "Fields of Misery — N", zoneId: "fields-of-misery", details: { description: "Elite pack in the northern Fields of Misery near the Khazra camp.", tip: "Often Khazra elites — watch for Jailer + Vortex combinations." } },
    { id: "elite-fields-3", x: 80, y: 28, type: "elite", name: "Elite Pack", sublabel: "Fields of Misery — NE", zoneId: "fields-of-misery", details: { description: "Elite pack in the northeast Fields of Misery.", tip: "Common spawn near the Scavenger's Den entrance." } },
    { id: "elite-cemetery-1", x: 44, y: 44, type: "elite", name: "Elite Pack", sublabel: "Cemetery of the Forsaken", zoneId: "cemetery-forsaken", details: { description: "Elite pack near the Cemetery waypoint.", tip: "Undead elites — watch for Plagued + Frozen combinations." } },
    { id: "elite-halls-1", x: 42, y: 74, type: "elite", name: "Elite Pack", sublabel: "Halls of Agony L1", zoneId: "halls-of-agony-l1", details: { description: "Elite Coven cultist pack in Halls of Agony Level 1.", tip: "Coven elites often have Electrified — keep moving." } },
    { id: "elite-halls-2", x: 54, y: 80, type: "elite", name: "Elite Pack", sublabel: "Halls of Agony L2", zoneId: "halls-of-agony-l1", details: { description: "Elite pack on Halls of Agony Level 2.", tip: "Dense area — pull carefully to avoid multiple packs at once." } },
    // Loot
    { id: "chest-cemetery", x: 52, y: 46, type: "chest", name: "Resplendent Chest", sublabel: "Cemetery of the Forsaken", zoneId: "cemetery-forsaken", details: { description: "Resplendent Chest in the Cemetery of the Forsaken.", tip: "Guaranteed spawn near the cemetery center. Always loot this." } },
    { id: "chest-festering", x: 84, y: 48, type: "chest", name: "Resplendent Chest", sublabel: "Festering Woods", zoneId: "festering-woods", details: { description: "Resplendent Chest in the Festering Woods.", tip: "Located near the center of the zone. High chance for Legendary at Torment+." } },
    { id: "chest-decaying-crypt", x: 70, y: 44, type: "chest", name: "Resplendent Chest", sublabel: "Decaying Crypt L2", zoneId: "decaying-crypt", details: { description: "Resplendent Chest on Level 2 of the Decaying Crypt.", tip: "Always on Level 2 near the boss room. Worth the detour." } },
    { id: "goblin-fields", x: 65, y: 26, type: "goblin", name: "Treasure Goblin Spawn", sublabel: "Fields of Misery", zoneId: "fields-of-misery", details: { description: "High-probability Treasure Goblin spawn in the Fields of Misery.", tip: "Kill immediately before it escapes. Drops 3–5 items and large amounts of gold." } },
    { id: "goblin-weeping", x: 46, y: 26, type: "goblin", name: "Treasure Goblin Spawn", sublabel: "Weeping Hollow", zoneId: "weeping-hollow", details: { description: "Treasure Goblin spawn in the Weeping Hollow.", tip: "Often near the graveyard entrance. Use movement skills to catch it." } },
    // Events
    { id: "event-jar-souls", x: 32, y: 54, type: "event", name: "Jar of Souls", sublabel: "Cathedral Garden", zoneId: "cathedral-l1", details: { description: "Survive waves of undead summoned from a jar. Rewards bonus XP and gold.", tip: "Stand in a corner to avoid being surrounded. Lasts 60 seconds." } },
    { id: "event-cursed-chest", x: 62, y: 24, type: "event", name: "Cursed Chest Event", sublabel: "Fields of Misery", zoneId: "fields-of-misery", details: { description: "Open a cursed chest and survive waves of enemies for bonus rewards.", tip: "Ensure you can handle the wave before opening. Great XP and item rewards." } },
    // Dungeon entrances
    { id: "dun-decaying-crypt", x: 69, y: 38, type: "dungeon-entrance", name: "Decaying Crypt Entrance", sublabel: "Fields of Misery", zoneId: "fields-of-misery", details: { description: "Entrance to the Decaying Crypt dungeon. Two levels with guaranteed elites.", tip: "Always clear both levels. Level 2 has a boss and Resplendent Chest." } },
    { id: "dun-scavengers-den", x: 76, y: 22, type: "dungeon-entrance", name: "Scavenger's Den", sublabel: "Fields of Misery", zoneId: "fields-of-misery", details: { description: "Dungeon in the Fields of Misery. Two levels of Fallen and Grotesque.", tip: "High density dungeon. Good for XP farming." } },
    { id: "dun-caverns-araneae", x: 82, y: 18, type: "dungeon-entrance", name: "Caverns of Araneae", sublabel: "Fields of Misery / Highlands", zoneId: "fields-of-misery", details: { description: "Spider-infested caverns. Contains Queen Araneae boss.", tip: "Required for story progression. Contains unique spider enemies." } },
    // Entry / Exit
    { id: "entry-act1", x: 5, y: 40, type: "entry", name: "Act I Entry", sublabel: "From Character Select", zoneId: "new-tristram", details: { description: "Entry point to Act I from the character selection screen.", tip: "New characters always start here." } },
    { id: "exit-to-act2", x: 12, y: 44, type: "exit", name: "Proceed to Act II", sublabel: "New Tristram → Caldeum", zoneId: "new-tristram", details: { description: "After defeating The Butcher, return here to travel to Act II.", tip: "Complete all Act I bounties before leaving for maximum cache rewards." } },
    // Shrines
    { id: "shrine-fields-1", x: 58, y: 28, type: "shrine", name: "Shrine", sublabel: "Fields of Misery", zoneId: "fields-of-misery", details: { description: "Shrine spawn location in Fields of Misery. Can be Blessed, Frenzied, Empowered, Fleeting, or Conduit.", tip: "Conduit Shrine is the most powerful — save it for a large elite pack." } },
  ],
  farmingRoutes: [
    {
      id: "act1-speed-farm",
      name: "Fields of Misery Speed Run",
      tier: "S",
      description: "The definitive Act I speed farming route. Start at Fields of Misery waypoint, sweep the entire zone hitting all elite packs, enter Decaying Crypt for the chest, then finish at Festering Woods.",
      stops: ["wp-fields", "elite-fields-1", "elite-fields-2", "elite-fields-3", "goblin-fields", "dun-decaying-crypt", "chest-decaying-crypt", "kw-odeg", "wp-festering", "chest-festering"],
      estimatedTime: "8–12 minutes",
      xpPerHour: "High",
      goldPerHour: "High",
    },
    {
      id: "act1-keywarden",
      name: "Odeg Keywarden Route",
      tier: "A",
      description: "Efficient route to farm Odeg the Keywarden for the Key of Destruction. Requires Torment I+.",
      stops: ["wp-fields", "elite-fields-1", "elite-fields-2", "kw-odeg"],
      estimatedTime: "4–6 minutes",
      xpPerHour: "Moderate",
      goldPerHour: "Moderate",
    },
    {
      id: "act1-cemetery-run",
      name: "Cemetery & Crypts Run",
      tier: "A",
      description: "Farm all 3 Defiled Crypts plus the Cemetery for maximum chest opportunities.",
      stops: ["wp-cemetery", "chest-cemetery", "elite-cemetery-1", "defiled-crypt-west", "dun-decaying-crypt"],
      estimatedTime: "6–10 minutes",
      xpPerHour: "Moderate",
      goldPerHour: "Moderate",
    },
  ],
};

// ─── ACT II ───────────────────────────────────────────────────────────────────
export const act2GisData: ActGisData = {
  actId: "act2",
  actName: "Act II",
  subtitle: "The City of Blood — Caldeum",
  accentColor: "#c8860a",
  parchmentImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/map-act2-parchment-URJxTKgwv7tAkEagLUFNuj.webp",
  viewBox: "0 0 1000 700",
  zones: [
    { id: "hidden-camp", name: "Hidden Camp", type: "town", polygon: [[3,32],[16,32],[16,48],[3,48]], centroid: [9.5,40], level: "20–35", monsterTypes: [], density: 1, farmingRating: 1, eliteCount: 0, description: "The Act II hub. Home to all artisans. Located in the desert outside Caldeum.", farmingTip: "Use as base. Complete bounties here for Horadric Caches.", connectedTo: ["road-to-alcarnus","sewers-of-caldeum"] },
    { id: "road-to-alcarnus", name: "Road to Alcarnus", type: "outdoor", polygon: [[16,30],[32,30],[32,48],[16,48]], centroid: [24,39], level: "22–38", monsterTypes: ["Coven","Fallen","Demon"], density: 3, farmingRating: 3, eliteCount: 2, description: "The desert road leading to the city of Alcarnus. Coven cultists patrol this area.", farmingTip: "Waypoint zone. Contains Khasim Outpost waypoint.", connectedTo: ["hidden-camp","black-canyon-mines","alcarnus"] },
    { id: "black-canyon-mines", name: "Black Canyon Mines", type: "dungeon", polygon: [[32,18],[58,18],[58,42],[32,42]], centroid: [45,30], level: "25–40", monsterTypes: ["Demon","Fallen","Coven"], density: 4, farmingRating: 4, eliteCount: 3, description: "Abandoned mines infested with demons. Waypoint zone. Contains the Vault of the Assassin.", farmingTip: "3+ elite packs guaranteed. Check for Vault of the Assassin dungeon entrance.", connectedTo: ["road-to-alcarnus","vault-of-assassin","dahlgur-oasis"] },
    { id: "dahlgur-oasis", name: "Dahlgur Oasis", type: "outdoor", polygon: [[56,8],[88,8],[88,40],[56,40]], centroid: [72,24], level: "28–42", monsterTypes: ["Serpent","Fallen","Demon"], density: 4, farmingRating: 5, eliteCount: 4, description: "A vast desert oasis teeming with serpents and demons. Sokahr the Keywarden spawns here. Multiple dungeons.", farmingTip: "Best Act II farming zone. 4+ elite packs, Keywarden, and multiple dungeons including Vault of the Assassin.", connectedTo: ["black-canyon-mines","vault-of-assassin","tomb-unworthy"] },
    { id: "vault-of-assassin", name: "Vault of the Assassin", type: "dungeon", polygon: [[74,36],[92,36],[92,52],[74,52]], centroid: [83,44], level: "30–45", monsterTypes: ["Assassin","Demon"], density: 5, farmingRating: 5, eliteCount: 2, description: "Hidden dungeon in the Dahlgur Oasis. Guaranteed elite packs and Resplendent Chest.", farmingTip: "Always worth clearing. Guaranteed Resplendent Chest on Level 2.", connectedTo: ["dahlgur-oasis"] },
    { id: "desolate-sands", name: "Desolate Sands", type: "outdoor", polygon: [[14,48],[56,48],[56,66],[14,66]], centroid: [35,57], level: "30–45", monsterTypes: ["Demon","Fallen","Coven"], density: 3, farmingRating: 3, eliteCount: 2, description: "Vast desolate desert leading to the Archives of Zoltun Kulle.", farmingTip: "Moderate density. Contains Cave of the Betrayer dungeon.", connectedTo: ["road-to-alcarnus","archives-zoltun-kulle","cave-of-betrayer"] },
    { id: "archives-zoltun-kulle", name: "Archives of Zoltun Kulle", type: "dungeon", polygon: [[54,44],[82,44],[82,64],[54,64]], centroid: [68,54], level: "32–48", monsterTypes: ["Construct","Demon","Zoltun Kulle"], density: 5, farmingRating: 4, eliteCount: 4, description: "Ancient archives of the mad wizard. Waypoint zone. Boss: Zoltun Kulle.", farmingTip: "Dense with constructs and demons. Boss drops guaranteed rare.", connectedTo: ["desolate-sands","imperial-palace"] },
    { id: "imperial-palace", name: "Imperial Palace", type: "boss-arena", polygon: [[54,64],[82,64],[82,78],[54,78]], centroid: [68,71], level: "35–50", monsterTypes: ["Belial","Imperial Guard"], density: 5, farmingRating: 5, eliteCount: 1, description: "The throne room of Belial, Lord of Lies. Final boss of Act II.", farmingTip: "Belial drops guaranteed rare. Phase 2 is the dangerous part — dodge his poison pools.", connectedTo: ["archives-zoltun-kulle"] },
    { id: "sewers-of-caldeum", name: "Sewers of Caldeum", type: "dungeon", polygon: [[3,48],[16,48],[16,66],[3,66]], centroid: [9.5,57], level: "24–38", monsterTypes: ["Demon","Coven"], density: 4, farmingRating: 3, eliteCount: 2, description: "The underground sewers beneath Caldeum. Waypoint zone.", farmingTip: "Good for bounties. Dense demon population.", connectedTo: ["hidden-camp"] },
  ],
  connections: [
    { from: "hidden-camp", to: "road-to-alcarnus", type: "main-path", bidirectional: true, path: [[16,40],[16,39]] },
    { from: "road-to-alcarnus", to: "black-canyon-mines", type: "main-path", bidirectional: true, path: [[32,35],[32,30]] },
    { from: "black-canyon-mines", to: "dahlgur-oasis", type: "main-path", bidirectional: true, path: [[58,30],[56,24]] },
    { from: "dahlgur-oasis", to: "vault-of-assassin", type: "dungeon", bidirectional: true, path: [[74,40],[74,44]] },
    { from: "road-to-alcarnus", to: "desolate-sands", type: "main-path", bidirectional: true, path: [[24,48],[24,57]] },
    { from: "desolate-sands", to: "archives-zoltun-kulle", type: "main-path", bidirectional: true, path: [[54,57],[54,54]] },
    { from: "archives-zoltun-kulle", to: "imperial-palace", type: "main-path", bidirectional: true, path: [[68,64],[68,64]] },
    { from: "hidden-camp", to: "sewers-of-caldeum", type: "main-path", bidirectional: true, path: [[9.5,48],[9.5,48]] },
  ],
  pois: [
    { id: "wp-hidden-camp", x: 9.5, y: 40, type: "waypoint", name: "Hidden Camp", sublabel: "Act Hub", zoneId: "hidden-camp", details: { description: "Main Act II hub waypoint.", tip: "All artisans available here." } },
    { id: "wp-sewers", x: 9.5, y: 57, type: "waypoint", name: "Sewers of Caldeum", sublabel: "Caldeum", zoneId: "sewers-of-caldeum", details: { description: "Waypoint in the Caldeum sewers.", tip: "Good starting point for Caldeum bounties." } },
    { id: "wp-black-canyon", x: 45, y: 28, type: "waypoint", name: "Black Canyon Mines", sublabel: "Stinging Winds", zoneId: "black-canyon-mines", details: { description: "Waypoint in the Black Canyon Mines.", tip: "Start here for Mines farming runs." } },
    { id: "wp-khasim", x: 24, y: 36, type: "waypoint", name: "Khasim Outpost", sublabel: "Road to Alcarnus", zoneId: "road-to-alcarnus", details: { description: "Waypoint at Khasim Outpost on the Road to Alcarnus.", tip: "Useful for Alcarnus bounties." } },
    { id: "wp-oasis-path", x: 58, y: 20, type: "waypoint", name: "Path to the Oasis", sublabel: "Dahlgur Oasis", zoneId: "dahlgur-oasis", details: { description: "Entry waypoint to the Dahlgur Oasis.", tip: "Use this to quickly access the Oasis farming area." } },
    { id: "wp-dahlgur-oasis", x: 72, y: 18, type: "waypoint", name: "Dahlgur Oasis", sublabel: "Dahlgur Oasis", zoneId: "dahlgur-oasis", details: { description: "Main Dahlgur Oasis waypoint.", tip: "Best starting point for Oasis farming." } },
    { id: "wp-ancient-path", x: 24, y: 55, type: "waypoint", name: "Ancient Path", sublabel: "Desolate Sands", zoneId: "desolate-sands", details: { description: "Waypoint in the Desolate Sands.", tip: "Use for Desolate Sands bounties." } },
    { id: "wp-desolate", x: 38, y: 57, type: "waypoint", name: "Desolate Sands", sublabel: "Desolate Sands", zoneId: "desolate-sands", details: { description: "Main Desolate Sands waypoint.", tip: "Central location for Desolate Sands runs." } },
    { id: "wp-archives", x: 68, y: 52, type: "waypoint", name: "Archives of Zoltun Kulle", sublabel: "Archives", zoneId: "archives-zoltun-kulle", details: { description: "Waypoint in the Archives of Zoltun Kulle.", tip: "Start here for Archives bounties and Belial runs." } },
    { id: "boss-maghda", x: 28, y: 36, type: "boss", name: "Maghda", sublabel: "Road to Alcarnus", zoneId: "road-to-alcarnus", details: { description: "Leader of the Coven. Encountered on the Road to Alcarnus.", tip: "Interrupt her butterfly shield. She is vulnerable during her summoning animation.", drops: "Rare items", difficulty: "Moderate" } },
    { id: "boss-zoltun-kulle", x: 68, y: 56, type: "boss", name: "Zoltun Kulle", sublabel: "Archives", zoneId: "archives-zoltun-kulle", details: { description: "The mad wizard. Fought twice in the Archives.", tip: "Dodge his sand portals and blood star projectiles.", drops: "Rare items", difficulty: "Moderate" } },
    { id: "boss-belial", x: 68, y: 72, type: "boss", name: "Belial, Lord of Lies", sublabel: "Imperial Palace", zoneId: "imperial-palace", details: { description: "Final boss of Act II. Two phases — humanoid then giant demon.", tip: "Phase 2: stay on the outer ring and dodge poison pools. His slam has a clear tell.", drops: "Guaranteed rare, Legendary at Torment+", difficulty: "Hard — Phase 2 is lethal at low gear" } },
    { id: "kw-sokahr", x: 80, y: 14, type: "keywarden", name: "Sokahr the Keywarden", sublabel: "Dahlgur Oasis", zoneId: "dahlgur-oasis", details: { description: "Keywarden of Act II. Drops the Key of Hate on Torment difficulty.", tip: "Spawns in the Dahlgur Oasis. Only drops key on Torment I+.", drops: "Key of Hate (Torment only)", difficulty: "Moderate elite pack" } },
    { id: "elite-canyon-1", x: 38, y: 24, type: "elite", name: "Elite Pack", sublabel: "Black Canyon Mines W", zoneId: "black-canyon-mines", details: { description: "Elite pack in the western Black Canyon Mines.", tip: "Demon elites — watch for Reflect Damage." } },
    { id: "elite-canyon-2", x: 52, y: 28, type: "elite", name: "Elite Pack", sublabel: "Black Canyon Mines E", zoneId: "black-canyon-mines", details: { description: "Elite pack in the eastern Black Canyon Mines.", tip: "Often near the Vault of the Assassin entrance." } },
    { id: "elite-oasis-1", x: 64, y: 22, type: "elite", name: "Elite Pack", sublabel: "Dahlgur Oasis W", zoneId: "dahlgur-oasis", details: { description: "Elite pack in the western Dahlgur Oasis.", tip: "Serpent elites — watch for Poison Enchanted." } },
    { id: "elite-oasis-2", x: 80, y: 28, type: "elite", name: "Elite Pack", sublabel: "Dahlgur Oasis E", zoneId: "dahlgur-oasis", details: { description: "Elite pack in the eastern Dahlgur Oasis.", tip: "High density area near Sokahr." } },
    { id: "chest-oasis", x: 76, y: 12, type: "chest", name: "Resplendent Chest", sublabel: "Dahlgur Oasis", zoneId: "dahlgur-oasis", details: { description: "Resplendent Chest in the Dahlgur Oasis.", tip: "Located in the northern section. High Legendary chance at Torment+." } },
    { id: "chest-vault", x: 83, y: 46, type: "chest", name: "Resplendent Chest", sublabel: "Vault of the Assassin L2", zoneId: "vault-of-assassin", details: { description: "Resplendent Chest on Level 2 of the Vault of the Assassin.", tip: "Always on Level 2. Worth the dungeon run." } },
    { id: "goblin-canyon", x: 42, y: 22, type: "goblin", name: "Treasure Goblin Spawn", sublabel: "Black Canyon Mines", zoneId: "black-canyon-mines", details: { description: "Common Treasure Goblin spawn in the Black Canyon Mines.", tip: "Kill before it escapes through its portal." } },
    { id: "dun-vault-entrance", x: 76, y: 38, type: "dungeon-entrance", name: "Vault of the Assassin", sublabel: "Dahlgur Oasis", zoneId: "dahlgur-oasis", details: { description: "Entrance to the Vault of the Assassin dungeon.", tip: "Two levels with guaranteed elites and Resplendent Chest." } },
    { id: "entry-act2", x: 6, y: 38, type: "entry", name: "Act II Entry", sublabel: "From Act I", zoneId: "hidden-camp", details: { description: "Entry point from Act I.", tip: "Activate the Hidden Camp waypoint immediately." } },
    { id: "exit-act2", x: 9.5, y: 44, type: "exit", name: "Proceed to Act III", sublabel: "Hidden Camp → Bastion's Keep", zoneId: "hidden-camp", details: { description: "After defeating Belial, travel to Act III.", tip: "Complete all Act II bounties before leaving." } },
  ],
  farmingRoutes: [
    { id: "act2-oasis-farm", name: "Dahlgur Oasis Full Clear", tier: "S", description: "Sweep the entire Dahlgur Oasis hitting all elite packs, the Keywarden, and the Vault of the Assassin.", stops: ["wp-dahlgur-oasis","elite-oasis-1","elite-oasis-2","kw-sokahr","chest-oasis","dun-vault-entrance","chest-vault"], estimatedTime: "8–12 minutes", xpPerHour: "High", goldPerHour: "High" },
    { id: "act2-keywarden", name: "Sokahr Keywarden Route", tier: "A", description: "Fast route to farm Sokahr for the Key of Hate. Torment I+ required.", stops: ["wp-dahlgur-oasis","elite-oasis-1","kw-sokahr"], estimatedTime: "4–6 minutes" },
  ],
};

// ─── ACT III ──────────────────────────────────────────────────────────────────
export const act3GisData: ActGisData = {
  actId: "act3",
  actName: "Act III",
  subtitle: "The Siege of Bastion's Keep — Arreat",
  accentColor: "#c0392b",
  parchmentImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/map-act3-parchment-BnyM9yc3z3RoBmf5MTbK6J.webp",
  viewBox: "0 0 1000 700",
  zones: [
    { id: "bastions-keep", name: "Bastion's Keep Stronghold", type: "town", polygon: [[3,28],[20,28],[20,50],[3,50]], centroid: [11.5,39], level: "40–55", monsterTypes: [], density: 1, farmingRating: 1, eliteCount: 0, description: "The main hub of Act III. The last stronghold of humanity against Azmodan's siege.", farmingTip: "Use as base. All artisans available.", connectedTo: ["keep-depths-l1","stonefort"] },
    { id: "keep-depths-l1", name: "Keep Depths Level 1–2", type: "dungeon", polygon: [[3,50],[20,50],[20,72],[3,72]], centroid: [11.5,61], level: "42–56", monsterTypes: ["Demon","Fallen","Armored Destroyer"], density: 5, farmingRating: 5, eliteCount: 4, description: "The depths beneath Bastion's Keep. Extremely dense with demons. Two waypoints.", farmingTip: "One of the best farming zones in the game. 4+ elite packs on each level. Run both levels every time.", connectedTo: ["bastions-keep","keep-depths-l3"] },
    { id: "keep-depths-l3", name: "Keep Depths Level 3 — Ghom", type: "boss-arena", polygon: [[3,72],[20,72],[20,88],[3,88]], centroid: [11.5,80], level: "45–58", monsterTypes: ["Ghom","Demon"], density: 5, farmingRating: 5, eliteCount: 1, description: "Deepest level of the Keep. Boss: Ghom, the Lord of Gluttony.", farmingTip: "Ghom drops guaranteed rare. Avoid his gas clouds — they deal massive damage over time.", connectedTo: ["keep-depths-l1"] },
    { id: "stonefort", name: "Stonefort", type: "outdoor", polygon: [[20,18],[46,18],[46,44],[20,44]], centroid: [33,31], level: "42–56", monsterTypes: ["Demon","Fallen","Siege Engine"], density: 4, farmingRating: 4, eliteCount: 3, description: "The outer fortifications of Bastion's Keep. Xah'Rith the Keywarden spawns here. Waypoint zone.", farmingTip: "Keywarden location. 3+ elite packs. Good for bounties.", connectedTo: ["bastions-keep","bridge-of-korsikk","skycrown-battlements"] },
    { id: "bridge-of-korsikk", name: "Bridge of Korsikk", type: "outdoor", polygon: [[46,26],[66,26],[66,46],[46,46]], centroid: [56,36], level: "44–58", monsterTypes: ["Demon","Fallen","Siegebreaker"], density: 4, farmingRating: 4, eliteCount: 3, description: "The massive bridge leading to Rakkis Crossing. Boss: Siegebreaker Assault Beast.", farmingTip: "Waypoint zone. Good density. Siegebreaker boss encounter here.", connectedTo: ["stonefort","rakkis-crossing"] },
    { id: "rakkis-crossing", name: "Rakkis Crossing", type: "outdoor", polygon: [[66,14],[92,14],[92,44],[66,44]], centroid: [79,29], level: "46–60", monsterTypes: ["Demon","Fallen","Coven"], density: 5, farmingRating: 5, eliteCount: 5, description: "The crossing leading to the Arreat Crater. Highest elite density in Act III. Waypoint zone.", farmingTip: "5+ elite packs guaranteed. Best Act III outdoor farming zone. Run this every game.", connectedTo: ["bridge-of-korsikk","arreat-crater-l1"] },
    { id: "arreat-crater-l1", name: "Arreat Crater Level 1", type: "outdoor", polygon: [[66,44],[92,44],[92,66],[66,66]], centroid: [79,55], level: "48–62", monsterTypes: ["Demon","Fallen","Armored Destroyer"], density: 5, farmingRating: 5, eliteCount: 4, description: "The crater of Mount Arreat. Two waypoints. Tower of the Damned and Tower of the Cursed accessible here.", farmingTip: "4+ elite packs. Always check both towers for additional elites and chests.", connectedTo: ["rakkis-crossing","tower-of-damned-l1","tower-of-cursed-l1","arreat-crater-l2"] },
    { id: "tower-of-damned-l1", name: "Tower of the Damned L1", type: "dungeon", polygon: [[80,62],[96,62],[96,78],[80,78]], centroid: [88,70], level: "50–64", monsterTypes: ["Demon","Cydaea's Minions"], density: 5, farmingRating: 5, eliteCount: 3, description: "The Tower of the Damned. Two levels. Boss on Level 2: Cydaea.", farmingTip: "Waypoint on Level 1. Dense with demons. Cydaea boss drops guaranteed rare.", connectedTo: ["arreat-crater-l1","tower-of-damned-l2"] },
    { id: "tower-of-damned-l2", name: "Tower of the Damned L2 — Cydaea", type: "boss-arena", polygon: [[80,78],[96,78],[96,90],[80,90]], centroid: [88,84], level: "52–66", monsterTypes: ["Cydaea","Demon"], density: 5, farmingRating: 5, eliteCount: 1, description: "Top of the Tower of the Damned. Boss: Cydaea, the Maiden of Lust.", farmingTip: "Cydaea drops guaranteed rare. Dodge her spider egg attacks.", connectedTo: ["tower-of-damned-l1"] },
    { id: "arreat-crater-l2", name: "Arreat Crater Level 2", type: "dungeon", polygon: [[66,66],[92,66],[92,86],[66,86]], centroid: [79,76], level: "50–64", monsterTypes: ["Demon","Fallen"], density: 5, farmingRating: 5, eliteCount: 4, description: "Deeper crater level. Waypoint zone. Leads to the Core of Arreat.", farmingTip: "4+ elite packs. Always run before Core of Arreat.", connectedTo: ["arreat-crater-l1","core-of-arreat"] },
    { id: "core-of-arreat", name: "Core of Arreat — Azmodan", type: "boss-arena", polygon: [[66,86],[92,86],[92,98],[66,98]], centroid: [79,92], level: "54–68", monsterTypes: ["Azmodan","Demon"], density: 5, farmingRating: 5, eliteCount: 1, description: "The heart of Mount Arreat. Final boss of Act III: Azmodan, Lord of Sin.", farmingTip: "Azmodan drops guaranteed rare. Destroy his summoning portals immediately. Dodge his laser beam.", connectedTo: ["arreat-crater-l2"] },
    { id: "skycrown-battlements", name: "Skycrown Battlements", type: "outdoor", polygon: [[20,8],[66,8],[66,18],[20,18]], centroid: [43,13], level: "42–56", monsterTypes: ["Demon","Fallen","Coven"], density: 3, farmingRating: 3, eliteCount: 2, description: "The upper battlements of Bastion's Keep. Accessed from Stonefort.", farmingTip: "Moderate density. Good for bounties.", connectedTo: ["stonefort"] },
  ],
  connections: [
    { from: "bastions-keep", to: "keep-depths-l1", type: "main-path", bidirectional: true, path: [[11.5,50],[11.5,50]] },
    { from: "keep-depths-l1", to: "keep-depths-l3", type: "main-path", bidirectional: true, path: [[11.5,72],[11.5,72]] },
    { from: "bastions-keep", to: "stonefort", type: "main-path", bidirectional: true, path: [[20,39],[20,31]] },
    { from: "stonefort", to: "bridge-of-korsikk", type: "main-path", bidirectional: true, path: [[46,36],[46,36]] },
    { from: "bridge-of-korsikk", to: "rakkis-crossing", type: "main-path", bidirectional: true, path: [[66,36],[66,29]] },
    { from: "rakkis-crossing", to: "arreat-crater-l1", type: "main-path", bidirectional: true, path: [[79,44],[79,55]] },
    { from: "arreat-crater-l1", to: "tower-of-damned-l1", type: "dungeon", bidirectional: true, path: [[88,62],[88,62]] },
    { from: "tower-of-damned-l1", to: "tower-of-damned-l2", type: "main-path", bidirectional: true, path: [[88,78],[88,78]] },
    { from: "arreat-crater-l1", to: "arreat-crater-l2", type: "main-path", bidirectional: true, path: [[79,66],[79,66]] },
    { from: "arreat-crater-l2", to: "core-of-arreat", type: "main-path", bidirectional: true, path: [[79,86],[79,86]] },
    { from: "stonefort", to: "skycrown-battlements", type: "optional", bidirectional: true, path: [[33,18],[43,18]] },
  ],
  pois: [
    { id: "wp-bastions", x: 11.5, y: 39, type: "waypoint", name: "Bastion's Keep Stronghold", sublabel: "Act Hub", zoneId: "bastions-keep", details: { description: "Main Act III hub waypoint.", tip: "All artisans available here." } },
    { id: "wp-keep-l1", x: 11.5, y: 55, type: "waypoint", name: "Keep Depths Level 1", sublabel: "Keep Depths", zoneId: "keep-depths-l1", details: { description: "Waypoint on Keep Depths Level 1.", tip: "Start here for Keep Depths farming." } },
    { id: "wp-keep-l3", x: 11.5, y: 68, type: "waypoint", name: "Keep Depths Level 3", sublabel: "Keep Depths", zoneId: "keep-depths-l1", details: { description: "Waypoint on Keep Depths Level 3.", tip: "Skip Levels 1–2 for faster Ghom runs." } },
    { id: "wp-stonefort", x: 33, y: 29, type: "waypoint", name: "Stonefort", sublabel: "Fields of Slaughter", zoneId: "stonefort", details: { description: "Waypoint at Stonefort.", tip: "Good starting point for Keywarden runs." } },
    { id: "wp-bridge", x: 56, y: 34, type: "waypoint", name: "Bridge of Korsikk", sublabel: "Fields of Slaughter", zoneId: "bridge-of-korsikk", details: { description: "Waypoint at the Bridge of Korsikk.", tip: "Central location for Fields of Slaughter runs." } },
    { id: "wp-rakkis", x: 79, y: 26, type: "waypoint", name: "Rakkis Crossing", sublabel: "Fields of Slaughter", zoneId: "rakkis-crossing", details: { description: "Waypoint at Rakkis Crossing — best Act III outdoor zone.", tip: "Start here for maximum elite pack density." } },
    { id: "wp-arreat1", x: 79, y: 52, type: "waypoint", name: "Arreat Crater Level 1", sublabel: "Arreat Crater", zoneId: "arreat-crater-l1", details: { description: "Waypoint on Arreat Crater Level 1.", tip: "Good starting point for tower runs." } },
    { id: "wp-tower-damned", x: 88, y: 66, type: "waypoint", name: "Tower of the Damned L1", sublabel: "Arreat Crater", zoneId: "tower-of-damned-l1", details: { description: "Waypoint on Tower of the Damned Level 1.", tip: "Start here to skip the crater and go straight to Cydaea." } },
    { id: "wp-arreat2", x: 79, y: 74, type: "waypoint", name: "Arreat Crater Level 2", sublabel: "Arreat Crater", zoneId: "arreat-crater-l2", details: { description: "Waypoint on Arreat Crater Level 2.", tip: "Skip Level 1 for faster Azmodan runs." } },
    { id: "wp-core-arreat", x: 79, y: 90, type: "waypoint", name: "The Core of Arreat", sublabel: "Arreat Crater", zoneId: "core-of-arreat", details: { description: "Waypoint directly before Azmodan.", tip: "Fastest access for Azmodan farming." } },
    { id: "boss-ghom", x: 11.5, y: 82, type: "boss", name: "Ghom, Lord of Gluttony", sublabel: "Keep Depths L3", zoneId: "keep-depths-l3", details: { description: "Demon lord of gluttony. Fills the room with toxic gas.", tip: "Stay mobile. His gas clouds deal massive DoT. Kill him before the room fills.", drops: "Guaranteed rare, Legendary at Torment+", difficulty: "Hard — gas mechanic is lethal" } },
    { id: "boss-siegebreaker", x: 56, y: 38, type: "boss", name: "Siegebreaker Assault Beast", sublabel: "Bridge of Korsikk", zoneId: "bridge-of-korsikk", details: { description: "Massive demon beast that charges across the bridge.", tip: "Dodge his charge. He grabs and throws players — stay spread out in groups.", drops: "Guaranteed rare", difficulty: "Moderate" } },
    { id: "boss-cydaea", x: 88, y: 84, type: "boss", name: "Cydaea, Maiden of Lust", sublabel: "Tower of the Damned L2", zoneId: "tower-of-damned-l2", details: { description: "Spider-demon boss atop the Tower of the Damned.", tip: "Destroy her spider egg clusters immediately. She retreats to the ceiling — use ranged attacks.", drops: "Guaranteed rare", difficulty: "Moderate" } },
    { id: "boss-azmodan", x: 79, y: 93, type: "boss", name: "Azmodan, Lord of Sin", sublabel: "Core of Arreat", zoneId: "core-of-arreat", details: { description: "Final boss of Act III. Lord of Sin and general of the Burning Hells.", tip: "Destroy summoning portals immediately. Dodge his laser beam and demon ball attacks.", drops: "Guaranteed rare, Legendary at Torment+", difficulty: "Hard — multiple mechanics simultaneously" } },
    { id: "kw-xahrith", x: 28, y: 24, type: "keywarden", name: "Xah'Rith the Keywarden", sublabel: "Stonefort", zoneId: "stonefort", details: { description: "Keywarden of Act III. Drops the Key of Terror on Torment difficulty.", tip: "Spawns in Stonefort. Only drops key on Torment I+.", drops: "Key of Terror (Torment only)", difficulty: "Moderate elite pack" } },
    { id: "elite-rakkis-1", x: 70, y: 20, type: "elite", name: "Elite Pack", sublabel: "Rakkis Crossing W", zoneId: "rakkis-crossing", details: { description: "Elite pack in western Rakkis Crossing.", tip: "Demon elites — watch for Waller + Jailer." } },
    { id: "elite-rakkis-2", x: 82, y: 18, type: "elite", name: "Elite Pack", sublabel: "Rakkis Crossing N", zoneId: "rakkis-crossing", details: { description: "Elite pack in northern Rakkis Crossing.", tip: "Often near the crater entrance." } },
    { id: "elite-rakkis-3", x: 88, y: 30, type: "elite", name: "Elite Pack", sublabel: "Rakkis Crossing E", zoneId: "rakkis-crossing", details: { description: "Elite pack in eastern Rakkis Crossing.", tip: "High density area near the crater transition." } },
    { id: "elite-keep-1", x: 8, y: 56, type: "elite", name: "Elite Pack", sublabel: "Keep Depths L1", zoneId: "keep-depths-l1", details: { description: "Elite pack on Keep Depths Level 1.", tip: "Demon elites — Reflect Damage is common here." } },
    { id: "elite-keep-2", x: 14, y: 64, type: "elite", name: "Elite Pack", sublabel: "Keep Depths L2", zoneId: "keep-depths-l1", details: { description: "Elite pack on Keep Depths Level 2.", tip: "Dense area — pull carefully." } },
    { id: "chest-rakkis", x: 76, y: 16, type: "chest", name: "Resplendent Chest", sublabel: "Rakkis Crossing", zoneId: "rakkis-crossing", details: { description: "Resplendent Chest in Rakkis Crossing.", tip: "Located in the northern section. High Legendary chance at Torment+." } },
    { id: "chest-arreat", x: 84, y: 50, type: "chest", name: "Resplendent Chest", sublabel: "Arreat Crater L1", zoneId: "arreat-crater-l1", details: { description: "Resplendent Chest in Arreat Crater Level 1.", tip: "Located near the Tower of the Damned entrance." } },
    { id: "goblin-bridge", x: 52, y: 34, type: "goblin", name: "Treasure Goblin Spawn", sublabel: "Bridge of Korsikk", zoneId: "bridge-of-korsikk", details: { description: "Treasure Goblin spawn on the Bridge of Korsikk.", tip: "Common spawn near the bridge center." } },
    { id: "entry-act3", x: 6, y: 36, type: "entry", name: "Act III Entry", sublabel: "From Act II", zoneId: "bastions-keep", details: { description: "Entry point from Act II.", tip: "Activate Bastion's Keep waypoint immediately." } },
    { id: "exit-act3", x: 11.5, y: 44, type: "exit", name: "Proceed to Act IV", sublabel: "Bastion's Keep → High Heavens", zoneId: "bastions-keep", details: { description: "After defeating Azmodan, travel to Act IV.", tip: "Complete all Act III bounties before leaving." } },
  ],
  farmingRoutes: [
    { id: "act3-keep-depths", name: "Keep Depths Full Clear", tier: "S", description: "Run both levels of Keep Depths for maximum elite density. One of the best farming routes in the game.", stops: ["wp-keep-l1","elite-keep-1","elite-keep-2","wp-keep-l3"], estimatedTime: "6–10 minutes", xpPerHour: "Very High", goldPerHour: "High" },
    { id: "act3-rakkis-farm", name: "Rakkis Crossing Sweep", tier: "S", description: "Sweep Rakkis Crossing for 5+ elite packs and the Resplendent Chest.", stops: ["wp-rakkis","elite-rakkis-1","elite-rakkis-2","elite-rakkis-3","chest-rakkis","kw-xahrith"], estimatedTime: "8–12 minutes", xpPerHour: "Very High", goldPerHour: "Very High" },
    { id: "act3-keywarden", name: "Xah'Rith Keywarden Route", tier: "A", description: "Fast route to farm Xah'Rith for the Key of Terror. Torment I+ required.", stops: ["wp-stonefort","kw-xahrith"], estimatedTime: "3–5 minutes" },
  ],
};

// ─── ACT IV ───────────────────────────────────────────────────────────────────
export const act4GisData: ActGisData = {
  actId: "act4",
  actName: "Act IV",
  subtitle: "The Prime Evil — High Heavens",
  accentColor: "#5b9bd5",
  parchmentImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/map-act4-parchment-Tu62fmL74QZGddeeMD2wmQ.webp",
  viewBox: "0 0 1000 700",
  zones: [
    { id: "diamond-gates", name: "The Diamond Gates", type: "town", polygon: [[36,4],[64,4],[64,18],[36,18]], centroid: [50,11], level: "55–70", monsterTypes: [], density: 1, farmingRating: 1, eliteCount: 0, description: "The entrance to the High Heavens. Act IV hub.", farmingTip: "Use as base. All artisans available.", connectedTo: ["gardens-hope-t1","silver-spire-l1"] },
    { id: "gardens-hope-t1", name: "Gardens of Hope 1st Tier", type: "outdoor", polygon: [[4,18],[36,18],[36,46],[4,46]], centroid: [20,32], level: "55–68", monsterTypes: ["Demon","Fallen Angel"], density: 4, farmingRating: 4, eliteCount: 3, description: "The corrupted gardens of the High Heavens. Waypoint zone.", farmingTip: "3+ elite packs. Good density of fallen angels and demons.", connectedTo: ["diamond-gates","gardens-hope-t2","hell-rift"] },
    { id: "gardens-hope-t2", name: "Gardens of Hope 2nd Tier", type: "outdoor", polygon: [[4,46],[36,46],[36,72],[4,72]], centroid: [20,59], level: "57–70", monsterTypes: ["Demon","Fallen Angel","Coven"], density: 4, farmingRating: 4, eliteCount: 3, description: "Deeper corrupted gardens. Nekarat the Keywarden spawns here.", farmingTip: "Keywarden location. 3+ elite packs.", connectedTo: ["gardens-hope-t1","great-span"] },
    { id: "hell-rift", name: "Hell Rift", type: "dungeon", polygon: [[36,18],[64,18],[64,46],[36,46]], centroid: [50,32], level: "56–70", monsterTypes: ["Demon","Izual"], density: 5, farmingRating: 4, eliteCount: 3, description: "A rift torn into the fabric of heaven. Boss: Izual.", farmingTip: "Dense with demons. Izual boss drops guaranteed rare.", connectedTo: ["gardens-hope-t1","crystal-colonnade"] },
    { id: "crystal-colonnade", name: "The Crystal Colonnade", type: "dungeon", polygon: [[36,46],[64,46],[64,66],[36,66]], centroid: [50,56], level: "58],[70+", monsterTypes: ["Demon","Fallen Angel"], density: 4, farmingRating: 3, eliteCount: 2, description: "Crystal corridors of the Silver Spire. Waypoint zone.", farmingTip: "Transit zone to the Great Span.", connectedTo: ["hell-rift","great-span"] },
    { id: "great-span", name: "The Great Span", type: "outdoor", polygon: [[4,72],[64,72],[64,86],[4,86]], centroid: [34,79], level: "58–70+", monsterTypes: ["Demon","Fallen Angel"], density: 4, farmingRating: 4, eliteCount: 3, description: "The great bridge of the High Heavens. Waypoint zone.", farmingTip: "Good density. Connects to the Vestibule of Light.", connectedTo: ["gardens-hope-t2","crystal-colonnade","vestibule-of-light"] },
    { id: "silver-spire-l1", name: "Silver Spire Level 1", type: "outdoor", polygon: [[64,18],[92,18],[92,46],[64,46]], centroid: [78,32], level: "56–70", monsterTypes: ["Demon","Fallen Angel","Iskatu"], density: 4, farmingRating: 4, eliteCount: 3, description: "The Silver Spire of the High Heavens. Waypoint zone.", farmingTip: "3+ elite packs. Iskatu boss encounter here.", connectedTo: ["diamond-gates","silver-spire-l2"] },
    { id: "silver-spire-l2", name: "Silver Spire Level 2", type: "dungeon", polygon: [[64,46],[92,46],[92,72],[64,72]], centroid: [78,59], level: "58–70+", monsterTypes: ["Demon","Fallen Angel"], density: 5, farmingRating: 5, eliteCount: 4, description: "Upper Silver Spire. Waypoint zone. Leads to the Pinnacle of Heaven.", farmingTip: "4+ elite packs. Best Act IV farming zone.", connectedTo: ["silver-spire-l1","pinnacle-of-heaven"] },
    { id: "vestibule-of-light", name: "Vestibule of Light", type: "dungeon", polygon: [[64,72],[92,72],[92,86],[64,86]], centroid: [78,79], level: "58–70+", monsterTypes: ["Demon","Fallen Angel"], density: 4, farmingRating: 3, eliteCount: 2, description: "Antechamber before the Pinnacle of Heaven. Waypoint zone.", farmingTip: "Transit zone. Good for bounties.", connectedTo: ["great-span","pinnacle-of-heaven"] },
    { id: "pinnacle-of-heaven", name: "Pinnacle of Heaven — Diablo", type: "boss-arena", polygon: [[64,86],[92,86],[92,98],[64,98]], centroid: [78,92], level: "60–70+", monsterTypes: ["Diablo","Shadow Diablo"], density: 5, farmingRating: 5, eliteCount: 1, description: "The apex of the High Heavens. Final boss of Act IV: Diablo, the Prime Evil.", farmingTip: "Diablo drops guaranteed rare and has high Legendary drop rate at Torment+. Shadow Diablo clone in Phase 2 is the most dangerous part.", connectedTo: ["silver-spire-l2","vestibule-of-light"] },
  ],
  connections: [
    { from: "diamond-gates", to: "gardens-hope-t1", type: "main-path", bidirectional: true, path: [[36,18],[20,18]] },
    { from: "diamond-gates", to: "silver-spire-l1", type: "main-path", bidirectional: true, path: [[64,18],[64,18]] },
    { from: "gardens-hope-t1", to: "gardens-hope-t2", type: "main-path", bidirectional: true, path: [[20,46],[20,46]] },
    { from: "gardens-hope-t1", to: "hell-rift", type: "dungeon", bidirectional: true, path: [[36,32],[36,32]] },
    { from: "hell-rift", to: "crystal-colonnade", type: "main-path", bidirectional: true, path: [[50,46],[50,46]] },
    { from: "gardens-hope-t2", to: "great-span", type: "main-path", bidirectional: true, path: [[20,72],[20,79]] },
    { from: "crystal-colonnade", to: "great-span", type: "main-path", bidirectional: true, path: [[50,66],[34,72]] },
    { from: "great-span", to: "vestibule-of-light", type: "main-path", bidirectional: true, path: [[64,79],[64,79]] },
    { from: "silver-spire-l1", to: "silver-spire-l2", type: "main-path", bidirectional: true, path: [[78,46],[78,46]] },
    { from: "silver-spire-l2", to: "pinnacle-of-heaven", type: "main-path", bidirectional: true, path: [[78,72],[78,86]] },
    { from: "vestibule-of-light", to: "pinnacle-of-heaven", type: "main-path", bidirectional: true, path: [[78,86],[78,86]] },
  ],
  pois: [
    { id: "wp-diamond-gates", x: 50, y: 11, type: "waypoint", name: "The Diamond Gates", sublabel: "Act Hub", zoneId: "diamond-gates", details: { description: "Main Act IV hub waypoint.", tip: "All artisans available." } },
    { id: "wp-gardens1", x: 20, y: 30, type: "waypoint", name: "Gardens of Hope 1st Tier", sublabel: "Gardens of Hope", zoneId: "gardens-hope-t1", details: { description: "Waypoint in Gardens of Hope Tier 1.", tip: "Start here for Gardens farming." } },
    { id: "wp-gardens2", x: 20, y: 57, type: "waypoint", name: "Gardens of Hope 2nd Tier", sublabel: "Gardens of Hope", zoneId: "gardens-hope-t2", details: { description: "Waypoint in Gardens of Hope Tier 2.", tip: "Keywarden is here." } },
    { id: "wp-colonnade", x: 50, y: 54, type: "waypoint", name: "The Crystal Colonnade", sublabel: "Silver Spire", zoneId: "crystal-colonnade", details: { description: "Waypoint in the Crystal Colonnade.", tip: "Good transit point." } },
    { id: "wp-great-span", x: 34, y: 77, type: "waypoint", name: "The Great Span", sublabel: "Silver Spire", zoneId: "great-span", details: { description: "Waypoint on the Great Span.", tip: "Good for bounties in the Span area." } },
    { id: "wp-spire1", x: 78, y: 30, type: "waypoint", name: "Silver Spire Level 1", sublabel: "Silver Spire", zoneId: "silver-spire-l1", details: { description: "Waypoint on Silver Spire Level 1.", tip: "Start here for Spire farming." } },
    { id: "wp-pinnacle", x: 78, y: 90, type: "waypoint", name: "The Pinnacle of Heaven", sublabel: "Silver Spire", zoneId: "pinnacle-of-heaven", details: { description: "Waypoint directly before Diablo.", tip: "Fastest access for Diablo farming." } },
    { id: "boss-izual", x: 50, y: 34, type: "boss", name: "Izual", sublabel: "Hell Rift", zoneId: "hell-rift", details: { description: "The fallen angel Izual, corrupted by the Prime Evil.", tip: "Interrupt his Frozen ability. He freezes players — use CC break skills.", drops: "Guaranteed rare", difficulty: "Moderate" } },
    { id: "boss-iskatu", x: 78, y: 48, type: "boss", name: "Iskatu", sublabel: "Silver Spire L2", zoneId: "silver-spire-l2", details: { description: "Demon lord encountered in the Silver Spire.", tip: "Destroy his shadow swarms immediately. They deal massive damage.", drops: "Guaranteed rare", difficulty: "Moderate" } },
    { id: "boss-rakanoth", x: 20, y: 62, type: "boss", name: "Rakanoth, Lord of Despair", sublabel: "Library of Fate", zoneId: "gardens-hope-t2", details: { description: "Demon lord in the Library of Fate within the Gardens.", tip: "He teleports frequently. Stay mobile and use ranged attacks.", drops: "Guaranteed rare", difficulty: "Hard — high damage output" } },
    { id: "boss-diablo", x: 78, y: 93, type: "boss", name: "Diablo, The Prime Evil", sublabel: "Pinnacle of Heaven", zoneId: "pinnacle-of-heaven", details: { description: "The ultimate boss of Diablo III. Diablo empowered by all 7 Great Evils.", tip: "Phase 1: dodge his fire cage and lightning breath. Phase 2: Shadow Diablo clone mirrors your position — stay aware of both.", drops: "Highest Legendary drop rate in the game", difficulty: "Very Hard — multiple lethal mechanics" } },
    { id: "kw-nekarat", x: 20, y: 60, type: "keywarden", name: "Nekarat the Keywarden", sublabel: "Gardens of Hope T2", zoneId: "gardens-hope-t2", details: { description: "Keywarden of Act IV. Drops the Key of Bones on Torment difficulty.", tip: "Spawns in Gardens of Hope Tier 2. Only drops key on Torment I+.", drops: "Key of Bones (Torment only)", difficulty: "Moderate elite pack" } },
    { id: "elite-gardens1", x: 12, y: 26, type: "elite", name: "Elite Pack", sublabel: "Gardens T1 NW", zoneId: "gardens-hope-t1", details: { description: "Elite pack in northwest Gardens of Hope Tier 1.", tip: "Fallen Angel elites — watch for Electrified." } },
    { id: "elite-gardens2", x: 28, y: 38, type: "elite", name: "Elite Pack", sublabel: "Gardens T1 SE", zoneId: "gardens-hope-t1", details: { description: "Elite pack in southeast Gardens of Hope Tier 1.", tip: "Often near the Hell Rift entrance." } },
    { id: "elite-spire1", x: 86, y: 26, type: "elite", name: "Elite Pack", sublabel: "Silver Spire L1", zoneId: "silver-spire-l1", details: { description: "Elite pack in Silver Spire Level 1.", tip: "Demon elites — watch for Reflect Damage." } },
    { id: "elite-spire2", x: 70, y: 56, type: "elite", name: "Elite Pack", sublabel: "Silver Spire L2 W", zoneId: "silver-spire-l2", details: { description: "Elite pack in western Silver Spire Level 2.", tip: "Dense area near the Vestibule entrance." } },
    { id: "chest-gardens1", x: 10, y: 22, type: "chest", name: "Celestial Chest", sublabel: "Gardens T1", zoneId: "gardens-hope-t1", details: { description: "Celestial Chest in Gardens of Hope Tier 1.", tip: "Located in the northern section." } },
    { id: "chest-gardens2", x: 10, y: 50, type: "chest", name: "Celestial Chest", sublabel: "Gardens T2", zoneId: "gardens-hope-t2", details: { description: "Celestial Chest in Gardens of Hope Tier 2.", tip: "Located near the Keywarden area." } },
    { id: "goblin-gardens", x: 24, y: 34, type: "goblin", name: "Treasure Goblin Spawn", sublabel: "Gardens T1", zoneId: "gardens-hope-t1", details: { description: "Common Treasure Goblin spawn in the Gardens.", tip: "Kill before it escapes." } },
    { id: "entry-act4", x: 44, y: 6, type: "entry", name: "Act IV Entry", sublabel: "From Act III", zoneId: "diamond-gates", details: { description: "Entry point from Act III.", tip: "Activate Diamond Gates waypoint immediately." } },
    { id: "exit-act4", x: 50, y: 14, type: "exit", name: "Proceed to Act V", sublabel: "Diamond Gates → Westmarch", zoneId: "diamond-gates", details: { description: "After defeating Diablo, travel to Act V.", tip: "Complete all Act IV bounties before leaving." } },
  ],
  farmingRoutes: [
    { id: "act4-spire-farm", name: "Silver Spire Full Clear", tier: "S", description: "Run both levels of the Silver Spire for maximum elite density and Diablo access.", stops: ["wp-spire1","elite-spire1","elite-spire2","wp-pinnacle","boss-diablo"], estimatedTime: "8–12 minutes", xpPerHour: "Very High", goldPerHour: "Very High" },
    { id: "act4-keywarden", name: "Nekarat Keywarden Route", tier: "A", description: "Fast route to farm Nekarat for the Key of Bones. Torment I+ required.", stops: ["wp-gardens2","kw-nekarat"], estimatedTime: "3–5 minutes" },
  ],
};

// ─── ACT V ────────────────────────────────────────────────────────────────────
export const act5GisData: ActGisData = {
  actId: "act5",
  actName: "Act V",
  subtitle: "Angel of Death — Westmarch",
  accentColor: "#8e44ad",
  parchmentImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/map-act5-parchment-D6TsGdqC8xEPVqNq8Dbycx.webp",
  viewBox: "0 0 1000 700",
  zones: [
    { id: "survivors-enclave", name: "Survivors' Enclave", type: "town", polygon: [[3,28],[18,28],[18,48],[3,48]], centroid: [10.5,38], level: "60–70+", monsterTypes: [], density: 1, farmingRating: 1, eliteCount: 0, description: "The Act V hub. A small camp of survivors in the besieged city of Westmarch.", farmingTip: "Use as base. All artisans available.", connectedTo: ["westmarch-commons","greyhollow-island"] },
    { id: "westmarch-commons", name: "Westmarch Commons", type: "outdoor", polygon: [[18,16],[46,16],[46,50],[18,50]], centroid: [32,33], level: "60–70+", monsterTypes: ["Reapers","Demon","Undead"], density: 4, farmingRating: 4, eliteCount: 3, description: "The streets of Westmarch. Waypoint zone. Urzael boss encountered here.", farmingTip: "3+ elite packs. Good density of Reapers.", connectedTo: ["survivors-enclave","westmarch-heights","blood-marsh"] },
    { id: "westmarch-heights", name: "Westmarch Heights", type: "outdoor", polygon: [[18,4],[46,4],[46,16],[18,16]], centroid: [32,10], level: "60–70+", monsterTypes: ["Reapers","Demon"], density: 3, farmingRating: 3, eliteCount: 2, description: "The upper districts of Westmarch. Waypoint zone.", farmingTip: "Moderate density. Good for bounties.", connectedTo: ["westmarch-commons"] },
    { id: "blood-marsh", name: "Blood Marsh", type: "outdoor", polygon: [[46,16],[72,16],[72,50],[46,50]], centroid: [59,33], level: "62–70+", monsterTypes: ["Reapers","Demon","Undead"], density: 4, farmingRating: 4, eliteCount: 3, description: "A blood-soaked marsh east of Westmarch. Waypoint zone.", farmingTip: "3+ elite packs. Good density throughout.", connectedTo: ["westmarch-commons","ruins-of-corvus","pandemonium-fortress"] },
    { id: "ruins-of-corvus", name: "Ruins of Corvus", type: "dungeon", polygon: [[72,8],[96,8],[96,46],[72,46]], centroid: [84,27], level: "63–70+", monsterTypes: ["Reapers","Demon","Malthael's Forces"], density: 5, farmingRating: 5, eliteCount: 5, description: "Ancient ruins east of Westmarch. Two levels. Extremely high elite density. Two Resplendent Chests.", farmingTip: "Best Act V farming zone. 5+ elite packs across two levels. Always run both levels. Two guaranteed Resplendent Chests.", connectedTo: ["blood-marsh"] },
    { id: "greyhollow-island", name: "Greyhollow Island", type: "special", polygon: [[3,48],[20,48],[20,68],[3,68]], centroid: [11.5,58], level: "60–70+", monsterTypes: ["Undead","Spectral"], density: 3, farmingRating: 3, eliteCount: 2, description: "A mysterious island accessible from the Survivors' Enclave. Unique spectral enemies.", farmingTip: "Good for bounties. Contains unique events.", connectedTo: ["survivors-enclave"] },
    { id: "pandemonium-fortress", name: "Pandemonium Fortress L1–2", type: "dungeon", polygon: [[46,50],[78,50],[78,72],[46,72]], centroid: [62,61], level: "64–70+", monsterTypes: ["Reapers","Demon","Malthael's Forces"], density: 5, farmingRating: 5, eliteCount: 4, description: "The fortress of Pandemonium. Two levels. Waypoints on both levels.", farmingTip: "4+ elite packs across two levels. Good density throughout.", connectedTo: ["blood-marsh","battlefields-of-eternity"] },
    { id: "battlefields-of-eternity", name: "Battlefields of Eternity", type: "outdoor", polygon: [[46,72],[96,72],[96,90],[46,90]], centroid: [71,81], level: "65–70+", monsterTypes: ["Reapers","Demon","Malthael's Forces"], density: 5, farmingRating: 5, eliteCount: 6, description: "The eternal battlefields outside Pandemonium. Highest elite density in Act V. Waypoint zone.", farmingTip: "6+ elite packs. Best Act V outdoor farming zone. Goblin clusters spawn here frequently.", connectedTo: ["pandemonium-fortress","pinnacle-of-heaven-act5"] },
    { id: "pinnacle-of-heaven-act5", name: "Pandemonium Fortress L2 — Malthael", type: "boss-arena", polygon: [[78,50],[96,50],[96,72],[78,72]], centroid: [87,61], level: "65–70+", monsterTypes: ["Malthael","Reapers"], density: 5, farmingRating: 5, eliteCount: 1, description: "The inner sanctum of Pandemonium Fortress. Final boss: Malthael, Angel of Death.", farmingTip: "Malthael drops guaranteed rare and has the highest Legendary drop rate in the game at Torment+. His Soul Sweep ability is the most lethal mechanic — always move away from it.", connectedTo: ["pandemonium-fortress"] },
  ],
  connections: [
    { from: "survivors-enclave", to: "westmarch-commons", type: "main-path", bidirectional: true, path: [[18,38],[18,33]] },
    { from: "westmarch-commons", to: "westmarch-heights", type: "main-path", bidirectional: true, path: [[32,16],[32,16]] },
    { from: "westmarch-commons", to: "blood-marsh", type: "main-path", bidirectional: true, path: [[46,33],[46,33]] },
    { from: "blood-marsh", to: "ruins-of-corvus", type: "dungeon", bidirectional: true, path: [[72,27],[72,27]] },
    { from: "blood-marsh", to: "pandemonium-fortress", type: "main-path", bidirectional: true, path: [[59,50],[59,61]] },
    { from: "survivors-enclave", to: "greyhollow-island", type: "optional", bidirectional: true, path: [[10.5,48],[10.5,58]] },
    { from: "pandemonium-fortress", to: "battlefields-of-eternity", type: "main-path", bidirectional: true, path: [[62,72],[62,81]] },
    { from: "pandemonium-fortress", to: "pinnacle-of-heaven-act5", type: "main-path", bidirectional: true, path: [[78,61],[78,61]] },
  ],
  pois: [
    { id: "wp-enclave", x: 10.5, y: 38, type: "waypoint", name: "Survivors' Enclave", sublabel: "Act Hub", zoneId: "survivors-enclave", details: { description: "Main Act V hub waypoint.", tip: "All artisans available." } },
    { id: "wp-westmarch-c", x: 32, y: 31, type: "waypoint", name: "Westmarch Commons", sublabel: "Westmarch", zoneId: "westmarch-commons", details: { description: "Waypoint in Westmarch Commons.", tip: "Good starting point for Westmarch bounties." } },
    { id: "wp-westmarch-h", x: 32, y: 8, type: "waypoint", name: "Westmarch Heights", sublabel: "Westmarch", zoneId: "westmarch-heights", details: { description: "Waypoint in Westmarch Heights.", tip: "Good for Heights bounties." } },
    { id: "wp-blood-marsh", x: 59, y: 30, type: "waypoint", name: "Blood Marsh", sublabel: "Blood Marsh", zoneId: "blood-marsh", details: { description: "Waypoint in the Blood Marsh.", tip: "Central location for Blood Marsh runs." } },
    { id: "wp-corvus", x: 84, y: 24, type: "waypoint", name: "Passage to Corvus", sublabel: "Ruins of Corvus", zoneId: "ruins-of-corvus", details: { description: "Waypoint at the entrance to Ruins of Corvus.", tip: "Start here for Corvus farming — best Act V zone." } },
    { id: "wp-pandemonium", x: 62, y: 59, type: "waypoint", name: "Pandemonium Fortress", sublabel: "Pandemonium", zoneId: "pandemonium-fortress", details: { description: "Waypoint in Pandemonium Fortress Level 1.", tip: "Good starting point for Fortress runs." } },
    { id: "wp-pand-l2", x: 87, y: 58, type: "waypoint", name: "Pandemonium Fortress L2", sublabel: "Pandemonium", zoneId: "pinnacle-of-heaven-act5", details: { description: "Waypoint on Pandemonium Fortress Level 2.", tip: "Fastest access for Malthael farming." } },
    { id: "wp-battlefields", x: 71, y: 79, type: "waypoint", name: "Battlefields of Eternity", sublabel: "Battlefields", zoneId: "battlefields-of-eternity", details: { description: "Waypoint on the Battlefields of Eternity.", tip: "Start here for Battlefields farming — highest elite density." } },
    { id: "boss-adria", x: 28, y: 34, type: "boss", name: "Adria", sublabel: "Westmarch Commons", zoneId: "westmarch-commons", details: { description: "The witch Adria, revealed as a servant of Malthael.", tip: "Dodge her blood nova. She summons adds — kill them quickly.", drops: "Guaranteed rare", difficulty: "Moderate" } },
    { id: "boss-urzael", x: 32, y: 22, type: "boss", name: "Urzael", sublabel: "Westmarch Cathedral", zoneId: "westmarch-commons", details: { description: "Malthael's general. Encountered in Westmarch Cathedral.", tip: "His fire pillars deal massive damage. Stay mobile and dodge the falling fire.", drops: "Guaranteed rare", difficulty: "Hard — fire mechanics" } },
    { id: "boss-malthael", x: 87, y: 63, type: "boss", name: "Malthael, Angel of Death", sublabel: "Pandemonium Fortress L2", zoneId: "pinnacle-of-heaven-act5", details: { description: "The final boss of Diablo III. The former Archangel of Wisdom, now the Angel of Death.", tip: "Phase 1: dodge his Soul Sweep (spinning scythe). Phase 2: he adds a ring of death — stay in the safe zone. Phase 3: constant Soul Sweep — maximum mobility required.", drops: "Highest Legendary drop rate in the game", difficulty: "Very Hard — Phase 3 is extremely lethal" } },
    { id: "elite-corvus-1", x: 76, y: 16, type: "elite", name: "Elite Pack", sublabel: "Ruins of Corvus L1", zoneId: "ruins-of-corvus", details: { description: "Elite pack on Ruins of Corvus Level 1.", tip: "Reaper elites — watch for Waller + Jailer." } },
    { id: "elite-corvus-2", x: 88, y: 20, type: "elite", name: "Elite Pack", sublabel: "Ruins of Corvus L1", zoneId: "ruins-of-corvus", details: { description: "Second elite pack on Ruins of Corvus Level 1.", tip: "High density area near the Level 2 entrance." } },
    { id: "elite-corvus-3", x: 80, y: 34, type: "elite", name: "Elite Pack", sublabel: "Ruins of Corvus L2", zoneId: "ruins-of-corvus", details: { description: "Elite pack on Ruins of Corvus Level 2.", tip: "Dense area near the chest." } },
    { id: "elite-battle-1", x: 54, y: 78, type: "elite", name: "Elite Pack", sublabel: "Battlefields W", zoneId: "battlefields-of-eternity", details: { description: "Elite pack in western Battlefields of Eternity.", tip: "Reaper elites — watch for Electrified." } },
    { id: "elite-battle-2", x: 68, y: 82, type: "elite", name: "Elite Pack", sublabel: "Battlefields C", zoneId: "battlefields-of-eternity", details: { description: "Elite pack in central Battlefields of Eternity.", tip: "Often near goblin spawns." } },
    { id: "elite-battle-3", x: 82, y: 78, type: "elite", name: "Elite Pack", sublabel: "Battlefields E", zoneId: "battlefields-of-eternity", details: { description: "Elite pack in eastern Battlefields of Eternity.", tip: "Near the Pandemonium Fortress entrance." } },
    { id: "chest-corvus-1", x: 78, y: 12, type: "chest", name: "Resplendent Chest", sublabel: "Ruins of Corvus L1", zoneId: "ruins-of-corvus", details: { description: "Resplendent Chest on Ruins of Corvus Level 1.", tip: "Always present. High Legendary chance at Torment+." } },
    { id: "chest-corvus-2", x: 90, y: 30, type: "chest", name: "Resplendent Chest", sublabel: "Ruins of Corvus L2", zoneId: "ruins-of-corvus", details: { description: "Resplendent Chest on Ruins of Corvus Level 2.", tip: "Second guaranteed chest. Always worth running both levels." } },
    { id: "chest-battle", x: 62, y: 80, type: "chest", name: "Resplendent Chest", sublabel: "Battlefields of Eternity", zoneId: "battlefields-of-eternity", details: { description: "Resplendent Chest on the Battlefields of Eternity.", tip: "Located in the central section." } },
    { id: "goblin-battle-1", x: 74, y: 80, type: "goblin", name: "Treasure Goblin Cluster", sublabel: "Battlefields of Eternity", zoneId: "battlefields-of-eternity", details: { description: "High-probability Treasure Goblin spawn on the Battlefields. Sometimes spawns 2–3 goblins together.", tip: "The Battlefields has the highest goblin spawn rate in the game. Kill all goblins before they escape." } },
    { id: "goblin-battle-2", x: 86, y: 84, type: "goblin", name: "Treasure Goblin Spawn", sublabel: "Battlefields E", zoneId: "battlefields-of-eternity", details: { description: "Second goblin spawn location on the Battlefields.", tip: "Check both spawn locations every run." } },
    { id: "entry-act5", x: 6, y: 36, type: "entry", name: "Act V Entry", sublabel: "From Act IV", zoneId: "survivors-enclave", details: { description: "Entry point from Act IV.", tip: "Activate Survivors' Enclave waypoint immediately." } },
    { id: "exit-act5", x: 87, y: 66, type: "exit", name: "End of Act V", sublabel: "Pandemonium Fortress L2", zoneId: "pinnacle-of-heaven-act5", details: { description: "Defeating Malthael completes the main story of Diablo III.", tip: "After completing the story, the full endgame opens: Greater Rifts, Seasons, and Paragon levels." } },
  ],
  farmingRoutes: [
    { id: "act5-corvus-farm", name: "Ruins of Corvus Full Clear", tier: "S", description: "The best Act V farming route. Run both levels of Ruins of Corvus for 5+ elite packs and 2 guaranteed Resplendent Chests.", stops: ["wp-corvus","elite-corvus-1","elite-corvus-2","chest-corvus-1","elite-corvus-3","chest-corvus-2"], estimatedTime: "8–12 minutes", xpPerHour: "Very High", goldPerHour: "Very High" },
    { id: "act5-battlefields", name: "Battlefields of Eternity Sweep", tier: "S", description: "Sweep the Battlefields for 6+ elite packs, goblin clusters, and the Resplendent Chest.", stops: ["wp-battlefields","elite-battle-1","elite-battle-2","goblin-battle-1","goblin-battle-2","elite-battle-3","chest-battle"], estimatedTime: "10–15 minutes", xpPerHour: "Very High", goldPerHour: "Very High" },
    { id: "act5-malthael", name: "Malthael Boss Run", tier: "A", description: "Fast route to farm Malthael for the highest Legendary drop rate in the game.", stops: ["wp-pand-l2","boss-malthael"], estimatedTime: "5–8 minutes", xpPerHour: "High", goldPerHour: "High" },
  ],
};

// ─── All Act data ─────────────────────────────────────────────────────────────
export const ALL_ACT_GIS_DATA: Record<string, ActGisData> = {
  act1: act1GisData,
  act2: act2GisData,
  act3: act3GisData,
  act4: act4GisData,
  act5: act5GisData,
};
