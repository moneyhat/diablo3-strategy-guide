// Sanctuary Grimoire — SVG Zone Topology Maps
// Original SVG maps based on the documented tile-pattern structures of each zone:
// - Cathedral: square loop with branching corridors
// - Halls of Agony: rectangular loop with long entrance corridor
// - Silver Spire: figure-eight double loop
// - Caverns of Araneae: organic web structure
// - Sewers of Caldeum: linear main path with side loops
// - Arreat Crater: winding choke-point corridors
// - Westmarch Commons: city grid with interconnected rectangular loops
// - Battlefields of Eternity: open tile structure
// All paths use bezier curves for organic, non-linear feel

import React, { useState } from "react";

// ─── Shared types ─────────────────────────────────────────────────────────────
interface ZoneMapPoi {
  id: string; x: number; y: number; type: string; label: string; tip: string;
}

interface ZoneMapProps {
  width?: number; height?: number;
  onPoiClick?: (poi: ZoneMapPoi) => void;
  selectedPoi?: string | null;
}

// ─── Color palettes per zone theme ───────────────────────────────────────────
const THEMES = {
  cathedral:    { floor: "#3d2e1a", wall: "#1a1208", path: "#5a4228", accent: "#8b0000", glow: "#c0392b" },
  halls_agony:  { floor: "#2a1a1a", wall: "#0f0808", path: "#4a2020", accent: "#8b0000", glow: "#ef5350" },
  fields:       { floor: "#2a3a1a", wall: "#0f1508", path: "#3a5020", accent: "#2e7d32", glow: "#66bb6a" },
  sewers:       { floor: "#1a2a2a", wall: "#080f0f", path: "#203a3a", accent: "#c8860a", glow: "#ffd54f" },
  arreat:       { floor: "#3a1a0a", wall: "#150a03", path: "#5a2a10", accent: "#c0392b", glow: "#ff7043" },
  silver_spire: { floor: "#2a2a3a", wall: "#0f0f18", path: "#3a3a5a", accent: "#5b9bd5", glow: "#90caf9" },
  westmarch:    { floor: "#1a1a2a", wall: "#080810", path: "#2a2a3a", accent: "#8e44ad", glow: "#ce93d8" },
  battlefields: { floor: "#1a2a1a", wall: "#080f08", path: "#2a3a2a", accent: "#8e44ad", glow: "#a5d6a7" },
  ruins_corvus: { floor: "#1a1020", wall: "#08060f", path: "#2a1a30", accent: "#8e44ad", glow: "#ce93d8" },
  archives:     { floor: "#2a2010", wall: "#0f0a05", path: "#3a3018", accent: "#c8860a", glow: "#ffd54f" },
};

// ─── POI marker ───────────────────────────────────────────────────────────────
function PoiMarker({ poi, isSelected, onClick, color }: {
  poi: ZoneMapPoi; isSelected: boolean; onClick: () => void; color: string;
}) {
  const icons: Record<string, string> = {
    waypoint: "⬟", boss: "☠", entrance: "▼", exit: "▲",
    chest: "◈", elite: "⚔", event: "!", keywarden: "🔑",
  };
  return (
    <g onClick={onClick} style={{ cursor: "pointer" }}>
      <circle cx={poi.x} cy={poi.y} r={isSelected ? 10 : 7}
        fill={isSelected ? color : `${color}99`}
        stroke={isSelected ? "white" : color}
        strokeWidth={isSelected ? 2 : 1.5}
        filter={isSelected ? `drop-shadow(0 0 6px ${color})` : undefined} />
      <text x={poi.x} y={poi.y + 4} textAnchor="middle"
        fontSize={isSelected ? 9 : 7} fill="white" style={{ userSelect: "none", pointerEvents: "none" }}>
        {icons[poi.type] || "•"}
      </text>
      {isSelected && (
        <text x={poi.x} y={poi.y + 20} textAnchor="middle"
          fontSize={8} fill={color} fontFamily="'Cinzel', serif"
          style={{ userSelect: "none", pointerEvents: "none" }}>
          {poi.label}
        </text>
      )}
    </g>
  );
}

// ─── Corridor path helper ─────────────────────────────────────────────────────
// Draws a corridor as a thick path with floor fill and wall outline
function Corridor({ d, theme, width = 22 }: { d: string; theme: typeof THEMES.cathedral; width?: number }) {
  return (
    <g>
      {/* Wall (outer stroke) */}
      <path d={d} fill="none" stroke={theme.wall} strokeWidth={width + 6} strokeLinecap="round" strokeLinejoin="round" />
      {/* Floor (inner fill) */}
      <path d={d} fill="none" stroke={theme.floor} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      {/* Subtle texture line */}
      <path d={d} fill="none" stroke={theme.path} strokeWidth={width - 8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 6" opacity={0.4} />
    </g>
  );
}

// Draws a room (filled polygon)
function Room({ points, theme }: { points: string; theme: typeof THEMES.cathedral }) {
  return (
    <g>
      <polygon points={points} fill={theme.floor} stroke={theme.wall} strokeWidth={5} />
      <polygon points={points} fill="none" stroke={theme.path} strokeWidth={2} opacity={0.3} />
    </g>
  );
}

// ─── CATHEDRAL — Square loop with branching corridors ─────────────────────────
// Based on video: large square loop, smaller paths branching off outside edges
// 90-degree turns, straight corridors
export function CathedralMap({ width = 900, height = 700, onPoiClick, selectedPoi }: ZoneMapProps) {
  const t = THEMES.cathedral;
  const pois: ZoneMapPoi[] = [
    { id: "entrance", x: 450, y: 650, type: "entrance", label: "Entrance", tip: "Enter from Cathedral Garden waypoint." },
    { id: "wp-l1",    x: 450, y: 580, type: "waypoint",  label: "Level 1 WP", tip: "Waypoint on Level 1." },
    { id: "boss-leoric", x: 450, y: 80, type: "boss",    label: "Skeleton King", tip: "Kill summoned skeletons first, then focus him." },
    { id: "elite-1",  x: 200, y: 350, type: "elite",     label: "Elite Pack", tip: "Guaranteed elite pack in the west wing." },
    { id: "elite-2",  x: 700, y: 350, type: "elite",     label: "Elite Pack", tip: "Guaranteed elite pack in the east wing." },
    { id: "chest-1",  x: 150, y: 200, type: "chest",     label: "Chest Room", tip: "Dead-end alcove with potential Resplendent Chest." },
    { id: "exit-l2",  x: 450, y: 130, type: "exit",      label: "Level 2 Exit", tip: "Stairs down to Cathedral Level 2." },
  ];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
      style={{ background: "#050305", borderRadius: "8px" }}>
      <defs>
        <filter id="glow-cat">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── SQUARE LOOP — the main structure ── */}
      {/* Main entrance corridor (south) */}
      <Corridor d="M 450 650 L 450 520" theme={t} width={26} />

      {/* Bottom of the loop — horizontal */}
      <Corridor d="M 200 520 L 700 520" theme={t} width={26} />

      {/* Left side of loop — vertical */}
      <Corridor d="M 200 520 L 200 200" theme={t} width={26} />

      {/* Right side of loop — vertical */}
      <Corridor d="M 700 520 L 700 200" theme={t} width={26} />

      {/* Top of the loop — horizontal */}
      <Corridor d="M 200 200 L 700 200" theme={t} width={26} />

      {/* Boss chamber at top */}
      <Room points="380,60 520,60 520,200 380,200" theme={t} />

      {/* ── BRANCHING CORRIDORS off the outside edges ── */}
      {/* West branch — dead-end alcove */}
      <Corridor d="M 200 350 C 150 350 130 320 130 280 L 130 200" theme={t} width={20} />
      <Room points="90,160 170,160 170,200 90,200" theme={t} />

      {/* East branch — dead-end alcove */}
      <Corridor d="M 700 350 C 750 350 770 320 770 280 L 770 200" theme={t} width={20} />
      <Room points="730,160 810,160 810,200 730,200" theme={t} />

      {/* South-west branch */}
      <Corridor d="M 200 450 C 120 450 100 430 100 400 L 100 360" theme={t} width={18} />
      <Room points="70,330 130,330 130,360 70,360" theme={t} />

      {/* South-east branch */}
      <Corridor d="M 700 450 C 780 450 800 430 800 400 L 800 360" theme={t} width={18} />
      <Room points="770,330 830,330 830,360 770,360" theme={t} />

      {/* North-west branch */}
      <Corridor d="M 300 200 L 300 130 C 300 100 280 80 250 80 L 200 80" theme={t} width={18} />
      <Room points="160,60 200,60 200,100 160,100" theme={t} />

      {/* North-east branch */}
      <Corridor d="M 600 200 L 600 130 C 600 100 620 80 650 80 L 700 80" theme={t} width={18} />
      <Room points="700,60 740,60 740,100 700,100" theme={t} />

      {/* ── INTERSECTION MARKERS ── */}
      {[
        { x: 200, y: 520 }, { x: 700, y: 520 },
        { x: 200, y: 200 }, { x: 700, y: 200 },
        { x: 200, y: 350 }, { x: 700, y: 350 },
      ].map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r={5} fill={t.accent} opacity={0.7} />
      ))}

      {/* ── AMBIENT GLOW ── */}
      <circle cx={450} cy={350} r={200} fill={t.glow} opacity={0.03} />

      {/* ── POI MARKERS ── */}
      {pois.map((poi) => (
        <PoiMarker key={poi.id} poi={poi}
          isSelected={selectedPoi === poi.id}
          onClick={() => onPoiClick?.(poi)}
          color={poi.type === "boss" ? "#ff7043" : poi.type === "waypoint" ? "#80cbc4" : poi.type === "chest" ? "#ffd54f" : t.accent} />
      ))}

      {/* ── LABELS ── */}
      <text x={450} y={30} textAnchor="middle" fontSize={14} fill={t.glow}
        fontFamily="'Cinzel Decorative', serif" fontWeight="bold">
        Cathedral
      </text>
      <text x={450} y={48} textAnchor="middle" fontSize={9} fill={`${t.glow}88`} fontFamily="'Cinzel', serif">
        Square Loop Pattern · 4 Levels
      </text>
    </svg>
  );
}

// ─── HALLS OF AGONY — Rectangular loop with long entrance corridor ─────────────
// Based on video: structured rectangular loop, long entrance corridor, boss at end
export function HallsOfAgonyMap({ width = 900, height = 700, onPoiClick, selectedPoi }: ZoneMapProps) {
  const t = THEMES.halls_agony;
  const pois: ZoneMapPoi[] = [
    { id: "entrance",    x: 450, y: 660, type: "entrance",  label: "Entrance", tip: "Enter from Leoric's Passage." },
    { id: "wp-hoa",      x: 450, y: 560, type: "waypoint",  label: "Halls WP", tip: "Waypoint — activate immediately." },
    { id: "boss-butcher",x: 450, y: 80,  type: "boss",      label: "The Butcher", tip: "Stay mobile. Dodge charge and fire chains." },
    { id: "elite-1",     x: 200, y: 300, type: "elite",     label: "Torture Chamber", tip: "Dense elite pack in the west torture wing." },
    { id: "elite-2",     x: 700, y: 300, type: "elite",     label: "Cage Room", tip: "Elite pack guarding the cage room." },
    { id: "elite-3",     x: 450, y: 200, type: "elite",     label: "Inner Sanctum", tip: "Multiple elite packs in the inner sanctum." },
    { id: "chest-1",     x: 150, y: 450, type: "chest",     label: "Alcove Chest", tip: "Check this dead-end for Resplendent Chest." },
  ];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
      style={{ background: "#030101", borderRadius: "8px" }}>

      {/* ── LONG ENTRANCE CORRIDOR ── */}
      <Corridor d="M 450 660 L 450 560" theme={t} width={28} />

      {/* ── RECTANGULAR LOOP ── */}
      {/* Bottom horizontal */}
      <Corridor d="M 180 480 C 280 480 350 480 450 480 C 550 480 620 480 720 480" theme={t} width={26} />
      {/* Left vertical */}
      <Corridor d="M 180 480 C 180 420 170 360 170 300 C 170 240 180 180 180 140" theme={t} width={26} />
      {/* Right vertical */}
      <Corridor d="M 720 480 C 720 420 730 360 730 300 C 730 240 720 180 720 140" theme={t} width={26} />
      {/* Top horizontal */}
      <Corridor d="M 180 140 C 280 140 350 140 450 140 C 550 140 620 140 720 140" theme={t} width={26} />

      {/* ── BOSS CHAMBER ── */}
      <Room points="370,60 530,60 530,140 370,140" theme={t} />

      {/* ── TORTURE CHAMBERS branching off the loop ── */}
      {/* West torture wing */}
      <Corridor d="M 170 300 C 130 300 110 290 100 270 L 100 240" theme={t} width={22} />
      <Room points="70,200 130,200 130,240 70,240" theme={t} />

      {/* East cage room */}
      <Corridor d="M 730 300 C 770 300 790 290 800 270 L 800 240" theme={t} width={22} />
      <Room points="770,200 830,200 830,240 770,240" theme={t} />

      {/* South-west alcove */}
      <Corridor d="M 180 420 C 140 420 120 410 110 390 L 110 360" theme={t} width={18} />
      <Room points="80,340 140,340 140,370 80,370" theme={t} />

      {/* South-east alcove */}
      <Corridor d="M 720 420 C 760 420 780 410 790 390 L 790 360" theme={t} width={18} />
      <Room points="760,340 820,340 820,370 760,370" theme={t} />

      {/* Inner cross-corridor */}
      <Corridor d="M 450 480 L 450 140" theme={t} width={20} />

      {/* ── INTERSECTION MARKERS ── */}
      {[
        { x: 180, y: 480 }, { x: 720, y: 480 },
        { x: 180, y: 140 }, { x: 720, y: 140 },
        { x: 450, y: 480 }, { x: 450, y: 140 },
        { x: 180, y: 300 }, { x: 720, y: 300 },
      ].map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r={5} fill={t.accent} opacity={0.8} />
      ))}

      {/* Blood stains */}
      {[[300, 350], [600, 250], [450, 380]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={12} fill="#8b0000" opacity={0.15} />
      ))}

      {pois.map((poi) => (
        <PoiMarker key={poi.id} poi={poi}
          isSelected={selectedPoi === poi.id}
          onClick={() => onPoiClick?.(poi)}
          color={poi.type === "boss" ? "#ff7043" : poi.type === "waypoint" ? "#80cbc4" : poi.type === "chest" ? "#ffd54f" : "#ef5350"} />
      ))}

      <text x={450} y={30} textAnchor="middle" fontSize={14} fill={t.glow}
        fontFamily="'Cinzel Decorative', serif" fontWeight="bold">Halls of Agony</text>
      <text x={450} y={48} textAnchor="middle" fontSize={9} fill={`${t.glow}88`} fontFamily="'Cinzel', serif">
        Rectangular Loop · Long Entrance Corridor
      </text>
    </svg>
  );
}

// ─── SILVER SPIRE — Figure-eight double loop ──────────────────────────────────
// Based on video: clear figure-eight or double-loop pattern, celestial environment
export function SilverSpireMap({ width = 900, height = 700, onPoiClick, selectedPoi }: ZoneMapProps) {
  const t = THEMES.silver_spire;
  const pois: ZoneMapPoi[] = [
    { id: "entrance",    x: 450, y: 660, type: "entrance",  label: "Entrance", tip: "Enter from Diamond Gates." },
    { id: "wp-spire",    x: 450, y: 560, type: "waypoint",  label: "Spire L1 WP", tip: "Activate immediately — key waypoint." },
    { id: "boss-diablo", x: 450, y: 60,  type: "boss",      label: "Diablo", tip: "Phase 3: avoid shadow clones and lightning breath." },
    { id: "kw-nekarat",  x: 700, y: 350, type: "keywarden", label: "Nekarat", tip: "Act IV Keywarden. Drops Key of Bones on Torment I+." },
    { id: "elite-1",     x: 250, y: 250, type: "elite",     label: "Elite Pack", tip: "Elite pack in the lower loop west wing." },
    { id: "elite-2",     x: 650, y: 250, type: "elite",     label: "Elite Pack", tip: "Elite pack in the lower loop east wing." },
    { id: "elite-3",     x: 250, y: 450, type: "elite",     label: "Elite Pack", tip: "Elite pack in the upper loop west wing." },
  ];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
      style={{ background: "#030308", borderRadius: "8px" }}>
      <defs>
        <radialGradient id="spire-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5b9bd5" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#5b9bd5" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={width} height={height} fill="url(#spire-glow)" />

      {/* ── ENTRANCE ── */}
      <Corridor d="M 450 660 L 450 580" theme={t} width={28} />

      {/* ── FIGURE-EIGHT: Lower loop ── */}
      {/* Lower loop — left arc */}
      <Corridor d="M 450 580 C 350 580 220 540 200 450 C 180 360 220 280 300 260 C 380 240 420 280 450 340" theme={t} width={24} />
      {/* Lower loop — right arc */}
      <Corridor d="M 450 580 C 550 580 680 540 700 450 C 720 360 680 280 600 260 C 520 240 480 280 450 340" theme={t} width={24} />

      {/* ── FIGURE-EIGHT: Center crossing point ── */}
      <Room points="420,320 480,320 480,360 420,360" theme={t} />

      {/* ── FIGURE-EIGHT: Upper loop ── */}
      {/* Upper loop — left arc */}
      <Corridor d="M 450 340 C 380 300 260 280 240 220 C 220 160 280 100 350 90 C 420 80 450 120 450 160" theme={t} width={24} />
      {/* Upper loop — right arc */}
      <Corridor d="M 450 340 C 520 300 640 280 660 220 C 680 160 620 100 550 90 C 480 80 450 120 450 160" theme={t} width={24} />

      {/* ── BOSS CHAMBER at top ── */}
      <Room points="390,60 510,60 510,160 390,160" theme={t} />

      {/* ── SIDE CHAMBERS ── */}
      {/* West alcove off lower loop */}
      <Corridor d="M 200 400 C 150 400 130 380 120 360 L 120 330" theme={t} width={18} />
      <Room points="90,310 150,310 150,340 90,340" theme={t} />

      {/* East alcove off lower loop */}
      <Corridor d="M 700 400 C 750 400 770 380 780 360 L 780 330" theme={t} width={18} />
      <Room points="750,310 810,310 810,340 750,340" theme={t} />

      {/* ── INTERSECTION MARKERS at the figure-eight crossing ── */}
      {[{ x: 450, y: 340 }, { x: 450, y: 580 }, { x: 450, y: 160 }].map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r={6} fill={t.accent}
          stroke="white" strokeWidth={1} opacity={0.9}
          filter="url(#glow-cat)" />
      ))}

      {/* Crystal pillars */}
      {[[300, 420], [600, 420], [300, 200], [600, 200]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={8} fill={t.accent} opacity={0.3} />
          <circle cx={x} cy={y} r={4} fill={t.glow} opacity={0.6} />
        </g>
      ))}

      {pois.map((poi) => (
        <PoiMarker key={poi.id} poi={poi}
          isSelected={selectedPoi === poi.id}
          onClick={() => onPoiClick?.(poi)}
          color={poi.type === "boss" ? "#ff7043" : poi.type === "waypoint" ? "#80cbc4" : poi.type === "keywarden" ? "#ce93d8" : t.glow} />
      ))}

      <text x={450} y={30} textAnchor="middle" fontSize={14} fill={t.glow}
        fontFamily="'Cinzel Decorative', serif" fontWeight="bold">Silver Spire</text>
      <text x={450} y={48} textAnchor="middle" fontSize={9} fill={`${t.glow}88`} fontFamily="'Cinzel', serif">
        Figure-Eight Double Loop Pattern
      </text>
    </svg>
  );
}

// ─── ARREAT CRATER — Winding choke-point corridors ────────────────────────────
// Based on video: massive irregular tiles, very narrow choke-point connections
// Creates a highly linear, winding flow
export function ArreatCraterMap({ width = 900, height = 700, onPoiClick, selectedPoi }: ZoneMapProps) {
  const t = THEMES.arreat;
  const pois: ZoneMapPoi[] = [
    { id: "entrance",    x: 450, y: 660, type: "entrance",  label: "Entrance", tip: "Enter from Rakkis Crossing." },
    { id: "wp-crater",   x: 450, y: 580, type: "waypoint",  label: "Crater WP", tip: "Activate immediately." },
    { id: "boss-azmodan",x: 450, y: 80,  type: "boss",      label: "Azmodan", tip: "Dodge blood pools. Kill summoned demons quickly." },
    { id: "elite-1",     x: 280, y: 420, type: "elite",     label: "Choke Point", tip: "Elite pack guarding the western choke point." },
    { id: "elite-2",     x: 620, y: 320, type: "elite",     label: "Lava Bridge", tip: "Elite pack on the lava bridge." },
    { id: "elite-3",     x: 350, y: 200, type: "elite",     label: "Inner Crater", tip: "Multiple elites in the inner crater." },
  ];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
      style={{ background: "#050100", borderRadius: "8px" }}>
      <defs>
        <radialGradient id="lava-glow" cx="50%" cy="60%" r="40%">
          <stop offset="0%" stopColor="#ff7043" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ff7043" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={width} height={height} fill="url(#lava-glow)" />

      {/* ── WINDING MAIN PATH — choke points connect massive irregular zones ── */}
      {/* Entrance to first zone */}
      <Corridor d="M 450 660 C 450 620 440 600 420 580 C 400 560 380 550 350 540" theme={t} width={30} />

      {/* First large zone (irregular shape) */}
      <path d="M 200 480 C 180 500 160 520 170 550 C 180 580 220 590 270 580 C 320 570 370 550 400 530 C 430 510 450 490 440 460 C 430 430 400 420 360 420 C 320 420 280 430 250 450 C 220 470 210 480 200 480 Z"
        fill={t.floor} stroke={t.wall} strokeWidth={5} />

      {/* Choke point 1 — narrow passage */}
      <Corridor d="M 350 540 C 330 530 310 510 290 490 C 270 470 260 450 250 430" theme={t} width={16} />

      {/* Second zone */}
      <path d="M 180 360 C 160 380 150 410 160 440 C 170 470 200 480 230 470 C 260 460 280 440 290 410 C 300 380 290 350 270 330 C 250 310 220 310 200 320 C 180 330 185 350 180 360 Z"
        fill={t.floor} stroke={t.wall} strokeWidth={5} />

      {/* Choke point 2 */}
      <Corridor d="M 250 430 C 280 400 320 380 360 360 C 400 340 440 330 460 310" theme={t} width={16} />

      {/* Third zone — wider */}
      <path d="M 350 250 C 330 270 320 300 330 330 C 340 360 370 370 410 360 C 450 350 490 320 510 290 C 530 260 530 230 510 210 C 490 190 460 190 430 200 C 400 210 370 230 350 250 Z"
        fill={t.floor} stroke={t.wall} strokeWidth={5} />

      {/* Choke point 3 — very narrow */}
      <Corridor d="M 460 310 C 500 290 540 270 570 250 C 600 230 620 210 630 190" theme={t} width={14} />

      {/* Fourth zone */}
      <path d="M 560 140 C 540 160 530 190 540 220 C 550 250 580 260 620 250 C 660 240 700 210 710 180 C 720 150 700 120 670 110 C 640 100 610 110 590 120 C 570 130 565 135 560 140 Z"
        fill={t.floor} stroke={t.wall} strokeWidth={5} />

      {/* Choke point 4 */}
      <Corridor d="M 630 190 C 600 170 570 150 540 130 C 510 110 490 90 470 80" theme={t} width={14} />

      {/* Boss arena */}
      <path d="M 380 60 C 360 80 360 110 380 130 C 400 150 440 160 480 150 C 520 140 550 110 540 80 C 530 50 500 40 470 40 C 440 40 400 40 380 60 Z"
        fill={t.floor} stroke={t.wall} strokeWidth={5} />

      {/* Lava pools */}
      {[[300, 500], [500, 380], [420, 260], [640, 200]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={20} ry={12} fill="#ff7043" opacity={0.25} />
      ))}

      {/* Choke point markers */}
      {[[290, 490], [360, 360], [570, 250], [470, 80]].map((pt, i) => (
        <g key={i}>
          <circle cx={pt[0]} cy={pt[1]} r={6} fill="none" stroke={t.glow} strokeWidth={2} opacity={0.7} />
          <line x1={pt[0] - 8} y1={pt[1]} x2={pt[0] + 8} y2={pt[1]} stroke={t.glow} strokeWidth={1.5} opacity={0.7} />
        </g>
      ))}

      {pois.map((poi) => (
        <PoiMarker key={poi.id} poi={poi}
          isSelected={selectedPoi === poi.id}
          onClick={() => onPoiClick?.(poi)}
          color={poi.type === "boss" ? "#ff7043" : poi.type === "waypoint" ? "#80cbc4" : "#ff7043"} />
      ))}

      <text x={450} y={30} textAnchor="middle" fontSize={14} fill={t.glow}
        fontFamily="'Cinzel Decorative', serif" fontWeight="bold">Arreat Crater</text>
      <text x={450} y={48} textAnchor="middle" fontSize={9} fill={`${t.glow}88`} fontFamily="'Cinzel', serif">
        Winding Choke-Point Corridors · Large Irregular Tiles
      </text>
    </svg>
  );
}

// ─── WESTMARCH COMMONS — City grid with interconnected rectangular loops ────────
// Based on video: complex dense layout resembling city streets
// Multiple interconnected square and rectangular loops
export function WestmarchCommonsMap({ width = 900, height = 700, onPoiClick, selectedPoi }: ZoneMapProps) {
  const t = THEMES.westmarch;
  const pois: ZoneMapPoi[] = [
    { id: "entrance",    x: 450, y: 660, type: "entrance",  label: "Entrance", tip: "Enter from Survivors' Enclave." },
    { id: "wp-commons",  x: 250, y: 500, type: "waypoint",  label: "Commons WP", tip: "Activate immediately." },
    { id: "elite-1",     x: 200, y: 300, type: "elite",     label: "Street Patrol", tip: "Elite pack patrolling the western district." },
    { id: "elite-2",     x: 650, y: 350, type: "elite",     label: "Market Square", tip: "Elite pack in the ruined market square." },
    { id: "elite-3",     x: 450, y: 200, type: "elite",     label: "Cathedral District", tip: "Multiple elites near the ruined cathedral." },
    { id: "event-1",     x: 350, y: 420, type: "event",     label: "Survivor Event", tip: "Rescue event — complete for bonus XP." },
    { id: "chest-1",     x: 700, y: 500, type: "chest",     label: "Hidden Cache", tip: "Check this dead-end alley for loot." },
  ];

  // City grid — multiple rectangular loops like city blocks
  const blocks = [
    // Block 1 — SW
    { x: 100, y: 400, w: 200, h: 150 },
    // Block 2 — NW
    { x: 100, y: 200, w: 200, h: 150 },
    // Block 3 — Center
    { x: 350, y: 280, w: 200, h: 160 },
    // Block 4 — NE
    { x: 600, y: 200, w: 200, h: 150 },
    // Block 5 — SE
    { x: 600, y: 400, w: 200, h: 150 },
    // Block 6 — Far north
    { x: 350, y: 80, w: 200, h: 160 },
  ];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
      style={{ background: "#030208", borderRadius: "8px" }}>

      {/* ── ENTRANCE ── */}
      <Corridor d="M 450 660 C 450 620 440 600 420 580 C 400 560 380 550 350 530" theme={t} width={26} />

      {/* ── CITY BLOCKS — interconnected rectangular loops ── */}
      {blocks.map((b, i) => (
        <g key={i}>
          {/* Outer wall */}
          <rect x={b.x} y={b.y} width={b.w} height={b.h}
            fill="none" stroke={t.wall} strokeWidth={8} />
          {/* Floor */}
          <rect x={b.x + 4} y={b.y + 4} width={b.w - 8} height={b.h - 8}
            fill={t.floor} stroke={t.path} strokeWidth={1} opacity={0.8} />
          {/* Interior detail — ruined building */}
          <rect x={b.x + 20} y={b.y + 20} width={b.w - 40} height={b.h - 40}
            fill={t.wall} stroke={t.path} strokeWidth={1} opacity={0.5} />
        </g>
      ))}

      {/* ── CONNECTING STREETS between blocks ── */}
      {/* Main north-south street */}
      <Corridor d="M 350 530 L 350 440 L 350 280 L 350 80" theme={t} width={22} />
      {/* East-west street (south) */}
      <Corridor d="M 100 475 L 350 475 L 600 475" theme={t} width={22} />
      {/* East-west street (north) */}
      <Corridor d="M 100 275 L 350 275 L 600 275" theme={t} width={22} />
      {/* West vertical */}
      <Corridor d="M 200 200 L 200 550" theme={t} width={22} />
      {/* East vertical */}
      <Corridor d="M 700 200 L 700 550" theme={t} width={22} />
      {/* Diagonal alley SW */}
      <Corridor d="M 300 475 C 280 500 260 520 240 530" theme={t} width={16} />
      {/* Diagonal alley NE */}
      <Corridor d="M 600 275 C 640 260 680 250 720 240" theme={t} width={16} />

      {/* ── DEAD-END ALLEYS ── */}
      <Corridor d="M 700 475 C 740 475 760 460 770 440 L 770 420" theme={t} width={14} />
      <Corridor d="M 100 275 C 70 275 60 260 55 240 L 55 220" theme={t} width={14} />

      {/* ── RUINED WALLS and debris ── */}
      {[[250, 380], [500, 460], [650, 320], [400, 160]].map(([x, y], i) => (
        <g key={i} opacity={0.4}>
          <rect x={x - 15} y={y - 5} width={30} height={10} fill={t.wall} transform={`rotate(${i * 30}, ${x}, ${y})`} />
        </g>
      ))}

      {/* ── INTERSECTION MARKERS ── */}
      {[[350, 475], [350, 275], [200, 475], [200, 275], [700, 475], [700, 275]].map((pt, i) => (
        <circle key={i} cx={pt[0]} cy={pt[1]} r={5} fill={t.accent} opacity={0.8} />
      ))}

      {pois.map((poi) => (
        <PoiMarker key={poi.id} poi={poi}
          isSelected={selectedPoi === poi.id}
          onClick={() => onPoiClick?.(poi)}
          color={poi.type === "waypoint" ? "#80cbc4" : poi.type === "chest" ? "#ffd54f" : poi.type === "event" ? "#66bb6a" : t.glow} />
      ))}

      <text x={450} y={30} textAnchor="middle" fontSize={14} fill={t.glow}
        fontFamily="'Cinzel Decorative', serif" fontWeight="bold">Westmarch Commons</text>
      <text x={450} y={48} textAnchor="middle" fontSize={9} fill={`${t.glow}88`} fontFamily="'Cinzel', serif">
        City Grid · Interconnected Rectangular Loops
      </text>
    </svg>
  );
}

// ─── RUINS OF CORVUS — Organic winding ruins ─────────────────────────────────
export function RuinsOfCorvusMap({ width = 900, height = 700, onPoiClick, selectedPoi }: ZoneMapProps) {
  const t = THEMES.ruins_corvus;
  const pois: ZoneMapPoi[] = [
    { id: "entrance",    x: 450, y: 660, type: "entrance",  label: "Entrance", tip: "Enter from Westmarch Commons." },
    { id: "wp-corvus",   x: 450, y: 580, type: "waypoint",  label: "Corvus WP", tip: "Best farming zone in Act V. Activate immediately." },
    { id: "boss-adria",  x: 450, y: 80,  type: "boss",      label: "Adria", tip: "Dodge her blood pools and summoned minions." },
    { id: "elite-1",     x: 220, y: 380, type: "elite",     label: "Haunted Ruins", tip: "Dense spectral elite pack." },
    { id: "elite-2",     x: 680, y: 300, type: "elite",     label: "Death Shrine", tip: "Elite pack guarding the death shrine." },
    { id: "elite-3",     x: 350, y: 200, type: "elite",     label: "Inner Sanctum", tip: "Multiple elites in the inner sanctum." },
    { id: "chest-1",     x: 150, y: 250, type: "chest",     label: "Hidden Crypt", tip: "Check this dead-end for Resplendent Chest." },
  ];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
      style={{ background: "#030106", borderRadius: "8px" }}>
      <defs>
        <radialGradient id="corvus-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8e44ad" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#8e44ad" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={width} height={height} fill="url(#corvus-glow)" />

      {/* ── ORGANIC WINDING MAIN PATH ── */}
      <Corridor d="M 450 660 C 450 630 440 610 420 590 C 400 570 380 560 360 550" theme={t} width={28} />

      {/* ── MAIN LOOP — organic irregular shape ── */}
      {/* Left arc — winding through ruins */}
      <Corridor d="M 360 550 C 300 540 240 510 200 470 C 160 430 150 380 160 330 C 170 280 200 240 240 210 C 280 180 330 170 370 180 C 410 190 440 220 450 260" theme={t} width={24} />

      {/* Right arc */}
      <Corridor d="M 360 550 C 420 540 480 510 520 470 C 560 430 580 380 570 330 C 560 280 530 240 490 210 C 450 180 410 170 380 180 C 350 190 340 220 350 260" theme={t} width={24} />

      {/* ── INNER AREA ── */}
      <path d="M 350 260 C 340 280 340 310 350 330 C 360 350 380 360 410 355 C 440 350 460 330 460 310 C 460 290 450 270 440 260 C 430 250 410 245 390 248 C 370 251 355 256 350 260 Z"
        fill={t.floor} stroke={t.wall} strokeWidth={5} />

      {/* Boss chamber */}
      <path d="M 380 60 C 360 80 360 110 380 130 C 400 150 440 160 470 150 C 500 140 520 110 510 80 C 500 50 470 40 450 40 C 430 40 400 40 380 60 Z"
        fill={t.floor} stroke={t.wall} strokeWidth={5} />

      {/* Path to boss */}
      <Corridor d="M 390 260 C 400 220 420 180 440 140 C 450 120 450 100 450 80" theme={t} width={20} />

      {/* ── SIDE BRANCHES — dead-end crypts ── */}
      <Corridor d="M 200 400 C 160 400 140 380 130 360 C 120 340 120 310 130 290 L 140 270" theme={t} width={18} />
      <path d="M 110,250 C 100,260 95,280 105,295 C 115,310 135,315 150,305 C 165,295 170,275 160,260 C 150,245 130,240 110,250 Z"
        fill={t.floor} stroke={t.wall} strokeWidth={4} />

      <Corridor d="M 560 380 C 600 380 630 360 650 340 C 670 320 680 290 670 270 L 660 250" theme={t} width={18} />
      <path d="M 640,230 C 630,240 625,260 635,275 C 645,290 665,295 680,285 C 695,275 700,255 690,240 C 680,225 660,220 640,230 Z"
        fill={t.floor} stroke={t.wall} strokeWidth={4} />

      {/* ── DEATH SYMBOLS scattered around ── */}
      {[[300, 450], [550, 300], [400, 150], [250, 300]].map(([x, y], i) => (
        <g key={i} opacity={0.3}>
          <circle cx={x} cy={y} r={10} fill="none" stroke={t.glow} strokeWidth={1} />
          <line x1={x - 8} y1={y} x2={x + 8} y2={y} stroke={t.glow} strokeWidth={1} />
          <line x1={x} y1={y - 8} x2={x} y2={y + 8} stroke={t.glow} strokeWidth={1} />
        </g>
      ))}

      {pois.map((poi) => (
        <PoiMarker key={poi.id} poi={poi}
          isSelected={selectedPoi === poi.id}
          onClick={() => onPoiClick?.(poi)}
          color={poi.type === "boss" ? "#ff7043" : poi.type === "waypoint" ? "#80cbc4" : poi.type === "chest" ? "#ffd54f" : t.glow} />
      ))}

      <text x={450} y={30} textAnchor="middle" fontSize={14} fill={t.glow}
        fontFamily="'Cinzel Decorative', serif" fontWeight="bold">Ruins of Corvus</text>
      <text x={450} y={48} textAnchor="middle" fontSize={9} fill={`${t.glow}88`} fontFamily="'Cinzel', serif">
        Organic Loop · Winding Ruined Corridors
      </text>
    </svg>
  );
}

// ─── KEEP DEPTHS — Military fortress with cross-spine layout ─────────────────
export function KeepDepthsMap({ width = 900, height = 700, onPoiClick, selectedPoi }: ZoneMapProps) {
  const t = THEMES.arreat;
  const pois: ZoneMapPoi[] = [
    { id: "entrance",    x: 450, y: 660, type: "entrance",  label: "Entrance", tip: "Enter from Bastion's Keep Stronghold." },
    { id: "wp-depths",   x: 450, y: 580, type: "waypoint",  label: "Keep Depths WP", tip: "Best farming zone in Act III. Activate immediately." },
    { id: "boss-ghom",   x: 450, y: 80,  type: "boss",      label: "Ghom", tip: "Move constantly to avoid his poison gas cloud." },
    { id: "elite-1",     x: 200, y: 350, type: "elite",     label: "Barracks", tip: "4+ elite packs in the barracks rooms." },
    { id: "elite-2",     x: 700, y: 350, type: "elite",     label: "Armory", tip: "Elite pack guarding the armory." },
    { id: "elite-3",     x: 200, y: 200, type: "elite",     label: "Upper Barracks", tip: "Elite pack in the upper barracks." },
    { id: "elite-4",     x: 700, y: 200, type: "elite",     label: "Command Room", tip: "Elite pack in the command room." },
  ];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
      style={{ background: "#030100", borderRadius: "8px" }}>

      {/* ── ENTRANCE ── */}
      <Corridor d="M 450 660 L 450 560" theme={t} width={28} />

      {/* ── CENTRAL SPINE — main corridor running north-south ── */}
      <Corridor d="M 450 560 L 450 100" theme={t} width={30} />

      {/* ── CROSS CORRIDORS — east-west at multiple levels ── */}
      <Corridor d="M 150 480 L 750 480" theme={t} width={26} />
      <Corridor d="M 150 360 L 750 360" theme={t} width={26} />
      <Corridor d="M 150 240 L 750 240" theme={t} width={26} />
      <Corridor d="M 150 140 L 750 140" theme={t} width={26} />

      {/* ── BARRACKS ROOMS — large rectangular rooms off the spine ── */}
      <Room points="100,440 250,440 250,520 100,520" theme={t} />
      <Room points="650,440 800,440 800,520 650,520" theme={t} />
      <Room points="100,300 250,300 250,420 100,420" theme={t} />
      <Room points="650,300 800,300 800,420 650,420" theme={t} />
      <Room points="100,180 250,180 250,300 100,300" theme={t} />
      <Room points="650,180 800,180 800,300 650,300" theme={t} />
      <Room points="100,100 250,100 250,180 100,180" theme={t} />
      <Room points="650,100 800,100 800,180 650,180" theme={t} />

      {/* ── BOSS CHAMBER ── */}
      <Room points="370,60 530,60 530,140 370,140" theme={t} />

      {/* ── STAIRCASE SYMBOLS ── */}
      {[[450, 480], [450, 360], [450, 240]].map((pt, i) => (
        <g key={i}>
          <rect x={pt[0] - 12} y={pt[1] - 8} width={24} height={16}
            fill={t.accent} opacity={0.6} rx={2} />
          {[0, 1, 2].map((j) => (
            <line key={j} x1={pt[0] - 8 + j * 6} y1={pt[1] - 6} x2={pt[0] - 8 + j * 6} y2={pt[1] + 6}
              stroke={t.glow} strokeWidth={1.5} opacity={0.8} />
          ))}
        </g>
      ))}

      {/* ── INTERSECTION MARKERS ── */}
      {[[450, 480], [450, 360], [450, 240], [450, 140],
        [150, 480], [750, 480], [150, 360], [750, 360],
        [150, 240], [750, 240]].map((pt, i) => (
        <circle key={i} cx={pt[0]} cy={pt[1]} r={5} fill={t.accent} opacity={0.7} />
      ))}

      {pois.map((poi) => (
        <PoiMarker key={poi.id} poi={poi}
          isSelected={selectedPoi === poi.id}
          onClick={() => onPoiClick?.(poi)}
          color={poi.type === "boss" ? "#ff7043" : poi.type === "waypoint" ? "#80cbc4" : "#ff7043"} />
      ))}

      <text x={450} y={30} textAnchor="middle" fontSize={14} fill={t.glow}
        fontFamily="'Cinzel Decorative', serif" fontWeight="bold">Keep Depths</text>
      <text x={450} y={48} textAnchor="middle" fontSize={9} fill={`${t.glow}88`} fontFamily="'Cinzel', serif">
        Military Cross-Spine Layout · 2 Levels · 4+ Elites Per Level
      </text>
    </svg>
  );
}

// ─── ARCHIVES OF ZOLTUN KULLE — Scholarly labyrinth ──────────────────────────
export function ArchivesMap({ width = 900, height = 700, onPoiClick, selectedPoi }: ZoneMapProps) {
  const t = THEMES.archives;
  const pois: ZoneMapPoi[] = [
    { id: "entrance",    x: 450, y: 660, type: "entrance",  label: "Entrance", tip: "Enter from the Desolate Sands." },
    { id: "wp-archives", x: 450, y: 580, type: "waypoint",  label: "Archives WP", tip: "Activate immediately." },
    { id: "boss-kulle",  x: 450, y: 80,  type: "boss",      label: "Zoltun Kulle", tip: "Destroy his blood orbs to interrupt his healing." },
    { id: "elite-1",     x: 200, y: 350, type: "elite",     label: "Library Wing", tip: "Elite pack in the western library wing." },
    { id: "elite-2",     x: 700, y: 350, type: "elite",     label: "Vault Room", tip: "Elite pack guarding the eastern vault." },
    { id: "portal-1",    x: 300, y: 200, type: "event",     label: "Arcane Portal", tip: "Portal to a side area with extra loot." },
    { id: "portal-2",    x: 600, y: 200, type: "event",     label: "Arcane Portal", tip: "Portal to a side area with extra loot." },
  ];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
      style={{ background: "#030200", borderRadius: "8px" }}>

      {/* ── ENTRANCE ── */}
      <Corridor d="M 450 660 L 450 560" theme={t} width={28} />

      {/* ── CENTRAL VAULT — octagonal ── */}
      <path d="M 380,480 L 520,480 L 580,420 L 580,280 L 520,220 L 380,220 L 320,280 L 320,420 Z"
        fill={t.floor} stroke={t.wall} strokeWidth={6} />
      <path d="M 395,465 L 505,465 L 555,415 L 555,285 L 505,235 L 395,235 L 345,285 L 345,415 Z"
        fill="none" stroke={t.path} strokeWidth={2} opacity={0.4} />

      {/* ── LIBRARY WINGS — large rectangular rooms with bookshelves ── */}
      {/* West wing */}
      <Room points="80,300 320,300 320,420 80,420" theme={t} />
      {/* East wing */}
      <Room points="580,300 820,300 820,420 580,420" theme={t} />
      {/* North wing */}
      <Room points="300,80 600,80 600,220 300,220" theme={t} />

      {/* Bookshelf details in library wings */}
      {[[120, 330], [120, 370], [200, 330], [200, 370], [240, 330], [240, 370]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={30} height={20} fill={t.wall} opacity={0.6} rx={2} />
      ))}
      {[[620, 330], [620, 370], [700, 330], [700, 370], [740, 330], [740, 370]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={30} height={20} fill={t.wall} opacity={0.6} rx={2} />
      ))}

      {/* ── CONNECTING CORRIDORS ── */}
      <Corridor d="M 320 360 L 380 360" theme={t} width={22} />
      <Corridor d="M 580 360 L 640 360" theme={t} width={22} />
      <Corridor d="M 450 220 L 450 140" theme={t} width={22} />

      {/* ── BOSS CHAMBER ── */}
      <Room points="370,60 530,60 530,140 370,140" theme={t} />

      {/* ── ARCANE PORTALS ── */}
      {[[300, 200], [600, 200]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={18} fill={t.accent} opacity={0.3} />
          <circle cx={x} cy={y} r={12} fill={t.glow} opacity={0.5} />
          <circle cx={x} cy={y} r={6} fill="white" opacity={0.7} />
        </g>
      ))}

      {/* ── SIDE ALCOVES ── */}
      <Corridor d="M 80 360 C 50 360 40 340 40 310 L 40 280" theme={t} width={16} />
      <Room points="20,260 60,260 60,280 20,280" theme={t} />
      <Corridor d="M 820 360 C 850 360 860 340 860 310 L 860 280" theme={t} width={16} />
      <Room points="840,260 880,260 880,280 840,280" theme={t} />

      {pois.map((poi) => (
        <PoiMarker key={poi.id} poi={poi}
          isSelected={selectedPoi === poi.id}
          onClick={() => onPoiClick?.(poi)}
          color={poi.type === "boss" ? "#ff7043" : poi.type === "waypoint" ? "#80cbc4" : poi.type === "event" ? "#ce93d8" : t.glow} />
      ))}

      <text x={450} y={30} textAnchor="middle" fontSize={14} fill={t.glow}
        fontFamily="'Cinzel Decorative', serif" fontWeight="bold">Archives of Zoltun Kulle</text>
      <text x={450} y={48} textAnchor="middle" fontSize={9} fill={`${t.glow}88`} fontFamily="'Cinzel', serif">
        Central Vault · Library Wings · Arcane Portals
      </text>
    </svg>
  );
}

// ─── Map registry ─────────────────────────────────────────────────────────────
export const SVG_ZONE_MAPS: Record<string, React.ComponentType<ZoneMapProps>> = {
  cathedral:    CathedralMap,
  halls_agony:  HallsOfAgonyMap,
  silver_spire: SilverSpireMap,
  arreat:       ArreatCraterMap,
  westmarch:    WestmarchCommonsMap,
  ruins_corvus: RuinsOfCorvusMap,
  keep_depths:  KeepDepthsMap,
  archives:     ArchivesMap,
};

export type { ZoneMapPoi };
