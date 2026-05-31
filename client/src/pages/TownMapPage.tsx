// Sanctuary Grimoire — Town Map: MapGenie-style interactive hub maps
// Left sidebar with POI category filters, pannable illustrated map, click-to-detail markers
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { ChevronLeft, Search, Eye, EyeOff, Navigation, Hammer, Gem, Sparkles, Package, ArrowRight, Users, Map } from "lucide-react";

// ─── Town map data ────────────────────────────────────────────────────────────
interface TownPoi {
  id: string;
  name: string;
  sublabel?: string;
  category: string;
  x: number; // percentage 0-100 of map width
  y: number; // percentage 0-100 of map height
  description: string;
  tip: string;
  icon: string; // emoji fallback
}

interface TownMapData {
  id: string;
  name: string;
  subtitle: string;
  actLabel: string;
  color: string;
  mapUrl: string;
  pois: TownPoi[];
}

const TOWN_MAPS: Record<string, TownMapData> = {
  "act1": {
    id: "act1",
    name: "New Tristram",
    subtitle: "Walled Town of Khanduras",
    actLabel: "Act I",
    color: "#8b0000",
    mapUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/townmap-new-tristram-TK6xNVFAzcKFUNpH3GUmow.webp",
    pois: [
      { id: "nt-waypoint",   name: "Town Waypoint",         category: "waypoint",  x: 50, y: 50, description: "The New Tristram waypoint. Activating this is the first thing you should do when starting a new game.", tip: "Always activate the waypoint before exploring. It lets you return instantly from anywhere.", icon: "⬟" },
      { id: "nt-blacksmith", name: "Haedrig Eamon",         sublabel: "Blacksmith", category: "artisan",   x: 68, y: 28, description: "The town blacksmith. Craft weapons and armor, salvage items for crafting materials, and upgrade your gear.", tip: "Salvage all white, blue, and yellow items you don't need. Materials are essential for endgame crafting.", icon: "🔨" },
      { id: "nt-jeweler",    name: "Covetous Shen",         sublabel: "Jeweler",    category: "artisan",   x: 72, y: 58, description: "The jeweler. Socket gems into items, combine lower-tier gems into higher-tier ones, and craft jewelry.", tip: "Combine gems whenever you have 3 of the same tier. Flawless Royal is the endgame standard.", icon: "💎" },
      { id: "nt-mystic",     name: "Myriam Jahzia",         sublabel: "Mystic",     category: "artisan",   x: 50, y: 72, description: "The Mystic. Enchant items to reroll a secondary stat, and transmogrify items to change their appearance.", tip: "Enchanting is how you fix bad secondary stats. Focus on your most impactful slot first.", icon: "✨" },
      { id: "nt-stash",      name: "Stash",                 sublabel: "Slaughtered Calf Inn", category: "storage",   x: 22, y: 38, description: "Your personal item stash. Shared across all characters on your account.", tip: "Keep dedicated tabs for crafting materials, gems, and Kanai's Cube ingredients.", icon: "📦" },
      { id: "nt-inn",        name: "Slaughtered Calf Inn",  sublabel: "Leah's Base", category: "npc",       x: 22, y: 32, description: "The inn where Leah is staying. The stash is located here. The cellar entrance is beneath the inn.", tip: "Talk to Leah to advance the main quest. The cellar beneath contains undead and a guaranteed elite pack.", icon: "🏠" },
      { id: "nt-templar",    name: "Kormac",                sublabel: "Templar Follower", category: "follower",  x: 38, y: 48, description: "The Templar follower. Tank-oriented, provides healing and crowd control. Unlocked early in Act I.", tip: "Best follower for solo players who need survivability. Equip with a shield and healing items.", icon: "⚔️" },
      { id: "nt-scoundrel",  name: "Lyndon",                sublabel: "Scoundrel Follower", category: "follower",  x: 44, y: 44, description: "The Scoundrel follower. Ranged damage dealer with crowd control abilities.", tip: "Best for speed farming. His Crippling Shot slows enemies. Equip with a crossbow and crit items.", icon: "🏹" },
      { id: "nt-graveyard",  name: "Town Graveyard",        category: "landmark",  x: 18, y: 18, description: "The graveyard in the northwest corner of New Tristram. Contains lore journals.", tip: "No farming value, but contains ambient lore and journals for completionists.", icon: "⚰️" },
      { id: "nt-gate",       name: "Town Gate",             sublabel: "Exit to Old Tristram Road", category: "exit",      x: 50, y: 88, description: "The main gate leading out of New Tristram to the Old Tristram Road and the wider world.", tip: "The waypoint just outside leads to all Act I zones. Always activate it on your first run.", icon: "🚪" },
      { id: "nt-cellar",     name: "Inn Cellar Entrance",   sublabel: "Dungeon",    category: "dungeon",   x: 18, y: 52, description: "The cellar beneath the Slaughtered Calf Inn. Contains undead and a guaranteed elite pack.", tip: "Quick early-level dungeon. Check for Resplendent Chest on rare occasions.", icon: "⬇️" },
    ],
  },
  "act2": {
    id: "act2",
    name: "Hidden Camp",
    subtitle: "Desert Refuge outside Caldeum",
    actLabel: "Act II",
    color: "#c8860a",
    mapUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/townmap-hidden-camp-TJDfX9fZeFvpART3LqRKfp.webp",
    pois: [
      { id: "hc-waypoint",   name: "Hidden Camp Waypoint",  category: "waypoint",  x: 50, y: 52, description: "The Hidden Camp waypoint. Your base of operations for all Act II runs.", tip: "Always activate first. All artisans are within a short walk.", icon: "⬟" },
      { id: "hc-blacksmith", name: "Haedrig Eamon",         sublabel: "Blacksmith", category: "artisan",   x: 22, y: 28, description: "The blacksmith tent in the Hidden Camp. Same services as New Tristram.", tip: "Salvage items before heading into the Dahlgur Oasis runs.", icon: "🔨" },
      { id: "hc-jeweler",    name: "Covetous Shen",         sublabel: "Jeweler",    category: "artisan",   x: 72, y: 25, description: "The jeweler tent in the Hidden Camp.", tip: "Combine gems between Oasis runs to keep your gem tier current.", icon: "💎" },
      { id: "hc-mystic",     name: "Myriam Jahzia",         sublabel: "Mystic",     category: "artisan",   x: 78, y: 55, description: "The Mystic tent in the Hidden Camp.", tip: "Enchant your weakest stat slot after each major gear upgrade.", icon: "✨" },
      { id: "hc-stash",      name: "Stash",                 category: "storage",   x: 50, y: 45, description: "Your personal stash in the Hidden Camp.", tip: "Keep a tab for Act II-specific crafting materials.", icon: "📦" },
      { id: "hc-enchantress",name: "Eirena",                sublabel: "Enchantress Follower", category: "follower",  x: 55, y: 48, description: "The Enchantress follower. Provides crowd control and damage buffs.", tip: "Best for group play. Her Powered Armor and Erosion abilities amplify team damage.", icon: "🔮" },
      { id: "hc-exit-main",  name: "Road to Alcarnus",      sublabel: "Exit to Act II Zones", category: "exit",      x: 50, y: 8, description: "The main exit from the Hidden Camp to all Act II zones.", tip: "The Khasim Outpost waypoint is just down this road.", icon: "🚪" },
      { id: "hc-exit-sewers",name: "Sewers Entrance",       sublabel: "Sewers of Caldeum", category: "dungeon",   x: 12, y: 68, description: "Entrance to the Sewers of Caldeum, accessible from the Hidden Camp.", tip: "Good for bounties. Dense demon population in the sewers.", icon: "⬇️" },
    ],
  },
  "act3": {
    id: "act3",
    name: "Bastion's Keep",
    subtitle: "Last Fortress of Humanity",
    actLabel: "Act III",
    color: "#c0392b",
    mapUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/townmap-bastions-keep-Zdh6jBe5Qbty4SMj9QSica.webp",
    pois: [
      { id: "bk-waypoint",   name: "Bastion's Keep Waypoint", category: "waypoint",  x: 50, y: 50, description: "The Bastion's Keep Stronghold waypoint. Your base for all Act III runs.", tip: "Always activate first. All artisans are nearby.", icon: "⬟" },
      { id: "bk-blacksmith", name: "Haedrig Eamon",           sublabel: "Blacksmith", category: "artisan",   x: 18, y: 72, description: "The blacksmith forge in Bastion's Keep.", tip: "Salvage all items before heading into the Keep Depths or Rakkis Crossing.", icon: "🔨" },
      { id: "bk-jeweler",    name: "Covetous Shen",           sublabel: "Jeweler",    category: "artisan",   x: 78, y: 72, description: "The jeweler workshop in Bastion's Keep.", tip: "Combine gems between Keep Depths runs.", icon: "💎" },
      { id: "bk-mystic",     name: "Myriam Jahzia",           sublabel: "Mystic",     category: "artisan",   x: 82, y: 50, description: "The Mystic chamber in Bastion's Keep.", tip: "Enchant your weakest stat after each gear upgrade.", icon: "✨" },
      { id: "bk-stash",      name: "Stash",                   category: "storage",   x: 45, y: 52, description: "Your stash in Bastion's Keep.", tip: "Keep a tab for Act III crafting materials.", icon: "📦" },
      { id: "bk-war-room",   name: "War Room",                sublabel: "General Torion", category: "npc",       x: 22, y: 22, description: "The war room with the tactical map table. General Torion and other story NPCs gather here.", tip: "Talk to General Torion here to advance the Act III story.", icon: "🗺️" },
      { id: "bk-gate",       name: "Gate to Stonefort",       sublabel: "Exit to Act III Zones", category: "exit",      x: 50, y: 8, description: "The gate leading from Bastion's Keep to the Stonefort battlements.", tip: "Exit to all Act III outdoor zones. The Stonefort waypoint is just outside.", icon: "🚪" },
      { id: "bk-keep-depths",name: "Keep Depths Entrance",    sublabel: "Best Farming Zone", category: "dungeon",   x: 50, y: 90, description: "Stairs descending into the Keep Depths — one of the best farming zones in the game with 4+ elite packs per level.", tip: "Run both levels every game. One of the highest XP/hour zones in the entire game.", icon: "⬇️" },
    ],
  },
  "act4": {
    id: "act4",
    name: "Diamond Gates",
    subtitle: "Entry to the High Heavens",
    actLabel: "Act IV",
    color: "#5b9bd5",
    mapUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/townmap-diamond-gates-ixcosrwskqWVgy9otLeEJM.webp",
    pois: [
      { id: "dg-waypoint",   name: "Diamond Gates Waypoint", category: "waypoint",  x: 50, y: 50, description: "The Diamond Gates waypoint. Your base for all Act IV runs.", tip: "Always activate first. All artisans are in the side chambers.", icon: "⬟" },
      { id: "dg-blacksmith", name: "Haedrig Eamon",          sublabel: "Blacksmith", category: "artisan",   x: 18, y: 38, description: "The divine forge chamber in the High Heavens.", tip: "Salvage items before heading into the Silver Spire.", icon: "🔨" },
      { id: "dg-jeweler",    name: "Covetous Shen",          sublabel: "Jeweler",    category: "artisan",   x: 78, y: 38, description: "The celestial gem workshop in the High Heavens.", tip: "Combine gems between Silver Spire runs.", icon: "💎" },
      { id: "dg-mystic",     name: "Myriam Jahzia",          sublabel: "Mystic",     category: "artisan",   x: 50, y: 78, description: "The Mystic chamber in the High Heavens.", tip: "Enchant your weakest stat after each upgrade.", icon: "✨" },
      { id: "dg-stash",      name: "Stash",                  category: "storage",   x: 50, y: 44, description: "Your stash in the Diamond Gates.", tip: "Keep a tab for Act IV crafting materials.", icon: "📦" },
      { id: "dg-gardens",    name: "Gardens of Hope",        sublabel: "Act IV Zone", category: "exit",      x: 15, y: 68, description: "Path to the Gardens of Hope.", tip: "3+ elite packs. Good for bounties and Keywarden farming.", icon: "🚪" },
      { id: "dg-spire",      name: "Silver Spire",           sublabel: "Best Act IV Farm", category: "exit",      x: 82, y: 68, description: "Path to the Silver Spire — 4+ elite packs on Level 2.", tip: "Always run both levels. Silver Spire Level 2 leads directly to Diablo.", icon: "🚪" },
      { id: "dg-archway",    name: "Crystal Archway",        sublabel: "Entry from Act III", category: "exit",      x: 50, y: 10, description: "The grand crystal archway entrance to the Diamond Gates from the mortal realm.", tip: "Entry point from Act III. Activate the Diamond Gates waypoint immediately.", icon: "🚪" },
    ],
  },
  "act5": {
    id: "act5",
    name: "Survivors' Enclave",
    subtitle: "Makeshift Camp in Westmarch",
    actLabel: "Act V",
    color: "#8e44ad",
    mapUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/townmap-survivors-enclave-5f3M5QeZBokqxx6Jz4fxNg.webp",
    pois: [
      { id: "se-waypoint",   name: "Enclave Waypoint",       category: "waypoint",  x: 50, y: 50, description: "The Survivors' Enclave waypoint. Your base for all Act V runs.", tip: "Always activate first. All artisans are in the surrounding shelters.", icon: "⬟" },
      { id: "se-blacksmith", name: "Haedrig Eamon",          sublabel: "Blacksmith", category: "artisan",   x: 18, y: 32, description: "The improvised forge in the Survivors' Enclave.", tip: "Salvage items before heading into the Ruins of Corvus or Battlefields.", icon: "🔨" },
      { id: "se-jeweler",    name: "Covetous Shen",          sublabel: "Jeweler",    category: "artisan",   x: 78, y: 28, description: "The gem shelter in the Survivors' Enclave.", tip: "Combine gems between Ruins of Corvus runs.", icon: "💎" },
      { id: "se-mystic",     name: "Myriam Jahzia",          sublabel: "Mystic",     category: "artisan",   x: 82, y: 58, description: "The Mystic shelter in the Survivors' Enclave.", tip: "Enchant your weakest stat after each upgrade.", icon: "✨" },
      { id: "se-stash",      name: "Stash",                  category: "storage",   x: 42, y: 52, description: "Your stash in the Survivors' Enclave.", tip: "Keep a tab for Act V crafting materials.", icon: "📦" },
      { id: "se-gate",       name: "Gate to Westmarch",      sublabel: "Exit to Act V Zones", category: "exit",      x: 50, y: 10, description: "The main gate leading to all Act V zones.", tip: "Westmarch Commons waypoint is just outside. Ruins of Corvus is the best farming zone.", icon: "🚪" },
      { id: "se-dock",       name: "Greyhollow Island Dock", sublabel: "Optional Zone", category: "exit",      x: 82, y: 78, description: "Dock leading to Greyhollow Island.", tip: "Unique spectral enemies and good bounties. Worth visiting for bounty caches.", icon: "⛵" },
      { id: "se-bonfire",    name: "Central Bonfire",        sublabel: "Survivor Camp", category: "landmark", x: 50, y: 48, description: "The central bonfire of the Survivors' Enclave. Survivors huddle around it for warmth.", tip: "The bonfire is the navigation anchor. All artisans are within a short walk.", icon: "🔥" },
    ],
  },
};

// ─── POI category config ──────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "waypoint",  label: "Waypoints",   icon: <Navigation size={14} />, color: "#80cbc4" },
  { id: "artisan",   label: "Artisans",    icon: <Hammer size={14} />,     color: "#ffd54f" },
  { id: "storage",   label: "Stash",       icon: <Package size={14} />,    color: "#c89b3c" },
  { id: "follower",  label: "Followers",   icon: <Users size={14} />,      color: "#66bb6a" },
  { id: "npc",       label: "NPCs",        icon: <Users size={14} />,      color: "#a5d6a7" },
  { id: "exit",      label: "Exits",       icon: <ArrowRight size={14} />, color: "#ef9a9a" },
  { id: "dungeon",   label: "Dungeons",    icon: <Map size={14} />,        color: "#7eb8f7" },
  { id: "landmark",  label: "Landmarks",   icon: <Sparkles size={14} />,   color: "#ce93d8" },
];

const CATEGORY_COLORS: Record<string, string> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.color]));

// ─── POI Marker ───────────────────────────────────────────────────────────────
function PoiMarker({ poi, isSelected, onClick, scale }: {
  poi: TownPoi; isSelected: boolean; onClick: () => void; scale: number;
}) {
  const color = CATEGORY_COLORS[poi.category] || "#ffffff";
  const markerSize = Math.max(16, 24 / scale);
  const fontSize = Math.max(10, 14 / scale);

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="absolute cursor-pointer transition-all duration-150"
      style={{
        left: `${poi.x}%`, top: `${poi.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: isSelected ? 20 : 10,
      }}>
      {/* Marker pin */}
      <div className="relative flex flex-col items-center"
        style={{ filter: isSelected ? `drop-shadow(0 0 6px ${color})` : "none" }}>
        <div className="rounded-full border-2 flex items-center justify-center transition-all duration-150"
          style={{
            width: `${markerSize}px`, height: `${markerSize}px`,
            background: isSelected ? color : `${color}cc`,
            borderColor: isSelected ? "white" : color,
            boxShadow: isSelected ? `0 0 12px ${color}` : `0 0 4px ${color}88`,
            transform: isSelected ? "scale(1.3)" : "scale(1)",
          }}>
          <span style={{ fontSize: `${fontSize * 0.7}px` }}>{poi.icon}</span>
        </div>
        {/* Label */}
        <div className="absolute whitespace-nowrap rounded px-1 py-0.5"
          style={{
            top: `${markerSize + 2}px`,
            background: "rgba(5,3,8,0.88)",
            border: `1px solid ${color}66`,
            fontSize: `${Math.max(9, 11 / scale)}px`,
            color: isSelected ? color : "oklch(0.88 0.01 60)",
            fontFamily: "'Cinzel', serif",
            fontWeight: isSelected ? "bold" : "normal",
            display: isSelected || scale < 1.5 ? "block" : "none",
          }}>
          {poi.name}
        </div>
      </div>
    </div>
  );
}

// ─── Main Town Map Page ───────────────────────────────────────────────────────
export default function TownMapPage() {
  const params = useParams<{ actId: string }>();
  const [, navigate] = useLocation();
  const actId = params.actId || "act1";
  const townData = TOWN_MAPS[actId] || TOWN_MAPS["act1"];
  const ac = townData.color;

  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(
    new Set(CATEGORIES.map((c) => c.id))
  );
  const [selectedPoi, setSelectedPoi] = useState<TownPoi | null>(null);
  const [search, setSearch] = useState("");

  // Pan/zoom state
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const toggleCategory = (id: string) => {
    setEnabledCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const showAll = () => setEnabledCategories(new Set(CATEGORIES.map((c) => c.id)));
  const hideAll = () => setEnabledCategories(new Set());

  const filteredPois = useMemo(() => {
    return townData.pois.filter((p) => {
      if (!enabledCategories.has(p.category)) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.sublabel || "").toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [townData.pois, enabledCategories, search]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(4, Math.max(0.5, prev.scale * delta)),
    }));
  }, []);

  // Drag pan
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
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

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    townData.pois.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return counts;
  }, [townData.pois]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "oklch(0.07 0.008 30)" }}>

      {/* ── Left Sidebar ── */}
      <div className="w-72 flex-shrink-0 flex flex-col border-r overflow-y-auto"
        style={{ borderColor: "oklch(0.22 0.015 50)", background: "oklch(0.09 0.010 30)" }}>

        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: "oklch(0.22 0.015 50)" }}>
          <button onClick={() => navigate("/maps")}
            className="flex items-center gap-1.5 text-sm font-cinzel mb-3"
            style={{ color: "oklch(0.70 0.010 60)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = ac; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.70 0.010 60)"; }}>
            <ChevronLeft size={14} /> Maps
          </button>
          <p className="font-cinzel tracking-widest mb-0.5" style={{ color: ac, fontSize: "0.6rem" }}>{townData.actLabel.toUpperCase()}</p>
          <h1 className="font-cinzel-decorative font-black text-xl" style={{ color: "oklch(0.92 0.01 60)" }}>{townData.name}</h1>
          <p className="font-cinzel text-sm" style={{ color: "oklch(0.72 0.010 60)" }}>{townData.subtitle}</p>
        </div>

        {/* Act switcher */}
        <div className="p-3 border-b" style={{ borderColor: "oklch(0.22 0.015 50)" }}>
          <p className="font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.65 0.010 60)", fontSize: "0.55rem" }}>SWITCH HUB</p>
          <div className="grid grid-cols-5 gap-1">
            {Object.values(TOWN_MAPS).map((t) => (
              <button key={t.id} onClick={() => { navigate(`/maps/town/${t.id}`); setSelectedPoi(null); setSearch(""); }}
                className="rounded py-1.5 font-cinzel font-bold text-center transition-all"
                style={{ background: actId === t.id ? `${t.color}22` : "oklch(0.12 0.010 30)", border: `1px solid ${actId === t.id ? t.color : "oklch(0.22 0.015 50)"}`, color: actId === t.id ? t.color : "oklch(0.65 0.010 60)", fontSize: "0.55rem" }}>
                {t.actLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b" style={{ borderColor: "oklch(0.22 0.015 50)" }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded border"
            style={{ background: "oklch(0.11 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
            <Search size={13} color="oklch(0.65 0.010 60)" />
            <input
              type="text" placeholder='Search... e.g. "Blacksmith"'
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm font-cinzel outline-none"
              style={{ color: "oklch(0.88 0.01 60)", fontSize: "0.75rem" }}
            />
            {search && <button onClick={() => setSearch("")} style={{ color: "oklch(0.65 0.010 60)" }}>×</button>}
          </div>
        </div>

        {/* Show/Hide All */}
        <div className="flex gap-2 px-3 py-2 border-b" style={{ borderColor: "oklch(0.22 0.015 50)" }}>
          <button onClick={showAll}
            className="flex-1 py-1.5 rounded font-cinzel font-bold text-xs transition-all"
            style={{ background: `${ac}18`, border: `1px solid ${ac}44`, color: ac }}>
            SHOW ALL
          </button>
          <button onClick={hideAll}
            className="flex-1 py-1.5 rounded font-cinzel font-bold text-xs transition-all"
            style={{ background: "oklch(0.12 0.010 30)", border: "1px solid oklch(0.22 0.015 50)", color: "oklch(0.70 0.010 60)" }}>
            HIDE ALL
          </button>
        </div>

        {/* Category filters */}
        <div className="p-3 flex-1">
          <p className="font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.65 0.010 60)", fontSize: "0.55rem" }}>CATEGORIES</p>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              if (count === 0) return null;
              const enabled = enabledCategories.has(cat.id);
              return (
                <button key={cat.id} onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded border transition-all duration-150"
                  style={{ background: enabled ? `${cat.color}12` : "oklch(0.10 0.010 30)", borderColor: enabled ? `${cat.color}44` : "oklch(0.20 0.015 50)" }}>
                  <div style={{ color: enabled ? cat.color : "oklch(0.50 0.010 60)" }}>{cat.icon}</div>
                  <span className="font-cinzel font-bold flex-1 text-left"
                    style={{ color: enabled ? "oklch(0.88 0.01 60)" : "oklch(0.60 0.010 60)", fontSize: "0.78rem" }}>
                    {cat.label}
                  </span>
                  <span className="font-cinzel rounded px-1.5 py-0.5"
                    style={{ background: enabled ? `${cat.color}22` : "oklch(0.14 0.012 30)", color: enabled ? cat.color : "oklch(0.55 0.010 60)", fontSize: "0.65rem" }}>
                    {count}
                  </span>
                  {enabled ? <Eye size={12} color={cat.color} /> : <EyeOff size={12} color="oklch(0.45 0.010 60)" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* POI detail panel */}
        {selectedPoi && (
          <div className="border-t p-4" style={{ borderColor: "oklch(0.22 0.015 50)", background: "oklch(0.10 0.010 30)" }}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span style={{ fontSize: "1rem" }}>{selectedPoi.icon}</span>
                  <p className="font-cinzel font-bold text-sm" style={{ color: CATEGORY_COLORS[selectedPoi.category] || ac }}>
                    {selectedPoi.name}
                  </p>
                </div>
                {selectedPoi.sublabel && (
                  <p className="font-cinzel text-xs" style={{ color: "oklch(0.70 0.010 60)" }}>{selectedPoi.sublabel}</p>
                )}
              </div>
              <button onClick={() => setSelectedPoi(null)} style={{ color: "oklch(0.65 0.010 60)", fontSize: "1.2rem", lineHeight: 1 }}>×</button>
            </div>
            <p className="text-sm leading-relaxed mb-2" style={{ color: "oklch(0.80 0.010 60)" }}>{selectedPoi.description}</p>
            <div className="flex items-start gap-1.5 p-2 rounded" style={{ background: "oklch(0.12 0.010 30)" }}>
              <span style={{ color: "#ffd54f", fontSize: "0.8rem" }}>★</span>
              <p className="text-sm" style={{ color: "oklch(0.82 0.010 60)" }}>{selectedPoi.tip}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Map Canvas ── */}
      <div className="flex-1 relative overflow-hidden" ref={containerRef}
        style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={() => setSelectedPoi(null)}>

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-30">
          <button onClick={() => setTransform((p) => ({ ...p, scale: Math.min(4, p.scale * 1.25) }))}
            className="w-9 h-9 rounded border flex items-center justify-center font-bold text-lg"
            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.28 0.015 50)", color: "oklch(0.80 0.010 60)" }}>+</button>
          <button onClick={() => setTransform((p) => ({ ...p, scale: Math.max(0.5, p.scale * 0.8) }))}
            className="w-9 h-9 rounded border flex items-center justify-center font-bold text-lg"
            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.28 0.015 50)", color: "oklch(0.80 0.010 60)" }}>−</button>
          <button onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}
            className="w-9 h-9 rounded border flex items-center justify-center text-xs font-cinzel"
            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.28 0.015 50)", color: "oklch(0.70 0.010 60)" }}>⊡</button>
        </div>

        {/* Zoom level */}
        <div className="absolute bottom-4 left-4 z-30 px-2 py-1 rounded"
          style={{ background: "rgba(5,3,8,0.7)", border: "1px solid oklch(0.22 0.015 50)" }}>
          <p className="font-cinzel text-xs" style={{ color: "oklch(0.70 0.010 60)" }}>{Math.round(transform.scale * 100)}%</p>
        </div>

        {/* Transformable map container */}
        <div style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: "center center",
          transition: isDragging.current ? "none" : "transform 0.1s ease-out",
          width: "100%", height: "100%",
          position: "absolute", inset: 0,
        }}>
          {/* Map image */}
          <img
            src={townData.mapUrl}
            alt={townData.name}
            className="w-full h-full object-contain"
            draggable={false}
            style={{ userSelect: "none" }}
          />

          {/* POI markers */}
          <div className="absolute inset-0">
            {filteredPois.map((poi) => (
              <PoiMarker
                key={poi.id}
                poi={poi}
                isSelected={selectedPoi?.id === poi.id}
                onClick={() => setSelectedPoi(selectedPoi?.id === poi.id ? null : poi)}
                scale={transform.scale}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
