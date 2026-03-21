import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Heart, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CrisisModal from "@/components/CrisisModal";

type Mode = "friend" | "therapist" | "coach";
type Msg = { role: "user" | "bot"; text: string };

const modeConfig: Record<Mode, { label: string; icon: typeof Heart }> = {
  friend: { label: "Best Friend", icon: Heart },
  therapist: { label: "Therapist", icon: Sparkles },
  coach: { label: "Coach", icon: Dumbbell },
};

const quickMoods = [
  { emoji: "😔", label: "Sad", keyword: "sad" },
  { emoji: "😰", label: "Anxious", keyword: "anxious" },
  { emoji: "😡", label: "Angry", keyword: "angry" },
  { emoji: "😞", label: "Overthinking", keyword: "overthinking" },
  { emoji: "😊", label: "Okay", keyword: "happy" },
];

const crisisWords = ["suicide", "kill myself", "hopeless", "end my life", "want to die", "no reason to live"];

function getReply(text: string, mode: Mode): string {
  const lower = text.toLowerCase();
  const tones: Record<Mode, Record<string, string>> = {
    friend: {
      sad: "Hey, I hear you… it's okay to feel this way. I'm right here with you. 💜",
      angry: "That sounds really frustrating. Totally valid! Take a deep breath with me? 😤➡️😌",
      stressed: "Stress is the worst! Breathe in for 4… hold for 4… out for 4. You're doing great!",
      happy: "Yay!! I love that for you! 🎉 What's making you smile today?",
      anxious: "You're safe right now. Let's ground ourselves — name 5 things you can see? 💜",
      overthinking: "Your mind won't stop racing? Let's pause. What's the main thing on your mind?",
      default: "I'm listening! Tell me more. No judgment here, ever. 💜",
    },
    therapist: {
      sad: "I notice feelings of sadness. Can you identify when this started? Understanding triggers helps.",
      angry: "Anger often signals a crossed boundary. What might underlie this frustration?",
      stressed: "Try the 4-7-8 method — inhale 4s, hold 7s, exhale 8s.",
      happy: "Wonderful to experience positive emotions. What contributed to this feeling?",
      anxious: "Anxiety stems from uncertainty. Let's practice cognitive reframing. What specific worry is on your mind?",
      overthinking: "Rumination traps us in loops. Write your top 3 worries, then rate each 1-10 on likelihood.",
      default: "How would you describe your emotional state on a scale of 1-10?",
    },
    coach: {
      sad: "Champion, tough days build tough people! 💪 What's ONE small win you can create today?",
      angry: "Channel that fire! 🔥 What would your most powerful self say to this?",
      stressed: "Pressure creates diamonds! 💎 5 min rest, then CRUSH it!",
      happy: "THAT'S the energy! 🚀 Set a bold goal right now!",
      anxious: "You're STRONGER than your fears! Take action on one tiny thing now! 💪",
      overthinking: "Analysis paralysis? Set a 2-min timer, pick ONE action, DO it. Motion beats meditation!",
      default: "Every day is a chance to level up! 🌟 What's your #1 priority?",
    },
  };

  const tone = tones[mode];
  if (lower.includes("sad") || lower.includes("down") || lower.includes("cry") || lower.includes("depressed")) return tone.sad;
  if (lower.includes("angry") || lower.includes("mad") || lower.includes("furious")) return tone.angry;
  if (lower.includes("stress") || lower.includes("overwhelm") || lower.includes("pressure") || lower.includes("burnout")) return tone.stressed;
  if (lower.includes("happy") || lower.includes("great") || lower.includes("good") || lower.includes("amazing") || lower.includes("okay")) return tone.happy;
  if (lower.includes("anxious") || lower.includes("anxiety") || lower.includes("worried") || lower.includes("panic")) return tone.anxious;
  if (lower.includes("overthink") || lower.includes("racing") || lower.includes("can't stop thinking")) return tone.overthinking;
  return tone.default;
}

export default function Chatbot() {
  const [mode, setMode] = useState<Mode>("friend");
  const [messages, setMessages] = useState<Msg[]>([{ role: "bot", text: "Hey there! 💜 I'm MindMate. How are you feeling today?" }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: msg }]);

    if (crisisWords.some(w => msg.toLowerCase().includes(w))) {
      setShowCrisis(true);
    }

    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "bot", text: getReply(msg, mode) }]);
      setTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Mode Selector */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {(Object.keys(modeConfig) as Mode[]).map(m => {
          const cfg = modeConfig[m];
          return (
            <button key={m} onClick={() => setMode(m)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                mode === m
                  ? "gradient-calm text-primary-foreground shadow-soft scale-105"
                  : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
              <cfg.icon className="w-3.5 h-3.5" />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${msg.role === "user"
                ? "gradient-calm text-primary-foreground rounded-br-md"
                : "bg-card shadow-card border border-border/50 text-card-foreground rounded-bl-md"}`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-card shadow-card border border-border/50 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1 items-center">
                <span className="text-xs text-muted-foreground mr-1">AI is typing</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" style={{ animationDelay: "0.2s" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Mood Buttons */}
      {messages.length <= 2 && (
        <div className="flex gap-2 justify-center flex-wrap my-3">
          {quickMoods.map(m => (
            <button key={m.keyword} onClick={() => send(`I'm feeling ${m.keyword}`)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary hover:bg-muted text-sm text-foreground transition-all hover:scale-105">
              <span className="text-lg">{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 mt-3">
        <Input placeholder="How are you feeling today?" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()} className="flex-1 bg-card border-border/50" />
        <Button onClick={() => send()} className="gradient-calm text-primary-foreground border-0 hover:opacity-90 px-4">
          <Send className="w-4 h-4" />
        </Button>
      </div>

      <CrisisModal open={showCrisis} onClose={() => setShowCrisis(false)} />
    </div>
  );
}
