import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Heart, Shield, Sparkles, MessageCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Brain, title: "AI Mood Detection", desc: "Smart chatbot that understands your emotions and responds with care" },
  { icon: Heart, title: "Mood Tracking", desc: "Track your emotional patterns with beautiful visual insights" },
  { icon: Shield, title: "Safe Venting Space", desc: "Express yourself anonymously in a supportive community" },
  { icon: Sparkles, title: "Growth Plans", desc: "Personalized 7-day plans tailored to your wellbeing" },
  { icon: MessageCircle, title: "Crisis Support", desc: "Immediate resources and helpline access when you need it" },
  { icon: BookOpen, title: "AI Journal", desc: "Write freely — get insights on your thought patterns" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-calm flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold font-display text-foreground">MindMate</span>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
          <Button onClick={() => navigate("/signup")} className="gradient-calm text-primary-foreground border-0 hover:opacity-90">Get Started</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 md:px-12 pt-20 pb-24 md:pt-32 md:pb-36 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-lavender-light opacity-40 blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-soft-blue-light opacity-30 blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-lavender-light text-accent-foreground text-sm font-medium mb-6">
            ✨ Your wellbeing, reimagined
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight mb-6">
            Your Emotional Fitness<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-soft-blue">Companion</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10">
            Track moods, chat with an empathetic AI, journal your thoughts, and build healthier mental habits — all in one calm, beautiful space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/signup")} className="gradient-calm text-primary-foreground border-0 hover:opacity-90 px-8 text-base">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="px-8 text-base border-primary/30 text-foreground hover:bg-lavender-light">
              Login
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 pb-24 max-w-6xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl font-display font-bold text-center text-foreground mb-4">
          Everything you need to thrive
        </motion.h2>
        <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">Built with empathy, powered by intelligence</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="group p-6 rounded-2xl bg-card shadow-card border border-border/50 hover:shadow-soft transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-lavender-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-8 text-center text-muted-foreground text-sm">
        <p>© 2026 MindMate. Built with 💜 for your wellbeing.</p>
      </footer>
    </div>
  );
}
