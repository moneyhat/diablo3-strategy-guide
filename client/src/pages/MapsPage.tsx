// Sanctuary Grimoire — Interactive Maps & Locations Page
// Design: dark fantasy atlas with clickable zones, POI markers, and info panels
import { useState } from "react";
import { actsData, ActData, Zone, PointOfInterest, POI_TYPE_COLORS, POI_TYPE_LABELS } from "@/data/maps";
import { ChevronLeft, ChevronRight, MapPin, Sword, Star, Shield, Package, Zap, Map, Info, X } from "lucide-react";
import { useLocation } from "wouter";
import PannableMap from "@/components/PannableMap";
import { ACT_MAPS, SvgActMap, MapPoi } from "@/components/ActMaps";

// ─── Act background images ────────────────────────────────────────────────────
const ACT_IMAGES: Record<string, string> = {
  act1: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/act1-map-bg-Tv2LgkdhZHtYjGaxdXbLKu.webp",
  act2: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/act2-map-bg-Rz7VLfxyxuEmBmzaX2zF4y.webp",
  act3: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/act3-map-bg-bVtLtGDBLy2hpwykVmFmfd.webp",
  act4: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/act4-map-bg-SiTqHDuiWb9WdtTwwq2CHB.webp",
  act5: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/act5-map-bg-mA9PB5Q7VJz65i3hZkihqW.webp",
};

// ─── POI icon resolver ────────────────────────────────────────────────────────
function PoiIcon({ type, size = 12 }: { type: string; size?: number }) {
  const icons: Record<string, React.ComponentType<{ size?: number }>> = {
    elite: Sword, keywarden: Star, boss: Zap, loot: Package,
    goblin: Package, event: Info, dungeon: Map, waypoint: MapPin, chest: Package,
  };
  const Icon = icons[type] || MapPin;
  return <Icon size={size} />;
}

// ─── Density bar ─────────────────────────────────────────────────────────────
function DensityBar({ density, color }: { density: string; color: string }) {
  const levels = { low: 1, medium: 2, high: 3, "very-high": 4 };
  const level = levels[density as keyof typeof levels] || 1;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-cinzel tracking-wide" style={{ color: "oklch(0.50 0.010 60)", fontSize: "0.6rem" }}>DENSITY</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-3 h-1.5 rounded-sm"
            style={{ background: i <= level ? color : "oklch(0.22 0.015 50)", boxShadow: i <= level ? `0 0 4px ${color}66` : "none" }} />
        ))}
      </div>
    </div>
  );
}

// ─── Star rating ─────────────────────────────────────────────────────────────
function StarRating({ rating, color }: { rating: number; color: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={10} fill={i <= rating ? color : "transparent"}
          style={{ color: i <= rating ? color : "oklch(0.30 0.010 60)" }} />
      ))}
    </div>
  );
}

// ─── POI Marker (on map) ─────────────────────────────────────────────────────
function PoiMarker({
  poi, color, isSelected, onClick,
}: {
  poi: PointOfInterest; color: string; isSelected: boolean; onClick: () => void;
}) {
  const poiColor = POI_TYPE_COLORS[poi.type] || color;
  return (
    <button
      onClick={onClick}
      className="absolute flex items-center justify-center rounded-full transition-all duration-200 z-10"
      style={{
        left: `${poi.x}%`,
        top: `${poi.y}%`,
        transform: "translate(-50%, -50%)",
        width: isSelected ? "28px" : "22px",
        height: isSelected ? "28px" : "22px",
        background: isSelected ? poiColor : `${poiColor}33`,
        border: `2px solid ${poiColor}`,
        color: isSelected ? "oklch(0.08 0 0)" : poiColor,
        boxShadow: isSelected ? `0 0 12px ${poiColor}88` : `0 0 6px ${poiColor}44`,
      }}
      title={poi.name}
    >
      <PoiIcon type={poi.type} size={isSelected ? 13 : 10} />
    </button>
  );
}

// ─── Zone card (left sidebar) ─────────────────────────────────────────────────
function ZoneCard({
  zone, color, isSelected, onClick,
}: {
  zone: Zone; color: string; isSelected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded border transition-all duration-200"
      style={{
        background: isSelected ? `${color}15` : "oklch(0.10 0.010 30)",
        borderColor: isSelected ? `${color}55` : "oklch(0.22 0.015 50)",
        boxShadow: isSelected ? `0 0 12px ${color}18` : "none",
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="font-cinzel font-bold text-xs leading-tight" style={{ color: isSelected ? color : "oklch(0.82 0.01 60)" }}>
          {zone.name}
        </span>
        <StarRating rating={zone.farmingRating} color={color} />
      </div>
      <DensityBar density={zone.density} color={color} />
    </button>
  );
}

// ─── POI Info Panel ───────────────────────────────────────────────────────────
function PoiPanel({
  poi, color, onClose,
}: {
  poi: PointOfInterest; color: string; onClose: () => void;
}) {
  const poiColor = POI_TYPE_COLORS[poi.type] || color;
  return (
    <div className="absolute bottom-4 left-4 right-4 z-20 rounded border shadow-2xl"
      style={{ background: "oklch(0.09 0.010 30 / 0.97)", borderColor: `${poiColor}55`, backdropFilter: "blur(8px)" }}>
      <div className="flex items-start gap-3 p-4">
        <div className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center"
          style={{ background: `${poiColor}22`, border: `1px solid ${poiColor}44`, color: poiColor }}>
          <PoiIcon type={poi.type} size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.90 0.01 60)" }}>{poi.name}</h3>
            <span className="text-xs px-2 py-0.5 rounded-sm"
              style={{ background: `${poiColor}18`, color: poiColor, border: `1px solid ${poiColor}33`, fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
              {POI_TYPE_LABELS[poi.type]}
            </span>
          </div>
          <p className="text-xs leading-relaxed mb-2" style={{ color: "oklch(0.65 0.010 60)" }}>{poi.description}</p>
          {poi.lootTip && (
            <div className="flex gap-1.5 p-2 rounded border-l-2 mb-1.5"
              style={{ background: "oklch(0.72 0.18 55 / 0.08)", borderColor: "oklch(0.72 0.18 55)" }}>
              <Package size={11} style={{ color: "oklch(0.78 0.18 55)", flexShrink: 0, marginTop: "1px" }} />
              <p className="text-xs leading-relaxed" style={{ color: "oklch(0.72 0.010 60)" }}>
                <span style={{ color: "oklch(0.78 0.18 55)", fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>LOOT: </span>
                {poi.lootTip}
              </p>
            </div>
          )}
          {poi.farmingTip && (
            <div className="flex gap-1.5 p-2 rounded border-l-2"
              style={{ background: `${color}08`, borderColor: color }}>
              <Sword size={11} style={{ color, flexShrink: 0, marginTop: "1px" }} />
              <p className="text-xs leading-relaxed" style={{ color: "oklch(0.65 0.010 60)" }}>
                <span style={{ color, fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>TIP: </span>
                {poi.farmingTip}
              </p>
            </div>
          )}
        </div>
        <button onClick={onClose} className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center"
          style={{ color: "oklch(0.45 0.010 60)", background: "oklch(0.14 0.012 30)" }}>
          <X size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Zone Detail Panel (right sidebar) ───────────────────────────────────────
function ZoneDetail({ zone, color }: { zone: Zone; color: string }) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-cinzel font-bold text-sm mb-1" style={{ color }}>{zone.name}</h3>
        <p className="text-xs leading-relaxed" style={{ color: "oklch(0.62 0.010 60)" }}>{zone.description}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div>
          <p className="text-xs font-cinzel tracking-wide mb-1" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.6rem" }}>FARMING RATING</p>
          <StarRating rating={zone.farmingRating} color={color} />
        </div>
        <div>
          <p className="text-xs font-cinzel tracking-wide mb-1" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.6rem" }}>DENSITY</p>
          <DensityBar density={zone.density} color={color} />
        </div>
      </div>

      <div>
        <p className="text-xs font-cinzel tracking-wide mb-2" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.6rem" }}>ENEMY TYPES</p>
        <div className="flex flex-wrap gap-1">
          {zone.enemyTypes.map((e) => (
            <span key={e} className="text-xs px-2 py-0.5 rounded-sm"
              style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.58 0.010 60)", border: "1px solid oklch(0.22 0.015 50)", fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
              {e}
            </span>
          ))}
        </div>
      </div>

      <div className="p-3 rounded border-l-2" style={{ background: `${color}08`, borderColor: color }}>
        <p className="text-xs font-cinzel tracking-wide mb-1" style={{ color, fontSize: "0.6rem" }}>FARMING TIP</p>
        <p className="text-xs leading-relaxed" style={{ color: "oklch(0.65 0.010 60)" }}>{zone.farmingTip}</p>
      </div>

      <div>
        <p className="text-xs font-cinzel tracking-wide mb-2" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.6rem" }}>POINTS OF INTEREST ({zone.pois.length})</p>
        <div className="space-y-1.5">
          {zone.pois.map((poi) => {
            const pc = POI_TYPE_COLORS[poi.type] || color;
            return (
              <div key={poi.id} className="flex items-start gap-2 p-2 rounded border"
                style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                <div className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center mt-0.5"
                  style={{ background: `${pc}22`, color: pc }}>
                  <PoiIcon type={poi.type} size={10} />
                </div>
                <div>
                  <p className="text-xs font-cinzel font-bold" style={{ color: "oklch(0.80 0.01 60)" }}>{poi.name}</p>
                  <p className="text-xs" style={{ color: "oklch(0.52 0.010 60)", fontSize: "0.65rem" }}>{POI_TYPE_LABELS[poi.type]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── SVG POI detail panel ────────────────────────────────────────────────────
const SVG_POI_TYPE_COLORS: Record<string, string> = {
  waypoint: "#80cbc4", dungeon: "#7eb8f7", boss: "#ff7043",
  keywarden: "#ce93d8", elite: "#ef5350", chest: "#ffd54f",
  event: "#42a5f5", goblin: "#66bb6a",
};
const SVG_POI_TYPE_LABELS: Record<string, string> = {
  waypoint: "Waypoint", dungeon: "Dungeon", boss: "Boss",
  keywarden: "Keywarden", elite: "Elite Pack", chest: "Chest",
  event: "Event", goblin: "Goblin",
};

function SvgPoiPanel({ poi, color, onClose }: { poi: MapPoi; color: string; onClose: () => void }) {
  const poiColor = SVG_POI_TYPE_COLORS[poi.type] || color;
  return (
    <div className="p-4 rounded border" style={{ background: `${poiColor}08`, borderColor: `${poiColor}55` }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.90 0.01 60)" }}>{poi.label}</h3>
            <span className="text-xs px-2 py-0.5 rounded-sm"
              style={{ background: `${poiColor}18`, color: poiColor, border: `1px solid ${poiColor}33`, fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
              {SVG_POI_TYPE_LABELS[poi.type] || poi.type}
            </span>
          </div>
          <p className="text-xs" style={{ color: "oklch(0.55 0.010 60)" }}>
            Map coordinates: ({poi.x}, {poi.y})
          </p>
        </div>
        <button onClick={onClose} className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center"
          style={{ color: "oklch(0.45 0.010 60)", background: "oklch(0.14 0.012 30)" }}>
          <X size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Map View ────────────────────────────────────────────────────────────
function ActMapView({ act }: { act: ActData }) {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(act.zones[0] || null);
  const [selectedPoi, setSelectedPoi] = useState<PointOfInterest | null>(null);
  const [selectedSvgPoi, setSelectedSvgPoi] = useState<MapPoi | null>(null);
  const [showAllPois, setShowAllPois] = useState(true);
  const [mapMode, setMapMode] = useState<"schematic" | "artwork">("schematic");
  const color = act.color;
  const bgImage = ACT_IMAGES[act.id];
  const svgMap = ACT_MAPS[act.id];

  const displayedPois = selectedZone
    ? (showAllPois ? act.zones.flatMap((z) => z.pois) : selectedZone.pois)
    : act.zones.flatMap((z) => z.pois);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Left: Zone list */}
      <div className="lg:w-56 flex-shrink-0">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-cinzel tracking-widest" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.6rem" }}>ZONES ({act.zones.length})</span>
          <button
            onClick={() => setShowAllPois(!showAllPois)}
            className="text-xs px-2 py-0.5 rounded-sm transition-colors"
            style={{ background: showAllPois ? `${color}22` : "oklch(0.14 0.012 30)", color: showAllPois ? color : "oklch(0.50 0.010 60)", border: `1px solid ${showAllPois ? `${color}44` : "oklch(0.22 0.015 50)"}`, fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
            {showAllPois ? "All POIs" : "Zone POIs"}
          </button>
        </div>
        <div className="space-y-1.5 max-h-96 lg:max-h-none overflow-y-auto pr-1"
          style={{ scrollbarWidth: "thin", scrollbarColor: `${color}44 transparent` }}>
          {act.zones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} color={color}
              isSelected={selectedZone?.id === zone.id}
              onClick={() => { setSelectedZone(zone); setSelectedPoi(null); setSelectedSvgPoi(null); }} />
          ))}
        </div>
      </div>

      {/* Center: Pannable Map */}
      <div className="flex-1 min-w-0">
        {/* Map mode toggle + zone badge */}
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          {selectedZone && (
            <div className="px-3 py-1.5 rounded border"
              style={{ background: "oklch(0.10 0.010 30)", borderColor: `${color}44` }}>
              <p className="font-cinzel font-bold text-xs" style={{ color }}>{selectedZone.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <DensityBar density={selectedZone.density} color={color} />
                <StarRating rating={selectedZone.farmingRating} color={color} />
              </div>
            </div>
          )}
          {/* Map mode toggle */}
          <div className="flex rounded overflow-hidden border ml-auto" style={{ borderColor: "oklch(0.22 0.015 50)" }}>
            {(["schematic", "artwork"] as const).map((mode) => (
              <button key={mode} onClick={() => setMapMode(mode)}
                className="px-3 py-1.5 text-xs font-cinzel tracking-wide transition-colors"
                style={{
                  background: mapMode === mode ? `${color}22` : "oklch(0.10 0.010 30)",
                  color: mapMode === mode ? color : "oklch(0.50 0.010 60)",
                  borderRight: mode === "schematic" ? `1px solid oklch(0.22 0.015 50)` : "none",
                  fontSize: "0.65rem",
                }}>
                {mode === "schematic" ? "🗺 Schematic" : "🎨 Artwork"}
              </button>
            ))}
          </div>
        </div>

        <PannableMap
          bgImage={bgImage}
          pois={mapMode === "artwork" ? displayedPois : []}
          selectedPoiId={selectedPoi?.id || null}
          onPoiClick={(poi) => setSelectedPoi(selectedPoi?.id === poi.id ? null : poi)}
          accentColor={color}
          actName={act.name}
          svgMapContent={mapMode === "schematic" && svgMap ? (
            <SvgActMap
              mapData={svgMap}
              selectedPoiId={selectedSvgPoi?.id || null}
              onPoiClick={(poi) => setSelectedSvgPoi(selectedSvgPoi?.id === poi.id ? null : poi)}
            />
          ) : undefined}
        />

        {/* SVG POI Info Panel */}
        {mapMode === "schematic" && selectedSvgPoi && (
          <div className="mt-3">
            <SvgPoiPanel poi={selectedSvgPoi} color={color} onClose={() => setSelectedSvgPoi(null)} />
          </div>
        )}

        {/* Artwork POI Info Panel */}
        {mapMode === "artwork" && selectedPoi && (
          <div className="mt-3">
            <PoiPanel poi={selectedPoi} color={color} onClose={() => setSelectedPoi(null)} />
          </div>
        )}

        {/* POI Legend */}
        <div className="flex flex-wrap gap-2 mt-2 px-1">
          {Object.entries(POI_TYPE_COLORS).map(([type, c]) => (
            <div key={type} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full flex items-center justify-center"
                style={{ background: `${c}33`, border: `1px solid ${c}66` }}>
                <PoiIcon type={type} size={7} />
              </div>
              <span className="text-xs" style={{ color: "oklch(0.45 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>
                {POI_TYPE_LABELS[type as keyof typeof POI_TYPE_LABELS]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Zone detail */}
      {selectedZone && (
        <div className="lg:w-64 flex-shrink-0 rounded border overflow-y-auto max-h-96 lg:max-h-none"
          style={{ borderColor: "oklch(0.22 0.015 50)", background: "oklch(0.09 0.010 30)", scrollbarWidth: "thin", scrollbarColor: `${color}44 transparent` }}>
          <ZoneDetail zone={selectedZone} color={color} />
        </div>
      )}
    </div>
  );
}

// ─── Act Info Panel ───────────────────────────────────────────────────────────
function ActInfoPanel({ act }: { act: ActData }) {
  const [tab, setTab] = useState<"overview" | "boss" | "keywarden" | "bounties" | "farming">("overview");
  const color = act.color;
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "boss", label: "Boss" },
    ...(act.keywarden ? [{ id: "keywarden", label: "Keywarden" }] : []),
    { id: "bounties", label: "Bounties" },
    { id: "farming", label: "Farming" },
  ] as { id: typeof tab; label: string }[];

  return (
    <div className="rounded border mt-4" style={{ borderColor: "oklch(0.22 0.015 50)", background: "oklch(0.09 0.010 30)" }}>
      {/* Tab bar */}
      <div className="flex border-b overflow-x-auto" style={{ borderColor: "oklch(0.18 0.012 30)" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2.5 text-xs font-cinzel tracking-wide whitespace-nowrap border-b-2 transition-all duration-200 flex-shrink-0"
            style={{ borderColor: tab === t.id ? color : "transparent", color: tab === t.id ? color : "oklch(0.50 0.010 60)", background: tab === t.id ? `${color}08` : "transparent" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === "overview" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              <div className="p-3 rounded border flex-1 min-w-32" style={{ background: "oklch(0.11 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                <p className="text-xs font-cinzel tracking-wide mb-1" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.6rem" }}>HUB</p>
                <p className="text-sm font-bold" style={{ color }}>{act.hub}</p>
              </div>
              <div className="p-3 rounded border flex-1 min-w-32" style={{ background: "oklch(0.11 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                <p className="text-xs font-cinzel tracking-wide mb-1" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.6rem" }}>THEME</p>
                <p className="text-sm font-bold" style={{ color: "oklch(0.80 0.01 60)" }}>{act.theme}</p>
              </div>
              <div className="p-3 rounded border flex-1 min-w-32" style={{ background: "oklch(0.11 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                <p className="text-xs font-cinzel tracking-wide mb-1" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.6rem" }}>OVERALL RATING</p>
                <StarRating rating={act.overallRating} color={color} />
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "oklch(0.65 0.010 60)" }}>{act.overview}</p>
            <div>
              <p className="text-xs font-cinzel tracking-wide mb-2" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.6rem" }}>HUB SERVICES</p>
              <div className="flex flex-wrap gap-1.5">
                {act.hubServices.map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-sm"
                    style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.58 0.010 60)", border: "1px solid oklch(0.22 0.015 50)", fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "boss" && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded border"
              style={{ background: "oklch(0.11 0.010 30)", borderColor: `${color}44` }}>
              <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}22`, border: `1px solid ${color}55` }}>
                <Zap size={18} style={{ color }} />
              </div>
              <div>
                <h3 className="font-cinzel font-bold text-base mb-0.5" style={{ color }}>{act.boss.name}</h3>
                <p className="text-xs mb-2" style={{ color: "oklch(0.55 0.010 60)" }}>{act.boss.location}</p>
                <div className="p-2 rounded border-l-2" style={{ background: "oklch(0.72 0.18 55 / 0.08)", borderColor: "oklch(0.72 0.18 55)" }}>
                  <p className="text-xs font-cinzel tracking-wide mb-0.5" style={{ color: "oklch(0.78 0.18 55)", fontSize: "0.6rem" }}>DROPS</p>
                  <p className="text-xs leading-relaxed" style={{ color: "oklch(0.65 0.010 60)" }}>{act.boss.drops}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "keywarden" && act.keywarden && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded border"
              style={{ background: "oklch(0.11 0.010 30)", borderColor: "#ce93d844" }}>
              <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: "#ce93d822", border: "1px solid #ce93d855" }}>
                <Star size={18} style={{ color: "#ce93d8" }} />
              </div>
              <div className="flex-1">
                <h3 className="font-cinzel font-bold text-base mb-0.5" style={{ color: "#ce93d8" }}>{act.keywarden.name}</h3>
                <p className="text-xs mb-2" style={{ color: "oklch(0.55 0.010 60)" }}>{act.keywarden.location}</p>
                <div className="p-2 rounded border-l-2 mb-2" style={{ background: "oklch(0.72 0.18 55 / 0.08)", borderColor: "oklch(0.72 0.18 55)" }}>
                  <p className="text-xs font-cinzel tracking-wide mb-0.5" style={{ color: "oklch(0.78 0.18 55)", fontSize: "0.6rem" }}>DROPS</p>
                  <p className="text-xs" style={{ color: "oklch(0.65 0.010 60)" }}>{act.keywarden.key}</p>
                </div>
                <div className="p-2 rounded border-l-2" style={{ background: "#ce93d808", borderColor: "#ce93d8" }}>
                  <p className="text-xs font-cinzel tracking-wide mb-0.5" style={{ color: "#ce93d8", fontSize: "0.6rem" }}>TIP</p>
                  <p className="text-xs leading-relaxed" style={{ color: "oklch(0.65 0.010 60)" }}>{act.keywarden.tip}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "bounties" && (
          <div className="space-y-2">
            {act.bountyHighlights.map((b, i) => (
              <div key={i} className="flex gap-2 p-3 rounded border"
                style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: `${color}22`, color, fontSize: "0.55rem" }}>{i + 1}</div>
                <p className="text-xs leading-relaxed" style={{ color: "oklch(0.68 0.010 60)" }}>{b}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "farming" && (
          <div>
            <div className="p-4 rounded border-l-2" style={{ background: `${color}08`, borderColor: color }}>
              <p className="text-sm leading-relaxed" style={{ color: "oklch(0.68 0.010 60)" }}>{act.farmingNotes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main MapsPage ────────────────────────────────────────────────────────────
export default function MapsPage() {
  const [, navigate] = useLocation();
  const [activeActIndex, setActiveActIndex] = useState(0);
  const act = actsData[activeActIndex];

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.07 0.008 30)" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b px-4 py-3 flex items-center justify-between"
        style={{ borderColor: "oklch(0.22 0.015 50)", background: "oklch(0.07 0.008 30 / 0.97)", backdropFilter: "blur(12px)" }}>
        <button onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-xs font-cinzel tracking-wide"
          style={{ color: "oklch(0.55 0.010 60)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.78 0.18 55)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.55 0.010 60)"; }}>
          <ChevronLeft size={13} /> Home
        </button>
        <span className="font-cinzel-decorative text-sm font-bold" style={{ color: "oklch(0.78 0.18 55)" }}>
          Maps & Locations
        </span>
        <div className="w-16" />
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Act selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {actsData.map((a, i) => (
            <button key={a.id} onClick={() => setActiveActIndex(i)}
              className="flex-shrink-0 relative rounded overflow-hidden border-2 transition-all duration-200"
              style={{
                borderColor: i === activeActIndex ? a.color : "oklch(0.22 0.015 50)",
                boxShadow: i === activeActIndex ? `0 0 16px ${a.color}44` : "none",
                width: "140px",
                height: "80px",
              }}>
              <img src={ACT_IMAGES[a.id]} alt={a.name} className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: i === activeActIndex ? "brightness(0.5)" : "brightness(0.3)" }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-cinzel-decorative font-black text-sm"
                  style={{ color: i === activeActIndex ? a.color : "oklch(0.65 0.010 60)", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                  {a.name}
                </span>
                <span className="text-xs font-cinzel" style={{ color: i === activeActIndex ? "oklch(0.80 0.01 60)" : "oklch(0.50 0.010 60)", fontSize: "0.6rem" }}>
                  {a.subtitle}
                </span>
                <div className="mt-1">
                  <StarRating rating={a.overallRating} color={i === activeActIndex ? a.color : "oklch(0.40 0.010 60)"} />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Act title bar */}
        <div className="flex items-center gap-4 mb-4">
          <div>
            <h1 className="font-cinzel-decorative font-black"
              style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)", color: act.color, textShadow: `0 0 20px ${act.color}44` }}>
              {act.name}: {act.subtitle}
            </h1>
            <p className="text-xs font-cinzel tracking-wide" style={{ color: "oklch(0.50 0.010 60)" }}>
              {act.zones.length} zones · {act.zones.reduce((n, z) => n + z.pois.length, 0)} points of interest · Hub: {act.hub}
            </p>
          </div>
          <div className="flex gap-1 ml-auto">
            <button onClick={() => setActiveActIndex(Math.max(0, activeActIndex - 1))}
              disabled={activeActIndex === 0}
              className="w-8 h-8 rounded flex items-center justify-center border transition-colors"
              style={{ borderColor: "oklch(0.22 0.015 50)", color: activeActIndex === 0 ? "oklch(0.30 0.010 60)" : "oklch(0.60 0.010 60)", background: "oklch(0.10 0.010 30)" }}>
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => setActiveActIndex(Math.min(actsData.length - 1, activeActIndex + 1))}
              disabled={activeActIndex === actsData.length - 1}
              className="w-8 h-8 rounded flex items-center justify-center border transition-colors"
              style={{ borderColor: "oklch(0.22 0.015 50)", color: activeActIndex === actsData.length - 1 ? "oklch(0.30 0.010 60)" : "oklch(0.60 0.010 60)", background: "oklch(0.10 0.010 30)" }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Map view */}
        <ActMapView key={act.id} act={act} />

        {/* Act info tabs */}
        <ActInfoPanel act={act} />
      </div>
    </div>
  );
}
