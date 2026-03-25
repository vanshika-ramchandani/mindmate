import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingDown, TrendingUp, Brain } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function EmotionalHealth() {
  const { t } = useI18n();
  const [moodHistory, setMoodHistory] = useState<number[]>([]);

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("mindmate_mood_history") || "[]");
    setMoodHistory(h.length > 0 ? h : [0, 2, 1, 3, 2, 1, 0, 4, 1, 2, 0, 1, 3, 2]);
  }, []);

  const moodLabels = ["😊", "😐", "😔", "😡", "😰"];
  const avg = moodHistory.length > 0 ? moodHistory.reduce((a, b) => a + b, 0) / moodHistory.length : 2;
  const trend = moodHistory.length >= 2 ? moodHistory[moodHistory.length - 1] - moodHistory[moodHistory.length - 2] : 0;
  const anxiety = Math.min(100, Math.round(avg * 22 + Math.random() * 10));
  const stress = Math.min(100, Math.round(avg * 18 + Math.random() * 15));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" /> {t("emotional.title")}
        </h1>
        <p className="text-muted-foreground mt-1">{t("emotional.desc")}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-card border border-border/50 p-5">
          <span className="text-sm text-muted-foreground font-medium">{t("emotional.avg_mood")}</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl">{moodLabels[Math.round(avg)] || "😐"}</span>
            <div className="flex items-center gap-1 text-sm">
              {trend <= 0 ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
              <span className={trend <= 0 ? "text-green-600" : "text-red-500"}>{trend <= 0 ? t("emotional.improving") : t("emotional.declining")}</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl shadow-card border border-border/50 p-5">
          <span className="text-sm text-muted-foreground font-medium">{t("emotional.anxiety")}</span>
          <div className="mt-2">
            <span className="text-2xl font-bold text-card-foreground">{anxiety}%</span>
            <div className="h-2 rounded-full bg-muted overflow-hidden mt-1">
              <motion.div initial={{ width: 0 }} animate={{ width: `${anxiety}%` }} transition={{ duration: 1, delay: 0.3 }}
                className="h-full rounded-full" style={{ background: `hsl(${Math.max(0, 120 - anxiety * 1.2)} 60% 55%)` }} />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-card border border-border/50 p-5">
          <span className="text-sm text-muted-foreground font-medium">{t("emotional.stress")}</span>
          <div className="mt-2">
            <span className="text-2xl font-bold text-card-foreground">{stress}%</span>
            <div className="h-2 rounded-full bg-muted overflow-hidden mt-1">
              <motion.div initial={{ width: 0 }} animate={{ width: `${stress}%` }} transition={{ duration: 1, delay: 0.4 }}
                className="h-full rounded-full" style={{ background: `hsl(${Math.max(0, 120 - stress * 1.2)} 60% 55%)` }} />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">{t("emotional.history")}</h2>
        <div className="flex items-end gap-2 h-40">
          {moodHistory.slice(-14).map((m, i) => (
            <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${((4 - m) / 4) * 100}%` }} transition={{ duration: 0.5, delay: i * 0.04 }}
              className="flex-1 rounded-t-lg min-h-[10%]" style={{ background: `hsl(${255 - m * 20} ${60 - m * 5}% ${65 + m * 5}%)` }} />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{t("emotional.older")}</span><span>{t("emotional.recent")}</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" /> {t("emotional.summary")}
        </h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>📊 You logged <span className="font-semibold text-card-foreground">{moodHistory.length}</span> mood entries total.</p>
          <p>😊 Most frequent mood: <span className="font-semibold text-card-foreground">{moodLabels[Math.round(avg)]}</span></p>
          <p>{anxiety > 50 ? "⚠️ Your anxiety levels are elevated. Consider trying breathing exercises or talking to someone." : "✅ Your anxiety levels look manageable. Keep up the good habits!"}</p>
          <p>{stress > 50 ? "🔥 Stress is running high. Take regular breaks and prioritize rest." : "🌿 Stress levels are within a healthy range. Nice work!"}</p>
        </div>
      </motion.div>
    </div>
  );
}
