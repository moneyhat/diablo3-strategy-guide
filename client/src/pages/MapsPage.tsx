// Sanctuary Grimoire — Maps: Clean Visual Quick Reference
// Starts in New Tristram. Click a zone to navigate. No frills, no assumptions.
// Players know the game. This is a fast reference tool.
import { useState } from "react";
import { ChevronRight, ChevronLeft, Star, Sword, Package, Key, Navigation, Map, Home } from "lucide-react";
import { ALL_ACT_GIS_DATA, ALL_TOWN_GIS_DATA } from "@/data/gisMapData";

// ─── Act config ───────────────────────────────────────────────────────────────
const ACTS = [
  { id: "act1", label: "Act I",   subtitle: "Khanduras",     color: "#8b0000",  hub: "New Tristram",           hubId: "act1-town" },
  { id: "act2", label: "Act II",  subtitle: "Caldeum",       color: "#c8860a",  hub: "Hidden Camp",            hubId: "act2-town" },
  { id: "act3", label: "Act III", subtitle: "Arreat",        color: "#c0392b",  hub: "Bastion's Keep",         hubId: "act3-town" },
  { id: "act4", label: "Act IV",  subtitle: "High Heavens",  color: "#5b9bd5",  hub: "Diamond Gates",          hubId: "act4-town" },
  { id: "act5", label: "Act V",   subtitle: "Westmarch",     color: "#8e44ad",  hub: "Survivors' Enclave",     hubId: "act5-town" },
];

// ─── Zone type badge colors ───────────────────────────────────────────────────
const ZONE_TYPE_COLORS: Record<string, string> = {
  town:         "#d4a843",
  outdoor:      "#66bb6a",
  dungeon:      "#7eb8f7",
  "boss-arena": "#ff7043",
  special:      "#ce93d8",
  transition:   "#9e9e9e",
};

const ZONE_TYPE_LABELS: Record<string, string> = {
  town:         "Town",
  outdoor:      "Outdoor",
  dungeon:      "Dungeon",
  "boss-arena": "Boss Arena",
  special:      "Special",
  transition:   "Transition",
};

// ─── Farming star rating ──────────────────────────────────────────────────────
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
function ZoneDetail({ zoneId, actId, onBack, accentColor }: {
  zoneId: string; actId: string; onBack: () => void; accentColor: string;
}) {
  // Check both act and town data
  const actData = ALL_ACT_GIS_DATA[actId] || ALL_TOWN_GIS_DATA[actId];
  const zone = actData?.zones.find((z) => z.id === zoneId);
  const pois = actData?.pois.filter((p) => p.zoneId === zoneId) || [];
  if (!zone) return null;

  const tc = ZONE_TYPE_COLORS[zone.type] || accentColor;

  // Group POIs by type
  const waypoints = pois.filter((p) => p.type === "waypoint");
  const bosses = pois.filter((p) => p.type === "boss" || p.type === "keywarden");
  const loot = pois.filter((p) => p.type === "chest" || p.type === "goblin");
  const elites = pois.filter((p) => p.type === "elite");
  const npcs = pois.filter((p) => p.type === "npc");
  const exits = pois.filter((p) => p.type === "exit" || p.type === "entry" || p.type === "dungeon-entrance");

  return (
    <div className="h-full flex flex-col">
      {/* Back button */}
      <button onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-cinzel mb-4 transition-colors"
        style={{ color: "oklch(0.50 0.010 60)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = accentColor; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.50 0.010 60)"; }}>
        <ChevronLeft size={13} /> Back to Zone List
      </button>

      {/* Zone header */}
      <div className="p-4 rounded border mb-4" style={{ background: `${tc}08`, borderColor: `${tc}33` }}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="font-cinzel-decorative font-black text-xl" style={{ color: tc }}>{zone.name}</h2>
              <span className="text-xs px-2 py-0.5 rounded-sm capitalize font-cinzel"
                style={{ background: `${tc}18`, color: tc, border: `1px solid ${tc}33`, fontSize: "0.58rem" }}>
                {ZONE_TYPE_LABELS[zone.type] || zone.type}
              </span>
              {zone.level && (
                <span className="text-xs px-2 py-0.5 rounded-sm font-cinzel"
                  style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.55 0.010 60)", border: "1px solid oklch(0.20 0.012 30)", fontSize: "0.58rem" }}>
                  Lv {zone.level}
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "oklch(0.62 0.010 60)" }}>{zone.description}</p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <FarmStars rating={zone.farmingRating} />
            <span className="font-cinzel" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.52rem" }}>FARM RATING</span>
          </div>
        </div>

        {/* Monster types */}
        {zone.monsterTypes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {zone.monsterTypes.map((m) => (
              <span key={m} className="text-xs px-2 py-0.5 rounded-sm font-cinzel"
                style={{ background: "oklch(0.12 0.010 30)", color: "oklch(0.50 0.010 60)", border: "1px solid oklch(0.18 0.012 30)", fontSize: "0.55rem" }}>
                {m}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Farming tip */}
      <div className="flex items-start gap-2 p-3 rounded border mb-4"
        style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
        <Star size={12} color="#ffd54f" className="flex-shrink-0 mt-0.5" />
        <p className="text-sm" style={{ color: "oklch(0.72 0.010 60)" }}>{zone.farmingTip}</p>
      </div>

      {/* POI sections */}
      <div className="space-y-3 flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>

        {waypoints.length > 0 && (
          <div>
            <p className="font-cinzel tracking-widest mb-2 flex items-center gap-1.5"
              style={{ color: "#80cbc4", fontSize: "0.55rem" }}>
              <Navigation size={10} /> WAYPOINTS
            </p>
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
            <p className="font-cinzel tracking-widest mb-2 flex items-center gap-1.5"
              style={{ color: "#ff7043", fontSize: "0.55rem" }}>
              <Sword size={10} /> BOSSES & KEYWARDENS
            </p>
            {bosses.map((p) => (
              <div key={p.id} className="p-2.5 rounded mb-1.5"
                style={{ background: "oklch(0.10 0.010 30)", border: "1px solid #ff704322" }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.type === "keywarden" ? "#ce93d8" : "#ff7043" }} />
                  <p className="font-cinzel font-bold text-xs" style={{ color: p.type === "keywarden" ? "#ce93d8" : "#ff7043" }}>{p.name}</p>
                  {p.sublabel && <span className="text-xs" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.55rem" }}>{p.sublabel}</span>}
                </div>
                {p.details.drops && (
                  <p className="text-xs" style={{ color: "#ffd54f", fontSize: "0.58rem" }}>Drops: {p.details.drops}</p>
                )}
                <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.010 60)", fontSize: "0.6rem" }}>{p.details.tip}</p>
              </div>
            ))}
          </div>
        )}

        {elites.length > 0 && (
          <div>
            <p className="font-cinzel tracking-widest mb-2 flex items-center gap-1.5"
              style={{ color: "#ef5350", fontSize: "0.55rem" }}>
              ⚔ ELITE SPAWNS ({elites.length})
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {elites.map((p) => (
                <div key={p.id} className="p-2 rounded"
                  style={{ background: "oklch(0.10 0.010 30)", border: "1px solid oklch(0.20 0.015 50)" }}>
                  <p className="font-cinzel text-xs" style={{ color: "oklch(0.65 0.010 60)", fontSize: "0.58rem" }}>{p.sublabel || p.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {loot.length > 0 && (
          <div>
            <p className="font-cinzel tracking-widest mb-2 flex items-center gap-1.5"
              style={{ color: "#ffd54f", fontSize: "0.55rem" }}>
              <Package size={10} /> LOOT SOURCES
            </p>
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
            <p className="font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.55 0.010 60)", fontSize: "0.55rem" }}>
              👤 NPCS & ARTISANS
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {npcs.map((p) => (
                <div key={p.id} className="p-2 rounded"
                  style={{ background: "oklch(0.10 0.010 30)", border: "1px solid oklch(0.20 0.015 50)" }}>
                  <p className="font-cinzel font-bold text-xs" style={{ color: "oklch(0.78 0.01 60)", fontSize: "0.6rem" }}>{p.name}</p>
                  <p className="text-xs" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.52rem" }}>{p.sublabel}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {exits.length > 0 && (
          <div>
            <p className="font-cinzel tracking-widest mb-2" style={{ color: "#a5d6a7", fontSize: "0.55rem" }}>
              🚪 CONNECTIONS
            </p>
            <div className="flex flex-wrap gap-1.5">
              {exits.map((p) => (
                <div key={p.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded"
                  style={{ background: "oklch(0.10 0.010 30)", border: "1px solid oklch(0.20 0.015 50)" }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.type === "exit" ? "#ef9a9a" : "#a5d6a7" }} />
                  <span className="font-cinzel text-xs" style={{ color: "oklch(0.65 0.010 60)", fontSize: "0.58rem" }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Zone list for an Act ─────────────────────────────────────────────────────
function ZoneList({ actId, onSelectZone, accentColor }: {
  actId: string; onSelectZone: (zoneId: string) => void; accentColor: string;
}) {
  const actData = ALL_ACT_GIS_DATA[actId];
  if (!actData) return null;

  // Sort: towns first, then by farming rating desc
  const sorted = [...actData.zones].sort((a, b) => {
    if (a.type === "town" && b.type !== "town") return -1;
    if (b.type === "town" && a.type !== "town") return 1;
    return b.farmingRating - a.farmingRating;
  });

  return (
    <div className="space-y-2">
      {sorted.map((zone) => {
        const tc = ZONE_TYPE_COLORS[zone.type] || accentColor;
        const poiCount = actData.pois.filter((p) => p.zoneId === zone.id).length;
        const hasBoss = actData.pois.some((p) => (p.type === "boss" || p.type === "keywarden") && p.zoneId === zone.id);
        const hasChest = actData.pois.some((p) => p.type === "chest" && p.zoneId === zone.id);
        const hasWp = actData.pois.some((p) => p.type === "waypoint" && p.zoneId === zone.id);

        return (
          <button key={zone.id} onClick={() => onSelectZone(zone.id)}
            className="w-full flex items-center gap-3 p-3 rounded border text-left transition-all duration-150 group"
            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = `${tc}55`;
              (e.currentTarget as HTMLButtonElement).style.background = `${tc}08`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.22 0.015 50)";
              (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.10 0.010 30)";
            }}>
            {/* Color bar */}
            <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: tc }} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.88 0.01 60)" }}>{zone.name}</span>
                <span className="text-xs px-1.5 py-0.5 rounded-sm font-cinzel capitalize"
                  style={{ background: `${tc}18`, color: tc, border: `1px solid ${tc}33`, fontSize: "0.52rem" }}>
                  {ZONE_TYPE_LABELS[zone.type] || zone.type}
                </span>
                {zone.level && (
                  <span className="text-xs font-cinzel" style={{ color: "oklch(0.42 0.010 60)", fontSize: "0.52rem" }}>Lv {zone.level}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <FarmStars rating={zone.farmingRating} />
                <div className="flex items-center gap-1.5">
                  {hasWp && <span title="Waypoint" style={{ color: "#80cbc4", fontSize: "10px" }}>⬟</span>}
                  {hasBoss && <span title="Boss" style={{ color: "#ff7043", fontSize: "10px" }}>☠</span>}
                  {hasChest && <span title="Chest" style={{ color: "#ffd54f", fontSize: "10px" }}>◈</span>}
                  {poiCount > 0 && <span className="font-cinzel" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.5rem" }}>{poiCount} POIs</span>}
                </div>
              </div>
            </div>

            <ChevronRight size={14} color="oklch(0.35 0.010 60)" className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>
        );
      })}
    </div>
  );
}

// ─── Town Hub list ────────────────────────────────────────────────────────────
function TownList({ actId, onSelectZone, accentColor }: {
  actId: string; onSelectZone: (zoneId: string, mapId: string) => void; accentColor: string;
}) {
  const townId = `${actId}-town`;
  const townData = ALL_TOWN_GIS_DATA[townId];
  if (!townData) return null;

  return (
    <div className="space-y-2">
      {townData.zones.map((zone) => {
        const tc = ZONE_TYPE_COLORS[zone.type] || accentColor;
        const poiCount = townData.pois.filter((p) => p.zoneId === zone.id).length;

        return (
          <button key={zone.id} onClick={() => onSelectZone(zone.id, townId)}
            className="w-full flex items-center gap-3 p-3 rounded border text-left transition-all duration-150 group"
            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = `${tc}55`;
              (e.currentTarget as HTMLButtonElement).style.background = `${tc}08`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.22 0.015 50)";
              (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.10 0.010 30)";
            }}>
            <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: tc }} />
            <div className="flex-1 min-w-0">
              <span className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.88 0.01 60)" }}>{zone.name}</span>
              {poiCount > 0 && (
                <p className="text-xs mt-0.5 font-cinzel" style={{ color: "oklch(0.42 0.010 60)", fontSize: "0.52rem" }}>{poiCount} locations</p>
              )}
            </div>
            <ChevronRight size={14} color="oklch(0.35 0.010 60)" className="flex-shrink-0" />
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Maps Page ───────────────────────────────────────────────────────────
export default function MapsPage() {
  const [activeActId, setActiveActId] = useState("act1");
  const [activeMapId, setActiveMapId] = useState("act1"); // can be "act1" or "act1-town"
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"zones" | "town">("town"); // start in town hub

  const act = ACTS.find((a) => a.id === activeActId)!;
  const ac = act.color;

  const handleActChange = (id: string) => {
    setActiveActId(id);
    setActiveMapId(id);
    setSelectedZoneId(null);
    setViewMode("town"); // always start in town when switching acts
  };

  const handleSelectZone = (zoneId: string, mapId?: string) => {
    setSelectedZoneId(zoneId);
    if (mapId) setActiveMapId(mapId);
    else setActiveMapId(activeActId);
  };

  const handleBack = () => {
    setSelectedZoneId(null);
  };

  return (
    <div className="min-h-screen" style={{ background: `radial-gradient(ellipse at 50% 0%, ${ac}06 0%, oklch(0.07 0.008 30) 55%)` }}>
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* ── Page header ── */}
        <div className="mb-5">
          <p className="font-cinzel tracking-widest mb-1" style={{ color: "oklch(0.72 0.18 55)", fontSize: "0.6rem", letterSpacing: "0.2em" }}>SANCTUARY</p>
          <h1 className="font-cinzel-decorative font-black text-3xl mb-1" style={{ color: "oklch(0.88 0.01 60)" }}>Maps</h1>
          <p className="text-sm" style={{ color: "oklch(0.48 0.010 60)", fontFamily: "'Cinzel', serif" }}>
            Quick reference. Click a zone for elites, bosses, loot, and farming tips.
          </p>
        </div>

        {/* ── Act selector ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5" style={{ scrollbarWidth: "none" }}>
          {ACTS.map((a) => (
            <button key={a.id} onClick={() => handleActChange(a.id)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded border transition-all duration-200 font-cinzel font-bold text-sm"
              style={{
                background: activeActId === a.id ? `${a.color}18` : "oklch(0.10 0.010 30)",
                borderColor: activeActId === a.id ? a.color : "oklch(0.22 0.015 50)",
                color: activeActId === a.id ? a.color : "oklch(0.52 0.010 60)",
                boxShadow: activeActId === a.id ? `0 0 12px ${a.color}22` : "none",
              }}>
              {a.label}
              <span className="font-cinzel font-normal" style={{ color: activeActId === a.id ? `${a.color}aa` : "oklch(0.38 0.010 60)", fontSize: "0.55rem" }}>
                {a.subtitle}
              </span>
            </button>
          ))}
        </div>

        {/* ── View toggle: Town Hub / Zone Map ── */}
        {!selectedZoneId && (
          <div className="flex gap-2 mb-5">
            <button onClick={() => setViewMode("town")}
              className="flex items-center gap-1.5 px-4 py-2 rounded border font-cinzel font-bold text-xs transition-all"
              style={{ background: viewMode === "town" ? `${ac}18` : "oklch(0.10 0.010 30)", borderColor: viewMode === "town" ? ac : "oklch(0.22 0.015 50)", color: viewMode === "town" ? ac : "oklch(0.50 0.010 60)" }}>
              <Home size={12} /> {act.hub}
            </button>
            <button onClick={() => setViewMode("zones")}
              className="flex items-center gap-1.5 px-4 py-2 rounded border font-cinzel font-bold text-xs transition-all"
              style={{ background: viewMode === "zones" ? `${ac}18` : "oklch(0.10 0.010 30)", borderColor: viewMode === "zones" ? ac : "oklch(0.22 0.015 50)", color: viewMode === "zones" ? ac : "oklch(0.50 0.010 60)" }}>
              <Map size={12} /> All Zones
            </button>
          </div>
        )}

        {/* ── Map image ── */}
        {!selectedZoneId && (
          <div className="rounded border overflow-hidden mb-5"
            style={{ borderColor: `${ac}33`, aspectRatio: "16/7", maxHeight: "340px" }}>
            <img
              src={viewMode === "town"
                ? ALL_TOWN_GIS_DATA[`${activeActId}-town`]?.parchmentImage
                : ALL_ACT_GIS_DATA[activeActId]?.parchmentImage}
              alt={viewMode === "town" ? act.hub : act.label}
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.88)" }}
            />
          </div>
        )}

        {/* ── Content area ── */}
        <div>
          {selectedZoneId ? (
            <ZoneDetail
              zoneId={selectedZoneId}
              actId={activeMapId}
              onBack={handleBack}
              accentColor={ac}
            />
          ) : viewMode === "town" ? (
            <div>
              <p className="font-cinzel tracking-widest mb-3" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>
                {act.hub.toUpperCase()} — LOCATIONS
              </p>
              <TownList
                actId={activeActId}
                onSelectZone={(zoneId, mapId) => handleSelectZone(zoneId, mapId)}
                accentColor={ac}
              />
            </div>
          ) : (
            <div>
              <p className="font-cinzel tracking-widest mb-3" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>
                {act.label.toUpperCase()} — ALL ZONES
              </p>
              <ZoneList
                actId={activeActId}
                onSelectZone={(zoneId) => handleSelectZone(zoneId)}
                accentColor={ac}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
