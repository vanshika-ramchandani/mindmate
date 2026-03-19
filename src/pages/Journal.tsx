import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, AlertTriangle, Lightbulb, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Entry = { id: string; text: string; date: string; analysis?: { pattern: string; reframe: string } };

const negativePatterns: Record<string, { pattern: string; reframe: string }> = {
  "never": { pattern: "All-or-nothing thinking", reframe: "Try replacing 'never' with 'sometimes' — progress isn't linear!" },
  "always": { pattern: "Overgeneralization", reframe: "Consider specific situations rather than using absolutes." },
  "can't": { pattern: "Disqualifying the positive", reframe: "Reframe: 'I'm still learning how to…' — growth is a process!" },
  "worthless": { pattern: "Labeling", reframe: "You are not defined by a single moment. Think of times you felt proud." },
  "hate": { pattern: "Emotional reasoning", reframe: "Strong emotions are valid, but they don't define your reality." },
  "failure": { pattern: "Labeling", reframe: "Mistakes are data points, not definitions. What can you learn from this?" },
  "stupid": { pattern: "Negative self-talk", reframe: "Would you say this to a friend? Speak to yourself with the same kindness." },
  "ugly": { pattern: "Negative self-image", reframe: "Your worth isn't defined by appearance. What do you appreciate about yourself?" },
  "hopeless": { pattern: "Catastrophizing", reframe: "This feeling is temporary. What's one tiny thing that could improve today?" },
  "nobody": { pattern: "Mind reading", reframe: "We can't know what everyone thinks. Who has shown you care recently?" },
};

function analyzeText(text: string): { pattern: string; reframe: string } | null {
  const lower = text.toLowerCase();
  for (const [word, result] of Object.entries(negativePatterns)) {
    if (lower.includes(word)) return result;
  }
  return null;
}

export default function Journal() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [text, setText] = useState("");
  const [showAnalysis, setShowAnalysis] = useState<{ pattern: string; reframe: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mindmate_journal") || "[]");
    setEntries(saved);
  }, []);

  const save = () => {
    if (!text.trim()) return;
    const analysis = analyzeText(text);
    const entry: Entry = { id: Date.now().toString(), text, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), analysis: analysis || undefined };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem("mindmate_journal", JSON.stringify(updated));
    setShowAnalysis(analysis);
    setText("");
    toast({ title: "Entry saved 📝" });
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem("mindmate_journal", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" /> AI Mental Health Journal
        </h1>
        <p className="text-muted-foreground mt-1">Write freely. Your thoughts are analyzed for patterns with care.</p>
      </motion.div>

      <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
        <Textarea placeholder="What's on your mind today? Write freely…" value={text} onChange={e => setText(e.target.value)}
          className="min-h-[150px] bg-muted/30 border-border/50 resize-none text-card-foreground" />
        <Button onClick={save} className="mt-3 gradient-calm text-primary-foreground border-0 hover:opacity-90">Save Entry</Button>
      </div>

      <AnimatePresence>
        {showAnalysis && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card rounded-2xl shadow-card border border-border/50 p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Possible negative thinking pattern</span>
            </div>
            <p className="text-sm text-muted-foreground bg-pastel-yellow/50 px-3 py-2 rounded-lg">{showAnalysis.pattern}</p>
            <div className="flex items-center gap-2 text-primary">
              <Lightbulb className="w-5 h-5" />
              <span className="font-semibold">Suggested positive reframe</span>
            </div>
            <p className="text-sm text-muted-foreground bg-lavender-light/50 px-3 py-2 rounded-lg">{showAnalysis.reframe}</p>
            <Button variant="ghost" size="sm" onClick={() => setShowAnalysis(null)}>Dismiss</Button>
          </motion.div>
        )}
      </AnimatePresence>

      {entries.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Past Entries</h2>
          {entries.map(entry => (
            <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-muted-foreground">{entry.date}</span>
                <button onClick={() => deleteEntry(entry.id)} className="text-muted-foreground hover:text-destructive transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-card-foreground whitespace-pre-wrap">{entry.text}</p>
              {entry.analysis && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  <span className="px-2 py-1 rounded-lg bg-pastel-yellow/50 text-xs font-medium text-amber-700">{entry.analysis.pattern}</span>
                  <span className="px-2 py-1 rounded-lg bg-lavender-light/50 text-xs font-medium text-accent-foreground">{entry.analysis.reframe}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
