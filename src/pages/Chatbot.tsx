import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Heart, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CrisisModal from "@/components/CrisisModal";
import { useI18n } from "@/lib/i18n";

type Mode = "friend" | "therapist" | "coach";
type Msg = { role: "user" | "bot"; text: string };

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const crisisWords = [
  "suicide",
  "kill myself",
  "hopeless",
  "end my life",
  "want to die",
  "no reason to live",
];

const quickMoodKeys = [
  { emoji: "😔", key: "mood.sad", keyword: "sad" },
  { emoji: "😰", key: "mood.anxious", keyword: "anxious" },
  { emoji: "😡", key: "mood.angry", keyword: "angry" },
  { emoji: "😞", key: "mood.overthinking", keyword: "overthinking" },
  { emoji: "😊", key: "mood.okay", keyword: "happy" },
];

const modeSystemPrompts: Record<Mode, string> = {
  friend:
    "You are a warm, empathetic friend who listens actively and responds with care and understanding. Keep responses concise (2-3 sentences), conversational, and supportive. Avoid clinical language. Use a gentle, casual tone.",
  therapist:
    "You are a compassionate psychology support assistant trained in CBT and mindfulness techniques. Provide thoughtful, structured support with evidence-based coping strategies. Keep responses to 3-4 sentences, professional yet warm. Always validate feelings before offering guidance.",
  coach:
    "You are a motivational mental wellness coach focused on positive action and growth mindset. Provide encouraging, solution-focused responses with practical steps. Keep responses to 2-3 sentences, energetic and empowering. Balance validation with forward momentum.",
};

async function getGeminiReply(
  text: string,
  mode: Mode,
  lang: string,
  conversationHistory: Msg[]
): Promise<string> {
  const languageInstruction =
    lang === "hi"
      ? "Respond in Hindi."
      : lang === "gu"
      ? "Respond in Gujarati."
      : "Respond in English.";

  const systemPrompt = `${modeSystemPrompts[mode]} ${languageInstruction} If the user expresses crisis or suicidal thoughts, respond with immediate empathy and gently encourage them to seek professional help or a crisis helpline.`;

  // Build conversation context (last 6 messages for context window efficiency)
  const recentHistory = conversationHistory.slice(-6);
  const contextText = recentHistory
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`)
    .join("\n");

  const fullPrompt = contextText
    ? `${contextText}\nUser: ${text}`
    : `User: ${text}`;

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          parts: [{ text: fullPrompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.8,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error("Gemini API error:", err);
    throw new Error("Failed to get response from Gemini");
  }

  const data = await response.json();
  const reply =
    data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
    "I'm here for you. Could you tell me a little more about how you're feeling?";
  return reply;
}

export default function Chatbot() {
  const { t, lang } = useI18n();
  const [mode, setMode] = useState<Mode>("friend");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: "bot", text: t("chat.greeting") }]);
  }, [lang]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || typing) return;

    setInput("");
    setError(null);

    const updatedMessages: Msg[] = [
      ...messages,
      { role: "user", text: msg },
    ];
    setMessages(updatedMessages);

    if (crisisWords.some((w) => msg.toLowerCase().includes(w))) {
      setShowCrisis(true);
    }

    setTyping(true);
    try {
      // Pass conversation history (excluding the greeting for cleaner context)
      const history = messages.filter((m) => m.role !== "bot" || messages.indexOf(m) !== 0);
      const reply = await getGeminiReply(msg, mode, lang, history);
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the AI. Please check your API key or try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "I'm having trouble connecting right now. Please try again in a moment. 💙",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const modeKeys: { key: Mode; labelKey: string; icon: typeof Heart }[] = [
    { key: "friend", labelKey: "mode.friend", icon: Heart },
    { key: "therapist", labelKey: "mode.therapist", icon: Sparkles },
    { key: "coach", labelKey: "mode.coach", icon: Dumbbell },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Mode Selector */}
      <div className="flex gap-2 mb-3 flex-wrap">
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

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs"
        >
          ⚠️ {error}
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
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

        {/* Typing Indicator */}
        {typing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-card shadow-card border border-border/50 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1 items-center">
                <span className="text-xs text-muted-foreground mr-1">
                  {t("chat.typing")}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft"
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Mood Buttons */}
      {messages.length <= 2 && (
        <div className="flex gap-2 justify-center flex-wrap my-3">
          {quickMoodKeys.map((m) => (
            <button
              key={m.keyword}
              onClick={() => send(`I'm feeling ${m.keyword}`)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary hover:bg-muted text-sm text-foreground transition-all hover:scale-105"
            >
              <span className="text-lg">{m.emoji}</span>
              {t(m.key)}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 mt-3">
        <Input
          placeholder={t("chat.placeholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !typing && send()}
          disabled={typing}
          className="flex-1 bg-card border-border/50"
        />
        <Button
          onClick={() => send()}
          disabled={typing || !input.trim()}
          className="gradient-calm text-primary-foreground border-0 hover:opacity-90 px-4 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      <CrisisModal open={showCrisis} onClose={() => setShowCrisis(false)} />
    </div>
  );
}
