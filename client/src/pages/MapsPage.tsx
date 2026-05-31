// Sanctuary Grimoire — ArcGIS-Quality Interactive Maps
// Parchment base image + SVG zone polygons + connection graph + density heat map
// Multiple toggleable layers, zoom-dependent labels, full legend, GIS-style controls
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { ALL_ACT_GIS_DATA, ActGisData, ZonePolygon, GisPoi, ZoneConnection, FarmingRoute } from "@/data/gisMapData";
import {
  ChevronLeft, ChevronRight, Layers, Map, Eye, EyeOff,
  Star, X, Navigation, Sword, Package, Key, Zap,
  Info, AlertTriangle, Trophy, Shield, Users
} from "lucide-react";

// ─── Layer definitions ────────────────────────────────────────────────────────
interface LayerConfig {
  id: string;
  label: string;
  color: string;
  icon: React.ReactNode;
  defaultOn: boolean;
}

const LAYERS: LayerConfig[] = [
  { id: "zones",         label: "Zone Boundaries",   color: "#d4a843", icon: <Map size={11} />,        defaultOn: true },
  { id: "connections",   label: "Zone Connections",   color: "#80cbc4", icon: <Navigation size={11} />, defaultOn: true },
  { id: "density",       label: "Density Heat Map",   color: "#ef5350", icon: <Zap size={11} />,        defaultOn: false },
  { id: "waypoints",     label: "Teleport Points",    color: "#80cbc4", icon: <Navigation size={11} />, defaultOn: true },
  { id: "bosses",        label: "Boss Locations",     color: "#ff7043", icon: <Sword size={11} />,      defaultOn: true },
  { id: "elites",        label: "Elite Packs",        color: "#ef5350", icon: <AlertTriangle size={11} />, defaultOn: true },
  { id: "loot",          label: "Loot & Goblins",     color: "#ffd54f", icon: <Package size={11} />,    defaultOn: true },
  { id: "keywardens",    label: "Keywardens",         color: "#ce93d8", icon: <Key size={11} />,        defaultOn: true },
  { id: "entrances",     label: "Dungeon Entrances",  color: "#7eb8f7", icon: <Map size={11} />,        defaultOn: true },
  { id: "events",        label: "Events & Shrines",   color: "#42a5f5", icon: <Star size={11} />,       defaultOn: false },
  { id: "farming-route", label: "Farming Route",      color: "#ffd54f", icon: <Trophy size={11} />,     defaultOn: false },
  { id: "labels",        label: "Zone Labels",        color: "#e8c4a0", icon: <Info size={11} />,       defaultOn: true },
  { id: "grid",          label: "Coordinate Grid",    color: "#ffffff", icon: <Layers size={11} />,     defaultOn: false },
];

// ─── POI colors and icons ─────────────────────────────────────────────────────
const POI_COLORS: Record<string, string> = {
  waypoint: "#80cbc4", boss: "#ff7043", keywarden: "#ce93d8",
  elite: "#ef5350", chest: "#ffd54f", goblin: "#66bb6a",
  event: "#42a5f5", "dungeon-entrance": "#7eb8f7", exit: "#ef9a9a",
  entry: "#a5d6a7", npc: "#fff9c4", quest: "#ffcc02", shrine: "#80deea",
};

const POI_LAYER_MAP: Record<string, string> = {
  waypoint: "waypoints", boss: "bosses", keywarden: "keywardens",
  elite: "elites", chest: "loot", goblin: "loot",
  event: "events", shrine: "events", "dungeon-entrance": "entrances",
  exit: "zones", entry: "zones", npc: "zones", quest: "zones",
};

// ─── Zone type colors ─────────────────────────────────────────────────────────
const ZONE_FILLS: Record<string, string> = {
  town:       "rgba(212,168,67,0.18)",
  outdoor:    "rgba(100,160,80,0.15)",
  dungeon:    "rgba(80,100,180,0.18)",
  "boss-arena": "rgba(200,50,30,0.22)",
  special:    "rgba(140,80,200,0.18)",
  transition: "rgba(100,100,100,0.12)",
};

const ZONE_STROKES: Record<string, string> = {
  town:       "rgba(212,168,67,0.7)",
  outdoor:    "rgba(100,160,80,0.6)",
  dungeon:    "rgba(100,130,220,0.65)",
  "boss-arena": "rgba(220,80,50,0.75)",
  special:    "rgba(160,100,220,0.65)",
  transition: "rgba(150,150,150,0.5)",
};

// ─── Density heat map colors ──────────────────────────────────────────────────
function getDensityColor(density: number): string {
  const colors = ["transparent","rgba(0,200,100,0.12)","rgba(100,200,0,0.15)","rgba(255,200,0,0.18)","rgba(255,100,0,0.22)","rgba(255,0,0,0.28)"];
  return colors[Math.min(density, 5)] || "transparent";
}

// ─── SVG Map Renderer ─────────────────────────────────────────────────────────
function GisMapSvg({
  actData, layers, selectedPoiId, selectedZoneId, activeFarmingRouteId,
  onPoiClick, onZoneClick, zoom,
}: {
  actData: ActGisData;
  layers: Record<string, boolean>;
  selectedPoiId: string | null;
  selectedZoneId: string | null;
  activeFarmingRouteId: string | null;
  onPoiClick: (poi: GisPoi) => void;
  onZoneClick: (zone: ZonePolygon) => void;
  zoom: number;
}) {
  const ac = actData.accentColor;
  const showLabels = layers["labels"] && zoom >= 1.2;
  const showSmallLabels = layers["labels"] && zoom >= 1.8;

  // Farming route stops
  const farmingRoute = activeFarmingRouteId
    ? actData.farmingRoutes.find((r) => r.id === activeFarmingRouteId)
    : null;
  const farmingPoiIds = new Set(farmingRoute?.stops || []);
  const farmingPois = farmingRoute
    ? farmingRoute.stops.map((id) => actData.pois.find((p) => p.id === id)).filter(Boolean) as GisPoi[]
    : [];

  return (
    <svg
      viewBox={actData.viewBox}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={`glow-${actData.actId}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`poi-glow-${actData.actId}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <marker id={`arrow-${actData.actId}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 Z" fill="#ffd54f" opacity="0.9" />
        </marker>
        <marker id={`conn-arrow-${actData.actId}`} markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
          <path d="M0,0 L0,5 L5,2.5 Z" fill={`${ac}88`} opacity="0.7" />
        </marker>
      </defs>

      {/* ── Coordinate Grid ── */}
      {layers["grid"] && (
        <g opacity="0.15">
          {Array.from({ length: 10 }).map((_, i) => (
            <g key={i}>
              <line x1={i * 100} y1="0" x2={i * 100} y2="700" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4,4" />
              <line x1="0" y1={i * 70} x2="1000" y2={i * 70} stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4,4" />
              <text x={i * 100 + 3} y="12" fill="#ffffff" fontSize="8" fontFamily="monospace" opacity="0.6">{i * 100}</text>
            </g>
          ))}
        </g>
      )}

      {/* ── Zone Polygons ── */}
      {layers["zones"] && actData.zones.map((zone) => {
        const isSelected = selectedZoneId === zone.id;
        const fill = layers["density"] ? getDensityColor(zone.density) : ZONE_FILLS[zone.type] || "rgba(100,100,100,0.1)";
        const stroke = ZONE_STROKES[zone.type] || ac;
        const points = zone.polygon.map(([x, y]) => `${x * 10},${y * 7}`).join(" ");

        return (
          <g key={zone.id} onClick={() => onZoneClick(zone)} style={{ cursor: "pointer" }}>
            {/* Density heat map fill */}
            {layers["density"] && (
              <polygon points={points} fill={getDensityColor(zone.density)} stroke="none" />
            )}
            {/* Zone fill */}
            <polygon
              points={points}
              fill={isSelected ? `${stroke}28` : fill}
              stroke={isSelected ? stroke : `${stroke}88`}
              strokeWidth={isSelected ? 2 : 1}
              filter={isSelected ? `url(#glow-${actData.actId})` : undefined}
            />
            {/* Selected highlight */}
            {isSelected && (
              <polygon points={points} fill="none" stroke={stroke} strokeWidth="1" strokeDasharray="6,3" opacity="0.5" />
            )}
            {/* Zone label */}
            {layers["labels"] && (
              <text
                x={zone.centroid[0] * 10}
                y={zone.centroid[1] * 7}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isSelected ? stroke : "#e8c4a0"}
                fontSize={isSelected ? "9" : "7.5"}
                fontFamily="'Cinzel', serif"
                fontWeight={isSelected ? "bold" : "normal"}
                opacity={isSelected ? 1 : 0.8}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {zone.name.length > 20 ? zone.name.slice(0, 18) + "…" : zone.name}
              </text>
            )}
            {/* Farming rating stars (shown when density layer is on) */}
            {layers["density"] && showSmallLabels && (
              <text
                x={zone.centroid[0] * 10}
                y={zone.centroid[1] * 7 + 10}
                textAnchor="middle"
                fill="#ffd54f"
                fontSize="7"
                fontFamily="monospace"
                opacity="0.7"
                style={{ pointerEvents: "none" }}
              >
                {"★".repeat(zone.farmingRating)}{"☆".repeat(5 - zone.farmingRating)}
              </text>
            )}
          </g>
        );
      })}

      {/* ── Zone Connections ── */}
      {layers["connections"] && actData.connections.map((conn, i) => {
        const fromZone = actData.zones.find((z) => z.id === conn.from);
        const toZone = actData.zones.find((z) => z.id === conn.to);
        if (!fromZone || !toZone) return null;

        const connColor = conn.type === "act-transition" ? "#ffd54f"
          : conn.type === "dungeon" ? "#7eb8f7"
          : conn.type === "optional" ? `${ac}55`
          : `${ac}66`;

        const pathStr = conn.path.length >= 2
          ? `M${conn.path[0][0] * 10},${conn.path[0][1] * 7} L${conn.path[conn.path.length - 1][0] * 10},${conn.path[conn.path.length - 1][1] * 7}`
          : `M${fromZone.centroid[0] * 10},${fromZone.centroid[1] * 7} L${toZone.centroid[0] * 10},${toZone.centroid[1] * 7}`;

        return (
          <g key={`conn-${i}`}>
            {/* Glow */}
            <path d={pathStr} fill="none" stroke={connColor} strokeWidth="4" strokeOpacity="0.12" />
            {/* Main line */}
            <path
              d={pathStr}
              fill="none"
              stroke={connColor}
              strokeWidth={conn.type === "main-path" ? 1.5 : 1}
              strokeDasharray={conn.type === "optional" ? "6,4" : conn.type === "dungeon" ? "4,3" : undefined}
              markerEnd={conn.bidirectional ? undefined : `url(#conn-arrow-${actData.actId})`}
              opacity={0.7}
            />
          </g>
        );
      })}

      {/* ── Farming Route ── */}
      {layers["farming-route"] && farmingPois.length >= 2 && (
        <g>
          {/* Route path */}
          <polyline
            points={farmingPois.map((p) => `${p.x * 10},${p.y * 7}`).join(" ")}
            fill="none" stroke="#ffd54f" strokeWidth="3" strokeOpacity="0.25"
          />
          <polyline
            points={farmingPois.map((p) => `${p.x * 10},${p.y * 7}`).join(" ")}
            fill="none" stroke="#ffd54f" strokeWidth="1.5" strokeOpacity="0.85"
            strokeDasharray="8,5"
            markerMid={`url(#arrow-${actData.actId})`}
          />
          {/* Step numbers */}
          {farmingPois.map((p, idx) => (
            <g key={`route-${idx}`}>
              <circle cx={p.x * 10} cy={p.y * 7} r="8" fill="rgba(5,3,8,0.9)" stroke="#ffd54f" strokeWidth="1.5" />
              <text x={p.x * 10} y={p.y * 7 + 1} textAnchor="middle" dominantBaseline="middle"
                fill="#ffd54f" fontSize="7" fontFamily="'Cinzel', serif" fontWeight="bold"
                style={{ pointerEvents: "none" }}>
                {idx + 1}
              </text>
            </g>
          ))}
        </g>
      )}

      {/* ── POI Markers ── */}
      {actData.pois.map((poi) => {
        const layerId = POI_LAYER_MAP[poi.type] || "zones";
        if (!layers[layerId]) return null;

        const isSelected = selectedPoiId === poi.id;
        const isOnRoute = farmingPoiIds.has(poi.id) && layers["farming-route"];
        const color = POI_COLORS[poi.type] || "#fff";
        const cx = poi.x * 10;
        const cy = poi.y * 7;
        const r = isSelected ? 8 : poi.type === "boss" ? 6 : poi.type === "keywarden" ? 6 : 5;

        return (
          <g key={poi.id} onClick={(e) => { e.stopPropagation(); onPoiClick(poi); }}
            style={{ cursor: "pointer" }}
            filter={isSelected ? `url(#poi-glow-${actData.actId})` : undefined}>

            {/* Outer pulse ring */}
            <circle cx={cx} cy={cy} r={r + 5}
              fill={color} fillOpacity={isSelected ? 0.15 : isOnRoute ? 0.12 : 0.06}
              stroke={color} strokeWidth="0.8" strokeOpacity={isSelected ? 0.6 : 0.25} />

            {/* Main marker */}
            <circle cx={cx} cy={cy} r={r}
              fill={isSelected ? color : `${color}44`}
              stroke={color} strokeWidth={isSelected ? 2 : 1.5} />

            {/* Center dot */}
            <circle cx={cx} cy={cy} r={isSelected ? 3 : 2}
              fill={color} opacity={isSelected ? 1 : 0.85} />

            {/* Type indicator ring for bosses/keywardens */}
            {(poi.type === "boss" || poi.type === "keywarden") && (
              <circle cx={cx} cy={cy} r={r + 3}
                fill="none" stroke={color} strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
            )}

            {/* Label */}
            {(isSelected || (showLabels && (poi.type === "waypoint" || poi.type === "boss" || poi.type === "keywarden"))) && (
              <g>
                <rect
                  x={cx - poi.name.length * 2.8 - 4}
                  y={cy - 22}
                  width={poi.name.length * 5.6 + 8}
                  height={13}
                  rx="2"
                  fill="rgba(5,3,8,0.92)"
                  stroke={color}
                  strokeWidth="0.8"
                  strokeOpacity="0.7"
                />
                <text x={cx} y={cy - 13}
                  fill={color} fontSize="7.5" fontFamily="'Cinzel', serif"
                  fontWeight="bold" textAnchor="middle"
                  style={{ pointerEvents: "none", userSelect: "none" }}>
                  {poi.name.length > 22 ? poi.name.slice(0, 20) + "…" : poi.name}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* ── Act label ── */}
      <text x="18" y="22" fill={ac} fontSize="14"
        fontFamily="'Cinzel Decorative', serif" fontWeight="bold" opacity="0.8">
        {actData.actName.toUpperCase()}
      </text>
      <text x="18" y="34" fill={ac} fontSize="8"
        fontFamily="'Cinzel', serif" opacity="0.55">
        {actData.subtitle}
      </text>

      {/* ── Legend indicators ── */}
      {layers["density"] && (
        <g transform="translate(820, 660)">
          <rect x="-2" y="-12" width="170" height="18" rx="3" fill="rgba(5,3,8,0.85)" />
          <text x="0" y="0" fill="#e8c4a0" fontSize="6.5" fontFamily="'Cinzel', serif">
            DENSITY: LOW
          </text>
          {[1,2,3,4,5].map((d, i) => (
            <rect key={d} x={60 + i * 12} y="-10" width="10" height="8" rx="1"
              fill={getDensityColor(d)} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          ))}
          <text x="125" y="0" fill="#e8c4a0" fontSize="6.5" fontFamily="'Cinzel', serif">HIGH</text>
        </g>
      )}
    </svg>
  );
}

// ─── Pannable canvas ──────────────────────────────────────────────────────────
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.25;       // Button zoom step
const WHEEL_ZOOM_FACTOR = 0.08; // Scroll wheel zoom — much gentler than before

function MapCanvas({
  actData, layers, selectedPoiId, selectedZoneId, activeFarmingRouteId,
  onPoiClick, onZoneClick,
}: {
  actData: ActGisData;
  layers: Record<string, boolean>;
  selectedPoiId: string | null;
  selectedZoneId: string | null;
  activeFarmingRouteId: string | null;
  onPoiClick: (poi: GisPoi) => void;
  onZoneClick: (zone: ZonePolygon) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef<number | null>(null);

  const clamp = useCallback((tx: number, ty: number, scale: number) => {
    const c = containerRef.current;
    if (!c) return { x: tx, y: ty };
    return {
      x: Math.min(0, Math.max(c.clientWidth - c.clientWidth * scale, tx)),
      y: Math.min(0, Math.max(c.clientHeight - c.clientHeight * scale, ty)),
    };
  }, []);

  const zoomAt = useCallback((cx: number, cy: number, delta: number) => {
    const c = containerRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const px = cx - rect.left;
    const py = cy - rect.top;
    setTransform((prev) => {
      const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev.scale + delta));
      const ratio = newScale / prev.scale;
      const nx = px - ratio * (px - prev.x);
      const ny = py - ratio * (py - prev.y);
      const clamped = clamp(nx, ny, newScale);
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
    // Normalize deltaY across different devices/browsers
    // deltaMode 0 = pixels, 1 = lines, 2 = pages
    const rawDelta = e.deltaMode === 1 ? e.deltaY * 20 : e.deltaMode === 2 ? e.deltaY * 300 : e.deltaY;
    // Clamp to prevent runaway zooming on trackpads
    const clampedDelta = Math.max(-60, Math.min(60, rawDelta));
    const zoomDelta = -(clampedDelta * WHEEL_ZOOM_FACTOR) / 60;
    zoomAt(e.clientX, e.clientY, zoomDelta);
  }, [zoomAt]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) { isDragging.current = true; lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }
    else if (e.touches.length === 2) { isDragging.current = false; const dx = e.touches[0].clientX - e.touches[1].clientX; const dy = e.touches[0].clientY - e.touches[1].clientY; lastPinchDist.current = Math.sqrt(dx*dx+dy*dy); }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging.current) {
      const dx = e.touches[0].clientX - lastPos.current.x; const dy = e.touches[0].clientY - lastPos.current.y;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setTransform((prev) => { const c = clamp(prev.x+dx, prev.y+dy, prev.scale); return { ...prev, ...c }; });
    } else if (e.touches.length === 2 && lastPinchDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX; const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx*dx+dy*dy); const delta = (dist - lastPinchDist.current) * 0.012;
      lastPinchDist.current = dist;
      const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2; const my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      zoomAt(mx, my, delta);
    }
  }, [clamp, zoomAt]);

  const onTouchEnd = useCallback(() => { isDragging.current = false; lastPinchDist.current = null; }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const h = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", h, { passive: false });
    return () => el.removeEventListener("wheel", h);
  }, []);

  const resetView = () => setTransform({ x: 0, y: 0, scale: 1 });
  const zoomIn = () => { const c = containerRef.current; if (c) zoomAt(c.clientWidth/2, c.clientHeight/2, ZOOM_STEP); };
  const zoomOut = () => { const c = containerRef.current; if (c) zoomAt(c.clientWidth/2, c.clientHeight/2, -ZOOM_STEP); };

  return (
    <div ref={containerRef}
      className="relative overflow-hidden rounded border select-none"
      style={{ aspectRatio: "16/9", minHeight: "380px", cursor: isDragging.current ? "grabbing" : "grab", touchAction: "none", background: "#050308", borderColor: `${actData.accentColor}33` }}
      onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      onWheel={onWheel} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>

      {/* Transformable layer */}
      <div style={{ position: "absolute", inset: 0, transform: `translate(${transform.x}px,${transform.y}px) scale(${transform.scale})`, transformOrigin: "0 0", willChange: "transform", width: "100%", height: "100%" }}>
        {/* Parchment base image */}
        <img src={actData.parchmentImage} alt={actData.actName} draggable={false}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
        {/* Dark overlay to improve SVG visibility */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(5,3,8,0.35)", pointerEvents: "none" }} />
        {/* GIS SVG overlay */}
        <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <GisMapSvg actData={actData} layers={layers} selectedPoiId={selectedPoiId}
            selectedZoneId={selectedZoneId} activeFarmingRouteId={activeFarmingRouteId}
            onPoiClick={onPoiClick} onZoneClick={onZoneClick} zoom={transform.scale} />
        </div>
      </div>

      {/* Fixed controls */}
      <div style={{ position: "absolute", bottom: "12px", right: "12px", display: "flex", flexDirection: "column", gap: "4px", zIndex: 50 }}>
        {[{l:"+",fn:zoomIn},{l:"−",fn:zoomOut},{l:"⊡",fn:resetView}].map((b) => (
          <button key={b.l} onClick={(e) => { e.stopPropagation(); b.fn(); }}
            style={{ width:30, height:30, borderRadius:"6px", display:"flex", alignItems:"center", justifyContent:"center", background:"oklch(0.10 0.010 30 / 0.92)", border:`1px solid ${actData.accentColor}44`, color:actData.accentColor, cursor:"pointer", backdropFilter:"blur(4px)", fontSize:"14px", fontWeight:"bold" }}>
            {b.l}
          </button>
        ))}
      </div>

      {/* Zoom indicator */}
      <div style={{ position:"absolute", bottom:"12px", left:"12px", zIndex:50, background:"oklch(0.09 0.010 30 / 0.88)", border:`1px solid ${actData.accentColor}33`, borderRadius:"4px", padding:"3px 8px", backdropFilter:"blur(4px)" }}>
        <span style={{ color:"oklch(0.45 0.010 60)", fontFamily:"'Cinzel', serif", fontSize:"0.52rem" }}>{Math.round(transform.scale*100)}%</span>
      </div>

      {/* Hint */}
      <div style={{ position:"absolute", top:"10px", left:"50%", transform:"translateX(-50%)", zIndex:50, background:"oklch(0.09 0.010 30 / 0.78)", border:`1px solid ${actData.accentColor}22`, borderRadius:"4px", padding:"3px 10px", backdropFilter:"blur(4px)", pointerEvents:"none" }}>
        <span style={{ color:"oklch(0.38 0.010 60)", fontFamily:"'Cinzel', serif", fontSize:"0.5rem" }}>Drag to pan · Scroll to zoom · Click zones & markers for details</span>
      </div>
    </div>
  );
}

// ─── POI Detail Panel ─────────────────────────────────────────────────────────
function PoiDetailPanel({ poi, accentColor, onClose }: { poi: GisPoi; accentColor: string; onClose: () => void }) {
  const color = POI_COLORS[poi.type] || accentColor;
  const typeLabels: Record<string, string> = {
    waypoint: "Teleport Waypoint", boss: "Boss", keywarden: "Keywarden",
    elite: "Elite Pack Spawn", chest: "Resplendent Chest", goblin: "Treasure Goblin",
    event: "Event", "dungeon-entrance": "Dungeon Entrance", exit: "Zone Exit",
    entry: "Zone Entry", shrine: "Shrine", npc: "NPC", quest: "Quest Location",
  };
  return (
    <div className="p-4 rounded border mt-3" style={{ background: `${color}08`, borderColor: `${color}44` }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.90 0.01 60)" }}>{poi.name}</h3>
            <span className="text-xs px-2 py-0.5 rounded-sm" style={{ background: `${color}18`, color, border: `1px solid ${color}33`, fontFamily: "'Cinzel', serif", fontSize: "0.58rem" }}>
              {typeLabels[poi.type] || poi.type}
            </span>
            {poi.sublabel && <span className="text-xs" style={{ color: "oklch(0.48 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.58rem" }}>{poi.sublabel}</span>}
          </div>
          <p className="text-xs leading-relaxed mb-2" style={{ color: "oklch(0.60 0.010 60)" }}>{poi.details.description}</p>
          <div className="flex items-start gap-1.5">
            <span className="text-xs flex-shrink-0" style={{ color: "#ffd54f" }}>★</span>
            <p className="text-xs leading-relaxed" style={{ color: "oklch(0.65 0.010 60)" }}>{poi.details.tip}</p>
          </div>
          {poi.details.drops && (
            <p className="text-xs mt-1.5" style={{ color: "#ffd54f", fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
              DROPS: {poi.details.drops}
            </p>
          )}
          {poi.details.difficulty && (
            <p className="text-xs mt-0.5" style={{ color: "#ef5350", fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
              DIFFICULTY: {poi.details.difficulty}
            </p>
          )}
        </div>
        <button onClick={onClose} className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
          style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.45 0.010 60)" }}>
          <X size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Zone Detail Panel ────────────────────────────────────────────────────────
function ZoneDetailPanel({ zone, accentColor, onClose }: { zone: ZonePolygon; accentColor: string; onClose: () => void }) {
  const typeColors: Record<string, string> = { town: "#d4a843", outdoor: "#66bb6a", dungeon: "#7eb8f7", "boss-arena": "#ff7043", special: "#ce93d8" };
  const color = typeColors[zone.type] || accentColor;
  return (
    <div className="p-4 rounded border mt-3" style={{ background: `${color}08`, borderColor: `${color}44` }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.90 0.01 60)" }}>{zone.name}</h3>
            <span className="text-xs px-2 py-0.5 rounded-sm capitalize" style={{ background: `${color}18`, color, border: `1px solid ${color}33`, fontFamily: "'Cinzel', serif", fontSize: "0.58rem" }}>
              {zone.type.replace("-", " ")}
            </span>
            {zone.level && <span className="text-xs px-2 py-0.5 rounded-sm" style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.55 0.010 60)", border: "1px solid oklch(0.20 0.012 30)", fontFamily: "'Cinzel', serif", fontSize: "0.58rem" }}>Level {zone.level}</span>}
          </div>
          <p className="text-xs leading-relaxed mb-2" style={{ color: "oklch(0.60 0.010 60)" }}>{zone.description}</p>
          <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
            <div>
              <span className="font-cinzel" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.55rem" }}>DENSITY</span>
              <div className="flex gap-0.5 mt-0.5">
                {[1,2,3,4,5].map((i) => <div key={i} className="w-3 h-1.5 rounded-sm" style={{ background: i <= zone.density ? color : "oklch(0.22 0.015 50)" }} />)}
              </div>
            </div>
            <div>
              <span className="font-cinzel" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.55rem" }}>FARMING RATING</span>
              <div className="flex gap-0.5 mt-0.5">
                {[1,2,3,4,5].map((i) => <Star key={i} size={9} fill={i <= zone.farmingRating ? "#ffd54f" : "transparent"} style={{ color: i <= zone.farmingRating ? "#ffd54f" : "oklch(0.28 0.010 60)" }} />)}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-1.5 mb-1.5">
            <span className="text-xs flex-shrink-0" style={{ color: "#ffd54f" }}>★</span>
            <p className="text-xs" style={{ color: "oklch(0.65 0.010 60)" }}>{zone.farmingTip}</p>
          </div>
          {zone.monsterTypes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {zone.monsterTypes.map((m) => (
                <span key={m} className="text-xs px-1.5 py-0.5 rounded-sm" style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.50 0.010 60)", border: "1px solid oklch(0.20 0.012 30)", fontFamily: "'Cinzel', serif", fontSize: "0.52rem" }}>{m}</span>
              ))}
            </div>
          )}
        </div>
        <button onClick={onClose} className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
          style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.45 0.010 60)" }}>
          <X size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Maps Page ───────────────────────────────────────────────────────────
export default function MapsPage() {
  const [, navigate] = useLocation();
  const [activeActId, setActiveActId] = useState("act1");
  const [layers, setLayers] = useState<Record<string, boolean>>(
    Object.fromEntries(LAYERS.map((l) => [l.id, l.defaultOn]))
  );
  const [selectedPoi, setSelectedPoi] = useState<GisPoi | null>(null);
  const [selectedZone, setSelectedZone] = useState<ZonePolygon | null>(null);
  const [activeFarmingRoute, setActiveFarmingRoute] = useState<string | null>(null);
  const [sidebarTab, setSidebarTab] = useState<"layers" | "zones" | "farming">("layers");

  const actData = ALL_ACT_GIS_DATA[activeActId];
  const ac = actData.accentColor;

  const toggleLayer = (id: string) => setLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  const handleActChange = (id: string) => { setActiveActId(id); setSelectedPoi(null); setSelectedZone(null); setActiveFarmingRoute(null); };
  const handlePoiClick = (poi: GisPoi) => { setSelectedPoi(selectedPoi?.id === poi.id ? null : poi); setSelectedZone(null); };
  const handleZoneClick = (zone: ZonePolygon) => { setSelectedZone(selectedZone?.id === zone.id ? null : zone); setSelectedPoi(null); };

  const poiCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    actData.pois.forEach((p) => { counts[p.type] = (counts[p.type] || 0) + 1; });
    return counts;
  }, [actData]);

  return (
    <div className="min-h-screen" style={{ background: `radial-gradient(ellipse at 50% 0%, ${ac}06 0%, oklch(0.07 0.008 30) 55%)` }}>
      <div className="max-w-8xl mx-auto px-4 py-5">

        {/* ── Act selector ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: "none" }}>
          {Object.values(ALL_ACT_GIS_DATA).map((act) => {
            const isActive = act.actId === activeActId;
            return (
              <button key={act.actId} onClick={() => handleActChange(act.actId)}
                className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2.5 rounded border transition-all duration-200"
                style={{ background: isActive ? `${act.accentColor}18` : "oklch(0.10 0.010 30)", borderColor: isActive ? act.accentColor : "oklch(0.22 0.015 50)", boxShadow: isActive ? `0 0 12px ${act.accentColor}22` : "none" }}>
                <div className="w-16 h-10 rounded overflow-hidden" style={{ border: `1px solid ${isActive ? act.accentColor + "66" : "oklch(0.22 0.015 50)"}` }}>
                  <img src={act.parchmentImage} alt={act.actName} className="w-full h-full object-cover" style={{ filter: isActive ? "brightness(0.85)" : "brightness(0.45) saturate(0.6)" }} />
                </div>
                <span className="font-cinzel font-bold whitespace-nowrap" style={{ color: isActive ? act.accentColor : "oklch(0.52 0.010 60)", fontSize: "0.62rem" }}>{act.actName}</span>
                <span className="font-cinzel whitespace-nowrap text-center" style={{ color: isActive ? `${act.accentColor}aa` : "oklch(0.38 0.010 60)", fontSize: "0.5rem", maxWidth: "80px", lineHeight: 1.2 }}>{act.subtitle.split("—")[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* ── Act header ── */}
        <div className="flex items-center gap-4 mb-4 p-3 rounded border" style={{ background: `${ac}0a`, borderColor: `${ac}2a` }}>
          <div className="flex-1">
            <h2 className="font-cinzel-decorative font-black text-xl" style={{ color: ac }}>{actData.actName}</h2>
            <p className="text-xs font-cinzel" style={{ color: "oklch(0.50 0.010 60)" }}>{actData.subtitle}</p>
          </div>
          <div className="flex gap-3 text-xs font-cinzel flex-wrap">
            <span style={{ color: "oklch(0.45 0.010 60)" }}>{actData.zones.length} Zones</span>
            <span style={{ color: "#80cbc4" }}>{poiCounts["waypoint"] || 0} Waypoints</span>
            <span style={{ color: "#ff7043" }}>{poiCounts["boss"] || 0} Bosses</span>
            <span style={{ color: "#ef5350" }}>{poiCounts["elite"] || 0} Elite Spawns</span>
            <span style={{ color: "#ffd54f" }}>{(poiCounts["chest"] || 0) + (poiCounts["goblin"] || 0)} Loot Sources</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">

          {/* ── Left sidebar ── */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            {/* Sidebar tabs */}
            <div className="flex border-b mb-3" style={{ borderColor: "oklch(0.22 0.015 50)" }}>
              {[{ id: "layers", label: "Layers" }, { id: "zones", label: "Zones" }, { id: "farming", label: "Routes" }].map((tab) => (
                <button key={tab.id} onClick={() => setSidebarTab(tab.id as typeof sidebarTab)}
                  className="flex-1 py-2 text-xs font-cinzel tracking-wide border-b-2 transition-all"
                  style={{ borderColor: sidebarTab === tab.id ? ac : "transparent", color: sidebarTab === tab.id ? ac : "oklch(0.45 0.010 60)", background: sidebarTab === tab.id ? `${ac}08` : "transparent" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Layers panel */}
            {sidebarTab === "layers" && (
              <div className="space-y-3">
                {/* Smart presets */}
                <div>
                  <p className="text-xs font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>QUICK VIEW</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: "Overview",  icon: <Map size={11} />,      color: "#d4a843", layers: { zones: true, connections: true, labels: true, waypoints: true, bosses: false, elites: false, loot: false, keywardens: false, entrances: true, events: false, density: false, "farming-route": false, grid: false } },
                      { label: "Farming",   icon: <Trophy size={11} />,   color: "#ffd54f", layers: { zones: true, connections: false, labels: true, waypoints: true, bosses: false, elites: true, loot: true, keywardens: true, entrances: false, events: false, density: true, "farming-route": false, grid: false } },
                      { label: "Bosses",    icon: <Sword size={11} />,    color: "#ff7043", layers: { zones: true, connections: true, labels: true, waypoints: true, bosses: true, elites: false, loot: false, keywardens: true, entrances: false, events: false, density: false, "farming-route": false, grid: false } },
                      { label: "All Data",  icon: <Layers size={11} />,   color: "#ce93d8", layers: Object.fromEntries(LAYERS.map((l) => [l.id, l.id !== "grid"])) },
                    ].map((preset) => (
                      <button key={preset.label}
                        onClick={() => setLayers(preset.layers as Record<string, boolean>)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded border text-left transition-all duration-150"
                        style={{ background: `${preset.color}10`, borderColor: `${preset.color}44`, color: preset.color }}>
                        {preset.icon}
                        <span className="font-cinzel font-bold" style={{ fontSize: "0.6rem" }}>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t" style={{ borderColor: "oklch(0.18 0.012 30)" }} />

                {/* Individual toggles */}
                <div>
                  <p className="text-xs font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>INDIVIDUAL LAYERS</p>
                  <div className="space-y-1">
                    {LAYERS.filter((l) => l.id !== "grid").map((layer) => {
                      const isOn = layers[layer.id];
                      return (
                        <button key={layer.id} onClick={() => toggleLayer(layer.id)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded border transition-all duration-150 text-left"
                          style={{ background: isOn ? `${layer.color}10` : "oklch(0.09 0.008 30)", borderColor: isOn ? `${layer.color}33` : "oklch(0.16 0.010 30)" }}>
                          <div className="flex-shrink-0 w-3.5 h-3.5 rounded flex items-center justify-center"
                            style={{ background: isOn ? layer.color : "oklch(0.14 0.012 30)" }}>
                            {isOn
                              ? <span style={{ fontSize: "8px", color: "oklch(0.08 0 0)", fontWeight: "bold" }}>✓</span>
                              : <span style={{ fontSize: "7px", color: "oklch(0.35 0.010 60)" }}>—</span>}
                          </div>
                          <span className="text-xs font-cinzel flex-1" style={{ color: isOn ? "oklch(0.78 0.01 60)" : "oklch(0.38 0.010 60)", fontSize: "0.58rem" }}>{layer.label}</span>
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: isOn ? layer.color : "oklch(0.20 0.015 50)" }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Zones panel */}
            {sidebarTab === "zones" && (
              <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: `${ac}44 transparent` }}>
                {actData.zones.map((zone) => {
                  const isSelected = selectedZone?.id === zone.id;
                  const typeColors: Record<string, string> = { town: "#d4a843", outdoor: "#66bb6a", dungeon: "#7eb8f7", "boss-arena": "#ff7043", special: "#ce93d8" };
                  const color = typeColors[zone.type] || ac;
                  return (
                    <button key={zone.id} onClick={() => handleZoneClick(zone)}
                      className="w-full flex items-start gap-2 p-2.5 rounded border text-left transition-all duration-150"
                      style={{ background: isSelected ? `${color}12` : "oklch(0.10 0.010 30)", borderColor: isSelected ? `${color}55` : "oklch(0.22 0.015 50)" }}>
                      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: color }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-cinzel font-bold text-xs leading-tight" style={{ color: isSelected ? color : "oklch(0.80 0.01 60)" }}>{zone.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span style={{ color: "oklch(0.40 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.5rem" }}>{zone.type.replace("-"," ")}</span>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map((i) => <div key={i} className="w-2 h-1 rounded-sm" style={{ background: i <= zone.density ? color : "oklch(0.22 0.015 50)" }} />)}
                          </div>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map((i) => <Star key={i} size={7} fill={i <= zone.farmingRating ? "#ffd54f" : "transparent"} style={{ color: i <= zone.farmingRating ? "#ffd54f" : "oklch(0.25 0.010 60)" }} />)}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Farming routes panel */}
            {sidebarTab === "farming" && (
              <div className="space-y-2">
                {actData.farmingRoutes.map((route) => {
                  const isActive = activeFarmingRoute === route.id;
                  const tierColors = { S: "#ffd54f", A: "#66bb6a", B: "#42a5f5" };
                  const tc = tierColors[route.tier];
                  return (
                    <div key={route.id} className="rounded border p-3" style={{ background: isActive ? `${tc}10` : "oklch(0.10 0.010 30)", borderColor: isActive ? `${tc}55` : "oklch(0.22 0.015 50)" }}>
                      <div className="flex items-start gap-2 mb-2">
                        <span className="font-cinzel font-black text-xs flex-shrink-0" style={{ color: tc }}>{route.tier}</span>
                        <div className="flex-1">
                          <p className="font-cinzel font-bold text-xs" style={{ color: "oklch(0.85 0.01 60)" }}>{route.name}</p>
                          <p className="text-xs mt-0.5" style={{ color: "oklch(0.52 0.010 60)", fontSize: "0.6rem" }}>{route.estimatedTime} · {route.stops.length} stops</p>
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed mb-2" style={{ color: "oklch(0.55 0.010 60)", fontSize: "0.62rem" }}>{route.description}</p>
                      <button
                        onClick={() => {
                          setActiveFarmingRoute(isActive ? null : route.id);
                          setLayers((prev) => ({ ...prev, "farming-route": !isActive }));
                        }}
                        className="w-full py-1.5 rounded font-cinzel font-bold text-xs transition-all"
                        style={{ background: isActive ? tc : `${tc}18`, color: isActive ? "oklch(0.08 0 0)" : tc, border: `1px solid ${tc}44` }}>
                        {isActive ? "✓ Route Active" : "Show Route"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Main map area ── */}
          <div className="xl:col-span-3 order-1 xl:order-2">
            <MapCanvas
              actData={actData}
              layers={layers}
              selectedPoiId={selectedPoi?.id || null}
              selectedZoneId={selectedZone?.id || null}
              activeFarmingRouteId={activeFarmingRoute}
              onPoiClick={handlePoiClick}
              onZoneClick={handleZoneClick}
            />

            {/* Detail panels */}
            {selectedPoi && <PoiDetailPanel poi={selectedPoi} accentColor={ac} onClose={() => setSelectedPoi(null)} />}
            {selectedZone && !selectedPoi && <ZoneDetailPanel zone={selectedZone} accentColor={ac} onClose={() => setSelectedZone(null)} />}

            {/* Legend */}
            <div className="mt-3 p-3 rounded border" style={{ background: "oklch(0.09 0.010 30)", borderColor: "oklch(0.20 0.015 50)" }}>
              <p className="text-xs font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>MAP LEGEND</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-1.5">
                {/* Zone types */}
                {[
                  { color: "#d4a843", label: "Town / Hub" },
                  { color: "#66bb6a", label: "Outdoor Zone" },
                  { color: "#7eb8f7", label: "Dungeon" },
                  { color: "#ff7043", label: "Boss Arena" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: `${item.color}30`, border: `1.5px solid ${item.color}` }} />
                    <span style={{ color: "oklch(0.48 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.52rem" }}>{item.label}</span>
                  </div>
                ))}
                {/* POI types */}
                {Object.entries(POI_COLORS).slice(0, 8).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: `${color}33`, border: `1.5px solid ${color}` }} />
                    <span style={{ color: "oklch(0.48 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.52rem" }}>
                      {type === "dungeon-entrance" ? "Dungeon" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </div>
                ))}
                {/* Connection types */}
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 flex-shrink-0" style={{ background: `${ac}88` }} />
                  <span style={{ color: "oklch(0.48 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.52rem" }}>Main Path</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 flex-shrink-0" style={{ background: "#7eb8f788", borderTop: "1px dashed #7eb8f7" }} />
                  <span style={{ color: "oklch(0.48 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.52rem" }}>Dungeon Entry</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 flex-shrink-0" style={{ background: "#ffd54f88", borderTop: "1px dashed #ffd54f" }} />
                  <span style={{ color: "oklch(0.48 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.52rem" }}>Farming Route</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
