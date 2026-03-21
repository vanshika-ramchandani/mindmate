import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Heart, Dumbbell, Brain, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CrisisModal from "@/components/CrisisModal";

type Mode = "friend" | "therapist" | "coach";
type Msg = { role: "user" | "bot"; text: string };

const modeConfig: Record<Mode, { label: string; icon: typeof Heart; color: string }> = {
  friend: { label: "Best Friend", icon: Heart, color: "bg-pastel-pink" },
  therapist: { label: "Therapist", icon: Sparkles, color: "bg-accent" },
  coach: { label: "Coach", icon: Dumbbell, color: "bg-pastel-green" },
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
      sad: "Hey, I hear you… it's okay to feel this way. I'm right here with you. 💜 Want to talk more about what's going on?",
      angry: "Ugh, that sounds really frustrating. Totally valid to feel mad! Take a deep breath with me? 😤➡️😌",
      stressed: "Stress is the worst! How about a quick breathing exercise? Breathe in for 4… hold for 4… out for 4. You're doing great!",
      happy: "Yay!! I love that for you! 🎉 What's making you smile today?",
      anxious: "Anxiety can feel so overwhelming. You're safe right now. Let's ground ourselves — name 5 things you can see? 💜",
      overthinking: "I get it — your mind won't stop racing. Let's pause and take it one thought at a time. What's the main thing on your mind?",
      default: "I'm listening! Tell me more about how you're feeling. No judgment here, ever. 💜",
    },
    therapist: {
      sad: "I notice you're expressing feelings of sadness. Can you identify when this feeling started? Understanding the trigger can help us work through it.",
      angry: "Anger often signals a boundary has been crossed. What might be underlying this frustration? Let's explore that together.",
      stressed: "Stress activates our fight-or-flight response. Try the 4-7-8 breathing method — inhale 4s, hold 7s, exhale 8s.",
      happy: "It's wonderful that you're experiencing positive emotions. What factors contributed to this? Recognizing them builds resilience.",
      anxious: "Anxiety often stems from uncertainty. Let's practice cognitive reframing. What specific worry is on your mind?",
      overthinking: "Rumination can trap us in thought loops. Let's try an exercise: write down your top 3 worries, then rate each from 1-10 on how likely they are to happen.",
      default: "Thank you for sharing. How would you describe your emotional state on a scale of 1-10?",
    },
    coach: {
      sad: "Champion, tough days build tough people! 💪 Remember: every storm runs out of rain. What's ONE small win you can create today?",
      angry: "Channel that fire! 🔥 Anger is energy — let's redirect it. What would your most powerful self say to this situation?",
      stressed: "Pressure creates diamonds! 💎 Give yourself 5 minutes of pure rest, then come back and CRUSH it!",
      happy: "THAT'S the energy! 🚀 Ride this wave! Set a bold goal right now while you're feeling unstoppable!",
      anxious: "Your mind is trying to protect you, but you're STRONGER than your fears! Take action on one tiny thing right now! 💪",
      overthinking: "Analysis paralysis is real! Here's the fix: set a 2-minute timer, pick ONE action, and DO it. Motion beats meditation!",
      default: "Every day is a chance to level up! 🌟 What's your #1 priority today? Let's make it happen!",
    },
  };

  const tone = tones[mode];
  if (lower.includes("sad") || lower.includes("down") || lower.includes("cry") || lower.includes("depressed")) return tone.sad;
  if (lower.includes("angry") || lower.includes("mad") || lower.includes("furious") || lower.includes("annoyed")) return tone.angry;
  if (lower.includes("stress") || lower.includes("overwhelm") || lower.includes("pressure") || lower.includes("burnout")) return tone.stressed;
  if (lower.includes("happy") || lower.includes("great") || lower.includes("good") || lower.includes("amazing") || lower.includes("okay")) return tone.happy;
  if (lower.includes("anxious") || lower.includes("anxiety") || lower.includes("worried") || lower.includes("panic") || lower.includes("nervous")) return tone.anxious;
  if (lower.includes("overthink") || lower.includes("racing") || lower.includes("can't stop thinking") || lower.includes("ruminating")) return tone.overthinking;
  return tone.default;
}

export default function Landing() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("friend");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Hey there! 💜 I'm MindMate. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: text.trim() }]);

    if (crisisWords.some((w) => text.toLowerCase().includes(w))) {
      setShowCrisis(true);
    }

    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: getReply(text, mode) }]);
      setTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-calm flex items-center justify-center glow-primary">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold font-display text-foreground">MindMate</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-muted-foreground">
            Login
          </Button>
          <Button size="sm" onClick={() => navigate("/signup")} className="gradient-calm text-primary-foreground border-0 hover:opacity-90">
            Sign Up
          </Button>
        </div>
      </nav>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-4 py-4">
        {/* Mode Selector */}
        <div className="flex gap-2 mb-3 flex-wrap justify-center">
          {(Object.keys(modeConfig) as Mode[]).map((m) => {
            const cfg = modeConfig[m];
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  mode === m
                    ? "gradient-calm text-primary-foreground shadow-soft scale-105"
                    : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <cfg.icon className="w-3.5 h-3.5" />
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "gradient-calm text-primary-foreground rounded-br-md"
                      : "bg-card shadow-card border border-border/50 text-card-foreground rounded-bl-md"
                  }`}
                >
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 justify-center flex-wrap my-3">
            {quickMoods.map((m) => (
              <button
                key={m.keyword}
                onClick={() => sendMessage(`I'm feeling ${m.keyword}`)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary hover:bg-muted text-sm text-foreground transition-all hover:scale-105"
              >
                <span className="text-lg">{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </motion.div>
        )}

        {/* Input */}
        <div className="flex gap-2 mt-3">
          <Input
            placeholder="How are you feeling today?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            className="flex-1 bg-card border-border/50"
          />
          <Button onClick={() => sendMessage(input)} className="gradient-calm text-primary-foreground border-0 hover:opacity-90 px-4">
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Subtle CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="mt-4 text-center">
          <button
            onClick={() => navigate("/signup")}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Lock className="w-3 h-3" />
            Unlock full features — mood tracking, journal, growth plans & more
          </button>
        </motion.div>
      </div>

      <CrisisModal open={showCrisis} onClose={() => setShowCrisis(false)} />
    </div>
  );
}
