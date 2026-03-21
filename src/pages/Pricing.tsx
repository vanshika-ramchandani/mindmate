import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    icon: Zap,
    features: [
      "Chatbot access (Best Friend mode)",
      "Basic mood tracking",
      "Anonymous venting room",
      "Crisis support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Premium",
    price: "₹499",
    period: "/month",
    icon: Sparkles,
    features: [
      "All chatbot modes (Friend, Therapist, Coach)",
      "Full emotional health dashboard",
      "AI journal with pattern analysis",
      "Personalized 7-day growth plans",
      "Therapy priority booking",
      "Weekly mood insights & reports",
    ],
    cta: "Upgrade to Premium",
    popular: true,
  },
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground">Start free, upgrade when you're ready</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-2xl p-6 border transition-all ${
              plan.popular
                ? "bg-card border-primary/40 shadow-soft glow-primary"
                : "bg-card border-border/50 shadow-card"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-calm text-primary-foreground text-xs font-medium">
                Most Popular
              </span>
            )}

            <div className="flex items-center gap-2 mb-4">
              <plan.icon className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-card-foreground">{plan.name}</h3>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-foreground">{plan.price}</span>
              <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-card-foreground">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              onClick={() => {
                if (plan.popular) {
                  toast.success("Premium activated! (Demo)");
                } else {
                  navigate("/signup");
                }
              }}
              className={`w-full ${
                plan.popular
                  ? "gradient-calm text-primary-foreground border-0 hover:opacity-90"
                  : "bg-secondary text-foreground hover:bg-muted"
              }`}
            >
              {plan.cta}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
