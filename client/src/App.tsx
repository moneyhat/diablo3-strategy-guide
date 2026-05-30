// Sanctuary Grimoire Design System — Forced dark theme, Cinzel headings, Lato body
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ClassPage from "./pages/ClassPage";
import BlacksmithPage from "./pages/crafting/BlacksmithPage";
import JewelerPage from "./pages/crafting/JewelerPage";
import MysticPage from "./pages/crafting/MysticPage";
import KanaisCubePage from "./pages/systems/KanaisCubePage";
import SeasonsPage from "./pages/systems/SeasonsPage";
import ParagonPage from "./pages/systems/ParagonPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/class/:id" component={ClassPage} />
      <Route path="/crafting/blacksmith" component={BlacksmithPage} />
      <Route path="/crafting/jeweler" component={JewelerPage} />
      <Route path="/crafting/mystic" component={MysticPage} />
      <Route path="/systems/kanais-cube" component={KanaisCubePage} />
      <Route path="/systems/seasons" component={SeasonsPage} />
      <Route path="/systems/paragon" component={ParagonPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
