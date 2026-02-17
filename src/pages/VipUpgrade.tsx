import { Crown, Check } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const plans = [
  { name: "Free", price: "₹0", period: "", features: ["10 generations/day", "All content types", "Quiz & Tests", "AI Assistant"], current: true },
  { name: "VIP 2 Months", price: "₹299", period: "2 months", features: ["Unlimited generations", "No ads", "Download access", "Priority AI", "All games unlocked"], current: false },
  { name: "VIP 1 Year", price: "₹999", period: "1 year", features: ["Unlimited generations", "No ads", "Download access", "Priority AI", "All games unlocked", "Best value!"], current: false, popular: true },
];

const VipUpgrade = () => {
  const { profile } = useAuth();
  const isVip = profile?.vip_status === "vip";

  const handleUpgrade = (plan: string) => {
    toast.info(`Payment integration coming soon for ${plan}! Contact support for early access.`);
  };

  return (
    <PageShell title="VIP Upgrade" subtitle="Unlock unlimited learning" icon={<Crown className="w-7 h-7 text-foreground" />} gradientClass="from-yellow-500 to-amber-500">
      <div className="space-y-4">
        {isVip && (
          <div className="glass rounded-2xl p-4 text-center border border-yellow-500/30">
            <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-foreground font-bold">You're a VIP Member!</p>
            <p className="text-muted-foreground text-xs">Expires: {profile?.vip_expires_at ? new Date(profile.vip_expires_at).toLocaleDateString() : "Never"}</p>
          </div>
        )}

        {plans.map((plan, i) => (
          <motion.div key={plan.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`glass rounded-2xl p-5 relative ${plan.popular ? "border border-primary/50 neon-glow" : ""}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full">
                BEST VALUE
              </div>
            )}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-foreground font-bold text-lg">{plan.name}</h3>
                {plan.period && <p className="text-muted-foreground text-xs">{plan.period}</p>}
              </div>
              <p className="text-foreground font-black text-2xl">{plan.price}</p>
            </div>
            <ul className="space-y-1.5 mb-4">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-green-400" /> {f}
                </li>
              ))}
            </ul>
            {plan.current ? (
              <Button disabled className="w-full" variant="outline">Current Plan</Button>
            ) : (
              <Button onClick={() => handleUpgrade(plan.name)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-glow">
                Upgrade Now
              </Button>
            )}
          </motion.div>
        ))}

        <div className="glass rounded-2xl p-4">
          <h3 className="text-foreground font-bold text-sm mb-2">Payment Methods</h3>
          <div className="grid grid-cols-2 gap-2">
            {["UPI", "Google Pay", "PhonePe", "Credit/Debit Card"].map((method) => (
              <div key={method} className="glass rounded-lg p-2.5 text-center">
                <p className="text-muted-foreground text-xs font-semibold">{method}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default VipUpgrade;
