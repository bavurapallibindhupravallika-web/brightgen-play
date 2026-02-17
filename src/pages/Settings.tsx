import { Settings as SettingsIcon, User, Crown, Palette, Globe, Bell, HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import { useAuth } from "@/hooks/useAuth";

const Settings = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const items = [
    { name: "Profile", icon: User, desc: "View your profile", action: () => navigate("/profile") },
    { name: "VIP Upgrade", icon: Crown, desc: "Unlock premium features", action: () => navigate("/vip") },
    { name: "Theme", icon: Palette, desc: "Customize appearance", action: () => {} },
    { name: "Language Preferences", icon: Globe, desc: "App language", action: () => {} },
    { name: "Notifications", icon: Bell, desc: "Manage alerts", action: () => {} },
    { name: "Help", icon: HelpCircle, desc: "FAQs & support", action: () => {} },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <PageShell title="Settings" subtitle="Manage your account" icon={<SettingsIcon className="w-7 h-7 text-foreground" />} gradientClass="from-slate-400 to-slate-600">
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.button key={item.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            onClick={item.action} className="w-full glass rounded-2xl p-4 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center"><item.icon className="w-5 h-5 text-muted-foreground" /></div>
            <div>
              <h3 className="text-foreground font-semibold text-sm">{item.name}</h3>
              <p className="text-muted-foreground text-xs">{item.desc}</p>
            </div>
          </motion.button>
        ))}

        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          onClick={handleLogout} className="w-full glass rounded-2xl p-4 flex items-center gap-4 text-left hover:bg-destructive/10 transition-colors mt-6">
          <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center"><LogOut className="w-5 h-5 text-destructive" /></div>
          <h3 className="text-destructive font-semibold text-sm">Logout</h3>
        </motion.button>
      </div>
    </PageShell>
  );
};

export default Settings;
