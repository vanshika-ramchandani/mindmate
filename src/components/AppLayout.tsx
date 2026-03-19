import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, LayoutDashboard, MessageCircle, BookOpen, MessageSquare, Sparkles, Video, BarChart3, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Chatbot", path: "/chatbot", icon: MessageCircle },
  { label: "Journal", path: "/journal", icon: BookOpen },
  { label: "Venting Room", path: "/venting", icon: MessageSquare },
  { label: "Growth Plan", path: "/growth-plan", icon: Sparkles },
  { label: "Emotional Health", path: "/emotional-health", icon: BarChart3 },
  { label: "Therapy", path: "/therapy", icon: Video },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("mindmate_user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border/50 bg-card flex-col shrink-0">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border/50">
          <div className="w-8 h-8 rounded-lg gradient-calm flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold font-display text-card-foreground">MindMate</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === item.path
                ? "bg-lavender-light text-primary shadow-card"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}>
              <item.icon className="w-4.5 h-4.5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-3 pb-4">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-destructive transition-all">
            <LogOut className="w-4.5 h-4.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-calm flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold font-display text-card-foreground">MindMate</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-muted/50 text-foreground">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Nav Dropdown */}
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-14 left-0 right-0 z-50 bg-card border-b border-border/50 shadow-soft p-3 space-y-1">
            {navItems.map(item => (
              <button key={item.path} onClick={() => { navigate(item.path); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === item.path
                  ? "bg-lavender-light text-primary"
                  : "text-muted-foreground hover:bg-muted/50"}`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </motion.div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
