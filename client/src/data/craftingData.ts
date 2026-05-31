// Sanctuary Grimoire — Crafting Mastery Data
// All materials, recipes, gem tiers, enchanting costs, and Kanai's Cube recipes
// Used by the Crafting Mastery Calculator

// ─── MATERIAL TYPES ───────────────────────────────────────────────────────────
export type MaterialRarity = "common" | "magic" | "rare" | "legendary" | "special";
export type CraftSystem = "blacksmith" | "jeweler" | "mystic" | "kanai";

export interface CraftMaterial {
  id: string;
  name: string;
  rarity: MaterialRarity;
  description: string;
  source: string;
  system: CraftSystem[];
  icon: string; // emoji fallback
}

export interface CraftRecipe {
  id: string;
  name: string;
  system: CraftSystem;
  category: string;
  description: string;
  materials: { materialId: string; quantity: number }[];
  goldCost: number;
  output: string;
  outputRarity: "magic" | "rare" | "legendary" | "set";
  masteryTier: 1 | 2 | 3 | 4 | 5; // 1=beginner 5=endgame
  tip: string;
  priority: "essential" | "high" | "medium" | "low";
}

export interface GemTier {
  id: string;
  name: string;
  tier: number; // 1–14
  combineCount: number; // how many of previous tier to combine
  goldCost: number;
  stats: {
    weapon: string;
    armor: string;
    jewelry: string;
  };
  masteryTier: 1 | 2 | 3 | 4 | 5;
}

export interface EnchantCost {
  rolls: number; // 1-based roll number
  veiled: number; // Veiled Crystal cost
  reusable: number; // Reusable Parts cost
  arcane: number; // Arcane Dust cost
  gold: number;
}

export interface KanaiRecipe {
  id: string;
  name: string;
  description: string;
  materials: { materialId: string; quantity: number }[];
  goldCost: number;
  tip: string;
  masteryTier: 1 | 2 | 3 | 4 | 5;
  priority: "essential" | "high" | "medium" | "low";
}

// ─── MATERIALS ────────────────────────────────────────────────────────────────
export const MATERIALS: CraftMaterial[] = [
  // Blacksmith / Common
  { id: "reusable-parts",     name: "Reusable Parts",       rarity: "common",    description: "Salvaged from normal (white) items. The most basic crafting material.", source: "Salvage white/grey items at the Blacksmith", system: ["blacksmith","mystic"], icon: "⚙️" },
  { id: "arcane-dust",        name: "Arcane Dust",          rarity: "magic",     description: "Salvaged from magic (blue) items. Used in most mid-tier crafting.", source: "Salvage blue items at the Blacksmith", system: ["blacksmith","mystic"], icon: "✨" },
  { id: "veiled-crystal",     name: "Veiled Crystal",       rarity: "rare",      description: "Salvaged from rare (yellow) items. Essential for endgame crafting and enchanting.", source: "Salvage yellow items at the Blacksmith", system: ["blacksmith","mystic","kanai"], icon: "💎" },
  { id: "forgotten-soul",     name: "Forgotten Soul",       rarity: "legendary", description: "Salvaged from Legendary and Set items. Required for the most powerful crafting.", source: "Salvage Legendary/Set items at the Blacksmith", system: ["blacksmith","mystic","kanai"], icon: "🔥" },
  { id: "deaths-breath",      name: "Death's Breath",       rarity: "special",   description: "Dropped by Elite monsters at level 61+. The most important crafting material in the game.", source: "Kill Elite packs at level 61+ (higher Torment = more drops)", system: ["blacksmith","kanai"], icon: "💨" },
  // Jeweler
  { id: "chipped-gem",        name: "Chipped Gem",          rarity: "common",    description: "The lowest tier gem. Found from monster drops early in the game.", source: "Monster drops (early game)", system: ["jeweler"], icon: "🔵" },
  { id: "flawed-gem",         name: "Flawed Gem",           rarity: "common",    description: "Tier 2 gem. Combine 3 Chipped gems.", source: "Combine 3 Chipped gems at Jeweler", system: ["jeweler"], icon: "🔵" },
  { id: "regular-gem",        name: "Regular Gem",          rarity: "common",    description: "Tier 3 gem.", source: "Combine 3 Flawed gems at Jeweler", system: ["jeweler"], icon: "🔵" },
  { id: "flawless-gem",       name: "Flawless Gem",         rarity: "common",    description: "Tier 4 gem.", source: "Combine 3 Regular gems at Jeweler", system: ["jeweler"], icon: "🔷" },
  { id: "perfect-gem",        name: "Perfect Gem",          rarity: "magic",     description: "Tier 5 gem.", source: "Combine 3 Flawless gems at Jeweler", system: ["jeweler"], icon: "🔷" },
  { id: "radiant-gem",        name: "Radiant Gem",          rarity: "magic",     description: "Tier 6 gem.", source: "Combine 3 Perfect gems at Jeweler", system: ["jeweler"], icon: "💠" },
  { id: "square-gem",         name: "Square Gem",           rarity: "magic",     description: "Tier 7 gem.", source: "Combine 3 Radiant gems at Jeweler", system: ["jeweler"], icon: "💠" },
  { id: "flawless-square",    name: "Flawless Square Gem",  rarity: "rare",      description: "Tier 8 gem. First tier worth socketing into gear.", source: "Combine 3 Square gems at Jeweler", system: ["jeweler"], icon: "💠" },
  { id: "perfect-square",     name: "Perfect Square Gem",   rarity: "rare",      description: "Tier 9 gem.", source: "Combine 3 Flawless Square gems at Jeweler", system: ["jeweler"], icon: "💎" },
  { id: "radiant-square",     name: "Radiant Square Gem",   rarity: "rare",      description: "Tier 10 gem.", source: "Combine 3 Perfect Square gems at Jeweler", system: ["jeweler"], icon: "💎" },
  { id: "star-gem",           name: "Star Gem",             rarity: "rare",      description: "Tier 11 gem.", source: "Combine 3 Radiant Square gems at Jeweler", system: ["jeweler"], icon: "⭐" },
  { id: "flawless-star",      name: "Flawless Star Gem",    rarity: "legendary", description: "Tier 12 gem.", source: "Combine 3 Star gems at Jeweler", system: ["jeweler"], icon: "⭐" },
  { id: "perfect-star",       name: "Perfect Star Gem",     rarity: "legendary", description: "Tier 13 gem.", source: "Combine 3 Flawless Star gems at Jeweler", system: ["jeweler"], icon: "🌟" },
  { id: "marquise-gem",       name: "Marquise Gem",         rarity: "legendary", description: "Tier 14 gem. Minimum recommended for endgame.", source: "Combine 3 Perfect Star gems at Jeweler", system: ["jeweler"], icon: "🌟" },
  { id: "imperial-gem",       name: "Imperial Gem",         rarity: "legendary", description: "Tier 15 gem.", source: "Combine 3 Marquise gems at Jeweler", system: ["jeweler"], icon: "👑" },
  { id: "flawless-imperial",  name: "Flawless Imperial Gem",rarity: "legendary", description: "Tier 16 gem.", source: "Combine 3 Imperial gems at Jeweler", system: ["jeweler"], icon: "👑" },
  { id: "royal-gem",          name: "Royal Gem",            rarity: "legendary", description: "Tier 17 gem.", source: "Combine 3 Flawless Imperial gems at Jeweler", system: ["jeweler"], icon: "💫" },
  { id: "flawless-royal",     name: "Flawless Royal Gem",   rarity: "legendary", description: "Tier 18 gem — the maximum tier. Required for endgame augmenting.", source: "Combine 3 Royal gems at Jeweler", system: ["jeweler"], icon: "💫" },
  // Kanai's Cube special
  { id: "khanduran-rune",     name: "Khanduran Rune",       rarity: "special",   description: "Act I bounty cache material. Required for Kanai's Cube recipes.", source: "Complete Act I Bounties → Horadric Cache", system: ["kanai"], icon: "🔴" },
  { id: "caldeum-nightshade",  name: "Caldeum Nightshade",  rarity: "special",   description: "Act II bounty cache material.", source: "Complete Act II Bounties → Horadric Cache", system: ["kanai"], icon: "🟡" },
  { id: "arreat-war-tapestry", name: "Arreat War Tapestry", rarity: "special",   description: "Act III bounty cache material.", source: "Complete Act III Bounties → Horadric Cache", system: ["kanai"], icon: "🟠" },
  { id: "corrupted-angel-flesh","name": "Corrupted Angel Flesh", rarity: "special", description: "Act IV bounty cache material.", source: "Complete Act IV Bounties → Horadric Cache", system: ["kanai"], icon: "⚪" },
  { id: "westmarch-holy-water","name": "Westmarch Holy Water", rarity: "special", description: "Act V bounty cache material.", source: "Complete Act V Bounties → Horadric Cache", system: ["kanai"], icon: "🔵" },
  { id: "rainbow-goblin-mat",  name: "Whimsyshire Material",rarity: "special",   description: "Special material for the Whimsyshire secret level.", source: "Combine: Black Mushroom + Leoric's Shinbone + Liquid Rainbow + Wirt's Cow Leg + Gibbering Gemstone", system: ["blacksmith"], icon: "🌈" },
];

// ─── BLACKSMITH RECIPES ───────────────────────────────────────────────────────
export const BLACKSMITH_RECIPES: CraftRecipe[] = [
  {
    id: "bs-craft-rare-weapon",
    name: "Craft Rare Weapon",
    system: "blacksmith",
    category: "Weapons",
    description: "Craft a random rare (yellow) weapon. Stats are randomized each craft.",
    materials: [{ materialId: "reusable-parts", quantity: 8 }, { materialId: "arcane-dust", quantity: 5 }, { materialId: "veiled-crystal", quantity: 2 }],
    goldCost: 50000,
    output: "Random Rare Weapon",
    outputRarity: "rare",
    masteryTier: 2,
    tip: "Useful for filling gear slots while leveling. At endgame, upgrading rares in Kanai's Cube is more efficient.",
    priority: "medium",
  },
  {
    id: "bs-craft-rare-armor",
    name: "Craft Rare Armor",
    system: "blacksmith",
    category: "Armor",
    description: "Craft a random rare (yellow) armor piece. Stats are randomized each craft.",
    materials: [{ materialId: "reusable-parts", quantity: 8 }, { materialId: "arcane-dust", quantity: 5 }, { materialId: "veiled-crystal", quantity: 2 }],
    goldCost: 50000,
    output: "Random Rare Armor",
    outputRarity: "rare",
    masteryTier: 2,
    tip: "Good for filling weak armor slots. Combine with Kanai's Cube upgrade for a chance at a Legendary.",
    priority: "medium",
  },
  {
    id: "bs-craft-hellfire-amulet",
    name: "Hellfire Amulet",
    system: "blacksmith",
    category: "Jewelry",
    description: "Craft the Hellfire Amulet — a powerful Legendary amulet that grants a free passive skill slot.",
    materials: [{ materialId: "forgotten-soul", quantity: 10 }, { materialId: "deaths-breath", quantity: 10 }, { materialId: "khanduran-rune", quantity: 1 }, { materialId: "caldeum-nightshade", quantity: 1 }, { materialId: "arreat-war-tapestry", quantity: 1 }, { materialId: "corrupted-angel-flesh", quantity: 1 }, { materialId: "westmarch-holy-water", quantity: 1 }],
    goldCost: 5000000,
    output: "Hellfire Amulet",
    outputRarity: "legendary",
    masteryTier: 5,
    tip: "The Hellfire Amulet grants a free 5th passive skill. This is one of the most powerful items in the game. Farm all 5 Act bounty caches to get the materials.",
    priority: "essential",
  },
  {
    id: "bs-craft-hellfire-ring",
    name: "Hellfire Ring",
    system: "blacksmith",
    category: "Jewelry",
    description: "Craft the Hellfire Ring — a Legendary ring with bonus XP and a chance to trigger a fire explosion.",
    materials: [{ materialId: "forgotten-soul", quantity: 10 }, { materialId: "deaths-breath", quantity: 10 }, { materialId: "khanduran-rune", quantity: 1 }, { materialId: "caldeum-nightshade", quantity: 1 }, { materialId: "arreat-war-tapestry", quantity: 1 }, { materialId: "corrupted-angel-flesh", quantity: 1 }, { materialId: "westmarch-holy-water", quantity: 1 }],
    goldCost: 5000000,
    output: "Hellfire Ring",
    outputRarity: "legendary",
    masteryTier: 5,
    tip: "The Hellfire Ring is primarily used for leveling alts due to its 45% bonus XP. Less useful at endgame than the Amulet.",
    priority: "high",
  },
  {
    id: "bs-craft-level70-rare",
    name: "Craft Level 70 Rare",
    system: "blacksmith",
    category: "Endgame",
    description: "Craft a level 70 rare item for a specific slot. Used primarily as input for Kanai's Cube upgrade recipe.",
    materials: [{ materialId: "reusable-parts", quantity: 30 }, { materialId: "arcane-dust", quantity: 20 }, { materialId: "veiled-crystal", quantity: 10 }, { materialId: "deaths-breath", quantity: 5 }],
    goldCost: 100000,
    output: "Level 70 Rare Item",
    outputRarity: "rare",
    masteryTier: 4,
    tip: "The main reason to craft level 70 rares is to upgrade them in Kanai's Cube for a chance at a Legendary of that item type. This is one of the most efficient ways to target specific Legendaries.",
    priority: "high",
  },
];

// ─── JEWELER GEM TIERS ────────────────────────────────────────────────────────
export const GEM_TYPES = ["Ruby", "Emerald", "Topaz", "Amethyst", "Diamond"] as const;
export type GemType = typeof GEM_TYPES[number];

export const GEM_STATS: Record<GemType, { weapon: string; armor: string; jewelry: string }> = {
  Ruby:     { weapon: "+% Bonus Damage",          armor: "+% Life",          jewelry: "+% Fire Damage" },
  Emerald:  { weapon: "+% Critical Hit Damage",   armor: "+Dexterity",       jewelry: "+% Poison Damage" },
  Topaz:    { weapon: "+% Thorns Damage",          armor: "+All Resistance",  jewelry: "+% Lightning Damage" },
  Amethyst: { weapon: "+% Life Steal",             armor: "+Vitality",        jewelry: "+% Cold Damage" },
  Diamond:  { weapon: "+% Damage vs Elites",       armor: "+All Resistance",  jewelry: "+% Arcane/Holy Damage" },
};

export const GEM_TIERS: GemTier[] = [
  { id: "chipped",          name: "Chipped",           tier: 1,  combineCount: 0, goldCost: 0,      stats: { weapon: "3%",   armor: "3%",    jewelry: "3%" },  masteryTier: 1 },
  { id: "flawed",           name: "Flawed",            tier: 2,  combineCount: 3, goldCost: 500,    stats: { weapon: "5%",   armor: "5%",    jewelry: "5%" },  masteryTier: 1 },
  { id: "regular",          name: "Regular",           tier: 3,  combineCount: 3, goldCost: 1000,   stats: { weapon: "8%",   armor: "8%",    jewelry: "8%" },  masteryTier: 1 },
  { id: "flawless",         name: "Flawless",          tier: 4,  combineCount: 3, goldCost: 2000,   stats: { weapon: "10%",  armor: "10%",   jewelry: "10%" }, masteryTier: 1 },
  { id: "perfect",          name: "Perfect",           tier: 5,  combineCount: 3, goldCost: 4000,   stats: { weapon: "12%",  armor: "12%",   jewelry: "12%" }, masteryTier: 2 },
  { id: "radiant",          name: "Radiant",           tier: 6,  combineCount: 3, goldCost: 8000,   stats: { weapon: "15%",  armor: "15%",   jewelry: "15%" }, masteryTier: 2 },
  { id: "square",           name: "Square",            tier: 7,  combineCount: 3, goldCost: 16000,  stats: { weapon: "18%",  armor: "18%",   jewelry: "18%" }, masteryTier: 2 },
  { id: "flawless-square",  name: "Flawless Square",   tier: 8,  combineCount: 3, goldCost: 30000,  stats: { weapon: "20%",  armor: "20%",   jewelry: "20%" }, masteryTier: 3 },
  { id: "perfect-square",   name: "Perfect Square",    tier: 9,  combineCount: 3, goldCost: 50000,  stats: { weapon: "22%",  armor: "22%",   jewelry: "22%" }, masteryTier: 3 },
  { id: "radiant-square",   name: "Radiant Square",    tier: 10, combineCount: 3, goldCost: 80000,  stats: { weapon: "25%",  armor: "25%",   jewelry: "25%" }, masteryTier: 3 },
  { id: "star",             name: "Star",              tier: 11, combineCount: 3, goldCost: 120000, stats: { weapon: "28%",  armor: "28%",   jewelry: "28%" }, masteryTier: 4 },
  { id: "flawless-star",    name: "Flawless Star",     tier: 12, combineCount: 3, goldCost: 200000, stats: { weapon: "30%",  armor: "30%",   jewelry: "30%" }, masteryTier: 4 },
  { id: "perfect-star",     name: "Perfect Star",      tier: 13, combineCount: 3, goldCost: 300000, stats: { weapon: "33%",  armor: "33%",   jewelry: "33%" }, masteryTier: 4 },
  { id: "marquise",         name: "Marquise",          tier: 14, combineCount: 3, goldCost: 500000, stats: { weapon: "35%",  armor: "35%",   jewelry: "35%" }, masteryTier: 5 },
  { id: "imperial",         name: "Imperial",          tier: 15, combineCount: 3, goldCost: 800000, stats: { weapon: "38%",  armor: "38%",   jewelry: "38%" }, masteryTier: 5 },
  { id: "flawless-imperial",name: "Flawless Imperial", tier: 16, combineCount: 3, goldCost: 1200000,stats: { weapon: "40%",  armor: "40%",   jewelry: "40%" }, masteryTier: 5 },
  { id: "royal",            name: "Royal",             tier: 17, combineCount: 3, goldCost: 1800000,stats: { weapon: "43%",  armor: "43%",   jewelry: "43%" }, masteryTier: 5 },
  { id: "flawless-royal",   name: "Flawless Royal",    tier: 18, combineCount: 3, goldCost: 2500000,stats: { weapon: "45%",  armor: "45%",   jewelry: "45%" }, masteryTier: 5 },
];

// ─── MYSTIC ENCHANTING ────────────────────────────────────────────────────────
// Enchanting costs scale with each re-roll attempt
export const ENCHANT_COSTS: EnchantCost[] = [
  { rolls: 1,  veiled: 1,  reusable: 0,  arcane: 0,  gold: 500 },
  { rolls: 2,  veiled: 1,  reusable: 0,  arcane: 0,  gold: 1000 },
  { rolls: 3,  veiled: 2,  reusable: 0,  arcane: 0,  gold: 2500 },
  { rolls: 4,  veiled: 2,  reusable: 0,  arcane: 0,  gold: 5000 },
  { rolls: 5,  veiled: 3,  reusable: 0,  arcane: 0,  gold: 10000 },
  { rolls: 6,  veiled: 3,  reusable: 0,  arcane: 0,  gold: 20000 },
  { rolls: 7,  veiled: 4,  reusable: 0,  arcane: 0,  gold: 40000 },
  { rolls: 8,  veiled: 4,  reusable: 0,  arcane: 0,  gold: 80000 },
  { rolls: 9,  veiled: 5,  reusable: 0,  arcane: 0,  gold: 160000 },
  { rolls: 10, veiled: 5,  reusable: 0,  arcane: 0,  gold: 320000 },
  { rolls: 15, veiled: 8,  reusable: 0,  arcane: 0,  gold: 1000000 },
  { rolls: 20, veiled: 10, reusable: 0,  arcane: 0,  gold: 2000000 },
  { rolls: 30, veiled: 15, reusable: 0,  arcane: 0,  gold: 5000000 },
  { rolls: 50, veiled: 20, reusable: 0,  arcane: 0,  gold: 10000000 },
];

export const ENCHANT_STAT_CATEGORIES = {
  "Primary Stats": ["Strength", "Dexterity", "Intelligence", "Vitality"],
  "Offensive": ["Critical Hit Chance", "Critical Hit Damage", "Attack Speed", "% Damage", "Area Damage", "Cooldown Reduction"],
  "Defensive": ["All Resistance", "Armor", "Life %", "Life Regeneration", "Block Chance", "Dodge Chance"],
  "Utility": ["Resource Cost Reduction", "Gold Find", "Magic Find", "Movement Speed", "Life on Hit", "Life per Kill"],
  "Slot-Specific": ["Socket", "% Elemental Damage", "Skill Damage %", "Set Bonus"],
};

export const ENCHANT_PRIORITY_BY_SLOT: Record<string, string[]> = {
  Helm:       ["Critical Hit Chance", "Socket", "Intelligence/Dexterity/Strength", "Vitality"],
  Shoulders:  ["Cooldown Reduction", "Area Damage", "Resource Cost Reduction", "Vitality"],
  Chest:      ["Vitality", "All Resistance", "% Elemental Damage", "Armor"],
  Gloves:     ["Critical Hit Chance", "Critical Hit Damage", "Attack Speed", "Strength/Dex/Int"],
  Pants:      ["Vitality", "All Resistance", "Armor", "Strength/Dex/Int"],
  Boots:      ["Movement Speed", "Vitality", "All Resistance", "Strength/Dex/Int"],
  Belt:       ["Vitality", "Life %", "All Resistance", "Strength/Dex/Int"],
  Bracers:    ["% Elemental Damage", "Critical Hit Chance", "Strength/Dex/Int", "Vitality"],
  Amulet:     ["% Elemental Damage", "Critical Hit Chance", "Critical Hit Damage", "Socket"],
  Ring:       ["Critical Hit Chance", "Critical Hit Damage", "Attack Speed", "Socket"],
  Weapon:     ["% Damage", "Critical Hit Damage", "Attack Speed", "Socket"],
  "Off-Hand": ["Critical Hit Chance", "Cooldown Reduction", "Resource Cost Reduction", "Vitality"],
};

// ─── KANAI'S CUBE RECIPES ─────────────────────────────────────────────────────
export const KANAI_RECIPES: KanaiRecipe[] = [
  {
    id: "kanai-extract-power",
    name: "Archive of Tal Rasha — Extract Legendary Power",
    description: "Destroy a Legendary item to permanently unlock its special power in one of three Kanai's Cube slots (Weapon, Armor, or Jewelry). The item is consumed.",
    materials: [{ materialId: "deaths-breath", quantity: 5 }, { materialId: "khanduran-rune", quantity: 1 }, { materialId: "caldeum-nightshade", quantity: 1 }, { materialId: "arreat-war-tapestry", quantity: 1 }, { materialId: "corrupted-angel-flesh", quantity: 1 }, { materialId: "westmarch-holy-water", quantity: 1 }],
    goldCost: 5000000,
    tip: "This is the most important Kanai recipe. Extract powers from Legendaries you don't equip to passively gain their effects. Priority: extract build-defining powers first (e.g., Ring of Royal Grandeur for set bonuses).",
    masteryTier: 4,
    priority: "essential",
  },
  {
    id: "kanai-upgrade-rare",
    name: "Hope of Cain — Upgrade Rare to Legendary",
    description: "Convert a level 70 rare (yellow) item into a random Legendary of the same item type. The most targeted way to farm specific Legendaries.",
    materials: [{ materialId: "deaths-breath", quantity: 25 }, { materialId: "veiled-crystal", quantity: 50 }, { materialId: "reusable-parts", quantity: 50 }, { materialId: "arcane-dust", quantity: 50 }],
    goldCost: 0,
    tip: "Craft a level 70 rare of the specific item type you want (e.g., Gloves), then upgrade it here for a chance at any Legendary gloves. This is the most efficient way to target specific item slots.",
    masteryTier: 4,
    priority: "essential",
  },
  {
    id: "kanai-reforge-legendary",
    name: "Skill of Nilfur — Reforge Legendary",
    description: "Completely re-roll all stats on a Legendary or Set item. Has a chance to produce an Ancient or Primal Ancient version.",
    materials: [{ materialId: "forgotten-soul", quantity: 50 }, { materialId: "deaths-breath", quantity: 50 }, { materialId: "khanduran-rune", quantity: 5 }, { materialId: "caldeum-nightshade", quantity: 5 }, { materialId: "arreat-war-tapestry", quantity: 5 }, { materialId: "corrupted-angel-flesh", quantity: 5 }, { materialId: "westmarch-holy-water", quantity: 5 }],
    goldCost: 5000000,
    tip: "Use this to try to get an Ancient version of a key item. Ancient items have 30% higher stat values. Very expensive — only use on items you're committed to keeping.",
    masteryTier: 5,
    priority: "high",
  },
  {
    id: "kanai-convert-set-item",
    name: "Law of Kulle — Convert Set Item",
    description: "Convert a Set item into a different random item from the same Set. Useful for completing a Set when you have duplicates.",
    materials: [{ materialId: "forgotten-soul", quantity: 10 }, { materialId: "deaths-breath", quantity: 10 }, { materialId: "veiled-crystal", quantity: 10 }],
    goldCost: 1000000,
    tip: "If you have duplicate Set pieces, use this to convert them into other pieces from the same Set. Much more efficient than farming for specific Set pieces.",
    masteryTier: 4,
    priority: "high",
  },
  {
    id: "kanai-remove-level-req",
    name: "Darkness of Radament — Remove Level Requirement",
    description: "Remove the level requirement from an item. Useful for twinking low-level characters with powerful gear.",
    materials: [{ materialId: "deaths-breath", quantity: 1 }, { materialId: "khanduran-rune", quantity: 1 }, { materialId: "caldeum-nightshade", quantity: 1 }, { materialId: "arreat-war-tapestry", quantity: 1 }, { materialId: "corrupted-angel-flesh", quantity: 1 }, { materialId: "westmarch-holy-water", quantity: 1 }],
    goldCost: 500000,
    tip: "Primarily useful for leveling alts. Remove level requirements from powerful Legendaries and pass them to a new character.",
    masteryTier: 3,
    priority: "medium",
  },
  {
    id: "kanai-augment-ancient",
    name: "Caldesann's Despair — Augment Ancient Item",
    description: "Add a permanent primary stat bonus to an Ancient or Primal Ancient item by consuming a Legendary Gem at Rank 30+. The gem is destroyed.",
    materials: [{ materialId: "flawless-royal", quantity: 3 }],
    goldCost: 0,
    tip: "This is the endgame power ceiling. Augment your best Ancient items with Legendary Gems to add massive primary stat bonuses. Use gems you have duplicates of. Rank 30 minimum, but higher rank = more stats.",
    masteryTier: 5,
    priority: "essential",
  },
  {
    id: "kanai-convert-gems",
    name: "Darkness of Radament — Convert Gems",
    description: "Convert 9 Flawless Royal gems of one type into 9 Flawless Royal gems of another type.",
    materials: [{ materialId: "flawless-royal", quantity: 9 }, { materialId: "deaths-breath", quantity: 9 }],
    goldCost: 500000,
    tip: "Use this to convert excess gems of one type into the gem type your class needs. Emeralds for Dexterity classes, Rubies for Strength classes, Topazes for Intelligence classes.",
    masteryTier: 5,
    priority: "medium",
  },
];

// ─── MASTERY TIERS ────────────────────────────────────────────────────────────
export interface MasteryTier {
  tier: 1 | 2 | 3 | 4 | 5;
  name: string;
  color: string;
  description: string;
  requirements: string[];
}

export const MASTERY_TIERS: MasteryTier[] = [
  { tier: 1, name: "Initiate",    color: "#9e9e9e", description: "Just starting out. Learning the basics of salvaging and material gathering.", requirements: ["Can salvage items", "Has some Reusable Parts and Arcane Dust", "No Veiled Crystals yet"] },
  { tier: 2, name: "Apprentice",  color: "#66bb6a", description: "Comfortable with basic crafting. Starting to accumulate rare materials.", requirements: ["Has Veiled Crystals", "Can craft rare items", "Has gems up to Flawless Square"] },
  { tier: 3, name: "Journeyman",  color: "#42a5f5", description: "Solid crafting foundation. Starting to use Death's Breath and enchanting.", requirements: ["Has Death's Breath", "Uses the Mystic regularly", "Has Marquise gems", "Has some Forgotten Souls"] },
  { tier: 4, name: "Artisan",     color: "#ce93d8", description: "Advanced crafter. Using Kanai's Cube and farming bounty materials.", requirements: ["Uses Kanai's Cube (Extract, Upgrade Rare)", "Has all 5 bounty materials", "Has Flawless Royal gems", "Enchants items regularly"] },
  { tier: 5, name: "Grandmaster", color: "#ffd54f", description: "Maximum crafting mastery. Augmenting Ancients and reforging Legendaries.", requirements: ["Augments Ancient items (Caldesann's Despair)", "Reforges Legendaries for Ancient versions", "Has 50+ Forgotten Souls and Death's Breaths", "All gems at Flawless Royal"] },
];

// ─── HELPER: Calculate mastery tier from materials ────────────────────────────
export function calculateMasteryTier(inventory: Record<string, number>): {
  tier: MasteryTier;
  score: number;
  unlockedRecipes: string[];
  nextSteps: string[];
} {
  const get = (id: string) => inventory[id] || 0;

  let score = 0;
  const unlockedRecipes: string[] = [];
  const nextSteps: string[] = [];

  // Tier 1 checks
  if (get("reusable-parts") > 0) score += 10;
  if (get("arcane-dust") > 0) score += 10;

  // Tier 2 checks
  if (get("veiled-crystal") > 0) { score += 20; unlockedRecipes.push("bs-craft-rare-weapon", "bs-craft-rare-armor"); }
  else nextSteps.push("Salvage yellow (rare) items to get Veiled Crystals");

  // Tier 3 checks
  if (get("deaths-breath") > 0) { score += 25; unlockedRecipes.push("bs-craft-level70-rare"); }
  else nextSteps.push("Kill Elite packs at level 61+ to get Death's Breath");

  if (get("forgotten-soul") > 0) { score += 15; }
  else nextSteps.push("Salvage a Legendary item to get Forgotten Souls");

  // Tier 4 checks
  const hasBountyMats = get("khanduran-rune") > 0 && get("caldeum-nightshade") > 0 && get("arreat-war-tapestry") > 0 && get("corrupted-angel-flesh") > 0 && get("westmarch-holy-water") > 0;
  if (hasBountyMats) { score += 30; unlockedRecipes.push("kanai-extract-power", "kanai-remove-level-req"); }
  else nextSteps.push("Complete bounties in all 5 Acts to get bounty cache materials");

  if (get("deaths-breath") >= 25 && get("veiled-crystal") >= 50) { unlockedRecipes.push("kanai-upgrade-rare"); }
  else if (get("deaths-breath") > 0) nextSteps.push(`Need ${Math.max(0, 25 - get("deaths-breath"))} more Death's Breath for Upgrade Rare recipe`);

  if (get("forgotten-soul") >= 10 && get("deaths-breath") >= 10 && get("veiled-crystal") >= 10) { unlockedRecipes.push("kanai-convert-set-item"); }

  // Tier 5 checks
  const hasFlawlessRoyal = get("flawless-royal") > 0;
  if (hasFlawlessRoyal) { score += 20; if (get("flawless-royal") >= 3) unlockedRecipes.push("kanai-augment-ancient"); }
  else nextSteps.push("Combine gems up to Flawless Royal for augmenting Ancient items");

  const hasReforge = get("forgotten-soul") >= 50 && get("deaths-breath") >= 50 && hasBountyMats;
  if (hasReforge) { score += 20; unlockedRecipes.push("kanai-reforge-legendary"); }
  else if (get("forgotten-soul") > 0) nextSteps.push(`Need ${Math.max(0, 50 - get("forgotten-soul"))} more Forgotten Souls for Reforge recipe`);

  // Determine tier
  const tier = score >= 100 ? MASTERY_TIERS[4]
    : score >= 70 ? MASTERY_TIERS[3]
    : score >= 40 ? MASTERY_TIERS[2]
    : score >= 20 ? MASTERY_TIERS[1]
    : MASTERY_TIERS[0];

  return { tier, score: Math.min(100, score), unlockedRecipes: Array.from(new Set(unlockedRecipes)), nextSteps: nextSteps.slice(0, 4) };
}

// ─── HELPER: Calculate gem crafting chain ────────────────────────────────────
export function calculateGemChain(currentTier: number, targetTier: number, quantity: number): {
  gemsNeeded: number;
  goldNeeded: number;
  steps: { tier: string; count: number; goldCost: number }[];
} {
  if (currentTier >= targetTier) return { gemsNeeded: quantity, goldNeeded: 0, steps: [] };

  let gemsNeeded = quantity;
  let goldNeeded = 0;
  const steps: { tier: string; count: number; goldCost: number }[] = [];

  for (let t = targetTier; t > currentTier; t--) {
    const tierData = GEM_TIERS[t - 1];
    const prevCount = gemsNeeded * 3;
    const gold = gemsNeeded * tierData.goldCost;
    steps.unshift({ tier: GEM_TIERS[t - 2]?.name || "Base", count: prevCount, goldCost: gold });
    goldNeeded += gold;
    gemsNeeded = prevCount;
  }

  return { gemsNeeded, goldNeeded, steps };
}
