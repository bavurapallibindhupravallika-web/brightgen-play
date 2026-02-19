import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Film, Music, Palette, Brain, Globe, Settings,
  Trophy, Star, Flame, User, Crown
} from "lucide-react";
import FloatingParticles from "@/components/FloatingParticles";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useDailyLimit } from "@/hooks/useDailyLimit";

const categories = [
  { name: "🎬 Movies", icon: Film, color: "from-red-500 to-orange-500", path: "/movie" },
  { name: "🎵 Songs", icon: Music, color: "from-pink-500 to-purple-500", path: "/song" },
  { name: "🎞 Animated", icon: Palette, color: "from-cyan-500 to-blue-500", path: "/animated" },
  { name: "🧠 Quiz", icon: Brain, color: "from-yellow-500 to-amber-500", path: "/quiz" },
  { name: "🌐 Languages", icon: Globe, color: "from-blue-500 to-indigo-500", path: "/languages" },
  { name: "🏆 Leaderboard", icon: Trophy, color: "from-yellow-500 to-orange-500", path: "/leaderboard" },
  { name: "👑 VIP", icon: Crown, color: "from-yellow-400 to-amber-500", path: "/vip" },
  { name: "⚙ Settings", icon: Settings, color: "from-slate-400 to-slate-600", path: "/settings" },
];

const Home = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { remaining, isVip } = useDailyLimit();

  return (
    <div className="relative min-h-screen pb-24">
      <FloatingParticles />
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black gradient-text">StudyFlix</h1>
            <p className="text-muted-foreground text-sm mt-1">Select your learning experience</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2 text-sm">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-foreground font-semibold">{profile?.streak || 0}</span>
            </div>
            <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-foreground font-semibold">{profile?.points || 0}</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-foreground font-semibold text-sm">Welcome, {profile?.username || user?.email?.split("@")[0] || "Student"}</p>
              <p className="text-muted-foreground text-xs">
                {isVip ? "💎 VIP Plan · Unlimited" : `Free Plan · ${remaining()} items today`}
              </p>
            </div>
          </div>
          {!isVip && (
            <button onClick={() => navigate("/vip")} className="text-xs font-bold text-primary glass rounded-full px-3 py-1.5 hover:bg-primary/10 transition-colors">
              Upgrade VIP
            </button>
          )}
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat, i) => (
            <motion.button key={cat.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i + 0.3, duration: 0.4 }} whileHover={{ scale: 1.04, y: -4 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate(cat.path)} className="glass rounded-2xl p-6 text-left group relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 shadow-lg`}>
                <cat.icon className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-foreground font-bold text-lg">{cat.name}</h3>
              <p className="text-muted-foreground text-xs mt-1">Tap to explore</p>
            </motion.button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
