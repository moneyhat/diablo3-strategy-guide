// Sanctuary Grimoire — Systems & Crafting Data

export interface CraftingMaterial {
  name: string;
  rarity: "white" | "blue" | "yellow" | "legendary";
  source: string;
  uses: string;
}

export interface BlacksmithRecipe {
  name: string;
  type: string;
  level: string;
  materials: string;
  notes: string;
}

export interface GemTier {
  name: string;
  rank: number;
  effect: string;
  upgradeCount: number;
}

export interface LegendaryGem {
  name: string;
  primaryEffect: string;
  secondaryEffect: string;
  rankCap: number;
  bestUse: string;
}

export interface KanaiRecipe {
  name: string;
  ingredients: string[];
  effect: string;
  tips: string;
}

export const craftingMaterials: CraftingMaterial[] = [
  { name: "Reusable Parts", rarity: "white", source: "Salvage Normal (white) items", uses: "Blacksmith crafting, Kanai's Cube material conversion" },
  { name: "Arcane Dust", rarity: "blue", source: "Salvage Magic (blue) items", uses: "Blacksmith crafting, Kanai's Cube material conversion" },
  { name: "Veiled Crystal", rarity: "yellow", source: "Salvage Rare (yellow) items", uses: "Blacksmith crafting, Mystic enchanting, Kanai's Cube" },
  { name: "Death's Breath", rarity: "legendary", source: "Salvage Rare/Legendary items at level 61+; drops from Elites at level 61+", uses: "Most endgame crafting recipes; Kanai's Cube recipes" },
  { name: "Forgotten Soul", rarity: "legendary", source: "Salvage Legendary and Set items", uses: "Kanai's Cube reforging; Mystic enchanting on Legendaries" },
  { name: "Primordial Ashes", rarity: "legendary", source: "Salvage Primal Ancient items", uses: "Kanai's Cube: upgrade any Legendary to Primal (Curiosity of Lorath Nahr)" },
  { name: "Khanduran Rune", rarity: "legendary", source: "Act I Bounty Caches", uses: "Kanai's Cube reforge (Law of Kulle)" },
  { name: "Caldeum Nightshade", rarity: "legendary", source: "Act II Bounty Caches", uses: "Kanai's Cube reforge (Law of Kulle)" },
  { name: "Arreat War Tapestry", rarity: "legendary", source: "Act III Bounty Caches", uses: "Kanai's Cube reforge (Law of Kulle)" },
  { name: "Corrupted Angel Flesh", rarity: "legendary", source: "Act IV Bounty Caches", uses: "Kanai's Cube reforge (Law of Kulle)" },
  { name: "Westmarch Holy Water", rarity: "legendary", source: "Act V Bounty Caches", uses: "Kanai's Cube reforge (Law of Kulle)" },
];

export const blacksmithGuide = {
  overview:
    "The Blacksmith is one of three Artisans in Diablo 3. He crafts armor and weapons, and can salvage items into crafting materials. Leveling the Blacksmith to rank 12 is a one-time investment per account (shared across all characters) and unlocks the ability to craft level 70 Rare items — the foundation of Kanai's Cube upgrades.",
  levelingTips: [
    "Train the Blacksmith as soon as you arrive in New Tristram — he starts at rank 1.",
    "Each rank costs gold and crafting materials. Salvage all white, blue, and yellow items you don't need to accumulate materials.",
    "Rank 12 is the maximum and unlocks crafting of level 70 Rare items — reach this as fast as possible.",
    "The Blacksmith is shared across your entire account — you only need to level him once.",
    "In Seasons, you must re-level the Blacksmith on your seasonal account, but it is very fast with gold from early rifts.",
  ],
  keyRecipes: [
    { name: "Cain's Destiny (Set)", type: "Armor Set", level: "Level 23", materials: "Arcane Dust + Reusable Parts + Death's Breath", notes: "Provides bonus experience — excellent for leveling alts." },
    { name: "Aughild's Authority (Set)", type: "Armor Set", level: "Level 70", materials: "Veiled Crystal + Death's Breath + Forgotten Soul", notes: "Provides damage reduction vs. elites and damage bonus — used in many endgame builds." },
    { name: "Born's Command (Set)", type: "Armor Set", level: "Level 70", materials: "Veiled Crystal + Death's Breath + Forgotten Soul", notes: "Provides bonus experience and attack speed — useful for leveling." },
    { name: "Rare Level 70 Items", type: "Any Slot", level: "Level 70", materials: "Veiled Crystal + Arcane Dust + Reusable Parts + Death's Breath", notes: "The primary use of the Blacksmith at endgame — craft Rares to upgrade via Kanai's Cube (Hope of Cain)." },
  ],
  salvageGuide: "Salvaging is as important as crafting. Always salvage items you don't need rather than selling them. White items give Reusable Parts, blue items give Arcane Dust, yellow items give Veiled Crystal, and Legendary/Set items give Forgotten Souls. Primal Ancient items give Primordial Ashes.",
};

export const jewelerGuide = {
  overview:
    "The Jeweler crafts and upgrades gems, and can add or remove sockets from items. Gems provide powerful stat bonuses when socketed into gear, and upgrading them to higher tiers dramatically increases their effectiveness. The Jeweler also plays a key role in the Caldesann's Despair augment process via Legendary Gems.",
  levelingTips: [
    "Level the Jeweler alongside the Blacksmith — both share the same gold and material costs.",
    "Rank 12 unlocks the ability to craft Flawless Royal gems — the highest tier and most powerful.",
    "Upgrading gems requires combining 3 gems of the same type and tier — start upgrading early.",
    "The Jeweler is account-wide — level him once and all characters benefit.",
    "Prioritize upgrading Rubies for weapon sockets (massive damage boost) and Amethysts for helm sockets (Life bonus).",
  ],
  gemTypes: [
    { name: "Ruby", primaryEffect: "Weapon: +Damage | Armor: +Strength | Helm: +Experience", bestUse: "Weapon socket for leveling; Strength classes for endgame" },
    { name: "Emerald", primaryEffect: "Weapon: +Critical Hit Damage | Armor: +Dexterity | Helm: +Experience", bestUse: "Weapon socket for endgame (Critical Hit Damage is the best weapon socket stat)" },
    { name: "Amethyst", primaryEffect: "Weapon: +Life on Hit | Armor: +Vitality | Helm: +Life %", bestUse: "Helm socket for survivability; Vitality builds" },
    { name: "Topaz", primaryEffect: "Weapon: +Thorns | Armor: +All Resistance | Helm: +Experience", bestUse: "Armor sockets for All Resistance; Intelligence classes use Topaz in Kanai's Cube augments" },
    { name: "Diamond", primaryEffect: "Weapon: +Damage vs. Elites | Armor: +All Resistance | Helm: -Cooldown", bestUse: "Helm socket for Cooldown Reduction builds (Crusader, Monk)" },
  ],
  gemTiers: [
    "Chipped → Flawed → Normal → Flawless → Perfect → Radiant → Square → Flawless Square → Perfect Square → Radiant Square → Star → Flawless Star → Perfect Star → Radiant Star → Marquise → Imperial → Royal → Flawless Royal",
  ],
  socketingGuide:
    "The Jeweler can add a socket to a Helm, Ring, Amulet, or Weapon for a gold cost. He can also remove gems from sockets (destroying the gem) or swap gems between sockets. Always socket your best gems into your best gear — the stat bonuses are significant.",
  legendaryGems: [
    { name: "Bane of the Powerful", primaryEffect: "20% increased damage for 30s after killing an Elite pack", secondaryEffect: "Rank 25: 15% increased damage vs. Elites; 15% reduced damage from Elites", rankCap: 150, bestUse: "Universal speedfarming gem — the first gem that drops in a fresh Season" },
    { name: "Bane of the Trapped", primaryEffect: "15% increased damage to enemies under control-impairing effects", secondaryEffect: "Rank 25: Emanates a 15-yard slow aura (self-applies the bonus)", rankCap: 150, bestUse: "Universal damage gem — the Rank 25 aura means it always activates its own bonus" },
    { name: "Bane of the Stricken", primaryEffect: "0.8% stacking damage per hit against a single target", secondaryEffect: "Rank 25: 25% increased damage to Rift Guardians and bosses", rankCap: 150, bestUse: "GR pushing — essential for killing Rift Guardians; stacks reset between targets" },
    { name: "Gogok of Swiftness", primaryEffect: "2% Attack Speed and 1% Cooldown Reduction per stack (max 15 stacks)", secondaryEffect: "Rank 25: 15% Dodge Chance at max stacks", rankCap: 150, bestUse: "Cooldown-dependent builds; Attack Speed breakpoint builds" },
    { name: "Boon of the Hoarder", primaryEffect: "30% chance to explode gold on kill", secondaryEffect: "Rank 25: 30% movement speed for 3s after picking up gold", rankCap: 50, bestUse: "Gold farming; speedfarming with Goldwrap belt for near-invincibility" },
    { name: "Zei's Stone of Vengeance", primaryEffect: "4% increased damage per 10 yards between you and the target (max 80%)", secondaryEffect: "Rank 25: 4% chance to Stun on hit", rankCap: 150, bestUse: "Ranged builds (Demon Hunter, Wizard) that fight from maximum distance" },
    { name: "Taeguk", primaryEffect: "0.5% increased damage and 0.5% increased Armor per stack while channeling (max 10 stacks)", secondaryEffect: "Rank 25: Increases Armor by 10% while channeling", rankCap: 150, bestUse: "Channeling builds (Wizard, Witch Doctor, Barbarian WW)" },
    { name: "Enforcer", primaryEffect: "15% increased pet damage", secondaryEffect: "Rank 25: 15% reduced damage taken by pets", rankCap: 150, bestUse: "Pet builds (Witch Doctor, Monk Inna, Necromancer summoner)" },
    { name: "Legacy of Dreams", primaryEffect: "100% increased damage for each non-Set Legendary equipped (max 1250%)", secondaryEffect: "Rank 25: 250% increased damage while no Set items are equipped", rankCap: 99, bestUse: "Builds that cannot use a 6-piece set; provides a massive multiplier for non-set builds" },
    { name: "Pain Enhancer", primaryEffect: "Bleed enemies for 1500% weapon damage over 3s on Critical Hit", secondaryEffect: "Rank 25: Gain 3% Attack Speed for each bleeding enemy within 20 yards", rankCap: 150, bestUse: "High Attack Speed builds; Area Damage builds that hit many enemies" },
  ],
};

export const mysticGuide = {
  overview:
    "The Mystic is the third Artisan, unlocked in Act II. She provides two powerful services: Enchanting (rerolling item stats) and Transmogrification (changing item appearances). Enchanting is one of the most important endgame activities — it allows you to replace a single stat on any Legendary or Rare item with a better roll.",
  enchantingGuide: {
    description:
      "Enchanting allows you to replace one stat on an item with a randomly rolled alternative from that item's possible stat pool. Each enchant costs gold and crafting materials (Veiled Crystal for Rares, Forgotten Soul for Legendaries). Once you've enchanted an item, you can only re-enchant the same slot — you cannot change which stat you're replacing.",
    tips: [
      "Always enchant the worst stat on your item — never enchant a stat you want to keep.",
      "You can only enchant one stat per item — choose wisely, as you're locked into that slot.",
      "The cost of enchanting increases with each attempt on the same item — budget your Forgotten Souls carefully.",
      "For Legendary items, enchanting costs Forgotten Souls — salvage unwanted Legendaries to accumulate them.",
      "Use the Mystic to target specific stats: Critical Hit Chance, Critical Hit Damage, Socket, or Elemental Damage are the most valuable.",
      "If the stat you want doesn't appear after many attempts, consider reforging the item via Kanai's Cube instead.",
      "Enchanting does NOT change the item's Legendary Power — only the regular stats.",
    ],
    priorityStats: [
      { slot: "Weapon", priority: "Socket (for Emerald) > Damage Range > Critical Hit Damage > Attack Speed" },
      { slot: "Helm", priority: "Socket (for Diamond/Ruby) > Critical Hit Chance > Skill Damage %" },
      { slot: "Shoulders", priority: "Cooldown Reduction > Area Damage > Resource Cost Reduction" },
      { slot: "Chest", priority: "Sockets (3) > Elite Damage Reduction > Skill Damage %" },
      { slot: "Gloves", priority: "Critical Hit Chance > Critical Hit Damage > Attack Speed > Cooldown Reduction" },
      { slot: "Pants", priority: "Sockets (2) > Vitality > Armor" },
      { slot: "Boots", priority: "Skill Damage % > Movement Speed > Vitality" },
      { slot: "Belt", priority: "Skill Damage % > Vitality > Life %" },
      { slot: "Bracers", priority: "Elemental Damage % > Critical Hit Chance > Primary Stat" },
      { slot: "Ring", priority: "Socket > Critical Hit Damage > Critical Hit Chance > Average Damage" },
      { slot: "Amulet", priority: "Socket > Elemental Damage % > Critical Hit Chance > Critical Hit Damage" },
    ],
  },
  transmogrificationGuide: {
    description:
      "Transmogrification allows you to change the visual appearance of any item to look like another item of the same type that you have previously found. This is purely cosmetic — it does not affect stats. Unlocked appearances are stored in the Wardrobe and are account-wide.",
    tips: [
      "Transmogrification is purely cosmetic — it never affects item stats or power.",
      "All appearances you've ever found are permanently unlocked in the Wardrobe.",
      "You can transmogrify any item to look like any other item of the same type (e.g., any sword can look like any other sword).",
      "Seasonal exclusive cosmetic items are often obtained through the Season Journey and stored in the Wardrobe.",
      "Dye your armor using Dyes purchased from vendors to further customize your appearance.",
    ],
  },
};

export const kanaisCubeGuide = {
  overview:
    "Kanai's Cube is the most powerful crafting tool in Diablo 3, found in the Ruins of Sescheron in Act III. It allows you to extract Legendary Powers, upgrade items, reforge Legendaries, augment Ancient items, and much more. Unlocking it is the first priority for any new character reaching the endgame.",
  location: "The Ruins of Sescheron → Elder Sanctum → northeastern dead end. Available in Adventure Mode only.",
  recipes: [
    {
      name: "Archive of Tal Rasha (Extract Legendary Power)",
      ingredients: ["1x Khanduran Rune", "1x Caldeum Nightshade", "1x Arreat War Tapestry", "1x Corrupted Angel Flesh", "1x Westmarch Holy Water", "5x Death's Breath", "1x Item with extractable Legendary Power"],
      effect: "Destroys the item and permanently unlocks its Legendary Power as a passive ability. You can equip up to 3 powers simultaneously (Weapon, Armor, Jewelry slots). Extracted powers always roll at their maximum value.",
      tips: "Save all Legendaries with useful powers while leveling — you don't need to find them again. The power is unlocked permanently on your account for that game mode.",
    },
    {
      name: "Hope of Cain (Upgrade Rare Item)",
      ingredients: ["50x Reusable Parts", "50x Arcane Dust", "50x Veiled Crystal", "25x Death's Breath", "1x Equippable Rare level 70 item"],
      effect: "Upgrades the Rare item into a random Legendary or Set item of the same type. The result is smart-looted for your class. Can produce Ancient or Primal items if GR70 solo has been completed.",
      tips: "The most efficient way to target specific Legendaries. Research which class has the smallest item pool for your target item — upgrading on that class gives the best odds.",
    },
    {
      name: "Law of Kulle (Reforge Legendary)",
      ingredients: ["5x each Bounty Material (all 5 Acts)", "50x Forgotten Soul", "1x Legendary or Set item"],
      effect: "Completely rerolls all stats on the item. The result can be Ancient or Primal. Smart-looted for your class. Cannot be used on crafted items.",
      tips: "Best used on hard-to-obtain items like weapons and jewelry. Consider reforging on a different class if smart-loot would give better odds for your target stats.",
    },
    {
      name: "Skill of Nilfur (Convert Set Item)",
      ingredients: ["10x Forgotten Soul", "10x Death's Breath", "1x Set item"],
      effect: "Converts the Set item into another random item from the same set. Does not work on 2-piece sets or crafted sets. The result cannot be Ancient or Primal.",
      tips: "Use this to complete your set when you keep getting duplicates of the same piece. More efficient than waiting for RNG to provide the missing piece.",
    },
    {
      name: "Caldesann's Despair (Augment Ancient Item)",
      ingredients: ["1x Ancient or Primal item", "1x Level 30+ Legendary Gem", "3x Flawless Royal Gems (color determines stat)"],
      effect: "Adds a permanent bonus stat to the item equal to 5x the Legendary Gem's rank. Ruby = Strength, Emerald = Dexterity, Topaz = Intelligence, Amethyst = Vitality. Can be reapplied to upgrade the augment.",
      tips: "The most important endgame progression system. A full set of augments at Gem Rank 100 adds 6,500 main stat — a massive power increase. Augment speedfarming gear first, then upgrade gems for pushing gear.",
    },
    {
      name: "Curiosity of Lorath Nahr (Upgrade to Primal)",
      ingredients: ["1x non-crafted Legendary or Set item", "100x Primordial Ashes"],
      effect: "Upgrades the selected item into a Primal Ancient. Stats are rolled randomly — not based on the original item. The resulting Primal has a pink-red tint and can only be equipped on one character.",
      tips: "Save Primordial Ashes for your most important items (weapon, ring, amulet). The result is random — you may need multiple attempts to get ideal stats.",
    },
    {
      name: "Darkness of Radament (Convert Gems)",
      ingredients: ["9x Gems of the same type and tier", "1x Essence of the target gem color"],
      effect: "Converts gems of one color into gems of another color. Essences are purchased from Squirt the Peddler in the Hidden Camp for 500,000 gold each.",
      tips: "Use this to convert excess gems of one color into the gems you actually need. Stock up on Essences when you have surplus gold.",
    },
  ],
};

export const seasonsGuide = {
  overview:
    "Seasons are time-limited competitive events that reset every 3–4 months. Starting a Seasonal character means beginning fresh from level 1 with no gold, items, or stash from your non-seasonal account. The primary draw is the Season Journey — a structured set of objectives that rewards you with a full 6-piece class set (Haedrig's Gift), cosmetic rewards, and bonus stash tabs.",
  howTheyWork: [
    "Seasons last approximately 3 months and have a defined start and end date.",
    "Seasonal characters start completely fresh — no shared gold, items, or stash with non-seasonal characters.",
    "When a Season ends, all Seasonal characters and their items are converted to non-seasonal characters.",
    "Paragon experience earned in a Season is added to your non-seasonal Paragon pool when the Season ends.",
    "Each Season introduces a unique theme or mechanic that changes how the game plays.",
    "Seasonal Leaderboards track the highest Greater Rift completions for each class.",
  ],
  journeyChapters: [
    { chapter: "Chapter I", rewards: "Cosmetic portrait frame", objectives: "Complete basic tasks: kill enemies, level up, find items" },
    { chapter: "Chapter II", rewards: "Haedrig's Gift (2 set pieces)", objectives: "Complete Act I bounties, reach level 70, kill specific bosses" },
    { chapter: "Chapter III", rewards: "Haedrig's Gift (2 set pieces)", objectives: "Complete a Nephalem Rift, reach Torment IV, upgrade gems" },
    { chapter: "Chapter IV", rewards: "Haedrig's Gift (2 set pieces — completing the 6-piece set)", objectives: "Complete a Greater Rift, reach Torment VI, augment an item" },
    { chapter: "Slayer", rewards: "Cosmetic wings", objectives: "Complete a Set Dungeon, kill Ubers, reach higher Torment levels" },
    { chapter: "Champion", rewards: "Cosmetic pet", objectives: "Master a Set Dungeon, complete a GR 45+, complete 2 Conquests" },
    { chapter: "Destroyer", rewards: "Stash tab", objectives: "Complete 1 Conquest, reach GR 55+, augment multiple items" },
    { chapter: "Conqueror", rewards: "Stash tab", objectives: "Complete 2 Conquests, reach GR 65+, fully augment gear" },
    { chapter: "Guardian", rewards: "Unique pet + portrait frame", objectives: "Complete 3 Conquests, reach GR 75+, achieve leaderboard placement" },
  ],
  fastStartGuide: [
    "Step 1: Complete the Challenge Rift BEFORE starting your seasonal character — it provides a bag of materials and gold.",
    "Step 2: Create your seasonal character and immediately claim the Challenge Rift reward bag.",
    "Step 3: Level the Blacksmith and Jeweler using the materials from the Challenge Rift bag.",
    "Step 4: Gamble Blood Shards at Kadala for your class's most impactful early items.",
    "Step 5: Level to 70 using Normal difficulty story mode or Nephalem Rifts.",
    "Step 6: Complete Season Journey Chapters II, III, and IV to earn all three Haedrig's Gifts.",
    "Step 7: Equip your full 6-piece set and transition to Torment VI for efficient gear farming.",
    "Step 8: Unlock and use Kanai's Cube — extract key Legendary Powers and upgrade Rare items.",
  ],
  conquests: [
    { name: "Sprinter / Speed Racer", description: "Complete the entire campaign in under 1 hour. Best done in a group of 4 with optimized builds." },
    { name: "Boss Mode / Worlds Apart", description: "Kill all bosses in the game within 20 minutes of the first boss kill. Requires teleporting between acts quickly." },
    { name: "On a Good Day / I Can't Stop", description: "Level three Legendary Gems to rank 65. Requires consistent Greater Rift pushing." },
    { name: "Years of War / Dynasty", description: "Reach Greater Rift 55 solo using 6 different class sets. Requires multiple characters." },
    { name: "Masters of the Universe / Masters of Sets", description: "Master 8 different Set Dungeons. Requires knowledge of each set dungeon's specific objectives." },
  ],
};

export const paragonGuide = {
  overview:
    "The Paragon system is the endgame progression system that kicks in after reaching level 70. Every monster kill and quest completion grants Paragon experience. Each Paragon level grants one point to spend across four categories. The system scales to level 20,000 (though practically, most players reach 1,000–5,000 in a season). Paragon is account-wide and shared between all characters of the same game mode.",
  categories: [
    {
      name: "Core",
      description: "The most important category. Movement Speed should be maxed first (25%), then pour all remaining points into your primary stat (Strength, Dexterity, or Intelligence) for infinite scaling.",
      stats: [
        { name: "Movement Speed", max: "25% (50 points)", priority: 1, notes: "Always max this first — movement speed is the most universally valuable stat in the game" },
        { name: "Primary Stat (Str/Dex/Int)", max: "Unlimited", priority: 2, notes: "After Movement Speed cap, dump all points here for infinite damage scaling" },
        { name: "Vitality", max: "Unlimited", priority: 3, notes: "Support builds split between Primary Stat and Vitality at higher Paragon levels" },
        { name: "Maximum Resource", max: "50 points", priority: 4, notes: "Some builds benefit from increased resource cap — check your specific build guide" },
      ],
    },
    {
      name: "Offense",
      description: "All stats in this category are capped at 50 points. Prioritize Critical Hit Damage first, then Critical Hit Chance. Cooldown Reduction is critical for builds that rely on specific cooldowns.",
      stats: [
        { name: "Critical Hit Damage", max: "50% (50 points)", priority: 1, notes: "The highest damage-per-point investment in this category" },
        { name: "Critical Hit Chance", max: "5% (50 points)", priority: 2, notes: "Pairs multiplicatively with Critical Hit Damage" },
        { name: "Attack Speed", max: "10% (50 points)", priority: 3, notes: "Prioritize for builds with Attack Speed breakpoints" },
        { name: "Cooldown Reduction", max: "10% (50 points)", priority: 4, notes: "Critical for builds that require permanent skill uptime (Crusader, Monk)" },
      ],
    },
    {
      name: "Defense",
      description: "All stats capped at 50 points. Distribute evenly for balanced survivability. Life % provides the most effective health increase at higher gear levels.",
      stats: [
        { name: "Armor", max: "50 points", priority: 1, notes: "Provides physical damage reduction" },
        { name: "Life %", max: "50 points", priority: 2, notes: "Scales with your base Life pool — more effective at higher gear levels" },
        { name: "All Resistance", max: "50 points", priority: 3, notes: "Provides elemental damage reduction" },
        { name: "Life Regeneration", max: "50 points", priority: 4, notes: "Generally the least valuable defensive stat — fill last" },
      ],
    },
    {
      name: "Utility",
      description: "All stats capped at 50 points. Area Damage is the most impactful for group play and dense pack situations. Resource Cost Reduction helps sustain skill usage.",
      stats: [
        { name: "Area Damage", max: "50 points", priority: 1, notes: "Extremely powerful in group play and when fighting dense packs — each hit has a 20% chance to deal 50% damage to nearby enemies" },
        { name: "Resource Cost Reduction", max: "50 points", priority: 2, notes: "Reduces the cost of all skills — valuable for resource-hungry builds" },
        { name: "Life on Hit", max: "50 points", priority: 3, notes: "Provides sustain during combat — more valuable for melee builds" },
        { name: "Gold Find", max: "50 points", priority: 4, notes: "Increases gold drops — useful for gold-farming builds with Boon of the Hoarder" },
      ],
    },
  ],
  farmingTips: [
    "Run Greater Rifts at the highest level you can complete in under 3 minutes for maximum Paragon experience per hour.",
    "Use Pools of Reflection (found in Adventure Mode) for a 25% experience bonus — they stack up to 10 times.",
    "Group play provides a 10% experience bonus per additional player (up to 30% at 4 players).",
    "The Enlightened Shrine provides 25% bonus experience for 2 minutes — always activate it when found.",
    "Wear experience-boosting items (Leoric's Crown with Ruby, Cain's Destiny set) while farming Paragon.",
    "At Paragon 800+, all Core points beyond Movement Speed go into Primary Stat — the most efficient allocation.",
  ],
};
