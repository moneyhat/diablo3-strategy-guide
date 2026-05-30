// Sanctuary Grimoire — Maps & Locations Data
// All 5 Acts with zones, loot sources, elites, keywardens, and farming notes

export type PoiType = "loot" | "elite" | "keywarden" | "boss" | "goblin" | "event" | "dungeon" | "waypoint" | "chest";

export interface PointOfInterest {
  id: string;
  name: string;
  type: PoiType;
  x: number; // percentage 0-100 on the map canvas
  y: number;
  description: string;
  lootTip?: string;
  farmingTip?: string;
}

export interface Zone {
  id: string;
  name: string;
  description: string;
  enemyTypes: string[];
  density: "low" | "medium" | "high" | "very-high";
  farmingRating: 1 | 2 | 3 | 4 | 5;
  pois: PointOfInterest[];
  farmingTip: string;
}

export interface ActData {
  id: string;
  actNumber: number;
  name: string;
  subtitle: string;
  hub: string;
  hubServices: string[];
  overview: string;
  theme: string;
  color: string;
  boss: { name: string; location: string; drops: string };
  keywarden: { name: string; location: string; key: string; tip: string } | null;
  zones: Zone[];
  bountyHighlights: string[];
  farmingNotes: string;
  overallRating: 1 | 2 | 3 | 4 | 5;
}

export const actsData: ActData[] = [
  {
    id: "act1",
    actNumber: 1,
    name: "Act I",
    subtitle: "The Fallen Star",
    hub: "New Tristram",
    hubServices: ["Blacksmith (Haedrig Eamon)", "Jeweler (Covetous Shen)", "Mystic (Myriam Jahzia)", "Vendor", "Stash", "Auction House"],
    overview: "The journey begins in the cursed town of New Tristram, where a fallen star has awakened the dead. From the ruined cathedral to the haunted highlands, Act I is defined by gothic horror — undead hordes, skeletal warriors, and the ghost of King Leoric himself. It is one of the most beloved farming Acts due to its dense enemy packs and numerous dungeon side areas.",
    theme: "Gothic Horror / Undead",
    color: "#8b0000",
    boss: {
      name: "The Butcher",
      location: "Halls of Agony Level 3 — Festering Court",
      drops: "Guaranteed Legendary on first kill per difficulty; Hellrack crossbow, Butcher's Carver axe"
    },
    keywarden: {
      name: "Odeg the Keywarden",
      location: "Fields of Misery — roams the entire zone",
      key: "Key of Destruction",
      tip: "Odeg spawns anywhere in the Fields of Misery. Clear the entire zone systematically — he often hides near the edges of the map. Requires Torment I+ to drop the key."
    },
    zones: [
      {
        id: "weeping-hollow",
        name: "Weeping Hollow",
        description: "A fog-drenched cemetery south of New Tristram filled with risen dead and skeletal warriors. The graveyard layout creates natural chokepoints ideal for AoE builds.",
        enemyTypes: ["Risen Dead", "Skeletal Warriors", "Grotesques", "Zombies"],
        density: "high",
        farmingRating: 4,
        farmingTip: "Excellent density of undead. Clear the entire zone in a single sweep — multiple elite packs guaranteed. Check all corners for the Defiled Crypt dungeon entrance.",
        pois: [
          { id: "wh-elite1", name: "Cemetery Entrance Elites", type: "elite", x: 25, y: 40, description: "Dense elite pack near the main cemetery gate. Almost always spawns here.", farmingTip: "Engage from range — Grotesques explode on death dealing heavy damage." },
          { id: "wh-chest1", name: "Resplendent Chest", type: "chest", x: 70, y: 25, description: "Resplendent Chest spawns in the northeast corner of the graveyard.", lootTip: "Guaranteed rare drop. Check this corner every run." },
          { id: "wh-dungeon1", name: "Defiled Crypt", type: "dungeon", x: 50, y: 65, description: "Two-level dungeon with dense undead packs and a guaranteed Resplendent Chest on level 2.", lootTip: "Always contains a Resplendent Chest on the second level. High priority stop." },
          { id: "wh-goblin", name: "Treasure Goblin Spawn", type: "goblin", x: 40, y: 50, description: "Common Treasure Goblin spawn point near the central mausoleum.", farmingTip: "Goblins here often appear near the large stone crypt in the center of the zone." }
        ]
      },
      {
        id: "cathedral",
        name: "Cathedral (Levels 1–4)",
        description: "The ancient Cathedral of Tristram descends four levels into darkness, culminating in the Royal Crypts. Dense with undead and cultists, it is a reliable source of elite packs and events.",
        enemyTypes: ["Cultists", "Skeletons", "Fallen", "Dark Cultists", "Unburied"],
        density: "high",
        farmingRating: 3,
        farmingTip: "Cathedral Level 2 has the highest elite density. The Cathedral Garden waypoint lets you skip directly to Level 2. Look for the Jar of Souls and Wretched Mothers events.",
        pois: [
          { id: "cat-waypoint", name: "Cathedral Garden Waypoint", type: "waypoint", x: 30, y: 20, description: "Waypoint at the Cathedral Garden — use this to skip to Cathedral Level 2 directly.", farmingTip: "Always start from Cathedral Garden to bypass the outdoor areas." },
          { id: "cat-jar", name: "Jar of Souls Event", type: "event", x: 55, y: 45, description: "Survive waves of skeletons to earn a Resplendent Chest. Spawns on Cathedral Level 1 or 2.", lootTip: "Guaranteed Resplendent Chest reward. One of the best events in Act I." },
          { id: "cat-elite1", name: "Level 2 Elite Corridor", type: "elite", x: 65, y: 60, description: "Cathedral Level 2 corridors consistently spawn 2–3 elite packs in close proximity.", farmingTip: "The narrow corridors make AoE builds extremely effective here." },
          { id: "cat-leoric", name: "Leoric's Shinbone", type: "loot", x: 45, y: 75, description: "Fireplace in Leoric's Manor — interact to find Leoric's Shinbone for the Staff of Herding recipe.", lootTip: "Required for the Staff of Herding (Whimsyshire access). Check the fireplace in the manor." }
        ]
      },
      {
        id: "fields-of-misery",
        name: "Fields of Misery",
        description: "A vast, fog-covered wasteland north of New Tristram. The largest outdoor zone in Act I, it contains multiple dungeon entrances, elite packs, and the Keywarden Odeg. Excellent for farming due to its sheer size and content density.",
        enemyTypes: ["Plague Carriers", "Savage Beasts", "Fallen Hounds", "Zombie Dogs", "Cultists"],
        density: "very-high",
        farmingRating: 5,
        farmingTip: "The best zone in Act I for farming. Contains the Keywarden, multiple dungeons (Caverns of Araneae, Festering Woods entrance), and consistently high elite density. Run the full perimeter to find all content.",
        pois: [
          { id: "fom-keywarden", name: "Odeg the Keywarden", type: "keywarden", x: 50, y: 50, description: "Roams the entire Fields of Misery. Drops the Key of Destruction on Torment I+.", lootTip: "Required for Infernal Machine farming. Appears anywhere — clear the full zone." },
          { id: "fom-caverns", name: "Caverns of Araneae", type: "dungeon", x: 30, y: 70, description: "Two-level dungeon filled with spider-type enemies. Contains a guaranteed Resplendent Chest and the Unique Queen Araneae.", lootTip: "Queen Araneae drops a guaranteed rare item. The Resplendent Chest on level 2 is always present." },
          { id: "fom-wortham", name: "Wortham Bluffs Elites", type: "elite", x: 75, y: 35, description: "The road to Wortham consistently spawns 2–3 elite packs in a short stretch.", farmingTip: "Quick detour with high elite density — always worth checking." },
          { id: "fom-chest", name: "Resplendent Chest Spawn", type: "chest", x: 20, y: 30, description: "Common Resplendent Chest spawn in the northwest corner near the cliff edge.", lootTip: "Check the northwest corner every run — chest spawns here frequently." }
        ]
      },
      {
        id: "festering-woods",
        name: "Festering Woods",
        description: "A dense forest area accessible from the Fields of Misery. Contains two guaranteed dungeons (Warrior's Rest and Enchanted Forest) and is one of the best bounty zones in Act I.",
        enemyTypes: ["Ghosts", "Undead Warriors", "Fallen", "Grotesques"],
        density: "high",
        farmingRating: 4,
        farmingTip: "Both dungeons always spawn here — Warrior's Rest and Enchanted Forest each contain elite packs and events. Excellent for bounty runs and casual farming.",
        pois: [
          { id: "fw-warriors", name: "Warrior's Rest", type: "dungeon", x: 35, y: 40, description: "Dungeon with dense undead warrior packs. Contains the 'A Miner's Gold' event with a Resplendent Chest reward.", lootTip: "The Miner's Gold event gives a Resplendent Chest — always complete it." },
          { id: "fw-enchanted", name: "Enchanted Forest", type: "dungeon", x: 65, y: 55, description: "Forest dungeon with Fallen and ghostly enemies. Contains elite packs and a guaranteed Resplendent Chest.", lootTip: "Guaranteed Resplendent Chest inside. High priority dungeon." },
          { id: "fw-elite", name: "Forest Entrance Elites", type: "elite", x: 50, y: 25, description: "Elite packs consistently spawn at the forest entrance near the waypoint.", farmingTip: "Two elite packs almost always present near the zone entrance." }
        ]
      },
      {
        id: "halls-of-agony",
        name: "Halls of Agony (Levels 1–3)",
        description: "The dungeon beneath Leoric's Manor where prisoners were tortured. Three levels of dense enemy packs leading to The Butcher. Level 3 contains the Festering Court where the boss fight occurs.",
        enemyTypes: ["Lacuni Warriors", "Skeleton Archers", "Torturers", "Dark Cultists", "Fallen"],
        density: "high",
        farmingRating: 3,
        farmingTip: "Level 2 has the best elite density. The Butcher on Level 3 is worth killing for the guaranteed Legendary on first kill per difficulty. Use the Leoric's Manor waypoint to start.",
        pois: [
          { id: "hoa-butcher", name: "The Butcher — Festering Court", type: "boss", x: 50, y: 85, description: "Act I boss. Charges across the room and drops chains of fire. Stay mobile and avoid the fire chains.", lootTip: "Guaranteed Legendary on first kill per difficulty. Drops Hellrack and Butcher's Carver." },
          { id: "hoa-elite2", name: "Level 2 Elite Clusters", type: "elite", x: 40, y: 50, description: "Halls of Agony Level 2 consistently spawns 3–4 elite packs in a compact area.", farmingTip: "Best elite density in the Halls. Use the Level 2 waypoint if available." }
        ]
      }
    ],
    bountyHighlights: [
      "Kill The Butcher — fastest Act I boss bounty, straightforward fight",
      "Kill Odeg the Keywarden — doubles as Infernal Machine key farming",
      "A Miner's Gold event in Warrior's Rest — quick completion, Resplendent Chest reward",
      "The Jar of Souls event in the Cathedral — fast waves, guaranteed chest",
      "Kill Boneslag the Berserker in the Weeping Hollow — reliable spawn location"
    ],
    farmingNotes: "Act I is one of the most popular farming Acts due to its variety and density. The Fields of Misery + Festering Woods route is the gold standard for casual farming. For Keywarden farming, clear the entire Fields of Misery systematically. The Cathedral Level 2 route is excellent for quick elite farming. Overall, Act I offers the best balance of density, dungeon content, and special events.",
    overallRating: 5
  },
  {
    id: "act2",
    actNumber: 2,
    name: "Act II",
    subtitle: "The City of Blood",
    hub: "Hidden Camp",
    hubServices: ["Blacksmith", "Jeweler", "Mystic", "Vendor (Squirt the Peddler)", "Stash"],
    overview: "Act II takes place in the desert city of Caldeum and its surrounding wastelands. From the scorching Stinging Winds to the underground Sewers of Caldeum, this Act features a mix of desert environments and ancient ruins. It is generally considered the weakest Act for farming due to lower enemy density in outdoor zones, but the Dahlgur Oasis and Black Canyon Mines offer reliable elite packs.",
    theme: "Desert / Ancient Ruins",
    color: "#c8860a",
    boss: {
      name: "Belial, Lord of Lies",
      location: "Imperial Palace — Throne Room",
      drops: "Guaranteed Legendary on first kill per difficulty; unique ring drops"
    },
    keywarden: {
      name: "Sokahr the Keywarden",
      location: "Dahlgur Oasis — roams the entire zone",
      key: "Key of Hate",
      tip: "Sokahr patrols the Dahlgur Oasis. The oasis is large — clear it fully and check all corners. Requires Torment I+ to drop the key."
    },
    zones: [
      {
        id: "dahlgur-oasis",
        name: "Dahlgur Oasis",
        description: "A large desert oasis with scattered palm trees and ancient ruins. Home to the Keywarden Sokahr and several dungeon entrances. The density is moderate but the zone size means multiple elite packs are always present.",
        enemyTypes: ["Sand Wasps", "Lacuni Warriors", "Fallen", "Skeletal Archers", "Serpent Mages"],
        density: "medium",
        farmingRating: 4,
        farmingTip: "Clear the full perimeter of the oasis to find Sokahr and all elite packs. The Tomb of the Unworthy and Vault of the Assassin dungeons both spawn here with guaranteed Resplendent Chests.",
        pois: [
          { id: "do-keywarden", name: "Sokahr the Keywarden", type: "keywarden", x: 50, y: 50, description: "Patrols the Dahlgur Oasis. Drops the Key of Hate on Torment I+.", lootTip: "Key of Hate required for Infernal Machine. Clear the full oasis to find him." },
          { id: "do-vault", name: "Vault of the Assassin", type: "dungeon", x: 70, y: 30, description: "Hidden dungeon with dense enemy packs and a guaranteed Resplendent Chest. One of the best dungeons in Act II.", lootTip: "Guaranteed Resplendent Chest. High priority — always enter if found." },
          { id: "do-tomb", name: "Tomb of the Unworthy", type: "dungeon", x: 25, y: 65, description: "Underground tomb with skeletal enemies and elite packs. Contains a Resplendent Chest.", lootTip: "Resplendent Chest guaranteed inside. Quick to clear." },
          { id: "do-elite", name: "Oasis Ruins Elites", type: "elite", x: 45, y: 40, description: "Ancient ruins in the center of the oasis consistently spawn elite packs.", farmingTip: "The ruined structures in the oasis center are reliable elite spawn points." }
        ]
      },
      {
        id: "black-canyon-mines",
        name: "Black Canyon Mines",
        description: "An underground mine network with tight corridors that funnel enemies into dense packs. Excellent for AoE builds due to the narrow layout. Contains multiple elite packs in a compact area.",
        enemyTypes: ["Fallen", "Dark Berserkers", "Goatmen", "Lacuni Huntresses"],
        density: "high",
        farmingRating: 4,
        farmingTip: "The mine corridors create natural chokepoints — ideal for AoE damage. Run the full mine network for 3–5 elite packs in a short time. The Road to Alcarnus area nearby adds additional density.",
        pois: [
          { id: "bcm-elite1", name: "Mine Shaft Elite Clusters", type: "elite", x: 40, y: 45, description: "The main mine shaft consistently spawns 2–3 elite packs in close proximity.", farmingTip: "Narrow corridors make Area Damage extremely effective here." },
          { id: "bcm-chest", name: "Resplendent Chest", type: "chest", x: 75, y: 60, description: "Resplendent Chest spawns in the deepest section of the mine.", lootTip: "Check the back of the mine every run — chest spawns here reliably." }
        ]
      },
      {
        id: "desolate-sands",
        name: "Desolate Sands",
        description: "A vast desert wasteland with scattered ruins and sand-dwelling enemies. Lower density than other zones but contains the Forgotten Ruins and Cave of the Betrayer dungeons.",
        enemyTypes: ["Sand Wasps", "Serpent Mages", "Skeletal Warriors", "Fallen"],
        density: "medium",
        farmingRating: 3,
        farmingTip: "Focus on the dungeon entrances rather than the open desert. The Cave of the Betrayer has two levels with guaranteed Resplendent Chests. Skip the open areas and head straight for dungeons.",
        pois: [
          { id: "ds-cave", name: "Cave of the Betrayer", type: "dungeon", x: 55, y: 40, description: "Two-level dungeon with dense enemy packs and guaranteed Resplendent Chests on both levels.", lootTip: "Two Resplendent Chests — one per level. Always enter this dungeon." },
          { id: "ds-forgotten", name: "Forgotten Ruins", type: "dungeon", x: 30, y: 70, description: "Ancient ruins dungeon with skeletal enemies and elite packs.", lootTip: "Contains a Resplendent Chest. Quick to clear." }
        ]
      },
      {
        id: "archives-zoltun-kulle",
        name: "Archives of Zoltun Kulle",
        description: "The underground library of the ancient sorcerer Zoltun Kulle. Dense with magical constructs and cultists. The unique architecture creates interesting combat scenarios.",
        enemyTypes: ["Construct Sentries", "Cultists", "Arcane Enchanted Constructs", "Zoltun Kulle's Minions"],
        density: "high",
        farmingRating: 3,
        farmingTip: "Good elite density in a compact space. The Soulstone Chamber has reliable elite spawns. Use the waypoint to skip directly to the densest section.",
        pois: [
          { id: "azk-elite", name: "Soulstone Chamber Elites", type: "elite", x: 50, y: 55, description: "The Soulstone Chamber consistently spawns 2–3 elite packs.", farmingTip: "Best elite density in the Archives. Head here directly from the waypoint." },
          { id: "azk-chest", name: "Archive Vault Chest", type: "chest", x: 80, y: 30, description: "Resplendent Chest spawns in the vault area of the Archives.", lootTip: "Check the vault area — chest spawns here frequently." }
        ]
      }
    ],
    bountyHighlights: [
      "Kill Belial — straightforward boss fight with guaranteed Legendary on first kill",
      "Kill Sokahr the Keywarden — doubles as Infernal Machine key farming",
      "Clear the Vault of the Assassin — fast dungeon with guaranteed Resplendent Chest",
      "Kill Zoltun Kulle — unique boss encounter in the Archives",
      "The Restless Sands event in the Desolate Sands — quick completion"
    ],
    farmingNotes: "Act II is generally the weakest Act for farming due to lower outdoor density. However, the Dahlgur Oasis + Black Canyon Mines route is solid for Keywarden farming. The Vault of the Assassin is one of the best dungeons in the game. For pure farming efficiency, Act II is usually skipped in favor of Acts I, III, or V.",
    overallRating: 3
  },
  {
    id: "act3",
    actNumber: 3,
    name: "Act III",
    subtitle: "The Siege of Bastion's Keep",
    hub: "Bastion's Keep Stronghold",
    hubServices: ["Blacksmith", "Jeweler", "Mystic", "Vendor", "Stash"],
    overview: "Act III is set during the demonic siege of Bastion's Keep, the last human stronghold against Azmodan's army. From the snow-covered battlements to the volcanic Arreat Crater, this Act features the highest enemy density in the game. It was historically the premier farming Act before Reaper of Souls and remains excellent for elite farming due to its consistently dense monster packs.",
    theme: "Siege / Volcanic Hellscape",
    color: "#ff4500",
    boss: {
      name: "Azmodan, Lord of Sin",
      location: "Heart of Sin — Core of Arreat",
      drops: "Guaranteed Legendary on first kill per difficulty; unique Azmodan-specific drops"
    },
    keywarden: {
      name: "Xah'Rith the Keywarden",
      location: "Stonefort — patrols the entire zone",
      key: "Key of Terror",
      tip: "Xah'Rith roams the Stonefort area. The zone is compact — clear it quickly to find him. Requires Torment I+ to drop the key."
    },
    zones: [
      {
        id: "rakkis-crossing",
        name: "Rakkis Crossing",
        description: "A bridge crossing under constant demonic assault. One of the most densely packed zones in the entire game — demons pour across the bridge in massive waves, creating ideal conditions for AoE farming.",
        enemyTypes: ["Demon Troopers", "Hellions", "Demon Soldiers", "Mallet Lords"],
        density: "very-high",
        farmingRating: 5,
        farmingTip: "The bridge creates a natural funnel — stand at the chokepoint and let enemies come to you. Exceptional for Area Damage builds. Multiple elite packs guaranteed in every run.",
        pois: [
          { id: "rc-bridge", name: "Bridge Chokepoint", type: "elite", x: 50, y: 50, description: "The center of the bridge is the densest point — elite packs spawn here consistently alongside massive regular enemy waves.", farmingTip: "Position at the bridge center for maximum Area Damage efficiency." },
          { id: "rc-elite2", name: "Bridge Entrance Elites", type: "elite", x: 25, y: 40, description: "Elite packs spawn at both ends of the bridge.", farmingTip: "Clear both ends before the center for maximum efficiency." }
        ]
      },
      {
        id: "stonefort",
        name: "Stonefort",
        description: "A fortified military outpost overrun by demons. Home to the Keywarden Xah'Rith and dense with demonic enemies. The compact layout makes it one of the fastest Keywarden farming zones.",
        enemyTypes: ["Demon Troopers", "Hellions", "Fallen Overseers", "Armored Destroyers"],
        density: "high",
        farmingRating: 4,
        farmingTip: "Compact zone — clear it in 3–5 minutes. Xah'Rith spawns anywhere inside. Check all rooms and corridors. Excellent for quick Keywarden runs.",
        pois: [
          { id: "sf-keywarden", name: "Xah'Rith the Keywarden", type: "keywarden", x: 50, y: 50, description: "Patrols the Stonefort. Drops the Key of Terror on Torment I+.", lootTip: "Key of Terror required for Infernal Machine. Compact zone — quick to find him." },
          { id: "sf-elite", name: "Fortification Elite Packs", type: "elite", x: 35, y: 60, description: "Elite packs consistently spawn in the fortification's inner courtyard.", farmingTip: "Inner courtyard has the highest elite density in the Stonefort." }
        ]
      },
      {
        id: "arreat-crater",
        name: "Arreat Crater (Levels 1–2)",
        description: "The volcanic crater at the site of the destroyed Mount Arreat. Extremely dense with demonic enemies across two levels. One of the best farming zones in the game for sheer monster density.",
        enemyTypes: ["Armored Destroyers", "Mallet Lords", "Demon Troopers", "Hellions", "Fallen"],
        density: "very-high",
        farmingRating: 5,
        farmingTip: "Both levels of the Arreat Crater have exceptional density. Level 2 leads to the Tower of the Damned. Run both levels for maximum elite packs. AoE builds shine here.",
        pois: [
          { id: "ac-elite1", name: "Crater Level 1 Elite Clusters", type: "elite", x: 40, y: 35, description: "Multiple elite packs spawn in the volcanic terrain of Level 1.", farmingTip: "3–5 elite packs guaranteed on Level 1 alone." },
          { id: "ac-tower", name: "Tower of the Damned Entrance", type: "dungeon", x: 65, y: 70, description: "Entrance to the Tower of the Damned — two levels with extremely dense demon packs.", farmingTip: "Tower of the Damned Level 1 has some of the highest density in the game." },
          { id: "ac-chest", name: "Volcanic Chest Spawn", type: "chest", x: 80, y: 25, description: "Resplendent Chest spawns near the volcanic vents on Level 1.", lootTip: "Check near the lava vents — chest spawns here reliably." }
        ]
      },
      {
        id: "tower-of-the-damned",
        name: "Tower of the Damned (Levels 1–2)",
        description: "A demonic tower with two floors of exceptionally dense enemy packs. Historically one of the best farming locations in the game. The narrow corridors and high spawn rates make it ideal for AoE builds.",
        enemyTypes: ["Armored Destroyers", "Mallet Lords", "Demon Troopers", "Siegebreaker Assault Beasts"],
        density: "very-high",
        farmingRating: 5,
        farmingTip: "Level 1 of the Tower of the Damned has the highest consistent enemy density in Act III. Clear both levels for maximum elite packs. The Siegebreaker event on Level 1 can spawn for bonus loot.",
        pois: [
          { id: "totd-elite1", name: "Level 1 Corridor Elites", type: "elite", x: 35, y: 40, description: "The main corridor of Level 1 consistently spawns 3–4 elite packs in a straight line.", farmingTip: "Corridor layout is perfect for channeling builds and AoE skills." },
          { id: "totd-elite2", name: "Level 2 Elite Clusters", type: "elite", x: 60, y: 65, description: "Level 2 has slightly lower density but still guarantees multiple elite packs.", farmingTip: "Clear Level 2 after Level 1 for additional elite packs and experience." }
        ]
      },
      {
        id: "bridge-of-korsikk",
        name: "Bridge of Korsikk",
        description: "A large outdoor area connecting the Stonefort to the Arreat Crater. Dense with demonic forces and contains several dungeon entrances. The Keep Depths dungeons are accessible from here.",
        enemyTypes: ["Demon Troopers", "Fallen", "Hellions", "Armored Destroyers"],
        density: "high",
        farmingRating: 4,
        farmingTip: "The Keep Depths (Levels 1–3) accessible from this area have excellent density. Run the bridge itself for outdoor elites, then dive into the Keep Depths for dungeon farming.",
        pois: [
          { id: "bok-keep", name: "Keep Depths Entrance", type: "dungeon", x: 30, y: 55, description: "Entrance to the Keep Depths — three levels with dense demonic enemies and multiple elite packs.", farmingTip: "Keep Depths Level 2 has the best density. Use the waypoint to start there." },
          { id: "bok-elite", name: "Bridge Elite Packs", type: "elite", x: 60, y: 35, description: "The bridge itself consistently spawns 2–3 elite packs.", farmingTip: "Quick outdoor elites before diving into the Keep Depths." }
        ]
      }
    ],
    bountyHighlights: [
      "Kill Azmodan — straightforward boss fight, guaranteed Legendary on first kill",
      "Kill Xah'Rith the Keywarden — compact zone, quick Keywarden run",
      "Clear the Tower of the Damned — highest density dungeon in Act III",
      "Kill Ghom (Lord of Gluttony) in the Larder — unique boss with good drops",
      "The Jar of Souls event variant in the Keep Depths — fast waves, chest reward"
    ],
    farmingNotes: "Act III is the premier farming Act for elite density. The Rakkis Crossing + Arreat Crater + Tower of the Damned route is one of the most efficient farming loops in the game. The Stonefort is the fastest Keywarden zone. If you want maximum elite packs per hour, Act III is the answer. AoE builds particularly excel here due to the consistently dense monster packs.",
    overallRating: 5
  },
  {
    id: "act4",
    actNumber: 4,
    name: "Act IV",
    subtitle: "Light's Fall",
    hub: "High Heavens — Crystal Arch",
    hubServices: ["Blacksmith", "Jeweler", "Mystic", "Vendor", "Stash"],
    overview: "Act IV takes place in the High Heavens — the celestial realm of the angels. From the gleaming Silver Spire to the corrupted Gardens of Hope, this Act features a unique aesthetic of fallen divinity. It is the shortest Act in the game but contains the best bounty rewards per time invested, making it a popular destination for bounty farming.",
    theme: "Fallen Heaven / Celestial",
    color: "#7eb8f7",
    boss: {
      name: "Diablo, Lord of Terror",
      location: "Crystal Arch — High Heavens",
      drops: "Guaranteed Legendary on first kill per difficulty; unique Diablo-specific drops"
    },
    keywarden: {
      name: "Nekarat the Keywarden",
      location: "Gardens of Hope Second Tier (Silver Spire Level 1)",
      key: "Key of Bones (drops Hellfire Ring materials)",
      tip: "Nekarat is found in the Gardens of Hope Second Tier. Unlike other Keywardens, he drops materials for the Hellfire Ring rather than a standard key. Requires Torment I+."
    },
    zones: [
      {
        id: "gardens-of-hope",
        name: "Gardens of Hope (Tiers 1–2)",
        description: "The corrupted gardens of the High Heavens. Two tiers of celestial architecture overrun by demonic forces. Contains the Keywarden Nekarat and several elite packs.",
        enemyTypes: ["Fallen Angels", "Demonic Hellflyers", "Corrupted Angels", "Demon Troopers"],
        density: "high",
        farmingRating: 4,
        farmingTip: "Both tiers have good elite density. Nekarat spawns in Tier 2. The compact layout makes clearing both tiers quick and efficient.",
        pois: [
          { id: "goh-keywarden", name: "Nekarat the Keywarden", type: "keywarden", x: 55, y: 60, description: "Located in Gardens of Hope Second Tier. Drops Hellfire Ring crafting materials on Torment I+.", lootTip: "Required for Hellfire Ring crafting. Different from other Keywardens — drops ring materials." },
          { id: "goh-elite1", name: "Tier 1 Elite Packs", type: "elite", x: 35, y: 40, description: "Multiple elite packs spawn throughout the first tier.", farmingTip: "Clear Tier 1 before moving to Tier 2 for Nekarat." },
          { id: "goh-chest", name: "Celestial Chest", type: "chest", x: 75, y: 25, description: "Resplendent Chest spawns in the upper area of Tier 1.", lootTip: "Check the upper platforms — chest spawns here frequently." }
        ]
      },
      {
        id: "silver-spire",
        name: "Silver Spire (Levels 1–2)",
        description: "The towering Silver Spire of the High Heavens. Two levels of celestial architecture with fallen angels and demonic invaders. Leads to the final confrontation with Diablo.",
        enemyTypes: ["Fallen Angels", "Corrupted Angels", "Demonic Hellflyers", "Diablo's Minions"],
        density: "high",
        farmingRating: 3,
        farmingTip: "Good elite density but primarily a story progression zone. Level 2 leads directly to Diablo. Worth clearing for bounties and first-kill Legendaries.",
        pois: [
          { id: "ss-diablo", name: "Diablo — Crystal Arch", type: "boss", x: 50, y: 90, description: "The final boss of the base game. Multi-phase fight with shadow clones and fire breath.", lootTip: "Guaranteed Legendary on first kill per difficulty. Unique Diablo-specific drops." },
          { id: "ss-elite", name: "Spire Level 1 Elites", type: "elite", x: 40, y: 45, description: "Elite packs spawn throughout Silver Spire Level 1.", farmingTip: "Level 1 has better elite density than Level 2." }
        ]
      },
      {
        id: "hell-rift",
        name: "Hell Rift (Levels 1–2)",
        description: "A tear in reality leading to a hellish dimension. Dense with demonic enemies and one of the better farming zones in Act IV.",
        enemyTypes: ["Demon Troopers", "Hellions", "Armored Destroyers", "Fallen"],
        density: "high",
        farmingRating: 4,
        farmingTip: "Both levels have good density. The Hell Rift is often overlooked but provides solid elite farming in a compact space. Use the waypoint to access it directly.",
        pois: [
          { id: "hr-elite1", name: "Rift Level 1 Elites", type: "elite", x: 40, y: 40, description: "Dense elite packs on Level 1 of the Hell Rift.", farmingTip: "Level 1 has the best density. Clear it quickly and move on." },
          { id: "hr-chest", name: "Hellish Chest", type: "chest", x: 70, y: 65, description: "Resplendent Chest spawns in the deepest area of Level 2.", lootTip: "Check the back of Level 2 — chest spawns reliably." }
        ]
      }
    ],
    bountyHighlights: [
      "Kill Diablo — guaranteed Legendary on first kill, straightforward fight",
      "Kill Nekarat the Keywarden — drops Hellfire Ring materials",
      "Kill Rakanoth — unique boss in the Library of Fate, good drops",
      "Kill Izual — unique boss encounter with guaranteed drops",
      "Act IV bounties overall — highest gold and material rewards per time invested"
    ],
    farmingNotes: "Act IV is the shortest Act but has the best bounty rewards per time invested. The compact zone layout means bounties complete quickly. Nekarat is the most important Keywarden for Hellfire Ring crafting. For pure bounty farming, Act IV is consistently ranked #1 due to the short distances between objectives and high reward density.",
    overallRating: 4
  },
  {
    id: "act5",
    actNumber: 5,
    name: "Act V",
    subtitle: "The Fall of Westmarch",
    hub: "Survivors' Enclave",
    hubServices: ["Blacksmith", "Jeweler", "Mystic", "Vendor (Kadala nearby)", "Stash"],
    overview: "Act V, introduced in Reaper of Souls, takes place in the city of Westmarch and the surrounding regions as the angel of death Malthael harvests souls. This Act features the most varied environments — from the gothic city streets to the ancient Pandemonium Fortress and the mysterious Greyhollow Island. It is widely considered the best Act for endgame farming due to the Battlefields of Eternity's exceptional density.",
    theme: "Death / Gothic City / Pandemonium",
    color: "#9b59b6",
    boss: {
      name: "Malthael, Angel of Death",
      location: "Pandemonium Fortress Level 2 — Death's Throne",
      drops: "Guaranteed Legendary on first kill per difficulty; unique Malthael-specific drops including Death's Bargain"
    },
    keywarden: null,
    zones: [
      {
        id: "battlefields-of-eternity",
        name: "Battlefields of Eternity",
        description: "A massive outdoor battlefield in Pandemonium where angels and demons have fought for eternity. The largest zone in Act V and one of the most densely packed areas in the entire game. Widely regarded as the best farming zone in Diablo 3.",
        enemyTypes: ["Exorcists", "Punishers", "Reapers", "Corrupted Angels", "Demon Warriors"],
        density: "very-high",
        farmingRating: 5,
        farmingTip: "The best farming zone in the entire game. Massive size with exceptional density throughout. Run the full zone for 8–12 elite packs. The Pandemonium Fortress entrance is at the far end. AoE builds are most effective here.",
        pois: [
          { id: "boe-elite1", name: "Central Battlefield Elites", type: "elite", x: 50, y: 50, description: "The center of the battlefield consistently spawns multiple elite packs in close proximity.", farmingTip: "The highest density area — always start here and work outward." },
          { id: "boe-elite2", name: "Northern Ruins Elites", type: "elite", x: 30, y: 25, description: "Ancient ruins in the north spawn dense elite clusters.", farmingTip: "Northern ruins have the second-highest density in the zone." },
          { id: "boe-chest", name: "Battlefield Resplendent Chest", type: "chest", x: 75, y: 70, description: "Resplendent Chest spawns near the ancient siege weapons on the eastern side.", lootTip: "Check near the siege weapons on the east side every run." },
          { id: "boe-goblin", name: "Treasure Goblin Cluster", type: "goblin", x: 60, y: 35, description: "Multiple Treasure Goblins often spawn together in the central ruins area.", farmingTip: "Goblin clusters are common here — chase them down for bonus loot." }
        ]
      },
      {
        id: "westmarch-commons",
        name: "Westmarch Commons",
        description: "The city streets of Westmarch overrun by Malthael's Reapers. Dense urban environment with tight corridors and multiple dungeon entrances. Excellent for early Act V farming.",
        enemyTypes: ["Reapers", "Exorcists", "Punishers", "Westmarch Ghosts"],
        density: "high",
        farmingRating: 4,
        farmingTip: "Urban layout creates natural chokepoints. The Westmarch Cathedral and Briarthorn Cemetery are accessible from here. Multiple elite packs in the streets themselves.",
        pois: [
          { id: "wc-elite1", name: "Market District Elites", type: "elite", x: 45, y: 40, description: "The market district consistently spawns 2–3 elite packs in the narrow streets.", farmingTip: "Market district has the highest street density in Westmarch Commons." },
          { id: "wc-cathedral", name: "Westmarch Cathedral", type: "dungeon", x: 65, y: 55, description: "Multi-level dungeon with dense Reaper forces. Contains elite packs and a Resplendent Chest.", lootTip: "Guaranteed Resplendent Chest inside. High priority dungeon." },
          { id: "wc-cemetery", name: "Briarthorn Cemetery", type: "dungeon", x: 30, y: 65, description: "Cemetery dungeon with undead and Reaper enemies. Contains elite packs.", farmingTip: "Quick dungeon with good density — worth entering on every run." }
        ]
      },
      {
        id: "blood-marsh",
        name: "Blood Marsh",
        description: "A dark, fog-filled swamp outside Westmarch. Dense with Reaper forces and swamp creatures. Contains the Ruins of Corvus dungeon system and several elite packs.",
        enemyTypes: ["Reapers", "Swamp Dwellers", "Exorcists", "Punishers"],
        density: "high",
        farmingRating: 4,
        farmingTip: "The Ruins of Corvus dungeon system (accessible from Blood Marsh) is one of the best dungeons in Act V. Clear the marsh itself for outdoor elites, then dive into Corvus.",
        pois: [
          { id: "bm-corvus", name: "Ruins of Corvus Entrance", type: "dungeon", x: 55, y: 45, description: "Entrance to the Ruins of Corvus — multiple levels with exceptional density and guaranteed Resplendent Chests.", lootTip: "One of the best dungeon systems in Act V. Always enter." },
          { id: "bm-elite", name: "Marsh Elite Packs", type: "elite", x: 35, y: 60, description: "Elite packs spawn throughout the marsh terrain.", farmingTip: "Clear the marsh perimeter before entering Corvus." }
        ]
      },
      {
        id: "ruins-of-corvus",
        name: "Ruins of Corvus",
        description: "An ancient ruined city beneath the Blood Marsh. Multiple levels with exceptional enemy density and guaranteed Resplendent Chests. One of the best dungeon systems in the game.",
        enemyTypes: ["Reapers", "Exorcists", "Punishers", "Corrupted Spirits"],
        density: "very-high",
        farmingRating: 5,
        farmingTip: "Exceptional density across all levels. Multiple Resplendent Chests guaranteed. The Passage to Corvus waypoint lets you start here directly. One of the top farming destinations in Act V.",
        pois: [
          { id: "roc-waypoint", name: "Passage to Corvus Waypoint", type: "waypoint", x: 20, y: 20, description: "Waypoint that lets you start directly in the Ruins of Corvus area.", farmingTip: "Always use this waypoint to start Corvus runs efficiently." },
          { id: "roc-elite1", name: "Main Hall Elite Clusters", type: "elite", x: 50, y: 50, description: "The main hall of the Ruins consistently spawns 3–4 elite packs.", farmingTip: "Main hall has the highest density — clear it first." },
          { id: "roc-chest1", name: "Resplendent Chest (Level 1)", type: "chest", x: 70, y: 35, description: "Guaranteed Resplendent Chest on the first level of the Ruins.", lootTip: "Guaranteed chest on Level 1. Always collect." },
          { id: "roc-chest2", name: "Resplendent Chest (Level 2)", type: "chest", x: 35, y: 75, description: "Guaranteed Resplendent Chest on the second level of the Ruins.", lootTip: "Guaranteed chest on Level 2. Always collect." }
        ]
      },
      {
        id: "greyhollow-island",
        name: "Greyhollow Island",
        description: "A mysterious island accessible from the Survivors' Enclave. Features unique enemies not found elsewhere and a distinct visual style. Contains the Corpse of the Ancient Tree event and several dungeons.",
        enemyTypes: ["Greyhollow Villagers", "Corrupted Druids", "Ancient Spirits", "Greyhollow Beasts"],
        density: "medium",
        farmingRating: 3,
        farmingTip: "Lower density than other Act V zones but contains unique enemies and events. The Corpse of the Ancient Tree event gives a guaranteed Resplendent Chest. Worth visiting for variety.",
        pois: [
          { id: "gi-ancient-tree", name: "Corpse of the Ancient Tree", type: "event", x: 50, y: 45, description: "Event that rewards a Resplendent Chest upon completion. Unique to Greyhollow Island.", lootTip: "Guaranteed Resplendent Chest. Complete this event every visit." },
          { id: "gi-elite", name: "Island Elite Packs", type: "elite", x: 65, y: 30, description: "Elite packs spawn throughout the island terrain.", farmingTip: "Lower density than other zones but unique enemy types for variety." }
        ]
      }
    ],
    bountyHighlights: [
      "Kill Malthael — guaranteed Legendary on first kill, multi-phase fight",
      "Clear the Battlefields of Eternity — best outdoor farming zone in the game",
      "Clear the Ruins of Corvus — guaranteed Resplendent Chests on multiple levels",
      "Kill Urzael — unique boss in the Westmarch Cathedral with good drops",
      "Kill Adria — unique boss encounter with story significance"
    ],
    farmingNotes: "Act V is the best overall Act for endgame farming. The Battlefields of Eternity has the highest enemy density in the game, and the Ruins of Corvus is one of the best dungeon systems. The Passage to Corvus waypoint makes starting runs extremely efficient. For pure farming, the Battlefields → Ruins of Corvus loop is the most efficient route in the game. Act V also has the most varied environments, making it the most enjoyable Act to farm repeatedly.",
    overallRating: 5
  }
];

export const actMap: Record<string, ActData> = Object.fromEntries(
  actsData.map((a) => [a.id, a])
);

export const POI_TYPE_COLORS: Record<PoiType, string> = {
  loot: "#d4a843",
  elite: "#ef5350",
  keywarden: "#ce93d8",
  boss: "#ff7043",
  goblin: "#66bb6a",
  event: "#42a5f5",
  dungeon: "#7eb8f7",
  waypoint: "#80cbc4",
  chest: "#ffd54f",
};

export const POI_TYPE_LABELS: Record<PoiType, string> = {
  loot: "Loot",
  elite: "Elite Pack",
  keywarden: "Keywarden",
  boss: "Boss",
  goblin: "Goblin",
  event: "Event",
  dungeon: "Dungeon",
  waypoint: "Waypoint",
  chest: "Chest",
};
