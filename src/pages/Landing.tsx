import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Heart, Dumbbell, Brain, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CrisisModal from "@/components/CrisisModal";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n, chatResponses } from "@/lib/i18n";

type Mode = "friend" | "therapist" | "coach";
type Msg = { role: "user" | "bot"; text: string };

const crisisWords = ["suicide", "kill myself", "hopeless", "end my life", "want to die", "no reason to live"];

const quickMoodKeys = [
  { emoji: "😔", key: "mood.sad", keyword: "sad" },
  { emoji: "😰", key: "mood.anxious", keyword: "anxious" },
  { emoji: "😡", key: "mood.angry", keyword: "angry" },
  { emoji: "😞", key: "mood.overthinking", keyword: "overthinking" },
  { emoji: "😊", key: "mood.okay", keyword: "happy" },
];

function getReply(text: string, mode: Mode, lang: "en" | "hi" | "gu"): string {
  const lower = text.toLowerCase();
  const responses = chatResponses[lang]?.[mode] || chatResponses.en[mode];

  if (lower.includes("sad") || lower.includes("down") || lower.includes("cry") || lower.includes("depressed") || lower.includes("उदास") || lower.includes("ઉદાસ")) return responses.sad;
  if (lower.includes("angry") || lower.includes("mad") || lower.includes("गुस्सा") || lower.includes("ગુસ્સો")) return responses.angry;
  if (lower.includes("stress") || lower.includes("overwhelm") || lower.includes("तनाव") || lower.includes("તણાવ")) return responses.stressed;
  if (lower.includes("happy") || lower.includes("great") || lower.includes("good") || lower.includes("okay") || lower.includes("खुश") || lower.includes("ખુશ")) return responses.happy;
  if (lower.includes("anxious") || lower.includes("anxiety") || lower.includes("worried") || lower.includes("चिंतित") || lower.includes("ચિંતિત")) return responses.anxious;
  if (lower.includes("overthink") || lower.includes("racing") || lower.includes("सोच") || lower.includes("વિચાર")) return responses.overthinking;
  return responses.default;
}

export default function Landing() {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const [mode, setMode] = useState<Mode>("friend");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: "bot", text: t("chat.greeting") }]);
  }, [lang]);

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
      setMessages((prev) => [...prev, { role: "bot", text: getReply(text, mode, lang) }]);
      setTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const modeKeys: { key: Mode; labelKey: string; icon: typeof Heart }[] = [
    { key: "friend", labelKey: "mode.friend", icon: Heart },
    { key: "therapist", labelKey: "mode.therapist", icon: Sparkles },
    { key: "coach", labelKey: "mode.coach", icon: Dumbbell },
  ];

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
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-muted-foreground">
            {t("chat.login")}
          </Button>
          <Button size="sm" onClick={() => navigate("/signup")} className="gradient-calm text-primary-foreground border-0 hover:opacity-90">
            {t("chat.signup")}
          </Button>
        </div>
      </nav>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-4 py-4">
        {/* Mode Selector */}
        <div className="flex gap-2 mb-3 flex-wrap justify-center">
          {modeKeys.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                mode === m.key
                  ? "gradient-calm text-primary-foreground shadow-soft scale-105"
                  : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <m.icon className="w-3.5 h-3.5" />
              {t(m.labelKey)}
            </button>
          ))}
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
                  <span className="text-xs text-muted-foreground mr-1">{t("chat.typing")}</span>
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
            {quickMoodKeys.map((m) => (
              <button
                key={m.keyword}
                onClick={() => sendMessage(`I'm feeling ${m.keyword}`)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary hover:bg-muted text-sm text-foreground transition-all hover:scale-105"
              >
                <span className="text-lg">{m.emoji}</span>
                {t(m.key)}
              </button>
            ))}
          </motion.div>
        )}

        {/* Input */}
        <div className="flex gap-2 mt-3">
          <Input
            placeholder={t("chat.placeholder")}
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
            {t("chat.unlock")}
          </button>
        </motion.div>
      </div>

      <CrisisModal open={showCrisis} onClose={() => setShowCrisis(false)} />
    </div>
  );
}
