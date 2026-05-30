// Sanctuary Grimoire — Full Skills Data
// Each skill has: unlock level, category, element, runes, and description
// Used by the Skills Loadout builder (level-aware)

export interface SkillRune {
  name: string;
  description: string;
  element?: string;
  unlockLevel: number; // Rune unlock level
}

export interface ClassSkill {
  id: string;
  name: string;
  category: string;       // Primary, Secondary, Defensive, Utility, etc.
  unlockLevel: number;    // Level at which this skill becomes available
  element: string;
  description: string;
  runes: SkillRune[];
  isGenerator?: boolean;  // True for resource generators
  isSpender?: boolean;    // True for resource spenders
}

export interface ClassSkillData {
  classId: string;
  slots: ("LMB" | "RMB" | "1" | "2" | "3" | "4")[];
  categories: string[];
  skills: ClassSkill[];
}

// ─── BARBARIAN ────────────────────────────────────────────────────────────────
const barbarianSkills: ClassSkillData = {
  classId: "barbarian",
  slots: ["LMB", "RMB", "1", "2", "3", "4"],
  categories: ["Primary", "Secondary", "Defensive", "Might", "Tactics", "Rage"],
  skills: [
    // PRIMARY (generators)
    { id: "bash", name: "Bash", category: "Primary", unlockLevel: 1, element: "Physical", isGenerator: true,
      description: "Smash an enemy for 200% weapon damage. Generates 6 Fury.",
      runes: [
        { name: "Clobber", description: "15% chance to stun for 1.5 sec", unlockLevel: 2 },
        { name: "Onslaught", description: "Hits 3 enemies", unlockLevel: 9 },
        { name: "Punish", description: "+30% armor for 5 sec", unlockLevel: 19 },
        { name: "Instigation", description: "Generates 9 Fury", unlockLevel: 29 },
        { name: "Pulverize", description: "Knocks back enemies", unlockLevel: 46 },
      ]},
    { id: "cleave", name: "Cleave", category: "Primary", unlockLevel: 3, element: "Physical", isGenerator: true,
      description: "Swing through all enemies in front of you for 155% weapon damage. Generates 5 Fury.",
      runes: [
        { name: "Rupture", description: "Enemies explode on death for 200% damage", unlockLevel: 5 },
        { name: "Reaping Swing", description: "Generates 6 Fury, heals on kill", unlockLevel: 11 },
        { name: "Broad Sweep", description: "Increased arc, 170% damage", unlockLevel: 22 },
        { name: "Scattering Blast", description: "Knocks enemies away", unlockLevel: 34 },
        { name: "War Cry", description: "Gain 6 Fury per enemy hit", unlockLevel: 49 },
      ]},
    { id: "frenzy", name: "Frenzy", category: "Primary", unlockLevel: 9, element: "Physical", isGenerator: true,
      description: "Attack for 110% weapon damage. Each hit grants a stack increasing attack speed by 15% (max 5). Generates 4 Fury.",
      runes: [
        { name: "Sidearm", description: "Every 3rd hit throws a weapon for 110% damage", unlockLevel: 12 },
        { name: "Vanguard", description: "+15% movement speed per stack", unlockLevel: 20 },
        { name: "Smite", description: "Chance to stun on each hit", unlockLevel: 30 },
        { name: "Berserk", description: "Every 5th hit deals 300% damage", unlockLevel: 42 },
        { name: "Maniac", description: "Each stack also increases damage by 3%", unlockLevel: 55 },
      ]},
    { id: "furious-charge", name: "Furious Charge", category: "Primary", unlockLevel: 14, element: "Physical", isGenerator: true,
      description: "Rush forward, knocking back and dealing 600% weapon damage. 3 charges. Generates 15 Fury.",
      runes: [
        { name: "Battering Ram", description: "Deals 900% damage", unlockLevel: 18 },
        { name: "Merciless Assault", description: "Cooldown reset on kill", unlockLevel: 27 },
        { name: "Stamina", description: "Generates 30 Fury", unlockLevel: 38 },
        { name: "Cold Rush", description: "Freezes enemies hit", unlockLevel: 50 },
        { name: "Dreadnought", description: "Heals 2% max life per enemy hit", unlockLevel: 60 },
      ]},
    // SECONDARY (spenders)
    { id: "hammer-of-ancients", name: "Hammer of the Ancients", category: "Secondary", unlockLevel: 2, element: "Physical", isSpender: true,
      description: "Call down a massive hammer to smash enemies for 510% weapon damage. Costs 20 Fury.",
      runes: [
        { name: "Smash", description: "Deals 660% damage in a larger area", unlockLevel: 4 },
        { name: "Birthright", description: "Chance to spawn health globe", unlockLevel: 14 },
        { name: "Thunderstrike", description: "Deals Lightning damage, chains to nearby", unlockLevel: 25 },
        { name: "Retrograde", description: "Generates 15 Fury instead of spending", unlockLevel: 37 },
        { name: "Burning Rage", description: "Deals Fire damage, ignites ground", unlockLevel: 52 },
      ]},
    { id: "rend", name: "Rend", category: "Secondary", unlockLevel: 4, element: "Physical", isSpender: true,
      description: "Rip open wounds on all enemies within 9 yards, dealing 1000% weapon damage over 5 seconds. Costs 20 Fury.",
      runes: [
        { name: "Ravage", description: "Increases range to 14 yards", unlockLevel: 8 },
        { name: "Blood Lust", description: "Heals 2% max life per second per target", unlockLevel: 16 },
        { name: "Lacerate", description: "Deals 1200% damage", unlockLevel: 28 },
        { name: "Mutilate", description: "Slows enemies by 60%", unlockLevel: 40 },
        { name: "Hemorrhage", description: "Chance to stun on each tick", unlockLevel: 54 },
      ]},
    { id: "whirlwind", name: "Whirlwind", category: "Secondary", unlockLevel: 20, element: "Physical", isSpender: true,
      description: "Become a tornado of steel, dealing 280% weapon damage per second to all nearby enemies. Costs 10 Fury per second.",
      runes: [
        { name: "Blood Funnel", description: "Critical hits heal 1% max life", unlockLevel: 23 },
        { name: "Wind Shear", description: "Generates 2 Fury per enemy hit", unlockLevel: 32 },
        { name: "Hurricane", description: "Slows enemies by 60%", unlockLevel: 43 },
        { name: "Dust Devils", description: "Tornadoes deal 180% weapon damage", unlockLevel: 53 },
        { name: "Volcanic Eruption", description: "Deals Fire damage, leaves burning ground", unlockLevel: 61 },
      ]},
    // DEFENSIVE
    { id: "ground-stomp", name: "Ground Stomp", category: "Defensive", unlockLevel: 5, element: "Physical",
      description: "Stomp the ground, stunning all enemies within 14 yards for 4 seconds. Generates 15 Fury.",
      runes: [
        { name: "Wrenching Smash", description: "Pulls enemies to you before stunning", unlockLevel: 7 },
        { name: "Deafening Crash", description: "Increases stun duration to 5 sec", unlockLevel: 17 },
        { name: "Foot of the Mountain", description: "Generates 30 Fury", unlockLevel: 26 },
        { name: "Trembling Stomp", description: "Enemies are also slowed after stun", unlockLevel: 39 },
        { name: "Jarring Slam", description: "Reduces enemy damage by 25% for 4 sec", unlockLevel: 51 },
      ]},
    { id: "leap", name: "Leap", category: "Defensive", unlockLevel: 6, element: "Physical",
      description: "Leap through the air, landing with a crash that deals 500% weapon damage to all nearby enemies. Generates 15 Fury.",
      runes: [
        { name: "Iron Impact", description: "+300% armor for 4 seconds after landing", unlockLevel: 10 },
        { name: "Launch", description: "Increases range by 50%", unlockLevel: 21 },
        { name: "Death from Above", description: "Deals 800% damage", unlockLevel: 33 },
        { name: "Call of Arreat", description: "Pulls enemies to landing zone", unlockLevel: 45 },
        { name: "Toppling Impact", description: "Knocks enemies away on landing", unlockLevel: 57 },
      ]},
    // MIGHT (shouts)
    { id: "battle-rage", name: "Battle Rage", category: "Might", unlockLevel: 10, element: "Physical",
      description: "Enter a rage that increases damage by 10% and critical hit chance by 3% for 120 seconds. Costs 20 Fury.",
      runes: [
        { name: "Into the Fray", description: "Fury generated on kills", unlockLevel: 13 },
        { name: "Ferocity", description: "+15% damage instead of 10%", unlockLevel: 24 },
        { name: "Swords to Ploughshares", description: "Chance to spawn health globe on kill", unlockLevel: 36 },
        { name: "Marauder's Rage", description: "Increases damage by 20% but reduces armor", unlockLevel: 48 },
        { name: "Bloodshed", description: "Critical hits cause AoE explosion", unlockLevel: 59 },
      ]},
    { id: "war-cry", name: "War Cry", category: "Might", unlockLevel: 15, element: "Physical",
      description: "Unleash a rallying cry, increasing armor by 20% for 120 seconds. Generates 20 Fury.",
      runes: [
        { name: "Hardened Wrath", description: "+40% armor instead of 20%", unlockLevel: 18 },
        { name: "Charge!", description: "Also increases movement speed by 20%", unlockLevel: 28 },
        { name: "Impunity", description: "Also increases All Resistances by 50%", unlockLevel: 40 },
        { name: "Veteran's Warning", description: "Also increases dodge chance by 15%", unlockLevel: 52 },
        { name: "Invigorate", description: "Also regenerates 3% max life per second", unlockLevel: 62 },
      ]},
    // TACTICS
    { id: "threatening-shout", name: "Threatening Shout", category: "Tactics", unlockLevel: 12, element: "Physical",
      description: "Shout with great force, reducing damage done by enemies within 25 yards by 20% for 15 seconds. Generates 15 Fury.",
      runes: [
        { name: "Falter", description: "Also reduces attack speed by 20%", unlockLevel: 15 },
        { name: "Intimidate", description: "Enemies also flee in fear", unlockLevel: 25 },
        { name: "Demoralize", description: "Reduces enemy damage by 30%", unlockLevel: 36 },
        { name: "Grim Harvest", description: "Chance to drop health globe per enemy", unlockLevel: 47 },
        { name: "Taunt", description: "Forces enemies to attack you", unlockLevel: 58 },
      ]},
    { id: "ancient-spear", name: "Ancient Spear", category: "Tactics", unlockLevel: 17, element: "Physical", isSpender: true,
      description: "Throw a spear that deals 400% weapon damage and pulls the enemy to you. Generates 15 Fury.",
      runes: [
        { name: "Ranseur", description: "Hits all enemies in its path", unlockLevel: 20 },
        { name: "Harpoon", description: "Slows pulled enemy by 80%", unlockLevel: 31 },
        { name: "Rage Flip", description: "Throws enemy behind you", unlockLevel: 42 },
        { name: "Boulder Toss", description: "Throws a boulder for 600% damage", unlockLevel: 53 },
        { name: "Jagged Edge", description: "Pulled enemy bleeds for 200% damage", unlockLevel: 63 },
      ]},
    // RAGE (ultimates)
    { id: "earthquake", name: "Earthquake", category: "Rage", unlockLevel: 22, element: "Fire", isSpender: true,
      description: "Shake the ground violently for 8 seconds, dealing 2800% weapon damage to all nearby enemies. Costs 50 Fury.",
      runes: [
        { name: "Cave-In", description: "Pulls enemies to the center of the quake", unlockLevel: 26 },
        { name: "Chilling Earth", description: "Deals Cold damage and slows", unlockLevel: 35 },
        { name: "Giant's Stride", description: "Leaves molten fissures", unlockLevel: 46 },
        { name: "Molten Fury", description: "Deals 3500% damage", unlockLevel: 56 },
        { name: "The Mountain's Call", description: "Reduces cooldown by 3 sec per kill", unlockLevel: 65 },
      ]},
    { id: "wrath-of-the-berserker", name: "Wrath of the Berserker", category: "Rage", unlockLevel: 61, element: "Physical",
      description: "Explode with primal power for 20 seconds, gaining 25% increased attack speed, 50% critical hit chance, 50% dodge, and immunity to crowd control. Costs 50 Fury.",
      runes: [
        { name: "Arreat's Wail", description: "Deals 2000% weapon damage on activation", unlockLevel: 62 },
        { name: "Slaughter", description: "Kills reduce remaining cooldown by 1 sec", unlockLevel: 63 },
        { name: "Striding Giant", description: "+50% damage reduction while active", unlockLevel: 64 },
        { name: "Thrive on Chaos", description: "Fury spent extends duration by 0.5 sec", unlockLevel: 65 },
        { name: "Insanity", description: "+50% damage instead of attack speed bonus", unlockLevel: 66 },
      ]},
    { id: "call-of-the-ancients", name: "Call of the Ancients", category: "Rage", unlockLevel: 50, element: "Physical",
      description: "Call upon the ancient Barbarians to fight alongside you for 20 seconds. Costs 50 Fury.",
      runes: [
        { name: "The Council Rises", description: "Ancients gain additional abilities", unlockLevel: 53 },
        { name: "Ancients' Fury", description: "Ancients generate Fury for you", unlockLevel: 57 },
        { name: "Duty to the Clan", description: "Ancients take damage for you", unlockLevel: 60 },
        { name: "Ancients' Blessing", description: "Ancients heal you on each hit", unlockLevel: 63 },
        { name: "Together as One", description: "All damage shared between you and ancients", unlockLevel: 66 },
      ]},
  ],
};

// ─── WIZARD ───────────────────────────────────────────────────────────────────
const wizardSkills: ClassSkillData = {
  classId: "wizard",
  slots: ["LMB", "RMB", "1", "2", "3", "4"],
  categories: ["Signature", "Offensive", "Utility", "Defensive", "Conjuration", "Mastery"],
  skills: [
    { id: "magic-missile", name: "Magic Missile", category: "Signature", unlockLevel: 1, element: "Arcane", isGenerator: true,
      description: "Launch a missile of magic energy, dealing 230% weapon damage as Arcane.",
      runes: [
        { name: "Charged Blast", description: "Deals 330% damage", unlockLevel: 2 },
        { name: "Glacial Spike", description: "Deals Cold damage, chance to freeze", unlockLevel: 9 },
        { name: "Conflagrate", description: "Deals Fire damage, ignites enemies", unlockLevel: 19 },
        { name: "Seeker", description: "Homes in on nearest enemy", unlockLevel: 29 },
        { name: "Split", description: "Splits into 3 missiles", unlockLevel: 46 },
      ]},
    { id: "shock-pulse", name: "Shock Pulse", category: "Signature", unlockLevel: 3, element: "Lightning", isGenerator: true,
      description: "Fire three bolts of lightning that deal 105% weapon damage each.",
      runes: [
        { name: "Fire Bolts", description: "Deals Fire damage instead", unlockLevel: 5 },
        { name: "Explosive Bolts", description: "Bolts explode on impact", unlockLevel: 14 },
        { name: "Living Lightning", description: "Creates a living lightning creature", unlockLevel: 25 },
        { name: "Piercing Orb", description: "Merges into a single piercing orb", unlockLevel: 37 },
        { name: "Power Affinity", description: "Restores 4 Arcane Power per bolt", unlockLevel: 52 },
      ]},
    { id: "spectral-blade", name: "Spectral Blade", category: "Signature", unlockLevel: 6, element: "Arcane", isGenerator: true,
      description: "Summon a spectral blade that strikes all enemies in front of you for 168% weapon damage.",
      runes: [
        { name: "Siphoning Blade", description: "Restores 3 Arcane Power per enemy hit", unlockLevel: 8 },
        { name: "Flame Blades", description: "Deals Fire damage, +10% Fire damage for 5 sec", unlockLevel: 18 },
        { name: "Thrown Blade", description: "Throws the blade forward", unlockLevel: 28 },
        { name: "Barrier Blades", description: "+3% damage reduction per enemy hit", unlockLevel: 41 },
        { name: "Ice Blades", description: "Deals Cold damage, chance to freeze", unlockLevel: 54 },
      ]},
    { id: "arcane-torrent", name: "Arcane Torrent", category: "Offensive", unlockLevel: 12, element: "Arcane", isSpender: true,
      description: "Hurl bolts of pure energy dealing 600% weapon damage as Arcane. Costs 16 Arcane Power per second.",
      runes: [
        { name: "Static Discharge", description: "Bolts also deal Lightning damage", unlockLevel: 15 },
        { name: "Flame Ward", description: "Reduces damage taken by 15% while channeling", unlockLevel: 24 },
        { name: "Death Blossom", description: "Fires in all directions", unlockLevel: 35 },
        { name: "Cascade", description: "Kills create a new bolt", unlockLevel: 47 },
        { name: "Power Stone", description: "Chance to spawn Arcane Power orb", unlockLevel: 59 },
      ]},
    { id: "disintegrate", name: "Disintegrate", category: "Offensive", unlockLevel: 18, element: "Arcane", isSpender: true,
      description: "Channel a beam of pure energy dealing 555% weapon damage as Arcane. Costs 18 Arcane Power per second.",
      runes: [
        { name: "Chaos Nexus", description: "Beam splits into 3 beams", unlockLevel: 21 },
        { name: "Convergence", description: "Beam pulls enemies toward it", unlockLevel: 31 },
        { name: "Volatility", description: "Enemies explode on death", unlockLevel: 43 },
        { name: "Intensify", description: "Damage increases the longer you channel", unlockLevel: 55 },
        { name: "Entropy", description: "Deals random elemental damage", unlockLevel: 64 },
      ]},
    { id: "hydra", name: "Hydra", category: "Conjuration", unlockLevel: 21, element: "Fire", isSpender: true,
      description: "Summon a multi-headed Hydra for 15 seconds that attacks enemies with bolts of fire. Costs 15 Arcane Power.",
      runes: [
        { name: "Arcane Hydra", description: "Deals Arcane damage, slows enemies", unlockLevel: 24 },
        { name: "Lightning Hydra", description: "Deals Lightning damage, chains between enemies", unlockLevel: 33 },
        { name: "Frost Hydra", description: "Deals Cold damage, chance to freeze", unlockLevel: 44 },
        { name: "Mammoth Hydra", description: "Single head, massive cone of fire", unlockLevel: 55 },
        { name: "Venom Hydra", description: "Deals Poison damage over time", unlockLevel: 64 },
      ]},
    { id: "mirror-image", name: "Mirror Image", category: "Utility", unlockLevel: 25, element: "Arcane",
      description: "Create 2 mirror images that mimic your attacks and draw enemy attention. Lasts 7 seconds.",
      runes: [
        { name: "Duplicates", description: "Summons 4 images instead of 2", unlockLevel: 28 },
        { name: "Simulacrum", description: "Images deal 35% of your damage", unlockLevel: 38 },
        { name: "Mocking Demise", description: "Images explode on death for 250% damage", unlockLevel: 49 },
        { name: "Extension of Will", description: "Duration increased to 12 seconds", unlockLevel: 60 },
        { name: "Mirror Mimics", description: "Images also cast your active skills", unlockLevel: 67 },
      ]},
    { id: "teleport", name: "Teleport", category: "Defensive", unlockLevel: 9, element: "Arcane",
      description: "Teleport through the ether to the selected location.",
      runes: [
        { name: "Wormhole", description: "Can teleport again within 1 second", unlockLevel: 12 },
        { name: "Fracture", description: "Leave behind a mirror image", unlockLevel: 22 },
        { name: "Safe Passage", description: "Reduce damage taken by 25% for 5 seconds after", unlockLevel: 33 },
        { name: "Reversal", description: "Teleport back to original location after 2 sec", unlockLevel: 45 },
        { name: "Calamity", description: "Enemies at destination are stunned for 1 sec", unlockLevel: 57 },
      ]},
    { id: "black-hole", name: "Black Hole", category: "Utility", unlockLevel: 34, element: "Arcane", isSpender: true,
      description: "Conjure a Black Hole that pulls in enemies and deals 1560% weapon damage over 2 seconds. Costs 20 Arcane Power.",
      runes: [
        { name: "Supermassive", description: "Increased pull radius and damage", unlockLevel: 37 },
        { name: "Absolute Zero", description: "Deals Cold damage and freezes", unlockLevel: 46 },
        { name: "Event Horizon", description: "Absorbs enemy projectiles", unlockLevel: 56 },
        { name: "Spellsteal", description: "Grants a random buff per enemy hit", unlockLevel: 63 },
        { name: "Blazar", description: "Deals Fire damage and burns the area", unlockLevel: 68 },
      ]},
    { id: "slow-time", name: "Slow Time", category: "Mastery", unlockLevel: 16, element: "Arcane",
      description: "Invoke a bubble of warped time for 15 seconds, slowing enemies and projectiles by 80%.",
      runes: [
        { name: "Time Shell", description: "Enemies inside take 15% more damage", unlockLevel: 19 },
        { name: "Exhaustion", description: "Enemies inside deal 25% less damage", unlockLevel: 29 },
        { name: "Stretch Time", description: "Increases attack speed of allies inside", unlockLevel: 41 },
        { name: "Perpetuity", description: "Cooldown reduced by 1 sec per enemy hit", unlockLevel: 53 },
        { name: "Point of No Return", description: "Enemies that leave the bubble are frozen", unlockLevel: 63 },
      ]},
  ],
};

// ─── DEMON HUNTER ────────────────────────────────────────────────────────────
const demonHunterSkills: ClassSkillData = {
  classId: "demon-hunter",
  slots: ["LMB", "RMB", "1", "2", "3", "4"],
  categories: ["Primary", "Secondary", "Defensive", "Hunting", "Devices", "Archery"],
  skills: [
    { id: "hungering-arrow", name: "Hungering Arrow", category: "Primary", unlockLevel: 1, element: "Physical", isGenerator: true,
      description: "Fire a magically imbued arrow that seeks enemies and deals 175% weapon damage. Generates 3 Hatred.",
      runes: [
        { name: "Puncturing Arrow", description: "Chance to pierce through enemies", unlockLevel: 2 },
        { name: "Serrated Arrow", description: "Bleeds for 100% damage over 3 sec", unlockLevel: 9 },
        { name: "Shatter Shot", description: "Splits into 3 arrows on impact", unlockLevel: 19 },
        { name: "Devouring Arrow", description: "Each pierce increases damage by 70%", unlockLevel: 29 },
        { name: "Spray of Teeth", description: "Critical hits spray bone shards", unlockLevel: 46 },
      ]},
    { id: "entangling-shot", name: "Entangling Shot", category: "Primary", unlockLevel: 3, element: "Physical", isGenerator: true,
      description: "Fire a shot that deals 155% weapon damage and chains to nearby enemies, slowing them by 60%. Generates 3 Hatred.",
      runes: [
        { name: "Chain Gang", description: "Chains to 4 enemies instead of 2", unlockLevel: 5 },
        { name: "Heavy Burden", description: "Slows by 80%", unlockLevel: 14 },
        { name: "Shock Collar", description: "Deals Lightning damage", unlockLevel: 25 },
        { name: "Justice is Served", description: "Generates 4 Hatred", unlockLevel: 37 },
        { name: "Bounty Hunter", description: "Generates 8 Hatred per enemy hit", unlockLevel: 52 },
      ]},
    { id: "strafe", name: "Strafe", category: "Secondary", unlockLevel: 20, element: "Physical", isSpender: true,
      description: "Rapidly fire at random nearby enemies while moving, dealing 228% weapon damage. Costs 14 Hatred per second.",
      runes: [
        { name: "Drifting Shadow", description: "+30% movement speed while strafing", unlockLevel: 23 },
        { name: "Rocket Storm", description: "Fires rockets for additional 60% damage", unlockLevel: 32 },
        { name: "Demolition", description: "Drops grenades while strafing", unlockLevel: 43 },
        { name: "Icy Trail", description: "Leaves a trail of ice that slows enemies", unlockLevel: 53 },
        { name: "Spray of Teeth", description: "Critical hits spray bone shards", unlockLevel: 61 },
      ]},
    { id: "multishot", name: "Multishot", category: "Secondary", unlockLevel: 22, element: "Physical", isSpender: true,
      description: "Fire a massive volley of arrows dealing 390% weapon damage to all enemies in front of you. Costs 30 Hatred.",
      runes: [
        { name: "Fire at Will", description: "Reduces cost to 20 Hatred", unlockLevel: 25 },
        { name: "Burst Fire", description: "Fires 3 bursts in a cone", unlockLevel: 34 },
        { name: "Suppression Fire", description: "Slows enemies by 60%", unlockLevel: 45 },
        { name: "Wind Chill", description: "Deals Cold damage, chance to freeze", unlockLevel: 56 },
        { name: "Arsenal", description: "Also fires rockets and grenades", unlockLevel: 65 },
      ]},
    { id: "smoke-screen", name: "Smoke Screen", category: "Defensive", unlockLevel: 8, element: "Physical",
      description: "Vanish in a cloud of smoke, becoming invisible for 1 second. Costs 14 Discipline.",
      runes: [
        { name: "Lingering Fog", description: "Duration increased to 2 seconds", unlockLevel: 11 },
        { name: "Displacement", description: "Teleport a short distance", unlockLevel: 21 },
        { name: "Healing Vapors", description: "Heals 15% max life while invisible", unlockLevel: 32 },
        { name: "Special Recipe", description: "Reduces cost to 10 Discipline", unlockLevel: 44 },
        { name: "Choking Gas", description: "Leaves a gas cloud that poisons enemies", unlockLevel: 56 },
      ]},
    { id: "vault", name: "Vault", category: "Defensive", unlockLevel: 10, element: "Physical",
      description: "Tumble acrobatically through the air, avoiding attacks. Costs 8 Discipline.",
      runes: [
        { name: "Tumble", description: "Reduces cost on consecutive uses", unlockLevel: 13 },
        { name: "Action Shot", description: "Fire an arrow while vaulting", unlockLevel: 23 },
        { name: "Rattling Roll", description: "Stuns enemies you pass through", unlockLevel: 34 },
        { name: "Acrobatics", description: "Reduces cost to 4 Discipline", unlockLevel: 46 },
        { name: "Trail of Cinders", description: "Leaves a trail of fire", unlockLevel: 58 },
      ]},
    { id: "companion", name: "Companion", category: "Hunting", unlockLevel: 17, element: "Physical",
      description: "Summon a raven companion that assists in battle.",
      runes: [
        { name: "Bat Companion", description: "Bat generates 3 Hatred per second", unlockLevel: 20 },
        { name: "Boar Companion", description: "Boar taunts enemies and provides armor", unlockLevel: 30 },
        { name: "Ferret Companion", description: "Ferrets collect gold and increase pickup radius", unlockLevel: 41 },
        { name: "Spider Companion", description: "Spider webs slow enemies", unlockLevel: 52 },
        { name: "Wolf Companion", description: "Wolf howls, increasing damage by 30% for 10 sec", unlockLevel: 62 },
      ]},
    { id: "vengeance", name: "Vengeance", category: "Archery", unlockLevel: 61, element: "Cold",
      description: "Take on the form of the Prime Evil for 20 seconds, gaining additional attacks and immunity to crowd control.",
      runes: [
        { name: "Personal Mortar", description: "Also lobs grenades at enemies", unlockLevel: 62 },
        { name: "Dark Heart", description: "Reduces damage taken by 50%", unlockLevel: 63 },
        { name: "Seethe", description: "Generates 40 Hatred per second", unlockLevel: 64 },
        { name: "From the Shadows", description: "Nearby enemies are stunned for 2 sec on activation", unlockLevel: 65 },
        { name: "Side Cannons", description: "Fires additional rockets from the sides", unlockLevel: 66 },
      ]},
    { id: "preparation", name: "Preparation", category: "Devices", unlockLevel: 12, element: "Physical",
      description: "Instantly restore all Discipline. Cooldown 45 seconds.",
      runes: [
        { name: "Battle Scars", description: "Also restores 40% max life", unlockLevel: 15 },
        { name: "Punishment", description: "Spends 75 Hatred to restore all Discipline", unlockLevel: 26 },
        { name: "Focused Mind", description: "Restores 45 Discipline over 15 seconds", unlockLevel: 38 },
        { name: "Invigoration", description: "Increases max Discipline by 10 for 5 min", unlockLevel: 50 },
        { name: "Backup Plan", description: "30% chance to not trigger cooldown", unlockLevel: 61 },
      ]},
  ],
};

// ─── MONK ─────────────────────────────────────────────────────────────────────
const monkSkills: ClassSkillData = {
  classId: "monk",
  slots: ["LMB", "RMB", "1", "2", "3", "4"],
  categories: ["Primary", "Secondary", "Defensive", "Techniques", "Focus", "Mantras"],
  skills: [
    { id: "fists-of-thunder", name: "Fists of Thunder", category: "Primary", unlockLevel: 1, element: "Lightning", isGenerator: true,
      description: "Teleport to your target and unleash a rapid succession of punches for 130% weapon damage. Generates 6 Spirit.",
      runes: [
        { name: "Thunderclap", description: "Creates a shockwave on third hit", unlockLevel: 2 },
        { name: "Static Charge", description: "Builds static charge, releases on third hit", unlockLevel: 9 },
        { name: "Quickening", description: "Generates 9 Spirit on third hit", unlockLevel: 19 },
        { name: "Bounding Light", description: "Third hit chains to 3 nearby enemies", unlockLevel: 29 },
        { name: "Wind Blast", description: "Third hit knocks back enemies", unlockLevel: 46 },
      ]},
    { id: "deadly-reach", name: "Deadly Reach", category: "Primary", unlockLevel: 4, element: "Physical", isGenerator: true,
      description: "Project lines of pure force to deal 110% weapon damage to all enemies in front of you. Generates 6 Spirit.",
      runes: [
        { name: "Foresight", description: "+30% armor for 3 seconds on third hit", unlockLevel: 6 },
        { name: "Scattered Blows", description: "Third hit hits all enemies in front", unlockLevel: 16 },
        { name: "Strike from Beyond", description: "Increased range", unlockLevel: 27 },
        { name: "Piercing Trident", description: "Third hit pierces through enemies", unlockLevel: 39 },
        { name: "Keen Eye", description: "Third hit reduces enemy armor by 20%", unlockLevel: 52 },
      ]},
    { id: "tempest-rush", name: "Tempest Rush", category: "Secondary", unlockLevel: 22, element: "Physical", isSpender: true,
      description: "Charge through enemies, dealing 390% weapon damage. Costs 30 Spirit initially, 10 per second.",
      runes: [
        { name: "Northern Breeze", description: "Reduces cost to 20 Spirit", unlockLevel: 25 },
        { name: "Flurry", description: "Leaves a damaging tornado on each enemy", unlockLevel: 34 },
        { name: "Tailwind", description: "+25% movement speed", unlockLevel: 45 },
        { name: "Electric Field", description: "Deals Lightning damage", unlockLevel: 56 },
        { name: "Bluster", description: "Knocks enemies away", unlockLevel: 65 },
      ]},
    { id: "wave-of-light", name: "Wave of Light", category: "Secondary", unlockLevel: 28, element: "Holy", isSpender: true,
      description: "Focus a wave of light that crushes enemies for 930% weapon damage as Holy. Costs 75 Spirit.",
      runes: [
        { name: "Pillar of the Ancients", description: "Summons a pillar that deals 1100% damage", unlockLevel: 31 },
        { name: "Explosive Light", description: "Explosion deals 1200% damage in a larger area", unlockLevel: 40 },
        { name: "Wall of Light", description: "Creates a wall that knocks back enemies", unlockLevel: 51 },
        { name: "Empowered Wave", description: "Reduces cost to 40 Spirit", unlockLevel: 61 },
        { name: "Shattering Light", description: "Reduces enemy armor by 20% for 4 sec", unlockLevel: 67 },
      ]},
    { id: "dashing-strike", name: "Dashing Strike", category: "Techniques", unlockLevel: 9, element: "Physical",
      description: "Quickly dash to a target, dealing 390% weapon damage. 2 charges.",
      runes: [
        { name: "Blinding Speed", description: "+40% dodge chance for 1 second after", unlockLevel: 12 },
        { name: "Barrage", description: "Deals 530% damage", unlockLevel: 22 },
        { name: "Quicksilver", description: "+60% movement speed for 3 seconds", unlockLevel: 33 },
        { name: "Way of the Falling Star", description: "Leaves a trail of fire", unlockLevel: 45 },
        { name: "Radiance", description: "Restores 8 Spirit per enemy hit", unlockLevel: 57 },
      ]},
    { id: "sweeping-wind", name: "Sweeping Wind", category: "Focus", unlockLevel: 17, element: "Physical", isSpender: true,
      description: "Surround yourself with a vortex that deals 120% weapon damage per second. Stacks up to 3 times. Costs 75 Spirit.",
      runes: [
        { name: "Master of Wind", description: "Increases damage per stack to 200%", unlockLevel: 20 },
        { name: "Blade Storm", description: "Deals 160% damage, knocks back on max stacks", unlockLevel: 30 },
        { name: "Inner Storm", description: "Generates 4 Spirit per second at max stacks", unlockLevel: 41 },
        { name: "Cyclone", description: "Creates a tornado that moves toward enemies", unlockLevel: 52 },
        { name: "Fire Storm", description: "Deals Fire damage", unlockLevel: 62 },
      ]},
    { id: "cyclone-strike", name: "Cyclone Strike", category: "Focus", unlockLevel: 20, element: "Holy", isSpender: true,
      description: "Create a vortex that pulls enemies within 24 yards toward you and deals 615% weapon damage. Costs 50 Spirit.",
      runes: [
        { name: "Eye of the Storm", description: "Reduces damage taken by 20% for 3 sec", unlockLevel: 23 },
        { name: "Implosion", description: "Pulls enemies from 34 yards", unlockLevel: 32 },
        { name: "Wall of Wind", description: "Knocks enemies away after pulling", unlockLevel: 43 },
        { name: "Sunburst", description: "Deals Fire damage in a burst after pulling", unlockLevel: 54 },
        { name: "Soothing Breeze", description: "Heals 3% max life per enemy hit", unlockLevel: 64 },
      ]},
    { id: "epiphany", name: "Epiphany", category: "Defensive", unlockLevel: 61, element: "Fire",
      description: "Enter a state of heightened focus for 15 seconds. Melee attacks instantly teleport you to enemies. Reduces damage taken by 50%.",
      runes: [
        { name: "Desert Shroud", description: "Also reduces damage taken by 50%", unlockLevel: 62 },
        { name: "Soothing Mist", description: "Heals 5% max life per second", unlockLevel: 63 },
        { name: "Inner Fire", description: "Deals Fire damage on each teleport", unlockLevel: 64 },
        { name: "Ascendance", description: "Spirit regeneration increased by 50%", unlockLevel: 65 },
        { name: "Insight", description: "Reduces all cooldowns by 2 sec per enemy hit", unlockLevel: 66 },
      ]},
    { id: "mantra-of-salvation", name: "Mantra of Salvation", category: "Mantras", unlockLevel: 19, element: "Holy",
      description: "Activate a mantra that increases resistances by 20% for you and nearby allies. Empowered for 3 seconds.",
      runes: [
        { name: "Agility", description: "+20% dodge chance passively", unlockLevel: 22 },
        { name: "Hard Target", description: "+20% armor passively", unlockLevel: 31 },
        { name: "Divine Protection", description: "Empowered: immune to all damage for 2 sec", unlockLevel: 43 },
        { name: "Wind Through the Reeds", description: "+15% movement speed passively", unlockLevel: 54 },
        { name: "Perseverance", description: "Reduces duration of control effects by 50%", unlockLevel: 64 },
      ]},
  ],
};

// ─── NECROMANCER ──────────────────────────────────────────────────────────────
const necromancerSkills: ClassSkillData = {
  classId: "necromancer",
  slots: ["LMB", "RMB", "1", "2", "3", "4"],
  categories: ["Primary", "Secondary", "Blood & Bone", "Reanimation", "Curses", "Corpses"],
  skills: [
    { id: "grim-scythe", name: "Grim Scythe", category: "Primary", unlockLevel: 1, element: "Physical", isGenerator: true,
      description: "Swing a spectral scythe in a wide arc, dealing 200% weapon damage to all enemies hit. Generates 8 Essence per enemy hit.",
      runes: [
        { name: "Cursed Scythe", description: "15% chance to apply a random curse", unlockLevel: 2 },
        { name: "Frost Scythe", description: "Deals Cold damage, chance to freeze", unlockLevel: 9 },
        { name: "Dual Scythes", description: "Throws two scythes", unlockLevel: 19 },
        { name: "Blood Scythe", description: "Heals 1% max life per enemy hit", unlockLevel: 29 },
        { name: "Trag'Oul's Corroded Fang", description: "Cursed enemies take 200% more damage", unlockLevel: 46 },
      ]},
    { id: "bone-spear", name: "Bone Spear", category: "Secondary", unlockLevel: 4, element: "Physical", isSpender: true,
      description: "Conjure a spear of bone that pierces through all enemies it hits for 1000% weapon damage. Costs 20 Essence.",
      runes: [
        { name: "Teeth", description: "Fires multiple shards instead of a spear", unlockLevel: 6 },
        { name: "Crystallization", description: "Deals Cold damage, chance to freeze", unlockLevel: 16 },
        { name: "Shatter", description: "Explodes on impact for AoE damage", unlockLevel: 27 },
        { name: "Blighted Marrow", description: "Poisons enemies for 3000% damage over 3 sec", unlockLevel: 39 },
        { name: "Blood Spear", description: "Costs health instead of Essence, deals more damage", unlockLevel: 52 },
      ]},
    { id: "corpse-explosion", name: "Corpse Explosion", category: "Corpses", unlockLevel: 12, element: "Physical",
      description: "Detonate a nearby corpse, dealing 1050% weapon damage to all enemies within 11 yards. Costs 1 corpse.",
      runes: [
        { name: "Bloody Mess", description: "Increased explosion radius", unlockLevel: 15 },
        { name: "Close to the Bone", description: "Reduces cost to 0", unlockLevel: 25 },
        { name: "Shrapnel", description: "Fires bone shards in all directions", unlockLevel: 36 },
        { name: "Necrotic Breath", description: "Deals Poison damage in a cone", unlockLevel: 47 },
        { name: "Dead Cold", description: "Deals Cold damage, freezes enemies", unlockLevel: 58 },
      ]},
    { id: "bone-armor", name: "Bone Armor", category: "Blood & Bone", unlockLevel: 8, element: "Physical",
      description: "Conjure armor from the bones of nearby enemies, gaining a shield and dealing 450% damage to nearby enemies.",
      runes: [
        { name: "Dislocation", description: "Stuns nearby enemies for 2 seconds", unlockLevel: 11 },
        { name: "Harvest of Anguish", description: "Pulls enemies toward you", unlockLevel: 21 },
        { name: "Thy Flesh Sustained", description: "Heals 2% max life per enemy hit", unlockLevel: 32 },
        { name: "Reap of Anguish", description: "Increases movement speed by 50%", unlockLevel: 44 },
        { name: "Armor of Akkhan", description: "Reduces cooldown of other skills", unlockLevel: 56 },
      ]},
    { id: "blood-rush", name: "Blood Rush", category: "Blood & Bone", unlockLevel: 10, element: "Physical",
      description: "Shed your mortal flesh and teleport to a nearby location. Costs 10% max life.",
      runes: [
        { name: "Metabolism", description: "Reduces life cost to 5%", unlockLevel: 13 },
        { name: "Potency", description: "+100% armor for 2 seconds after teleporting", unlockLevel: 23 },
        { name: "Transfusion", description: "Heals 3% max life per enemy passed through", unlockLevel: 34 },
        { name: "Molting", description: "Leaves a corpse at original location", unlockLevel: 46 },
        { name: "Hemostasis", description: "No life cost for 3 seconds after use", unlockLevel: 58 },
      ]},
    { id: "land-of-the-dead", name: "Land of the Dead", category: "Reanimation", unlockLevel: 61, element: "Physical",
      description: "Raise a massive army for 5 seconds, enabling unlimited use of Corpse skills. Cooldown 120 seconds.",
      runes: [
        { name: "Frozen Lands", description: "Freezes all enemies in the area", unlockLevel: 62 },
        { name: "Plaguelands", description: "Poisons all enemies in the area", unlockLevel: 63 },
        { name: "Shallow Graves", description: "Reduces cooldown to 90 seconds", unlockLevel: 64 },
        { name: "Invigoration", description: "Restores 100 Essence on activation", unlockLevel: 65 },
        { name: "Dead Land", description: "Enemies in the area deal 25% less damage", unlockLevel: 66 },
      ]},
    { id: "frailty", name: "Frailty", category: "Curses", unlockLevel: 14, element: "Physical",
      description: "Curse all enemies in an area. Cursed enemies die when below 15% health. Costs 20 Essence.",
      runes: [
        { name: "Aura of Frailty", description: "Becomes a persistent aura", unlockLevel: 17 },
        { name: "Scent of Blood", description: "Increases death threshold to 30%", unlockLevel: 27 },
        { name: "Early Grave", description: "Increases death threshold to 25%", unlockLevel: 38 },
        { name: "Harvest Essence", description: "Restores 10 Essence when a cursed enemy dies", unlockLevel: 49 },
        { name: "Volatile Death", description: "Cursed enemies explode on death", unlockLevel: 60 },
      ]},
  ],
};

// ─── WITCH DOCTOR ─────────────────────────────────────────────────────────────
const witchDoctorSkills: ClassSkillData = {
  classId: "witch-doctor",
  slots: ["LMB", "RMB", "1", "2", "3", "4"],
  categories: ["Primary", "Secondary", "Defensive", "Terror", "Decay", "Voodoo"],
  skills: [
    { id: "poison-dart", name: "Poison Dart", category: "Primary", unlockLevel: 1, element: "Poison", isGenerator: true,
      description: "Shoot a poison dart that deals 175% weapon damage as Poison.",
      runes: [
        { name: "Splinters", description: "Fires 3 darts at once", unlockLevel: 2 },
        { name: "Numbing Dart", description: "Slows enemy by 60% for 4 sec", unlockLevel: 9 },
        { name: "Spined Dart", description: "Generates 2 Mana per enemy hit", unlockLevel: 19 },
        { name: "Flaming Dart", description: "Deals Fire damage", unlockLevel: 29 },
        { name: "Snake to the Face", description: "Stuns enemy for 1 second", unlockLevel: 46 },
      ]},
    { id: "haunt", name: "Haunt", category: "Secondary", unlockLevel: 12, element: "Cold", isSpender: true,
      description: "Haunt an enemy with a spirit, dealing 4000% weapon damage over 12 seconds. Costs 50 Mana.",
      runes: [
        { name: "Resentful Spirits", description: "Spirit jumps to new enemies automatically", unlockLevel: 15 },
        { name: "Consuming Spirit", description: "Heals 1% max life per second per haunt", unlockLevel: 25 },
        { name: "Draining Spirit", description: "Restores 100 Mana per second per haunt", unlockLevel: 36 },
        { name: "Poisoned Spirit", description: "Deals Poison damage", unlockLevel: 47 },
        { name: "Lingering Spirit", description: "Duration increased to 20 seconds", unlockLevel: 58 },
      ]},
    { id: "locust-swarm", name: "Locust Swarm", category: "Decay", unlockLevel: 17, element: "Poison", isSpender: true,
      description: "Unleash a plague of locusts that swarms enemies, dealing 3000% weapon damage over 8 seconds. Costs 100 Mana.",
      runes: [
        { name: "Pestilence", description: "Swarm spreads to nearby enemies automatically", unlockLevel: 20 },
        { name: "Searing Locusts", description: "Deals Fire damage", unlockLevel: 30 },
        { name: "Cloud of Insects", description: "Reduces enemy attack speed by 25%", unlockLevel: 41 },
        { name: "Devouring Swarm", description: "Restores 3% max life per enemy hit", unlockLevel: 52 },
        { name: "Diseased Swarm", description: "Slows enemies by 80%", unlockLevel: 62 },
      ]},
    { id: "soul-harvest", name: "Soul Harvest", category: "Voodoo", unlockLevel: 9, element: "Physical",
      description: "Harvest the souls of up to 5 nearby enemies, gaining 130% of their combined damage as a bonus for 30 seconds.",
      runes: [
        { name: "Swallow Your Soul", description: "Also restores 400 Mana per soul harvested", unlockLevel: 12 },
        { name: "Siphon", description: "Heals 10% max life per soul harvested", unlockLevel: 22 },
        { name: "Soul to Waste", description: "Also increases movement speed by 20%", unlockLevel: 33 },
        { name: "Languish", description: "Slows enemies by 80% for 3 seconds", unlockLevel: 45 },
        { name: "Vengeful Spirit", description: "Deals 2000% damage to harvested enemies", unlockLevel: 57 },
      ]},
    { id: "spirit-walk", name: "Spirit Walk", category: "Defensive", unlockLevel: 7, element: "Physical",
      description: "Leave your physical body and enter the spirit realm for 2 seconds, becoming immune to all damage.",
      runes: [
        { name: "Jaunt", description: "Duration increased to 3 seconds", unlockLevel: 10 },
        { name: "Healing Journey", description: "Heals 15% max life per second while in spirit form", unlockLevel: 20 },
        { name: "Severance", description: "Increases movement speed by 100%", unlockLevel: 31 },
        { name: "Umbral Shock", description: "Deals 2000% damage to nearby enemies on return", unlockLevel: 43 },
        { name: "honored guest", description: "Restores 300 Mana on return", unlockLevel: 55 },
      ]},
    { id: "piranhas", name: "Piranhas", category: "Terror", unlockLevel: 22, element: "Poison", isSpender: true,
      description: "Summon a pool of piranhas that deals 1750% weapon damage over 8 seconds. Enemies take 15% more damage. Costs 150 Mana.",
      runes: [
        { name: "Piranhado", description: "Pulls all nearby enemies into the pool", unlockLevel: 25 },
        { name: "Frozen Piranhas", description: "Deals Cold damage and freezes enemies", unlockLevel: 34 },
        { name: "Bogadile", description: "Summons a massive piranha that bites enemies", unlockLevel: 45 },
        { name: "Savage Feast", description: "Heals 1% max life per enemy in the pool", unlockLevel: 56 },
        { name: "Wave of Mutilation", description: "Piranhas jump out and attack nearby enemies", unlockLevel: 65 },
      ]},
    { id: "hex", name: "Hex", category: "Terror", unlockLevel: 14, element: "Physical",
      description: "Summon a Fetish Shaman that hexes a nearby enemy, turning it into a chicken for 12 seconds.",
      runes: [
        { name: "Angry Chicken", description: "You transform into an exploding chicken", unlockLevel: 17 },
        { name: "Hedge Magic", description: "Shaman also heals nearby allies", unlockLevel: 27 },
        { name: "Jinx", description: "Hexed enemies take 20% more damage", unlockLevel: 38 },
        { name: "Unstable Form", description: "Hexed enemies explode when they die", unlockLevel: 49 },
        { name: "Mass Confusion", description: "Hexes all enemies in the area", unlockLevel: 60 },
      ]},
  ],
};

// ─── CRUSADER ─────────────────────────────────────────────────────────────────
const crusaderSkills: ClassSkillData = {
  classId: "crusader",
  slots: ["LMB", "RMB", "1", "2", "3", "4"],
  categories: ["Primary", "Secondary", "Defensive", "Utility", "Conviction", "Laws"],
  skills: [
    { id: "punish", name: "Punish", category: "Primary", unlockLevel: 1, element: "Holy", isGenerator: true,
      description: "Strike an enemy for 210% weapon damage and gain a shield that absorbs damage. Generates 5 Wrath.",
      runes: [
        { name: "Roar", description: "Deals 260% damage", unlockLevel: 2 },
        { name: "Celerity", description: "+15% attack speed for 3 seconds", unlockLevel: 9 },
        { name: "Retaliate", description: "Fires a projectile back at attackers", unlockLevel: 19 },
        { name: "Rebirth", description: "Heals 0.5% max life per hit", unlockLevel: 29 },
        { name: "Fury", description: "Generates 10 Wrath", unlockLevel: 46 },
      ]},
    { id: "slash", name: "Slash", category: "Primary", unlockLevel: 5, element: "Holy", isGenerator: true,
      description: "Slash enemies in front of you for 180% weapon damage. Generates 5 Wrath.",
      runes: [
        { name: "Electrify", description: "Deals Lightning damage, chains to 3 enemies", unlockLevel: 7 },
        { name: "Carve", description: "Increases arc to 180 degrees", unlockLevel: 17 },
        { name: "Crush", description: "Generates 10 Wrath", unlockLevel: 28 },
        { name: "Zeal", description: "+10% movement speed for 3 seconds", unlockLevel: 40 },
        { name: "Guard", description: "+20% block chance for 2 seconds", unlockLevel: 53 },
      ]},
    { id: "fist-of-the-heavens", name: "Fist of the Heavens", category: "Secondary", unlockLevel: 14, element: "Lightning", isSpender: true,
      description: "Call down a bolt of lightning that blasts a target for 600% weapon damage as Lightning. Costs 30 Wrath.",
      runes: [
        { name: "Divine Well", description: "Chains to 6 nearby enemies", unlockLevel: 17 },
        { name: "Heaven's Tempest", description: "Creates a storm that deals damage over 3 sec", unlockLevel: 27 },
        { name: "Reverberation", description: "Slows enemies by 80% for 3 seconds", unlockLevel: 38 },
        { name: "Fissure", description: "Creates a fissure that deals damage over 6 sec", unlockLevel: 49 },
        { name: "Retribution", description: "Deals Holy damage, blinds enemies", unlockLevel: 60 },
      ]},
    { id: "heavens-fury", name: "Heaven's Fury", category: "Conviction", unlockLevel: 20, element: "Fire", isSpender: true,
      description: "Call down a column of fire that deals 1350% weapon damage per second for 3 seconds. Costs 40 Wrath.",
      runes: [
        { name: "Blessed Ground", description: "Leaves a burning patch on the ground", unlockLevel: 23 },
        { name: "Ascendancy", description: "Deals 1800% damage per second", unlockLevel: 32 },
        { name: "Thou Shalt Not Pass", description: "Creates a wall of fire", unlockLevel: 43 },
        { name: "Split Fury", description: "Fires 3 columns in a spread", unlockLevel: 54 },
        { name: "Fires of Heaven", description: "Deals Holy damage", unlockLevel: 64 },
      ]},
    { id: "iron-skin", name: "Iron Skin", category: "Defensive", unlockLevel: 8, element: "Physical",
      description: "Your skin turns to iron, increasing armor by 100% for 4 seconds.",
      runes: [
        { name: "Steel Skin", description: "Duration increased to 6 seconds", unlockLevel: 11 },
        { name: "Reflective Skin", description: "Reflects 30% of damage taken back to attackers", unlockLevel: 21 },
        { name: "Explosive Skin", description: "Explodes when it expires, dealing 1750% damage", unlockLevel: 32 },
        { name: "Flash", description: "Become invulnerable for 1 second", unlockLevel: 44 },
        { name: "Charged Up", description: "Deals Lightning damage to nearby enemies", unlockLevel: 56 },
      ]},
    { id: "steed-charge", name: "Steed Charge", category: "Utility", unlockLevel: 16, element: "Physical",
      description: "Mount a celestial war horse and charge forward, trampling enemies for 550% weapon damage.",
      runes: [
        { name: "Ramming Speed", description: "Deals 750% damage", unlockLevel: 19 },
        { name: "Endurance", description: "Duration increased by 50%", unlockLevel: 29 },
        { name: "Spiked Barding", description: "Deals damage to enemies as you pass", unlockLevel: 40 },
        { name: "Rejuvenation", description: "Heals 10% max life while charging", unlockLevel: 52 },
        { name: "Draw and Quarter", description: "Drags up to 5 enemies with you", unlockLevel: 62 },
      ]},
    { id: "laws-of-valor", name: "Laws of Valor", category: "Laws", unlockLevel: 21, element: "Holy",
      description: "Recite a law that increases attack speed by 15% for you and nearby allies for 5 seconds.",
      runes: [
        { name: "Critical", description: "Empowered: +50% Critical Hit Damage for 5 sec", unlockLevel: 24 },
        { name: "Frozen in Terror", description: "Empowered: enemies are frozen for 3 sec", unlockLevel: 33 },
        { name: "Unstoppable Force", description: "Reduces Wrath cost of skills by 50%", unlockLevel: 44 },
        { name: "Answered Prayer", description: "Heals 5% max life per second", unlockLevel: 55 },
        { name: "Invincible", description: "Empowered: immune to crowd control for 5 sec", unlockLevel: 64 },
      ]},
    { id: "akarats-champion", name: "Akarat's Champion", category: "Conviction", unlockLevel: 61, element: "Holy",
      description: "Explode with the power of your ancestors for 20 seconds, gaining 35% increased damage, 150% additional armor, and immunity to crowd control.",
      runes: [
        { name: "Prophet", description: "Resurrects you once with full health if you die", unlockLevel: 62 },
        { name: "Rally", description: "Reduces cooldowns by 1 second per enemy killed", unlockLevel: 63 },
        { name: "Embodiment of Power", description: "Restores all Wrath on activation", unlockLevel: 64 },
        { name: "Fire Starter", description: "Deals Fire damage to nearby enemies", unlockLevel: 65 },
        { name: "Hasteful", description: "+45% attack speed instead of damage bonus", unlockLevel: 66 },
      ]},
  ],
};

// ─── All class skill data ─────────────────────────────────────────────────────
export const ALL_CLASS_SKILLS: Record<string, ClassSkillData> = {
  barbarian: barbarianSkills,
  wizard: wizardSkills,
  "demon-hunter": demonHunterSkills,
  monk: monkSkills,
  necromancer: necromancerSkills,
  "witch-doctor": witchDoctorSkills,
  crusader: crusaderSkills,
};

// Helper: get skills available at a given level
export function getAvailableSkills(classId: string, level: number): ClassSkill[] {
  const data = ALL_CLASS_SKILLS[classId];
  if (!data) return [];
  return data.skills.filter((s) => s.unlockLevel <= level);
}

// Helper: get locked skills at a given level
export function getLockedSkills(classId: string, level: number): ClassSkill[] {
  const data = ALL_CLASS_SKILLS[classId];
  if (!data) return [];
  return data.skills.filter((s) => s.unlockLevel > level);
}

// Helper: get available runes for a skill at a given level
export function getAvailableRunes(skill: ClassSkill, level: number): SkillRune[] {
  return skill.runes.filter((r) => r.unlockLevel <= level);
}
