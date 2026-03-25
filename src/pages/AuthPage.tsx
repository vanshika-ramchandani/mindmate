import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function AuthPage({ mode = "login" }: { mode?: "login" | "signup" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && name) {
      localStorage.setItem("mindmate_user", JSON.stringify({ name, email }));
    } else {
      const saved = localStorage.getItem("mindmate_user");
      if (!saved) {
        localStorage.setItem("mindmate_user", JSON.stringify({ name: email.split("@")[0], email }));
      }
    }
    localStorage.setItem("mindmate_logged_in", "true");
    toast({
      title: mode === "login" ? t("auth.login_success") : t("auth.signup_success"),
      description: t("auth.redirect"),
    });
    setTimeout(() => navigate("/dashboard"), 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative px-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-lavender-light opacity-30 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-soft-blue-light opacity-20 blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg gradient-calm flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold font-display text-foreground">MindMate</span>
        </div>
        <div className="bg-card rounded-2xl shadow-soft border border-border/50 p-8">
          <h2 className="text-2xl font-display font-bold text-center text-card-foreground mb-2">
            {mode === "login" ? t("auth.welcome_back") : t("auth.create_account")}
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-6">
            {mode === "login" ? t("auth.signin_desc") : t("auth.signup_desc")}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder={t("auth.name")} value={name} onChange={e => setName(e.target.value)} className="pl-10 bg-muted/50 border-border/50" required />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="email" placeholder={t("auth.email")} value={email} onChange={e => setEmail(e.target.value)} className="pl-10 bg-muted/50 border-border/50" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="password" placeholder={t("auth.password")} value={password} onChange={e => setPassword(e.target.value)} className="pl-10 bg-muted/50 border-border/50" required />
            </div>
            <Button type="submit" className="w-full gradient-calm text-primary-foreground border-0 hover:opacity-90">
              {mode === "login" ? t("auth.signin") : t("auth.signup_btn")}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "login" ? (
              <>{t("auth.no_account")} <Link to="/signup" className="text-primary font-medium hover:underline">{t("chat.signup")}</Link></>
            ) : (
              <>{t("auth.has_account")} <Link to="/login" className="text-primary font-medium hover:underline">{t("chat.login")}</Link></>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
