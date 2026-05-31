// Sanctuary Grimoire — Interactive Maps with Google Maps-style Overlay System
// Base layers: Terrain (AI dungeon art) | Artwork (atmospheric) | Schematic (SVG)
// Overlay toggles: Elite Packs | Loot | Keywardens | Farming Route | All POIs
import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { actsData, ActData, Zone, PointOfInterest, POI_TYPE_COLORS, POI_TYPE_LABELS } from "@/data/maps";
import { ACT_MAPS, SvgActMap, MapPoi } from "@/components/ActMaps";
import { ChevronLeft, ChevronRight, Star, X, Layers, Map, Sword, Package, Key, Navigation, Eye, EyeOff } from "lucide-react";

// ─── Image URLs ───────────────────────────────────────────────────────────────
const ARTWORK_IMAGES: Record<string, string> = {
  act1: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/act1-map-bg-Tv2LgkdhZHtYjGaxdXbLKu.webp",
  act2: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/act2-map-bg-Rz7VLfxyxuEmBmzaX2zF4y.webp",
  act3: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/act3-map-bg-bVtLtGDBLy2hpwykVmFmfd.webp",
  act4: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/act4-map-bg-SiTqHDuiWb9WdtTwwq2CHB.webp",
  act5: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/act5-map-bg-mA9PB5Q7VJz65i3hZkihqW.webp",
};

const TERRAIN_IMAGES: Record<string, string> = {
  act1: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/terrain-act1-dmDi4WXj6B9zowWmuQjp54.webp",
  act2: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/terrain-act2-eYg2GwbUawZE9H7ENETVUY.webp",
  act3: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/terrain-act3-XJJJ2qsLzkHAaaHJBsw4J4.webp",
  act4: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/terrain-act4-7eCHcMjMFfne4rAk3tNT5a.webp",
  act5: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/terrain-act5-4bpadP4z3fx9hKBTMtUZLV.webp",
};

// ─── Farming routes per act (sequence of POI ids to connect) ─────────────────
const FARMING_ROUTES: Record<string, string[]> = {
  act1: ["wp-tristram", "wp-weeping", "chest-weeping", "elite-fields1", "elite-fields2", "kw-odeg", "wp-fields", "wp-festering", "dun-caverns"],
  act2: ["wp-camp", "wp-canyon", "elite-canyon1", "elite-canyon2", "wp-oasis", "chest-oasis", "kw-sokahr", "wp-desolate", "event-sands", "wp-archives"],
  act3: ["wp-bastions", "kw-xahrith", "wp-stonefort", "wp-rakkis", "elite-rakkis1", "elite-rakkis2", "wp-arreat1", "elite-arreat", "chest-arreat", "wp-arreat2", "dun-tower"],
  act4: ["wp-arch", "wp-gardens1", "elite-g1", "chest-g1", "kw-nekarat", "wp-gardens2", "dun-hellrift", "wp-spire1", "elite-s1", "wp-spire2"],
  act5: ["wp-enclave", "wp-westmarch", "dun-corvus1", "chest-corvus1", "dun-corvus2", "chest-corvus2", "wp-corvus", "wp-marsh", "wp-pand", "elite-battle1", "elite-battle2", "elite-battle3", "goblin-battle", "wp-battle"],
};

// ─── Overlay types ────────────────────────────────────────────────────────────
type BaseLayer = "terrain" | "artwork" | "schematic";
interface OverlayState {
  elites: boolean;
  loot: boolean;
  keywardens: boolean;
  farmingRoute: boolean;
  allPois: boolean;
}

// ─── POI filter by overlay ────────────────────────────────────────────────────
function filterPoisByOverlays(pois: MapPoi[], overlays: OverlayState): MapPoi[] {
  if (overlays.allPois) return pois;
  return pois.filter((p) => {
    if (overlays.elites && p.type === "elite") return true;
    if (overlays.loot && (p.type === "chest" || p.type === "goblin")) return true;
    if (overlays.keywardens && p.type === "keywarden") return true;
    if (overlays.elites && p.type === "boss") return true;
    // Always show waypoints and dungeons as base navigation
    if (p.type === "waypoint" || p.type === "dungeon") return true;
    return false;
  });
}

// ─── Farming Route SVG overlay ────────────────────────────────────────────────
function FarmingRouteOverlay({ actId, pois, viewBox }: { actId: string; pois: MapPoi[]; viewBox: string }) {
  const route = FARMING_ROUTES[actId] || [];
  const poiMap = Object.fromEntries(pois.map((p) => [p.id, p]));
  const points = route.map((id) => poiMap[id]).filter(Boolean);
  if (points.length < 2) return null;

  const [vx, vy, vw, vh] = viewBox.split(" ").map(Number);

  return (
    <svg viewBox={viewBox} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <defs>
        <filter id="route-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 Z" fill="#ffd54f" opacity="0.9" />
        </marker>
      </defs>
      {/* Glow path */}
      <polyline
        points={points.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none" stroke="#ffd54f" strokeWidth="4" strokeOpacity="0.25"
        strokeLinecap="round" strokeLinejoin="round"
        filter="url(#route-glow)"
      />
      {/* Main dashed route */}
      <polyline
        points={points.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none" stroke="#ffd54f" strokeWidth="2" strokeOpacity="0.85"
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="8,5"
        markerMid="url(#arrow)"
      />
      {/* Step numbers */}
      {points.map((p, i) => (
        <g key={p.id}>
          <circle cx={p.x} cy={p.y} r="9" fill="rgba(5,3,8,0.88)" stroke="#ffd54f" strokeWidth="1.5" />
          <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle"
            fill="#ffd54f" fontSize="7" fontFamily="'Cinzel', serif" fontWeight="bold">
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── Pannable canvas with overlay layers ─────────────────────────────────────
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.35;

function OverlayMapCanvas({
  actId, baseLayer, overlays, svgPois, onPoiClick, selectedPoiId, accentColor, actName,
}: {
  actId: string;
  baseLayer: BaseLayer;
  overlays: OverlayState;
  svgPois: MapPoi[];
  onPoiClick: (poi: MapPoi) => void;
  selectedPoiId: string | null;
  accentColor: string;
  actName: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef<number | null>(null);

  const svgMap = ACT_MAPS[actId];
  const filteredPois = filterPoisByOverlays(svgPois, overlays);

  const clamp = useCallback((tx: number, ty: number, scale: number) => {
    const container = containerRef.current;
    if (!container) return { x: tx, y: ty };
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    return {
      x: Math.min(0, Math.max(cw - cw * scale, tx)),
      y: Math.min(0, Math.max(ch - ch * scale, ty)),
    };
  }, []);

  const zoomAt = useCallback((clientX: number, clientY: number, delta: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;
    setTransform((prev) => {
      const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev.scale + delta));
      const ratio = newScale / prev.scale;
      const newX = cx - ratio * (cx - prev.x);
      const newY = cy - ratio * (cy - prev.y);
      const clamped = clamp(newX, newY, newScale);
      return { x: clamped.x, y: clamped.y, scale: newScale };
    });
  }, [clamp]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTransform((prev) => {
      const clamped = clamp(prev.x + dx, prev.y + dy, prev.scale);
      return { ...prev, ...clamped };
    });
  }, [clamp]);

  const onMouseUp = useCallback(() => { isDragging.current = false; }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
  }, [zoomAt]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      isDragging.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist.current = Math.sqrt(dx * dx + dy * dy);
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging.current) {
      const dx = e.touches[0].clientX - lastPos.current.x;
      const dy = e.touches[0].clientY - lastPos.current.y;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setTransform((prev) => {
        const clamped = clamp(prev.x + dx, prev.y + dy, prev.scale);
        return { ...prev, ...clamped };
      });
    } else if (e.touches.length === 2 && lastPinchDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const delta = (dist - lastPinchDist.current) * 0.012;
      lastPinchDist.current = dist;
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      zoomAt(midX, midY, delta);
    }
  }, [clamp, zoomAt]);

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;
    lastPinchDist.current = null;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const resetView = () => setTransform({ x: 0, y: 0, scale: 1 });
  const zoomIn = () => { const c = containerRef.current; if (c) zoomAt(c.clientWidth / 2, c.clientHeight / 2, ZOOM_STEP); };
  const zoomOut = () => { const c = containerRef.current; if (c) zoomAt(c.clientWidth / 2, c.clientHeight / 2, -ZOOM_STEP); };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded border select-none"
      style={{
        borderColor: `${accentColor}33`,
        aspectRatio: "16/9",
        minHeight: "320px",
        cursor: isDragging.current ? "grabbing" : "grab",
        touchAction: "none",
        background: "#050308",
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Transformable layer stack ── */}
      <div style={{
        position: "absolute", inset: 0,
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
        transformOrigin: "0 0",
        willChange: "transform",
        transition: isDragging.current ? "none" : "transform 0.05s ease-out",
        width: "100%", height: "100%",
      }}>

        {/* ── BASE LAYER 1: Terrain (AI dungeon art) ── */}
        {baseLayer === "terrain" && (
          <img src={TERRAIN_IMAGES[actId]} alt={actName} draggable={false}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
        )}

        {/* ── BASE LAYER 2: Artwork (atmospheric) ── */}
        {baseLayer === "artwork" && (
          <img src={ARTWORK_IMAGES[actId]} alt={actName} draggable={false}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55) saturate(0.8)", pointerEvents: "none" }} />
        )}

        {/* ── BASE LAYER 3: Schematic (SVG) ── */}
        {baseLayer === "schematic" && svgMap && (
          <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            <SvgActMap mapData={svgMap} selectedPoiId={selectedPoiId} onPoiClick={onPoiClick} />
          </div>
        )}

        {/* ── OVERLAY: Schematic on top of Terrain/Artwork ── */}
        {baseLayer !== "schematic" && svgMap && (
          <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.45, pointerEvents: "none", mixBlendMode: "screen" }}>
            <SvgActMap mapData={svgMap} selectedPoiId={null} onPoiClick={() => {}} />
          </div>
        )}

        {/* ── OVERLAY: POI Markers ── */}
        {filteredPois.map((poi) => {
          const isSelected = selectedPoiId === poi.id;
          const color = {
            waypoint: "#80cbc4", dungeon: "#7eb8f7", boss: "#ff7043",
            keywarden: "#ce93d8", elite: "#ef5350", chest: "#ffd54f",
            event: "#42a5f5", goblin: "#66bb6a",
          }[poi.type] || "#fff";
          const r = isSelected ? 11 : 7;

          return (
            <button key={poi.id} onClick={(e) => { e.stopPropagation(); onPoiClick(poi); }}
              title={poi.label}
              style={{
                position: "absolute",
                left: `${poi.x}%`, top: `${poi.y}%`,
                transform: "translate(-50%, -50%)",
                width: r * 2 + 8, height: r * 2 + 8,
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isSelected ? color : `${color}33`,
                border: `2px solid ${color}`,
                color: isSelected ? "oklch(0.08 0 0)" : color,
                boxShadow: isSelected ? `0 0 16px ${color}99, 0 0 6px ${color}` : `0 0 8px ${color}55`,
                transition: "all 0.15s ease",
                cursor: "pointer",
                zIndex: isSelected ? 30 : 10,
              }}>
              {isSelected && (
                <div style={{
                  position: "absolute", bottom: "calc(100% + 6px)", left: "50%",
                  transform: "translateX(-50%)",
                  background: "oklch(0.08 0.010 30 / 0.96)",
                  border: `1px solid ${color}66`, borderRadius: "4px",
                  padding: "3px 8px", whiteSpace: "nowrap", pointerEvents: "none",
                  backdropFilter: "blur(4px)", zIndex: 40,
                }}>
                  <span style={{ color, fontFamily: "'Cinzel', serif", fontSize: "0.58rem", fontWeight: "bold" }}>
                    {poi.label}
                  </span>
                </div>
              )}
            </button>
          );
        })}

        {/* ── OVERLAY: Farming Route ── */}
        {overlays.farmingRoute && svgMap && (
          <FarmingRouteOverlay actId={actId} pois={svgMap.pois} viewBox={svgMap.viewBox} />
        )}
      </div>

      {/* ── Fixed UI controls ── */}
      <div style={{ position: "absolute", bottom: "12px", right: "12px", display: "flex", flexDirection: "column", gap: "4px", zIndex: 50 }}>
        {[
          { label: "+", onClick: zoomIn, title: "Zoom in" },
          { label: "−", onClick: zoomOut, title: "Zoom out" },
          { label: "⊡", onClick: resetView, title: "Reset view" },
        ].map((btn) => (
          <button key={btn.label} onClick={(e) => { e.stopPropagation(); btn.onClick(); }} title={btn.title}
            style={{ width: 30, height: 30, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", background: "oklch(0.10 0.010 30 / 0.92)", border: `1px solid ${accentColor}44`, color: accentColor, cursor: "pointer", backdropFilter: "blur(4px)", fontSize: "14px", fontWeight: "bold" }}>
            {btn.label}
          </button>
        ))}
      </div>

      {/* Zoom indicator */}
      <div style={{ position: "absolute", bottom: "12px", left: "12px", zIndex: 50, background: "oklch(0.09 0.010 30 / 0.88)", border: `1px solid ${accentColor}33`, borderRadius: "4px", padding: "3px 8px", backdropFilter: "blur(4px)" }}>
        <span style={{ color: "oklch(0.45 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>
          {Math.round(transform.scale * 100)}%
        </span>
      </div>

      {/* Hint */}
      <div style={{ position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)", zIndex: 50, background: "oklch(0.09 0.010 30 / 0.80)", border: `1px solid ${accentColor}22`, borderRadius: "4px", padding: "3px 10px", backdropFilter: "blur(4px)", pointerEvents: "none" }}>
        <span style={{ color: "oklch(0.38 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.52rem" }}>
          Drag to pan · Scroll to zoom · Click markers for details
        </span>
      </div>
    </div>
  );
}

// ─── Overlay Control Panel ────────────────────────────────────────────────────
function OverlayControls({
  baseLayer, setBaseLayer, overlays, setOverlays, accentColor,
}: {
  baseLayer: BaseLayer;
  setBaseLayer: (l: BaseLayer) => void;
  overlays: OverlayState;
  setOverlays: React.Dispatch<React.SetStateAction<OverlayState>>;
  accentColor: string;
}) {
  const baseLayers: { id: BaseLayer; label: string; icon: React.ReactNode }[] = [
    { id: "terrain",   label: "Terrain",   icon: <Map size={12} /> },
    { id: "artwork",   label: "Artwork",   icon: <Eye size={12} /> },
    { id: "schematic", label: "Schematic", icon: <Layers size={12} /> },
  ];

  const overlayToggles: { key: keyof OverlayState; label: string; color: string; icon: React.ReactNode }[] = [
    { key: "allPois",      label: "All POIs",      color: "#80cbc4", icon: <Map size={11} /> },
    { key: "elites",       label: "Elites & Bosses", color: "#ef5350", icon: <Sword size={11} /> },
    { key: "loot",         label: "Loot & Goblins",  color: "#ffd54f", icon: <Package size={11} /> },
    { key: "keywardens",   label: "Keywardens",      color: "#ce93d8", icon: <Key size={11} /> },
    { key: "farmingRoute", label: "Farming Route",   color: "#ffd54f", icon: <Navigation size={11} /> },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Base layer selector */}
      <div>
        <p className="text-xs font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.55rem" }}>
          BASE LAYER
        </p>
        <div className="flex gap-1.5">
          {baseLayers.map((layer) => {
            const isActive = baseLayer === layer.id;
            return (
              <button key={layer.id} onClick={() => setBaseLayer(layer.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-cinzel transition-all duration-200 flex-1 justify-center"
                style={{
                  background: isActive ? `${accentColor}20` : "oklch(0.10 0.010 30)",
                  borderColor: isActive ? accentColor : "oklch(0.22 0.015 50)",
                  color: isActive ? accentColor : "oklch(0.52 0.010 60)",
                  boxShadow: isActive ? `0 0 8px ${accentColor}22` : "none",
                }}>
                {layer.icon} {layer.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overlay toggles */}
      <div>
        <p className="text-xs font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.55rem" }}>
          OVERLAYS
        </p>
        <div className="flex flex-wrap gap-1.5">
          {overlayToggles.map((ov) => {
            const isOn = overlays[ov.key];
            return (
              <button key={ov.key}
                onClick={() => setOverlays((prev) => ({ ...prev, [ov.key]: !prev[ov.key] }))}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs font-cinzel transition-all duration-200"
                style={{
                  background: isOn ? `${ov.color}18` : "oklch(0.10 0.010 30)",
                  borderColor: isOn ? `${ov.color}66` : "oklch(0.22 0.015 50)",
                  color: isOn ? ov.color : "oklch(0.45 0.010 60)",
                  boxShadow: isOn ? `0 0 6px ${ov.color}22` : "none",
                }}>
                {isOn ? <Eye size={10} /> : <EyeOff size={10} />}
                {ov.icon}
                {ov.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── POI Detail Panel ─────────────────────────────────────────────────────────
function PoiDetailPanel({ poi, color, onClose }: { poi: MapPoi; color: string; onClose: () => void }) {
  const typeLabels: Record<string, string> = {
    waypoint: "Waypoint", dungeon: "Dungeon Entrance", boss: "Boss",
    keywarden: "Keywarden", elite: "Elite Pack", chest: "Resplendent Chest",
    event: "Event", goblin: "Treasure Goblin",
  };
  const typeTips: Record<string, string> = {
    waypoint: "Activating waypoints lets you fast-travel back to this location from any other waypoint in the game.",
    dungeon: "Dungeon entrances lead to instanced areas with guaranteed elite packs and often unique loot.",
    boss: "Act bosses drop guaranteed items and are required for story progression. They respawn each game session.",
    keywarden: "Keywardens drop Infernal Machine keys on Torment difficulty. Killing all 4 opens access to Uber bosses.",
    elite: "Elite packs drop more loot than regular enemies. Look for packs with fewer dangerous affixes when farming.",
    chest: "Resplendent Chests have a chance to drop Legendary items and are worth seeking out on farming runs.",
    event: "Events award bonus XP and gold. Some events also spawn additional elite packs or unique enemies.",
    goblin: "Treasure Goblins drop large amounts of gold and items. Chase them down before they escape through a portal.",
  };
  return (
    <div className="p-4 rounded border mt-3" style={{ background: `${color}08`, borderColor: `${color}44` }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.90 0.01 60)" }}>{poi.label}</p>
          <span className="text-xs px-2 py-0.5 rounded-sm"
            style={{ background: `${color}18`, color, border: `1px solid ${color}33`, fontFamily: "'Cinzel', serif", fontSize: "0.58rem" }}>
            {typeLabels[poi.type] || poi.type}
          </span>
        </div>
        <button onClick={onClose} className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
          style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.45 0.010 60)" }}>
          <X size={12} />
        </button>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: "oklch(0.58 0.010 60)" }}>
        {typeTips[poi.type] || ""}
      </p>
    </div>
  );
}

// ─── Act Selector ─────────────────────────────────────────────────────────────
function ActSelector({ acts, activeActId, onSelect }: {
  acts: ActData[]; activeActId: string; onSelect: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
      {acts.map((act) => {
        const isActive = act.id === activeActId;
        return (
          <button key={act.id} onClick={() => onSelect(act.id)}
            className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2.5 rounded border transition-all duration-200"
            style={{
              background: isActive ? `${act.color}18` : "oklch(0.10 0.010 30)",
              borderColor: isActive ? act.color : "oklch(0.22 0.015 50)",
              boxShadow: isActive ? `0 0 12px ${act.color}22` : "none",
            }}>
            <div className="w-12 h-8 rounded overflow-hidden"
              style={{ border: `1px solid ${isActive ? act.color + "66" : "oklch(0.22 0.015 50)"}` }}>
              <img src={TERRAIN_IMAGES[act.id]} alt={act.name}
                className="w-full h-full object-cover"
                style={{ filter: isActive ? "brightness(0.9)" : "brightness(0.5) saturate(0.6)" }} />
            </div>
            <span className="font-cinzel font-bold whitespace-nowrap"
              style={{ color: isActive ? act.color : "oklch(0.55 0.010 60)", fontSize: "0.65rem" }}>
              {act.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Zone Sidebar ─────────────────────────────────────────────────────────────
function ZoneSidebar({ act, color }: { act: ActData; color: string }) {
  return (
    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1"
      style={{ scrollbarWidth: "thin", scrollbarColor: `${color}44 transparent` }}>
      {act.zones.map((zone) => (
        <div key={zone.id} className="p-2.5 rounded border"
          style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.20 0.012 30)" }}>
          <p className="font-cinzel font-bold text-xs mb-1" style={{ color: "oklch(0.82 0.01 60)" }}>{zone.name}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="text-xs" style={{ color: "oklch(0.42 0.010 60)", fontSize: "0.55rem" }}>DENSITY</span>
              <div className="flex gap-0.5">
                {[1,2,3,4].map((i) => {
                  const lvl = { low:1, medium:2, high:3, "very-high":4 }[zone.density as string] || 1;
                  return <div key={i} className="w-2.5 h-1 rounded-sm" style={{ background: i <= lvl ? color : "oklch(0.22 0.015 50)" }} />;
                })}
              </div>
            </div>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} size={8} fill={i <= zone.farmingRating ? color : "transparent"}
                  style={{ color: i <= zone.farmingRating ? color : "oklch(0.28 0.010 60)" }} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function MapLegend({ color }: { color: string }) {
  const items = [
    { type: "waypoint",  label: "Waypoint",   color: "#80cbc4" },
    { type: "dungeon",   label: "Dungeon",     color: "#7eb8f7" },
    { type: "boss",      label: "Boss",        color: "#ff7043" },
    { type: "keywarden", label: "Keywarden",   color: "#ce93d8" },
    { type: "elite",     label: "Elite Pack",  color: "#ef5350" },
    { type: "chest",     label: "Chest",       color: "#ffd54f" },
    { type: "goblin",    label: "Goblin",      color: "#66bb6a" },
    { type: "event",     label: "Event",       color: "#42a5f5" },
  ];
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((item) => (
        <div key={item.type} className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ background: `${item.color}44`, border: `1.5px solid ${item.color}` }} />
          <span style={{ color: "oklch(0.45 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.52rem" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Maps Page ───────────────────────────────────────────────────────────
export default function MapsPage() {
  const [, navigate] = useLocation();
  const [activeActId, setActiveActId] = useState("act1");
  const [baseLayer, setBaseLayer] = useState<BaseLayer>("terrain");
  const [overlays, setOverlays] = useState<OverlayState>({
    elites: true, loot: true, keywardens: true, farmingRoute: false, allPois: false,
  });
  const [selectedPoi, setSelectedPoi] = useState<MapPoi | null>(null);

  const act = actsData.find((a) => a.id === activeActId)!;
  const svgMap = ACT_MAPS[activeActId];
  const svgPois = svgMap?.pois || [];
  const color = act.color;

  const handleActChange = (id: string) => {
    setActiveActId(id);
    setSelectedPoi(null);
  };

  const handlePoiClick = (poi: MapPoi) => {
    setSelectedPoi(selectedPoi?.id === poi.id ? null : poi);
  };

  const selectedPoiColor = selectedPoi
    ? ({ waypoint: "#80cbc4", dungeon: "#7eb8f7", boss: "#ff7043", keywarden: "#ce93d8", elite: "#ef5350", chest: "#ffd54f", event: "#42a5f5", goblin: "#66bb6a" }[selectedPoi.type] || "#fff")
    : "#fff";

  return (
    <div className="min-h-screen" style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}06 0%, oklch(0.07 0.008 30) 55%)` }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b px-4 py-3 flex items-center justify-between"
        style={{ borderColor: "oklch(0.22 0.015 50)", background: "oklch(0.07 0.008 30 / 0.97)", backdropFilter: "blur(12px)" }}>
        <button onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-xs font-cinzel tracking-wide"
          style={{ color: "oklch(0.55 0.010 60)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = color; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.55 0.010 60)"; }}>
          <ChevronLeft size={13} /> Home
        </button>
        <div className="flex items-center gap-2">
          <Layers size={14} color={color} />
          <span className="font-cinzel-decorative text-sm font-bold" style={{ color: "oklch(0.78 0.18 55)" }}>
            Interactive Maps
          </span>
        </div>
        <div className="text-xs font-cinzel" style={{ color: "oklch(0.42 0.010 60)" }}>
          {act.name}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-5">

        {/* Act selector */}
        <div className="mb-4">
          <ActSelector acts={actsData} activeActId={activeActId} onSelect={handleActChange} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">

          {/* Left sidebar: zone list */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <div className="rounded border p-3" style={{ background: "oklch(0.09 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
              <p className="text-xs font-cinzel tracking-widest mb-3" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.55rem" }}>
                ZONES — {act.name.toUpperCase()}
              </p>
              <ZoneSidebar act={act} color={color} />

              {/* Act info */}
              <div className="mt-3 pt-3 border-t" style={{ borderColor: "oklch(0.18 0.012 30)" }}>
                <p className="text-xs font-cinzel font-bold mb-1" style={{ color }}>Boss</p>
                <p className="text-xs" style={{ color: "oklch(0.58 0.010 60)" }}>{act.boss.name}</p>
                <p className="text-xs" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.6rem" }}>{act.boss.location}</p>
                <p className="text-xs font-cinzel font-bold mt-2 mb-1" style={{ color }}>Keywarden</p>
                <p className="text-xs" style={{ color: "oklch(0.58 0.010 60)" }}>{act.keywarden?.name ?? "None"}</p>
                <p className="text-xs" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.6rem" }}>{act.keywarden?.location ?? ""}</p>
              </div>
            </div>
          </div>

          {/* Center: map + overlays */}
          <div className="xl:col-span-3 order-1 xl:order-2">
            {/* Overlay controls */}
            <div className="rounded border p-3 mb-3" style={{ background: "oklch(0.09 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
              <OverlayControls
                baseLayer={baseLayer} setBaseLayer={setBaseLayer}
                overlays={overlays} setOverlays={setOverlays}
                accentColor={color}
              />
            </div>

            {/* Map canvas */}
            <OverlayMapCanvas
              actId={activeActId}
              baseLayer={baseLayer}
              overlays={overlays}
              svgPois={svgPois}
              onPoiClick={handlePoiClick}
              selectedPoiId={selectedPoi?.id || null}
              accentColor={color}
              actName={act.name}
            />

            {/* POI detail panel */}
            {selectedPoi && (
              <PoiDetailPanel poi={selectedPoi} color={selectedPoiColor} onClose={() => setSelectedPoi(null)} />
            )}

            {/* Legend */}
            <MapLegend color={color} />
          </div>
        </div>
      </div>
    </div>
  );
}
