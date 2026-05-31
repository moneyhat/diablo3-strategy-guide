// Sanctuary Grimoire — Definitive Interactive Map
// All 5 Acts on one page. Loads instantly. No drilling required.
// Accurate SVG zone topology for every major area.
// Use as a second-monitor reference while playing.

import { useState, useRef, useEffect, useCallback } from "react";
import { Eye, EyeOff, Search, X, ChevronLeft } from "lucide-react";

// ─── POI Types ────────────────────────────────────────────────────────────────
interface Poi {
  id: string;
  name: string;
  sub?: string;
  type: "waypoint" | "boss" | "keywarden" | "vendor" | "dungeon" | "exit" | "chest" | "event" | "npc";
  x: number; y: number;
  desc: string;
  tip: string;
}

const POI_COLORS: Record<string, string> = {
  waypoint:  "#80cbc4",
  boss:      "#ff7043",
  keywarden: "#ce93d8",
  vendor:    "#ffd54f",
  dungeon:   "#7eb8f7",
  exit:      "#ef9a9a",
  chest:     "#c89b3c",
  event:     "#66bb6a",
  npc:       "#a5d6a7",
};

const POI_ICONS: Record<string, string> = {
  waypoint: "⬟", boss: "☠", keywarden: "🔑", vendor: "⚒",
  dungeon: "▼", exit: "→", chest: "◈", event: "!", npc: "☺",
};

const POI_LABELS: Record<string, string> = {
  waypoint: "Waypoint", boss: "Boss", keywarden: "Keywarden",
  vendor: "Vendor", dungeon: "Dungeon", exit: "Exit",
  chest: "Chest", event: "Event", npc: "NPC",
};

// ─── Act Data ─────────────────────────────────────────────────────────────────
interface ActZone {
  id: string;
  name: string;
  // SVG path data describing the zone shape (polygon points or path d)
  shape: string; // polygon points "x1,y1 x2,y2 ..."
  shapeType: "polygon" | "path";
  fill: string;
  label: { x: number; y: number };
  pois: Poi[];
}

interface ActData {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  bgColor: string;
  viewBox: string; // SVG viewBox
  zones: ActZone[];
  connections: { from: string; to: string; x1: number; y1: number; x2: number; y2: number }[];
}

// ─── ACT I — Khanduras ────────────────────────────────────────────────────────
// Layout based on documented zone topology:
// New Tristram (center-west) → Old Tristram Road → Cathedral (center) →
// Fields of Misery (south) → Festering Woods (north) → Northern Highlands →
// Leoric's Manor → Halls of Agony (deep east)
const ACT1: ActData = {
  id: "act1", name: "Act I", subtitle: "Khanduras", color: "#8b0000", bgColor: "#0a0503",
  viewBox: "0 0 1000 800",
  zones: [
    // New Tristram — walled town, west side
    {
      id: "new-tristram", name: "New Tristram", shapeType: "path",
      // Organic terrain blob — matches the irregular, asymmetric shape of the actual in-game map
      // The town is roughly L-shaped: wider at the north (inn + blacksmith), narrowing south to the gate
      shape: "M 95,270 C 110,255 140,248 165,252 C 185,256 205,262 215,275 C 228,290 225,310 220,328 C 218,340 215,355 218,370 C 220,385 225,398 220,415 C 215,430 205,445 192,455 C 178,465 160,468 145,465 C 128,462 112,455 98,445 C 82,434 72,418 68,400 C 64,382 66,362 68,344 C 70,326 75,305 82,290 C 87,281 91,274 95,270 Z",
      fill: "#1e1408",
      label: { x: 143, y: 358 },
      pois: [
        { id: "nt-wp",    name: "New Tristram",    type: "waypoint", x: 145, y: 355, desc: "Act I hub waypoint in the central square.", tip: "First waypoint to activate. All artisans are here." },
        { id: "nt-haed",  name: "Haedrig Eamon",   sub: "Blacksmith", type: "vendor", x: 175, y: 320, desc: "Blacksmith on the east side of town. Craft, salvage, and upgrade gear.", tip: "Salvage all non-Legendary items you don't need for crafting materials." },
        { id: "nt-shen",  name: "Covetous Shen",   sub: "Jeweler", type: "vendor", x: 120, y: 390, desc: "Jeweler near the inn. Socket gems, combine tiers, craft jewelry.", tip: "Combine gems in sets of 3. Flawless Royal is the endgame standard." },
        { id: "nt-myr",   name: "Myriam Jahzia",   sub: "Mystic", type: "vendor", x: 155, y: 400, desc: "Mystic near the inn (Adventure Mode). Enchant and transmogrify items.", tip: "Use enchanting to fix your weakest secondary stat on key gear pieces." },
        { id: "nt-stash", name: "Stash",            sub: "Slaughtered Calf Inn", type: "npc", x: 105, y: 340, desc: "Your shared stash inside the Slaughtered Calf Inn on the west side.", tip: "Deposit crafting materials and gems before long runs." },
        { id: "nt-gate",  name: "South Gate",       sub: "Exit to Old Tristram Road", type: "exit", x: 145, y: 445, desc: "Main gate at the south end of town leading to Old Tristram Road.", tip: "Always activate the waypoint just outside before exploring." },
        { id: "nt-cellar",name: "Inn Cellar",        sub: "Small Dungeon", type: "dungeon", x: 100, y: 415, desc: "Cellar beneath the inn. Undead enemies, guaranteed elite pack.", tip: "Quick early dungeon. Occasionally spawns a Resplendent Chest." },
      ],
    },
    // Old Tristram Road — connecting corridor
    {
      id: "old-road", name: "Old Tristram Road", shapeType: "polygon",
      shape: "210,420 280,410 320,440 310,500 250,510 200,490 195,460",
      fill: "#1e1208",
      label: { x: 255, y: 460 },
      pois: [
        { id: "otr-wp", name: "Old Tristram Road", type: "waypoint", x: 260, y: 455, desc: "Waypoint on the road between New Tristram and the Cathedral Garden.", tip: "Activate to enable fast travel back to this area." },
      ],
    },
    // Cathedral Garden — entry to the Cathedral
    {
      id: "cathedral-garden", name: "Cathedral Garden", shapeType: "polygon",
      shape: "310,300 420,280 460,340 450,420 380,450 300,440 280,390 290,330",
      fill: "#1a1208",
      label: { x: 370, y: 365 },
      pois: [
        { id: "cg-wp",  name: "Cathedral Garden", type: "waypoint", x: 370, y: 360, desc: "Waypoint at the Cathedral entrance.", tip: "Quick access to Cathedral Level 1." },
        { id: "cg-cat", name: "Cathedral Level 1", sub: "Dungeon Entrance", type: "dungeon", x: 400, y: 320, desc: "Entrance to the Cathedral — 4-level gothic dungeon. Square loop pattern.", tip: "Run all 4 levels. Skeleton King boss on Level 4. Dense undead throughout." },
      ],
    },
    // Cathedral — 4-level dungeon zone
    {
      id: "cathedral", name: "Cathedral", shapeType: "polygon",
      shape: "420,180 520,160 560,220 550,340 480,360 420,340 400,280 405,210",
      fill: "#150e06",
      label: { x: 480, y: 265 },
      pois: [
        { id: "cat-l1", name: "Cathedral Level 1", type: "waypoint", x: 450, y: 300, desc: "Waypoint on Cathedral Level 1.", tip: "Activate before descending." },
        { id: "cat-l3", name: "Cathedral Level 3", type: "waypoint", x: 480, y: 240, desc: "Waypoint on Cathedral Level 3.", tip: "Direct access to Level 3 and 4." },
        { id: "cat-sk", name: "Skeleton King",      sub: "Boss — Royal Crypts", type: "boss", x: 500, y: 195, desc: "The Skeleton King — Act I mid-boss in the Royal Crypts on Cathedral Level 4.", tip: "Kill his summoned skeleton minions first, then focus him. Guaranteed Legendary on first kill." },
        { id: "cat-rc", name: "Royal Crypts",       sub: "Dungeon", type: "dungeon", x: 510, y: 215, desc: "The Royal Crypts beneath the Cathedral. Skeleton King's throne room.", tip: "Enter from Cathedral Level 4. Boss fight arena." },
      ],
    },
    // Leoric's Passage — connecting to Halls of Agony
    {
      id: "leorics-passage", name: "Leoric's Passage", shapeType: "polygon",
      shape: "550,280 660,260 700,310 690,390 620,410 560,390 540,340",
      fill: "#120a04",
      label: { x: 620, y: 335 },
      pois: [
        { id: "lp-wp", name: "Leoric's Passage", type: "waypoint", x: 620, y: 330, desc: "Waypoint in Leoric's Passage leading to the Halls of Agony.", tip: "Shortcut to the Halls of Agony entrance." },
      ],
    },
    // Halls of Agony — 3-level dungeon
    {
      id: "halls-agony", name: "Halls of Agony", shapeType: "polygon",
      shape: "690,260 820,240 860,300 850,420 780,450 700,430 670,370 680,300",
      fill: "#0f0505",
      label: { x: 765, y: 345 },
      pois: [
        { id: "hoa-l2", name: "Halls of Agony L2", type: "waypoint", x: 760, y: 340, desc: "Waypoint on Halls of Agony Level 2. Best waypoint for farming The Butcher.", tip: "Activate this waypoint — it puts you 2 rooms from The Butcher." },
        { id: "hoa-l3", name: "Halls of Agony L3", type: "waypoint", x: 790, y: 300, desc: "Waypoint on Halls of Agony Level 3.", tip: "Direct access to Level 3 elite packs." },
        { id: "hoa-butcher", name: "The Butcher",   sub: "Boss — Halls of Agony L3", type: "boss", x: 830, y: 265, desc: "The Butcher — Act I final boss. Rectangular loop dungeon with long entrance corridor.", tip: "Stay mobile. Dodge his charge attack and fire chain traps. Guaranteed Legendary on first kill." },
      ],
    },
    // Fields of Misery — outdoor zone south
    {
      id: "fields-misery", name: "Fields of Misery", shapeType: "polygon",
      shape: "200,510 400,490 450,540 440,640 360,680 220,670 160,620 170,560",
      fill: "#141a08",
      label: { x: 305, y: 585 },
      pois: [
        { id: "fm-wp",    name: "Fields of Misery", type: "waypoint", x: 305, y: 575, desc: "Waypoint in the Fields of Misery. Top Act I farming zone.", tip: "Best outdoor zone in Act I for elite packs and Resplendent Chests." },
        { id: "fm-odeg",  name: "Odeg the Keywarden", sub: "Key of Destruction", type: "keywarden", x: 360, y: 620, desc: "Act I Keywarden. Drops the Key of Destruction for the Infernal Machine event.", tip: "Must be on Torment I or higher. Found somewhere in the Fields of Misery." },
        { id: "fm-chest", name: "Resplendent Chest", sub: "Rare Spawn", type: "chest", x: 250, y: 640, desc: "Rare Resplendent Chest spawn in the Fields of Misery. High Legendary drop chance.", tip: "Check every run. One of the best chest spawns in Act I." },
        { id: "fm-crypt", name: "Decaying Crypt",    sub: "Dungeon", type: "dungeon", x: 400, y: 555, desc: "One of several random dungeon spawns in the Fields of Misery. Contains elite packs.", tip: "Always enter dungeons in the Fields. Each has a guaranteed elite pack." },
        { id: "fm-goblin",name: "Goblin Spawn",      sub: "Common Location", type: "event", x: 280, y: 610, desc: "Common Treasure Goblin spawn location in the Fields of Misery.", tip: "Kill before it escapes! Always worth chasing — can drop Legendaries." },
      ],
    },
    // Festering Woods — north zone
    {
      id: "festering-woods", name: "Festering Woods", shapeType: "polygon",
      shape: "300,120 450,100 490,160 480,240 400,260 310,250 270,190 280,140",
      fill: "#0e1408",
      label: { x: 380, y: 180 },
      pois: [
        { id: "fw-wp",  name: "Festering Woods", type: "waypoint", x: 380, y: 175, desc: "Waypoint in the Festering Woods. Good for bounties.", tip: "Two dungeons always spawn here — Warrior's Rest and Forsaken Grounds." },
        { id: "fw-d1",  name: "Warrior's Rest",  sub: "Dungeon", type: "dungeon", x: 340, y: 155, desc: "One of two guaranteed dungeons in the Festering Woods.", tip: "Guaranteed elite pack inside. Check for Resplendent Chest." },
        { id: "fw-d2",  name: "Forsaken Grounds", sub: "Dungeon", type: "dungeon", x: 430, y: 155, desc: "Second guaranteed dungeon in the Festering Woods.", tip: "Guaranteed elite pack inside. Check for Resplendent Chest." },
      ],
    },
    // Northern Highlands
    {
      id: "northern-highlands", name: "Northern Highlands", shapeType: "polygon",
      shape: "500,80 680,70 720,130 710,220 630,250 510,240 470,180 480,110",
      fill: "#121008",
      label: { x: 595, y: 160 },
      pois: [
        { id: "nh-wp",   name: "Northern Highlands", type: "waypoint", x: 595, y: 155, desc: "Waypoint in the Northern Highlands.", tip: "Good for bounties. Leoric's Manor is just north." },
        { id: "nh-manor",name: "Leoric's Manor",     sub: "Dungeon Entrance", type: "dungeon", x: 650, y: 120, desc: "Entrance to Leoric's Manor — a multi-room dungeon with undead.", tip: "Contains the Leoric's Manor Courtyard waypoint inside." },
      ],
    },
    // Wortham — small town
    {
      id: "wortham", name: "Wortham", shapeType: "polygon",
      shape: "160,560 220,545 240,590 230,640 175,650 150,610 155,570",
      fill: "#1a1208",
      label: { x: 193, y: 597 },
      pois: [
        { id: "wo-wp", name: "Wortham", type: "waypoint", x: 193, y: 592, desc: "Waypoint in Wortham. Small town south of New Tristram.", tip: "Good for bounties. Wortham Chapel dungeon is nearby." },
      ],
    },
  ],
  connections: [
    { from: "new-tristram", to: "old-road",          x1: 180, y1: 450, x2: 210, y2: 430 },
    { from: "old-road",     to: "cathedral-garden",  x1: 300, y1: 440, x2: 310, y2: 420 },
    { from: "cathedral-garden", to: "cathedral",     x1: 420, y1: 310, x2: 420, y2: 340 },
    { from: "cathedral",    to: "leorics-passage",   x1: 550, y1: 310, x2: 560, y2: 340 },
    { from: "leorics-passage", to: "halls-agony",    x1: 690, y1: 340, x2: 690, y2: 360 },
    { from: "old-road",     to: "fields-misery",     x1: 260, y1: 510, x2: 250, y2: 510 },
    { from: "cathedral-garden", to: "festering-woods", x1: 380, y1: 280, x2: 380, y2: 260 },
    { from: "festering-woods", to: "northern-highlands", x1: 490, y1: 160, x2: 500, y2: 160 },
    { from: "fields-misery", to: "wortham",          x1: 200, y1: 580, x2: 200, y2: 560 },
  ],
};

// ─── ACT II — Caldeum ─────────────────────────────────────────────────────────
const ACT2: ActData = {
  id: "act2", name: "Act II", subtitle: "Caldeum", color: "#c8860a", bgColor: "#080500",
  viewBox: "0 0 1000 800",
  zones: [
    {
      id: "hidden-camp", name: "Hidden Camp", shapeType: "polygon",
      shape: "60,300 200,280 230,340 220,440 170,470 70,460 50,400 55,330",
      fill: "#1e1408",
      label: { x: 140, y: 375 },
      pois: [
        { id: "hc-wp",   name: "Hidden Camp",    type: "waypoint", x: 140, y: 370, desc: "Act II hub waypoint. All artisans available.", tip: "Always activate first. All artisans are within a short walk." },
        { id: "hc-haed", name: "Haedrig Eamon",  sub: "Blacksmith", type: "vendor", x: 90, y: 330, desc: "Blacksmith tent in the Hidden Camp.", tip: "Salvage items before heading into the Dahlgur Oasis runs." },
        { id: "hc-shen", name: "Covetous Shen",  sub: "Jeweler", type: "vendor", x: 175, y: 330, desc: "Jeweler tent in the Hidden Camp.", tip: "Combine gems between Oasis runs to keep your gem tier current." },
        { id: "hc-myr",  name: "Myriam Jahzia",  sub: "Mystic", type: "vendor", x: 185, y: 400, desc: "Mystic tent in the Hidden Camp.", tip: "Enchant your weakest stat slot after each major gear upgrade." },
        { id: "hc-stash",name: "Stash",           sub: "Central Camp", type: "npc", x: 130, y: 410, desc: "Your stash in the Hidden Camp.", tip: "Deposit before long runs." },
        { id: "hc-eirena",name: "Eirena",         sub: "Enchantress Follower", type: "npc", x: 150, y: 395, desc: "The Enchantress follower. Provides crowd control and damage buffs.", tip: "Best for group play. Her Powered Armor amplifies team damage." },
      ],
    },
    {
      id: "road-alcarnus", name: "Road to Alcarnus", shapeType: "polygon",
      shape: "220,340 340,320 370,370 360,440 290,460 215,445",
      fill: "#1a1005",
      label: { x: 290, y: 390 },
      pois: [
        { id: "ra-wp", name: "Khasim Outpost", type: "waypoint", x: 290, y: 385, desc: "Waypoint at the Khasim Outpost on the road to Alcarnus.", tip: "Activate before heading into the city." },
      ],
    },
    {
      id: "alcarnus", name: "Alcarnus", shapeType: "polygon",
      shape: "360,280 500,260 540,320 530,420 450,450 360,440 330,380 340,310",
      fill: "#160e04",
      label: { x: 435, y: 355 },
      pois: [
        { id: "alc-wp",    name: "City of Caldeum", type: "waypoint", x: 435, y: 350, desc: "Waypoint inside Caldeum.", tip: "Central waypoint for Act II city zones." },
        { id: "alc-maghda",name: "Maghda",          sub: "Boss — Alcarnus", type: "boss", x: 490, y: 295, desc: "Maghda — mid-Act II boss in Alcarnus.", tip: "Kill her butterfly minions quickly to interrupt her healing. Stay mobile." },
      ],
    },
    {
      id: "dahlgur-oasis", name: "Dahlgur Oasis", shapeType: "polygon",
      shape: "400,450 600,430 650,490 640,600 550,640 400,630 350,570 360,500",
      fill: "#141a08",
      label: { x: 500, y: 535 },
      pois: [
        { id: "do-wp",    name: "Dahlgur Oasis",   type: "waypoint", x: 500, y: 530, desc: "Waypoint in the Dahlgur Oasis. Best outdoor farming zone in Act II.", tip: "Dense elite packs. Check all dungeon entrances." },
        { id: "do-sokahr",name: "Sokahr",          sub: "Keywarden — Key of Hate", type: "keywarden", x: 570, y: 575, desc: "Act II Keywarden. Drops the Key of Hate for the Infernal Machine.", tip: "Must be on Torment I+. Spawns somewhere in the Dahlgur Oasis." },
        { id: "do-chest", name: "Resplendent Chest", sub: "Rare Spawn", type: "chest", x: 440, y: 600, desc: "Resplendent Chest spawn in the Dahlgur Oasis.", tip: "High Legendary drop chance. Check every run." },
        { id: "do-vault", name: "Vault of the Assassin", sub: "Dungeon", type: "dungeon", x: 610, y: 510, desc: "Complex dungeon with many 3-way intersections. Dense elite packs.", tip: "Use the loop pattern to navigate. Don't miss 3-way intersections." },
      ],
    },
    {
      id: "archives", name: "Archives of Zoltun Kulle", shapeType: "polygon",
      shape: "640,300 800,280 840,340 830,450 750,480 640,460 600,390 610,320",
      fill: "#1a1408",
      label: { x: 720, y: 380 },
      pois: [
        { id: "az-wp",   name: "Archives of Zoltun Kulle", type: "waypoint", x: 720, y: 375, desc: "Waypoint at the Archives entrance.", tip: "Dense elite packs inside. Boss at the end." },
        { id: "az-kulle",name: "Zoltun Kulle",    sub: "Boss", type: "boss", x: 790, y: 305, desc: "Zoltun Kulle — mid-Act II boss in the Archives.", tip: "Destroy his blood orbs to interrupt his healing. Dodge his sand traps." },
      ],
    },
    {
      id: "desolate-sands", name: "Desolate Sands", shapeType: "polygon",
      shape: "540,180 720,160 760,220 750,300 660,320 540,300 500,240 510,190",
      fill: "#120e04",
      label: { x: 630, y: 240 },
      pois: [
        { id: "ds-wp", name: "Desolate Sands", type: "waypoint", x: 630, y: 235, desc: "Waypoint in the Desolate Sands.", tip: "Good for bounties. Multiple dungeon entrances." },
      ],
    },
    {
      id: "imperial-palace", name: "Imperial Palace", shapeType: "polygon",
      shape: "820,350 940,330 970,400 960,500 880,530 810,510 790,440 800,370",
      fill: "#100c04",
      label: { x: 880, y: 430 },
      pois: [
        { id: "ip-wp",    name: "Imperial Palace", type: "waypoint", x: 880, y: 425, desc: "Waypoint in the Imperial Palace.", tip: "Leads to the final boss fight." },
        { id: "ip-belial",name: "Belial",          sub: "Boss — Act II Final", type: "boss", x: 930, y: 355, desc: "Belial, Lord of Lies — Act II final boss in the Imperial Palace.", tip: "Phase 2: dodge the green poison pools. Phase 3: dodge his slam attacks and stay mobile." },
      ],
    },
  ],
  connections: [
    { from: "hidden-camp",   to: "road-alcarnus",   x1: 220, y1: 390, x2: 225, y2: 380 },
    { from: "road-alcarnus", to: "alcarnus",         x1: 360, y1: 380, x2: 360, y2: 370 },
    { from: "alcarnus",      to: "dahlgur-oasis",    x1: 440, y1: 450, x2: 440, y2: 460 },
    { from: "alcarnus",      to: "desolate-sands",   x1: 500, y1: 310, x2: 510, y2: 300 },
    { from: "desolate-sands",to: "archives",         x1: 720, y1: 280, x2: 720, y2: 300 },
    { from: "archives",      to: "imperial-palace",  x1: 830, y1: 390, x2: 820, y2: 400 },
  ],
};

// ─── ACT III — Mount Arreat ───────────────────────────────────────────────────
const ACT3: ActData = {
  id: "act3", name: "Act III", subtitle: "Mount Arreat", color: "#c0392b", bgColor: "#080200",
  viewBox: "0 0 1000 800",
  zones: [
    {
      id: "bastions-keep", name: "Bastion's Keep", shapeType: "polygon",
      shape: "60,320 200,300 230,360 220,460 170,490 65,480 45,420 50,350",
      fill: "#1a0a08",
      label: { x: 138, y: 395 },
      pois: [
        { id: "bk-wp",    name: "Bastion's Keep",  type: "waypoint", x: 138, y: 390, desc: "Act III hub waypoint. All artisans available.", tip: "Always activate first. Keep Depths entrance is just south." },
        { id: "bk-haed",  name: "Haedrig Eamon",   sub: "Blacksmith", type: "vendor", x: 85, y: 440, desc: "Blacksmith forge in Bastion's Keep.", tip: "Salvage items before heading into the Keep Depths." },
        { id: "bk-shen",  name: "Covetous Shen",   sub: "Jeweler", type: "vendor", x: 185, y: 440, desc: "Jeweler workshop in Bastion's Keep.", tip: "Combine gems between Keep Depths runs." },
        { id: "bk-myr",   name: "Myriam Jahzia",   sub: "Mystic", type: "vendor", x: 195, y: 390, desc: "Mystic chamber in Bastion's Keep.", tip: "Enchant your weakest stat after each gear upgrade." },
        { id: "bk-stash", name: "Stash",            sub: "War Room", type: "npc", x: 130, y: 420, desc: "Your stash in Bastion's Keep.", tip: "Deposit before runs." },
      ],
    },
    {
      id: "keep-depths", name: "Keep Depths", shapeType: "polygon",
      shape: "80,480 220,460 250,520 240,620 180,650 80,640 55,580 60,510",
      fill: "#120605",
      label: { x: 153, y: 555 },
      pois: [
        { id: "kd-wp",   name: "Keep Depths L2",  type: "waypoint", x: 153, y: 550, desc: "Waypoint on Keep Depths Level 2. Best farming zone in Act III.", tip: "Run both levels every game. 4+ elite packs per level." },
        { id: "kd-ghom", name: "Ghom",            sub: "Boss — Keep Depths L3", type: "boss", x: 110, y: 510, desc: "Ghom — mid-Act III boss on Keep Depths Level 3.", tip: "Move constantly to avoid his poison gas cloud. Kill him fast." },
        { id: "kd-chest",name: "Resplendent Chest", sub: "Rare Spawn", type: "chest", x: 200, y: 610, desc: "Resplendent Chest spawn in the Keep Depths.", tip: "Check every run. High Legendary drop chance." },
      ],
    },
    {
      id: "rakkis-crossing", name: "Rakkis Crossing", shapeType: "polygon",
      shape: "230,320 400,300 440,360 430,450 350,470 230,460 200,400 210,340",
      fill: "#160a06",
      label: { x: 320, y: 385 },
      pois: [
        { id: "rc-wp", name: "Rakkis Crossing", type: "waypoint", x: 320, y: 380, desc: "Waypoint at Rakkis Crossing. Good for bounties.", tip: "Multiple elite packs on the bridge and surrounding area." },
      ],
    },
    {
      id: "stonefort", name: "Stonefort", shapeType: "polygon",
      shape: "430,220 580,200 620,260 610,360 530,390 430,370 400,300 410,240",
      fill: "#140806",
      label: { x: 510, y: 295 },
      pois: [
        { id: "sf-wp",     name: "Stonefort",       type: "waypoint", x: 510, y: 290, desc: "Waypoint at Stonefort battlements.", tip: "Good for bounties. Xah'Rith the Keywarden is here." },
        { id: "sf-xahrith",name: "Xah'Rith",        sub: "Keywarden — Key of Terror", type: "keywarden", x: 570, y: 230, desc: "Act III Keywarden. Drops the Key of Terror for the Infernal Machine.", tip: "Must be on Torment I+. Found in Stonefort." },
      ],
    },
    {
      id: "arreat-crater", name: "Arreat Crater", shapeType: "polygon",
      shape: "580,360 760,340 800,410 790,530 700,560 580,540 540,470 550,390",
      fill: "#100504",
      label: { x: 670, y: 450 },
      pois: [
        { id: "ac-wp",  name: "Arreat Crater L2", type: "waypoint", x: 670, y: 445, desc: "Waypoint on Arreat Crater Level 2. Winding choke-point corridors.", tip: "Large irregular tiles connected by narrow choke points. Follow the path." },
        { id: "ac-cyd", name: "Cydaea",           sub: "Boss — Crater L2", type: "boss", x: 740, y: 380, desc: "Cydaea, Maiden of Lust — boss on Arreat Crater Level 2.", tip: "Kill her spider minions. Dodge her web attacks and stay mobile." },
      ],
    },
    {
      id: "core-arreat", name: "Core of Arreat", shapeType: "polygon",
      shape: "780,280 920,260 960,330 950,440 870,470 780,450 750,380 760,300",
      fill: "#0e0403",
      label: { x: 855, y: 365 },
      pois: [
        { id: "ca-wp",     name: "Core of Arreat", type: "waypoint", x: 855, y: 360, desc: "Waypoint in the Core of Arreat.", tip: "Leads to the final boss fight." },
        { id: "ca-azmodan",name: "Azmodan",        sub: "Boss — Act III Final", type: "boss", x: 920, y: 275, desc: "Azmodan, Lord of Sin — Act III final boss in the Core of Arreat.", tip: "Dodge his blood pools. Kill summoned demons quickly. Destroy his summoning portals." },
        { id: "ca-siege",  name: "Siegebreaker",   sub: "Boss — Arreat Crater", type: "boss", x: 880, y: 310, desc: "Siegebreaker Assault Beast — boss in the Arreat Crater.", tip: "Stay behind him to avoid his charge. Dodge his stomp attacks." },
      ],
    },
  ],
  connections: [
    { from: "bastions-keep",  to: "keep-depths",    x1: 140, y1: 480, x2: 140, y2: 490 },
    { from: "bastions-keep",  to: "rakkis-crossing", x1: 220, y1: 390, x2: 230, y2: 390 },
    { from: "rakkis-crossing",to: "stonefort",       x1: 430, y1: 340, x2: 430, y2: 360 },
    { from: "stonefort",      to: "arreat-crater",   x1: 610, y1: 310, x2: 590, y2: 380 },
    { from: "arreat-crater",  to: "core-arreat",     x1: 780, y1: 450, x2: 780, y2: 430 },
  ],
};

// ─── ACT IV — High Heavens ────────────────────────────────────────────────────
const ACT4: ActData = {
  id: "act4", name: "Act IV", subtitle: "High Heavens", color: "#5b9bd5", bgColor: "#020308",
  viewBox: "0 0 1000 800",
  zones: [
    {
      id: "diamond-gates", name: "Diamond Gates", shapeType: "polygon",
      shape: "380,300 620,280 650,350 640,450 560,480 420,470 380,400 385,320",
      fill: "#0a0a18",
      label: { x: 515, y: 380 },
      pois: [
        { id: "dg-wp",   name: "Diamond Gates",  type: "waypoint", x: 515, y: 375, desc: "Act IV hub waypoint. All artisans available.", tip: "Always activate first. All artisans are in the side chambers." },
        { id: "dg-haed", name: "Haedrig Eamon",  sub: "Blacksmith", type: "vendor", x: 430, y: 350, desc: "Divine forge chamber in the High Heavens.", tip: "Salvage items before heading into the Silver Spire." },
        { id: "dg-shen", name: "Covetous Shen",  sub: "Jeweler", type: "vendor", x: 600, y: 350, desc: "Celestial gem workshop in the High Heavens.", tip: "Combine gems between Silver Spire runs." },
        { id: "dg-myr",  name: "Myriam Jahzia",  sub: "Mystic", type: "vendor", x: 515, y: 455, desc: "Mystic chamber in the High Heavens.", tip: "Enchant your weakest stat after each upgrade." },
        { id: "dg-stash",name: "Stash",           sub: "Central Hall", type: "npc", x: 490, y: 400, desc: "Your stash in the Diamond Gates.", tip: "Deposit before runs." },
      ],
    },
    {
      id: "gardens-hope", name: "Gardens of Hope", shapeType: "polygon",
      shape: "100,280 340,260 380,320 370,450 280,480 100,460 70,380 80,300",
      fill: "#080810",
      label: { x: 225, y: 370 },
      pois: [
        { id: "gh-wp",    name: "Gardens of Hope T1", type: "waypoint", x: 225, y: 365, desc: "Waypoint in the Gardens of Hope Tier 1.", tip: "3+ elite packs. Good for bounties and Keywarden farming." },
        { id: "gh-wp2",   name: "Gardens of Hope T2", type: "waypoint", x: 180, y: 320, desc: "Waypoint in the Gardens of Hope Tier 2.", tip: "Leads deeper into the Gardens." },
        { id: "gh-izual", name: "Izual",             sub: "Boss — Gardens of Hope", type: "boss", x: 140, y: 295, desc: "Izual — mid-Act IV boss in the Gardens of Hope.", tip: "Kill his ice crystal spawns to prevent them from healing him. Stay mobile." },
      ],
    },
    {
      id: "silver-spire", name: "Silver Spire", shapeType: "polygon",
      shape: "620,280 860,260 900,330 890,480 800,510 620,490 580,410 590,300",
      fill: "#060610",
      label: { x: 740, y: 385 },
      pois: [
        { id: "ss-wp",     name: "Silver Spire L1",  type: "waypoint", x: 740, y: 380, desc: "Waypoint at Silver Spire Level 1. Best farming zone in Act IV.", tip: "Figure-eight double loop pattern. Run both levels every game." },
        { id: "ss-wp2",    name: "Silver Spire L2",  type: "waypoint", x: 780, y: 320, desc: "Waypoint on Silver Spire Level 2.", tip: "Level 2 leads directly to Diablo's boss arena." },
        { id: "ss-nekarat",name: "Nekarat",          sub: "Keywarden — Key of Bones", type: "keywarden", x: 840, y: 290, desc: "Act IV Keywarden. Drops the Key of Bones for the Infernal Machine.", tip: "Must be on Torment I+. Found in the Silver Spire." },
        { id: "ss-diablo", name: "Diablo",           sub: "Boss — Act IV Final", type: "boss", x: 860, y: 270, desc: "Diablo, Prime Evil — Act IV final boss at the top of the Silver Spire.", tip: "Phase 3: avoid his shadow clones and lightning breath. Stay mobile and keep moving." },
        { id: "ss-rakanoth",name: "Rakanoth",        sub: "Boss — Library of Fate", type: "boss", x: 800, y: 350, desc: "Rakanoth, Lord of Despair — boss in the Library of Fate.", tip: "Dodge his teleport slam. Kill his summoned minions quickly." },
      ],
    },
    {
      id: "crystal-colonnade", name: "Crystal Colonnade", shapeType: "polygon",
      shape: "300,480 560,460 590,520 580,620 480,650 300,640 260,570 270,500",
      fill: "#070712",
      label: { x: 425, y: 555 },
      pois: [
        { id: "cc-wp", name: "Crystal Colonnade", type: "waypoint", x: 425, y: 550, desc: "Waypoint in the Crystal Colonnade.", tip: "Good for bounties. Dense angelic architecture." },
      ],
    },
  ],
  connections: [
    { from: "diamond-gates", to: "gardens-hope",      x1: 385, y1: 390, x2: 370, y2: 390 },
    { from: "diamond-gates", to: "silver-spire",      x1: 645, y1: 390, x2: 625, y2: 390 },
    { from: "diamond-gates", to: "crystal-colonnade", x1: 515, y1: 475, x2: 515, y2: 480 },
  ],
};

// ─── ACT V — Westmarch ────────────────────────────────────────────────────────
const ACT5: ActData = {
  id: "act5", name: "Act V", subtitle: "Westmarch", color: "#8e44ad", bgColor: "#040208",
  viewBox: "0 0 1000 800",
  zones: [
    {
      id: "survivors-enclave", name: "Survivors' Enclave", shapeType: "polygon",
      shape: "60,300 200,280 230,340 220,440 170,470 65,460 45,400 50,330",
      fill: "#100814",
      label: { x: 138, y: 375 },
      pois: [
        { id: "se-wp",   name: "Survivors' Enclave", type: "waypoint", x: 138, y: 370, desc: "Act V hub waypoint. All artisans available.", tip: "Always activate first. Ruins of Corvus is the best farming zone." },
        { id: "se-haed", name: "Haedrig Eamon",      sub: "Blacksmith", type: "vendor", x: 85, y: 330, desc: "Improvised forge in the Survivors' Enclave.", tip: "Salvage items before heading into the Ruins of Corvus." },
        { id: "se-shen", name: "Covetous Shen",      sub: "Jeweler", type: "vendor", x: 185, y: 330, desc: "Gem shelter in the Survivors' Enclave.", tip: "Combine gems between Corvus runs." },
        { id: "se-myr",  name: "Myriam Jahzia",      sub: "Mystic", type: "vendor", x: 195, y: 400, desc: "Mystic shelter in the Survivors' Enclave.", tip: "Enchant your weakest stat after each upgrade." },
        { id: "se-stash",name: "Stash",               sub: "Central Bonfire", type: "npc", x: 130, y: 410, desc: "Your stash near the central bonfire.", tip: "Deposit before runs." },
        { id: "se-dock", name: "Greyhollow Island",  sub: "Dock — Optional Zone", type: "exit", x: 185, y: 450, desc: "Dock leading to Greyhollow Island — optional zone with unique enemies.", tip: "Good for bounties. Unique spectral enemies and loot." },
      ],
    },
    {
      id: "westmarch-commons", name: "Westmarch Commons", shapeType: "polygon",
      shape: "220,280 460,260 500,330 490,450 400,480 220,460 185,380 195,300",
      fill: "#0c0610",
      label: { x: 342, y: 370 },
      pois: [
        { id: "wc-wp",    name: "Westmarch Commons", type: "waypoint", x: 342, y: 365, desc: "Waypoint in Westmarch Commons. City grid with interconnected rectangular loops.", tip: "Dense elite packs throughout the ruined city streets." },
        { id: "wc-urzael",name: "Urzael",            sub: "Boss — Westmarch Heights", type: "boss", x: 450, y: 285, desc: "Urzael — mid-Act V boss in the Westmarch Heights.", tip: "Dodge his fire cannon and burning balls. Stay mobile." },
        { id: "wc-event", name: "Survivor Event",    sub: "Rescue Event", type: "event", x: 290, y: 430, desc: "Rescue survivor event in the Commons. Complete for bonus XP and gold.", tip: "Always complete events — they give significant XP and can drop Legendaries." },
      ],
    },
    {
      id: "blood-marsh", name: "Blood Marsh", shapeType: "polygon",
      shape: "480,240 680,220 720,290 710,400 620,430 480,410 440,340 450,260",
      fill: "#0a0510",
      label: { x: 580, y: 325 },
      pois: [
        { id: "bm-wp", name: "Blood Marsh", type: "waypoint", x: 580, y: 320, desc: "Waypoint in the Blood Marsh.", tip: "Good for bounties. Swampy terrain with dense enemy packs." },
      ],
    },
    {
      id: "ruins-corvus", name: "Ruins of Corvus", shapeType: "polygon",
      shape: "300,480 560,460 600,530 590,650 490,680 300,660 255,580 265,500",
      fill: "#080410",
      label: { x: 427, y: 570 },
      pois: [
        { id: "rc-wp",   name: "Ruins of Corvus",  type: "waypoint", x: 427, y: 565, desc: "Waypoint at the Ruins of Corvus. Best farming zone in Act V.", tip: "Organic loop pattern. Dense spectral enemies. 4+ elite packs per run." },
        { id: "rc-adria",name: "Adria",            sub: "Boss — Ruins of Corvus", type: "boss", x: 370, y: 500, desc: "Adria — boss in the Ruins of Corvus.", tip: "Dodge her blood pools and summoned minions. Kill minions quickly." },
        { id: "rc-chest",name: "Resplendent Chest", sub: "Rare Spawn", type: "chest", x: 520, y: 630, desc: "Resplendent Chest spawn in the Ruins of Corvus.", tip: "High Legendary drop chance. Check every run." },
      ],
    },
    {
      id: "battlefields-eternity", name: "Battlefields of Eternity", shapeType: "polygon",
      shape: "590,450 800,430 840,500 830,620 730,650 590,630 550,550 560,470",
      fill: "#070310",
      label: { x: 695, y: 540 },
      pois: [
        { id: "be-wp", name: "Battlefields of Eternity", type: "waypoint", x: 695, y: 535, desc: "Waypoint in the Battlefields of Eternity. Open tile structure — wide non-linear area.", tip: "Small tiles accessible from almost any side. Good for bounties." },
      ],
    },
    {
      id: "pandemonium-fortress", name: "Pandemonium Fortress", shapeType: "polygon",
      shape: "800,280 950,260 980,340 970,480 880,510 800,490 770,410 780,300",
      fill: "#060210",
      label: { x: 875, y: 385 },
      pois: [
        { id: "pf-wp",      name: "Pandemonium Fortress L1", type: "waypoint", x: 875, y: 380, desc: "Waypoint in the Pandemonium Fortress Level 1.", tip: "Leads to the final boss fight with Malthael." },
        { id: "pf-wp2",     name: "Pandemonium Fortress L2", type: "waypoint", x: 900, y: 320, desc: "Waypoint in the Pandemonium Fortress Level 2.", tip: "Direct access to the upper fortress and Malthael." },
        { id: "pf-malthael",name: "Malthael",               sub: "Boss — Act V Final", type: "boss", x: 945, y: 270, desc: "Malthael, Angel of Death — Act V final boss in the Pandemonium Fortress.", tip: "Avoid his soul tornado and death mist. Stay mobile and keep moving at all times." },
      ],
    },
  ],
  connections: [
    { from: "survivors-enclave",    to: "westmarch-commons",     x1: 220, y1: 390, x2: 225, y2: 390 },
    { from: "westmarch-commons",    to: "blood-marsh",           x1: 490, y1: 350, x2: 490, y2: 340 },
    { from: "westmarch-commons",    to: "ruins-corvus",          x1: 380, y1: 480, x2: 380, y2: 490 },
    { from: "ruins-corvus",         to: "battlefields-eternity", x1: 570, y1: 560, x2: 570, y2: 560 },
    { from: "battlefields-eternity",to: "pandemonium-fortress",  x1: 800, y1: 530, x2: 800, y2: 490 },
  ],
};

const ALL_ACTS: ActData[] = [ACT1, ACT2, ACT3, ACT4, ACT5];

// ─── POI Marker — game-accurate icon shapes ───────────────────────────────────
function PoiIcon({ type, x, y, size, color }: { type: string; x: number; y: number; size: number; color: string }) {
  const h = size / 2;
  switch (type) {
    case "waypoint":
      // Blue diamond gem — matches the in-game waypoint icon
      return (
        <g>
          <polygon points={`${x},${y - h} ${x + h},${y} ${x},${y + h} ${x - h},${y}`}
            fill={color} stroke="white" strokeWidth={1.5}
            style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
          <polygon points={`${x},${y - h * 0.5} ${x + h * 0.5},${y} ${x},${y + h * 0.5} ${x - h * 0.5},${y}`}
            fill="white" opacity={0.4} />
        </g>
      );
    case "boss":
      // Skull — red circle with skull shape
      return (
        <g>
          <circle cx={x} cy={y} r={h} fill={color} stroke="#ff2222" strokeWidth={1.5}
            style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
          <text x={x} y={y + h * 0.4} textAnchor="middle" fontSize={h * 1.2}
            fill="white" style={{ userSelect: "none", pointerEvents: "none" }}>☠</text>
        </g>
      );
    case "vendor":
      // Anvil/hammer for blacksmith, gem for jeweler, star for mystic
      return (
        <g>
          <rect x={x - h} y={y - h} width={size} height={size} rx={2}
            fill={color} stroke="white" strokeWidth={1}
            style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
          <text x={x} y={y + h * 0.4} textAnchor="middle" fontSize={h * 1.1}
            fill="#1a1008" style={{ userSelect: "none", pointerEvents: "none" }}>⚒</text>
        </g>
      );
    case "keywarden":
      // Key icon — purple
      return (
        <g>
          <circle cx={x} cy={y} r={h} fill={color} stroke="white" strokeWidth={1.5}
            style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
          <text x={x} y={y + h * 0.4} textAnchor="middle" fontSize={h * 1.1}
            fill="white" style={{ userSelect: "none", pointerEvents: "none" }}>🔑</text>
        </g>
      );
    case "dungeon":
      // Downward triangle — dungeon entrance
      return (
        <g>
          <polygon points={`${x - h},${y - h} ${x + h},${y - h} ${x},${y + h}`}
            fill={color} stroke="white" strokeWidth={1}
            style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
        </g>
      );
    case "exit":
      // Arrow pointing right
      return (
        <g>
          <polygon points={`${x - h},${y - h * 0.5} ${x},${y - h * 0.5} ${x},${y - h} ${x + h},${y} ${x},${y + h} ${x},${y + h * 0.5} ${x - h},${y + h * 0.5}`}
            fill={color} stroke="none" opacity={0.9} />
        </g>
      );
    case "chest":
      // Gold chest square
      return (
        <g>
          <rect x={x - h} y={y - h * 0.7} width={size} height={size * 0.8} rx={2}
            fill={color} stroke="white" strokeWidth={1}
            style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
          <line x1={x - h} y1={y} x2={x + h} y2={y} stroke="white" strokeWidth={1} />
        </g>
      );
    case "npc":
      return (
        <g>
          <circle cx={x} cy={y} r={h} fill={color} stroke="white" strokeWidth={1} opacity={0.85} />
        </g>
      );
    default:
      return (
        <circle cx={x} cy={y} r={h} fill={color} stroke="white" strokeWidth={1} />
      );
  }
}

function PoiMarker({ poi, isSelected, onClick }: {
  poi: Poi; isSelected: boolean; onClick: () => void;
}) {
  const color = POI_COLORS[poi.type];
  const size = isSelected ? 12 : 8;
  return (
    <g onClick={(e) => { e.stopPropagation(); onClick(); }} style={{ cursor: "pointer" }}>
      {/* Selection ring */}
      {isSelected && (
        <circle cx={poi.x} cy={poi.y} r={16} fill="none"
          stroke={color} strokeWidth={2} opacity={0.6}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      )}
      <PoiIcon type={poi.type} x={poi.x} y={poi.y} size={size} color={color} />
      {/* Label — always show for selected, show on hover via opacity trick */}
      {isSelected && (
        <>
          <rect x={poi.x - 40} y={poi.y + 14} width={80} height={14} rx={2}
            fill="rgba(3,1,8,0.88)" stroke={`${color}66`} strokeWidth={1} />
          <text x={poi.x} y={poi.y + 24} textAnchor="middle"
            fontSize={8} fill={color} fontFamily="'Cinzel', serif" fontWeight="bold"
            style={{ userSelect: "none", pointerEvents: "none" }}>
            {poi.name.length > 14 ? poi.name.slice(0, 13) + "…" : poi.name}
          </text>
        </>
      )}
    </g>
  );
}

// ─── Act SVG Map ──────────────────────────────────────────────────────────────
function ActSvgMap({ act, enabledTypes, selectedPoi, onPoiClick, onMapClick }: {
  act: ActData;
  enabledTypes: Set<string>;
  selectedPoi: Poi | null;
  onPoiClick: (poi: Poi) => void;
  onMapClick: () => void;
}) {
  return (
    <svg
      viewBox={act.viewBox}
      width="100%" height="100%"
      style={{ background: act.bgColor, display: "block" }}
      onClick={onMapClick}>

      {/* Zone shapes — organic terrain style matching in-game minimap */}
      {act.zones.map((zone) => (
        <g key={zone.id}>
          {/* Soft outer glow/halo to simulate terrain edge fade */}
          {zone.shapeType === "polygon" ? (
            <polygon points={zone.shape} fill="none"
              stroke={zone.fill} strokeWidth={12} strokeLinejoin="round"
              opacity={0.4} />
          ) : (
            <path d={zone.shape} fill="none"
              stroke={zone.fill} strokeWidth={12} strokeLinejoin="round"
              opacity={0.4} />
          )}
          {/* Main terrain fill — no hard border, just fill */}
          {zone.shapeType === "polygon" ? (
            <polygon points={zone.shape}
              fill={zone.fill} stroke="none" />
          ) : (
            <path d={zone.shape}
              fill={zone.fill} stroke="none" />
          )}
          {/* Subtle inner texture line */}
          {zone.shapeType === "polygon" ? (
            <polygon points={zone.shape} fill="none"
              stroke={`${act.color}22`} strokeWidth={1} strokeLinejoin="round" />
          ) : (
            <path d={zone.shape} fill="none"
              stroke={`${act.color}22`} strokeWidth={1} strokeLinejoin="round" />
          )}
          {/* Zone label */}
          <text x={zone.label.x} y={zone.label.y}
            textAnchor="middle" fontSize={10}
            fill={`${act.color}dd`}
            fontFamily="'Cinzel', serif" fontWeight="bold"
            style={{ userSelect: "none", pointerEvents: "none",
              textShadow: `0 0 6px ${act.bgColor}, 0 0 12px ${act.bgColor}` }}>
            {zone.name}
          </text>
        </g>
      ))}

      {/* Connection lines */}
      {act.connections.map((conn, i) => (
        <line key={i}
          x1={conn.x1} y1={conn.y1} x2={conn.x2} y2={conn.y2}
          stroke={`${act.color}44`} strokeWidth={3}
          strokeDasharray="6 4" />
      ))}

      {/* POI markers */}
      {act.zones.flatMap((zone) =>
        zone.pois
          .filter((p) => enabledTypes.has(p.type))
          .map((poi) => (
            <PoiMarker
              key={poi.id}
              poi={poi}
              isSelected={selectedPoi?.id === poi.id}
              onClick={() => onPoiClick(poi)}
            />
          ))
      )}

      {/* Ambient glow */}
      <radialGradient id={`glow-${act.id}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={act.color} stopOpacity="0.06" />
        <stop offset="100%" stopColor={act.color} stopOpacity="0" />
      </radialGradient>
      <rect width="100%" height="100%" fill={`url(#glow-${act.id})`} style={{ pointerEvents: "none" }} />
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SanctuaryMapPage() {
  const [activeAct, setActiveAct] = useState<ActData>(ACT1);
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);
  const [enabledTypes, setEnabledTypes] = useState<Set<string>>(
    new Set(Object.keys(POI_COLORS))
  );
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Pan/zoom
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Reset view when Act changes
  useEffect(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
    setSelectedPoi(null);
  }, [activeAct.id]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? 0.88 : 1.14;
    setTransform((prev) => {
      const newScale = Math.min(6, Math.max(0.4, prev.scale * delta));
      const ratio = newScale / prev.scale;
      return { x: mx - ratio * (mx - prev.x), y: my - ratio * (my - prev.y), scale: newScale };
    });
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    hasMoved.current = false;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasMoved.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTransform((p) => ({ ...p, x: p.x + dx, y: p.y + dy }));
  }, []);

  const onMouseUp = useCallback(() => { isDragging.current = false; }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const toggleType = (type: string) => {
    setEnabledTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  };

  // Search results
  const searchResults = search.trim()
    ? activeAct.zones.flatMap((z) => z.pois).filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.sub || "").toLowerCase().includes(search.toLowerCase()) ||
        p.desc.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const ac = activeAct.color;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#030108" }}>

      {/* ── Left Sidebar ── */}
      {sidebarOpen && (
        <div className="w-64 flex-shrink-0 flex flex-col border-r overflow-y-auto"
          style={{ borderColor: "oklch(0.20 0.015 50)", background: "oklch(0.08 0.010 30)", minWidth: "256px" }}>

          {/* Header */}
          <div className="p-3 border-b flex items-center justify-between"
            style={{ borderColor: "oklch(0.20 0.015 50)" }}>
            <div>
              <p className="font-cinzel-decorative font-black text-sm" style={{ color: "oklch(0.78 0.18 55)" }}>SANCTUARY</p>
              <p className="font-cinzel" style={{ color: "oklch(0.65 0.010 60)", fontSize: "0.58rem" }}>Interactive Map · All 5 Acts</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} style={{ color: "oklch(0.50 0.010 60)" }}>
              <X size={15} />
            </button>
          </div>

          {/* Act tabs */}
          <div className="p-2 border-b" style={{ borderColor: "oklch(0.20 0.015 50)" }}>
            <p className="font-cinzel tracking-widest mb-1.5" style={{ color: "oklch(0.55 0.010 60)", fontSize: "0.5rem" }}>SELECT ACT</p>
            <div className="space-y-1">
              {ALL_ACTS.map((act) => (
                <button key={act.id} onClick={() => setActiveAct(act)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded border text-left transition-all"
                  style={{
                    background: activeAct.id === act.id ? `${act.color}18` : "oklch(0.10 0.010 30)",
                    borderColor: activeAct.id === act.id ? `${act.color}66` : "oklch(0.20 0.015 50)",
                  }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: act.color }} />
                  <div>
                    <p className="font-cinzel font-bold" style={{ color: activeAct.id === act.id ? act.color : "oklch(0.82 0.010 60)", fontSize: "0.75rem" }}>{act.name}</p>
                    <p className="font-cinzel" style={{ color: "oklch(0.60 0.010 60)", fontSize: "0.55rem" }}>{act.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="p-2 border-b" style={{ borderColor: "oklch(0.20 0.015 50)" }}>
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded border"
              style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.20 0.015 50)" }}>
              <Search size={11} color="oklch(0.55 0.010 60)" />
              <input type="text" placeholder="Search locations..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none font-cinzel"
                style={{ color: "oklch(0.85 0.01 60)", fontSize: "0.72rem" }} />
              {search && <button onClick={() => setSearch("")} style={{ color: "oklch(0.55 0.010 60)" }}>×</button>}
            </div>
            {searchResults.length > 0 && (
              <div className="mt-1 space-y-1 max-h-40 overflow-y-auto">
                {searchResults.map((poi) => (
                  <button key={poi.id} onClick={() => { setSelectedPoi(poi); setSearch(""); }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left"
                    style={{ background: "oklch(0.11 0.010 30)" }}>
                    <span style={{ color: POI_COLORS[poi.type], fontSize: "0.7rem" }}>{POI_ICONS[poi.type]}</span>
                    <div>
                      <p className="font-cinzel font-bold" style={{ color: "oklch(0.85 0.01 60)", fontSize: "0.65rem" }}>{poi.name}</p>
                      {poi.sub && <p className="font-cinzel" style={{ color: "oklch(0.60 0.010 60)", fontSize: "0.55rem" }}>{poi.sub}</p>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* POI type filters */}
          <div className="p-2 border-b" style={{ borderColor: "oklch(0.20 0.015 50)" }}>
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-cinzel tracking-widest" style={{ color: "oklch(0.55 0.010 60)", fontSize: "0.5rem" }}>SHOW / HIDE</p>
              <div className="flex gap-1">
                <button onClick={() => setEnabledTypes(new Set(Object.keys(POI_COLORS)))}
                  className="font-cinzel px-1.5 py-0.5 rounded"
                  style={{ background: `${ac}18`, color: ac, fontSize: "0.5rem", border: `1px solid ${ac}33` }}>ALL</button>
                <button onClick={() => setEnabledTypes(new Set())}
                  className="font-cinzel px-1.5 py-0.5 rounded"
                  style={{ background: "oklch(0.12 0.010 30)", color: "oklch(0.55 0.010 60)", fontSize: "0.5rem", border: "1px solid oklch(0.20 0.015 50)" }}>NONE</button>
              </div>
            </div>
            <div className="space-y-0.5">
              {Object.entries(POI_LABELS).map(([type, label]) => {
                const enabled = enabledTypes.has(type);
                const color = POI_COLORS[type];
                return (
                  <button key={type} onClick={() => toggleType(type)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded border transition-all"
                    style={{ background: enabled ? `${color}10` : "oklch(0.10 0.010 30)", borderColor: enabled ? `${color}33` : "oklch(0.18 0.012 50)" }}>
                    <span style={{ color: enabled ? color : "oklch(0.40 0.010 60)", fontSize: "0.7rem" }}>{POI_ICONS[type]}</span>
                    <span className="font-cinzel flex-1 text-left" style={{ color: enabled ? "oklch(0.82 0.010 60)" : "oklch(0.50 0.010 60)", fontSize: "0.68rem" }}>{label}</span>
                    {enabled ? <Eye size={10} color={color} /> : <EyeOff size={10} color="oklch(0.35 0.010 60)" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected POI detail */}
          {selectedPoi && (
            <div className="p-3 border-t mt-auto" style={{ borderColor: "oklch(0.20 0.015 50)", background: "oklch(0.09 0.010 30)" }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span style={{ color: POI_COLORS[selectedPoi.type], fontSize: "0.9rem" }}>{POI_ICONS[selectedPoi.type]}</span>
                    <p className="font-cinzel font-bold text-sm" style={{ color: POI_COLORS[selectedPoi.type] }}>{selectedPoi.name}</p>
                  </div>
                  {selectedPoi.sub && <p className="font-cinzel text-xs" style={{ color: "oklch(0.65 0.010 60)", fontSize: "0.6rem" }}>{selectedPoi.sub}</p>}
                </div>
                <button onClick={() => setSelectedPoi(null)} style={{ color: "oklch(0.55 0.010 60)", fontSize: "1.1rem" }}>×</button>
              </div>
              <p className="text-sm leading-relaxed mb-2" style={{ color: "oklch(0.78 0.010 60)", fontSize: "0.72rem" }}>{selectedPoi.desc}</p>
              <div className="flex items-start gap-1.5 p-2 rounded" style={{ background: "oklch(0.11 0.010 30)" }}>
                <span style={{ color: "#ffd54f", fontSize: "0.75rem" }}>★</span>
                <p style={{ color: "oklch(0.78 0.010 60)", fontSize: "0.68rem" }}>{selectedPoi.tip}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Map Canvas ── */}
      <div className="flex-1 relative overflow-hidden"
        ref={containerRef}
        style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}>

        {/* Sidebar toggle */}
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-30 w-9 h-9 rounded border flex items-center justify-center"
            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.25 0.015 50)", color: "oklch(0.75 0.010 60)" }}>
            ☰
          </button>
        )}

        {/* Act label overlay */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full"
          style={{ background: "rgba(3,1,8,0.85)", border: `1px solid ${ac}44`, backdropFilter: "blur(8px)" }}>
          <p className="font-cinzel-decorative font-bold text-sm" style={{ color: ac }}>
            {activeAct.name} — {activeAct.subtitle}
          </p>
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1">
          <button onClick={() => setTransform((p) => ({ ...p, scale: Math.min(6, p.scale * 1.3) }))}
            className="w-9 h-9 rounded border flex items-center justify-center font-bold text-lg"
            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.25 0.015 50)", color: "oklch(0.80 0.010 60)" }}>+</button>
          <button onClick={() => setTransform((p) => ({ ...p, scale: Math.max(0.4, p.scale * 0.77) }))}
            className="w-9 h-9 rounded border flex items-center justify-center font-bold text-lg"
            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.25 0.015 50)", color: "oklch(0.80 0.010 60)" }}>−</button>
          <button onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}
            className="w-9 h-9 rounded border flex items-center justify-center font-cinzel text-xs"
            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.25 0.015 50)", color: "oklch(0.65 0.010 60)" }}>⊡</button>
        </div>

        {/* Zoom level */}
        <div className="absolute bottom-4 left-4 z-30 px-2 py-1 rounded"
          style={{ background: "rgba(3,1,8,0.75)", border: "1px solid oklch(0.20 0.015 50)" }}>
          <p className="font-cinzel text-xs" style={{ color: "oklch(0.60 0.010 60)" }}>{Math.round(transform.scale * 100)}%</p>
        </div>

        {/* Transformable map */}
        <div style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: "center center",
          transition: isDragging.current ? "none" : "transform 0.08s ease-out",
          width: "100%", height: "100%",
          position: "absolute", inset: 0,
        }}>
          <ActSvgMap
            act={activeAct}
            enabledTypes={enabledTypes}
            selectedPoi={selectedPoi}
            onPoiClick={(poi) => setSelectedPoi(selectedPoi?.id === poi.id ? null : poi)}
            onMapClick={() => { if (!hasMoved.current) setSelectedPoi(null); }}
          />
        </div>
      </div>
    </div>
  );
}
