import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Activity, Flame, Calendar } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const moods = [
  { emoji: "😊", key: "mood.happy", color: "bg-pastel-green" },
  { emoji: "😐", key: "mood.neutral", color: "bg-pastel-yellow" },
  { emoji: "😔", key: "mood.sad", color: "bg-soft-blue-light" },
  { emoji: "😡", key: "mood.angry", color: "bg-pastel-orange" },
  { emoji: "😰", key: "mood.anxious", color: "bg-pastel-pink" },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Dashboard() {
  const { t } = useI18n();
  const [user, setUser] = useState({ name: "Friend" });
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [stressScore, setStressScore] = useState(0);
  const [moodHistory, setMoodHistory] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("mindmate_user");
    if (saved) setUser(JSON.parse(saved));
    const history = JSON.parse(localStorage.getItem("mindmate_mood_history") || "[]");
    setMoodHistory(history);
  }, []);

  const selectMood = (index: number) => {
    setSelectedMood(index);
    const stress = index === 0 ? Math.floor(Math.random() * 30) + 10 : index === 1 ? Math.floor(Math.random() * 20) + 35 : Math.floor(Math.random() * 25) + 55;
    setStressScore(stress);
    const newHistory = [...moodHistory.slice(-6), index];
    setMoodHistory(newHistory);
    localStorage.setItem("mindmate_mood_history", JSON.stringify(newHistory));
    localStorage.setItem("mindmate_last_mood", JSON.stringify({ mood: index, date: new Date().toISOString(), stress }));
  };

  const burnout = stressScore < 40 ? t("growth.low") : stressScore < 70 ? t("growth.medium") : t("growth.high");
  const burnoutColor = stressScore < 40 ? "text-green-600 bg-pastel-green" : stressScore < 70 ? "text-yellow-600 bg-pastel-yellow" : "text-red-500 bg-pastel-orange";
  const chartData = moodHistory.length > 0 ? moodHistory.slice(-7) : [0, 2, 1, 3, 1, 0, 2];
  const barHeights = chartData.map(m => ((4 - m) / 4) * 100);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t("dash.greeting_morning") : hour < 18 ? t("dash.greeting_afternoon") : t("dash.greeting_evening");

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">{greeting}, {user.name} 💜</h1>
        <p className="text-muted-foreground mt-1">{t("dash.how_feeling")}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">{t("dash.track_mood")}</h2>
        <div className="flex gap-3 flex-wrap">
          {moods.map((m, i) => (
            <button key={m.key} onClick={() => selectMood(i)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 ${selectedMood === i ? m.color + " scale-110 shadow-soft" : "bg-muted/50 hover:bg-muted"}`}>
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-xs text-muted-foreground font-medium">{t(m.key)}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-card border border-border/50 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-lavender-light flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">{t("dash.stress_score")}</span>
          </div>
          <p className="text-3xl font-bold text-card-foreground">{stressScore}<span className="text-lg text-muted-foreground">/100</span></p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-card rounded-2xl shadow-card border border-border/50 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-soft-blue-light flex items-center justify-center">
              <Flame className="w-5 h-5 text-soft-blue" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">{t("dash.burnout")}</span>
          </div>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${burnoutColor}`}>{burnout}</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl shadow-card border border-border/50 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-pastel-pink flex items-center justify-center">
              <Calendar className="w-5 h-5 text-pink-500" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">{t("dash.streak")}</span>
          </div>
          <p className="text-3xl font-bold text-card-foreground">{moodHistory.length} <span className="text-lg text-muted-foreground">{t("dash.days")}</span></p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">{t("dash.weekly")}</h2>
        <div className="flex items-end gap-3 h-32">
          {weekDays.map((d, i) => {
            const h = barHeights[i] ?? 50;
            const moodIdx = chartData[i] ?? 2;
            return (
              <div key={d} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-lg transition-all duration-500" style={{ height: `${Math.max(h, 15)}%`, background: `hsl(${255 - moodIdx * 20} ${60 - moodIdx * 5}% ${65 + moodIdx * 5}%)` }} />
                <span className="text-xs text-muted-foreground">{d}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
