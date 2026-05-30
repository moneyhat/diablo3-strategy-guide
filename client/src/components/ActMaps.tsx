// Sanctuary Grimoire — Diablo 3 Minimap-Inspired SVG Maps
// Style: tile-based room/corridor layouts, dark parchment bg, glowing explored paths,
// fog-of-war vignette, POI markers with glow effects, isometric-inspired layout

import React from "react";

export interface MapPoi {
  id: string;
  x: number;
  y: number;
  type: "waypoint" | "dungeon" | "boss" | "keywarden" | "elite" | "chest" | "event" | "goblin";
  label: string;
}

export interface MapRoom {
  id: string;
  x: number; y: number;
  w: number; h: number;
  label?: string;
  type: "town" | "outdoor" | "dungeon" | "boss" | "special";
}

export interface MapCorridor {
  x1: number; y1: number;
  x2: number; y2: number;
  width?: number;
}

export interface ActMapData {
  actId: string;
  viewBox: string;
  accentColor: string;
  rooms: MapRoom[];
  corridors: MapCorridor[];
  pois: MapPoi[];
}

// ─── POI Colors ───────────────────────────────────────────────────────────────
const POI_COLORS: Record<string, string> = {
  waypoint:  "#80cbc4",
  dungeon:   "#7eb8f7",
  boss:      "#ff7043",
  keywarden: "#ce93d8",
  elite:     "#ef5350",
  chest:     "#ffd54f",
  event:     "#42a5f5",
  goblin:    "#66bb6a",
};

const ROOM_FILLS: Record<string, string> = {
  town:    "rgba(180,140,80,0.22)",
  outdoor: "rgba(80,120,60,0.18)",
  dungeon: "rgba(60,60,100,0.22)",
  boss:    "rgba(160,40,20,0.28)",
  special: "rgba(120,80,160,0.22)",
};

const ROOM_STROKES: Record<string, string> = {
  town:    "rgba(220,180,100,0.55)",
  outdoor: "rgba(100,160,80,0.45)",
  dungeon: "rgba(100,100,180,0.50)",
  boss:    "rgba(220,80,40,0.60)",
  special: "rgba(160,100,220,0.55)",
};

// ─── ACT I ────────────────────────────────────────────────────────────────────
export const act1Map: ActMapData = {
  actId: "act1",
  viewBox: "0 0 900 620",
  accentColor: "#c0392b",
  rooms: [
    { id: "new-tristram",    x: 60,  y: 240, w: 130, h: 100, label: "New Tristram",       type: "town" },
    { id: "old-tristram",    x: 220, y: 260, w: 100, h: 70,  label: "Old Tristram",        type: "outdoor" },
    { id: "weeping-hollow",  x: 350, y: 160, w: 160, h: 120, label: "Weeping Hollow",      type: "outdoor" },
    { id: "cathedral-l1",    x: 240, y: 360, w: 120, h: 80,  label: "Cathedral L1–2",      type: "dungeon" },
    { id: "cathedral-l3",    x: 240, y: 460, w: 120, h: 80,  label: "Cathedral L3–4",      type: "dungeon" },
    { id: "fields-misery",   x: 540, y: 120, w: 230, h: 160, label: "Fields of Misery",    type: "outdoor" },
    { id: "festering-woods", x: 620, y: 310, w: 150, h: 110, label: "Festering Woods",     type: "outdoor" },
    { id: "highlands",       x: 200, y: 80,  w: 160, h: 80,  label: "Northern Highlands",  type: "outdoor" },
    { id: "leoric-manor",    x: 390, y: 60,  w: 130, h: 70,  label: "Leoric's Manor",      type: "dungeon" },
    { id: "halls-agony",     x: 240, y: 560, w: 120, h: 50,  label: "Halls of Agony",      type: "boss" },
    { id: "caverns-araneae", x: 700, y: 300, w: 100, h: 80,  label: "Caverns of Araneae",  type: "dungeon" },
    { id: "defiled-crypt",   x: 480, y: 180, w: 80,  h: 60,  label: "Defiled Crypt",       type: "dungeon" },
  ],
  corridors: [
    { x1: 190, y1: 290, x2: 220, y2: 290, width: 18 },
    { x1: 320, y1: 290, x2: 350, y2: 220, width: 14 },
    { x1: 510, y1: 200, x2: 540, y2: 200, width: 18 },
    { x1: 300, y1: 360, x2: 300, y2: 330, width: 14 },
    { x1: 300, y1: 440, x2: 300, y2: 460, width: 14 },
    { x1: 300, y1: 540, x2: 300, y2: 560, width: 14 },
    { x1: 360, y1: 120, x2: 390, y2: 95,  width: 12 },
    { x1: 200, y1: 160, x2: 200, y2: 240, width: 12 },
    { x1: 770, y1: 200, x2: 770, y2: 300, width: 12 },
    { x1: 700, y1: 280, x2: 700, y2: 310, width: 12 },
    { x1: 620, y1: 280, x2: 620, y2: 310, width: 12 },
    { x1: 530, y1: 240, x2: 530, y2: 260, width: 10 },
  ],
  pois: [
    { id: "wp-tristram",   x: 125, y: 290, type: "waypoint",  label: "New Tristram" },
    { id: "wp-weeping",    x: 430, y: 220, type: "waypoint",  label: "Weeping Hollow" },
    { id: "wp-cathedral",  x: 300, y: 400, type: "waypoint",  label: "Cathedral Level 2" },
    { id: "wp-fields",     x: 655, y: 200, type: "waypoint",  label: "Fields of Misery" },
    { id: "wp-festering",  x: 695, y: 365, type: "waypoint",  label: "Festering Woods" },
    { id: "kw-odeg",       x: 700, y: 180, type: "keywarden", label: "Odeg the Keywarden" },
    { id: "boss-butcher",  x: 300, y: 585, type: "boss",      label: "The Butcher" },
    { id: "dun-caverns",   x: 750, y: 340, type: "dungeon",   label: "Caverns of Araneae" },
    { id: "dun-defiled",   x: 520, y: 210, type: "dungeon",   label: "Defiled Crypt" },
    { id: "chest-weeping", x: 480, y: 165, type: "chest",     label: "Resplendent Chest" },
    { id: "elite-fields1", x: 600, y: 155, type: "elite",     label: "Elite Pack" },
    { id: "elite-fields2", x: 740, y: 145, type: "elite",     label: "Elite Pack" },
    { id: "event-jar",     x: 300, y: 380, type: "event",     label: "Jar of Souls" },
    { id: "goblin-hollow", x: 460, y: 200, type: "goblin",    label: "Goblin Spawn" },
  ],
};

// ─── ACT II ───────────────────────────────────────────────────────────────────
export const act2Map: ActMapData = {
  actId: "act2",
  viewBox: "0 0 900 620",
  accentColor: "#d4870a",
  rooms: [
    { id: "hidden-camp",   x: 40,  y: 240, w: 120, h: 90,  label: "Hidden Camp",              type: "town" },
    { id: "road-alcarnus", x: 190, y: 260, w: 130, h: 70,  label: "Road to Alcarnus",         type: "outdoor" },
    { id: "black-canyon",  x: 350, y: 170, w: 180, h: 120, label: "Black Canyon Mines",       type: "dungeon" },
    { id: "dahlgur-oasis", x: 560, y: 100, w: 240, h: 170, label: "Dahlgur Oasis",            type: "outdoor" },
    { id: "desolate",      x: 160, y: 380, w: 340, h: 130, label: "Desolate Sands",           type: "outdoor" },
    { id: "archives",      x: 540, y: 340, w: 200, h: 120, label: "Archives of Zoltun Kulle", type: "dungeon" },
    { id: "caldeum",       x: 60,  y: 80,  w: 150, h: 120, label: "Caldeum Bazaar",           type: "town" },
    { id: "sewers",        x: 40,  y: 370, w: 90,  h: 120, label: "Sewers",                   type: "dungeon" },
    { id: "imperial",      x: 560, y: 490, w: 200, h: 90,  label: "Imperial Palace",          type: "boss" },
    { id: "vault-assassin",x: 740, y: 200, w: 110, h: 80,  label: "Vault of the Assassin",   type: "dungeon" },
  ],
  corridors: [
    { x1: 160, y1: 285, x2: 190, y2: 285, width: 18 },
    { x1: 320, y1: 285, x2: 350, y2: 230, width: 14 },
    { x1: 530, y1: 185, x2: 560, y2: 185, width: 18 },
    { x1: 100, y1: 200, x2: 100, y2: 240, width: 14 },
    { x1: 100, y1: 370, x2: 100, y2: 330, width: 12 },
    { x1: 500, y1: 380, x2: 540, y2: 380, width: 14 },
    { x1: 660, y1: 270, x2: 660, y2: 340, width: 12 },
    { x1: 660, y1: 460, x2: 660, y2: 490, width: 14 },
    { x1: 740, y1: 240, x2: 740, y2: 270, width: 12 },
  ],
  pois: [
    { id: "wp-camp",      x: 100, y: 285, type: "waypoint",  label: "Hidden Camp" },
    { id: "wp-canyon",    x: 440, y: 230, type: "waypoint",  label: "Black Canyon Mines" },
    { id: "wp-oasis",     x: 620, y: 185, type: "waypoint",  label: "Dahlgur Oasis" },
    { id: "wp-desolate",  x: 330, y: 445, type: "waypoint",  label: "Desolate Sands" },
    { id: "wp-archives",  x: 640, y: 400, type: "waypoint",  label: "Archives" },
    { id: "kw-sokahr",    x: 740, y: 150, type: "keywarden", label: "Sokahr the Keywarden" },
    { id: "boss-belial",  x: 660, y: 535, type: "boss",      label: "Belial" },
    { id: "dun-vault",    x: 795, y: 240, type: "dungeon",   label: "Vault of the Assassin" },
    { id: "chest-oasis",  x: 760, y: 120, type: "chest",     label: "Resplendent Chest" },
    { id: "elite-canyon1",x: 400, y: 195, type: "elite",     label: "Elite Pack" },
    { id: "elite-canyon2",x: 490, y: 215, type: "elite",     label: "Elite Pack" },
    { id: "event-sands",  x: 400, y: 430, type: "event",     label: "Restless Sands" },
  ],
};

// ─── ACT III ──────────────────────────────────────────────────────────────────
export const act3Map: ActMapData = {
  actId: "act3",
  viewBox: "0 0 900 620",
  accentColor: "#e84000",
  rooms: [
    { id: "bastions-keep",  x: 30,  y: 230, w: 160, h: 120, label: "Bastion's Keep",       type: "town" },
    { id: "keep-depths",    x: 30,  y: 380, w: 160, h: 120, label: "Keep Depths",          type: "dungeon" },
    { id: "stonefort",      x: 230, y: 160, w: 170, h: 120, label: "Stonefort",            type: "outdoor" },
    { id: "bridge-korsikk", x: 430, y: 230, w: 160, h: 100, label: "Bridge of Korsikk",   type: "outdoor" },
    { id: "rakkis",         x: 610, y: 140, w: 200, h: 130, label: "Rakkis Crossing",     type: "outdoor" },
    { id: "arreat-l1",      x: 610, y: 310, w: 200, h: 120, label: "Arreat Crater L1",    type: "outdoor" },
    { id: "arreat-l2",      x: 610, y: 460, w: 200, h: 100, label: "Arreat Crater L2",    type: "dungeon" },
    { id: "tower-damned",   x: 720, y: 390, w: 150, h: 130, label: "Tower of the Damned", type: "boss" },
    { id: "skycrown",       x: 230, y: 60,  w: 340, h: 80,  label: "Skycrown Battlements",type: "outdoor" },
    { id: "core-arreat",    x: 720, y: 540, w: 150, h: 60,  label: "Core of Arreat",      type: "boss" },
  ],
  corridors: [
    { x1: 190, y1: 290, x2: 230, y2: 220, width: 18 },
    { x1: 110, y1: 380, x2: 110, y2: 350, width: 14 },
    { x1: 400, y1: 220, x2: 430, y2: 280, width: 14 },
    { x1: 590, y1: 205, x2: 610, y2: 205, width: 18 },
    { x1: 710, y1: 270, x2: 710, y2: 310, width: 14 },
    { x1: 710, y1: 430, x2: 720, y2: 430, width: 14 },
    { x1: 710, y1: 460, x2: 710, y2: 490, width: 12 },
    { x1: 795, y1: 520, x2: 795, y2: 540, width: 14 },
    { x1: 315, y1: 140, x2: 315, y2: 100, width: 12 },
  ],
  pois: [
    { id: "wp-bastions",  x: 110, y: 290, type: "waypoint",  label: "Bastion's Keep" },
    { id: "wp-stonefort", x: 315, y: 220, type: "waypoint",  label: "Stonefort" },
    { id: "wp-rakkis",    x: 710, y: 205, type: "waypoint",  label: "Rakkis Crossing" },
    { id: "wp-arreat1",   x: 710, y: 370, type: "waypoint",  label: "Arreat Crater L1" },
    { id: "wp-arreat2",   x: 710, y: 510, type: "waypoint",  label: "Arreat Crater L2" },
    { id: "kw-xahrith",  x: 280, y: 175, type: "keywarden", label: "Xah'Rith the Keywarden" },
    { id: "boss-azmodan", x: 795, y: 565, type: "boss",      label: "Azmodan" },
    { id: "dun-keep1",    x: 110, y: 440, type: "dungeon",   label: "Keep Depths L1" },
    { id: "dun-tower",    x: 795, y: 455, type: "dungeon",   label: "Tower of the Damned" },
    { id: "elite-rakkis1",x: 650, y: 170, type: "elite",     label: "Bridge Elite Pack" },
    { id: "elite-rakkis2",x: 780, y: 165, type: "elite",     label: "Bridge Elite Pack" },
    { id: "elite-arreat", x: 680, y: 345, type: "elite",     label: "Crater Elite Pack" },
    { id: "chest-arreat", x: 800, y: 320, type: "chest",     label: "Resplendent Chest" },
  ],
};

// ─── ACT IV ───────────────────────────────────────────────────────────────────
export const act4Map: ActMapData = {
  actId: "act4",
  viewBox: "0 0 900 620",
  accentColor: "#5b9bd5",
  rooms: [
    { id: "crystal-arch",  x: 350, y: 30,  w: 200, h: 100, label: "Crystal Arch",          type: "town" },
    { id: "gardens-t1",    x: 60,  y: 160, w: 260, h: 150, label: "Gardens of Hope T1",    type: "outdoor" },
    { id: "gardens-t2",    x: 60,  y: 340, w: 260, h: 150, label: "Gardens of Hope T2",    type: "outdoor" },
    { id: "hell-rift",     x: 360, y: 170, w: 180, h: 130, label: "Hell Rift",             type: "dungeon" },
    { id: "silver-spire1", x: 580, y: 150, w: 220, h: 140, label: "Silver Spire L1",       type: "outdoor" },
    { id: "silver-spire2", x: 580, y: 320, w: 220, h: 140, label: "Silver Spire L2",       type: "dungeon" },
    { id: "colonnade",     x: 360, y: 340, w: 180, h: 130, label: "Crystal Colonnade",     type: "dungeon" },
    { id: "great-span",    x: 60,  y: 510, w: 500, h: 80,  label: "Great Span",            type: "outdoor" },
    { id: "vestibule",     x: 580, y: 490, w: 220, h: 100, label: "Vestibule of Light",    type: "boss" },
  ],
  corridors: [
    { x1: 450, y1: 130, x2: 190, y2: 160, width: 14 },
    { x1: 450, y1: 130, x2: 690, y2: 150, width: 14 },
    { x1: 450, y1: 130, x2: 450, y2: 170, width: 14 },
    { x1: 190, y1: 310, x2: 190, y2: 340, width: 14 },
    { x1: 450, y1: 300, x2: 450, y2: 340, width: 12 },
    { x1: 690, y1: 290, x2: 690, y2: 320, width: 14 },
    { x1: 310, y1: 510, x2: 310, y2: 490, width: 12 },
    { x1: 690, y1: 460, x2: 690, y2: 490, width: 14 },
  ],
  pois: [
    { id: "wp-arch",      x: 450, y: 80,  type: "waypoint",  label: "Crystal Arch" },
    { id: "wp-gardens1",  x: 190, y: 235, type: "waypoint",  label: "Gardens of Hope T1" },
    { id: "wp-gardens2",  x: 190, y: 415, type: "waypoint",  label: "Gardens of Hope T2" },
    { id: "wp-spire1",    x: 690, y: 220, type: "waypoint",  label: "Silver Spire L1" },
    { id: "wp-spire2",    x: 690, y: 390, type: "waypoint",  label: "Silver Spire L2" },
    { id: "kw-nekarat",   x: 190, y: 390, type: "keywarden", label: "Nekarat the Keywarden" },
    { id: "boss-diablo",  x: 690, y: 540, type: "boss",      label: "Diablo" },
    { id: "boss-rakanoth",x: 190, y: 460, type: "boss",      label: "Rakanoth" },
    { id: "dun-hellrift", x: 450, y: 235, type: "dungeon",   label: "Hell Rift" },
    { id: "elite-g1",     x: 130, y: 185, type: "elite",     label: "Elite Pack" },
    { id: "elite-s1",     x: 760, y: 185, type: "elite",     label: "Elite Pack" },
    { id: "chest-g1",     x: 280, y: 175, type: "chest",     label: "Celestial Chest" },
  ],
};

// ─── ACT V ────────────────────────────────────────────────────────────────────
export const act5Map: ActMapData = {
  actId: "act5",
  viewBox: "0 0 900 620",
  accentColor: "#8e44ad",
  rooms: [
    { id: "enclave",      x: 30,  y: 240, w: 130, h: 100, label: "Survivors' Enclave",    type: "town" },
    { id: "westmarch",    x: 190, y: 160, w: 220, h: 160, label: "Westmarch Commons",     type: "outdoor" },
    { id: "heights",      x: 190, y: 60,  w: 220, h: 80,  label: "Westmarch Heights",     type: "outdoor" },
    { id: "blood-marsh",  x: 440, y: 170, w: 200, h: 150, label: "Blood Marsh",           type: "outdoor" },
    { id: "corvus",       x: 670, y: 130, w: 200, h: 180, label: "Ruins of Corvus",       type: "dungeon" },
    { id: "greyhollow",   x: 30,  y: 380, w: 160, h: 130, label: "Greyhollow Island",     type: "special" },
    { id: "pandemonium",  x: 440, y: 360, w: 240, h: 130, label: "Pandemonium Fortress",  type: "dungeon" },
    { id: "battlefields", x: 440, y: 510, w: 430, h: 90,  label: "Battlefields of Eternity", type: "outdoor" },
    { id: "pand2",        x: 710, y: 360, w: 160, h: 130, label: "Pandemonium L2",        type: "boss" },
  ],
  corridors: [
    { x1: 160, y1: 290, x2: 190, y2: 240, width: 18 },
    { x1: 300, y1: 160, x2: 300, y2: 140, width: 12 },
    { x1: 410, y1: 240, x2: 440, y2: 245, width: 14 },
    { x1: 640, y1: 245, x2: 670, y2: 220, width: 14 },
    { x1: 110, y1: 380, x2: 110, y2: 340, width: 12 },
    { x1: 560, y1: 360, x2: 560, y2: 320, width: 14 },
    { x1: 560, y1: 490, x2: 560, y2: 510, width: 14 },
    { x1: 790, y1: 490, x2: 790, y2: 510, width: 12 },
    { x1: 710, y1: 425, x2: 710, y2: 425, width: 14 },
  ],
  pois: [
    { id: "wp-enclave",    x: 95,  y: 290, type: "waypoint",  label: "Survivors' Enclave" },
    { id: "wp-westmarch",  x: 300, y: 240, type: "waypoint",  label: "Westmarch Commons" },
    { id: "wp-marsh",      x: 540, y: 245, type: "waypoint",  label: "Blood Marsh" },
    { id: "wp-corvus",     x: 770, y: 220, type: "waypoint",  label: "Passage to Corvus" },
    { id: "wp-battle",     x: 560, y: 555, type: "waypoint",  label: "Battlefields of Eternity" },
    { id: "wp-pand",       x: 560, y: 425, type: "waypoint",  label: "Pandemonium Fortress" },
    { id: "boss-malthael", x: 790, y: 425, type: "boss",      label: "Malthael" },
    { id: "boss-urzael",   x: 270, y: 195, type: "boss",      label: "Urzael" },
    { id: "dun-corvus1",   x: 730, y: 160, type: "dungeon",   label: "Ruins of Corvus L1" },
    { id: "dun-corvus2",   x: 840, y: 230, type: "dungeon",   label: "Ruins of Corvus L2" },
    { id: "elite-battle1", x: 500, y: 545, type: "elite",     label: "Elite Pack" },
    { id: "elite-battle2", x: 650, y: 540, type: "elite",     label: "Elite Pack" },
    { id: "elite-battle3", x: 800, y: 545, type: "elite",     label: "Elite Pack" },
    { id: "chest-corvus1", x: 760, y: 155, type: "chest",     label: "Resplendent Chest L1" },
    { id: "chest-corvus2", x: 850, y: 250, type: "chest",     label: "Resplendent Chest L2" },
    { id: "goblin-battle", x: 720, y: 545, type: "goblin",    label: "Goblin Cluster" },
    { id: "event-grey",    x: 110, y: 445, type: "event",     label: "Ancient Tree Event" },
  ],
};

export const ACT_MAPS: Record<string, ActMapData> = {
  act1: act1Map, act2: act2Map, act3: act3Map, act4: act4Map, act5: act5Map,
};

// ─── SVG Map Renderer ─────────────────────────────────────────────────────────
interface SvgMapProps {
  mapData: ActMapData;
  selectedPoiId: string | null;
  onPoiClick: (poi: MapPoi) => void;
}

export function SvgActMap({ mapData, selectedPoiId, onPoiClick }: SvgMapProps) {
  const ac = mapData.accentColor;
  const filterId = `glow-${mapData.actId}`;
  const fogId = `fog-${mapData.actId}`;
  const tileId = `tile-${mapData.actId}`;
  const corridorGlowId = `cglow-${mapData.actId}`;

  return (
    <svg viewBox={mapData.viewBox} style={{ width: "100%", height: "100%", display: "block" }}
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Tile pattern — mimics D3 minimap floor tiles */}
        <pattern id={tileId} width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="transparent" />
          <rect x="0" y="0" width="8" height="8" fill="rgba(255,255,255,0.018)" />
          <rect x="8" y="8" width="8" height="8" fill="rgba(255,255,255,0.018)" />
          <line x1="0" y1="0" x2="16" y2="0" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          <line x1="0" y1="0" x2="0" y2="16" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        </pattern>

        {/* Glow filter for POIs */}
        <filter id={filterId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        {/* Soft glow for corridors */}
        <filter id={corridorGlowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        {/* Radial fog-of-war vignette */}
        <radialGradient id={fogId} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="70%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(4,3,6,0.82)" />
        </radialGradient>
      </defs>

      {/* ── Base background — very dark, like D3 unexplored map ── */}
      <rect width="100%" height="100%" fill="#050308" />

      {/* ── Subtle scanline texture ── */}
      {Array.from({ length: 40 }).map((_, i) => (
        <line key={i} x1="0" y1={i * 16} x2="900" y2={i * 16}
          stroke="rgba(255,255,255,0.012)" strokeWidth="0.5" />
      ))}

      {/* ── Corridors / paths — drawn first (below rooms) ── */}
      {mapData.corridors.map((c, i) => {
        const w = c.width || 14;
        return (
          <g key={i}>
            {/* Outer glow */}
            <line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke={ac} strokeWidth={w + 6} strokeOpacity="0.08"
              strokeLinecap="round" />
            {/* Dark floor fill */}
            <line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke="#1a1018" strokeWidth={w} strokeLinecap="round" />
            {/* Tile texture on corridor */}
            <line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke={`url(#${tileId})`} strokeWidth={w} strokeLinecap="round" />
            {/* Glowing center path line */}
            <line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke={ac} strokeWidth="1.5" strokeOpacity="0.55"
              strokeLinecap="round" strokeDasharray="6,4"
              filter={`url(#${corridorGlowId})`} />
            {/* Edge lines — mimics D3 minimap wall borders */}
            <line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke={ac} strokeWidth={w + 2} strokeOpacity="0.12"
              strokeLinecap="round" fill="none" />
          </g>
        );
      })}

      {/* ── Rooms ── */}
      {mapData.rooms.map((room) => {
        const fill = ROOM_FILLS[room.type] || "rgba(60,60,80,0.2)";
        const stroke = ROOM_STROKES[room.type] || ac;
        const cx = room.x + room.w / 2;
        const cy = room.y + room.h / 2;
        return (
          <g key={room.id}>
            {/* Room glow */}
            <rect x={room.x - 3} y={room.y - 3} width={room.w + 6} height={room.h + 6}
              rx="4" fill={stroke} fillOpacity="0.06" />
            {/* Dark floor */}
            <rect x={room.x} y={room.y} width={room.w} height={room.h}
              rx="3" fill="#0e0b12" />
            {/* Tile texture */}
            <rect x={room.x} y={room.y} width={room.w} height={room.h}
              rx="3" fill={`url(#${tileId})`} />
            {/* Room color fill */}
            <rect x={room.x} y={room.y} width={room.w} height={room.h}
              rx="3" fill={fill} />
            {/* Inner border — D3 minimap style double border */}
            <rect x={room.x} y={room.y} width={room.w} height={room.h}
              rx="3" fill="none" stroke={stroke} strokeWidth="2" strokeOpacity="0.7" />
            <rect x={room.x + 3} y={room.y + 3} width={room.w - 6} height={room.h - 6}
              rx="2" fill="none" stroke={stroke} strokeWidth="0.8" strokeOpacity="0.3" />
            {/* Corner accents — D3 minimap corner marks */}
            {[
              [room.x, room.y], [room.x + room.w, room.y],
              [room.x, room.y + room.h], [room.x + room.w, room.y + room.h],
            ].map(([cx2, cy2], idx) => (
              <circle key={idx} cx={cx2} cy={cy2} r="2.5" fill={stroke} fillOpacity="0.7" />
            ))}
            {/* Room label */}
            {room.label && (
              <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
                fill={stroke} fontSize="8" fontFamily="'Cinzel', serif" fontWeight="bold"
                opacity="0.85" style={{ pointerEvents: "none", userSelect: "none" }}>
                {room.label.length > 18 ? room.label.slice(0, 16) + "…" : room.label}
              </text>
            )}
          </g>
        );
      })}

      {/* ── POI Markers ── */}
      {mapData.pois.map((poi) => {
        const isSelected = selectedPoiId === poi.id;
        const color = POI_COLORS[poi.type] || "#fff";
        const r = isSelected ? 9 : 6;

        // Icon paths for each type
        const iconPaths: Record<string, string> = {
          waypoint:  "M0,-5 L1.5,-1.5 L5,-1.5 L2.5,0.5 L3.5,4 L0,2 L-3.5,4 L-2.5,0.5 L-5,-1.5 L-1.5,-1.5 Z",
          dungeon:   "M-4,-4 L4,-4 L4,4 L-4,4 Z M-2,-2 L2,-2 L2,2 L-2,2 Z",
          boss:      "M0,-5 L1.5,0 L5,0 L2,3 L3,5 L0,3 L-3,5 L-2,3 L-5,0 L-1.5,0 Z",
          keywarden: "M-3,-5 L3,-5 L3,0 L0,5 L-3,0 Z",
          elite:     "M0,-5 L1.5,-1.5 L5,-1.5 L2.5,0.5 L3.5,4 L0,2 L-3.5,4 L-2.5,0.5 L-5,-1.5 L-1.5,-1.5 Z",
          chest:     "M-4,-3 L4,-3 L4,3 L-4,3 Z M-4,0 L4,0",
          event:     "M0,-5 L0,5 M-5,0 L5,0",
          goblin:    "M0,-5 A5,5 0 1,1 0,5 A5,5 0 1,1 0,-5",
        };

        return (
          <g key={poi.id} onClick={() => onPoiClick(poi)} style={{ cursor: "pointer" }}
            filter={isSelected ? `url(#${filterId})` : undefined}>
            {/* Outer pulse ring */}
            <circle cx={poi.x} cy={poi.y} r={r + 5} fill={color} fillOpacity={isSelected ? 0.15 : 0.06}
              stroke={color} strokeWidth="0.8" strokeOpacity={isSelected ? 0.5 : 0.2} />
            {/* Main circle */}
            <circle cx={poi.x} cy={poi.y} r={r} fill={isSelected ? color : `${color}44`}
              stroke={color} strokeWidth={isSelected ? 2 : 1.5} />
            {/* Icon */}
            <g transform={`translate(${poi.x},${poi.y}) scale(${isSelected ? 0.85 : 0.65})`}>
              <path d={iconPaths[poi.type] || iconPaths.waypoint}
                fill={isSelected ? "rgba(0,0,0,0.7)" : color} fillOpacity={isSelected ? 1 : 0.9}
                stroke="none" />
            </g>
            {/* Label on selection */}
            {isSelected && (
              <g>
                <rect x={poi.x - poi.label.length * 3.2 - 4} y={poi.y - 26}
                  width={poi.label.length * 6.4 + 8} height={15}
                  rx="3" fill="rgba(5,3,8,0.94)" stroke={color} strokeWidth="1" strokeOpacity="0.8" />
                <text x={poi.x} y={poi.y - 15} fill={color} fontSize="8.5"
                  fontFamily="'Cinzel', serif" fontWeight="bold" textAnchor="middle"
                  style={{ pointerEvents: "none", userSelect: "none" }}>
                  {poi.label}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* ── Fog of war vignette ── */}
      <rect width="100%" height="100%" fill={`url(#${fogId})`} style={{ pointerEvents: "none" }} />

      {/* ── Compass rose ── */}
      <g transform="translate(860,580)" opacity="0.5">
        <circle cx="0" cy="0" r="16" fill="rgba(5,3,8,0.7)" stroke={ac} strokeWidth="1" />
        <text x="0" y="-7" fill={ac} fontSize="7" textAnchor="middle" fontFamily="serif" fontWeight="bold">N</text>
        <text x="0" y="12" fill={ac} fontSize="5.5" textAnchor="middle" fontFamily="serif">S</text>
        <text x="-10" y="3" fill={ac} fontSize="5.5" textAnchor="middle" fontFamily="serif">W</text>
        <text x="10" y="3" fill={ac} fontSize="5.5" textAnchor="middle" fontFamily="serif">E</text>
        <line x1="0" y1="-13" x2="0" y2="13" stroke={ac} strokeWidth="0.7" />
        <line x1="-13" y1="0" x2="13" y2="0" stroke={ac} strokeWidth="0.7" />
      </g>

      {/* ── Act label ── */}
      <text x="18" y="24" fill={ac} fontSize="13" fontFamily="'Cinzel Decorative', serif"
        fontWeight="bold" opacity="0.75">
        {mapData.actId.replace("act", "ACT ")}
      </text>
    </svg>
  );
}
