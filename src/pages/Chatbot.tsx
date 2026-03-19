import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Heart, Dumbbell, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CrisisModal from "@/components/CrisisModal";

type Mode = "friend" | "therapist" | "coach";
type Msg = { role: "user" | "bot"; text: string };

const modeConfig: Record<Mode, { label: string; icon: typeof Heart; color: string }> = {
  friend: { label: "Best Friend", icon: Heart, color: "bg-pastel-pink" },
  therapist: { label: "Therapist", icon: Sparkles, color: "bg-lavender-light" },
  coach: { label: "Motivational Coach", icon: Dumbbell, color: "bg-pastel-green" },
};

const crisisWords = ["suicide", "kill myself", "hopeless", "end my life", "want to die", "no reason to live"];

function getReply(text: string, mode: Mode): string {
  const lower = text.toLowerCase();
  const tones: Record<Mode, Record<string, string>> = {
    friend: {
      sad: "Hey, I hear you… it's okay to feel this way. I'm right here with you. 💜 Want to talk more about what's going on?",
      angry: "Ugh, that sounds really frustrating. Totally valid to feel mad! Take a deep breath with me? We got this. 😤➡️😌",
      stressed: "Stress is the worst! How about we try a quick breathing exercise? Breathe in for 4… hold for 4… out for 4. You're doing great!",
      happy: "Yay!! I love that for you! 🎉 What's making you smile today?",
      anxious: "Anxiety can feel so overwhelming. You're safe right now. Let's ground ourselves — name 5 things you can see around you?",
      default: "I'm listening! Tell me more about how you're feeling. No judgment here, ever. 💜",
    },
    therapist: {
      sad: "I notice you're expressing feelings of sadness. That's a valid emotion. Can you identify when this feeling started? Understanding the trigger can help us work through it.",
      angry: "Anger often signals that a boundary has been crossed. What do you think might be underlying this frustration? Let's explore that together.",
      stressed: "Stress activates our fight-or-flight response. I'd recommend a grounding technique: try the 4-7-8 breathing method. Inhale for 4 seconds, hold for 7, exhale for 8.",
      happy: "It's wonderful that you're experiencing positive emotions. What factors contributed to this feeling? Recognizing these can help build resilience.",
      anxious: "Anxiety often stems from uncertainty about the future. Let's practice a cognitive reframing exercise. What specific worry is on your mind?",
      default: "Thank you for sharing. How would you describe your emotional state right now on a scale of 1-10? This helps us track your progress.",
    },
    coach: {
      sad: "Champion, tough days build tough people! 💪 Remember: every storm runs out of rain. What's ONE small win you can create today?",
      angry: "Channel that fire! 🔥 Anger is energy — let's redirect it. Drop and give me 10 pushups, or write down what you'd say to this situation if you were your most powerful self!",
      stressed: "Pressure creates diamonds! 💎 But even diamonds need a break. Give yourself 5 minutes of pure rest, then come back and CRUSH it. You've overcome harder things!",
      happy: "THAT'S the energy! 🚀 Ride this wave! Set a bold goal right now while you're feeling unstoppable. What's something you've been putting off?",
      anxious: "Your mind is just trying to protect you. But you're STRONGER than your fears! Take action on one tiny thing right now — motion beats meditation when anxiety hits!",
      default: "Every day is a chance to level up! 🌟 What's your #1 priority today? Let's make it happen!",
    },
  };

  const tone = tones[mode];
  if (lower.includes("sad") || lower.includes("down") || lower.includes("cry") || lower.includes("depressed")) return tone.sad;
  if (lower.includes("angry") || lower.includes("mad") || lower.includes("furious") || lower.includes("annoyed")) return tone.angry;
  if (lower.includes("stress") || lower.includes("overwhelm") || lower.includes("pressure") || lower.includes("burnout")) return tone.stressed;
  if (lower.includes("happy") || lower.includes("great") || lower.includes("good") || lower.includes("amazing")) return tone.happy;
  if (lower.includes("anxious") || lower.includes("anxiety") || lower.includes("worried") || lower.includes("panic") || lower.includes("nervous")) return tone.anxious;
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

  const send = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text }]);

    // Crisis check
    if (crisisWords.some(w => text.toLowerCase().includes(w))) {
      setShowCrisis(true);
    }

    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "bot", text: getReply(text, mode) }]);
      setTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Mode Selector */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(Object.keys(modeConfig) as Mode[]).map(m => {
          const cfg = modeConfig[m];
          return (
            <button key={m} onClick={() => setMode(m)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === m ? cfg.color + " shadow-card scale-105" : "bg-muted/50 hover:bg-muted text-muted-foreground"}`}>
              <cfg.icon className="w-4 h-4" />
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
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" style={{ animationDelay: "0.2s" }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <Input placeholder="Type how you're feeling..." value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()} className="flex-1 bg-card border-border/50" />
        <Button onClick={send} className="gradient-calm text-primary-foreground border-0 hover:opacity-90 px-4">
          <Send className="w-4 h-4" />
        </Button>
      </div>

      <CrisisModal open={showCrisis} onClose={() => setShowCrisis(false)} />
    </div>
  );
}
