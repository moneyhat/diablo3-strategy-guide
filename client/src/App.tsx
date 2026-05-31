// Sanctuary Grimoire Design System — Forced dark theme, Cinzel headings, Lato body
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WizardProvider } from "./contexts/WizardContext";
import GlobalNav from "./components/GlobalNav";
import GlobalFooter from "./components/GlobalFooter";
import Home from "./pages/Home";
import WizardPage from "./pages/WizardPage";
import GuidePage from "./pages/GuidePage";
import ClassPage from "./pages/ClassPage";
import BlacksmithPage from "./pages/crafting/BlacksmithPage";
import JewelerPage from "./pages/crafting/JewelerPage";
import MysticPage from "./pages/crafting/MysticPage";
import KanaisCubePage from "./pages/systems/KanaisCubePage";
import SeasonsPage from "./pages/systems/SeasonsPage";
import ParagonPage from "./pages/systems/ParagonPage";
import MapsPage from "./pages/MapsPage";
import SkillsLoadoutPage from "./pages/SkillsLoadoutPage";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.07 0.008 30)" }}>
      <GlobalNav />
      <main className="flex-1">
        {children}
      </main>
      <GlobalFooter />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Wizard flow — the primary experience */}
      <Route path="/" component={WizardPage} />
      <Route path="/guide/:id" component={GuidePage} />

      {/* Landing page accessible via /home */}
      <Route path="/home" component={Home} />

      {/* Direct class/system pages still accessible */}
      <Route path="/class/:id" component={ClassPage} />
      <Route path="/crafting/blacksmith" component={BlacksmithPage} />
      <Route path="/crafting/jeweler" component={JewelerPage} />
      <Route path="/crafting/mystic" component={MysticPage} />
      <Route path="/systems/kanais-cube" component={KanaisCubePage} />
      <Route path="/systems/seasons" component={SeasonsPage} />
      <Route path="/systems/paragon" component={ParagonPage} />
      <Route path="/maps" component={MapsPage} />
      <Route path="/skills/:id" component={SkillsLoadoutPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <WizardProvider>
          <TooltipProvider>
            <Toaster />
            <Layout>
              <Router />
            </Layout>
          </TooltipProvider>
        </WizardProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
