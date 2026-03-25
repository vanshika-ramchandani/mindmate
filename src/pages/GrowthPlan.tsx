import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Moon, Zap, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import PremiumGate from "@/components/PremiumGate";

type Plan = { day: number; task: string; affirmation: string; meditation: string };

function generatePlan(sleep: number, stress: string, workHours: number): Plan[] {
  const plans: Plan[] = [];
  for (let i = 1; i <= 7; i++) {
    const tasks = [
      sleep < 6 ? "Go to bed 30 minutes earlier tonight" : "Maintain your healthy sleep schedule",
      stress === "high" ? "Take three 5-minute breathing breaks today" : "Practice one mindfulness moment",
      workHours > 8 ? "Set a firm boundary: no work after 7 PM" : "Take a 15-minute creative break",
      "Write down 3 things you're grateful for",
      "Spend 20 minutes in nature or near a window",
      "Do a body scan meditation before sleep",
      "Reach out to someone you trust and share how you feel",
    ];
    const affirmations = [
      "I am worthy of rest and peace.",
      "My feelings are valid and I honor them.",
      "I am growing stronger every day.",
      "I choose progress over perfection.",
      "I deserve compassion, especially from myself.",
      "I am more resilient than I know.",
      "Today I choose hope over fear.",
    ];
    const meditations = [
      "🧘 5-min guided breathing: Inhale peace, exhale tension",
      "🌊 10-min ocean sounds meditation",
      "🌿 Body scan relaxation (7 minutes)",
      "☀️ Morning gratitude visualization (5 min)",
      "🌙 Bedtime progressive muscle relaxation",
      "🎵 Mindful listening exercise (5 min)",
      "💫 Loving-kindness meditation (10 min)",
    ];
    plans.push({ day: i, task: tasks[i - 1], affirmation: affirmations[i - 1], meditation: meditations[i - 1] });
  }
  return plans;
}

function GrowthPlanContent() {
  const { t } = useI18n();
  const [sleep, setSleep] = useState("");
  const [stress, setStress] = useState("");
  const [workHours, setWorkHours] = useState("");
  const [plan, setPlan] = useState<Plan[] | null>(null);
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    if (!sleep || !stress || !workHours) return;
    setGenerating(true);
    setTimeout(() => {
      setPlan(generatePlan(Number(sleep), stress, Number(workHours)));
      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" /> {t("growth.title")}
        </h1>
        <p className="text-muted-foreground mt-1">{t("growth.desc")}</p>
      </motion.div>

      <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-card-foreground mb-1 flex items-center gap-2"><Moon className="w-4 h-4" /> {t("growth.sleep")}</label>
          <Input type="number" placeholder="e.g. 6" value={sleep} onChange={e => setSleep(e.target.value)} className="bg-muted/30 border-border/50 mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-card-foreground mb-1 flex items-center gap-2"><Zap className="w-4 h-4" /> {t("growth.stress")}</label>
          <Select value={stress} onValueChange={setStress}>
            <SelectTrigger className="bg-muted/30 border-border/50 mt-1"><SelectValue placeholder={t("growth.select_stress")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">{t("growth.low")}</SelectItem>
              <SelectItem value="medium">{t("growth.medium")}</SelectItem>
              <SelectItem value="high">{t("growth.high")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-card-foreground mb-1 flex items-center gap-2"><Clock className="w-4 h-4" /> {t("growth.work")}</label>
          <Input type="number" placeholder="e.g. 8" value={workHours} onChange={e => setWorkHours(e.target.value)} className="bg-muted/30 border-border/50 mt-1" />
        </div>
        <Button onClick={generate} disabled={generating} className="w-full gradient-calm text-primary-foreground border-0 hover:opacity-90">
          {generating ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> {t("growth.generating")}</span> : t("growth.generate")}
        </Button>
      </div>

      <AnimatePresence>
        {plan && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">{t("growth.result")}</h2>
            {plan.map((day, i) => (
              <motion.div key={day.day} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl shadow-card border border-border/50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-full gradient-calm text-primary-foreground flex items-center justify-center text-sm font-bold">{day.day}</span>
                  <span className="font-semibold text-card-foreground">Day {day.day}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-card-foreground">{day.task}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="shrink-0">💬</span>
                    <span className="text-muted-foreground italic">"{day.affirmation}"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="shrink-0">{day.meditation.slice(0, 2)}</span>
                    <span className="text-muted-foreground">{day.meditation.slice(2)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GrowthPlan() {
  return (
    <PremiumGate>
      <GrowthPlanContent />
    </PremiumGate>
  );
}
