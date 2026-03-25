import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Calendar, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import PremiumGate from "@/components/PremiumGate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const therapists = [
  { id: 1, name: "Dr. Ananya Sharma", spec: "Anxiety & Depression", rating: 4.9, exp: "12 years", avatar: "🧑‍⚕️", avail: "Mon–Fri" },
  { id: 2, name: "Dr. Rohan Mehta", spec: "Relationship Counseling", rating: 4.8, exp: "8 years", avatar: "👨‍⚕️", avail: "Tue–Sat" },
  { id: 3, name: "Dr. Priya Kapoor", spec: "Trauma & PTSD", rating: 4.9, exp: "15 years", avatar: "👩‍⚕️", avail: "Mon–Thu" },
  { id: 4, name: "Dr. Arjun Nair", spec: "Stress Management", rating: 4.7, exp: "6 years", avatar: "🧑‍⚕️", avail: "Wed–Sun" },
  { id: 5, name: "Dr. Meera Joshi", spec: "CBT Specialist", rating: 4.8, exp: "10 years", avatar: "👩‍⚕️", avail: "Mon–Fri" },
  { id: 6, name: "Dr. Kabir Singh", spec: "Adolescent Psychology", rating: 4.6, exp: "7 years", avatar: "👨‍⚕️", avail: "Tue–Sat" },
];

function TherapyContent() {
  const { t } = useI18n();
  const [booked, setBooked] = useState<number | null>(null);
  const { toast } = useToast();

  const confirm = () => {
    toast({ title: t("therapy.booked"), description: t("therapy.booked_desc") });
    setBooked(null);
  };

  const selected = therapists.find(th => th.id === booked);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Video className="w-6 h-6 text-primary" /> {t("therapy.title")}
        </h1>
        <p className="text-muted-foreground mt-1">{t("therapy.desc")}</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        {therapists.map((th, i) => (
          <motion.div key={th.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card rounded-2xl shadow-card border border-border/50 p-5 flex gap-4">
            <div className="w-14 h-14 rounded-xl bg-lavender-light flex items-center justify-center text-2xl shrink-0">{th.avatar}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-card-foreground">{th.name}</h3>
              <p className="text-sm text-muted-foreground">{th.spec}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {th.rating}</span>
                <span>{th.exp}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {th.avail}</span>
              </div>
              <Button size="sm" onClick={() => setBooked(th.id)} className="mt-3 gradient-calm text-primary-foreground border-0 hover:opacity-90 text-xs">
                {t("therapy.book")}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!booked} onOpenChange={() => setBooked(null)}>
        <DialogContent className="bg-card max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("therapy.confirm_title")}</DialogTitle>
            <DialogDescription>{t("therapy.confirm_desc")} {selected?.name}?</DialogDescription>
          </DialogHeader>
          <div className="bg-muted/30 rounded-xl p-4 text-sm space-y-1 text-card-foreground">
            <p><span className="font-medium">{t("therapy.therapist")}:</span> {selected?.name}</p>
            <p><span className="font-medium">{t("therapy.spec")}:</span> {selected?.spec}</p>
            <p><span className="font-medium">{t("therapy.available")}:</span> {selected?.avail}</p>
            <p><span className="font-medium">{t("therapy.mode")}:</span> {t("therapy.video")}</p>
          </div>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" onClick={() => setBooked(null)} className="flex-1">{t("therapy.cancel")}</Button>
            <Button onClick={confirm} className="flex-1 gradient-calm text-primary-foreground border-0 hover:opacity-90">{t("therapy.confirm")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Therapy() {
  return (
    <PremiumGate>
      <TherapyContent />
    </PremiumGate>
  );
}
