// Sanctuary Grimoire — Wizard/Checkout flow state management
import { createContext, useContext, useState, ReactNode } from "react";

export type FocusArea =
  | "combat"
  | "builds"
  | "leveling"
  | "crafting-blacksmith"
  | "crafting-jeweler"
  | "crafting-mystic"
  | "kanais-cube"
  | "paragon"
  | "seasons"
  | "maps";

export interface WizardState {
  classId: string | null;
  level: number;
  focusAreas: FocusArea[];
}

interface WizardContextType {
  state: WizardState;
  setClass: (id: string) => void;
  setLevel: (level: number) => void;
  toggleFocus: (area: FocusArea) => void;
  reset: () => void;
}

const defaultState: WizardState = {
  classId: null,
  level: 1,
  focusAreas: [],
};

const WizardContext = createContext<WizardContextType | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WizardState>(defaultState);

  const setClass = (id: string) =>
    setState((s) => ({ ...s, classId: id }));

  const setLevel = (level: number) =>
    setState((s) => ({ ...s, level }));

  const toggleFocus = (area: FocusArea) =>
    setState((s) => ({
      ...s,
      focusAreas: s.focusAreas.includes(area)
        ? s.focusAreas.filter((f) => f !== area)
        : [...s.focusAreas, area],
    }));

  const reset = () => setState(defaultState);

  return (
    <WizardContext.Provider value={{ state, setClass, setLevel, toggleFocus, reset }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used inside WizardProvider");
  return ctx;
}
