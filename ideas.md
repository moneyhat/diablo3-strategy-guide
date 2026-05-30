# Diablo 3 Strategy Guide — Design Brainstorm

## Design Approach Options

<response>
<text>
**Approach 1: Hellfire Codex (Gothic Manuscript)**
- **Design Movement**: Dark Gothic / Medieval Illuminated Manuscript
- **Core Principles**: Aged parchment textures, blood-red accents, ornate borders, heavy serif typography
- **Color Philosophy**: Deep charcoal (#1a0a0a), blood crimson (#8b0000), aged gold (#c9a84c), ash white (#e8dcc8). Evokes the ancient evil of Sanctuary.
- **Layout Paradigm**: Asymmetric two-column with a wide content area and a narrow rune-decorated sidebar. Navigation is a vertical left rail styled as a tome's table of contents.
- **Signature Elements**: Decorative runic dividers between sections; class icons rendered as illuminated seals; skill cards styled as spell scrolls
- **Interaction Philosophy**: Hover states reveal "lore tooltips"; tab switching mimics turning pages
- **Animation**: Subtle flicker on fire/rune elements; page-turn transitions; glow pulses on legendary item cards
- **Typography System**: Cinzel (headings) + Crimson Text (body); hierarchy uses size + letter-spacing rather than weight
</text>
<probability>0.08</probability>
</response>

<response>
<text>
**Approach 2: Nephalem Terminal (Dark Tactical Dashboard)**
- **Design Movement**: Cyberpunk HUD / Military Intelligence Terminal
- **Core Principles**: Information density over decoration, scanline aesthetic, data-first layout, monochrome with single accent color per class
- **Color Philosophy**: Near-black background (#0d0d0d), terminal green (#00ff41) replaced with Diablo's signature blood orange (#ff4500) for the global accent. Each class gets its own accent hue (e.g., Barbarian = red, Wizard = blue, Witch Doctor = green). Evokes a battle-hardened war room.
- **Layout Paradigm**: Full-width dashboard with a persistent top navigation bar, collapsible left sidebar for class selection, and a main content area with card-grid data panels. Inspired by Bloomberg Terminal.
- **Signature Elements**: Thin horizontal rule separators with glowing ends; stat bars with animated fill; class-color-coded borders on all cards
- **Interaction Philosophy**: Everything is filterable and sortable; level slider (1–70) dynamically updates tips; tab panels for each content section
- **Animation**: Fast, snappy transitions; no decorative animations — only functional ones (progress bars, stat counters)
- **Typography System**: JetBrains Mono (data/stats) + Inter (body); all caps for section labels
</text>
<probability>0.07</probability>
</response>

<response>
<text>
**Approach 3: Sanctuary Grimoire (Atmospheric Dark Fantasy)**
- **Design Movement**: Dark Fantasy / Concept Art Gallery
- **Core Principles**: Cinematic atmosphere, class-specific color worlds, rich visual hierarchy, immersive full-bleed sections
- **Color Philosophy**: Deep obsidian base (#0f0a0a), with each class page transforming the accent palette (Barbarian = volcanic red, Wizard = arcane violet, Monk = golden amber, etc.). Gold (#d4a843) used as the universal "legendary" accent across all pages.
- **Layout Paradigm**: Horizontal-scroll class selector at the top; content flows vertically in distinct "chapters" (Overview, Leveling, Abilities, Meta, Weapons). Each chapter has a full-bleed atmospheric header.
- **Signature Elements**: Glowing "legendary" item cards with orange borders; skill icons in circular frames with element-color glows; a floating "level indicator" that adapts tips as you scroll
- **Interaction Philosophy**: Smooth scroll-based reveals; class selection triggers a full color-theme transition; tooltips on skill names show full descriptions
- **Animation**: Parallax on hero sections; fade-in-up on content cards; ember/particle effects on the homepage hero
- **Typography System**: Cinzel Decorative (hero titles) + Lato (body); gold gradient on H1s
</text>
<probability>0.09</probability>
</response>

---

## Selected Approach: **Approach 3 — Sanctuary Grimoire**

Chosen for its balance of atmosphere and usability. The class-specific color worlds make navigation intuitive while keeping the dark fantasy aesthetic of Diablo 3 intact. The "Legendary gold" accent creates a consistent visual language across all pages.
