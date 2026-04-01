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
    "You are a warm, empathetic friend who listens actively and responds with care and understanding. Keep responses conversational, and supportive. Avoid clinical language. Use a gentle, casual tone.",
  therapist:
    "You are a compassionate psychology support assistant trained in CBT and mindfulness techniques. Provide thoughtful, structured support with evidence-based coping strategies. Keep responses professional yet warm. Always validate feelings before offering guidance.",
  coach:
    "You are a motivational mental wellness coach focused on positive action and growth mindset. Provide encouraging, solution-focused responses with practical steps. Keep responses energetic and empowering. Balance validation with forward momentum.",
};

const FORMATTING_INSTRUCTIONS = `
RESPONSE LENGTH — strictly match the complexity of what was asked:
- Simple feeling check-in or one-liner (e.g. "I'm sad", "I feel anxious"): 2–3 sentences max. Do NOT list tips or strategies unprompted.
- Short question (e.g. "how do I calm down?"): 3–5 sentences or a short list of 2–3 points.
- Detailed question or request for advice/help (e.g. "I've been feeling anxious for weeks, what should I do?"): full structured response with sections if helpful.
- Never pad short messages with long replies. Mirror the user's energy and depth.

FORMATTING RULES — use markdown for structure when the response is more than 3 sentences:
- Use **bold** for key terms or important phrases only.
- Use bullet points (- item) for lists of tips, steps, or strategies.
- Use numbered lists (1. step) for sequential instructions.
- Add a single relevant emoji at the start of each bullet point where it feels natural.
- Keep paragraphs short (2–3 sentences). Add a blank line between paragraphs.
- Never use headers (##) for short responses. Only use headers if the response has 3+ distinct sections.
- Do NOT use bold for entire sentences. Bold is for 1–4 words max.
`;

// Parses markdown-like text into React-renderable nodes
function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let key = 0;

  const parseLine = (line: string): React.ReactNode => {
    const parts = line.split(/\*\*(.+?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      nodes.push(<div key={key++} className="h-2" />);
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      nodes.push(
        <p key={key++} className="font-semibold text-sm mt-2 mb-0.5">
          {parseLine(line.slice(3))}
        </p>
      );
      i++;
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("• ")) {
      const bullets: React.ReactNode[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("• "))) {
        bullets.push(
          <li key={i} className="flex gap-1.5 leading-snug">
            <span className="mt-0.5 shrink-0">•</span>
            <span>{parseLine(lines[i].slice(2))}</span>
          </li>
        );
        i++;
      }
      nodes.push(
        <ul key={key++} className="space-y-1 my-1 text-sm">
          {bullets}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: React.ReactNode[] = [];
      let num = 1;
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(
          <li key={i} className="flex gap-1.5 leading-snug">
            <span className="shrink-0 font-medium">{num}.</span>
            <span>{parseLine(lines[i].replace(/^\d+\.\s/, ""))}</span>
          </li>
        );
        i++;
        num++;
      }
      nodes.push(
        <ol key={key++} className="space-y-1 my-1 text-sm">
          {items}
        </ol>
      );
      continue;
    }

    nodes.push(
      <p key={key++} className="leading-relaxed">
        {parseLine(line)}
      </p>
    );
    i++;
  }

  return nodes;
}

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

  const systemPrompt = `${modeSystemPrompts[mode]} ${languageInstruction}

${FORMATTING_INSTRUCTIONS}

If the user expresses crisis or suicidal thoughts, respond with immediate empathy and gently encourage them to seek professional help or a crisis helpline.`;

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
                {msg.role === "bot" ? (
                  <div className="space-y-0.5">{parseMarkdown(msg.text)}</div>
                ) : (
                  msg.text
                )}
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

