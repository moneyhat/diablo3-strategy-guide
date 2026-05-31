// Sanctuary Grimoire — Meta Skill Presets & Power Ratings
// Each preset defines the optimal 6-slot loadout for a specific meta build
// Includes power ratings, synergy notes, and why each skill was chosen

export interface SkillPreset {
  id: string;
  name: string;
  tier: "S" | "A" | "B";
  playstyle: string;
  description: string;
  minLevel: number; // Minimum level to use this preset
  slots: {
    LMB: { skillId: string; runeIndex: number };
    RMB: { skillId: string; runeIndex: number };
    "1": { skillId: string; runeIndex: number };
    "2": { skillId: string; runeIndex: number };
    "3": { skillId: string; runeIndex: number };
    "4": { skillId: string; runeIndex: number };
  };
  synergyNotes: string[];
  powerTips: string[];
}

export interface ClassPresets {
  classId: string;
  presets: SkillPreset[];
}

export const ALL_PRESETS: Record<string, SkillPreset[]> = {
  barbarian: [
    {
      id: "barb-pvp-brawler",
      name: "The Iron Juggernaut",
      tier: "S",
      playstyle: "PvP",
      description: "Unstoppable PvP brawler. Ground Stomp locks opponents in place while Leap closes distance instantly. War Cry and Threatening Shout strip enemy damage to near zero. Wrath of the Berserker makes you immune to crowd control — the ultimate dueling machine.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "frenzy", runeIndex: 0 },
        RMB: { skillId: "hammer-of-ancients", runeIndex: 0 },
        "1": { skillId: "ground-stomp", runeIndex: 0 },
        "2": { skillId: "leap", runeIndex: 0 },
        "3": { skillId: "threatening-shout", runeIndex: 1 },
        "4": { skillId: "wrath-of-the-berserker", runeIndex: 2 },
      },
      synergyNotes: [
        "Ground Stomp stuns opponents for 4 seconds — your opener every duel",
        "Leap closes any gap instantly and deals burst damage on landing",
        "Threatening Shout (Intimidate) reduces enemy attack speed by 20% — crippling in PvP",
        "WotB (Striding Giant) makes you immune to all crowd control while active",
        "Hammer of the Ancients is your burst nuke while the opponent is stunned",
      ],
      powerTips: [
        "Open every duel: Leap in → Ground Stomp → spam Hammer of the Ancients",
        "Refresh WotB before it expires — losing CC immunity mid-duel is fatal",
        "Threatening Shout before engaging reduces incoming burst significantly",
        "Stack Cooldown Reduction to keep Ground Stomp on a short leash",
      ],
    },
    {
      id: "barb-ww-rend",
      name: "Whirlwind / Rend",
      tier: "S",
      playstyle: "Speed Farming",
      description: "The definitive Barbarian speed build. Spin through packs continuously while Rend applies automatically via Ambo's Pride. Wrath of the Berserker keeps you in permanent god mode.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "frenzy", runeIndex: 0 },
        RMB: { skillId: "whirlwind", runeIndex: 0 },
        "1": { skillId: "war-cry", runeIndex: 2 },
        "2": { skillId: "battle-rage", runeIndex: 0 },
        "3": { skillId: "threatening-shout", runeIndex: 0 },
        "4": { skillId: "wrath-of-the-berserker", runeIndex: 2 },
      },
      synergyNotes: [
        "Whirlwind + Ambo's Pride = free Rend on every enemy you spin through",
        "Battle Rage (Into the Fray) generates Fury on kills, sustaining Whirlwind indefinitely",
        "Wrath of the Berserker (Striding Giant) provides 50% damage reduction — keep it permanent",
        "War Cry (Impunity) stacks All Resistances for massive survivability",
      ],
      powerTips: [
        "Never stop moving — Whirlwind damage scales with movement speed",
        "Stack Cooldown Reduction to maintain permanent WotB via Obsidian Ring of the Zodiac",
        "Position yourself at the center of packs before spinning for maximum Area Damage",
        "Refresh all 3 shouts before engaging elite packs",
      ],
    },
    {
      id: "barb-ik-hota",
      name: "IK Hammer of the Ancients",
      tier: "S",
      playstyle: "GR Pushing",
      description: "The premier Greater Rift pushing build. Hammer of the Ancients hits for enormous single-target damage while Immortal King's set provides permanent WotB uptime.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "furious-charge", runeIndex: 4 },
        RMB: { skillId: "hammer-of-ancients", runeIndex: 0 },
        "1": { skillId: "war-cry", runeIndex: 2 },
        "2": { skillId: "battle-rage", runeIndex: 1 },
        "3": { skillId: "threatening-shout", runeIndex: 0 },
        "4": { skillId: "wrath-of-the-berserker", runeIndex: 2 },
      },
      synergyNotes: [
        "Furious Charge (Dreadnought) heals 2% max life per enemy hit — essential sustain",
        "Hammer of the Ancients deals 510%+ weapon damage per hit — your primary nuke",
        "IK 6-piece set makes WotB permanent when spending Fury — never let it drop",
        "Battle Rage (Ferocity) pushes damage to 15% bonus — always active",
      ],
      powerTips: [
        "Use Furious Charge to reset WotB cooldown via Obsidian Ring of the Zodiac",
        "Aim Hammer of the Ancients at the center of clustered enemies for Area Damage",
        "Stack Critical Hit Damage as your primary offensive stat",
        "Maintain all shout buffs — they multiply your total damage significantly",
      ],
    },
    {
      id: "barb-leapquake",
      name: "Leapquake",
      tier: "A",
      playstyle: "AoE Burst",
      description: "Leap into packs and trigger massive Earthquake AoE. Cave-In pulls enemies together for devastating clustered damage. Fun and explosive playstyle.",
      minLevel: 22,
      slots: {
        LMB: { skillId: "bash", runeIndex: 0 },
        RMB: { skillId: "earthquake", runeIndex: 0 },
        "1": { skillId: "leap", runeIndex: 0 },
        "2": { skillId: "war-cry", runeIndex: 2 },
        "3": { skillId: "threatening-shout", runeIndex: 0 },
        "4": { skillId: "call-of-the-ancients", runeIndex: 0 },
      },
      synergyNotes: [
        "Leap triggers Earthquake on landing — always Leap before activating Earthquake",
        "Cave-In pulls enemies to the center of the quake for maximum hits",
        "Call of the Ancients adds massive additional damage during burst windows",
        "War Cry + Threatening Shout provide the defensive layer to survive close-range combat",
      ],
      powerTips: [
        "Keep 3 Leap charges ready before engaging a large elite pack",
        "Leap → Earthquake → Leap again for continuous AoE coverage",
        "The Lut Socks legendary boots give 3 Leap charges — essential for this build",
        "Position Earthquake at the densest point of the pack, not at your feet",
      ],
    },
  ],

  wizard: [
    {
      id: "wiz-pvp-arcane-burst",
      name: "The Arcane Executioner",
      tier: "S",
      playstyle: "PvP",
      description: "Teleport in, drop a Black Hole to lock the opponent in place, then detonate with Arcane Torrent and Slow Time for a devastating burst window. Mirror Images absorb incoming damage while you channel. The most lethal dueling kit in the game.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "magic-missile", runeIndex: 3 },
        RMB: { skillId: "arcane-torrent", runeIndex: 0 },
        "1": { skillId: "black-hole", runeIndex: 0 },
        "2": { skillId: "mirror-image", runeIndex: 0 },
        "3": { skillId: "teleport", runeIndex: 2 },
        "4": { skillId: "slow-time", runeIndex: 0 },
      },
      synergyNotes: [
        "Black Hole (Supermassive) pulls opponent in and holds them for 2 seconds — your setup",
        "Slow Time inside the Black Hole creates a double CC window — nearly inescapable",
        "Mirror Images draw opponent aggro and absorb burst damage while you channel",
        "Teleport (Safe Passage) gives 25% damage reduction for 5 seconds — use it aggressively",
      ],
      powerTips: [
        "Rotation: Teleport in → Black Hole → Slow Time → channel Arcane Torrent",
        "Mirror Images before engaging — let them absorb the first burst",
        "Safe Passage on Teleport is your lifeline — never waste it on repositioning",
        "Stack Cooldown Reduction to keep Black Hole on a 10-second cycle",
      ],
    },
    {
      id: "wiz-typhon-hydra",
      name: "Typhon Hydra",
      tier: "S",
      playstyle: "Speed Farming",
      description: "Place Hydras and channel Arcane Torrent while Etched Sigil auto-casts more Hydras. Typhon's Veil set multiplies Hydra damage to absurd levels. Extremely low effort, extremely high reward.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "magic-missile", runeIndex: 3 },
        RMB: { skillId: "arcane-torrent", runeIndex: 0 },
        "1": { skillId: "hydra", runeIndex: 4 },
        "2": { skillId: "mirror-image", runeIndex: 0 },
        "3": { skillId: "teleport", runeIndex: 2 },
        "4": { skillId: "black-hole", runeIndex: 0 },
      },
      synergyNotes: [
        "Arcane Torrent + Etched Sigil = auto-casts Hydra every 1.5 seconds while channeling",
        "Typhon's Veil 6-piece doubles Hydra duration and triples Hydra damage",
        "Black Hole groups enemies so all Hydra heads hit the same targets",
        "Mirror Image draws aggro away from you while Hydras do the work",
      ],
      powerTips: [
        "Never stop channeling Arcane Torrent — Deathwish requires it for 325% damage",
        "Place Hydras at the center of packs before channeling",
        "Stay in The Oculus ring zone whenever it appears for a 70% damage bonus",
        "Teleport (Safe Passage) gives 5 sec damage reduction — use it aggressively",
      ],
    },
    {
      id: "wiz-firebird-mirror",
      name: "Firebird Mirror Image",
      tier: "S",
      playstyle: "GR Pushing",
      description: "Mirror Images independently generate Firebird ignition stacks, effectively tripling your damage output. One of the highest-ceiling builds in the game.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "magic-missile", runeIndex: 3 },
        RMB: { skillId: "disintegrate", runeIndex: 0 },
        "1": { skillId: "hydra", runeIndex: 4 },
        "2": { skillId: "mirror-image", runeIndex: 0 },
        "3": { skillId: "teleport", runeIndex: 2 },
        "4": { skillId: "slow-time", runeIndex: 0 },
      },
      synergyNotes: [
        "Mirror Images (Duplicates) generate Firebird stacks independently — 3x damage",
        "Disintegrate channels continuously, applying Firebird ignition to all enemies",
        "Slow Time creates a damage window — cast on Rift Guardians for team benefit",
        "Hydra provides persistent damage while you focus on positioning",
      ],
      powerTips: [
        "Recast Mirror Images the moment they die — their stacks are your primary damage multiplier",
        "Deathwish requires channeling — never release Disintegrate during a fight",
        "Slow Time on Rift Guardians provides a significant team damage window",
        "Stack Intelligence and Critical Hit Damage as primary stats",
      ],
    },
  ],

  "demon-hunter": [
    {
      id: "dh-pvp-shadow-assassin",
      name: "The Shadow Assassin",
      tier: "S",
      playstyle: "PvP",
      description: "Vanish with Smoke Screen, close the gap with Vault, and burst with point-blank Multishot. Vengeance makes you immune to crowd control. The Demon Hunter's PvP identity: hit and run, never stay still, never be where they expect.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "hungering-arrow", runeIndex: 3 },
        RMB: { skillId: "multishot", runeIndex: 0 },
        "1": { skillId: "smoke-screen", runeIndex: 1 },
        "2": { skillId: "vault", runeIndex: 3 },
        "3": { skillId: "preparation", runeIndex: 0 },
        "4": { skillId: "vengeance", runeIndex: 1 },
      },
      synergyNotes: [
        "Smoke Screen (Lingering Fog) gives 2 seconds of invisibility — use it to reset the fight",
        "Vault (Trail of Cinders) leaves a burning trail — zone opponents off escape routes",
        "Vengeance (Dark Heart) provides CC immunity and 40% damage — activate before engaging",
        "Preparation restores all Discipline instantly — your emergency reset button",
      ],
      powerTips: [
        "Never fight in a straight line — Vault constantly to stay unpredictable",
        "Smoke Screen is your panic button AND your opener — use it both ways",
        "Multishot at close range hits for maximum damage — close the gap before firing",
        "Preparation lets you chain multiple Smoke Screens — use it the moment Discipline drops",
      ],
    },
    {
      id: "dh-god-hungering",
      name: "GoD Hungering Arrow",
      tier: "S",
      playstyle: "Speed Farming",
      description: "The Gears of Dreadlands set makes Strafe fire Hungering Arrows automatically. Move constantly to build Momentum stacks. One of the fastest speed farming builds in the game.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "hungering-arrow", runeIndex: 3 },
        RMB: { skillId: "strafe", runeIndex: 0 },
        "1": { skillId: "smoke-screen", runeIndex: 1 },
        "2": { skillId: "vault", runeIndex: 0 },
        "3": { skillId: "companion", runeIndex: 4 },
        "4": { skillId: "vengeance", runeIndex: 1 },
      },
      synergyNotes: [
        "Strafe + GoD set = auto-fires Hungering Arrows every step, building Momentum stacks",
        "Each Momentum stack increases damage — maximum 15 stacks = maximum damage",
        "Vengeance (Dark Heart) provides 40% multiplicative damage and CC immunity",
        "Wolf Companion howl gives 30% damage bonus — use before every elite pack",
      ],
      powerTips: [
        "Never stop moving — Momentum stacks drop if you stand still",
        "Move in figure-eight patterns through packs to maximize arrow output",
        "Smoke Screen (Displacement) is your emergency escape — react instantly to dangerous affixes",
        "Dawn in Kanai's Cube makes Vengeance permanent with enough CDR",
      ],
    },
    {
      id: "dh-shadow-impale",
      name: "Shadow Impale",
      tier: "A",
      playstyle: "GR Pushing",
      description: "Get into melee range and spam Impale for massive single-target damage. Karlei's Point resets Impale cooldown via Smoke Screen. High risk, extremely high reward.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "hungering-arrow", runeIndex: 0 },
        RMB: { skillId: "multishot", runeIndex: 0 },
        "1": { skillId: "smoke-screen", runeIndex: 1 },
        "2": { skillId: "preparation", runeIndex: 2 },
        "3": { skillId: "companion", runeIndex: 4 },
        "4": { skillId: "vengeance", runeIndex: 1 },
      },
      synergyNotes: [
        "Smoke Screen + Karlei's Point = resets Impale cooldown on every use",
        "Preparation (Focused Mind) regenerates Discipline for more Smoke Screens",
        "Vengeance provides the damage multiplier and CC immunity needed for melee range",
        "Wolf Companion amplifies burst damage during Impale windows",
      ],
      powerTips: [
        "Get within melee range before casting Impale — the damage bonus requires proximity",
        "Use Smoke Screen offensively to reset Impale, not just defensively",
        "Odyssey's End makes enemies take 60% more damage when Entangled — apply it first",
        "Stack Critical Hit Damage as your primary offensive stat",
      ],
    },
  ],

  monk: [
    {
      id: "monk-pvp-seven-sided",
      name: "The Seven-Sided Striker",
      tier: "S",
      playstyle: "PvP",
      description: "Epiphany teleports you directly onto opponents with every attack. Cyclone Strike pulls them in, Dashing Strike closes any gap, and Wave of Light delivers crushing Holy burst. The Monk is the most mobile duelist — you control the fight entirely.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "fists-of-thunder", runeIndex: 0 },
        RMB: { skillId: "wave-of-light", runeIndex: 0 },
        "1": { skillId: "cyclone-strike", runeIndex: 0 },
        "2": { skillId: "dashing-strike", runeIndex: 0 },
        "3": { skillId: "mantra-of-salvation", runeIndex: 2 },
        "4": { skillId: "epiphany", runeIndex: 0 },
      },
      synergyNotes: [
        "Epiphany teleports you to every enemy hit — opponents cannot kite you",
        "Cyclone Strike pulls the opponent directly to you before Wave of Light",
        "Mantra of Salvation (Divine Protection) grants 2 seconds of full immunity when empowered",
        "Dashing Strike provides two charges of instant repositioning",
      ],
      powerTips: [
        "Activate Epiphany before engaging — it must never drop during a duel",
        "Cyclone Strike → Wave of Light is your burst combo — execute it the moment they're in range",
        "Mantra of Salvation empowered is your emergency button — use it on lethal burst",
        "Stack Cooldown Reduction to keep Epiphany permanent",
      ],
    },
    {
      id: "monk-sunwuko-tempest",
      name: "Sunwuko Tempest Rush",
      tier: "S",
      playstyle: "Speed Farming",
      description: "Channel Tempest Rush through packs continuously. The Sunwuko set multiplies damage with each enemy hit. Cesar's Memento bracers add a massive damage multiplier when you dash first.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "fists-of-thunder", runeIndex: 2 },
        RMB: { skillId: "tempest-rush", runeIndex: 1 },
        "1": { skillId: "dashing-strike", runeIndex: 0 },
        "2": { skillId: "sweeping-wind", runeIndex: 2 },
        "3": { skillId: "cyclone-strike", runeIndex: 0 },
        "4": { skillId: "epiphany", runeIndex: 0 },
      },
      synergyNotes: [
        "Dashing Strike → Tempest Rush: Cesar's Memento requires hitting enemies with another skill first",
        "Sweeping Wind (Inner Storm) generates Spirit passively at max stacks — sustains Tempest Rush",
        "Epiphany (Desert Shroud) provides 50% damage reduction and instant teleport to enemies",
        "Cyclone Strike groups scattered enemies before your Tempest Rush pass",
      ],
      powerTips: [
        "Always open each pack with Dashing Strike before switching to Tempest Rush",
        "Move in tight circles through packs to hit the same enemies multiple times",
        "Epiphany must never drop — it is your primary survival tool",
        "Stack Sweeping Wind to maximum before engaging large packs",
      ],
    },
    {
      id: "monk-inna-mystic-ally",
      name: "Inna Mystic Ally",
      tier: "A",
      playstyle: "GR Pushing",
      description: "Summon a massive army of Mystic Allies that deal enormous AoE damage. The Inna's Mantra set supercharges all ally types simultaneously.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "fists-of-thunder", runeIndex: 2 },
        RMB: { skillId: "wave-of-light", runeIndex: 0 },
        "1": { skillId: "dashing-strike", runeIndex: 0 },
        "2": { skillId: "sweeping-wind", runeIndex: 2 },
        "3": { skillId: "cyclone-strike", runeIndex: 0 },
        "4": { skillId: "epiphany", runeIndex: 0 },
      },
      synergyNotes: [
        "Wave of Light deals 930% Holy damage — your primary nuke against elite packs",
        "Inna's 6-piece activates all Mystic Ally types simultaneously for massive passive damage",
        "Cyclone Strike pulls enemies together for maximum Wave of Light hits",
        "Epiphany provides the mobility and survivability needed for close-range combat",
      ],
      powerTips: [
        "Position Wave of Light at the center of grouped enemies for maximum hits",
        "The Incense Torch of the Grand Temple reduces Wave of Light cost by 75%",
        "Stack Resource Cost Reduction to cast Wave of Light near-freely",
        "Crudest Boots doubles Mystic Ally count — essential legendary",
      ],
    },
  ],

  necromancer: [
    {
      id: "necro-pvp-death-nova",
      name: "The Death Lord",
      tier: "S",
      playstyle: "PvP",
      description: "Blood Rush teleports you directly onto opponents, Bone Armor stuns them, and Land of the Dead followed by Corpse Explosion detonates everything in range. The Necromancer's PvP game is about controlling the corpse economy — create them, then weaponize them.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "grim-scythe", runeIndex: 0 },
        RMB: { skillId: "bone-spear", runeIndex: 0 },
        "1": { skillId: "bone-armor", runeIndex: 0 },
        "2": { skillId: "blood-rush", runeIndex: 1 },
        "3": { skillId: "frailty", runeIndex: 0 },
        "4": { skillId: "land-of-the-dead", runeIndex: 0 },
      },
      synergyNotes: [
        "Bone Armor (Dislocation) stuns the opponent for 2 seconds on activation — your opener",
        "Frailty (Aura of Frailty) kills opponents below 15% health automatically",
        "Land of the Dead enables instant Corpse Explosion spam for massive burst",
        "Blood Rush (Potency) gives +100% armor for 2 seconds after teleporting",
      ],
      powerTips: [
        "Rotation: Blood Rush in → Bone Armor → Bone Spear burst → Frailty → Land of the Dead",
        "Frailty's execute threshold means you never need to land the killing blow manually",
        "Blood Rush is your only escape — save one charge for emergency repositioning",
        "Stack Cooldown Reduction to cycle Land of the Dead every 60 seconds",
      ],
    },
    {
      id: "necro-masquerade-bone-spear",
      name: "Masquerade Bone Spear",
      tier: "S",
      playstyle: "GR Pushing",
      description: "Simulacrums cast their own Bone Spears simultaneously, effectively tripling your damage. The Masquerade of Burning Carnival set is the premier Necromancer pushing build.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "grim-scythe", runeIndex: 0 },
        RMB: { skillId: "bone-spear", runeIndex: 0 },
        "1": { skillId: "corpse-explosion", runeIndex: 1 },
        "2": { skillId: "bone-armor", runeIndex: 0 },
        "3": { skillId: "blood-rush", runeIndex: 1 },
        "4": { skillId: "land-of-the-dead", runeIndex: 0 },
      },
      synergyNotes: [
        "Simulacrums fire simultaneous Bone Spears — position all three on the same pack",
        "Land of the Dead enables unlimited Corpse Explosion during the 5-second burst window",
        "Bone Armor (Dislocation) stuns enemies and generates corpses for Corpse Explosion",
        "Grim Scythe (Cursed Scythe) applies random curses — free debuffs that amplify damage",
      ],
      powerTips: [
        "Pre-stack Essence to 200 before activating Land of the Dead",
        "During LotD, spam Corpse Explosion as fast as possible — Close to the Bone makes it free",
        "Briggs' Wrath pulls enemies toward you when casting Bone Spear — use it to group packs",
        "Stack Critical Hit Damage and Cooldown Reduction as primary stats",
      ],
    },
    {
      id: "necro-pestilence-corpse-lance",
      name: "Pestilence Corpse Lance",
      tier: "A",
      playstyle: "Speed Farming",
      description: "Fire Corpse Lances at enemies while generating corpses with Bone Spear. The Pestilence Master's Shroud set amplifies Corpse Lance damage to extreme levels.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "grim-scythe", runeIndex: 0 },
        RMB: { skillId: "bone-spear", runeIndex: 0 },
        "1": { skillId: "corpse-explosion", runeIndex: 1 },
        "2": { skillId: "bone-armor", runeIndex: 0 },
        "3": { skillId: "blood-rush", runeIndex: 1 },
        "4": { skillId: "land-of-the-dead", runeIndex: 0 },
      },
      synergyNotes: [
        "Bone Spear generates corpses for Corpse Lance — always fire it into packs first",
        "Land of the Dead provides unlimited corpses for a 5-second burst window",
        "Bone Armor generates additional corpses on each enemy hit",
        "Pestilence 6-piece makes each Corpse Lance cast fire additional lances",
      ],
      powerTips: [
        "Generate corpses before activating Land of the Dead for maximum burst",
        "Target elite packs and Rift Guardians with your LotD burst window",
        "Blood Rush is your only mobility — save it for dangerous affixes",
        "Frailty (Aura of Frailty) provides a 15% team damage amplification",
      ],
    },
  ],

  "witch-doctor": [
    {
      id: "wd-pvp-hex-master",
      name: "The Voodoo Lord",
      tier: "S",
      playstyle: "PvP",
      description: "Hex transforms opponents into helpless chickens, Spirit Walk makes you untouchable, and Piranhas strips their defenses. Soul Harvest stacks off every opponent hit, turning their own presence into your power. The most disruptive duelist in Sanctuary.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "poison-dart", runeIndex: 0 },
        RMB: { skillId: "haunt", runeIndex: 0 },
        "1": { skillId: "hex", runeIndex: 0 },
        "2": { skillId: "soul-harvest", runeIndex: 1 },
        "3": { skillId: "spirit-walk", runeIndex: 0 },
        "4": { skillId: "piranhas", runeIndex: 0 },
      },
      synergyNotes: [
        "Hex turns the opponent into a chicken for 12 seconds — they cannot act at all",
        "Soul Harvest (Siphon) heals 10% max life per stack while the opponent is hexed",
        "Piranhas applies 15% increased damage taken — cast it before every burst window",
        "Spirit Walk makes you invulnerable for 2 seconds — your panic button and gap closer",
      ],
      powerTips: [
        "Rotation: Piranhas → Hex → Soul Harvest → spam Haunt and Poison Dart",
        "Hex is your ultimate control — use it the moment the opponent activates their defensive cooldown",
        "Spirit Walk is invincibility — save it for the opponent's burst, not for repositioning",
        "Stack Cooldown Reduction to cycle Hex every 15 seconds",
      ],
    },
    {
      id: "wd-jade-harvester",
      name: "Jade Harvester",
      tier: "S",
      playstyle: "Speed Farming",
      description: "Apply Haunt and Locust Swarm to all enemies, then Soul Harvest to instantly convert all DoT damage into a single explosive burst. One of the most satisfying builds in the game.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "poison-dart", runeIndex: 0 },
        RMB: { skillId: "haunt", runeIndex: 0 },
        "1": { skillId: "locust-swarm", runeIndex: 0 },
        "2": { skillId: "soul-harvest", runeIndex: 3 },
        "3": { skillId: "spirit-walk", runeIndex: 0 },
        "4": { skillId: "piranhas", runeIndex: 0 },
      },
      synergyNotes: [
        "Piranhas (Piranhado) groups enemies AND applies 15% damage amplification — always open with this",
        "Locust Swarm (Pestilence) spreads automatically — apply to one enemy and wait",
        "Both Haunt AND Locust Swarm must be on every target for Ring of Emptiness to work",
        "Soul Harvest instantly converts all accumulated DoT damage — the bigger the stacks, the bigger the burst",
      ],
      powerTips: [
        "The rotation is: Piranhas → Locust Swarm → Haunt everything → Soul Harvest",
        "Sacred Harvester increases Soul Harvest stacks to 10 — always maintain maximum stacks",
        "Ring of Emptiness requires BOTH DoTs on every target — never skip Haunt",
        "Spirit Walk is your only invincibility — never waste it on trivial repositioning",
      ],
    },
    {
      id: "wd-mundunugu-spirit-barrage",
      name: "Mundunugu Spirit Barrage",
      tier: "S",
      playstyle: "GR Pushing",
      description: "The Barber stores Spirit Barrage damage for 2 seconds then releases it all at once in a massive explosion. Mundunugu's Regalia amplifies this to extreme levels.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "poison-dart", runeIndex: 0 },
        RMB: { skillId: "haunt", runeIndex: 0 },
        "1": { skillId: "locust-swarm", runeIndex: 0 },
        "2": { skillId: "soul-harvest", runeIndex: 3 },
        "3": { skillId: "spirit-walk", runeIndex: 0 },
        "4": { skillId: "piranhas", runeIndex: 0 },
      },
      synergyNotes: [
        "The Barber stores all Spirit Barrage damage for 2 seconds — position carefully before detonation",
        "Mundunugu's 6-piece adds massive damage based on your maximum Mana",
        "Big Bad Voodoo provides a 50% damage bonus to all nearby allies",
        "Piranhas groups enemies for maximum explosion coverage",
      ],
      powerTips: [
        "Position the stored explosion at the center of the pack before the 2-second timer expires",
        "Stack maximum Mana as a secondary stat — it directly increases damage",
        "Spirit Walk is essential for surviving the close-range positioning this build requires",
        "Grave Injustice passive reduces all cooldowns on kill — essential for uptime",
      ],
    },
  ],

  crusader: [
    {
      id: "crus-pvp-divine-hammer",
      name: "The Divine Arbiter",
      tier: "S",
      playstyle: "PvP",
      description: "Akarat's Champion makes you nearly unkillable while Iron Skin (Flash) provides brief invincibility for the most dangerous moments. Steed Charge closes gaps instantly and Fist of the Heavens delivers relentless Holy burst. The Crusader is a wall of divine punishment that never stops advancing.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "punish", runeIndex: 0 },
        RMB: { skillId: "fist-of-the-heavens", runeIndex: 0 },
        "1": { skillId: "iron-skin", runeIndex: 3 },
        "2": { skillId: "steed-charge", runeIndex: 0 },
        "3": { skillId: "laws-of-valor", runeIndex: 0 },
        "4": { skillId: "akarats-champion", runeIndex: 0 },
      },
      synergyNotes: [
        "Akarat's Champion (Prophet) resurrects you once if you die — the ultimate PvP safety net",
        "Iron Skin (Flash) grants 1 second of full invincibility — use it to absorb burst combos",
        "Steed Charge closes any gap in under a second — opponents cannot kite you",
        "Laws of Valor (Critical) empowers your attacks for 5 seconds — activate before burst",
      ],
      powerTips: [
        "Activate Akarat's Champion before engaging — the Prophet resurrection changes the duel",
        "Iron Skin (Flash) on reaction to the opponent's burst combo — timing is everything",
        "Steed Charge into melee range, then immediately cast Fist of the Heavens",
        "Stack Cooldown Reduction to keep both Akarat's Champion and Iron Skin on short cycles",
      ],
    },
    {
      id: "crus-aegis-valor",
      name: "Aegis of Valor Heaven's Fury",
      tier: "S",
      playstyle: "Speed Farming",
      description: "Spam Fist of the Heavens to automatically trigger Heaven's Fury via the Aegis of Valor set. Stack multiple beams on the same target for devastating holy damage.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "punish", runeIndex: 0 },
        RMB: { skillId: "fist-of-the-heavens", runeIndex: 0 },
        "1": { skillId: "heavens-fury", runeIndex: 0 },
        "2": { skillId: "laws-of-valor", runeIndex: 2 },
        "3": { skillId: "steed-charge", runeIndex: 1 },
        "4": { skillId: "akarats-champion", runeIndex: 0 },
      },
      synergyNotes: [
        "Fist of the Heavens + Aegis of Valor = each cast automatically triggers Heaven's Fury",
        "Stack multiple Heaven's Fury beams on the same target for massive single-target damage",
        "Laws of Valor (Unstoppable Force) reduces Wrath cost — spam Fist of the Heavens freely",
        "Akarat's Champion (Prophet) provides a free resurrection and massive damage boost",
      ],
      powerTips: [
        "Position yourself at the center of packs so beams hit the maximum number of enemies",
        "Steed Charge between packs for fast movement — Endurance extends the duration",
        "With 37%+ Cooldown Reduction, Akarat's Champion stays permanent",
        "Stack Cooldown Reduction as your top stat priority — it enables permanent AkC",
      ],
    },
    {
      id: "crus-bombardment",
      name: "LoD Bombardment",
      tier: "A",
      playstyle: "GR Pushing",
      description: "Call down Bombardment for massive AoE damage. Legacy of Dreams gem amplifies all damage without requiring a set. Illusory Boots allow walking through enemies for perfect positioning.",
      minLevel: 61,
      slots: {
        LMB: { skillId: "punish", runeIndex: 0 },
        RMB: { skillId: "heavens-fury", runeIndex: 0 },
        "1": { skillId: "iron-skin", runeIndex: 3 },
        "2": { skillId: "laws-of-valor", runeIndex: 2 },
        "3": { skillId: "steed-charge", runeIndex: 1 },
        "4": { skillId: "akarats-champion", runeIndex: 0 },
      },
      synergyNotes: [
        "Iron Skin (Flash) provides brief invincibility — use it to survive dangerous affixes",
        "Heaven's Fury provides sustained damage between Bombardment cooldowns",
        "Laws of Valor empowers your attack speed and reduces Wrath costs",
        "Akarat's Champion amplifies all damage and provides the Prophet safety net",
      ],
      powerTips: [
        "Illusory Boots let you walk through enemies — position Bombardment perfectly",
        "In group play, use Laws of Valor (Unstoppable Force) to reduce team Wrath costs",
        "Stack Cooldown Reduction to reduce Bombardment cooldown",
        "Iron Skin (Flash) is your emergency button — react immediately to lethal affixes",
      ],
    },
  ],
};

// Power rating for individual skills (1-5 stars, based on meta relevance)
export const SKILL_POWER_RATINGS: Record<string, number> = {
  // Barbarian
  "wrath-of-the-berserker": 5, "whirlwind": 5, "hammer-of-ancients": 5,
  "war-cry": 4, "battle-rage": 4, "threatening-shout": 4,
  "earthquake": 4, "leap": 3, "furious-charge": 4,
  "rend": 4, "frenzy": 3, "ground-stomp": 3,
  "call-of-the-ancients": 4, "ancient-spear": 3, "bash": 2, "cleave": 2,
  // Wizard
  "arcane-torrent": 5, "hydra": 5, "mirror-image": 5,
  "black-hole": 4, "teleport": 4, "slow-time": 4,
  "disintegrate": 4, "magic-missile": 2, "spectral-blade": 2,
  "shock-pulse": 2,
  // Demon Hunter
  "vengeance": 5, "strafe": 5, "hungering-arrow": 4,
  "smoke-screen": 4, "companion": 4, "vault": 3,
  "multishot": 4, "preparation": 3, "entangling-shot": 2,
  // Monk
  "epiphany": 5, "tempest-rush": 5, "sweeping-wind": 4,
  "dashing-strike": 4, "cyclone-strike": 4, "wave-of-light": 4,
  "fists-of-thunder": 3, "deadly-reach": 2, "mantra-of-salvation": 3,
  // Necromancer
  "land-of-the-dead": 5, "bone-spear": 5, "corpse-explosion": 4,
  "bone-armor": 4, "blood-rush": 3, "grim-scythe": 3,
  "frailty": 3,
  // Witch Doctor
  "soul-harvest": 5, "piranhas": 5, "haunt": 4,
  "locust-swarm": 4, "spirit-walk": 4, "poison-dart": 2, "hex": 3,
  // Crusader
  "akarats-champion": 5, "fist-of-the-heavens": 5, "heavens-fury": 5,
  "laws-of-valor": 4, "steed-charge": 3, "iron-skin": 3,
  "punish": 2, "slash": 2,
};

// Synergy pairs — skills that work exceptionally well together
export const SKILL_SYNERGIES: Record<string, string[]> = {
  "whirlwind": ["battle-rage", "war-cry", "threatening-shout", "wrath-of-the-berserker"],
  "hammer-of-ancients": ["wrath-of-the-berserker", "war-cry", "battle-rage", "furious-charge"],
  "earthquake": ["leap", "call-of-the-ancients", "war-cry"],
  "arcane-torrent": ["hydra", "mirror-image", "black-hole", "slow-time"],
  "hydra": ["arcane-torrent", "black-hole", "mirror-image"],
  "strafe": ["vengeance", "companion", "hungering-arrow"],
  "tempest-rush": ["dashing-strike", "sweeping-wind", "epiphany", "cyclone-strike"],
  "wave-of-light": ["cyclone-strike", "epiphany", "sweeping-wind"],
  "bone-spear": ["land-of-the-dead", "bone-armor", "corpse-explosion"],
  "land-of-the-dead": ["corpse-explosion", "bone-spear", "bone-armor"],
  "soul-harvest": ["haunt", "locust-swarm", "piranhas"],
  "haunt": ["locust-swarm", "soul-harvest", "piranhas"],
  "fist-of-the-heavens": ["heavens-fury", "laws-of-valor", "akarats-champion"],
  "heavens-fury": ["fist-of-the-heavens", "laws-of-valor", "akarats-champion"],
};
