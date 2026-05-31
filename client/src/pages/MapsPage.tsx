// Sanctuary Grimoire — Maps: Three-Layer Interactive Map App
// World → Act/Zone → Dungeon — all on one pannable canvas
// Click inside the map to drill down. No page navigation.
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  ChevronLeft, Navigation, Sword, Package, Key, Star,
  Search, Eye, EyeOff, Layers, Home, Map, X
} from "lucide-react";
import { SVG_ZONE_MAPS, ZoneMapPoi } from "@/components/ZoneMaps";

// ─── CDN URLs ─────────────────────────────────────────────────────────────────
const WORLD_MAP = "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/sanctuary-world-map-JPf8CtQMRn8YUQVJ7WWcuA.webp";

const ACT_MAPS: Record<string, string> = {
  act1: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/map-act1-new-UYyYwr8CGiJc2QrtNKm7wV.webp",
  act2: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/map-act2-new-TmEF5DsrteNksMsufn9C4C.webp",
  act3: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/map-act3-new-hHbe3BnwYDTRFPFcxEiPPv.webp",
  act4: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/map-act4-new-UAidreLrFqCk8qAkKU8C2H.webp",
  act5: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/map-act5-new-WZ4RyEVpTTCAKw8rbfxxRs.webp",
};

const TOWN_MAPS: Record<string, string> = {
  act1: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/townmap-new-tristram-TK6xNVFAzcKFUNpH3GUmow.webp",
  act2: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/townmap-hidden-camp-TJDfX9fZeFvpART3LqRKfp.webp",
  act3: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/townmap-bastions-keep-Zdh6jBe5Qbty4SMj9QSica.webp",
  act4: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/townmap-diamond-gates-ixcosrwskqWVgy9otLeEJM.webp",
  act5: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/townmap-survivors-enclave-5f3M5QeZBokqxx6Jz4fxNg.webp",
};

const DUNGEON_MAPS: Record<string, string> = {
  cathedral:    "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/dungeon-cathedral-RqXs85rYYKSwNJQLJBjucN.webp",
  halls_agony:  "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/dungeon-halls-agony-bhBwpJyvHL8bBRKxWsyw6n.webp",
  keep_depths:  "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/dungeon-keep-depths-2ej985cV9rgqAMz4WTyFD8.webp",
  archives:     "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/dungeon-archives-C3umkAtQosG2vUJi7p7kyD.webp",
  silver_spire: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/dungeon-silver-spire-AFUn2ypVdpN5zHYeTFYFwN.webp",
  ruins_corvus: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/dungeon-ruins-corvus-BRLMqerYv58Y9Yrn77UgFq.webp",
};

// ─── Map data ─────────────────────────────────────────────────────────────────
interface MapPoi {
  id: string; name: string; sublabel?: string; type: string;
  x: number; y: number; // % of map
  description: string; tip: string; icon: string;
  drillTarget?: string; // dungeon key to drill into
}

interface ActData {
  id: string; name: string; subtitle: string; color: string;
  worldX: number; worldY: number; // % position on world map
  hubName: string;
  pois: MapPoi[];
  dungeons: { id: string; name: string; x: number; y: number; mapKey: string; description: string; tip: string; boss?: string; farmRating: number }[];
}

const ACTS: ActData[] = [
  {
    id: "act1", name: "Act I", subtitle: "Khanduras", color: "#8b0000",
    worldX: 18, worldY: 42, hubName: "New Tristram",
    pois: [
      { id: "a1-wp-tristram",   name: "New Tristram",          type: "waypoint", x: 20, y: 55, description: "The starting town of Act I. All artisans available.", tip: "Always activate this waypoint first.", icon: "⬟" },
      { id: "a1-wp-cathedral",  name: "Cathedral Garden",      type: "waypoint", x: 35, y: 40, description: "Waypoint at the entrance to the Cathedral.", tip: "Quick access to Cathedral Level 1.", icon: "⬟" },
      { id: "a1-wp-highlands",  name: "Northern Highlands",    type: "waypoint", x: 55, y: 25, description: "Waypoint in the Northern Highlands.", tip: "Good for bounties.", icon: "⬟" },
      { id: "a1-wp-fields",     name: "Fields of Misery",      type: "waypoint", x: 40, y: 70, description: "Waypoint in the Fields of Misery.", tip: "Top farming zone in Act I.", icon: "⬟" },
      { id: "a1-wp-halls",      name: "Halls of Agony L2",     type: "waypoint", x: 60, y: 60, description: "Waypoint inside the Halls of Agony.", tip: "Direct access to The Butcher.", icon: "⬟" },
      { id: "a1-boss-butcher",  name: "The Butcher",           type: "boss",     x: 65, y: 65, description: "The Butcher — Act I final boss. Drops guaranteed Legendary on first kill.", tip: "Stay mobile. Dodge his charge and fire chains.", icon: "☠" },
      { id: "a1-boss-leoric",   name: "Skeleton King",         type: "boss",     x: 38, y: 35, description: "The Skeleton King — mid-Act I boss in the Royal Crypts.", tip: "Kill his summoned skeletons first, then focus him.", icon: "☠" },
      { id: "a1-kw-odeg",       name: "Odeg the Keywarden",    type: "keywarden",x: 42, y: 72, description: "Act I Keywarden. Drops the Key of Destruction for Infernal Machine.", tip: "Found in the Fields of Misery. Must be on Torment I+.", icon: "🔑" },
      { id: "a1-chest-fields",  name: "Resplendent Chest",     type: "chest",    x: 45, y: 68, description: "Resplendent Chest spawn in the Fields of Misery.", tip: "High chance of Legendary drop. Check every run.", icon: "◈" },
      { id: "a1-goblin-fields", name: "Treasure Goblin Spawn", type: "goblin",   x: 38, y: 75, description: "Common Treasure Goblin spawn location in the Fields of Misery.", tip: "Kill before it escapes! Always worth chasing.", icon: "💰" },
    ],
    dungeons: [
      { id: "cathedral",   name: "Cathedral",          x: 35, y: 38, mapKey: "cathedral",   description: "4-level gothic dungeon beneath Tristram. Undead and demons.", tip: "Run all 4 levels for maximum XP. Boss: Skeleton King on Level 4.", boss: "Skeleton King", farmRating: 4 },
      { id: "halls_agony", name: "Halls of Agony",     x: 62, y: 62, mapKey: "halls_agony", description: "3-level torture dungeon. The Butcher awaits at the end.", tip: "Dense elite packs on all 3 levels. One of the best Act I farms.", boss: "The Butcher", farmRating: 5 },
      { id: "cemetery",    name: "Cemetery of Forsaken",x: 28, y: 60, mapKey: "cathedral",  description: "Outdoor cemetery with multiple crypts containing elites.", tip: "Check all 3 crypts. Each has a guaranteed elite pack.", boss: undefined, farmRating: 3 },
    ],
  },
  {
    id: "act2", name: "Act II", subtitle: "Caldeum", color: "#c8860a",
    worldX: 50, worldY: 48, hubName: "Hidden Camp",
    pois: [
      { id: "a2-wp-camp",      name: "Hidden Camp",           type: "waypoint", x: 15, y: 50, description: "Act II starting hub. All artisans available.", tip: "Always activate first.", icon: "⬟" },
      { id: "a2-wp-oasis",     name: "Dahlgur Oasis",         type: "waypoint", x: 55, y: 40, description: "Waypoint in the Dahlgur Oasis.", tip: "Best outdoor farming zone in Act II.", icon: "⬟" },
      { id: "a2-wp-archives",  name: "Archives of Zoltun Kulle",type:"waypoint",x: 70, y: 55, description: "Waypoint at the Archives entrance.", tip: "Dense elite packs inside.", icon: "⬟" },
      { id: "a2-boss-belial",  name: "Belial",                type: "boss",     x: 80, y: 70, description: "Belial, Lord of Lies — Act II final boss in the Imperial Palace.", tip: "Phase 2: dodge the green poison pools and his slam attacks.", icon: "☠" },
      { id: "a2-boss-maghda",  name: "Maghda",                type: "boss",     x: 35, y: 35, description: "Maghda — mid-Act II boss in Alcarnus.", tip: "Kill her butterfly minions quickly to interrupt her healing.", icon: "☠" },
      { id: "a2-kw-sokahr",    name: "Sokahr the Keywarden",  type: "keywarden",x: 58, y: 42, description: "Act II Keywarden. Drops the Key of Hate.", tip: "Found in the Dahlgur Oasis. Must be on Torment I+.", icon: "🔑" },
      { id: "a2-chest-oasis",  name: "Resplendent Chest",     type: "chest",    x: 60, y: 38, description: "Resplendent Chest spawn in the Dahlgur Oasis.", tip: "High chance of Legendary drop.", icon: "◈" },
    ],
    dungeons: [
      { id: "archives", name: "Archives of Zoltun Kulle", x: 68, y: 52, mapKey: "archives", description: "Ancient library dungeon with magical traps and constructs.", tip: "Dense elite packs. Boss: Zoltun Kulle at the end.", boss: "Zoltun Kulle", farmRating: 4 },
    ],
  },
  {
    id: "act3", name: "Act III", subtitle: "Mount Arreat", color: "#c0392b",
    worldX: 78, worldY: 38, hubName: "Bastion's Keep",
    pois: [
      { id: "a3-wp-keep",      name: "Bastion's Keep",        type: "waypoint", x: 20, y: 50, description: "Act III starting hub. All artisans available.", tip: "Always activate first.", icon: "⬟" },
      { id: "a3-wp-rakkis",    name: "Rakkis Crossing",       type: "waypoint", x: 45, y: 35, description: "Waypoint at Rakkis Crossing.", tip: "Good for bounties.", icon: "⬟" },
      { id: "a3-wp-depths",    name: "Keep Depths L2",        type: "waypoint", x: 30, y: 65, description: "Waypoint inside the Keep Depths.", tip: "Best farming zone in Act III.", icon: "⬟" },
      { id: "a3-boss-azmodan", name: "Azmodan",               type: "boss",     x: 75, y: 65, description: "Azmodan, Lord of Sin — Act III final boss in the Core of Arreat.", tip: "Dodge his blood pools and kill his summoned demons quickly.", icon: "☠" },
      { id: "a3-boss-ghom",    name: "Ghom",                  type: "boss",     x: 35, y: 70, description: "Ghom — mid-Act III boss in the Keep Depths.", tip: "Move constantly to avoid his poison gas cloud.", icon: "☠" },
      { id: "a3-kw-xahrith",   name: "Xah'Rith the Keywarden",type:"keywarden", x: 55, y: 30, description: "Act III Keywarden. Drops the Key of Terror.", tip: "Found in Stonefort. Must be on Torment I+.", icon: "🔑" },
      { id: "a3-chest-depths", name: "Resplendent Chest",     type: "chest",    x: 32, y: 68, description: "Resplendent Chest spawn in the Keep Depths.", tip: "High chance of Legendary drop.", icon: "◈" },
    ],
    dungeons: [
      { id: "keep_depths", name: "Keep Depths", x: 28, y: 62, mapKey: "keep_depths", description: "2-level military fortress dungeon. 4+ elite packs per level.", tip: "Best farming zone in Act III. Run both levels every game.", boss: "Ghom", farmRating: 5 },
    ],
  },
  {
    id: "act4", name: "Act IV", subtitle: "High Heavens", color: "#5b9bd5",
    worldX: 50, worldY: 14, hubName: "Diamond Gates",
    pois: [
      { id: "a4-wp-gates",     name: "Diamond Gates",         type: "waypoint", x: 50, y: 20, description: "Act IV starting hub. All artisans available.", tip: "Always activate first.", icon: "⬟" },
      { id: "a4-wp-spire",     name: "Silver Spire L1",       type: "waypoint", x: 65, y: 55, description: "Waypoint at the Silver Spire entrance.", tip: "Best farming zone in Act IV.", icon: "⬟" },
      { id: "a4-boss-diablo",  name: "Diablo",                type: "boss",     x: 70, y: 75, description: "Diablo, Prime Evil — Act IV final boss at the top of the Silver Spire.", tip: "Phase 3: avoid his shadow clones and lightning breath.", icon: "☠" },
      { id: "a4-boss-izual",   name: "Izual",                 type: "boss",     x: 35, y: 45, description: "Izual — mid-Act IV boss in the Gardens of Hope.", tip: "Kill his ice crystal spawns to prevent them from healing him.", icon: "☠" },
      { id: "a4-kw-nekarat",   name: "Nekarat the Keywarden", type: "keywarden",x: 55, y: 60, description: "Act IV Keywarden. Drops the Key of Bones.", tip: "Found in the Silver Spire. Must be on Torment I+.", icon: "🔑" },
    ],
    dungeons: [
      { id: "silver_spire", name: "Silver Spire", x: 62, y: 52, mapKey: "silver_spire", description: "2-level celestial tower. 4+ elite packs on Level 2.", tip: "Always run both levels. Level 2 leads directly to Diablo.", boss: "Diablo", farmRating: 5 },
    ],
  },
  {
    id: "act5", name: "Act V", subtitle: "Westmarch", color: "#8e44ad",
    worldX: 50, worldY: 78, hubName: "Survivors' Enclave",
    pois: [
      { id: "a5-wp-enclave",   name: "Survivors' Enclave",    type: "waypoint", x: 20, y: 50, description: "Act V starting hub. All artisans available.", tip: "Always activate first.", icon: "⬟" },
      { id: "a5-wp-commons",   name: "Westmarch Commons",     type: "waypoint", x: 40, y: 35, description: "Waypoint in Westmarch Commons.", tip: "Good for bounties.", icon: "⬟" },
      { id: "a5-wp-corvus",    name: "Ruins of Corvus",       type: "waypoint", x: 65, y: 55, description: "Waypoint at the Ruins of Corvus.", tip: "Best farming zone in Act V.", icon: "⬟" },
      { id: "a5-boss-malthael",name: "Malthael",              type: "boss",     x: 75, y: 70, description: "Malthael, Angel of Death — Act V final boss in Pandemonium Fortress.", tip: "Avoid his soul tornado and death mist. Stay mobile.", icon: "☠" },
      { id: "a5-boss-urzael",  name: "Urzael",                type: "boss",     x: 45, y: 40, description: "Urzael — mid-Act V boss in the Westmarch Heights.", tip: "Dodge his fire cannon and burning balls.", icon: "☠" },
      { id: "a5-kw-none",      name: "No Keywarden",          type: "keywarden",x: 60, y: 50, description: "Act V has no Keywarden. Keywardens are in Acts I-IV.", tip: "Focus on Ruins of Corvus for farming.", icon: "🔑" },
      { id: "a5-chest-corvus", name: "Resplendent Chest",     type: "chest",    x: 68, y: 58, description: "Resplendent Chest spawn in the Ruins of Corvus.", tip: "High chance of Legendary drop.", icon: "◈" },
    ],
    dungeons: [
      { id: "ruins_corvus", name: "Ruins of Corvus", x: 62, y: 52, mapKey: "ruins_corvus", description: "Ruined gothic city dungeon. Dense spectral enemies.", tip: "Best farming zone in Act V. Dense elite packs throughout.", boss: "Adria", farmRating: 5 },
    ],
  },
];

// ─── POI category config ──────────────────────────────────────────────────────
const POI_CATEGORIES = [
  { id: "waypoint",  label: "Waypoints",  color: "#80cbc4", icon: "⬟" },
  { id: "boss",      label: "Bosses",     color: "#ff7043", icon: "☠" },
  { id: "keywarden", label: "Keywardens", color: "#ce93d8", icon: "🔑" },
  { id: "chest",     label: "Chests",     color: "#ffd54f", icon: "◈" },
  { id: "goblin",    label: "Goblins",    color: "#66bb6a", icon: "💰" },
  { id: "dungeon",   label: "Dungeons",   color: "#7eb8f7", icon: "⬇" },
];

// ─── Layer types ──────────────────────────────────────────────────────────────
type LayerType = "world" | "act" | "dungeon";

interface MapLayer {
  type: LayerType;
  actId?: string;
  dungeonKey?: string;
  dungeonName?: string;
  isTown?: boolean;
}

// ─── Main Map App ─────────────────────────────────────────────────────────────
export default function MapsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const [layer, setLayer] = useState<MapLayer>({ type: "world" });
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(
    new Set(POI_CATEGORIES.map((c) => c.id))
  );
  const [selectedPoi, setSelectedPoi] = useState<MapPoi | null>(null);
  const [selectedDungeon, setSelectedDungeon] = useState<typeof ACTS[0]["dungeons"][0] | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentAct = layer.actId ? ACTS.find((a) => a.id === layer.actId) : null;

  // Reset transform when layer changes
  const navigateTo = useCallback((newLayer: MapLayer) => {
    setLayer(newLayer);
    setSelectedPoi(null);
    setSelectedDungeon(null);
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  // Get current map image
  const currentMapUrl = useMemo(() => {
    if (layer.type === "world") return WORLD_MAP;
    if (layer.type === "dungeon" && layer.dungeonKey) return DUNGEON_MAPS[layer.dungeonKey] || WORLD_MAP;
    if (layer.type === "act" && layer.actId) {
      return layer.isTown ? TOWN_MAPS[layer.actId] : ACT_MAPS[layer.actId];
    }
    return WORLD_MAP;
  }, [layer]);

  // Get current POIs
  const currentPois = useMemo(() => {
    if (layer.type !== "act" || !currentAct) return [];
    const actPois = currentAct.pois.filter((p) => enabledCategories.has(p.type));
    const dungeonPois: MapPoi[] = enabledCategories.has("dungeon") ? currentAct.dungeons.map((d) => ({
      id: `dungeon-${d.id}`, name: d.name, type: "dungeon",
      x: d.x, y: d.y, description: d.description, tip: d.tip, icon: "⬇",
      drillTarget: d.id,
    })) : [];
    const q = search.toLowerCase();
    return [...actPois, ...dungeonPois].filter((p) => !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }, [layer, currentAct, enabledCategories, search]);

  // World map Act hotspots
  const worldHotspots = useMemo(() => {
    if (layer.type !== "world") return [];
    return ACTS;
  }, [layer.type]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? 0.88 : 1.14;
    setTransform((prev) => {
      const newScale = Math.min(5, Math.max(0.3, prev.scale * delta));
      // Zoom toward mouse position
      const scaleChange = newScale / prev.scale;
      const newX = mouseX - scaleChange * (mouseX - prev.x);
      const newY = mouseY - scaleChange * (mouseY - prev.y);
      return { x: newX, y: newY, scale: newScale };
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    hasMoved.current = false;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const handleMouseUp = useCallback(() => { isDragging.current = false; }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Touch support
  const lastTouchDist = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastTouchDist.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    } else if (e.touches.length === 1) {
      isDragging.current = true;
      hasMoved.current = false;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const delta = dist / lastTouchDist.current;
      lastTouchDist.current = dist;
      setTransform((prev) => ({ ...prev, scale: Math.min(5, Math.max(0.3, prev.scale * delta)) }));
    } else if (e.touches.length === 1 && isDragging.current) {
      const dx = e.touches[0].clientX - lastPos.current.x;
      const dy = e.touches[0].clientY - lastPos.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved.current = true;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    }
  }, []);

  const handleTouchEnd = useCallback(() => { isDragging.current = false; }, []);

  const toggleCategory = (id: string) => setEnabledCategories((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  // Breadcrumb
  const breadcrumb: { label: string; layer: MapLayer }[] = [{ label: "Sanctuary", layer: { type: "world" } }];
  if (layer.type === "act" && currentAct) {
    breadcrumb.push({ label: layer.isTown ? currentAct.hubName : currentAct.name, layer: { type: "act", actId: currentAct.id, isTown: layer.isTown } });
  }
  if (layer.type === "dungeon" && currentAct) {
    breadcrumb.push({ label: currentAct.name, layer: { type: "act", actId: currentAct.id } });
    breadcrumb.push({ label: layer.dungeonName || "Dungeon", layer });
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "oklch(0.06 0.008 30)" }}>

      {/* ── Left Sidebar ── */}
      {sidebarOpen && (
        <div className="w-64 flex-shrink-0 flex flex-col border-r z-20"
          style={{ borderColor: "oklch(0.22 0.015 50)", background: "oklch(0.08 0.010 30)" }}>

          {/* Header */}
          <div className="p-3 border-b" style={{ borderColor: "oklch(0.22 0.015 50)" }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-cinzel-decorative font-black text-base" style={{ color: "oklch(0.78 0.18 55)" }}>SANCTUARY</p>
                <p className="font-cinzel text-xs" style={{ color: "oklch(0.65 0.010 60)", fontSize: "0.6rem" }}>Interactive Map</p>
              </div>
              <button onClick={() => setSidebarOpen(false)} style={{ color: "oklch(0.55 0.010 60)" }}>
                <X size={16} />
              </button>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1 flex-wrap">
              {breadcrumb.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <span style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.6rem" }}>›</span>}
                  <button onClick={() => navigateTo(crumb.layer)}
                    className="font-cinzel text-xs hover:underline"
                    style={{ color: i === breadcrumb.length - 1 ? "oklch(0.78 0.18 55)" : "oklch(0.65 0.010 60)", fontSize: "0.62rem" }}>
                    {crumb.label}
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Act switcher (world view) */}
          {layer.type === "world" && (
            <div className="p-3 border-b" style={{ borderColor: "oklch(0.22 0.015 50)" }}>
              <p className="font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.60 0.010 60)", fontSize: "0.52rem" }}>CLICK MAP TO EXPLORE</p>
              <div className="space-y-1">
                {ACTS.map((act) => (
                  <button key={act.id} onClick={() => navigateTo({ type: "act", actId: act.id })}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded border text-left transition-all"
                    style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${act.color}55`; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.22 0.015 50)"; }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: act.color }} />
                    <div>
                      <p className="font-cinzel font-bold text-xs" style={{ color: act.color }}>{act.name}</p>
                      <p className="font-cinzel" style={{ color: "oklch(0.65 0.010 60)", fontSize: "0.55rem" }}>{act.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Act view controls */}
          {layer.type === "act" && currentAct && (
            <div className="p-3 border-b" style={{ borderColor: "oklch(0.22 0.015 50)" }}>
              <p className="font-cinzel-decorative font-bold text-sm mb-1" style={{ color: currentAct.color }}>{currentAct.name}</p>
              <p className="font-cinzel text-xs mb-3" style={{ color: "oklch(0.70 0.010 60)" }}>{currentAct.subtitle}</p>

              {/* Zone / Town toggle */}
              <div className="flex gap-1 mb-3">
                <button onClick={() => navigateTo({ type: "act", actId: currentAct.id, isTown: false })}
                  className="flex-1 py-1.5 rounded font-cinzel font-bold text-xs transition-all"
                  style={{ background: !layer.isTown ? `${currentAct.color}22` : "oklch(0.12 0.010 30)", border: `1px solid ${!layer.isTown ? currentAct.color : "oklch(0.22 0.015 50)"}`, color: !layer.isTown ? currentAct.color : "oklch(0.65 0.010 60)" }}>
                  <Map size={10} className="inline mr-1" />Zones
                </button>
                <button onClick={() => navigateTo({ type: "act", actId: currentAct.id, isTown: true })}
                  className="flex-1 py-1.5 rounded font-cinzel font-bold text-xs transition-all"
                  style={{ background: layer.isTown ? `${currentAct.color}22` : "oklch(0.12 0.010 30)", border: `1px solid ${layer.isTown ? currentAct.color : "oklch(0.22 0.015 50)"}`, color: layer.isTown ? currentAct.color : "oklch(0.65 0.010 60)" }}>
                  <Home size={10} className="inline mr-1" />{currentAct.hubName.split(" ")[0]}
                </button>
              </div>

              {/* Search */}
              <div className="flex items-center gap-2 px-2 py-1.5 rounded border mb-3"
                style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                <Search size={11} color="oklch(0.60 0.010 60)" />
                <input type="text" placeholder="Search locations..." value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-xs font-cinzel outline-none"
                  style={{ color: "oklch(0.85 0.01 60)", fontSize: "0.7rem" }} />
                {search && <button onClick={() => setSearch("")} style={{ color: "oklch(0.60 0.010 60)" }}>×</button>}
              </div>

              {/* Category filters */}
              <div className="space-y-1">
                {POI_CATEGORIES.map((cat) => {
                  const enabled = enabledCategories.has(cat.id);
                  return (
                    <button key={cat.id} onClick={() => toggleCategory(cat.id)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded border transition-all"
                      style={{ background: enabled ? `${cat.color}10` : "oklch(0.10 0.010 30)", borderColor: enabled ? `${cat.color}33` : "oklch(0.20 0.015 50)" }}>
                      <span style={{ fontSize: "0.75rem" }}>{cat.icon}</span>
                      <span className="font-cinzel flex-1 text-left text-xs" style={{ color: enabled ? "oklch(0.85 0.01 60)" : "oklch(0.60 0.010 60)" }}>{cat.label}</span>
                      {enabled ? <Eye size={11} color={cat.color} /> : <EyeOff size={11} color="oklch(0.40 0.010 60)" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dungeon info */}
          {layer.type === "dungeon" && currentAct && (
            <div className="p-3 border-b" style={{ borderColor: "oklch(0.22 0.015 50)" }}>
              <p className="font-cinzel font-bold text-sm mb-1" style={{ color: currentAct.color }}>{layer.dungeonName}</p>
              <p className="font-cinzel text-xs mb-2" style={{ color: "oklch(0.70 0.010 60)" }}>Dungeon Map</p>
              <div className="p-2 rounded" style={{ background: "oklch(0.10 0.010 30)" }}>
                <p className="font-cinzel text-xs mb-1" style={{ color: "oklch(0.75 0.010 60)", fontSize: "0.65rem" }}>
                  {currentAct.dungeons.find((d) => d.mapKey === layer.dungeonKey)?.description}
                </p>
                <p className="text-xs" style={{ color: "oklch(0.70 0.010 60)", fontSize: "0.62rem" }}>
                  💡 {currentAct.dungeons.find((d) => d.mapKey === layer.dungeonKey)?.tip}
                </p>
              </div>
            </div>
          )}

          {/* Selected POI detail */}
          {selectedPoi && (
            <div className="p-3 border-t mt-auto" style={{ borderColor: "oklch(0.22 0.015 50)", background: "oklch(0.10 0.010 30)" }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span style={{ fontSize: "1rem" }}>{selectedPoi.icon}</span>
                    <p className="font-cinzel font-bold text-sm" style={{ color: POI_CATEGORIES.find((c) => c.id === selectedPoi.type)?.color || "#fff" }}>
                      {selectedPoi.name}
                    </p>
                  </div>
                  {selectedPoi.sublabel && <p className="font-cinzel text-xs" style={{ color: "oklch(0.65 0.010 60)" }}>{selectedPoi.sublabel}</p>}
                </div>
                <button onClick={() => setSelectedPoi(null)} style={{ color: "oklch(0.60 0.010 60)", fontSize: "1.2rem" }}>×</button>
              </div>
              <p className="text-sm leading-relaxed mb-2" style={{ color: "oklch(0.80 0.010 60)" }}>{selectedPoi.description}</p>
              <div className="flex items-start gap-1.5 p-2 rounded" style={{ background: "oklch(0.12 0.010 30)" }}>
                <span style={{ color: "#ffd54f" }}>★</span>
                <p className="text-sm" style={{ color: "oklch(0.78 0.010 60)" }}>{selectedPoi.tip}</p>
              </div>
              {selectedPoi.drillTarget && (
                <button
                  onClick={() => {
                    const dungeon = currentAct?.dungeons.find((d) => d.id === selectedPoi.drillTarget);
                    if (dungeon) navigateTo({ type: "dungeon", actId: layer.actId, dungeonKey: dungeon.mapKey, dungeonName: dungeon.name });
                  }}
                  className="w-full mt-2 py-2 rounded font-cinzel font-bold text-sm"
                  style={{ background: `${currentAct?.color || "#d4a843"}22`, border: `1px solid ${currentAct?.color || "#d4a843"}55`, color: currentAct?.color || "#d4a843" }}>
                  Enter Dungeon →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Map Canvas ── */}
      <div className="flex-1 relative overflow-hidden"
        ref={containerRef}
        style={{ cursor: isDragging.current ? "grabbing" : "grab", background: "oklch(0.04 0.005 30)" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => { if (!hasMoved.current) { setSelectedPoi(null); setSelectedDungeon(null); } }}>

        {/* Sidebar toggle when closed */}
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-30 w-10 h-10 rounded border flex items-center justify-center"
            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.28 0.015 50)", color: "oklch(0.75 0.010 60)" }}>
            <Layers size={16} />
          </button>
        )}

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-30">
          <button onClick={() => setTransform((p) => ({ ...p, scale: Math.min(5, p.scale * 1.3) }))}
            className="w-10 h-10 rounded border flex items-center justify-center font-bold text-xl"
            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.28 0.015 50)", color: "oklch(0.80 0.010 60)" }}>+</button>
          <button onClick={() => setTransform((p) => ({ ...p, scale: Math.max(0.3, p.scale * 0.77) }))}
            className="w-10 h-10 rounded border flex items-center justify-center font-bold text-xl"
            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.28 0.015 50)", color: "oklch(0.80 0.010 60)" }}>−</button>
          <button onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}
            className="w-10 h-10 rounded border flex items-center justify-center text-sm font-cinzel"
            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.28 0.015 50)", color: "oklch(0.65 0.010 60)" }}>⊡</button>
        </div>

        {/* Zoom + layer indicator */}
        <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2">
          <div className="px-2 py-1 rounded" style={{ background: "rgba(5,3,8,0.75)", border: "1px solid oklch(0.22 0.015 50)" }}>
            <p className="font-cinzel text-xs" style={{ color: "oklch(0.65 0.010 60)" }}>{Math.round(transform.scale * 100)}%</p>
          </div>
          {layer.type !== "world" && (
            <button onClick={() => navigateTo({ type: "world" })}
              className="flex items-center gap-1.5 px-3 py-1 rounded border font-cinzel font-bold text-xs"
              style={{ background: "rgba(5,3,8,0.75)", borderColor: "oklch(0.72 0.18 55 / 0.4)", color: "oklch(0.78 0.18 55)" }}>
              <ChevronLeft size={12} /> World Map
            </button>
          )}
        </div>

        {/* Transformable map */}
        <div style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: "center center",
          transition: isDragging.current ? "none" : "transform 0.08s ease-out",
          width: "100%", height: "100%",
          position: "absolute", inset: 0,
        }}>
          {/* Dungeon layer: use SVG topology map if available, else fall back to image */}
          {layer.type === "dungeon" && layer.dungeonKey && SVG_ZONE_MAPS[layer.dungeonKey] ? (
            <div className="w-full h-full flex items-center justify-center" style={{ pointerEvents: "none" }}>
              {(() => {
                const SvgMap = SVG_ZONE_MAPS[layer.dungeonKey!];
                return (
                  <SvgMap
                    width={Math.min(window.innerWidth - (sidebarOpen ? 256 : 0), 900)}
                    height={Math.min(window.innerHeight, 700)}
                    selectedPoi={selectedPoi?.id}
                    onPoiClick={(poi: ZoneMapPoi) => {
                      setSelectedPoi({ id: poi.id, name: poi.label, type: poi.type, x: 0, y: 0, description: poi.tip, tip: poi.tip, icon: "•" });
                    }}
                  />
                );
              })()}
            </div>
          ) : (
            /* World / Act / Town layers: use image */
            <img src={currentMapUrl} alt="Map"
              className="w-full h-full object-contain"
              draggable={false}
              style={{ userSelect: "none", pointerEvents: "none" }} />
          )}

          {/* World map Act hotspots */}
          {layer.type === "world" && worldHotspots.map((act) => (
            <div key={act.id}
              onClick={(e) => { e.stopPropagation(); if (!hasMoved.current) navigateTo({ type: "act", actId: act.id }); }}
              className="absolute cursor-pointer group"
              style={{ left: `${act.worldX}%`, top: `${act.worldY}%`, transform: "translate(-50%,-50%)", zIndex: 10 }}>
              <div className="relative flex flex-col items-center gap-1">
                <div className="rounded-full transition-all duration-200 group-hover:scale-125"
                  style={{ width: "18px", height: "18px", background: act.color, boxShadow: `0 0 12px ${act.color}cc, 0 0 24px ${act.color}44`, border: "2px solid rgba(255,255,255,0.3)" }} />
                <div className="px-2 py-1 rounded whitespace-nowrap"
                  style={{ background: "rgba(5,3,8,0.88)", border: `1px solid ${act.color}88`, backdropFilter: "blur(4px)" }}>
                  <p className="font-cinzel font-bold" style={{ color: act.color, fontSize: "0.65rem" }}>{act.name}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Act POI markers */}
          {layer.type === "act" && currentPois.map((poi) => {
            const catColor = POI_CATEGORIES.find((c) => c.id === poi.type)?.color || "#fff";
            const isSelected = selectedPoi?.id === poi.id;
            const isDungeon = poi.type === "dungeon";
            const markerSize = isDungeon ? 22 : 16;
            return (
              <div key={poi.id}
                onClick={(e) => { e.stopPropagation(); if (!hasMoved.current) { if (isDungeon && poi.drillTarget) { const dungeon = currentAct?.dungeons.find((d) => d.id === poi.drillTarget); if (dungeon) navigateTo({ type: "dungeon", actId: layer.actId, dungeonKey: dungeon.mapKey, dungeonName: dungeon.name }); } else { setSelectedPoi(isSelected ? null : poi); } } }}
                className="absolute cursor-pointer group"
                style={{ left: `${poi.x}%`, top: `${poi.y}%`, transform: "translate(-50%,-50%)", zIndex: isSelected ? 20 : 10 }}>
                <div className="relative flex flex-col items-center gap-0.5">
                  <div className="rounded-full transition-all duration-150 flex items-center justify-center"
                    style={{
                      width: `${markerSize}px`, height: `${markerSize}px`,
                      background: isSelected ? catColor : `${catColor}cc`,
                      border: `2px solid ${isSelected ? "white" : catColor}`,
                      boxShadow: isSelected ? `0 0 14px ${catColor}` : `0 0 5px ${catColor}66`,
                      transform: isSelected ? "scale(1.4)" : "scale(1)",
                    }}>
                    <span style={{ fontSize: `${markerSize * 0.5}px` }}>{poi.icon}</span>
                  </div>
                  <div className="whitespace-nowrap rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(5,3,8,0.9)", border: `1px solid ${catColor}66`, fontSize: "0.6rem", color: catColor, fontFamily: "'Cinzel', serif", position: "absolute", top: `${markerSize + 2}px`, pointerEvents: "none" }}>
                    {poi.name}
                  </div>
                  {isSelected && (
                    <div className="whitespace-nowrap rounded px-1 py-0.5"
                      style={{ background: "rgba(5,3,8,0.9)", border: `1px solid ${catColor}66`, fontSize: "0.6rem", color: catColor, fontFamily: "'Cinzel', serif", marginTop: "2px" }}>
                      {poi.name}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Layer label overlay */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full"
          style={{ background: "rgba(5,3,8,0.82)", border: "1px solid oklch(0.72 0.18 55 / 0.3)", backdropFilter: "blur(8px)" }}>
          <p className="font-cinzel-decorative font-bold text-sm" style={{ color: "oklch(0.78 0.18 55)" }}>
            {layer.type === "world" ? "Sanctuary — Click an Act to explore" :
             layer.type === "act" ? `${currentAct?.name} — ${layer.isTown ? currentAct?.hubName : "Zone Map"} — Click dungeons to enter` :
             `${layer.dungeonName} — Dungeon Map`}
          </p>
        </div>
      </div>
    </div>
  );
}
