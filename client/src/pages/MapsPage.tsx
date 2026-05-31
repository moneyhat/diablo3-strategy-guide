// Sanctuary Grimoire — Maps: World Map First, Zone Details on Click
// The Sanctuary world map is the primary visual. Click an Act to drill down.
// Any player can orient themselves instantly. No frills, no assumptions.
import { useState } from "react";
import { ChevronLeft, Star, Sword, Package, Key, Navigation, Map, Home, ChevronRight } from "lucide-react";
import { ALL_ACT_GIS_DATA, ALL_TOWN_GIS_DATA } from "@/data/gisMapData";

// ─── World map CDN URL ────────────────────────────────────────────────────────
const WORLD_MAP_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/sanctuary-world-map-JPf8CtQMRn8YUQVJ7WWcuA.webp";

// ─── Act config with approximate click regions on the world map ───────────────
// Positions are percentage-based on the 16:9 world map image
const ACTS = [
  {
    id: "act1", label: "Act I", subtitle: "Khanduras",
    color: "#8b0000", hub: "New Tristram", hubId: "act1-town",
    // Approximate region center on the world map image
    mapX: 18, mapY: 42,
    description: "The fallen star has struck Tristram. Undead overrun the countryside. The Skeleton King has risen.",
    boss: "The Butcher", keywarden: "Odeg", topFarm: "Fields of Misery",
  },
  {
    id: "act2", label: "Act II", subtitle: "Caldeum",
    color: "#c8860a", hub: "Hidden Camp", hubId: "act2-town",
    mapX: 50, mapY: 48,
    description: "The city of Caldeum is under siege. Belial, Lord of Lies, pulls the strings from the shadows.",
    boss: "Belial", keywarden: "Sokahr", topFarm: "Dahlgur Oasis",
  },
  {
    id: "act3", label: "Act III", subtitle: "Mount Arreat",
    color: "#c0392b", hub: "Bastion's Keep", hubId: "act3-town",
    mapX: 78, mapY: 38,
    description: "Azmodan's armies lay siege to the last human stronghold. The gates of Arreat must hold.",
    boss: "Azmodan", keywarden: "Xah'Rith", topFarm: "Keep Depths / Rakkis Crossing",
  },
  {
    id: "act4", label: "Act IV", subtitle: "High Heavens",
    color: "#5b9bd5", hub: "Diamond Gates", hubId: "act4-town",
    mapX: 50, mapY: 14,
    description: "The High Heavens are under siege. Diablo, empowered by all seven Great Evils, storms the Silver Spire.",
    boss: "Diablo", keywarden: "Nekarat", topFarm: "Silver Spire",
  },
  {
    id: "act5", label: "Act V", subtitle: "Westmarch",
    color: "#8e44ad", hub: "Survivors' Enclave", hubId: "act5-town",
    mapX: 50, mapY: 78,
    description: "Westmarch has fallen to Malthael, the Angel of Death. The last survivors fight for their lives.",
    boss: "Malthael", keywarden: "None", topFarm: "Ruins of Corvus / Battlefields",
  },
];

// ─── Zone type colors ─────────────────────────────────────────────────────────
const ZONE_TYPE_COLORS: Record<string, string> = {
  town: "#d4a843", outdoor: "#66bb6a", dungeon: "#7eb8f7",
  "boss-arena": "#ff7043", special: "#ce93d8", transition: "#9e9e9e",
};

// ─── Farming stars ────────────────────────────────────────────────────────────
function FarmStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} size={10} fill={i <= rating ? "#ffd54f" : "transparent"}
          style={{ color: i <= rating ? "#ffd54f" : "oklch(0.28 0.010 60)" }} />
      ))}
    </div>
  );
}

// ─── Zone detail panel ────────────────────────────────────────────────────────
function ZoneDetail({ zoneId, mapId, onBack, accentColor }: {
  zoneId: string; mapId: string; onBack: () => void; accentColor: string;
}) {
  const actData = ALL_ACT_GIS_DATA[mapId] || ALL_TOWN_GIS_DATA[mapId];
  const zone = actData?.zones.find((z) => z.id === zoneId);
  const pois = actData?.pois.filter((p) => p.zoneId === zoneId) || [];
  if (!zone) return null;

  const tc = ZONE_TYPE_COLORS[zone.type] || accentColor;
  const bosses = pois.filter((p) => p.type === "boss" || p.type === "keywarden");
  const loot = pois.filter((p) => p.type === "chest" || p.type === "goblin");
  const elites = pois.filter((p) => p.type === "elite");
  const waypoints = pois.filter((p) => p.type === "waypoint");
  const npcs = pois.filter((p) => p.type === "npc");

  return (
    <div>
      <button onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-cinzel mb-4"
        style={{ color: "oklch(0.50 0.010 60)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = accentColor; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.50 0.010 60)"; }}>
        <ChevronLeft size={13} /> Back
      </button>

      <div className="p-4 rounded border mb-4" style={{ background: `${tc}08`, borderColor: `${tc}33` }}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="font-cinzel-decorative font-black text-xl" style={{ color: tc }}>{zone.name}</h2>
              <span className="text-xs px-2 py-0.5 rounded-sm capitalize font-cinzel"
                style={{ background: `${tc}18`, color: tc, border: `1px solid ${tc}33`, fontSize: "0.58rem" }}>
                {zone.type.replace("-"," ")}
              </span>
              {zone.level && <span className="text-xs font-cinzel" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.58rem" }}>Lv {zone.level}</span>}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "oklch(0.62 0.010 60)" }}>{zone.description}</p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <FarmStars rating={zone.farmingRating} />
            <span className="font-cinzel" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.52rem" }}>FARM RATING</span>
          </div>
        </div>
        {zone.monsterTypes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {zone.monsterTypes.map((m) => (
              <span key={m} className="text-xs px-2 py-0.5 rounded-sm font-cinzel"
                style={{ background: "oklch(0.12 0.010 30)", color: "oklch(0.50 0.010 60)", border: "1px solid oklch(0.18 0.012 30)", fontSize: "0.55rem" }}>
                {m}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 p-3 rounded border mb-4"
        style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
        <Star size={12} color="#ffd54f" className="flex-shrink-0 mt-0.5" />
        <p className="text-sm" style={{ color: "oklch(0.72 0.010 60)" }}>{zone.farmingTip}</p>
      </div>

      <div className="space-y-3">
        {waypoints.length > 0 && (
          <div>
            <p className="font-cinzel tracking-widest mb-2" style={{ color: "#80cbc4", fontSize: "0.55rem" }}>⬟ WAYPOINTS</p>
            {waypoints.map((p) => (
              <div key={p.id} className="flex items-start gap-2 p-2.5 rounded mb-1.5"
                style={{ background: "oklch(0.10 0.010 30)", border: "1px solid oklch(0.20 0.015 50)" }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: "#80cbc4" }} />
                <div>
                  <p className="font-cinzel font-bold text-xs" style={{ color: "oklch(0.82 0.01 60)" }}>{p.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "oklch(0.52 0.010 60)", fontSize: "0.6rem" }}>{p.details.tip}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {bosses.length > 0 && (
          <div>
            <p className="font-cinzel tracking-widest mb-2" style={{ color: "#ff7043", fontSize: "0.55rem" }}>☠ BOSSES & KEYWARDENS</p>
            {bosses.map((p) => (
              <div key={p.id} className="p-2.5 rounded mb-1.5"
                style={{ background: "oklch(0.10 0.010 30)", border: "1px solid #ff704322" }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.type === "keywarden" ? "#ce93d8" : "#ff7043" }} />
                  <p className="font-cinzel font-bold text-xs" style={{ color: p.type === "keywarden" ? "#ce93d8" : "#ff7043" }}>{p.name}</p>
                </div>
                {p.details.drops && <p className="text-xs" style={{ color: "#ffd54f", fontSize: "0.58rem" }}>Drops: {p.details.drops}</p>}
                <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.010 60)", fontSize: "0.6rem" }}>{p.details.tip}</p>
              </div>
            ))}
          </div>
        )}
        {elites.length > 0 && (
          <div>
            <p className="font-cinzel tracking-widest mb-2" style={{ color: "#ef5350", fontSize: "0.55rem" }}>⚔ ELITE SPAWNS ({elites.length})</p>
            <div className="grid grid-cols-2 gap-1.5">
              {elites.map((p) => (
                <div key={p.id} className="p-2 rounded" style={{ background: "oklch(0.10 0.010 30)", border: "1px solid oklch(0.20 0.015 50)" }}>
                  <p className="font-cinzel text-xs" style={{ color: "oklch(0.65 0.010 60)", fontSize: "0.58rem" }}>{p.sublabel || p.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {loot.length > 0 && (
          <div>
            <p className="font-cinzel tracking-widest mb-2" style={{ color: "#ffd54f", fontSize: "0.55rem" }}>◈ LOOT SOURCES</p>
            {loot.map((p) => (
              <div key={p.id} className="flex items-start gap-2 p-2.5 rounded mb-1.5"
                style={{ background: "oklch(0.10 0.010 30)", border: "1px solid #ffd54f22" }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: p.type === "goblin" ? "#66bb6a" : "#ffd54f" }} />
                <div>
                  <p className="font-cinzel font-bold text-xs" style={{ color: "oklch(0.82 0.01 60)" }}>{p.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "oklch(0.52 0.010 60)", fontSize: "0.6rem" }}>{p.details.tip}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {npcs.length > 0 && (
          <div>
            <p className="font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.55 0.010 60)", fontSize: "0.55rem" }}>👤 NPCS & ARTISANS</p>
            <div className="grid grid-cols-2 gap-1.5">
              {npcs.map((p) => (
                <div key={p.id} className="p-2 rounded" style={{ background: "oklch(0.10 0.010 30)", border: "1px solid oklch(0.20 0.015 50)" }}>
                  <p className="font-cinzel font-bold text-xs" style={{ color: "oklch(0.78 0.01 60)", fontSize: "0.6rem" }}>{p.name}</p>
                  <p className="text-xs" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.52rem" }}>{p.sublabel}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Act detail panel ─────────────────────────────────────────────────────────
function ActDetail({ act, onBack, onSelectZone }: {
  act: typeof ACTS[0]; onBack: () => void;
  onSelectZone: (zoneId: string, mapId: string) => void;
}) {
  const [viewMode, setViewMode] = useState<"zones" | "town">("zones");
  const actData = ALL_ACT_GIS_DATA[act.id];
  const townData = ALL_TOWN_GIS_DATA[`${act.id}-town`];
  const ac = act.color;

  const sortedZones = actData ? [...actData.zones].sort((a, b) => {
    if (a.type === "town" && b.type !== "town") return -1;
    if (b.type === "town" && a.type !== "town") return 1;
    return b.farmingRating - a.farmingRating;
  }) : [];

  return (
    <div>
      <button onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-cinzel mb-4"
        style={{ color: "oklch(0.50 0.010 60)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = ac; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.50 0.010 60)"; }}>
        <ChevronLeft size={13} /> World Map
      </button>

      {/* Act header */}
      <div className="p-4 rounded border mb-4" style={{ background: `${ac}08`, borderColor: `${ac}33` }}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <p className="font-cinzel tracking-widest mb-0.5" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>ACT</p>
            <h2 className="font-cinzel-decorative font-black text-2xl mb-0.5" style={{ color: ac }}>{act.label}</h2>
            <p className="font-cinzel font-bold text-sm mb-2" style={{ color: "oklch(0.65 0.010 60)" }}>{act.subtitle}</p>
            <p className="text-sm leading-relaxed" style={{ color: "oklch(0.60 0.010 60)" }}>{act.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="p-2 rounded" style={{ background: "oklch(0.12 0.010 30)" }}>
            <p className="font-cinzel" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.5rem" }}>FINAL BOSS</p>
            <p className="font-cinzel font-bold text-xs mt-0.5" style={{ color: "#ff7043" }}>{act.boss}</p>
          </div>
          <div className="p-2 rounded" style={{ background: "oklch(0.12 0.010 30)" }}>
            <p className="font-cinzel" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.5rem" }}>KEYWARDEN</p>
            <p className="font-cinzel font-bold text-xs mt-0.5" style={{ color: "#ce93d8" }}>{act.keywarden}</p>
          </div>
          <div className="p-2 rounded" style={{ background: "oklch(0.12 0.010 30)" }}>
            <p className="font-cinzel" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.5rem" }}>TOP FARM</p>
            <p className="font-cinzel font-bold text-xs mt-0.5" style={{ color: "#ffd54f" }}>{act.topFarm}</p>
          </div>
        </div>
      </div>

      {/* Act image */}
      <div className="rounded border overflow-hidden mb-4" style={{ borderColor: `${ac}33`, aspectRatio: "16/7" }}>
        <img
          src={actData?.parchmentImage}
          alt={act.label}
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.85)" }}
        />
      </div>

      {/* View toggle */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setViewMode("zones")}
          className="flex items-center gap-1.5 px-4 py-2 rounded border font-cinzel font-bold text-xs transition-all"
          style={{ background: viewMode === "zones" ? `${ac}18` : "oklch(0.10 0.010 30)", borderColor: viewMode === "zones" ? ac : "oklch(0.22 0.015 50)", color: viewMode === "zones" ? ac : "oklch(0.50 0.010 60)" }}>
          <Map size={12} /> All Zones
        </button>
        <button onClick={() => setViewMode("town")}
          className="flex items-center gap-1.5 px-4 py-2 rounded border font-cinzel font-bold text-xs transition-all"
          style={{ background: viewMode === "town" ? `${ac}18` : "oklch(0.10 0.010 30)", borderColor: viewMode === "town" ? ac : "oklch(0.22 0.015 50)", color: viewMode === "town" ? ac : "oklch(0.50 0.010 60)" }}>
          <Home size={12} /> {act.hub}
        </button>
      </div>

      {/* Zone list */}
      <div className="space-y-2">
        {viewMode === "zones" && sortedZones.map((zone) => {
          const tc = ZONE_TYPE_COLORS[zone.type] || ac;
          const hasBoss = actData?.pois.some((p) => (p.type === "boss" || p.type === "keywarden") && p.zoneId === zone.id);
          const hasChest = actData?.pois.some((p) => p.type === "chest" && p.zoneId === zone.id);
          const hasWp = actData?.pois.some((p) => p.type === "waypoint" && p.zoneId === zone.id);
          return (
            <button key={zone.id} onClick={() => onSelectZone(zone.id, act.id)}
              className="w-full flex items-center gap-3 p-3 rounded border text-left transition-all duration-150 group"
              style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${tc}55`; (e.currentTarget as HTMLButtonElement).style.background = `${tc}08`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.22 0.015 50)"; (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.10 0.010 30)"; }}>
              <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: tc }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.88 0.01 60)" }}>{zone.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-sm font-cinzel capitalize"
                    style={{ background: `${tc}18`, color: tc, border: `1px solid ${tc}33`, fontSize: "0.52rem" }}>
                    {zone.type.replace("-"," ")}
                  </span>
                  {zone.level && <span className="text-xs font-cinzel" style={{ color: "oklch(0.42 0.010 60)", fontSize: "0.52rem" }}>Lv {zone.level}</span>}
                </div>
                <div className="flex items-center gap-3">
                  <FarmStars rating={zone.farmingRating} />
                  <div className="flex items-center gap-1.5">
                    {hasWp && <span title="Waypoint" style={{ color: "#80cbc4", fontSize: "10px" }}>⬟</span>}
                    {hasBoss && <span title="Boss" style={{ color: "#ff7043", fontSize: "10px" }}>☠</span>}
                    {hasChest && <span title="Chest" style={{ color: "#ffd54f", fontSize: "10px" }}>◈</span>}
                  </div>
                </div>
              </div>
              <ChevronRight size={14} color="oklch(0.35 0.010 60)" className="flex-shrink-0" />
            </button>
          );
        })}
        {viewMode === "town" && townData && townData.zones.map((zone) => {
          const tc = ZONE_TYPE_COLORS[zone.type] || ac;
          const poiCount = townData.pois.filter((p) => p.zoneId === zone.id).length;
          return (
            <button key={zone.id} onClick={() => onSelectZone(zone.id, `${act.id}-town`)}
              className="w-full flex items-center gap-3 p-3 rounded border text-left transition-all duration-150 group"
              style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${tc}55`; (e.currentTarget as HTMLButtonElement).style.background = `${tc}08`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.22 0.015 50)"; (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.10 0.010 30)"; }}>
              <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: tc }} />
              <div className="flex-1 min-w-0">
                <span className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.88 0.01 60)" }}>{zone.name}</span>
                {poiCount > 0 && <p className="text-xs mt-0.5 font-cinzel" style={{ color: "oklch(0.42 0.010 60)", fontSize: "0.52rem" }}>{poiCount} locations</p>}
              </div>
              <ChevronRight size={14} color="oklch(0.35 0.010 60)" className="flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── World Map with clickable Act labels ──────────────────────────────────────
function WorldMapView({ onSelectAct }: { onSelectAct: (actId: string) => void }) {
  const [hoveredAct, setHoveredAct] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-4">
        <p className="font-cinzel tracking-widest mb-1" style={{ color: "oklch(0.72 0.18 55)", fontSize: "0.6rem", letterSpacing: "0.2em" }}>SANCTUARY</p>
        <h1 className="font-cinzel-decorative font-black text-3xl mb-1" style={{ color: "oklch(0.88 0.01 60)" }}>World Map</h1>
        <p className="text-sm" style={{ color: "oklch(0.48 0.010 60)", fontFamily: "'Cinzel', serif" }}>
          Click any Act to explore zones, bosses, loot, and farming routes.
        </p>
      </div>

      {/* World map image with clickable overlay */}
      <div className="relative rounded border overflow-hidden mb-5"
        style={{ borderColor: "oklch(0.72 0.18 55 / 0.25)", aspectRatio: "16/9" }}>
        <img src={WORLD_MAP_URL} alt="Sanctuary World Map"
          className="w-full h-full object-cover" />

        {/* Clickable Act hotspots */}
        {ACTS.map((act) => {
          const isHovered = hoveredAct === act.id;
          return (
            <button
              key={act.id}
              onClick={() => onSelectAct(act.id)}
              onMouseEnter={() => setHoveredAct(act.id)}
              onMouseLeave={() => setHoveredAct(null)}
              className="absolute flex flex-col items-center gap-1 transition-all duration-200"
              style={{
                left: `${act.mapX}%`, top: `${act.mapY}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}>
              {/* Pulse ring */}
              <div className="relative">
                <div className="rounded-full transition-all duration-200"
                  style={{
                    width: isHovered ? "20px" : "14px",
                    height: isHovered ? "20px" : "14px",
                    background: act.color,
                    boxShadow: isHovered ? `0 0 20px ${act.color}cc, 0 0 40px ${act.color}66` : `0 0 8px ${act.color}88`,
                    border: `2px solid ${act.color}`,
                  }} />
                {isHovered && (
                  <div className="absolute inset-0 rounded-full animate-ping"
                    style={{ background: act.color, opacity: 0.4 }} />
                )}
              </div>
              {/* Label */}
              <div className="px-2 py-1 rounded transition-all duration-200 whitespace-nowrap"
                style={{
                  background: isHovered ? `${act.color}ee` : "rgba(5,3,8,0.82)",
                  border: `1px solid ${act.color}${isHovered ? "ff" : "88"}`,
                  backdropFilter: "blur(4px)",
                  boxShadow: isHovered ? `0 0 12px ${act.color}66` : "none",
                }}>
                <p className="font-cinzel font-bold" style={{ color: isHovered ? "oklch(0.08 0 0)" : act.color, fontSize: "0.6rem" }}>{act.label}</p>
                {isHovered && <p className="font-cinzel text-center" style={{ color: "rgba(5,3,8,0.8)", fontSize: "0.5rem" }}>{act.subtitle}</p>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Act quick-select cards below the map */}
      <div className="grid grid-cols-5 gap-2">
        {ACTS.map((act) => (
          <button key={act.id} onClick={() => onSelectAct(act.id)}
            className="flex flex-col items-center gap-1.5 p-3 rounded border transition-all duration-200"
            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${act.color}66`; (e.currentTarget as HTMLButtonElement).style.background = `${act.color}10`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.22 0.015 50)"; (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.10 0.010 30)"; }}>
            <div className="w-3 h-3 rounded-full" style={{ background: act.color, boxShadow: `0 0 6px ${act.color}66` }} />
            <p className="font-cinzel font-bold text-center" style={{ color: act.color, fontSize: "0.62rem" }}>{act.label}</p>
            <p className="font-cinzel text-center" style={{ color: "oklch(0.42 0.010 60)", fontSize: "0.5rem" }}>{act.subtitle}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Maps Page ───────────────────────────────────────────────────────────
export default function MapsPage() {
  const [view, setView] = useState<"world" | "act" | "zone">("world");
  const [selectedActId, setSelectedActId] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);

  const selectedAct = ACTS.find((a) => a.id === selectedActId);

  const handleSelectAct = (actId: string) => {
    setSelectedActId(actId);
    setSelectedZoneId(null);
    setView("act");
  };

  const handleSelectZone = (zoneId: string, mapId: string) => {
    setSelectedZoneId(zoneId);
    setSelectedMapId(mapId);
    setView("zone");
  };

  const handleBackToAct = () => {
    setSelectedZoneId(null);
    setView("act");
  };

  const handleBackToWorld = () => {
    setSelectedActId(null);
    setView("world");
  };

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,0,0,0.06) 0%, oklch(0.07 0.008 30) 55%)" }}>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {view === "world" && <WorldMapView onSelectAct={handleSelectAct} />}
        {view === "act" && selectedAct && (
          <ActDetail act={selectedAct} onBack={handleBackToWorld} onSelectZone={handleSelectZone} />
        )}
        {view === "zone" && selectedZoneId && selectedMapId && selectedAct && (
          <ZoneDetail zoneId={selectedZoneId} mapId={selectedMapId} onBack={handleBackToAct} accentColor={selectedAct.color} />
        )}
      </div>
    </div>
  );
}
