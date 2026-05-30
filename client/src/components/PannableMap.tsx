// Sanctuary Grimoire — Pannable / Zoomable Map Canvas
// Google Maps-style: click-drag to pan, scroll to zoom, pinch to zoom on mobile
import { useRef, useState, useCallback, useEffect } from "react";
import { PointOfInterest, POI_TYPE_COLORS, POI_TYPE_LABELS } from "@/data/maps";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface PannableMapProps {
  bgImage: string;
  pois: PointOfInterest[];
  selectedPoiId: string | null;
  onPoiClick: (poi: PointOfInterest) => void;
  accentColor: string;
  actName: string;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.3;

function PoiIcon({ type, size = 12 }: { type: string; size?: number }) {
  // SVG path icons for each POI type — no external icon library needed in canvas context
  const paths: Record<string, string> = {
    elite:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    keywarden:"M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
    boss:     "M13 10V3L4 14h7v7l9-11h-7z",
    loot:     "M20 12V22H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z",
    goblin:   "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z",
    event:    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    dungeon:  "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    waypoint: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    chest:    "M5 8h14M5 8a2 2 0 1 0 0-4h14a2 2 0 1 0 0 4M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8m-9 4h4",
  };
  const d = paths[type] || paths.waypoint;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function PannableMap({
  bgImage, pois, selectedPoiId, onPoiClick, accentColor, actName,
}: PannableMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef<number | null>(null);

  // ── Clamp pan so map never goes out of bounds ──────────────────────────────
  const clamp = useCallback((tx: number, ty: number, scale: number) => {
    const container = containerRef.current;
    if (!container) return { x: tx, y: ty };
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const mapW = cw * scale;
    const mapH = ch * scale;
    const maxX = 0;
    const minX = cw - mapW;
    const maxY = 0;
    const minY = ch - mapH;
    return {
      x: Math.min(maxX, Math.max(minX, tx)),
      y: Math.min(maxY, Math.max(minY, ty)),
    };
  }, []);

  // ── Zoom centered on a point ───────────────────────────────────────────────
  const zoomAt = useCallback((clientX: number, clientY: number, delta: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;

    setTransform((prev) => {
      const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev.scale + delta));
      const scaleRatio = newScale / prev.scale;
      const newX = cx - scaleRatio * (cx - prev.x);
      const newY = cy - scaleRatio * (cy - prev.y);
      const clamped = clamp(newX, newY, newScale);
      return { x: clamped.x, y: clamped.y, scale: newScale };
    });
  }, [clamp]);

  // ── Mouse events ───────────────────────────────────────────────────────────
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
    const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
    zoomAt(e.clientX, e.clientY, delta);
  }, [zoomAt]);

  // ── Touch events (pinch + drag) ────────────────────────────────────────────
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
      const delta = (dist - lastPinchDist.current) * 0.01;
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

  // ── Prevent default wheel scroll on the container ─────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  // ── Reset view ─────────────────────────────────────────────────────────────
  const resetView = () => setTransform({ x: 0, y: 0, scale: 1 });
  const zoomIn = () => {
    const container = containerRef.current;
    if (!container) return;
    zoomAt(container.clientWidth / 2, container.clientHeight / 2, ZOOM_STEP);
  };
  const zoomOut = () => {
    const container = containerRef.current;
    if (!container) return;
    zoomAt(container.clientWidth / 2, container.clientHeight / 2, -ZOOM_STEP);
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded border select-none"
      style={{
        borderColor: `${accentColor}33`,
        aspectRatio: "16/9",
        minHeight: "280px",
        cursor: isDragging.current ? "grabbing" : "grab",
        touchAction: "none",
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
      {/* ── Transformable inner layer ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: "0 0",
          willChange: "transform",
          transition: isDragging.current ? "none" : "transform 0.05s ease-out",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Background image */}
        <img
          src={bgImage}
          alt={actName}
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.45) saturate(0.7)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />

        {/* Subtle vignette overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 50% 50%, ${accentColor}08 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* ── POI Markers ── */}
        {pois.map((poi) => {
          const isSelected = selectedPoiId === poi.id;
          const poiColor = POI_TYPE_COLORS[poi.type] || accentColor;
          const markerSize = isSelected ? 30 : 24;

          return (
            <button
              key={poi.id}
              onClick={(e) => {
                e.stopPropagation();
                onPoiClick(poi);
              }}
              title={poi.name}
              style={{
                position: "absolute",
                left: `${poi.x}%`,
                top: `${poi.y}%`,
                transform: "translate(-50%, -50%)",
                width: markerSize,
                height: markerSize,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isSelected ? poiColor : `${poiColor}33`,
                border: `2px solid ${poiColor}`,
                color: isSelected ? "oklch(0.08 0 0)" : poiColor,
                boxShadow: isSelected
                  ? `0 0 14px ${poiColor}99, 0 0 4px ${poiColor}`
                  : `0 0 6px ${poiColor}55`,
                transition: "all 0.15s ease",
                cursor: "pointer",
                zIndex: isSelected ? 20 : 10,
                // Scale marker inversely with zoom so they don't get huge
                fontSize: "1px",
              }}
            >
              <PoiIcon type={poi.type} size={isSelected ? 14 : 11} />

              {/* Label that appears on hover / selection */}
              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 6px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "oklch(0.09 0.010 30 / 0.95)",
                    border: `1px solid ${poiColor}66`,
                    borderRadius: "4px",
                    padding: "3px 8px",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    backdropFilter: "blur(4px)",
                    zIndex: 30,
                  }}
                >
                  <span style={{ color: poiColor, fontFamily: "'Cinzel', serif", fontSize: "0.6rem", fontWeight: "bold", letterSpacing: "0.04em" }}>
                    {poi.name}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Controls overlay (fixed to container, not transformed) ── */}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          right: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          zIndex: 40,
        }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); zoomIn(); }}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "oklch(0.10 0.010 30 / 0.92)",
            border: `1px solid ${accentColor}44`,
            color: accentColor,
            cursor: "pointer",
            backdropFilter: "blur(4px)",
            transition: "background 0.15s",
          }}
          title="Zoom in"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); zoomOut(); }}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "oklch(0.10 0.010 30 / 0.92)",
            border: `1px solid ${accentColor}44`,
            color: accentColor,
            cursor: "pointer",
            backdropFilter: "blur(4px)",
          }}
          title="Zoom out"
        >
          <ZoomOut size={14} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); resetView(); }}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "oklch(0.10 0.010 30 / 0.92)",
            border: `1px solid ${accentColor}44`,
            color: "oklch(0.55 0.010 60)",
            cursor: "pointer",
            backdropFilter: "blur(4px)",
          }}
          title="Reset view"
        >
          <Maximize2 size={13} />
        </button>
      </div>

      {/* ── Zoom level indicator ── */}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          left: "12px",
          zIndex: 40,
          background: "oklch(0.09 0.010 30 / 0.85)",
          border: `1px solid ${accentColor}33`,
          borderRadius: "4px",
          padding: "3px 8px",
          backdropFilter: "blur(4px)",
        }}
      >
        <span style={{ color: "oklch(0.45 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>
          {Math.round(transform.scale * 100)}%
        </span>
      </div>

      {/* ── Hint overlay (fades after first interaction) ── */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 40,
          background: "oklch(0.09 0.010 30 / 0.80)",
          border: `1px solid ${accentColor}33`,
          borderRadius: "4px",
          padding: "3px 10px",
          backdropFilter: "blur(4px)",
          pointerEvents: "none",
        }}
      >
        <span style={{ color: "oklch(0.42 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>
          Drag to pan · Scroll to zoom · Click markers for details
        </span>
      </div>
    </div>
  );
}
