import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Heart, Handshake, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Post = { id: string; text: string; time: string; reactions: { support: number; relate: number; encourage: number } };

const initialPosts: Post[] = [
  { id: "1", text: "Had a really rough day at work. Feeling completely drained and wondering if I'm even good enough for this job.", time: "2 hours ago", reactions: { support: 12, relate: 8, encourage: 5 } },
  { id: "2", text: "My anxiety has been through the roof lately. Every little thing feels like a mountain.", time: "4 hours ago", reactions: { support: 24, relate: 18, encourage: 9 } },
  { id: "3", text: "Finally told someone about my struggles today. It was terrifying but also so freeing.", time: "6 hours ago", reactions: { support: 45, relate: 12, encourage: 31 } },
  { id: "4", text: "Missing the person I used to be before all this stress took over. Hoping to find my way back.", time: "8 hours ago", reactions: { support: 33, relate: 27, encourage: 14 } },
  { id: "5", text: "Small win today: I got out of bed, took a shower, and went for a 10-minute walk. Some days that's enough.", time: "12 hours ago", reactions: { support: 67, relate: 22, encourage: 41 } },
];

export default function VentingRoom() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [text, setText] = useState("");
  const { toast } = useToast();

  const submit = () => {
    if (!text.trim()) return;
    const post: Post = { id: Date.now().toString(), text, time: "Just now", reactions: { support: 0, relate: 0, encourage: 0 } };
    setPosts([post, ...posts]);
    setText("");
    toast({ title: "Posted anonymously 💜" });
  };

  const react = (id: string, type: keyof Post["reactions"]) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, reactions: { ...p.reactions, [type]: p.reactions[type] + 1 } } : p));
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" /> Anonymous Venting Room
        </h1>
        <p className="text-muted-foreground mt-1">A safe space to express yourself. No names, no judgment.</p>
      </motion.div>

      <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
        <Textarea placeholder="What's weighing on your heart? Let it out…" value={text} onChange={e => setText(e.target.value)}
          className="min-h-[100px] bg-muted/30 border-border/50 resize-none" />
        <Button onClick={submit} className="mt-3 gradient-calm text-primary-foreground border-0 hover:opacity-90">Post Anonymously</Button>
      </div>

      <div className="space-y-4">
        {posts.map((post, i) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card rounded-2xl shadow-card border border-border/50 p-5">
            <p className="text-sm text-card-foreground mb-3">{post.text}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{post.time}</span>
              <div className="flex gap-2">
                {([
                  { key: "support" as const, icon: "❤️", label: "Support" },
                  { key: "relate" as const, icon: "🤝", label: "Relate" },
                  { key: "encourage" as const, icon: "🌟", label: "Encourage" },
                ]).map(r => (
                  <button key={r.key} onClick={() => react(post.id, r.key)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted/50 hover:bg-muted text-xs transition">
                    <span>{r.icon}</span>
                    <span className="text-muted-foreground font-medium">{post.reactions[r.key]}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
