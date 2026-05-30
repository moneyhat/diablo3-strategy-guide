// Sanctuary Grimoire — Guided Wizard / Checkout Flow
// Step 1: Pick Class → Step 2: Set Level → Step 3: Choose Focus → Step 4: View Guide
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { classes } from "@/data/classes";
import { useWizard, FocusArea } from "@/contexts/WizardContext";
import { ChevronRight, ChevronLeft, Check, Sword, Gem, Star, Flame, Calendar, BookOpen, Zap, Trophy, Shield } from "lucide-react";

// ─── Progress Bar ────────────────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300"
            style={{
              background: i < step ? "oklch(0.72 0.18 55)" : i === step ? "oklch(0.72 0.18 55 / 0.2)" : "oklch(0.14 0.012 30)",
              border: i <= step ? "1px solid oklch(0.72 0.18 55)" : "1px solid oklch(0.22 0.015 50)",
              color: i < step ? "oklch(0.08 0 0)" : i === step ? "oklch(0.78 0.18 55)" : "oklch(0.45 0.010 60)",
            }}
          >
            {i < step ? <Check size={12} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className="h-px w-8 md:w-16 transition-all duration-500"
              style={{ background: i < step ? "oklch(0.72 0.18 55)" : "oklch(0.22 0.015 50)" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

const STEP_LABELS = ["Choose Class", "Set Level", "Pick Focus", "Your Guide"];

// ─── Step 1: Class Picker ────────────────────────────────────────────────────
function StepClass({ onNext }: { onNext: () => void }) {
  const { state, setClass } = useWizard();

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2
        className="font-cinzel-decorative font-black text-2xl md:text-3xl mb-2 text-center"
        style={{ color: "oklch(0.90 0.01 60)" }}
      >
        Who are you?
      </h2>
      <p className="text-center text-sm mb-8" style={{ color: "oklch(0.55 0.010 60)" }}>
        Choose the class you are playing. Your entire guide will be tailored to this choice.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-8">
        {classes.map((cls) => {
          const isSelected = state.classId === cls.id;
          return (
            <button
              key={cls.id}
              onClick={() => { setClass(cls.id); }}
              className="relative text-left rounded border transition-all duration-200 overflow-hidden group"
              style={{
                background: isSelected ? `${cls.color}15` : "oklch(0.10 0.010 30)",
                borderColor: isSelected ? cls.color : "oklch(0.22 0.015 50)",
                boxShadow: isSelected ? `0 0 24px ${cls.color}33, 0 4px 16px rgba(0,0,0,0.4)` : "none",
                transform: isSelected ? "scale(1.02)" : "scale(1)",
              }}
            >
              {/* Top accent bar */}
              <div className="h-0.5 w-full" style={{ background: isSelected ? cls.color : "oklch(0.22 0.015 50)" }} />

              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-cinzel-decorative font-black text-base flex-shrink-0 transition-all duration-200"
                    style={{
                      background: `${cls.color}22`,
                      border: `1px solid ${cls.color}55`,
                      color: cls.color,
                    }}
                  >
                    {cls.name[0]}
                  </div>
                  <div>
                    <h3 className="font-cinzel font-bold text-sm" style={{ color: isSelected ? cls.color : "oklch(0.85 0.01 60)" }}>
                      {cls.name}
                    </h3>
                    <p className="text-xs" style={{ color: "oklch(0.48 0.010 60)" }}>
                      {cls.primaryStat} · {cls.resource.name}
                    </p>
                  </div>
                  {isSelected && (
                    <div
                      className="ml-auto w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: cls.color }}
                    >
                      <Check size={10} color="oklch(0.08 0 0)" />
                    </div>
                  )}
                </div>
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "oklch(0.55 0.010 60)" }}>
                  {cls.overview.slice(0, 90)}…
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onNext}
          disabled={!state.classId}
          className="flex items-center gap-2 px-8 py-3 rounded font-cinzel font-bold text-sm tracking-wide transition-all duration-200"
          style={{
            background: state.classId ? "oklch(0.72 0.18 55)" : "oklch(0.18 0.010 30)",
            color: state.classId ? "oklch(0.08 0 0)" : "oklch(0.40 0.010 60)",
            cursor: state.classId ? "pointer" : "not-allowed",
          }}
        >
          Continue <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Level Picker ────────────────────────────────────────────────────
const LEVEL_PRESETS = [
  { label: "Fresh Start", range: "1–15", value: 8, desc: "Just beginning your journey in Sanctuary" },
  { label: "Early Game", range: "16–30", value: 23, desc: "Learning your class skills and first abilities" },
  { label: "Mid Game", range: "31–60", value: 45, desc: "Building toward your first powerful combos" },
  { label: "Pre-Endgame", range: "61–69", value: 65, desc: "Approaching the level cap and Torment content" },
  { label: "Max Level", range: "70", value: 70, desc: "Level 70 — the endgame begins here" },
  { label: "Paragon", range: "70+", value: 71, desc: "Paragon levels, Greater Rifts, and augmenting" },
];

function StepLevel({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { state, setLevel } = useWizard();
  const cls = classes.find((c) => c.id === state.classId)!;
  const [sliderVal, setSliderVal] = useState(state.level);

  const activePreset = LEVEL_PRESETS.find((p) => {
    if (p.value === 71) return sliderVal >= 71;
    if (p.value === 70) return sliderVal === 70;
    const [min, max] = p.range.split("–").map(Number);
    return sliderVal >= min && sliderVal <= max;
  });

  useEffect(() => { setLevel(sliderVal); }, [sliderVal]);

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-2xl mx-auto">
      <h2
        className="font-cinzel-decorative font-black text-2xl md:text-3xl mb-2 text-center"
        style={{ color: "oklch(0.90 0.01 60)" }}
      >
        What is your level?
      </h2>
      <p className="text-center text-sm mb-8" style={{ color: "oklch(0.55 0.010 60)" }}>
        Your guide will be filtered to content that is relevant to your current progression.
      </p>

      {/* Selected class reminder */}
      <div
        className="flex items-center gap-3 p-3 rounded border mb-8 mx-auto max-w-xs"
        style={{ background: `${cls.color}10`, borderColor: `${cls.color}44` }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-cinzel-decorative font-black text-sm flex-shrink-0"
          style={{ background: `${cls.color}22`, color: cls.color }}
        >
          {cls.name[0]}
        </div>
        <span className="font-cinzel text-sm font-bold" style={{ color: cls.color }}>{cls.name}</span>
        <span className="text-xs ml-auto" style={{ color: "oklch(0.50 0.010 60)" }}>{cls.primaryStat}</span>
      </div>

      {/* Level presets */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {LEVEL_PRESETS.map((preset) => {
          const isActive = activePreset?.value === preset.value;
          return (
            <button
              key={preset.value}
              onClick={() => setSliderVal(preset.value)}
              className="p-4 rounded border text-left transition-all duration-200"
              style={{
                background: isActive ? `${cls.color}15` : "oklch(0.10 0.010 30)",
                borderColor: isActive ? cls.color : "oklch(0.22 0.015 50)",
                boxShadow: isActive ? `0 0 16px ${cls.color}22` : "none",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-cinzel font-bold text-xs" style={{ color: isActive ? cls.color : "oklch(0.80 0.01 60)" }}>
                  {preset.label}
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded-sm font-mono"
                  style={{
                    background: isActive ? `${cls.color}22` : "oklch(0.14 0.012 30)",
                    color: isActive ? cls.color : "oklch(0.50 0.010 60)",
                    border: `1px solid ${isActive ? cls.color + "44" : "oklch(0.20 0.012 30)"}`,
                  }}
                >
                  {preset.range}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "oklch(0.50 0.010 60)" }}>
                {preset.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Fine-tune slider */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-cinzel tracking-wide" style={{ color: "oklch(0.55 0.010 60)" }}>Fine-tune your level</span>
          <span
            className="font-cinzel-decorative font-black text-2xl"
            style={{ color: cls.color }}
          >
            {sliderVal >= 71 ? "70+" : sliderVal}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={80}
          value={sliderVal}
          onChange={(e) => setSliderVal(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${cls.color} 0%, ${cls.color} ${((sliderVal - 1) / 79) * 100}%, oklch(0.22 0.015 50) ${((sliderVal - 1) / 79) * 100}%, oklch(0.22 0.015 50) 100%)`,
            accentColor: cls.color,
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: "oklch(0.40 0.010 60)" }}>1</span>
          <span className="text-xs" style={{ color: "oklch(0.40 0.010 60)" }}>35</span>
          <span className="text-xs" style={{ color: "oklch(0.40 0.010 60)" }}>70</span>
          <span className="text-xs" style={{ color: "oklch(0.40 0.010 60)" }}>70+</span>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2.5 rounded border font-cinzel text-sm transition-all duration-200"
          style={{ borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.55 0.010 60)", background: "transparent" }}
        >
          <ChevronLeft size={16} /> Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-2.5 rounded font-cinzel font-bold text-sm tracking-wide transition-all duration-200"
          style={{ background: "oklch(0.72 0.18 55)", color: "oklch(0.08 0 0)" }}
        >
          Continue <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Focus Picker ────────────────────────────────────────────────────
const FOCUS_OPTIONS: { id: FocusArea; label: string; desc: string; icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { id: "combat", label: "Combat & Abilities", desc: "Key skills, rotations, keybindings, and combat mechanics", icon: Zap },
  { id: "builds", label: "Meta Builds", desc: "Top endgame builds, key items, and tier rankings", icon: Trophy },
  { id: "leveling", label: "Leveling Guide", desc: "Phase-by-phase tips from level 1 to 70", icon: Shield },
  { id: "crafting-blacksmith", label: "Blacksmith", desc: "Crafting recipes, salvaging, and material farming", icon: Sword },
  { id: "crafting-jeweler", label: "Jeweler & Gems", desc: "Gem upgrades, socketing, and Legendary Gems", icon: Gem },
  { id: "crafting-mystic", label: "Mystic & Enchanting", desc: "Rerolling stats, transmogrification, and priority affixes", icon: Star },
  { id: "kanais-cube", label: "Kanai's Cube", desc: "All recipes, legendary power extraction, and augmenting", icon: Flame },
  { id: "paragon", label: "Paragon System", desc: "Point allocation, farming strategies, and stat priorities", icon: BookOpen },
  { id: "seasons", label: "Seasons & Journey", desc: "Season start guide, Journey chapters, and Haedrig's Gift", icon: Calendar },
];

function StepFocus({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { state, toggleFocus } = useWizard();
  const cls = classes.find((c) => c.id === state.classId)!;

  const selectAll = () => {
    FOCUS_OPTIONS.forEach((f) => {
      if (!state.focusAreas.includes(f.id)) toggleFocus(f.id);
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-2xl mx-auto">
      <h2
        className="font-cinzel-decorative font-black text-2xl md:text-3xl mb-2 text-center"
        style={{ color: "oklch(0.90 0.01 60)" }}
      >
        What do you need?
      </h2>
      <p className="text-center text-sm mb-2" style={{ color: "oklch(0.55 0.010 60)" }}>
        Select all the areas you want covered in your personalized guide. You can pick as many as you like.
      </p>
      <div className="flex justify-center mb-6">
        <button
          onClick={selectAll}
          className="text-xs font-cinzel tracking-wide px-3 py-1 rounded border transition-all duration-200"
          style={{
            borderColor: `${cls.color}44`,
            color: cls.color,
            background: `${cls.color}10`,
          }}
        >
          Select All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {FOCUS_OPTIONS.map((opt) => {
          const isSelected = state.focusAreas.includes(opt.id);
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              onClick={() => toggleFocus(opt.id)}
              className="flex items-start gap-3 p-4 rounded border text-left transition-all duration-200"
              style={{
                background: isSelected ? `${cls.color}12` : "oklch(0.10 0.010 30)",
                borderColor: isSelected ? cls.color : "oklch(0.22 0.015 50)",
                boxShadow: isSelected ? `0 0 12px ${cls.color}18` : "none",
              }}
            >
              <div
                className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center mt-0.5"
                style={{
                  background: isSelected ? `${cls.color}22` : "oklch(0.14 0.012 30)",
                  border: `1px solid ${isSelected ? cls.color + "44" : "oklch(0.20 0.012 30)"}`,
                }}
              >
                <Icon size={15} color={isSelected ? cls.color : "oklch(0.45 0.010 60)"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-cinzel font-bold text-xs" style={{ color: isSelected ? cls.color : "oklch(0.80 0.01 60)" }}>
                    {opt.label}
                  </span>
                  {isSelected && (
                    <div
                      className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: cls.color }}
                    >
                      <Check size={9} color="oklch(0.08 0 0)" />
                    </div>
                  )}
                </div>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "oklch(0.50 0.010 60)" }}>
                  {opt.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2.5 rounded border font-cinzel text-sm transition-all duration-200"
          style={{ borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.55 0.010 60)", background: "transparent" }}
        >
          <ChevronLeft size={16} /> Back
        </button>
        <button
          onClick={onNext}
          disabled={state.focusAreas.length === 0}
          className="flex items-center gap-2 px-8 py-2.5 rounded font-cinzel font-bold text-sm tracking-wide transition-all duration-200"
          style={{
            background: state.focusAreas.length > 0 ? "oklch(0.72 0.18 55)" : "oklch(0.18 0.010 30)",
            color: state.focusAreas.length > 0 ? "oklch(0.08 0 0)" : "oklch(0.40 0.010 60)",
            cursor: state.focusAreas.length > 0 ? "pointer" : "not-allowed",
          }}
        >
          Build My Guide <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Wizard Page Shell ────────────────────────────────────────────────────────
export default function WizardPage() {
  const [step, setStep] = useState(0);
  const [, navigate] = useLocation();
  const { state, reset } = useWizard();
  const cls = state.classId ? classes.find((c) => c.id === state.classId) : null;

  const goNext = () => {
    if (step === 2) {
      // Navigate to the personalized guide
      navigate(`/guide/${state.classId}`);
    } else {
      setStep((s) => s + 1);
    }
  };
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: cls
          ? `radial-gradient(ellipse at 50% 0%, ${cls.color}08 0%, oklch(0.07 0.008 30) 60%)`
          : "oklch(0.07 0.008 30)",
      }}
    >
      {/* Header */}
      <header
        className="border-b px-4 py-4 flex items-center justify-between"
        style={{ borderColor: "oklch(0.22 0.015 50)", background: "oklch(0.07 0.008 30 / 0.95)" }}
      >
        <button
          onClick={() => { reset(); navigate("/"); }}
          className="font-cinzel-decorative text-base font-bold tracking-wider"
          style={{ color: "oklch(0.78 0.18 55)" }}
        >
          D3 Guide
        </button>

        <ProgressBar step={step} total={3} />

        <div className="text-xs font-cinzel tracking-wide" style={{ color: "oklch(0.45 0.010 60)" }}>
          {STEP_LABELS[step]}
        </div>
      </header>

      {/* Step label row */}
      <div
        className="border-b px-4 py-2 hidden md:flex items-center justify-center gap-8"
        style={{ borderColor: "oklch(0.18 0.012 30)", background: "oklch(0.08 0.010 30)" }}
      >
        {STEP_LABELS.slice(0, 3).map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="text-xs font-cinzel tracking-wide"
              style={{ color: i === step ? (cls?.color || "oklch(0.78 0.18 55)") : "oklch(0.40 0.010 60)" }}
            >
              {i + 1}. {label}
            </span>
            {i < 2 && <ChevronRight size={12} color="oklch(0.30 0.010 60)" />}
          </div>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center px-4 py-10 md:py-16">
        <div className="w-full max-w-4xl">
          {step === 0 && <StepClass onNext={goNext} />}
          {step === 1 && <StepLevel onNext={goNext} onBack={goBack} />}
          {step === 2 && <StepFocus onNext={goNext} onBack={goBack} />}
        </div>
      </main>

      {/* Footer hint */}
      <div className="text-center py-4 text-xs" style={{ color: "oklch(0.35 0.010 60)" }}>
        {step === 0 && "Select your class to continue"}
        {step === 1 && "Choose a preset or drag the slider to your exact level"}
        {step === 2 && `${state.focusAreas.length} area${state.focusAreas.length !== 1 ? "s" : ""} selected — select at least one to continue`}
      </div>
    </div>
  );
}
