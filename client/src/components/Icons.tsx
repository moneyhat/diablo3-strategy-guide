// Sanctuary Grimoire — Custom SVG Icon System
// Fantasy-themed glyphs for ability types, elements, and game systems

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// ─── Element Icons ─────────────────────────────────────────────────────────────

export function FireIcon({ size = 20, color = "#ff6b35", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2C12 2 7 7 7 13a5 5 0 0 0 10 0c0-3-2-5-2-5s-1 3-3 3c-1.5 0-2-1-2-2 0-2 2-4 2-7z" fill={color} opacity="0.9"/>
      <path d="M12 8c0 0 3 3 3 6a3 3 0 0 1-6 0c0-2 1-3.5 1-3.5s.5 1.5 2 1.5c.8 0 1-.5 1-1 0-1.5-1-3-1-3z" fill={color} opacity="0.6"/>
      <circle cx="12" cy="19" r="1" fill={color} opacity="0.4"/>
    </svg>
  );
}

export function LightningIcon({ size = 20, color = "#7eb8f7", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l2-8z" fill={color} opacity="0.9"/>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l2-8z" stroke={color} strokeWidth="0.5" strokeLinejoin="round" opacity="0.4"/>
    </svg>
  );
}

export function ColdIcon({ size = 20, color = "#7ecef7", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <line x1="12" y1="2" x2="12" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="5.5" y1="5.5" x2="18.5" y2="18.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="18.5" y1="5.5" x2="5.5" y2="18.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="2.5" fill={color}/>
      <circle cx="12" cy="4" r="1.2" fill={color} opacity="0.7"/>
      <circle cx="12" cy="20" r="1.2" fill={color} opacity="0.7"/>
      <circle cx="4" cy="12" r="1.2" fill={color} opacity="0.7"/>
      <circle cx="20" cy="12" r="1.2" fill={color} opacity="0.7"/>
    </svg>
  );
}

export function HolyIcon({ size = 20, color = "#ffe082", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="4" fill={color} opacity="0.9"/>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 12 + 5.5 * Math.cos(rad);
        const y1 = 12 + 5.5 * Math.sin(rad);
        const x2 = 12 + 9 * Math.cos(rad);
        const y2 = 12 + 9 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={i % 2 === 0 ? "2" : "1.2"} strokeLinecap="round" opacity={i % 2 === 0 ? "0.9" : "0.5"}/>;
      })}
    </svg>
  );
}

export function PoisonIcon({ size = 20, color = "#81c784", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3C9 3 7 5 7 8c0 2 1 3 1 3H8c-1 0-2 1-2 3 0 3 2.5 7 6 7s6-4 6-7c0-2-1-3-2-3h-.5s1-1 1-3c0-3-2-5-4.5-5z" fill={color} opacity="0.85"/>
      <circle cx="10" cy="9" r="1" fill="oklch(0.08 0 0)" opacity="0.5"/>
      <circle cx="14" cy="9" r="1" fill="oklch(0.08 0 0)" opacity="0.5"/>
      <path d="M10 14c0 0 .5 2 2 2s2-2 2-2" stroke="oklch(0.08 0 0)" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}

export function ArcaneIcon({ size = 20, color = "#ce93d8", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <polygon points="12,2 14.5,9 22,9 16,14 18.5,21 12,17 5.5,21 8,14 2,9 9.5,9" fill={color} opacity="0.85"/>
      <polygon points="12,6 13.5,10.5 18,10.5 14.5,13 16,17.5 12,15 8,17.5 9.5,13 6,10.5 10.5,10.5" fill="oklch(0.08 0 0)" opacity="0.3"/>
    </svg>
  );
}

export function PhysicalIcon({ size = 20, color = "#b0b0b0", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M16 3l5 5-11 11-2-2 9-9-3-3 2-2z" fill={color} opacity="0.9"/>
      <path d="M3 18l3-3 3 3-3 3-3-3z" fill={color} opacity="0.6"/>
      <line x1="8" y1="16" x2="16" y2="8" stroke={color} strokeWidth="1.5" opacity="0.4"/>
    </svg>
  );
}

// ─── Skill Type Icons ──────────────────────────────────────────────────────────

export function PrimarySkillIcon({ size = 20, color = "#66bb6a", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      <circle cx="12" cy="12" r="5" fill={color} opacity="0.8"/>
      <circle cx="12" cy="12" r="2" fill="oklch(0.08 0 0)" opacity="0.5"/>
    </svg>
  );
}

export function SpenderIcon({ size = 20, color = "#ef5350", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2l2.5 7.5H22l-6.5 4.7 2.5 7.5L12 17l-6 4.7 2.5-7.5L2 9.5h7.5L12 2z" fill={color} opacity="0.85"/>
    </svg>
  );
}

export function DefensiveIcon({ size = 20, color = "#4fc3f7", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2L4 6v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V6L12 2z" fill={color} opacity="0.25"/>
      <path d="M12 2L4 6v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V6L12 2z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function UtilityIcon({ size = 20, color = "#80cbc4", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="3" fill={color}/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
}

export function MobilityIcon({ size = 20, color = "#ffb74d", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 8l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    </svg>
  );
}

export function SummonIcon({ size = 20, color = "#a5d6a7", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="4" fill={color} opacity="0.8"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 4V2M8.5 5.5L7 4M15.5 5.5L17 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
}

export function CooldownIcon({ size = 20, color = "#ffd54f", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" opacity="0.4"/>
      <path d="M12 7v5l3 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.5 3.5A9 9 0 0 1 21 12" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

// ─── Class Sigil Icons ─────────────────────────────────────────────────────────

export function BarbarianSigil({ size = 32, color = "#c0392b", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <path d="M16 3L4 10v12l12 7 12-7V10L16 3z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1"/>
      <path d="M10 13h12M10 16h12M10 19h12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 8v16" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

export function CrusaderSigil({ size = 32, color = "#f0c040", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <path d="M16 4L4 10v8l12 10 12-10v-8L16 4z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1"/>
      <path d="M16 9v14M9 16h14" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

export function DemonHunterSigil({ size = 32, color = "#8e44ad", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <circle cx="16" cy="16" r="11" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1"/>
      <path d="M8 16c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="16" cy="16" r="3" fill={color}/>
      <path d="M16 19v5M13 22l3 2 3-2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MonkSigil({ size = 32, color = "#e67e22", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <circle cx="16" cy="16" r="11" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1"/>
      <circle cx="16" cy="12" r="3" fill={color} opacity="0.8"/>
      <path d="M10 22c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 6v3M10.5 8l2 2M21.5 8l-2 2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function NecromancerSigil({ size = 32, color = "#27ae60", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <path d="M16 4L4 10v12l12 7 12-7V10L16 4z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1"/>
      <circle cx="16" cy="13" r="4" stroke={color} strokeWidth="1.5"/>
      <path d="M13 13h6M16 10v6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 22c1-2 3-3 6-3s5 1 6 3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function WitchDoctorSigil({ size = 32, color = "#16a085", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <circle cx="16" cy="16" r="11" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1"/>
      <path d="M16 8c-2 0-4 2-4 4 0 1.5.8 2.5.8 2.5H12c-.8 0-1.5.7-1.5 2 0 2 1.5 5 5.5 5s5.5-3 5.5-5c0-1.3-.7-2-1.5-2h-.8s.8-1 .8-2.5c0-2-2-4-4-4z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.3"/>
    </svg>
  );
}

export function WizardSigil({ size = 32, color = "#2980b9", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <polygon points="16,4 18.5,11.5 26,11.5 20,16.5 22.5,24 16,19.5 9.5,24 12,16.5 6,11.5 13.5,11.5" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.2"/>
      <polygon points="16,8 17.5,12.5 22,12.5 18.5,15 20,19.5 16,17 12,19.5 13.5,15 10,12.5 14.5,12.5" fill={color} opacity="0.6"/>
    </svg>
  );
}

// ─── System Icons ──────────────────────────────────────────────────────────────

export function KanaiIcon({ size = 24, color = "#ff7043", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="1" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1"/>
      <path d="M4 10h16M4 14h16M10 4v16M14 4v16" stroke={color} strokeWidth="1" opacity="0.4"/>
      <circle cx="12" cy="12" r="3" fill={color} opacity="0.7"/>
      <path d="M12 9v6M9 12h6" stroke="oklch(0.08 0 0)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function SeasonIcon({ size = 24, color = "#66bb6a", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1"/>
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 7v5l3 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ParagonIcon({ size = 24, color = "#42a5f5", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" fill={color} opacity="0.8"/>
      <path d="M12 6l1.2 3.6H17l-3 2.2 1.2 3.6L12 13l-3.2 2.4 1.2-3.6-3-2.2h3.8L12 6z" fill="oklch(0.08 0 0)" opacity="0.3"/>
    </svg>
  );
}

export function BlacksmithIcon({ size = 24, color = "#c89b3c", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M14.5 3L21 9.5l-9 9-2-2 7-7-4-4-7 7-2-2 9-9 1.5 1.5z" fill={color} opacity="0.85"/>
      <rect x="2" y="18" width="8" height="3" rx="1" fill={color} opacity="0.6"/>
      <path d="M3 16l2-2 4 4-2 2-4-4z" fill={color} opacity="0.4"/>
    </svg>
  );
}

export function JewelerIcon({ size = 24, color = "#4fc3f7", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3L6 9l6 12 6-12L12 3z" fill={color} opacity="0.3"/>
      <path d="M12 3L6 9l6 12 6-12L12 3z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M6 9h12" stroke={color} strokeWidth="1.5"/>
      <path d="M9 9L12 3l3 6" stroke={color} strokeWidth="1" opacity="0.5"/>
    </svg>
  );
}

export function MysticIcon({ size = 24, color = "#ce93d8", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1"/>
      <path d="M12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z" fill={color} opacity="0.6"/>
      <path d="M12 8v8M8 12h8" stroke="oklch(0.08 0 0)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
    </svg>
  );
}

// ─── Tier Badge Icons ──────────────────────────────────────────────────────────

export function TierBadge({ tier, size = 28 }: { tier: "S" | "A" | "B"; size?: number }) {
  const colors = { S: "#d4a843", A: "#66bb6a", B: "#42a5f5" };
  const c = colors[tier];
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M14 2L3 8v12l11 6 11-6V8L14 2z" fill={c} fillOpacity="0.15" stroke={c} strokeWidth="1.2"/>
      <text x="14" y="18" textAnchor="middle" fill={c} fontSize="11" fontWeight="bold" fontFamily="'Cinzel', serif">{tier}</text>
    </svg>
  );
}

// ─── Map: element name → icon component ────────────────────────────────────────

export const ELEMENT_ICONS: Record<string, React.ComponentType<IconProps>> = {
  Fire: FireIcon,
  Lightning: LightningIcon,
  Cold: ColdIcon,
  Holy: HolyIcon,
  Poison: PoisonIcon,
  Arcane: ArcaneIcon,
  Physical: PhysicalIcon,
};

export const CLASS_SIGILS: Record<string, React.ComponentType<IconProps>> = {
  barbarian: BarbarianSigil,
  crusader: CrusaderSigil,
  "demon-hunter": DemonHunterSigil,
  monk: MonkSigil,
  necromancer: NecromancerSigil,
  "witch-doctor": WitchDoctorSigil,
  wizard: WizardSigil,
};

// Map of class IDs to their portrait image URLs
export const CLASS_PORTRAITS: Record<string, string> = {
  barbarian: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/class-barbarian-nBdDWTVFmax3yphg9dfrK6.webp",
  crusader: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/class-crusader-WdE3ShV8Lsjb3QPTnmfXtm.webp",
  "demon-hunter": "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/class-demonhunter-SVwzNGRTwSWj8x6pxsEoUG.webp",
  monk: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/class-monk-k7VPzqX5vGyAZzMAxzCFpL.webp",
  necromancer: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/class-necromancer-g7Lh3W2yQcRBXjqboYc46L.webp",
  "witch-doctor": "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/class-witchdoctor-9WWWWuQAtohZWCQs9GtKtq.webp",
  wizard: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/class-wizard-HGnSkJZZduqLfxaCmMHKX9.webp",
};

export const SECTION_IMAGES = {
  kanai: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/section-kanai-9tQjSC5fTxP7U5uE4EvCCZ.webp",
  seasons: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/section-seasons-WqbhD5h2k8CJ3mw9soZzTR.webp",
  paragon: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/section-paragon-6W6GUzUmrDvX4DcTgVsNbQ.webp",
  crafting: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/hero-crafting-BmDoSywrrJgdYU9YM4FoB6.webp",
  classes: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/hero-classes-jqQzeRLQzCPicn42Qy3hfx.webp",
};
