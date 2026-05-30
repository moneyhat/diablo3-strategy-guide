// Sanctuary Grimoire — SVG Schematic Maps
// Mimics the Diablo 3 in-game minimap: dark bg, glowing paths, labeled zones, POI markers
// Each map is a 1000x700 SVG coordinate space

import React from "react";

export interface MapZoneRegion {
  id: string;
  label: string;
  // Polygon points as "x,y x,y ..." in 0-1000 x 0-700 space
  points: string;
  color: string;
  opacity?: number;
}

export interface MapPath {
  d: string; // SVG path data
  color: string;
  width?: number;
  dashed?: boolean;
}

export interface MapLabel {
  x: number;
  y: number;
  text: string;
  color?: string;
  size?: number;
  bold?: boolean;
}

export interface MapPoi {
  id: string;
  x: number;
  y: number;
  type: "waypoint" | "dungeon" | "boss" | "keywarden" | "elite" | "chest" | "event" | "goblin";
  label: string;
}

export interface ActMapData {
  actId: string;
  viewBox: string;
  bgColor: string;
  accentColor: string;
  zones: MapZoneRegion[];
  paths: MapPath[];
  labels: MapLabel[];
  pois: MapPoi[];
}

// ─── POI Colors ───────────────────────────────────────────────────────────────
const POI_COLORS: Record<string, string> = {
  waypoint: "#80cbc4",
  dungeon: "#7eb8f7",
  boss: "#ff7043",
  keywarden: "#ce93d8",
  elite: "#ef5350",
  chest: "#ffd54f",
  event: "#42a5f5",
  goblin: "#66bb6a",
};

// ─── ACT I MAP ────────────────────────────────────────────────────────────────
export const act1Map: ActMapData = {
  actId: "act1",
  viewBox: "0 0 1000 700",
  bgColor: "#0a0505",
  accentColor: "#8b0000",
  zones: [
    { id: "new-tristram", label: "New Tristram", points: "120,280 280,280 280,420 120,420", color: "#5a1a1a", opacity: 0.7 },
    { id: "old-tristram", label: "Old Tristram Road", points: "280,300 420,300 420,400 280,400", color: "#3d1010", opacity: 0.6 },
    { id: "weeping-hollow", label: "Weeping Hollow", points: "420,200 620,200 620,380 420,380", color: "#2d1515", opacity: 0.65 },
    { id: "cathedral", label: "Cathedral", points: "300,420 500,420 500,580 300,580", color: "#1a1a2e", opacity: 0.7 },
    { id: "fields-of-misery", label: "Fields of Misery", points: "600,180 900,180 900,420 600,420", color: "#1a2a1a", opacity: 0.65 },
    { id: "festering-woods", label: "Festering Woods", points: "700,420 900,420 900,580 700,580", color: "#1a2a15", opacity: 0.6 },
    { id: "highlands", label: "Northern Highlands", points: "200,100 600,100 600,200 200,200", color: "#1a1515", opacity: 0.5 },
    { id: "leoric-manor", label: "Leoric's Manor", points: "480,90 640,90 640,200 480,200", color: "#2a1a1a", opacity: 0.65 },
    { id: "halls-of-agony", label: "Halls of Agony", points: "300,580 500,580 500,680 300,680", color: "#1a0a0a", opacity: 0.75 },
  ],
  paths: [
    // Main road from New Tristram east
    { d: "M200,350 L280,350 L420,350 L520,350 L620,300 L750,280", color: "#c0392b", width: 3 },
    // Road south to Cathedral
    { d: "M350,420 L350,500 L400,580", color: "#c0392b", width: 2.5 },
    // Road north to Highlands
    { d: "M200,280 L200,200 L350,150 L480,130", color: "#c0392b", width: 2 },
    // Fields of Misery internal paths
    { d: "M620,300 L700,300 L800,280 L880,300 L880,380", color: "#8b3a3a", width: 2 },
    { d: "M750,380 L750,480 L800,520", color: "#8b3a3a", width: 1.5, dashed: true },
    // Festering Woods path
    { d: "M750,420 L750,500 L800,540", color: "#4a7a4a", width: 2 },
    // Halls of Agony descent
    { d: "M400,580 L400,640 L450,660", color: "#6b0000", width: 2.5 },
    // Cathedral internal
    { d: "M320,440 L320,560 L480,560 L480,440", color: "#3a3a6b", width: 1.5, dashed: true },
    // Caverns of Araneae path
    { d: "M800,340 L850,380 L870,420", color: "#6b4a6b", width: 1.5, dashed: true },
  ],
  labels: [
    { x: 195, y: 355, text: "New Tristram", color: "#e8c4a0", size: 11, bold: true },
    { x: 510, y: 295, text: "Weeping Hollow", color: "#c4a0a0", size: 10 },
    { x: 390, y: 500, text: "Cathedral", color: "#a0a0c4", size: 10, bold: true },
    { x: 750, y: 295, text: "Fields of Misery", color: "#a0c4a0", size: 11, bold: true },
    { x: 790, y: 500, text: "Festering Woods", color: "#90b490", size: 10 },
    { x: 550, y: 145, text: "Leoric's Manor", color: "#c4a0a0", size: 10 },
    { x: 380, y: 635, text: "Halls of Agony", color: "#c47070", size: 10, bold: true },
    { x: 340, y: 350, text: "Old Tristram", color: "#a08080", size: 9 },
    { x: 300, y: 145, text: "Northern Highlands", color: "#907070", size: 9 },
  ],
  pois: [
    { id: "wp-tristram", x: 200, y: 350, type: "waypoint", label: "New Tristram" },
    { id: "wp-weeping", x: 520, y: 280, type: "waypoint", label: "Weeping Hollow" },
    { id: "wp-cathedral2", x: 400, y: 490, type: "waypoint", label: "Cathedral Level 2" },
    { id: "wp-fields", x: 650, y: 300, type: "waypoint", label: "Fields of Misery" },
    { id: "wp-festering", x: 760, y: 460, type: "waypoint", label: "Festering Woods" },
    { id: "wp-highlands", x: 340, y: 155, type: "waypoint", label: "Northern Highlands" },
    { id: "dungeon-defiled", x: 560, y: 330, type: "dungeon", label: "Defiled Crypt" },
    { id: "dungeon-caverns", x: 860, y: 390, type: "dungeon", label: "Caverns of Araneae" },
    { id: "dungeon-warriors", x: 760, y: 510, type: "dungeon", label: "Warrior's Rest" },
    { id: "dungeon-enchanted", x: 840, y: 540, type: "dungeon", label: "Enchanted Forest" },
    { id: "keywarden-odeg", x: 770, y: 330, type: "keywarden", label: "Odeg the Keywarden" },
    { id: "boss-butcher", x: 450, y: 660, type: "boss", label: "The Butcher" },
    { id: "chest-weeping", x: 590, y: 220, type: "chest", label: "Resplendent Chest" },
    { id: "elite-fields1", x: 700, y: 260, type: "elite", label: "Elite Pack" },
    { id: "elite-fields2", x: 820, y: 310, type: "elite", label: "Elite Pack" },
    { id: "event-jar", x: 380, y: 460, type: "event", label: "Jar of Souls" },
    { id: "goblin-hollow", x: 500, y: 310, type: "goblin", label: "Goblin Spawn" },
  ],
};

// ─── ACT II MAP ───────────────────────────────────────────────────────────────
export const act2Map: ActMapData = {
  actId: "act2",
  viewBox: "0 0 1000 700",
  bgColor: "#080604",
  accentColor: "#c8860a",
  zones: [
    { id: "hidden-camp", label: "Hidden Camp", points: "80,280 220,280 220,400 80,400", color: "#2a1f05", opacity: 0.75 },
    { id: "road-alcarnus", label: "Road to Alcarnus", points: "220,300 420,300 420,400 220,400", color: "#1f1a05", opacity: 0.6 },
    { id: "black-canyon", label: "Black Canyon Mines", points: "400,200 620,200 620,380 400,380", color: "#1a1505", opacity: 0.65 },
    { id: "dahlgur-oasis", label: "Dahlgur Oasis", points: "600,150 900,150 900,420 600,420", color: "#0f1a0f", opacity: 0.65 },
    { id: "desolate-sands", label: "Desolate Sands", points: "200,420 600,420 600,580 200,580", color: "#1a1505", opacity: 0.6 },
    { id: "archives", label: "Archives of Zoltun Kulle", points: "600,420 850,420 850,580 600,580", color: "#0f0f1a", opacity: 0.65 },
    { id: "caldeum", label: "Caldeum Bazaar", points: "100,100 350,100 350,280 100,280", color: "#1f1505", opacity: 0.7 },
    { id: "sewers", label: "Sewers of Caldeum", points: "100,400 220,400 220,580 100,580", color: "#0a1005", opacity: 0.65 },
    { id: "imperial-palace", label: "Imperial Palace", points: "600,580 850,580 850,680 600,680", color: "#1a0f05", opacity: 0.7 },
  ],
  paths: [
    { d: "M150,340 L220,340 L350,340 L420,300 L500,280 L600,250 L720,220", color: "#d4870a", width: 3 },
    { d: "M150,340 L150,280 L200,200 L300,150", color: "#d4870a", width: 2 },
    { d: "M150,400 L150,500 L200,540", color: "#8a6a2a", width: 2 },
    { d: "M420,380 L420,500 L500,540 L600,500", color: "#8a6a2a", width: 2 },
    { d: "M720,300 L800,280 L880,300 L880,400", color: "#5a8a5a", width: 2 },
    { d: "M750,400 L750,500 L800,540", color: "#5a8a5a", width: 1.5, dashed: true },
    { d: "M720,540 L720,620 L750,650", color: "#8a5a2a", width: 2.5 },
    { d: "M500,420 L500,500 L550,540", color: "#5a5a8a", width: 1.5, dashed: true },
    { d: "M850,480 L880,500 L900,540", color: "#5a5a8a", width: 1.5, dashed: true },
  ],
  labels: [
    { x: 148, y: 345, text: "Hidden Camp", color: "#e8c47a", size: 11, bold: true },
    { x: 500, y: 280, text: "Black Canyon Mines", color: "#c4a070", size: 10, bold: true },
    { x: 740, y: 270, text: "Dahlgur Oasis", color: "#90c490", size: 11, bold: true },
    { x: 390, y: 500, text: "Desolate Sands", color: "#c4a070", size: 10 },
    { x: 710, y: 490, text: "Archives of Zoltun Kulle", color: "#9090c4", size: 9 },
    { x: 210, y: 180, text: "Caldeum", color: "#c4a070", size: 10, bold: true },
    { x: 148, y: 490, text: "Sewers", color: "#70a470", size: 9 },
    { x: 710, y: 630, text: "Imperial Palace", color: "#c47040", size: 10, bold: true },
  ],
  pois: [
    { id: "wp-hidden-camp", x: 150, y: 340, type: "waypoint", label: "Hidden Camp" },
    { id: "wp-black-canyon", x: 500, y: 290, type: "waypoint", label: "Black Canyon Mines" },
    { id: "wp-oasis", x: 660, y: 260, type: "waypoint", label: "Dahlgur Oasis" },
    { id: "wp-desolate", x: 400, y: 500, type: "waypoint", label: "Desolate Sands" },
    { id: "wp-archives", x: 700, y: 480, type: "waypoint", label: "Archives" },
    { id: "keywarden-sokahr", x: 780, y: 300, type: "keywarden", label: "Sokahr the Keywarden" },
    { id: "dungeon-vault", x: 840, y: 360, type: "dungeon", label: "Vault of the Assassin" },
    { id: "dungeon-cave", x: 480, y: 540, type: "dungeon", label: "Cave of the Betrayer" },
    { id: "dungeon-tomb", x: 700, y: 360, type: "dungeon", label: "Tomb of the Unworthy" },
    { id: "boss-belial", x: 730, y: 650, type: "boss", label: "Belial" },
    { id: "elite-canyon1", x: 460, y: 250, type: "elite", label: "Elite Pack" },
    { id: "elite-canyon2", x: 560, y: 320, type: "elite", label: "Elite Pack" },
    { id: "chest-oasis", x: 820, y: 200, type: "chest", label: "Resplendent Chest" },
    { id: "event-sands", x: 500, y: 460, type: "event", label: "Restless Sands" },
  ],
};

// ─── ACT III MAP ──────────────────────────────────────────────────────────────
export const act3Map: ActMapData = {
  actId: "act3",
  viewBox: "0 0 1000 700",
  bgColor: "#080302",
  accentColor: "#ff4500",
  zones: [
    { id: "bastions-keep", label: "Bastion's Keep", points: "60,260 260,260 260,420 60,420", color: "#2a1005", opacity: 0.75 },
    { id: "keep-depths", label: "Keep Depths", points: "60,420 260,420 260,580 60,580", color: "#1a0805", opacity: 0.7 },
    { id: "stonefort", label: "Stonefort", points: "260,200 480,200 480,380 260,380", color: "#2a1005", opacity: 0.65 },
    { id: "bridge-korsikk", label: "Bridge of Korsikk", points: "460,280 660,280 660,420 460,420", color: "#1f0a05", opacity: 0.6 },
    { id: "rakkis-crossing", label: "Rakkis Crossing", points: "640,200 860,200 860,380 640,380", color: "#2a1005", opacity: 0.65 },
    { id: "arreat-crater", label: "Arreat Crater", points: "640,380 900,380 900,580 640,580", color: "#1a0805", opacity: 0.7 },
    { id: "tower-damned", label: "Tower of the Damned", points: "760,500 940,500 940,680 760,680", color: "#0f0505", opacity: 0.75 },
    { id: "skycrown", label: "Skycrown Battlements", points: "260,80 640,80 640,200 260,200", color: "#1a0a05", opacity: 0.6 },
    { id: "core-arreat", label: "Core of Arreat", points: "640,580 900,580 900,680 640,680", color: "#0f0305", opacity: 0.75 },
  ],
  paths: [
    { d: "M160,340 L260,340 L380,340 L460,340 L560,340 L640,300 L750,260", color: "#ff4500", width: 3.5 },
    { d: "M160,420 L160,500 L200,560", color: "#cc3300", width: 2.5 },
    { d: "M380,200 L380,130 L500,100 L620,120", color: "#cc3300", width: 2 },
    { d: "M750,260 L820,240 L860,260 L860,360", color: "#ff4500", width: 3 },
    { d: "M750,380 L750,480 L800,560 L820,620", color: "#cc2200", width: 2.5 },
    { d: "M860,460 L900,500 L880,580 L860,640", color: "#cc2200", width: 2 },
    { d: "M560,420 L560,500 L600,540", color: "#8a3a1a", width: 2, dashed: true },
    { d: "M260,380 L260,500 L200,560", color: "#8a3a1a", width: 2 },
    { d: "M820,560 L820,640 L760,660", color: "#660000", width: 2.5 },
  ],
  labels: [
    { x: 155, y: 340, text: "Bastion's Keep", color: "#e8a070", size: 11, bold: true },
    { x: 360, y: 290, text: "Stonefort", color: "#e8a070", size: 10, bold: true },
    { x: 550, y: 350, text: "Bridge of Korsikk", color: "#c48060", size: 9 },
    { x: 745, y: 280, text: "Rakkis Crossing", color: "#e87040", size: 11, bold: true },
    { x: 760, y: 470, text: "Arreat Crater", color: "#e85020", size: 11, bold: true },
    { x: 840, y: 590, text: "Tower of the Damned", color: "#e83010", size: 9, bold: true },
    { x: 430, y: 130, text: "Skycrown Battlements", color: "#c07050", size: 9 },
    { x: 155, y: 500, text: "Keep Depths", color: "#c06040", size: 10 },
    { x: 760, y: 640, text: "Core of Arreat", color: "#e82000", size: 10, bold: true },
  ],
  pois: [
    { id: "wp-bastions", x: 160, y: 340, type: "waypoint", label: "Bastion's Keep" },
    { id: "wp-stonefort", x: 370, y: 290, type: "waypoint", label: "Stonefort" },
    { id: "wp-rakkis", x: 700, y: 280, type: "waypoint", label: "Rakkis Crossing" },
    { id: "wp-arreat1", x: 700, y: 440, type: "waypoint", label: "Arreat Crater Level 1" },
    { id: "wp-arreat2", x: 700, y: 520, type: "waypoint", label: "Arreat Crater Level 2" },
    { id: "keywarden-xahrith", x: 380, y: 240, type: "keywarden", label: "Xah'Rith the Keywarden" },
    { id: "dungeon-keep1", x: 160, y: 480, type: "dungeon", label: "Keep Depths Level 1" },
    { id: "dungeon-tower1", x: 820, y: 540, type: "dungeon", label: "Tower of the Damned L1" },
    { id: "dungeon-tower2", x: 860, y: 600, type: "dungeon", label: "Tower of the Damned L2" },
    { id: "boss-azmodan", x: 800, y: 650, type: "boss", label: "Azmodan" },
    { id: "elite-rakkis1", x: 720, y: 240, type: "elite", label: "Bridge Elite Pack" },
    { id: "elite-rakkis2", x: 800, y: 260, type: "elite", label: "Bridge Elite Pack" },
    { id: "elite-arreat1", x: 740, y: 420, type: "elite", label: "Crater Elite Pack" },
    { id: "elite-tower1", x: 840, y: 520, type: "elite", label: "Tower Elite Pack" },
    { id: "chest-arreat", x: 880, y: 400, type: "chest", label: "Resplendent Chest" },
  ],
};

// ─── ACT IV MAP ───────────────────────────────────────────────────────────────
export const act4Map: ActMapData = {
  actId: "act4",
  viewBox: "0 0 1000 700",
  bgColor: "#030508",
  accentColor: "#7eb8f7",
  zones: [
    { id: "crystal-arch", label: "Crystal Arch", points: "380,60 620,60 620,200 380,200", color: "#0a1525", opacity: 0.75 },
    { id: "gardens-hope1", label: "Gardens of Hope T1", points: "100,180 420,180 420,380 100,380", color: "#0a1520", opacity: 0.65 },
    { id: "gardens-hope2", label: "Gardens of Hope T2", points: "100,380 420,380 420,560 100,560", color: "#0a1018", opacity: 0.65 },
    { id: "hell-rift", label: "Hell Rift", points: "420,200 640,200 640,400 420,400", color: "#150a0a", opacity: 0.65 },
    { id: "silver-spire1", label: "Silver Spire Level 1", points: "620,180 880,180 880,400 620,400", color: "#0f1520", opacity: 0.65 },
    { id: "silver-spire2", label: "Silver Spire Level 2", points: "620,400 880,400 880,580 620,580", color: "#0a1018", opacity: 0.7 },
    { id: "crystal-colonnade", label: "Crystal Colonnade", points: "420,400 640,400 640,580 420,580", color: "#0f0f20", opacity: 0.6 },
    { id: "great-span", label: "Great Span", points: "100,560 640,560 640,680 100,680", color: "#0a0f15", opacity: 0.6 },
    { id: "vestibule", label: "Vestibule of Light", points: "640,580 880,580 880,680 640,680", color: "#0a0f1a", opacity: 0.7 },
  ],
  paths: [
    { d: "M500,200 L500,300 L300,300 L200,340", color: "#7eb8f7", width: 3 },
    { d: "M200,340 L200,440 L200,540", color: "#5a9ad4", width: 2.5 },
    { d: "M500,200 L500,300 L530,350 L530,420", color: "#7eb8f7", width: 2.5 },
    { d: "M500,200 L700,250 L780,280 L780,380", color: "#7eb8f7", width: 3 },
    { d: "M780,380 L780,480 L750,560", color: "#5a9ad4", width: 2.5 },
    { d: "M530,420 L530,500 L400,560", color: "#5a7ab4", width: 2 },
    { d: "M200,560 L400,600 L600,620", color: "#3a5a8a", width: 2 },
    { d: "M750,560 L750,640 L720,670", color: "#3a5a8a", width: 2.5 },
    { d: "M300,180 L300,100 L500,80 L700,100", color: "#9ad4ff", width: 2, dashed: true },
  ],
  labels: [
    { x: 500, y: 130, text: "Crystal Arch", color: "#c0d8f0", size: 11, bold: true },
    { x: 255, y: 280, text: "Gardens of Hope T1", color: "#90c0e0", size: 10, bold: true },
    { x: 255, y: 470, text: "Gardens of Hope T2", color: "#80b0d0", size: 10 },
    { x: 525, y: 300, text: "Hell Rift", color: "#e07060", size: 10 },
    { x: 745, y: 290, text: "Silver Spire Level 1", color: "#a0c8e8", size: 10, bold: true },
    { x: 745, y: 490, text: "Silver Spire Level 2", color: "#90b8d8", size: 10 },
    { x: 525, y: 490, text: "Crystal Colonnade", color: "#8090c0", size: 9 },
    { x: 350, y: 620, text: "Great Span", color: "#6080a0", size: 9 },
    { x: 755, y: 630, text: "Vestibule of Light", color: "#90b0d0", size: 9 },
  ],
  pois: [
    { id: "wp-crystal-arch", x: 500, y: 130, type: "waypoint", label: "Crystal Arch" },
    { id: "wp-gardens1", x: 200, y: 280, type: "waypoint", label: "Gardens of Hope T1" },
    { id: "wp-gardens2", x: 200, y: 460, type: "waypoint", label: "Gardens of Hope T2" },
    { id: "wp-spire1", x: 750, y: 280, type: "waypoint", label: "Silver Spire Level 1" },
    { id: "wp-spire2", x: 750, y: 480, type: "waypoint", label: "Silver Spire Level 2" },
    { id: "keywarden-nekarat", x: 200, y: 440, type: "keywarden", label: "Nekarat the Keywarden" },
    { id: "boss-diablo", x: 750, y: 640, type: "boss", label: "Diablo" },
    { id: "boss-rakanoth", x: 300, y: 500, type: "boss", label: "Rakanoth" },
    { id: "boss-izual", x: 530, y: 460, type: "boss", label: "Izual" },
    { id: "dungeon-hell-rift1", x: 530, y: 260, type: "dungeon", label: "Hell Rift Level 1" },
    { id: "dungeon-hell-rift2", x: 530, y: 360, type: "dungeon", label: "Hell Rift Level 2" },
    { id: "elite-gardens1", x: 280, y: 240, type: "elite", label: "Elite Pack" },
    { id: "elite-spire1", x: 820, y: 300, type: "elite", label: "Elite Pack" },
    { id: "chest-gardens", x: 350, y: 200, type: "chest", label: "Celestial Chest" },
  ],
};

// ─── ACT V MAP ────────────────────────────────────────────────────────────────
export const act5Map: ActMapData = {
  actId: "act5",
  viewBox: "0 0 1000 700",
  bgColor: "#050308",
  accentColor: "#9b59b6",
  zones: [
    { id: "survivors-enclave", label: "Survivors' Enclave", points: "60,260 220,260 220,400 60,400", color: "#150a20", opacity: 0.75 },
    { id: "westmarch-commons", label: "Westmarch Commons", points: "220,180 520,180 520,420 220,420", color: "#100818", opacity: 0.65 },
    { id: "westmarch-heights", label: "Westmarch Heights", points: "220,80 520,80 520,180 220,180", color: "#0f0618", opacity: 0.6 },
    { id: "blood-marsh", label: "Blood Marsh", points: "500,200 760,200 760,420 500,420", color: "#0a0f10", opacity: 0.65 },
    { id: "ruins-corvus", label: "Ruins of Corvus", points: "740,180 960,180 960,420 740,420", color: "#0a0810", opacity: 0.7 },
    { id: "greyhollow", label: "Greyhollow Island", points: "60,400 260,400 260,580 60,580", color: "#080a10", opacity: 0.6 },
    { id: "pandemonium", label: "Pandemonium Fortress", points: "500,420 800,420 800,580 500,580", color: "#100a18", opacity: 0.7 },
    { id: "battlefields", label: "Battlefields of Eternity", points: "500,560 960,560 960,700 500,700", color: "#150a20", opacity: 0.7 },
    { id: "pandemonium2", label: "Pandemonium Fortress L2", points: "760,420 960,420 960,560 760,560", color: "#0f0818", opacity: 0.7 },
  ],
  paths: [
    { d: "M140,330 L220,330 L370,300 L500,280 L620,260 L750,240", color: "#9b59b6", width: 3 },
    { d: "M140,330 L140,400 L140,500", color: "#7a3a9a", width: 2 },
    { d: "M370,180 L370,120 L450,90", color: "#7a3a9a", width: 2 },
    { d: "M750,300 L850,260 L940,280 L940,380", color: "#9b59b6", width: 2.5 },
    { d: "M620,420 L620,500 L660,560", color: "#7a3a9a", width: 2.5 },
    { d: "M660,560 L700,620 L750,660", color: "#6a2a8a", width: 3 },
    { d: "M850,420 L900,480 L920,540", color: "#7a3a9a", width: 2 },
    { d: "M140,500 L200,540", color: "#5a2a7a", width: 1.5, dashed: true },
    { d: "M940,380 L940,500 L900,560 L880,620 L860,680", color: "#6a2a8a", width: 2.5 },
  ],
  labels: [
    { x: 138, y: 330, text: "Survivors' Enclave", color: "#c090e0", size: 10, bold: true },
    { x: 365, y: 300, text: "Westmarch Commons", color: "#b080d0", size: 10, bold: true },
    { x: 365, y: 130, text: "Westmarch Heights", color: "#9070c0", size: 9 },
    { x: 620, y: 300, text: "Blood Marsh", color: "#8070a0", size: 10 },
    { x: 845, y: 300, text: "Ruins of Corvus", color: "#c090e0", size: 10, bold: true },
    { x: 138, y: 490, text: "Greyhollow Island", color: "#7080a0", size: 9 },
    { x: 630, y: 500, text: "Pandemonium Fortress", color: "#b080d0", size: 10, bold: true },
    { x: 720, y: 640, text: "Battlefields of Eternity", color: "#d0a0f0", size: 11, bold: true },
    { x: 855, y: 490, text: "Pandemonium L2", color: "#9060c0", size: 9 },
  ],
  pois: [
    { id: "wp-enclave", x: 140, y: 330, type: "waypoint", label: "Survivors' Enclave" },
    { id: "wp-westmarch", x: 360, y: 300, type: "waypoint", label: "Westmarch Commons" },
    { id: "wp-blood-marsh", x: 600, y: 300, type: "waypoint", label: "Blood Marsh" },
    { id: "wp-corvus", x: 800, y: 280, type: "waypoint", label: "Passage to Corvus" },
    { id: "wp-battlefields", x: 660, y: 620, type: "waypoint", label: "Battlefields of Eternity" },
    { id: "wp-pandemonium", x: 620, y: 480, type: "waypoint", label: "Pandemonium Fortress" },
    { id: "dungeon-cathedral", x: 440, y: 340, type: "dungeon", label: "Westmarch Cathedral" },
    { id: "dungeon-cemetery", x: 280, y: 360, type: "dungeon", label: "Briarthorn Cemetery" },
    { id: "dungeon-corvus1", x: 860, y: 240, type: "dungeon", label: "Ruins of Corvus L1" },
    { id: "dungeon-corvus2", x: 920, y: 340, type: "dungeon", label: "Ruins of Corvus L2" },
    { id: "boss-malthael", x: 900, y: 520, type: "boss", label: "Malthael" },
    { id: "boss-urzael", x: 440, y: 260, type: "boss", label: "Urzael" },
    { id: "boss-adria", x: 320, y: 240, type: "boss", label: "Adria" },
    { id: "elite-battlefields1", x: 600, y: 620, type: "elite", label: "Elite Pack" },
    { id: "elite-battlefields2", x: 720, y: 600, type: "elite", label: "Elite Pack" },
    { id: "elite-battlefields3", x: 840, y: 640, type: "elite", label: "Elite Pack" },
    { id: "chest-corvus1", x: 880, y: 260, type: "chest", label: "Resplendent Chest L1" },
    { id: "chest-corvus2", x: 940, y: 360, type: "chest", label: "Resplendent Chest L2" },
    { id: "goblin-battlefields", x: 760, y: 620, type: "goblin", label: "Goblin Cluster" },
    { id: "event-greyhollow", x: 160, y: 500, type: "event", label: "Ancient Tree Event" },
  ],
};

export const ACT_MAPS: Record<string, ActMapData> = {
  act1: act1Map,
  act2: act2Map,
  act3: act3Map,
  act4: act4Map,
  act5: act5Map,
};

// ─── SVG Map Renderer ─────────────────────────────────────────────────────────
interface SvgMapProps {
  mapData: ActMapData;
  selectedPoiId: string | null;
  onPoiClick: (poi: MapPoi) => void;
  width?: number;
  height?: number;
}

export function SvgActMap({ mapData, selectedPoiId, onPoiClick }: SvgMapProps) {
  return (
    <svg
      viewBox={mapData.viewBox}
      style={{ width: "100%", height: "100%", display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="1000" height="700" fill={mapData.bgColor} />

      {/* Subtle grid texture */}
      <defs>
        <pattern id={`grid-${mapData.actId}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={mapData.accentColor} strokeWidth="0.3" opacity="0.15" />
        </pattern>
        {/* Glow filter for paths */}
        <filter id={`glow-${mapData.actId}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Strong glow for POIs */}
        <filter id={`poi-glow-${mapData.actId}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1000" height="700" fill={`url(#grid-${mapData.actId})`} />

      {/* Zone regions */}
      {mapData.zones.map((zone) => (
        <g key={zone.id}>
          <polygon
            points={zone.points}
            fill={zone.color}
            fillOpacity={zone.opacity ?? 0.6}
            stroke={mapData.accentColor}
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
          {/* Inner highlight border */}
          <polygon
            points={zone.points}
            fill="none"
            stroke={zone.color}
            strokeWidth="2"
            strokeOpacity="0.3"
            strokeDasharray="8,4"
          />
        </g>
      ))}

      {/* Paths / roads */}
      {mapData.paths.map((path, i) => (
        <g key={i}>
          {/* Glow layer */}
          <path
            d={path.d}
            fill="none"
            stroke={path.color}
            strokeWidth={(path.width ?? 2) + 3}
            strokeOpacity="0.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Main path */}
          <path
            d={path.d}
            fill="none"
            stroke={path.color}
            strokeWidth={path.width ?? 2}
            strokeOpacity="0.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={path.dashed ? "8,5" : undefined}
            filter={`url(#glow-${mapData.actId})`}
          />
        </g>
      ))}

      {/* Zone labels */}
      {mapData.labels.map((label, i) => (
        <text
          key={i}
          x={label.x}
          y={label.y}
          fill={label.color ?? "#c0a080"}
          fontSize={label.size ?? 10}
          fontFamily="'Cinzel', serif"
          fontWeight={label.bold ? "bold" : "normal"}
          textAnchor="middle"
          opacity="0.9"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {label.text}
        </text>
      ))}

      {/* POI Markers */}
      {mapData.pois.map((poi) => {
        const isSelected = selectedPoiId === poi.id;
        const color = POI_COLORS[poi.type] || "#ffffff";
        const r = isSelected ? 10 : 7;

        return (
          <g
            key={poi.id}
            onClick={() => onPoiClick(poi)}
            style={{ cursor: "pointer" }}
            filter={isSelected ? `url(#poi-glow-${mapData.actId})` : undefined}
          >
            {/* Outer ring */}
            <circle
              cx={poi.x}
              cy={poi.y}
              r={r + 4}
              fill={color}
              fillOpacity={isSelected ? 0.2 : 0.1}
              stroke={color}
              strokeWidth="1"
              strokeOpacity={isSelected ? 0.8 : 0.4}
            />
            {/* Inner dot */}
            <circle
              cx={poi.x}
              cy={poi.y}
              r={r}
              fill={isSelected ? color : `${color}55`}
              stroke={color}
              strokeWidth={isSelected ? 2 : 1.5}
            />
            {/* Center dot */}
            <circle
              cx={poi.x}
              cy={poi.y}
              r={isSelected ? 4 : 2.5}
              fill={color}
              opacity={isSelected ? 1 : 0.8}
            />
            {/* Label on selection */}
            {isSelected && (
              <g>
                <rect
                  x={poi.x - poi.label.length * 3.2}
                  y={poi.y - 28}
                  width={poi.label.length * 6.4}
                  height={16}
                  rx="3"
                  fill="rgba(5,3,8,0.92)"
                  stroke={color}
                  strokeWidth="1"
                  strokeOpacity="0.7"
                />
                <text
                  x={poi.x}
                  y={poi.y - 17}
                  fill={color}
                  fontSize="9"
                  fontFamily="'Cinzel', serif"
                  fontWeight="bold"
                  textAnchor="middle"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {poi.label}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Compass rose — bottom right */}
      <g transform="translate(950, 650)" opacity="0.4">
        <circle cx="0" cy="0" r="18" fill="none" stroke={mapData.accentColor} strokeWidth="1" />
        <text x="0" y="-8" fill={mapData.accentColor} fontSize="8" textAnchor="middle" fontFamily="serif">N</text>
        <text x="0" y="14" fill={mapData.accentColor} fontSize="6" textAnchor="middle" fontFamily="serif">S</text>
        <text x="-12" y="3" fill={mapData.accentColor} fontSize="6" textAnchor="middle" fontFamily="serif">W</text>
        <text x="12" y="3" fill={mapData.accentColor} fontSize="6" textAnchor="middle" fontFamily="serif">E</text>
        <line x1="0" y1="-15" x2="0" y2="15" stroke={mapData.accentColor} strokeWidth="0.8" />
        <line x1="-15" y1="0" x2="15" y2="0" stroke={mapData.accentColor} strokeWidth="0.8" />
      </g>

      {/* Act label — top left */}
      <text x="20" y="30" fill={mapData.accentColor} fontSize="14" fontFamily="'Cinzel Decorative', serif" fontWeight="bold" opacity="0.7">
        {mapData.actId.replace("act", "Act ").toUpperCase()}
      </text>
    </svg>
  );
}
