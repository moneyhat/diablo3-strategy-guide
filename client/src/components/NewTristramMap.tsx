// New Tristram — Accurate SVG Town Map
// Based on the actual in-game layout:
// - Town gate at the SOUTH (entry point from Overlook Road)
// - Old Tristram Road exits NORTHEAST
// - Inn (with Stash) on the WEST side
// - Blacksmith on the EAST side
// - Waypoint in the CENTER square
// - Cellar entrance near the Inn
// - Jeweler and Mystic near the Inn
// - Healer near the center
// - Cain's House near center

import { useState } from "react";

interface TownPoi {
  id: string;
  name: string;
  sub: string;
  x: number;
  y: number;
  color: string;
  icon: string;
  tip: string;
}

const POIS: TownPoi[] = [
  // ROADS / EXITS — the flow of the map
  { id: "gate-south",   name: "Town Gate",          sub: "Entry from Overlook Road (south)",    x: 340, y: 530, color: "#ef9a9a", icon: "→", tip: "Main entry point. You start here every game. Overlook Road leads south to Fields of Misery and Wortham." },
  { id: "road-ne",      name: "Old Tristram Road",  sub: "Exit northeast → Cathedral Garden",   x: 560, y: 120, color: "#ef9a9a", icon: "→", tip: "Head northeast to reach the Cathedral Garden waypoint and the Cathedral dungeon entrance." },

  // CENTER — Waypoint (the hub of the town)
  { id: "waypoint",     name: "Waypoint",            sub: "Town center — activate first",        x: 340, y: 310, color: "#4dd0e1", icon: "◆", tip: "The New Tristram waypoint. ALWAYS activate this the moment you enter town. It lets you teleport back from anywhere in Act I." },

  // CENTER — Cain's House and Healer
  { id: "cain",         name: "Cain's House",        sub: "Deckard Cain — item identification",  x: 280, y: 350, color: "#a5d6a7", icon: "☺", tip: "Deckard Cain identifies items for free. Visit before selling or salvaging unidentified gear." },
  { id: "healer",       name: "Brother Malachi",     sub: "Healer — restore health",             x: 400, y: 340, color: "#a5d6a7", icon: "♥", tip: "Restores your health and removes debuffs. Visit before heading into dungeons." },

  // WEST SIDE — Inn, Stash, Jeweler, Mystic, followers
  { id: "inn",          name: "Slaughtered Calf Inn", sub: "Stash inside — west side of town",   x: 160, y: 260, color: "#ffd54f", icon: "⌂", tip: "Your stash is inside the inn. Deposit crafting materials and gems before long runs. Leah is here to advance the main quest." },
  { id: "jeweler",      name: "Covetous Shen",       sub: "Jeweler — near the inn",              x: 155, y: 320, color: "#ffd54f", icon: "⚒", tip: "Socket gems, combine gem tiers, craft jewelry. Combine gems in sets of 3 — Flawless Royal is the endgame standard." },
  { id: "mystic",       name: "Myriam Jahzia",       sub: "Mystic — Adventure Mode only",       x: 155, y: 370, color: "#ffd54f", icon: "✦", tip: "Enchant items to reroll a secondary stat. Transmogrify to change item appearance. Only available in Adventure Mode." },
  { id: "templar",      name: "Kormac",              sub: "Templar Follower",                    x: 110, y: 310, color: "#b0bec5", icon: "★", tip: "Tank follower. Best for solo players who need survivability. Equip with a shield and healing items." },
  { id: "scoundrel",   name: "Lyndon",              sub: "Scoundrel Follower",                  x: 110, y: 360, color: "#b0bec5", icon: "★", tip: "Ranged follower. Best for speed farming. Equip with a crossbow and crit items." },

  // EAST SIDE — Blacksmith
  { id: "blacksmith",   name: "Haedrig Eamon",       sub: "Blacksmith — east side of town",     x: 510, y: 280, color: "#ffd54f", icon: "⚒", tip: "Craft weapons and armor, salvage items for crafting materials, upgrade gear. Salvage all non-Legendary items you don't need." },

  // TOP — Cellar entrance
  { id: "cellar",       name: "Cellar of the Damned", sub: "Dungeon — top of town",             x: 250, y: 140, color: "#90caf9", icon: "▼", tip: "Small dungeon beneath the inn. Undead enemies, guaranteed elite pack. Occasionally spawns a Resplendent Chest." },

  // RIGHT EDGE — Dungeons that always spawn
  { id: "dungeons",     name: "Dungeons Always Spawn", sub: "Warrior's Rest & Forsaken Grounds", x: 590, y: 330, color: "#90caf9", icon: "▼", tip: "Two dungeons always spawn in this area. Each has a guaranteed elite pack and potential Resplendent Chest. Always enter them." },
];

export default function NewTristramMap({ width = 700, height = 620 }: { width?: number; height?: number }) {
  const [selected, setSelected] = useState<TownPoi | null>(null);

  return (
    <div className="relative" style={{ width, fontFamily: "'Cinzel', serif" }}>
      <svg
        viewBox="0 0 700 620"
        width={width}
        height={height}
        style={{ background: "#050302", borderRadius: "8px", display: "block" }}>

        <defs>
          <filter id="glow-wp">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── TOWN WALLS — the boundary of New Tristram ── */}
        {/* Outer wall — irregular shape matching the actual town */}
        <path
          d="M 120,180 C 100,160 90,140 100,120 C 115,95 160,85 200,90
             C 240,95 270,100 300,105 C 330,110 360,108 390,105
             C 430,100 470,95 510,100 C 550,105 580,120 590,145
             C 600,170 595,200 590,230 C 585,260 580,290 582,320
             C 584,350 585,380 580,410 C 575,440 560,465 540,480
             C 520,495 490,500 460,505 C 430,510 400,512 370,515
             C 340,518 310,520 280,518 C 250,516 220,510 195,500
             C 170,490 150,475 135,455 C 120,435 115,410 112,385
             C 109,360 110,330 112,300 C 114,270 118,240 120,210 Z"
          fill="#1a1008"
          stroke="#3d2a12"
          strokeWidth={3}
        />

        {/* ── MAIN ROAD — north-south spine through the center ── */}
        {/* Central road from south gate to north */}
        <path d="M 340,530 L 340,480 L 340,420 L 340,360 L 340,300 L 340,240 L 340,180 L 340,130 L 360,110 L 400,90 L 450,75 L 510,65"
          fill="none" stroke="#4a3520" strokeWidth={18} strokeLinecap="round" />
        <path d="M 340,530 L 340,480 L 340,420 L 340,360 L 340,300 L 340,240 L 340,180 L 340,130 L 360,110 L 400,90 L 450,75 L 510,65"
          fill="none" stroke="#5a4228" strokeWidth={12} strokeLinecap="round" />

        {/* East-west cross street */}
        <path d="M 120,310 L 200,310 L 280,310 L 340,310 L 420,310 L 500,310 L 580,310"
          fill="none" stroke="#4a3520" strokeWidth={14} strokeLinecap="round" />
        <path d="M 120,310 L 200,310 L 280,310 L 340,310 L 420,310 L 500,310 L 580,310"
          fill="none" stroke="#5a4228" strokeWidth={8} strokeLinecap="round" />

        {/* West side path to Inn */}
        <path d="M 200,310 C 185,300 170,285 160,270 C 150,255 148,240 150,225"
          fill="none" stroke="#4a3520" strokeWidth={12} strokeLinecap="round" />
        <path d="M 200,310 C 185,300 170,285 160,270 C 150,255 148,240 150,225"
          fill="none" stroke="#5a4228" strokeWidth={7} strokeLinecap="round" />

        {/* East side path to Blacksmith */}
        <path d="M 420,310 C 450,295 480,285 510,280"
          fill="none" stroke="#4a3520" strokeWidth={12} strokeLinecap="round" />
        <path d="M 420,310 C 450,295 480,285 510,280"
          fill="none" stroke="#5a4228" strokeWidth={7} strokeLinecap="round" />

        {/* Path to Cellar */}
        <path d="M 280,310 C 270,280 260,250 255,210 C 252,185 250,165 250,145"
          fill="none" stroke="#3a2a18" strokeWidth={10} strokeLinecap="round" strokeDasharray="8 5" />

        {/* ── BUILDINGS ── */}
        {/* Inn — west side, large building */}
        <rect x={100} y={200} width={100} height={80} rx={4} fill="#2a1a0a" stroke="#5a3a18" strokeWidth={2} />
        <rect x={110} y={210} width={80} height={60} rx={2} fill="#1e1208" />
        <text x={150} y={248} textAnchor="middle" fontSize={8} fill="#8b6030" fontFamily="'Cinzel', serif">INN</text>

        {/* Blacksmith — east side */}
        <rect x={470} y={245} width={80} height={65} rx={4} fill="#2a1a0a" stroke="#5a3a18" strokeWidth={2} />
        <rect x={480} y={255} width={60} height={45} rx={2} fill="#1e1208" />
        <text x={510} y={282} textAnchor="middle" fontSize={8} fill="#8b6030" fontFamily="'Cinzel', serif">FORGE</text>

        {/* Cain's House — center-west */}
        <rect x={230} y={325} width={65} height={55} rx={4} fill="#1e1208" stroke="#3d2a12" strokeWidth={2} />
        <text x={262} y={358} textAnchor="middle" fontSize={7} fill="#6b4820" fontFamily="'Cinzel', serif">CAIN</text>

        {/* Healer — center-east */}
        <rect x={370} y={315} width={60} height={50} rx={4} fill="#1e1208" stroke="#3d2a12" strokeWidth={2} />
        <text x={400} y={345} textAnchor="middle" fontSize={7} fill="#6b4820" fontFamily="'Cinzel', serif">HEALER</text>

        {/* Cellar entrance — dark hole */}
        <ellipse cx={250} cy={145} rx={22} ry={16} fill="#0a0604" stroke="#3d2a12" strokeWidth={2} />
        <ellipse cx={250} cy={145} rx={14} ry={10} fill="#050302" />

        {/* ── TOWN GATE — south entry ── */}
        {/* Gate arch */}
        <rect x={305} y={490} width={70} height={50} rx={4} fill="#2a1a0a" stroke="#5a3a18" strokeWidth={3} />
        <path d="M 305,510 Q 340,490 375,510" fill="none" stroke="#8b6030" strokeWidth={2} />
        <rect x={318} y={510} width={44} height={30} fill="#0a0604" />
        {/* Gate road continuing south */}
        <path d="M 320,540 L 320,580 M 360,540 L 360,580"
          fill="none" stroke="#4a3520" strokeWidth={6} />

        {/* ── DIRECTION ARROWS ── */}
        {/* South arrow — "You enter here" */}
        <path d="M 340,575 L 340,555" stroke="#ef9a9a" strokeWidth={3} markerEnd="url(#arrow-red)" />
        <defs>
          <marker id="arrow-red" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M 0,0 L 8,4 L 0,8 Z" fill="#ef9a9a" />
          </marker>
          <marker id="arrow-gold" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M 0,0 L 8,4 L 0,8 Z" fill="#ffd54f" />
          </marker>
        </defs>

        {/* Northeast arrow — Old Tristram Road */}
        <path d="M 510,65 L 545,45" stroke="#ffd54f" strokeWidth={3} markerEnd="url(#arrow-gold)" />

        {/* ── ROAD LABELS ── */}
        <text x={340} y={600} textAnchor="middle" fontSize={10} fill="#ef9a9a88" fontFamily="'Cinzel', serif" fontStyle="italic">
          Overlook Road
        </text>
        <text x={570} y={55} textAnchor="middle" fontSize={9} fill="#ffd54f88" fontFamily="'Cinzel', serif" fontStyle="italic">
          Old Tristram Road
        </text>

        {/* ── TOWN LABEL ── */}
        <text x={340} y={30} textAnchor="middle" fontSize={16} fill="#d4a843"
          fontFamily="'Cinzel Decorative', serif" fontWeight="bold">
          New Tristram
        </text>
        <text x={340} y={48} textAnchor="middle" fontSize={9} fill="#8b6030"
          fontFamily="'Cinzel', serif">
          Act I · Khanduras
        </text>

        {/* ── POI MARKERS ── */}
        {POIS.map((poi) => {
          const isSelected = selected?.id === poi.id;
          return (
            <g key={poi.id} onClick={() => setSelected(isSelected ? null : poi)} style={{ cursor: "pointer" }}>
              {/* Selection ring */}
              {isSelected && (
                <circle cx={poi.x} cy={poi.y} r={18} fill="none"
                  stroke={poi.color} strokeWidth={2} opacity={0.5}
                  filter="url(#glow-wp)" />
              )}
              {/* Marker */}
              <circle cx={poi.x} cy={poi.y} r={isSelected ? 10 : 7}
                fill={isSelected ? poi.color : `${poi.color}99`}
                stroke={isSelected ? "white" : poi.color}
                strokeWidth={isSelected ? 2 : 1.5}
                style={{ filter: isSelected ? `drop-shadow(0 0 5px ${poi.color})` : undefined }} />
              <text x={poi.x} y={poi.y + 4} textAnchor="middle"
                fontSize={isSelected ? 9 : 7} fill="white"
                style={{ userSelect: "none", pointerEvents: "none" }}>
                {poi.icon}
              </text>
              {/* Label line + name */}
              {isSelected && (
                <text x={poi.x} y={poi.y + 24} textAnchor="middle"
                  fontSize={8} fill={poi.color} fontFamily="'Cinzel', serif" fontWeight="bold"
                  style={{ userSelect: "none", pointerEvents: "none" }}>
                  {poi.name}
                </text>
              )}
            </g>
          );
        })}

        {/* ── COMPASS ROSE ── */}
        <g transform="translate(640, 560)">
          <circle cx={0} cy={0} r={20} fill="#0a0604" stroke="#3d2a12" strokeWidth={1.5} />
          <text x={0} y={-8} textAnchor="middle" fontSize={9} fill="#8b6030" fontFamily="'Cinzel', serif" fontWeight="bold">N</text>
          <text x={0} y={14} textAnchor="middle" fontSize={9} fill="#5a3a18" fontFamily="'Cinzel', serif">S</text>
          <text x={-13} y={4} textAnchor="middle" fontSize={9} fill="#5a3a18" fontFamily="'Cinzel', serif">W</text>
          <text x={13} y={4} textAnchor="middle" fontSize={9} fill="#5a3a18" fontFamily="'Cinzel', serif">E</text>
          <line x1={0} y1={-16} x2={0} y2={16} stroke="#5a3a18" strokeWidth={1} />
          <line x1={-16} y1={0} x2={16} y2={0} stroke="#5a3a18" strokeWidth={1} />
        </g>
      </svg>

      {/* ── POI Detail Panel ── */}
      {selected && (
        <div className="mt-2 p-3 rounded-lg border"
          style={{ background: "oklch(0.09 0.010 30)", borderColor: `${selected.color}44` }}>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <p className="font-cinzel font-bold text-sm" style={{ color: selected.color }}>{selected.name}</p>
              <p className="font-cinzel" style={{ color: "oklch(0.60 0.010 60)", fontSize: "0.6rem" }}>{selected.sub}</p>
            </div>
            <button onClick={() => setSelected(null)} style={{ color: "oklch(0.55 0.010 60)", fontSize: "1.1rem" }}>×</button>
          </div>
          <div className="flex items-start gap-1.5 p-2 rounded" style={{ background: "oklch(0.11 0.010 30)" }}>
            <span style={{ color: "#ffd54f", fontSize: "0.75rem", flexShrink: 0 }}>★</span>
            <p style={{ color: "oklch(0.78 0.010 60)", fontSize: "0.68rem" }}>{selected.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}
