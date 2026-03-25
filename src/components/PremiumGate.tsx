import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export default function PremiumGate({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const isPremium = localStorage.getItem("mindmate_premium") === "true";

  if (isPremium) return <>{children}</>;

  return (
    <div className="relative min-h-[60vh]">
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl gradient-calm flex items-center justify-center mx-auto mb-4 glow-primary">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground mb-2">
            {t("premium.locked")}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {t("premium.unlock")}
          </p>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => {
                localStorage.setItem("mindmate_premium", "true");
                toast.success(t("pricing.activated"));
                window.location.reload();
              }}
              className="gradient-calm text-primary-foreground border-0 hover:opacity-90"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              {t("premium.upgrade_btn")}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/pricing")}>
              {t("pricing.title")}
            </Button>
          </div>
        </motion.div>
      </div>
      <div className="opacity-20 pointer-events-none select-none">
        {children}
      </div>
    </div>
  );
}
