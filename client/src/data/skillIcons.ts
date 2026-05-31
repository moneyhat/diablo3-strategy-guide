// Sanctuary Grimoire — Skill Icon Sprite Sheet Data
// Each class has a 3x2 sprite sheet (3 columns, 2 rows = 6 icons)
// Position is [col, row] 0-indexed, each icon is 1/3 width x 1/2 height of the sheet

export interface SkillIconData {
  spriteUrl: string;
  col: number; // 0-2
  row: number; // 0-1
}

// CDN URLs for each class sprite sheet
const SPRITE_URLS: Record<string, string> = {
  barbarian:      "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/icons-barbarian-DcNLRBtpKNrtJmNbbArNSb.webp",
  crusader:       "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/icons-crusader-XaqNRAfe96yezTYd6KTMxb.webp",
  "demon-hunter": "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/icons-demonhunter-N3o5mvXSZNx9Ht4bAE5YuP.webp",
  monk:           "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/icons-monk-UfBuHPDMvbJ7ECXbpoMF5e.webp",
  necromancer:    "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/icons-necromancer-TyW4pw766ruUmpCA5DCEAx.webp",
  "witch-doctor": "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/icons-witchdoctor-76tgJ4pCYoHz2TJU7qx3vV.webp",
  wizard:         "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/icons-wizard-GgSxgaUMBL4eeo6dMmuhWT.webp",
};

// Skill ID → sprite position mapping
// Sprite sheet layout: 3 columns x 2 rows
// Row 0 = top row (cols 0,1,2), Row 1 = bottom row (cols 0,1,2)
const SKILL_ICON_POSITIONS: Record<string, [number, number]> = {
  // Barbarian — row 0: frenzy, whirlwind, war-cry | row 1: threatening-shout, earthquake, wrath-of-the-berserker
  "frenzy":                    [0, 0],
  "whirlwind":                 [1, 0],
  "war-cry":                   [2, 0],
  "threatening-shout":         [0, 1],
  "earthquake":                [1, 1],
  "wrath-of-the-berserker":    [2, 1],
  "hammer-of-ancients":        [2, 0], // reuse war-cry slot for alt skills
  "battle-rage":               [0, 0],
  "ground-stomp":              [0, 1],
  "leap":                      [1, 1],
  "call-of-the-ancients":      [2, 1],
  "furious-charge":            [1, 0],
  "rend":                      [0, 0],
  "bash":                      [0, 0],
  "cleave":                    [1, 0],
  "ancient-spear":             [2, 0],

  // Crusader — row 0: punish, fist-of-the-heavens, heavens-fury | row 1: laws-of-valor, steed-charge, akarats-champion
  "punish":                    [0, 0],
  "fist-of-the-heavens":       [1, 0],
  "heavens-fury":              [2, 0],
  "laws-of-valor":             [0, 1],
  "steed-charge":              [1, 1],
  "akarats-champion":          [2, 1],
  "iron-skin":                 [0, 1],
  "shield-bash":               [0, 0],
  "blessed-hammer":            [1, 0],
  "bombardment":               [2, 0],

  // Demon Hunter — row 0: hungering-arrow, strafe, smoke-screen | row 1: vault, companion, vengeance
  "hungering-arrow":           [0, 0],
  "strafe":                    [1, 0],
  "smoke-screen":              [2, 0],
  "vault":                     [0, 1],
  "companion":                 [1, 1],
  "vengeance":                 [2, 1],
  "multishot":                 [1, 0],
  "preparation":               [2, 0],
  "entangling-shot":           [0, 0],

  // Monk — row 0: fists-of-thunder, tempest-rush, dashing-strike | row 1: sweeping-wind, cyclone-strike, epiphany
  "fists-of-thunder":          [0, 0],
  "tempest-rush":              [1, 0],
  "dashing-strike":            [2, 0],
  "sweeping-wind":             [0, 1],
  "cyclone-strike":            [1, 1],
  "epiphany":                  [2, 1],
  "wave-of-light":             [1, 0],
  "mantra-of-salvation":       [0, 1],
  "deadly-reach":              [2, 0],

  // Necromancer — row 0: grim-scythe, bone-spear, corpse-explosion | row 1: bone-armor, blood-rush, land-of-the-dead
  "grim-scythe":               [0, 0],
  "bone-spear":                [1, 0],
  "corpse-explosion":          [2, 0],
  "bone-armor":                [0, 1],
  "blood-rush":                [1, 1],
  "land-of-the-dead":          [2, 1],
  "frailty":                   [0, 1],

  // Witch Doctor — row 0: poison-dart, haunt, locust-swarm | row 1: soul-harvest, spirit-walk, piranhas
  "poison-dart":               [0, 0],
  "haunt":                     [1, 0],
  "locust-swarm":              [2, 0],
  "soul-harvest":              [0, 1],
  "spirit-walk":               [1, 1],
  "piranhas":                  [2, 1],
  "hex":                       [1, 0],

  // Wizard — row 0: magic-missile, arcane-torrent, hydra | row 1: mirror-image, teleport, black-hole
  "magic-missile":             [0, 0],
  "arcane-torrent":            [1, 0],
  "hydra":                     [2, 0],
  "mirror-image":              [0, 1],
  "teleport":                  [1, 1],
  "black-hole":                [2, 1],
  "slow-time":                 [2, 1],
  "disintegrate":              [1, 0],
  "spectral-blade":            [0, 0],
  "shock-pulse":               [0, 0],
};

// Get the CSS background-position for a skill icon in a 3x2 sprite sheet
export function getSkillIconStyle(classId: string, skillId: string, size: number = 48): React.CSSProperties {
  const spriteUrl = SPRITE_URLS[classId];
  if (!spriteUrl) return {};

  const pos = SKILL_ICON_POSITIONS[skillId] || [0, 0];
  const [col, row] = pos;

  // Each icon is 1/3 of width, 1/2 of height
  // background-size: 300% 200% (3 cols x 2 rows)
  // background-position: col * -100% row * -100%
  return {
    backgroundImage: `url(${spriteUrl})`,
    backgroundSize: "300% 200%",
    backgroundPosition: `${col * 50}% ${row * 100}%`,
    backgroundRepeat: "no-repeat",
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "4px",
  };
}

// Get sprite URL for a class
export function getClassSpriteUrl(classId: string): string {
  return SPRITE_URLS[classId] || "";
}
