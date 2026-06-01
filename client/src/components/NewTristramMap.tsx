// New Tristram — SVG Town Map
// Coordinates matched to the actual in-game spatial layout from reference:
//
// REFERENCE LAYOUT (from DiabloWiki map):
// - The town is a compact DARK BLOB shape, roughly oval, tilted slightly
// - Top-center: "Cellar of the Damned" + Mira Eamon (Mystic) marker
// - Upper-left quadrant: Jeweler (blue diamond icon), Radek the Fence labels
// - Center-left: Argus the Collector, Witch Doctor/Wizard follower, Ferryman
// - Center: Inn label, Tashun the Miner, Brother Malachi (Healer - red heart icon)
// - Center-right: Cain's House, Haedrig Eamon Blacksmith (anvil icon), Waypoint (blue circle)
// - Right edge: "Dungeons that always spawn" label
// - Top-right outside town: "Old Tristram Road" label (exit northeast)
// - Bottom outside town: "Overlook Road" label (exit south)
// - Town label "TRISTRAM" at bottom-center of the blob
// - "Act I" subtitle below town name

import { useState } from "react";

interface Poi {
  id: string; name: string; sub: string;
  x: number; y: number;
  color: string; shape: "diamond" | "circle" | "square" | "heart" | "arrow";
  tip: string;
}

// All coordinates are on a 500x400 canvas
// Mapped directly from the reference image proportions
const POIS: Poi[] = [
  // TOP-CENTER: Cellar + Mystic
  { id: "cellar",    name: "Cellar of the Damned", sub: "Dungeon · Mira Eamon (Mystic) nearby",
    x: 245, y: 68,  color: "#90caf9", shape: "diamond",
    tip: "Dungeon entrance at the top of town. Guaranteed elite pack. Mira Eamon (Mystic) stands just outside — enchant and transmogrify items here." },

  // UPPER-LEFT: Jeweler
  { id: "jeweler",   name: "Covetous Shen",         sub: "Jeweler",
    x: 138, y: 118, color: "#4dd0e1", shape: "diamond",
    tip: "Socket gems, combine gem tiers, craft jewelry. Combine 3 of the same tier to upgrade. Flawless Royal is the endgame standard." },

  // LEFT SIDE: Followers + merchants
  { id: "ferryman",  name: "Ferryman / Followers",  sub: "Scoundrel · Witch Doctor · Wizard followers",
    x: 100, y: 185, color: "#b0bec5", shape: "circle",
    tip: "Followers unlock here. Lyndon (Scoundrel) is best for speed farming. Kormac (Templar) is best for survivability." },

  { id: "argus",     name: "Argus the Collector",   sub: "Merchant · Witch Doctor / Wizard",
    x: 118, y: 220, color: "#a5d6a7", shape: "circle",
    tip: "Merchant selling potions and miscellaneous items. Also where Witch Doctor and Wizard followers are found." },

  // CENTER: Inn, Tashun, Malachi
  { id: "inn",       name: "Inn",                   sub: "Slaughtered Calf Inn · Stash inside",
    x: 205, y: 195, color: "#ffd54f", shape: "square",
    tip: "Your stash is inside the inn. Leah is here. Deposit crafting materials and gems before long runs." },

  { id: "tashun",    name: "Tashun the Miner",      sub: "Merchant",
    x: 248, y: 175, color: "#a5d6a7", shape: "circle",
    tip: "Merchant selling mining supplies. Check his stock for useful early-game items." },

  { id: "malachi",   name: "Brother Malachi",       sub: "Healer",
    x: 285, y: 188, color: "#ef9a9a", shape: "heart",
    tip: "Healer — restores your health and removes debuffs. Visit before heading into dungeons." },

  // CENTER-RIGHT: Cain, Blacksmith, Waypoint
  { id: "cain",      name: "Cain's House",          sub: "Deckard Cain · Item Identification",
    x: 228, y: 228, color: "#a5d6a7", shape: "circle",
    tip: "Deckard Cain identifies items for free. Always visit before selling or salvaging unidentified gear." },

  { id: "blacksmith",name: "Haedrig Eamon",         sub: "Blacksmith",
    x: 295, y: 228, color: "#ffd54f", shape: "square",
    tip: "Blacksmith — craft, salvage, and upgrade gear. Salvage all non-Legendary items you don't need for crafting materials." },

  { id: "waypoint",  name: "Waypoint",              sub: "New Tristram · Activate first",
    x: 268, y: 215, color: "#4dd0e1", shape: "diamond",
    tip: "ALWAYS activate this the moment you enter town. It lets you teleport back instantly from anywhere in Act I." },

  // RIGHT EDGE: Dungeons
  { id: "dungeons",  name: "Dungeons Always Spawn", sub: "Warrior's Rest · Forsaken Grounds",
    x: 365, y: 210, color: "#90caf9", shape: "diamond",
    tip: "Two dungeons always spawn here. Each has a guaranteed elite pack and potential Resplendent Chest. Always enter them." },
];

export default function NewTristramMap({ width = 680, height = 520 }: { width?: number; height?: number }) {
  const [selected, setSelected] = useState<Poi | null>(null);

  // Scale from 500x400 design space to actual render size
  const sx = width / 500;
  const sy = height / 400;
  const s = (x: number) => x * sx;
  const t = (y: number) => y * sy;

  const renderMarker = (poi: Poi) => {
    const x = s(poi.x);
    const y = t(poi.y);
    const isSelected = selected?.id === poi.id;
    const r = isSelected ? 10 : 7;
    const c = poi.color;

    return (
      <g key={poi.id} onClick={() => setSelected(isSelected ? null : poi)} style={{ cursor: "pointer" }}>
        {isSelected && (
          <circle cx={x} cy={y} r={r + 6} fill="none" stroke={c} strokeWidth={1.5} opacity={0.4} />
        )}
        {poi.shape === "diamond" ? (
          <polygon
            points={`${x},${y - r} ${x + r},${y} ${x},${y + r} ${x - r},${y}`}
            fill={isSelected ? c : `${c}bb`}
            stroke={isSelected ? "white" : c}
            strokeWidth={isSelected ? 2 : 1.5}
            style={{ filter: isSelected ? `drop-shadow(0 0 5px ${c})` : undefined }}
          />
        ) : poi.shape === "heart" ? (
          <g>
            <circle cx={x - r * 0.3} cy={y - r * 0.1} r={r * 0.65}
              fill={isSelected ? c : `${c}bb`} stroke={isSelected ? "white" : c} strokeWidth={1} />
            <circle cx={x + r * 0.3} cy={y - r * 0.1} r={r * 0.65}
              fill={isSelected ? c : `${c}bb`} stroke={isSelected ? "white" : c} strokeWidth={1} />
            <polygon points={`${x - r},${y} ${x + r},${y} ${x},${y + r * 1.1}`}
              fill={isSelected ? c : `${c}bb`} />
          </g>
        ) : poi.shape === "square" ? (
          <rect x={x - r} y={y - r} width={r * 2} height={r * 2} rx={2}
            fill={isSelected ? c : `${c}bb`}
            stroke={isSelected ? "white" : c}
            strokeWidth={isSelected ? 2 : 1.5}
            style={{ filter: isSelected ? `drop-shadow(0 0 4px ${c})` : undefined }}
          />
        ) : (
          <circle cx={x} cy={y} r={r}
            fill={isSelected ? c : `${c}bb`}
            stroke={isSelected ? "white" : c}
            strokeWidth={isSelected ? 2 : 1.5}
            style={{ filter: isSelected ? `drop-shadow(0 0 4px ${c})` : undefined }}
          />
        )}
        {/* Label — always visible, positioned to avoid overlap */}
        <text
          x={x + (poi.x > 300 ? 12 : -12)}
          y={y + 4}
          textAnchor={poi.x > 300 ? "start" : "end"}
          fontSize={s(8.5)}
          fill={isSelected ? c : `${c}cc`}
          fontFamily="'Cinzel', serif"
          fontWeight={isSelected ? "bold" : "normal"}
          style={{ userSelect: "none", pointerEvents: "none" }}>
          {poi.name}
        </text>
        {isSelected && (
          <text
            x={x + (poi.x > 300 ? 12 : -12)}
            y={y + 4 + s(10)}
            textAnchor={poi.x > 300 ? "start" : "end"}
            fontSize={s(7)}
            fill={`${c}99`}
            fontFamily="'Cinzel', serif"
            style={{ userSelect: "none", pointerEvents: "none" }}>
            {poi.sub}
          </text>
        )}
      </g>
    );
  };

  return (
    <div style={{ width, fontFamily: "'Cinzel', serif" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={{ background: "#030201", borderRadius: "8px", display: "block" }}>

        {/* ── TOWN TERRAIN BLOB ── */}
        {/* Outer dark terrain — the explored area of the town */}
        {/* Shape matches the reference: compact oval blob, slightly wider left-center */}
        <path
          d={`M ${s(155)},${t(55)}
              C ${s(175)},${t(38)} ${s(210)},${t(32)} ${s(250)},${t(35)}
              C ${s(295)},${t(38)} ${s(335)},${t(48)} ${s(365)},${t(68)}
              C ${s(390)},${t(85)} ${s(400)},${t(110)} ${s(398)},${t(140)}
              C ${s(396)},${t(168)} ${s(385)},${t(195)} ${s(370)},${t(218)}
              C ${s(355)},${t(242)} ${s(330)},${t(260)} ${s(300)},${t(272)}
              C ${s(270)},${t(284)} ${s(235)},${t(288)} ${s(200)},${t(282)}
              C ${s(165)},${t(276)} ${s(132)},${t(258)} ${s(110)},${t(232)}
              C ${s(88)},${t(206)} ${s(80)},${t(172)} ${s(85)},${t(142)}
              C ${s(90)},${t(112)} ${s(108)},${t(85)} ${s(132)},${t(68)}
              Z`}
          fill="#1c1208"
          stroke="#2e1e0a"
          strokeWidth={s(3)}
        />

        {/* Soft inner glow — the ambient light of the town */}
        <path
          d={`M ${s(175)},${t(80)}
              C ${s(195)},${t(65)} ${s(225)},${t(60)} ${s(255)},${t(62)}
              C ${s(290)},${t(65)} ${s(320)},${t(78)} ${s(342)},${t(98)}
              C ${s(362)},${t(116)} ${s(368)},${t(142)} ${s(362)},${t(168)}
              C ${s(356)},${t(194)} ${s(338)},${t(215)} ${s(312)},${t(228)}
              C ${s(286)},${t(242)} ${s(255)},${t(246)} ${s(225)},${t(240)}
              C ${s(195)},${t(234)} ${s(168)},${t(218)} ${s(150)},${t(196)}
              C ${s(132)},${t(174)} ${s(128)},${t(148)} ${s(135)},${t(124)}
              C ${s(142)},${t(100)} ${s(158)},${t(84)} ${s(175)},${t(80)}
              Z`}
          fill="#221508"
          opacity={0.7}
        />

        {/* ── ROADS ── */}
        {/* Main road running through the center of town */}
        <path d={`M ${s(240)},${t(290)} L ${s(242)},${t(260)} L ${s(245)},${t(230)} L ${s(248)},${t(200)} L ${s(250)},${t(170)} L ${s(248)},${t(140)} L ${s(245)},${t(110)} L ${s(242)},${t(80)} L ${s(245)},${t(55)}`}
          fill="none" stroke="#3a2810" strokeWidth={s(10)} strokeLinecap="round" />
        <path d={`M ${s(240)},${t(290)} L ${s(242)},${t(260)} L ${s(245)},${t(230)} L ${s(248)},${t(200)} L ${s(250)},${t(170)} L ${s(248)},${t(140)} L ${s(245)},${t(110)} L ${s(242)},${t(80)} L ${s(245)},${t(55)}`}
          fill="none" stroke="#4a3418" strokeWidth={s(5)} strokeLinecap="round" />

        {/* Cross street east-west */}
        <path d={`M ${s(100)},${t(195)} L ${s(160)},${t(195)} L ${s(220)},${t(195)} L ${s(280)},${t(195)} L ${s(340)},${t(195)} L ${s(390)},${t(195)}`}
          fill="none" stroke="#3a2810" strokeWidth={s(8)} strokeLinecap="round" />
        <path d={`M ${s(100)},${t(195)} L ${s(160)},${t(195)} L ${s(220)},${t(195)} L ${s(280)},${t(195)} L ${s(340)},${t(195)} L ${s(390)},${t(195)}`}
          fill="none" stroke="#4a3418" strokeWidth={s(4)} strokeLinecap="round" />

        {/* ── ROAD EXIT LABELS ── */}
        {/* Old Tristram Road — top right, exits the blob */}
        <line x1={s(320)} y1={t(60)} x2={s(420)} y2={t(20)}
          stroke="#6b4820" strokeWidth={s(2)} strokeDasharray={`${s(6)} ${s(4)}`} />
        <text x={s(430)} y={t(18)} fontSize={s(9)} fill="#8b6030"
          fontFamily="'Cinzel', serif" fontStyle="italic">Old Tristram Road →</text>

        {/* Overlook Road — bottom, exits south */}
        <line x1={s(245)} y1={t(295)} x2={s(245)} y2={t(345)}
          stroke="#6b4820" strokeWidth={s(2)} strokeDasharray={`${s(6)} ${s(4)}`} />
        <text x={s(245)} y={t(360)} textAnchor="middle" fontSize={s(9)} fill="#8b6030"
          fontFamily="'Cinzel', serif" fontStyle="italic">↓ Overlook Road</text>

        {/* ── TOWN NAME ── */}
        <text x={s(245)} y={t(308)} textAnchor="middle" fontSize={s(14)} fill="#d4a843"
          fontFamily="'Cinzel Decorative', serif" fontWeight="bold">TRISTRAM</text>
        <text x={s(245)} y={t(322)} textAnchor="middle" fontSize={s(8)} fill="#8b6030"
          fontFamily="'Cinzel', serif">Act I</text>

        {/* ── POI MARKERS ── */}
        {POIS.map(renderMarker)}

      </svg>

      {/* Detail panel */}
      {selected && (
        <div className="mt-2 p-3 rounded-lg border"
          style={{ background: "oklch(0.09 0.010 30)", borderColor: `${selected.color}44` }}>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <p className="font-cinzel font-bold text-sm" style={{ color: selected.color }}>{selected.name}</p>
              <p className="font-cinzel" style={{ color: "oklch(0.60 0.010 60)", fontSize: "0.6rem" }}>{selected.sub}</p>
            </div>
            <button onClick={() => setSelected(null)} style={{ color: "oklch(0.55 0.010 60)", fontSize: "1.2rem" }}>×</button>
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
