// Sanctuary Grimoire — Definitive Interactive Map (v2)
// MapGenie-style: illustrated base maps, categorized POI markers,
// nested dungeon overlay on click, full-screen canvas, loads instantly.
// Cartographic fundamentals: visual hierarchy, consistent iconography,
// readable labels, clear legend, logical zone grouping.

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search, Eye, EyeOff, X, ChevronLeft, Layers,
  Map, Navigation, Sword, Key, Package, Star, Zap
} from "lucide-react";
import NewTristramMap from "@/components/NewTristramMap";

// ─── Base map CDN URLs ────────────────────────────────────────────────────────
const BASE_MAPS: Record<string, string> = {
  act1: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/basemap-act1-8itSuDu65svxAzLJ9w6sKi.webp",
  act2: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/basemap-act2-A5bL46Qn8QES9TctCsukTZ.webp",
  act3: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/basemap-act3-APYLmZGko6CnVn6qdiAxfA.webp",
  act4: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/basemap-act4-C2Ud7g3HkhMuS6BBQRZ6zt.webp",
  act5: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/basemap-act5-8UJKwwTeFNgNv5Yzx6PAsP.webp",
};

// Town hub maps — dedicated close-up maps for each Act's hub town
const TOWN_BASE_MAPS: Record<string, string> = {
  act1: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/townmap-new-tristram-TK6xNVFAzcKFUNpH3GUmow.webp",
  act2: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/townmap-hidden-camp-TJDfX9fZeFvpART3LqRKfp.webp",
  act3: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/townmap-bastions-keep-Zdh6jBe5Qbty4SMj9QSica.webp",
  act4: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/townmap-diamond-gates-ixcosrwskqWVgy9otLeEJM.webp",
  act5: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/townmap-survivors-enclave-5f3M5QeZBokqxx6Jz4fxNg.webp",
};

// Town POIs — precisely positioned to match the actual in-game town layout
// Based on the DiabloWiki reference map layout:
// New Tristram: Cellar top-center, Jeweler upper-left, Inn center,
// Blacksmith center-right, Waypoint center-right, Cain's House center,
// Healer right of Inn, roads exit top-right (Old Tristram Road) and bottom (Overlook Road)
const TOWN_POIS: Record<string, MapPoi[]> = {
  act1: [
    // Based on reference: compact town cluster, everything within tight radius
    // Top-center: Cellar of the Damned + Mystic
    { id: "nt-cellar",   name: "Cellar of the Damned", sub: "Dungeon Entrance",     type: "dungeon",  x: 52, y: 18, desc: "The cellar beneath the Slaughtered Calf Inn. Undead enemies, guaranteed elite pack.", tip: "Quick early dungeon. Occasionally spawns a Resplendent Chest." },
    { id: "nt-myr",      name: "Myriam Jahzia",        sub: "Mystic",              type: "artisan",  x: 57, y: 22, desc: "The Mystic (Adventure Mode). Enchant items to reroll secondary stats and transmogrify appearances.", tip: "Use enchanting to fix your weakest secondary stat on key gear pieces." },
    // Upper-left: Jeweler, Radek, followers
    { id: "nt-shen",     name: "Covetous Shen",        sub: "Jeweler",             type: "artisan",  x: 30, y: 30, desc: "The Jeweler. Socket gems, combine gem tiers, and craft jewelry.", tip: "Combine gems in sets of 3. Flawless Royal is the endgame standard." },
    { id: "nt-radek",    name: "Radek the Fence",      sub: "Merchant",            type: "npc",      x: 36, y: 28, desc: "Radek the Fence — merchant selling potions and miscellaneous items.", tip: "Buy potions here before heading out. He also sells some rare items." },
    { id: "nt-templar",  name: "Kormac",               sub: "Templar Follower",    type: "follower", x: 28, y: 38, desc: "The Templar follower. Tank-oriented, provides healing and crowd control.", tip: "Best for solo players who need survivability. Equip with a shield and healing items." },
    { id: "nt-scoundrel",name: "Lyndon",               sub: "Scoundrel Follower",  type: "follower", x: 33, y: 42, desc: "The Scoundrel follower. Ranged damage dealer with crowd control.", tip: "Best for speed farming. Equip with a crossbow and crit items." },
    // Center: Inn, Tashun, Malachi
    { id: "nt-inn",      name: "Slaughtered Calf Inn", sub: "Stash inside",        type: "npc",      x: 47, y: 40, desc: "The inn where Leah is staying. Your stash is inside. Talk to Leah to advance the main quest.", tip: "The stash is inside the inn. Deposit crafting materials and gems before long runs." },
    { id: "nt-tashun",   name: "Tashun the Miner",    sub: "Merchant",            type: "npc",      x: 52, y: 36, desc: "Tashun the Miner — merchant selling mining supplies and miscellaneous items.", tip: "Check his stock for useful early-game items." },
    { id: "nt-malachi",  name: "Brother Malachi",      sub: "Healer",              type: "npc",      x: 60, y: 40, desc: "Brother Malachi the Healer. Restores your health and removes debuffs.", tip: "Visit before long dungeon runs to top off your health." },
    // Center: Cain's House, Waypoint, Blacksmith
    { id: "nt-cain",     name: "Cain's House",         sub: "Deckard Cain",        type: "npc",      x: 48, y: 50, desc: "Deckard Cain's house in New Tristram. He identifies items and provides quest guidance.", tip: "Cain identifies items for free. Always visit before selling or salvaging unidentified gear." },
    { id: "nt-wp",       name: "Waypoint",             sub: "New Tristram",        type: "waypoint", x: 58, y: 50, desc: "The New Tristram waypoint. First waypoint to activate in Act I.", tip: "Always activate before exploring. Lets you teleport back instantly from anywhere." },
    { id: "nt-haed",     name: "Haedrig Eamon",        sub: "Blacksmith",          type: "artisan",  x: 62, y: 48, desc: "Haedrig's forge on the east side of town. Craft, salvage, and upgrade gear.", tip: "Salvage all non-Legendary items you don't need for crafting materials." },
    // Right: Dungeons that always spawn
    { id: "nt-dungeons", name: "Dungeons Spawn Here",  sub: "Always present",      type: "dungeon",  x: 74, y: 48, desc: "Two dungeons always spawn in this area near New Tristram: Warrior's Rest and Forsaken Grounds.", tip: "Always enter these dungeons — each has a guaranteed elite pack and potential Resplendent Chest." },
    // Roads
    { id: "nt-road-old", name: "Old Tristram Road",    sub: "Exit → Cathedral",   type: "exit",     x: 78, y: 28, desc: "Old Tristram Road leading northeast to the Cathedral Garden and beyond.", tip: "The Cathedral Garden waypoint is just up this road. Activate it before entering the Cathedral." },
    { id: "nt-road-over",name: "Overlook Road",        sub: "Exit → Fields",      type: "exit",     x: 52, y: 78, desc: "Overlook Road leading south toward the Fields of Misery and Wortham.", tip: "The Fields of Misery waypoint is down this road — the best Act I farming zone." },
  ],
  act2: [
    { id: "hc-wp",     name: "Hidden Camp Waypoint", sub: "Town Waypoint",  type: "waypoint", x: 50, y: 52, desc: "Act II hub waypoint. All artisans available.", tip: "Always activate first. All artisans are within a short walk." },
    { id: "hc-haed",   name: "Haedrig Eamon",        sub: "Blacksmith",     type: "artisan",  x: 22, y: 28, desc: "Blacksmith tent in the Hidden Camp.", tip: "Salvage items before heading into the Dahlgur Oasis runs." },
    { id: "hc-shen",   name: "Covetous Shen",        sub: "Jeweler",        type: "artisan",  x: 72, y: 25, desc: "Jeweler tent in the Hidden Camp.", tip: "Combine gems between Oasis runs." },
    { id: "hc-myr",    name: "Myriam Jahzia",        sub: "Mystic",         type: "artisan",  x: 78, y: 55, desc: "Mystic tent in the Hidden Camp.", tip: "Enchant your weakest stat slot after each major gear upgrade." },
    { id: "hc-eirena", name: "Eirena",               sub: "Enchantress",    type: "follower", x: 55, y: 48, desc: "The Enchantress follower. Provides crowd control and damage buffs.", tip: "Best for group play. Her Powered Armor amplifies team damage." },
    { id: "hc-exit",   name: "Road to Alcarnus",     sub: "Exit → Act II",  type: "exit",     x: 50, y: 10, desc: "Main exit from the Hidden Camp to all Act II zones.", tip: "The Khasim Outpost waypoint is just down this road." },
  ],
  act3: [
    { id: "bk-wp",    name: "Bastion's Keep WP",   sub: "Town Waypoint",  type: "waypoint", x: 50, y: 50, desc: "Act III hub waypoint. All artisans available.", tip: "Always activate first. Keep Depths entrance is just south." },
    { id: "bk-haed",  name: "Haedrig Eamon",       sub: "Blacksmith",     type: "artisan",  x: 18, y: 72, desc: "Blacksmith forge in Bastion's Keep.", tip: "Salvage items before heading into the Keep Depths." },
    { id: "bk-shen",  name: "Covetous Shen",       sub: "Jeweler",        type: "artisan",  x: 78, y: 72, desc: "Jeweler workshop in Bastion's Keep.", tip: "Combine gems between Keep Depths runs." },
    { id: "bk-myr",   name: "Myriam Jahzia",       sub: "Mystic",         type: "artisan",  x: 82, y: 50, desc: "Mystic chamber in Bastion's Keep.", tip: "Enchant your weakest stat after each gear upgrade." },
    { id: "bk-gate",  name: "Gate to Stonefort",   sub: "Exit → Act III", type: "exit",     x: 50, y: 10, desc: "Gate leading from Bastion's Keep to the Stonefort battlements.", tip: "Exit to all Act III outdoor zones." },
    { id: "bk-depths",name: "Keep Depths Entrance",sub: "Best Farm Zone",  type: "dungeon",  x: 50, y: 88, desc: "Stairs descending into the Keep Depths — best farming zone in Act III.", tip: "Run both levels every game. 4+ elite packs per level.", dungeonKey: "keep_depths" },
  ],
  act4: [
    { id: "dg-wp",   name: "Diamond Gates WP",    sub: "Town Waypoint",  type: "waypoint", x: 50, y: 50, desc: "Act IV hub waypoint. All artisans available.", tip: "Always activate first. All artisans are in the side chambers." },
    { id: "dg-haed", name: "Haedrig Eamon",        sub: "Blacksmith",     type: "artisan",  x: 18, y: 38, desc: "Divine forge chamber in the High Heavens.", tip: "Salvage items before heading into the Silver Spire." },
    { id: "dg-shen", name: "Covetous Shen",        sub: "Jeweler",        type: "artisan",  x: 78, y: 38, desc: "Celestial gem workshop in the High Heavens.", tip: "Combine gems between Silver Spire runs." },
    { id: "dg-myr",  name: "Myriam Jahzia",        sub: "Mystic",         type: "artisan",  x: 50, y: 78, desc: "Mystic chamber in the High Heavens.", tip: "Enchant your weakest stat after each upgrade." },
    { id: "dg-spire",name: "Silver Spire",         sub: "Exit → Best Farm",type: "exit",    x: 82, y: 68, desc: "Path to the Silver Spire — 4+ elite packs on Level 2.", tip: "Always run both levels. Silver Spire Level 2 leads directly to Diablo." },
  ],
  act5: [
    { id: "se-wp",   name: "Enclave Waypoint",     sub: "Town Waypoint",  type: "waypoint", x: 50, y: 50, desc: "Act V hub waypoint. All artisans available.", tip: "Always activate first. Ruins of Corvus is the best farming zone." },
    { id: "se-haed", name: "Haedrig Eamon",        sub: "Blacksmith",     type: "artisan",  x: 18, y: 32, desc: "Improvised forge in the Survivors' Enclave.", tip: "Salvage items before heading into the Ruins of Corvus." },
    { id: "se-shen", name: "Covetous Shen",        sub: "Jeweler",        type: "artisan",  x: 78, y: 28, desc: "Gem shelter in the Survivors' Enclave.", tip: "Combine gems between Corvus runs." },
    { id: "se-myr",  name: "Myriam Jahzia",        sub: "Mystic",         type: "artisan",  x: 82, y: 58, desc: "Mystic shelter in the Survivors' Enclave.", tip: "Enchant your weakest stat after each upgrade." },
    { id: "se-gate", name: "Gate to Westmarch",    sub: "Exit → Act V",   type: "exit",     x: 50, y: 10, desc: "Main gate leading to all Act V zones.", tip: "Westmarch Commons waypoint is just outside." },
    { id: "se-dock", name: "Greyhollow Island Dock",sub: "Optional Zone",  type: "exit",     x: 82, y: 78, desc: "Dock leading to Greyhollow Island — optional zone with unique enemies.", tip: "Good for bounties. Unique spectral enemies and loot." },
  ],
};

// Dungeon overlay maps (the generated dungeon tunnel images)
const DUNGEON_MAPS: Record<string, { url: string; name: string; act: string; desc: string; tip: string }> = {
  cathedral: {
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/dungeon-cathedral-RqXs85rYYKSwNJQLJBjucN.webp",
    name: "Cathedral", act: "Act I", desc: "4-level gothic dungeon beneath Tristram. Square loop pattern with branching dead-end corridors.", tip: "Run all 4 levels. Skeleton King boss on Level 4. Dense undead throughout."
  },
  halls_agony: {
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/dungeon-halls-agony-bhBwpJyvHL8bBRKxWsyw6n.webp",
    name: "Halls of Agony", act: "Act I", desc: "3-level torture dungeon. Rectangular loop with long entrance corridor. The Butcher awaits.", tip: "One of the best Act I farms. 4+ elite packs. The Butcher drops guaranteed Legendary on first kill."
  },
  keep_depths: {
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/dungeon-keep-depths-2ej985cV9rgqAMz4WTyFD8.webp",
    name: "Keep Depths", act: "Act III", desc: "2-level military fortress dungeon. Cross-spine layout with barracks rooms. Best Act III farm.", tip: "Run both levels every game. 4+ elite packs per level. Ghom boss on Level 3."
  },
  archives: {
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/dungeon-archives-C3umkAtQosG2vUJi7p7kyD.webp",
    name: "Archives of Zoltun Kulle", act: "Act II", desc: "Ancient library dungeon. Central octagonal vault with library wings and arcane portals.", tip: "Dense elite packs. Zoltun Kulle boss at the end. Destroy his blood orbs to interrupt healing."
  },
  silver_spire: {
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/dungeon-silver-spire-AFUn2ypVdpN5zHYeTFYFwN.webp",
    name: "Silver Spire", act: "Act IV", desc: "2-level celestial tower. Figure-eight double loop pattern. Best Act IV farm.", tip: "Always run both levels. Level 2 leads directly to Diablo. Nekarat Keywarden is here."
  },
  ruins_corvus: {
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/dungeon-ruins-corvus-BRLMqerYv58Y9Yrn77UgFq.webp",
    name: "Ruins of Corvus", act: "Act V", desc: "Ruined gothic city dungeon. Organic winding loop. Best Act V farm.", tip: "Dense spectral enemies. 4+ elite packs. Adria boss. Check for Resplendent Chest."
  },
};

// ─── POI data ─────────────────────────────────────────────────────────────────
type PoiType = "waypoint" | "boss" | "keywarden" | "artisan" | "dungeon" | "exit" | "chest" | "event" | "follower" | "npc";

interface MapPoi {
  id: string;
  name: string;
  sub?: string;
  type: PoiType;
  // Position as percentage of map image (0-100)
  x: number;
  y: number;
  desc: string;
  tip: string;
  dungeonKey?: string; // if type=dungeon, which dungeon overlay to show
}

interface ActMapData {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  pois: MapPoi[];
}

// ─── POI visual config ────────────────────────────────────────────────────────
const POI_CONFIG: Record<PoiType, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
  waypoint:  { color: "#4dd0e1", bg: "#006064", label: "Waypoints",  icon: <Navigation size={12} /> },
  boss:      { color: "#ff7043", bg: "#bf360c", label: "Bosses",     icon: <Sword size={12} /> },
  keywarden: { color: "#ce93d8", bg: "#6a1b9a", label: "Keywardens", icon: <Key size={12} /> },
  artisan:   { color: "#ffd54f", bg: "#e65100", label: "Artisans",   icon: <Zap size={12} /> },
  dungeon:   { color: "#90caf9", bg: "#0d47a1", label: "Dungeons",   icon: <Map size={12} /> },
  exit:      { color: "#a5d6a7", bg: "#1b5e20", label: "Exits",      icon: <ChevronLeft size={12} /> },
  chest:     { color: "#c89b3c", bg: "#4e342e", label: "Chests",     icon: <Package size={12} /> },
  event:     { color: "#80cbc4", bg: "#004d40", label: "Events",     icon: <Star size={12} /> },
  follower:  { color: "#b0bec5", bg: "#37474f", label: "Followers",  icon: <Navigation size={12} /> },
  npc:       { color: "#a5d6a7", bg: "#1b5e20", label: "NPCs",        icon: <Star size={12} /> },
};

// ─── Act POI data ─────────────────────────────────────────────────────────────
// Positions are calibrated to the generated base map images
const ACT_DATA: ActMapData[] = [
  {
    id: "act1", name: "Act I", subtitle: "Khanduras", color: "#8b0000",
    pois: [
      // New Tristram — walled town, left-center of map
      { id: "nt-wp",      name: "New Tristram",       sub: "Town Waypoint",        type: "waypoint",  x: 22, y: 52, desc: "Act I hub waypoint in the central square of New Tristram.", tip: "First waypoint to activate. All artisans are here." },
      { id: "nt-haed",    name: "Haedrig Eamon",      sub: "Blacksmith",           type: "artisan",   x: 25, y: 48, desc: "Blacksmith on the east side of New Tristram. Craft, salvage, and upgrade gear.", tip: "Salvage all non-Legendary items for crafting materials." },
      { id: "nt-shen",    name: "Covetous Shen",      sub: "Jeweler",              type: "artisan",   x: 20, y: 55, desc: "Jeweler near the inn. Socket gems, combine tiers, craft jewelry.", tip: "Combine gems in sets of 3. Flawless Royal is the endgame standard." },
      { id: "nt-myr",     name: "Myriam Jahzia",      sub: "Mystic",               type: "artisan",   x: 23, y: 58, desc: "Mystic near the inn (Adventure Mode). Enchant and transmogrify items.", tip: "Use enchanting to fix your weakest secondary stat on key gear pieces." },
      { id: "nt-gate",    name: "South Gate",         sub: "Exit to Old Tristram Road", type: "exit", x: 22, y: 65, desc: "Main gate at the south end of New Tristram.", tip: "Always activate the waypoint just outside before exploring." },
      { id: "nt-cellar",  name: "Inn Cellar",         sub: "Dungeon Entrance",     type: "dungeon",   x: 18, y: 60, desc: "Cellar beneath the Slaughtered Calf Inn. Undead enemies, guaranteed elite pack.", tip: "Quick early dungeon. Occasionally spawns a Resplendent Chest." },
      // Cathedral — center-top
      { id: "cg-wp",      name: "Cathedral Garden",   sub: "Waypoint",             type: "waypoint",  x: 42, y: 38, desc: "Waypoint at the Cathedral entrance.", tip: "Quick access to Cathedral Level 1." },
      { id: "cat-wp",     name: "Cathedral Level 1",  sub: "Waypoint",             type: "waypoint",  x: 46, y: 30, desc: "Waypoint on Cathedral Level 1.", tip: "Activate before descending." },
      { id: "cat-wp3",    name: "Cathedral Level 3",  sub: "Waypoint",             type: "waypoint",  x: 48, y: 24, desc: "Waypoint on Cathedral Level 3.", tip: "Direct access to Level 3 and 4." },
      { id: "cat-dungeon",name: "Cathedral",          sub: "4-Level Dungeon",      type: "dungeon",   x: 44, y: 28, desc: "4-level gothic dungeon. Square loop pattern with branching corridors.", tip: "Run all 4 levels. Skeleton King boss on Level 4.", dungeonKey: "cathedral" },
      { id: "cat-sk",     name: "Skeleton King",      sub: "Boss — Royal Crypts",  type: "boss",      x: 47, y: 18, desc: "The Skeleton King — Act I mid-boss in the Royal Crypts on Cathedral Level 4.", tip: "Kill his summoned skeleton minions first, then focus him. Guaranteed Legendary on first kill." },
      // Halls of Agony — right side
      { id: "lp-wp",      name: "Leoric's Passage",   sub: "Waypoint",             type: "waypoint",  x: 62, y: 44, desc: "Waypoint in Leoric's Passage leading to the Halls of Agony.", tip: "Shortcut to the Halls of Agony entrance." },
      { id: "hoa-wp",     name: "Halls of Agony L2",  sub: "Waypoint",             type: "waypoint",  x: 74, y: 48, desc: "Waypoint on Halls of Agony Level 2. Best waypoint for farming The Butcher.", tip: "Activate this waypoint — it puts you 2 rooms from The Butcher." },
      { id: "hoa-dungeon",name: "Halls of Agony",     sub: "3-Level Dungeon",      type: "dungeon",   x: 76, y: 42, desc: "3-level torture dungeon. Rectangular loop with long entrance corridor.", tip: "One of the best Act I farms. 4+ elite packs.", dungeonKey: "halls_agony" },
      { id: "hoa-butcher",name: "The Butcher",        sub: "Boss — Halls of Agony", type: "boss",     x: 82, y: 36, desc: "The Butcher — Act I final boss.", tip: "Stay mobile. Dodge his charge attack and fire chain traps. Guaranteed Legendary on first kill." },
      // Fields of Misery — bottom
      { id: "fm-wp",      name: "Fields of Misery",   sub: "Waypoint",             type: "waypoint",  x: 38, y: 72, desc: "Waypoint in the Fields of Misery. Top Act I farming zone.", tip: "Best outdoor zone in Act I for elite packs and Resplendent Chests." },
      { id: "fm-odeg",    name: "Odeg the Keywarden", sub: "Key of Destruction",   type: "keywarden", x: 45, y: 78, desc: "Act I Keywarden. Drops the Key of Destruction for the Infernal Machine.", tip: "Must be on Torment I+. Spawns somewhere in the Fields of Misery." },
      { id: "fm-chest",   name: "Resplendent Chest",  sub: "Rare Spawn",           type: "chest",     x: 32, y: 80, desc: "Rare Resplendent Chest spawn in the Fields of Misery.", tip: "High Legendary drop chance. Check every run." },
      // Festering Woods — top-left
      { id: "fw-wp",      name: "Festering Woods",    sub: "Waypoint",             type: "waypoint",  x: 32, y: 20, desc: "Waypoint in the Festering Woods.", tip: "Two dungeons always spawn here — Warrior's Rest and Forsaken Grounds." },
      // Northern Highlands — top-right
      { id: "nh-wp",      name: "Northern Highlands", sub: "Waypoint",             type: "waypoint",  x: 62, y: 18, desc: "Waypoint in the Northern Highlands.", tip: "Good for bounties. Leoric's Manor is just north." },
      // Followers
      { id: "nt-templar", name: "Kormac",             sub: "Templar Follower",     type: "follower",  x: 19, y: 52, desc: "The Templar follower. Tank-oriented, provides healing and crowd control.", tip: "Best for solo players who need survivability. Equip with a shield and healing items." },
      { id: "nt-scoundrel",name: "Lyndon",            sub: "Scoundrel Follower",   type: "follower",  x: 21, y: 50, desc: "The Scoundrel follower. Ranged damage dealer with crowd control.", tip: "Best for speed farming. Equip with a crossbow and crit items." },
    ],
  },
  {
    id: "act2", name: "Act II", subtitle: "Caldeum", color: "#c8860a",
    pois: [
      { id: "hc-wp",     name: "Hidden Camp",          sub: "Town Waypoint",        type: "waypoint",  x: 18, y: 42, desc: "Act II hub waypoint. All artisans available.", tip: "Always activate first. All artisans are within a short walk." },
      { id: "hc-haed",   name: "Haedrig Eamon",        sub: "Blacksmith",           type: "artisan",   x: 14, y: 38, desc: "Blacksmith tent in the Hidden Camp.", tip: "Salvage items before heading into the Dahlgur Oasis runs." },
      { id: "hc-shen",   name: "Covetous Shen",        sub: "Jeweler",              type: "artisan",   x: 22, y: 38, desc: "Jeweler tent in the Hidden Camp.", tip: "Combine gems between Oasis runs." },
      { id: "hc-myr",    name: "Myriam Jahzia",        sub: "Mystic",               type: "artisan",   x: 22, y: 46, desc: "Mystic tent in the Hidden Camp.", tip: "Enchant your weakest stat slot after each major gear upgrade." },
      { id: "hc-eirena", name: "Eirena",               sub: "Enchantress Follower", type: "follower",  x: 18, y: 46, desc: "The Enchantress follower. Provides crowd control and damage buffs.", tip: "Best for group play. Her Powered Armor amplifies team damage." },
      { id: "alc-wp",    name: "City of Caldeum",      sub: "Waypoint",             type: "waypoint",  x: 50, y: 42, desc: "Waypoint inside Caldeum.", tip: "Central waypoint for Act II city zones." },
      { id: "alc-maghda",name: "Maghda",               sub: "Boss — Alcarnus",      type: "boss",      x: 42, y: 32, desc: "Maghda — mid-Act II boss in Alcarnus.", tip: "Kill her butterfly minions quickly to interrupt her healing. Stay mobile." },
      { id: "do-wp",     name: "Dahlgur Oasis",        sub: "Waypoint",             type: "waypoint",  x: 48, y: 68, desc: "Waypoint in the Dahlgur Oasis. Best outdoor farming zone in Act II.", tip: "Dense elite packs. Check all dungeon entrances." },
      { id: "do-sokahr", name: "Sokahr",               sub: "Keywarden — Key of Hate", type: "keywarden", x: 58, y: 74, desc: "Act II Keywarden. Drops the Key of Hate.", tip: "Must be on Torment I+. Spawns somewhere in the Dahlgur Oasis." },
      { id: "do-chest",  name: "Resplendent Chest",    sub: "Rare Spawn",           type: "chest",     x: 38, y: 76, desc: "Resplendent Chest spawn in the Dahlgur Oasis.", tip: "High Legendary drop chance. Check every run." },
      { id: "az-wp",     name: "Archives of Zoltun Kulle", sub: "Waypoint",         type: "waypoint",  x: 72, y: 48, desc: "Waypoint at the Archives entrance.", tip: "Dense elite packs inside. Boss at the end." },
      { id: "az-dungeon",name: "Archives of Zoltun Kulle", sub: "Dungeon",          type: "dungeon",   x: 74, y: 44, desc: "Ancient library dungeon. Central vault with library wings.", tip: "Dense elite packs. Zoltun Kulle boss at the end.", dungeonKey: "archives" },
      { id: "az-kulle",  name: "Zoltun Kulle",         sub: "Boss — Archives",      type: "boss",      x: 80, y: 36, desc: "Zoltun Kulle — mid-Act II boss in the Archives.", tip: "Destroy his blood orbs to interrupt his healing. Dodge his sand traps." },
      { id: "ip-belial", name: "Belial",               sub: "Boss — Act II Final",  type: "boss",      x: 88, y: 62, desc: "Belial, Lord of Lies — Act II final boss in the Imperial Palace.", tip: "Phase 2: dodge the green poison pools. Phase 3: dodge his slam attacks." },
      { id: "ip-wp",     name: "Imperial Palace",      sub: "Waypoint",             type: "waypoint",  x: 84, y: 56, desc: "Waypoint in the Imperial Palace.", tip: "Leads to the final boss fight." },
    ],
  },
  {
    id: "act3", name: "Act III", subtitle: "Mount Arreat", color: "#c0392b",
    pois: [
      { id: "bk-wp",     name: "Bastion's Keep",       sub: "Town Waypoint",        type: "waypoint",  x: 18, y: 32, desc: "Act III hub waypoint. All artisans available.", tip: "Always activate first. Keep Depths entrance is just south." },
      { id: "bk-haed",   name: "Haedrig Eamon",        sub: "Blacksmith",           type: "artisan",   x: 12, y: 38, desc: "Blacksmith forge in Bastion's Keep.", tip: "Salvage items before heading into the Keep Depths." },
      { id: "bk-shen",   name: "Covetous Shen",        sub: "Jeweler",              type: "artisan",   x: 24, y: 38, desc: "Jeweler workshop in Bastion's Keep.", tip: "Combine gems between Keep Depths runs." },
      { id: "bk-myr",    name: "Myriam Jahzia",        sub: "Mystic",               type: "artisan",   x: 24, y: 32, desc: "Mystic chamber in Bastion's Keep.", tip: "Enchant your weakest stat after each gear upgrade." },
      { id: "kd-wp",     name: "Keep Depths L2",       sub: "Waypoint",             type: "waypoint",  x: 18, y: 58, desc: "Waypoint on Keep Depths Level 2. Best farming zone in Act III.", tip: "Run both levels every game. 4+ elite packs per level." },
      { id: "kd-dungeon",name: "Keep Depths",          sub: "2-Level Dungeon",      type: "dungeon",   x: 20, y: 54, desc: "2-level military fortress dungeon. Cross-spine layout.", tip: "Best Act III farm. 4+ elite packs per level.", dungeonKey: "keep_depths" },
      { id: "kd-ghom",   name: "Ghom",                 sub: "Boss — Keep Depths L3", type: "boss",     x: 14, y: 52, desc: "Ghom — mid-Act III boss on Keep Depths Level 3.", tip: "Move constantly to avoid his poison gas cloud. Kill him fast." },
      { id: "sf-wp",     name: "Stonefort",            sub: "Waypoint",             type: "waypoint",  x: 52, y: 22, desc: "Waypoint at Stonefort battlements.", tip: "Good for bounties. Xah'Rith the Keywarden is here." },
      { id: "sf-xahrith",name: "Xah'Rith",            sub: "Keywarden — Key of Terror", type: "keywarden", x: 58, y: 16, desc: "Act III Keywarden. Drops the Key of Terror.", tip: "Must be on Torment I+. Found in Stonefort." },
      { id: "ac-wp",     name: "Arreat Crater L2",     sub: "Waypoint",             type: "waypoint",  x: 72, y: 48, desc: "Waypoint on Arreat Crater Level 2. Winding choke-point corridors.", tip: "Large irregular tiles connected by narrow choke points. Follow the path." },
      { id: "ac-cyd",    name: "Cydaea",               sub: "Boss — Crater L2",     type: "boss",      x: 78, y: 38, desc: "Cydaea, Maiden of Lust — boss on Arreat Crater Level 2.", tip: "Kill her spider minions. Dodge her web attacks and stay mobile." },
      { id: "ca-wp",     name: "Core of Arreat",       sub: "Waypoint",             type: "waypoint",  x: 84, y: 36, desc: "Waypoint in the Core of Arreat.", tip: "Leads to the final boss fight." },
      { id: "ca-azmodan",name: "Azmodan",              sub: "Boss — Act III Final", type: "boss",      x: 88, y: 28, desc: "Azmodan, Lord of Sin — Act III final boss in the Core of Arreat.", tip: "Dodge his blood pools. Kill summoned demons quickly. Destroy his summoning portals." },
      { id: "kd-chest",  name: "Resplendent Chest",    sub: "Rare Spawn",           type: "chest",     x: 22, y: 62, desc: "Resplendent Chest spawn in the Keep Depths.", tip: "High Legendary drop chance. Check every run." },
    ],
  },
  {
    id: "act4", name: "Act IV", subtitle: "High Heavens", color: "#5b9bd5",
    pois: [
      { id: "dg-wp",     name: "Diamond Gates",        sub: "Town Waypoint",        type: "waypoint",  x: 50, y: 72, desc: "Act IV hub waypoint. All artisans available.", tip: "Always activate first. All artisans are in the side chambers." },
      { id: "dg-haed",   name: "Haedrig Eamon",        sub: "Blacksmith",           type: "artisan",   x: 38, y: 68, desc: "Divine forge chamber in the High Heavens.", tip: "Salvage items before heading into the Silver Spire." },
      { id: "dg-shen",   name: "Covetous Shen",        sub: "Jeweler",              type: "artisan",   x: 62, y: 68, desc: "Celestial gem workshop in the High Heavens.", tip: "Combine gems between Silver Spire runs." },
      { id: "dg-myr",    name: "Myriam Jahzia",        sub: "Mystic",               type: "artisan",   x: 50, y: 80, desc: "Mystic chamber in the High Heavens.", tip: "Enchant your weakest stat after each upgrade." },
      { id: "gh-wp",     name: "Gardens of Hope T1",   sub: "Waypoint",             type: "waypoint",  x: 22, y: 48, desc: "Waypoint in the Gardens of Hope Tier 1.", tip: "3+ elite packs. Good for bounties and Keywarden farming." },
      { id: "gh-izual",  name: "Izual",                sub: "Boss — Gardens of Hope", type: "boss",    x: 14, y: 38, desc: "Izual — mid-Act IV boss in the Gardens of Hope.", tip: "Kill his ice crystal spawns to prevent them from healing him. Stay mobile." },
      { id: "ss-wp",     name: "Silver Spire L1",      sub: "Waypoint",             type: "waypoint",  x: 72, y: 48, desc: "Waypoint at Silver Spire Level 1. Best farming zone in Act IV.", tip: "Figure-eight double loop pattern. Run both levels every game." },
      { id: "ss-dungeon",name: "Silver Spire",         sub: "2-Level Dungeon",      type: "dungeon",   x: 74, y: 42, desc: "2-level celestial tower. Figure-eight double loop pattern.", tip: "Always run both levels. Level 2 leads directly to Diablo.", dungeonKey: "silver_spire" },
      { id: "ss-nekarat",name: "Nekarat",              sub: "Keywarden — Key of Bones", type: "keywarden", x: 82, y: 36, desc: "Act IV Keywarden. Drops the Key of Bones.", tip: "Must be on Torment I+. Found in the Silver Spire." },
      { id: "ss-diablo", name: "Diablo",               sub: "Boss — Act IV Final",  type: "boss",      x: 86, y: 28, desc: "Diablo, Prime Evil — Act IV final boss at the top of the Silver Spire.", tip: "Phase 3: avoid his shadow clones and lightning breath. Stay mobile and keep moving." },
      { id: "ss-rakanoth",name: "Rakanoth",            sub: "Boss — Library of Fate", type: "boss",    x: 78, y: 38, desc: "Rakanoth, Lord of Despair — boss in the Library of Fate.", tip: "Dodge his teleport slam. Kill his summoned minions quickly." },
    ],
  },
  {
    id: "act5", name: "Act V", subtitle: "Westmarch", color: "#8e44ad",
    pois: [
      { id: "se-wp",     name: "Survivors' Enclave",   sub: "Town Waypoint",        type: "waypoint",  x: 18, y: 38, desc: "Act V hub waypoint. All artisans available.", tip: "Always activate first. Ruins of Corvus is the best farming zone." },
      { id: "se-haed",   name: "Haedrig Eamon",        sub: "Blacksmith",           type: "artisan",   x: 12, y: 32, desc: "Improvised forge in the Survivors' Enclave.", tip: "Salvage items before heading into the Ruins of Corvus." },
      { id: "se-shen",   name: "Covetous Shen",        sub: "Jeweler",              type: "artisan",   x: 24, y: 32, desc: "Gem shelter in the Survivors' Enclave.", tip: "Combine gems between Corvus runs." },
      { id: "se-myr",    name: "Myriam Jahzia",        sub: "Mystic",               type: "artisan",   x: 24, y: 42, desc: "Mystic shelter in the Survivors' Enclave.", tip: "Enchant your weakest stat after each upgrade." },
      { id: "wc-wp",     name: "Westmarch Commons",    sub: "Waypoint",             type: "waypoint",  x: 42, y: 36, desc: "Waypoint in Westmarch Commons. City grid with interconnected rectangular loops.", tip: "Dense elite packs throughout the ruined city streets." },
      { id: "wc-urzael", name: "Urzael",               sub: "Boss — Westmarch Heights", type: "boss",  x: 50, y: 24, desc: "Urzael — mid-Act V boss in the Westmarch Heights.", tip: "Dodge his fire cannon and burning balls. Stay mobile." },
      { id: "rc-wp",     name: "Ruins of Corvus",      sub: "Waypoint",             type: "waypoint",  x: 62, y: 58, desc: "Waypoint at the Ruins of Corvus. Best farming zone in Act V.", tip: "Organic loop pattern. Dense spectral enemies. 4+ elite packs per run." },
      { id: "rc-dungeon",name: "Ruins of Corvus",      sub: "Dungeon",              type: "dungeon",   x: 64, y: 52, desc: "Ruined gothic city dungeon. Organic winding loop.", tip: "Best Act V farm. Dense spectral enemies. Adria boss.", dungeonKey: "ruins_corvus" },
      { id: "rc-adria",  name: "Adria",                sub: "Boss — Ruins of Corvus", type: "boss",    x: 58, y: 52, desc: "Adria — boss in the Ruins of Corvus.", tip: "Dodge her blood pools and summoned minions. Kill minions quickly." },
      { id: "rc-chest",  name: "Resplendent Chest",    sub: "Rare Spawn",           type: "chest",     x: 70, y: 64, desc: "Resplendent Chest spawn in the Ruins of Corvus.", tip: "High Legendary drop chance. Check every run." },
      { id: "pf-wp",     name: "Pandemonium Fortress", sub: "Waypoint",             type: "waypoint",  x: 84, y: 44, desc: "Waypoint in the Pandemonium Fortress.", tip: "Leads to the final boss fight with Malthael." },
      { id: "pf-malthael",name: "Malthael",            sub: "Boss — Act V Final",   type: "boss",      x: 88, y: 32, desc: "Malthael, Angel of Death — Act V final boss.", tip: "Avoid his soul tornado and death mist. Stay mobile and keep moving at all times." },
    ],
  },
];

// ─── Marker component ─────────────────────────────────────────────────────────
function Marker({ poi, isSelected, onClick, scale }: {
  poi: MapPoi; isSelected: boolean; onClick: () => void; scale: number;
}) {
  const cfg = POI_CONFIG[poi.type];
  const size = Math.max(10, 16 / scale);
  const fontSize = Math.max(7, 10 / scale);
  const isDungeon = poi.type === "dungeon";

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="absolute cursor-pointer group"
      style={{ left: `${poi.x}%`, top: `${poi.y}%`, transform: "translate(-50%,-50%)", zIndex: isSelected ? 30 : 10 }}>

      {/* Marker pin */}
      <div className="relative flex flex-col items-center">
        <div
          className="rounded-full flex items-center justify-center transition-all duration-150 relative"
          style={{
            width: `${size}px`, height: `${size}px`,
            background: isSelected ? cfg.color : cfg.bg,
            border: `${isSelected ? 2 : 1.5}px solid ${cfg.color}`,
            boxShadow: isSelected
              ? `0 0 0 2px rgba(255,255,255,0.3), 0 0 12px ${cfg.color}88`
              : `0 0 6px ${cfg.color}44`,
            transform: isSelected ? "scale(1.4)" : "scale(1)",
          }}>
          {/* Dungeon has a special inner indicator */}
          {isDungeon && (
            <div className="absolute inset-0 rounded-full border-2 animate-ping"
              style={{ borderColor: cfg.color, opacity: 0.4 }} />
          )}
          <span style={{ color: isSelected ? "#fff" : cfg.color, fontSize: `${size * 0.45}px`, lineHeight: 1 }}>
            {poi.type === "waypoint" ? "◆" :
             poi.type === "boss" ? "☠" :
             poi.type === "keywarden" ? "🔑" :
             poi.type === "artisan" ? "⚒" :
             poi.type === "dungeon" ? "▼" :
             poi.type === "chest" ? "◈" :
             poi.type === "follower" ? "★" :
             poi.type === "exit" ? "→" : "!"}
          </span>
        </div>

        {/* Label — shown when selected or on hover at high zoom */}
        <div
          className="absolute whitespace-nowrap rounded px-1 py-0.5 pointer-events-none transition-opacity duration-150"
          style={{
            top: `${size + 3}px`,
            background: "rgba(3,1,8,0.92)",
            border: `1px solid ${cfg.color}55`,
            fontSize: `${fontSize}px`,
            color: isSelected ? cfg.color : "oklch(0.82 0.010 60)",
            fontFamily: "'Cinzel', serif",
            fontWeight: isSelected ? "bold" : "normal",
            opacity: isSelected ? 1 : 0,
          }}
          // Show on hover via group
        >
          {poi.name}
          {poi.sub && <span style={{ color: "oklch(0.60 0.010 60)", marginLeft: "4px" }}>· {poi.sub}</span>}
        </div>

        {/* Always-visible label for selected */}
        {isSelected && (
          <div className="absolute whitespace-nowrap rounded px-1.5 py-0.5 pointer-events-none"
            style={{
              top: `${size + 3}px`,
              background: "rgba(3,1,8,0.95)",
              border: `1px solid ${cfg.color}88`,
              fontSize: `${Math.max(8, 11 / scale)}px`,
              color: cfg.color,
              fontFamily: "'Cinzel', serif",
              fontWeight: "bold",
              zIndex: 40,
            }}>
            {poi.name}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dungeon Overlay Modal ────────────────────────────────────────────────────
function DungeonOverlay({ dungeonKey, onClose }: { dungeonKey: string; onClose: () => void }) {
  const dungeon = DUNGEON_MAPS[dungeonKey];
  if (!dungeon) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <div className="relative w-full max-w-4xl rounded-lg overflow-hidden border shadow-2xl"
        style={{ borderColor: "oklch(0.72 0.18 55 / 0.4)", background: "oklch(0.07 0.008 30)" }}
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: "oklch(0.20 0.015 50)" }}>
          <div>
            <p className="font-cinzel tracking-widest text-xs mb-0.5" style={{ color: "oklch(0.72 0.18 55)", fontSize: "0.6rem" }}>
              {dungeon.act.toUpperCase()} · DUNGEON MAP
            </p>
            <h2 className="font-cinzel-decorative font-black text-xl" style={{ color: "oklch(0.92 0.01 60)" }}>
              {dungeon.name}
            </h2>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded border flex items-center justify-center"
            style={{ background: "oklch(0.12 0.010 30)", borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.65 0.010 60)" }}>
            <X size={16} />
          </button>
        </div>

        {/* Dungeon map image */}
        <div className="relative" style={{ aspectRatio: "4/3" }}>
          <img src={dungeon.url} alt={dungeon.name}
            className="w-full h-full object-contain"
            style={{ background: "#000" }} />
        </div>

        {/* Info footer */}
        <div className="px-5 py-3 border-t flex items-start gap-4"
          style={{ borderColor: "oklch(0.20 0.015 50)" }}>
          <div className="flex-1">
            <p className="text-sm leading-relaxed mb-1" style={{ color: "oklch(0.78 0.010 60)" }}>{dungeon.desc}</p>
          </div>
          <div className="flex items-start gap-1.5 px-3 py-2 rounded flex-shrink-0 max-w-xs"
            style={{ background: "oklch(0.10 0.010 30)", border: "1px solid oklch(0.72 0.18 55 / 0.2)" }}>
            <span style={{ color: "#ffd54f", fontSize: "0.8rem", marginTop: "1px" }}>★</span>
            <p className="text-sm" style={{ color: "oklch(0.80 0.010 60)" }}>{dungeon.tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Map Page ────────────────────────────────────────────────────────────
export default function SanctuaryMapPage() {
  const [activeAct, setActiveAct] = useState<ActMapData>(ACT_DATA[0]);
  const [selectedPoi, setSelectedPoi] = useState<MapPoi | null>(null);
  const [dungeonOverlay, setDungeonOverlay] = useState<string | null>(null);
  const [enabledTypes, setEnabledTypes] = useState<Set<PoiType>>(
    new Set(Object.keys(POI_CONFIG) as PoiType[])
  );
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTownView, setIsTownView] = useState(false);

  // Pan/zoom
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Reset on Act/view change
  useEffect(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
    setSelectedPoi(null);
  }, [activeAct.id, isTownView]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const factor = e.deltaY > 0 ? 0.88 : 1.14;
    setTransform((prev) => {
      const ns = Math.min(6, Math.max(0.4, prev.scale * factor));
      const r = ns / prev.scale;
      return { x: mx - r * (mx - prev.x), y: my - r * (my - prev.y), scale: ns };
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

  const toggleType = (type: PoiType) => {
    setEnabledTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  };

  // Use town POIs when in town view, otherwise use act POIs
  const currentPois = isTownView ? (TOWN_POIS[activeAct.id] || []) : activeAct.pois;

  const visiblePois = currentPois.filter((p) => {
    if (!enabledTypes.has(p.type)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.sub || "").toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
    }
    return true;
  });

  const searchResults = search.trim()
    ? currentPois.filter((p) => {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.sub || "").toLowerCase().includes(q);
      }).slice(0, 8)
    : [];

  const handlePoiClick = (poi: MapPoi) => {
    if (hasMoved.current) return;
    if (poi.type === "dungeon" && poi.dungeonKey) {
      setDungeonOverlay(poi.dungeonKey);
      setSelectedPoi(null);
    } else {
      setSelectedPoi(selectedPoi?.id === poi.id ? null : poi);
    }
  };

  const ac = activeAct.color;

  // Count POIs by type for the current act
  const typeCounts = activeAct.pois.reduce<Record<string, number>>((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#030108" }}>

      {/* ── Sidebar ── */}
      {sidebarOpen && (
        <div className="w-64 flex-shrink-0 flex flex-col border-r overflow-y-auto"
          style={{ borderColor: "oklch(0.18 0.012 50)", background: "oklch(0.08 0.010 30)", minWidth: "256px" }}>

          {/* Brand header */}
          <div className="p-3 border-b flex items-center justify-between"
            style={{ borderColor: "oklch(0.18 0.012 50)" }}>
            <div>
              <p className="font-cinzel-decorative font-black text-sm" style={{ color: "oklch(0.78 0.18 55)" }}>SANCTUARY</p>
              <p className="font-cinzel" style={{ color: "oklch(0.60 0.010 60)", fontSize: "0.55rem" }}>Interactive Map · All 5 Acts</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} style={{ color: "oklch(0.48 0.010 60)" }}>
              <X size={15} />
            </button>
          </div>

          {/* Act selector */}
          <div className="p-2 border-b" style={{ borderColor: "oklch(0.18 0.012 50)" }}>
            <p className="font-cinzel tracking-widest mb-1.5 px-1" style={{ color: "oklch(0.50 0.010 60)", fontSize: "0.5rem" }}>ACT</p>
            <div className="space-y-0.5">
              {ACT_DATA.map((act) => (
                <button key={act.id} onClick={() => setActiveAct(act)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded transition-all text-left"
                  style={{
                    background: activeAct.id === act.id ? `${act.color}20` : "transparent",
                    border: `1px solid ${activeAct.id === act.id ? `${act.color}55` : "transparent"}`,
                  }}>
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: act.color, boxShadow: activeAct.id === act.id ? `0 0 6px ${act.color}` : "none" }} />
                  <div>
                    <p className="font-cinzel font-bold" style={{ color: activeAct.id === act.id ? act.color : "oklch(0.80 0.010 60)", fontSize: "0.78rem" }}>{act.name}</p>
                    <p className="font-cinzel" style={{ color: "oklch(0.55 0.010 60)", fontSize: "0.55rem" }}>{act.subtitle}</p>
                  </div>
                  <span className="ml-auto font-cinzel rounded-full px-1.5 py-0.5"
                    style={{ background: "oklch(0.12 0.010 30)", color: "oklch(0.55 0.010 60)", fontSize: "0.5rem" }}>
                    {act.pois.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="p-2 border-b" style={{ borderColor: "oklch(0.18 0.012 50)" }}>
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded border"
              style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.20 0.015 50)" }}>
              <Search size={11} color="oklch(0.50 0.010 60)" />
              <input type="text" placeholder="Search locations..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none font-cinzel"
                style={{ color: "oklch(0.85 0.01 60)", fontSize: "0.72rem" }} />
              {search && <button onClick={() => setSearch("")} style={{ color: "oklch(0.50 0.010 60)" }}>×</button>}
            </div>
            {searchResults.length > 0 && (
              <div className="mt-1 rounded border overflow-hidden" style={{ borderColor: "oklch(0.18 0.012 50)" }}>
                {searchResults.map((poi) => {
                  const cfg = POI_CONFIG[poi.type];
                  return (
                    <button key={poi.id}
                      onClick={() => { setSelectedPoi(poi); setSearch(""); }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-left border-b last:border-b-0"
                      style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.16 0.010 50)" }}>
                      <span style={{ color: cfg.color, fontSize: "0.7rem" }}>
                        {poi.type === "waypoint" ? "◆" : poi.type === "boss" ? "☠" : poi.type === "dungeon" ? "▼" : "•"}
                      </span>
                      <div>
                        <p className="font-cinzel font-bold" style={{ color: "oklch(0.85 0.01 60)", fontSize: "0.65rem" }}>{poi.name}</p>
                        {poi.sub && <p style={{ color: "oklch(0.55 0.010 60)", fontSize: "0.55rem" }}>{poi.sub}</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* POI type filters */}
          <div className="p-2 border-b" style={{ borderColor: "oklch(0.18 0.012 50)" }}>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <p className="font-cinzel tracking-widest" style={{ color: "oklch(0.50 0.010 60)", fontSize: "0.5rem" }}>FILTER</p>
              <div className="flex gap-1">
                <button onClick={() => setEnabledTypes(new Set(Object.keys(POI_CONFIG) as PoiType[]))}
                  className="font-cinzel px-1.5 py-0.5 rounded text-xs"
                  style={{ background: `${ac}18`, color: ac, border: `1px solid ${ac}33`, fontSize: "0.5rem" }}>ALL</button>
                <button onClick={() => setEnabledTypes(new Set())}
                  className="font-cinzel px-1.5 py-0.5 rounded text-xs"
                  style={{ background: "oklch(0.12 0.010 30)", color: "oklch(0.50 0.010 60)", border: "1px solid oklch(0.18 0.012 50)", fontSize: "0.5rem" }}>NONE</button>
              </div>
            </div>
            <div className="space-y-0.5">
              {(Object.entries(POI_CONFIG) as [PoiType, typeof POI_CONFIG[PoiType]][]).map(([type, cfg]) => {
                const count = typeCounts[type] || 0;
                if (count === 0) return null;
                const enabled = enabledTypes.has(type);
                return (
                  <button key={type} onClick={() => toggleType(type)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded border transition-all"
                    style={{
                      background: enabled ? `${cfg.color}0e` : "transparent",
                      borderColor: enabled ? `${cfg.color}30` : "transparent",
                    }}>
                    <span style={{ color: enabled ? cfg.color : "oklch(0.38 0.010 60)", fontSize: "0.7rem" }}>
                      {type === "waypoint" ? "◆" : type === "boss" ? "☠" : type === "dungeon" ? "▼" : type === "keywarden" ? "🔑" : type === "artisan" ? "⚒" : type === "chest" ? "◈" : "•"}
                    </span>
                    <span className="font-cinzel flex-1 text-left" style={{ color: enabled ? "oklch(0.80 0.010 60)" : "oklch(0.45 0.010 60)", fontSize: "0.68rem" }}>{cfg.label}</span>
                    <span className="font-cinzel rounded-full px-1.5 py-0.5"
                      style={{ background: enabled ? `${cfg.color}18` : "oklch(0.12 0.010 30)", color: enabled ? cfg.color : "oklch(0.45 0.010 60)", fontSize: "0.5rem" }}>
                      {count}
                    </span>
                    {enabled ? <Eye size={10} color={cfg.color} /> : <EyeOff size={10} color="oklch(0.32 0.010 60)" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected POI detail */}
          {selectedPoi && (
            <div className="p-3 border-t mt-auto" style={{ borderColor: "oklch(0.18 0.012 50)", background: "oklch(0.09 0.010 30)" }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span style={{ color: POI_CONFIG[selectedPoi.type].color, fontSize: "0.85rem" }}>
                      {selectedPoi.type === "waypoint" ? "◆" : selectedPoi.type === "boss" ? "☠" : selectedPoi.type === "dungeon" ? "▼" : "•"}
                    </span>
                    <p className="font-cinzel font-bold text-sm truncate" style={{ color: POI_CONFIG[selectedPoi.type].color }}>
                      {selectedPoi.name}
                    </p>
                  </div>
                  {selectedPoi.sub && (
                    <p className="font-cinzel" style={{ color: "oklch(0.60 0.010 60)", fontSize: "0.58rem" }}>{selectedPoi.sub}</p>
                  )}
                </div>
                <button onClick={() => setSelectedPoi(null)} style={{ color: "oklch(0.50 0.010 60)", flexShrink: 0 }}>
                  <X size={13} />
                </button>
              </div>
              <p className="text-sm leading-relaxed mb-2" style={{ color: "oklch(0.78 0.010 60)", fontSize: "0.72rem" }}>{selectedPoi.desc}</p>
              <div className="flex items-start gap-1.5 p-2 rounded" style={{ background: "oklch(0.11 0.010 30)" }}>
                <span style={{ color: "#ffd54f", fontSize: "0.75rem", flexShrink: 0 }}>★</span>
                <p style={{ color: "oklch(0.78 0.010 60)", fontSize: "0.68rem" }}>{selectedPoi.tip}</p>
              </div>
              {selectedPoi.dungeonKey && (
                <button onClick={() => setDungeonOverlay(selectedPoi.dungeonKey!)}
                  className="w-full mt-2 py-2 rounded font-cinzel font-bold text-sm"
                  style={{ background: `${POI_CONFIG.dungeon.color}18`, border: `1px solid ${POI_CONFIG.dungeon.color}44`, color: POI_CONFIG.dungeon.color }}>
                  View Dungeon Map →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Map Canvas ── */}
      <div className="flex-1 relative overflow-hidden"
        ref={containerRef}
        style={{ cursor: isDragging.current ? "grabbing" : "grab", background: "#000" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClick={() => { if (!hasMoved.current) setSelectedPoi(null); }}>

        {/* Sidebar toggle */}
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-30 w-9 h-9 rounded border flex items-center justify-center"
            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.72 0.010 60)" }}>
            <Layers size={16} />
          </button>
        )}

        {/* Act label */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full pointer-events-none"
          style={{ background: "rgba(3,1,8,0.88)", border: `1px solid ${ac}44`, backdropFilter: "blur(8px)" }}>
          <p className="font-cinzel-decorative font-bold text-sm" style={{ color: ac }}>
            {activeAct.name} — {isTownView ? 'Town Hub' : activeAct.subtitle}
          </p>
        </div>

        {/* Dungeon hint */}
        <div className="absolute top-3 right-4 z-20 px-3 py-1.5 rounded pointer-events-none"
          style={{ background: "rgba(3,1,8,0.75)", border: "1px solid oklch(0.20 0.015 50)" }}>
          <p className="font-cinzel" style={{ color: "oklch(0.55 0.010 60)", fontSize: "0.55rem" }}>
            ▼ Click dungeon marker for detailed map
          </p>
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1">
          <button onClick={() => setTransform((p) => ({ ...p, scale: Math.min(6, p.scale * 1.3) }))}
            className="w-9 h-9 rounded border flex items-center justify-center font-bold text-lg"
            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.24 0.015 50)", color: "oklch(0.78 0.010 60)" }}>+</button>
          <button onClick={() => setTransform((p) => ({ ...p, scale: Math.max(0.4, p.scale * 0.77) }))}
            className="w-9 h-9 rounded border flex items-center justify-center font-bold text-lg"
            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.24 0.015 50)", color: "oklch(0.78 0.010 60)" }}>−</button>
          <button onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}
            className="w-9 h-9 rounded border flex items-center justify-center font-cinzel text-xs"
            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.24 0.015 50)", color: "oklch(0.60 0.010 60)" }}>⊡</button>
        </div>

        {/* Zoom level */}
        <div className="absolute bottom-4 left-4 z-30 px-2 py-1 rounded"
          style={{ background: "rgba(3,1,8,0.75)", border: "1px solid oklch(0.20 0.015 50)" }}>
          <p className="font-cinzel text-xs" style={{ color: "oklch(0.55 0.010 60)" }}>{Math.round(transform.scale * 100)}%</p>
        </div>

        {/* Transformable layer */}
        <div style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: "center center",
          transition: isDragging.current ? "none" : "transform 0.08s ease-out",
          width: "100%", height: "100%",
          position: "absolute", inset: 0,
        }}>
          {/* Base map image */}
          {/* For Act I town view, use the accurate SVG map. For all others, use the illustrated image. */}
          {isTownView && activeAct.id === "act1" ? (
            <div className="w-full h-full flex items-center justify-center overflow-auto p-4"
              style={{ background: "#050302" }}>
              <NewTristramMap width={700} height={620} />
            </div>
          ) : (
            <img
              src={isTownView ? TOWN_BASE_MAPS[activeAct.id] : BASE_MAPS[activeAct.id]}
              alt={`${activeAct.name} ${isTownView ? "Town" : "Zone"} Map`}
              className="w-full h-full object-cover"
              draggable={false}
              style={{ userSelect: "none", pointerEvents: "none" }}
            />
          )}

          {/* POI markers overlay */}
          <div className="absolute inset-0">
            {visiblePois.map((poi) => (
              <Marker
                key={poi.id}
                poi={poi}
                isSelected={selectedPoi?.id === poi.id}
                onClick={() => handlePoiClick(poi)}
                scale={transform.scale}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Dungeon Overlay Modal ── */}
      {dungeonOverlay && (
        <DungeonOverlay
          dungeonKey={dungeonOverlay}
          onClose={() => setDungeonOverlay(null)}
        />
      )}
    </div>
  );
}
