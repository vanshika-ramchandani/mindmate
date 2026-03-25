import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, LayoutDashboard, MessageCircle, BookOpen, MessageSquare, Sparkles, Video, BarChart3, LogOut, Menu, X, CreditCard } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();

  const navItems = [
    { label: t("nav.dashboard"), path: "/dashboard", icon: LayoutDashboard },
    { label: t("nav.chatbot"), path: "/chatbot", icon: MessageCircle },
    { label: t("nav.journal"), path: "/journal", icon: BookOpen },
    { label: t("nav.venting"), path: "/venting", icon: MessageSquare },
    { label: t("nav.growth"), path: "/growth-plan", icon: Sparkles },
    { label: t("nav.emotional"), path: "/emotional-health", icon: BarChart3 },
    { label: t("nav.therapy"), path: "/therapy", icon: Video },
    { label: t("nav.pricing"), path: "/pricing", icon: CreditCard },
  ];

  const logout = () => {
    const lang = localStorage.getItem("mindmate_lang");
    localStorage.clear();
    if (lang) localStorage.setItem("mindmate_lang", lang);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 border-r border-border/50 bg-card/50 flex-col shrink-0">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border/50">
          <div className="w-8 h-8 rounded-lg gradient-calm flex items-center justify-center glow-primary">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold font-display text-foreground">MindMate</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === item.path
                ? "bg-accent text-accent-foreground shadow-card"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-3 pb-2">
          <LanguageSwitcher className="justify-center mb-2" />
        </div>
        <div className="px-3 pb-4">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-destructive transition-all">
            <LogOut className="w-4 h-4" />
            {t("nav.logout")}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-calm flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold font-display text-foreground">MindMate</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-secondary text-foreground">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-14 left-0 right-0 z-50 bg-card border-b border-border/50 shadow-soft p-3 space-y-1">
            {navItems.map(item => (
              <button key={item.path} onClick={() => { navigate(item.path); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === item.path
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-secondary"}`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4" /> {t("nav.logout")}
            </button>
          </motion.div>
        )}

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
