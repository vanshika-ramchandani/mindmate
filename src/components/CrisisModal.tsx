import { motion } from "framer-motion";
import { Phone, Heart, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const helplines = [
  { name: "Kiran Helpline", number: "1800-599-0019", desc: "24/7, Free, India" },
  { name: "iCall", number: "9152987821", desc: "Mon-Sat, 8am-10pm" },
  { name: "Vandrevala Foundation", number: "1860-2662-345", desc: "24/7, Multilingual" },
];

export default function CrisisModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-destructive/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive text-xl">
            <Heart className="w-5 h-5" /> You're Not Alone
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            We care about you. Please reach out to someone who can help.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {helplines.map(h => (
            <div key={h.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/50">
              <div>
                <p className="font-semibold text-card-foreground text-sm">{h.name}</p>
                <p className="text-xs text-muted-foreground">{h.desc}</p>
              </div>
              <a href={`tel:${h.number}`} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition">
                <Phone className="w-3.5 h-3.5" /> {h.number}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 rounded-xl bg-lavender-light">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm text-accent-foreground">Try This Breathing Exercise</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Breathe in slowly for 4 seconds… Hold for 7 seconds… Exhale gently for 8 seconds. Repeat 3 times.
          </p>
        </div>

        <Button onClick={onClose} variant="outline" className="w-full mt-2">I'm feeling better</Button>
      </DialogContent>
    </Dialog>
  );
}
