import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Map, Settings, Globe, ArrowLeft, Home } from "lucide-react";
import ThemedBackground from "@/components/ThemedBackground";
import BottomNav from "@/components/BottomNav";

type BgTheme = "jungle" | "space" | "cyberpunk" | "candy" | "neon" | "library" | "cinema" | "music" | "tech" | "ocean" | "fire" | "ice";

interface GameHomeShellProps {
  gameName: string;
  gameSlug: string;
  icon: React.ReactNode;
  description: string;
  theme: BgTheme;
  gradient: string;
}

const GameHomeShell = ({ gameName, gameSlug, icon, description, theme, gradient }: GameHomeShellProps) => {
  const navigate = useNavigate();
  const base = `/games/${gameSlug}`;

  const navItems = [
    { label: "Home", icon: Home, path: `${base}/home` },
    { label: "Levels", icon: Map, path: `${base}/levels` },
    { label: "Settings", icon: Settings, path: `${base}/settings` },
  ];

  return (
    <div className="relative min-h-screen pb-24">
      <ThemedBackground theme={theme} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-6">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/games")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Back to Games</span>
        </motion.button>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-10"
        >
          <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto shadow-2xl`}
            style={{ boxShadow: "0 0 40px hsl(265 85% 60% / 0.4)" }}>
            {icon}
          </div>
          <h1 className="text-4xl font-black text-foreground">{gameName}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`${base}/levels`)}
            className="w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-black text-lg text-white shadow-2xl"
            style={{
              background: `linear-gradient(135deg, hsl(265 85% 55%), hsl(220 100% 55%))`,
              boxShadow: "0 0 30px hsl(265 85% 60% / 0.5)",
            }}
          >
            <Play className="w-6 h-6 fill-white" />
            PLAY NOW
          </motion.button>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Levels", icon: Map, path: `${base}/levels`, emoji: "🗺️" },
              { label: "Online", icon: Globe, path: `${base}/online`, emoji: "🌐" },
              { label: "Settings", icon: Settings, path: `${base}/settings`, emoji: "⚙️" },
            ].map((btn) => (
              <motion.button
                key={btn.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(btn.path)}
                className="glass rounded-2xl h-20 flex flex-col items-center justify-center gap-1.5 font-bold text-foreground"
              >
                <span className="text-2xl">{btn.emoji}</span>
                <span className="text-xs">{btn.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-4 mt-6 grid grid-cols-3 divide-x divide-border/30"
        >
          {[
            { label: "Levels", value: "100" },
            { label: "Players", value: "24K+" },
            { label: "Stars", value: "★ 4.9" },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-2">
              <p className="text-foreground font-black text-lg">{stat.value}</p>
              <p className="text-muted-foreground text-xs">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Bottom Game Nav */}
        <div className="fixed bottom-20 left-0 right-0 z-40 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="glass-strong border-t border-border/30 rounded-2xl px-2 py-2 flex items-center justify-around">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-0.5 px-4 py-1.5 text-muted-foreground hover:text-foreground transition-all"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-[10px] font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default GameHomeShell;
export type { BgTheme };
