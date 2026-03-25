import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import Journal from "./pages/Journal";
import VentingRoom from "./pages/VentingRoom";
import GrowthPlan from "./pages/GrowthPlan";
import Therapy from "./pages/Therapy";
import EmotionalHealth from "./pages/EmotionalHealth";
import Pricing from "./pages/Pricing";
import AppLayout from "./components/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <I18nProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/chatbot" element={<AppLayout><Chatbot /></AppLayout>} />
            <Route path="/journal" element={<AppLayout><Journal /></AppLayout>} />
            <Route path="/venting" element={<AppLayout><VentingRoom /></AppLayout>} />
            <Route path="/growth-plan" element={<AppLayout><GrowthPlan /></AppLayout>} />
            <Route path="/therapy" element={<AppLayout><Therapy /></AppLayout>} />
            <Route path="/emotional-health" element={<AppLayout><EmotionalHealth /></AppLayout>} />
            <Route path="/pricing" element={<AppLayout><Pricing /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
