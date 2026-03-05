import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Film, Music, Palette, Brain, Globe, Settings,
  Trophy, Star, Flame, User, Crown, Code, Calendar,
  BookOpen, Gamepad2, MessageCircle
} from "lucide-react";
import FloatingParticles from "@/components/FloatingParticles";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useDailyLimit } from "@/hooks/useDailyLimit";

const categories = [
  { name: "Learning Topics", emoji: "📚", icon: BookOpen, color: "from-violet-500 to-purple-500", path: "/learning-topics", desc: "AI-powered lessons" },
  { name: "Languages", emoji: "🌐", icon: Globe, color: "from-blue-500 to-indigo-500", path: "/languages", desc: "Practice 6 languages" },
  { name: "Programming", emoji: "💻", icon: Code, color: "from-emerald-500 to-cyan-500", path: "/programming", desc: "Learn to code" },
  { name: "Movies", emoji: "🎬", icon: Film, color: "from-red-500 to-orange-500", path: "/movie", desc: "Cinematic scripts" },
  { name: "Songs", emoji: "🎵", icon: Music, color: "from-pink-500 to-purple-500", path: "/song", desc: "Musical stories" },
  { name: "Animated", emoji: "🎞", icon: Palette, color: "from-cyan-500 to-blue-500", path: "/animated", desc: "Animated scripts" },
  { name: "AI Assistant", emoji: "🤖", icon: MessageCircle, color: "from-teal-500 to-green-500", path: "/ai-chat", desc: "Chat with AI" },
  { name: "Games", emoji: "🎮", icon: Gamepad2, color: "from-fuchsia-500 to-pink-500", path: "/games", desc: "Educational games" },
  { name: "Quiz Battle", emoji: "🧠", icon: Brain, color: "from-yellow-500 to-amber-500", path: "/quiz", desc: "Test your knowledge" },
  { name: "Daily Challenge", emoji: "📅", icon: Calendar, color: "from-orange-500 to-red-500", path: "/daily-challenge", desc: "Earn badges daily" },
  { name: "Leaderboard", emoji: "🏆", icon: Trophy, color: "from-yellow-500 to-orange-500", path: "/leaderboard", desc: "Top learners" },
  { name: "VIP Upgrade", emoji: "👑", icon: Crown, color: "from-yellow-400 to-amber-500", path: "/vip", desc: "Unlimited access" },
  { name: "Settings", emoji: "⚙", icon: Settings, color: "from-slate-400 to-slate-600", path: "/settings", desc: "Customize app" },
];

const Home = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { remaining, isVip } = useDailyLimit();

  return (
    <div className="relative min-h-screen pb-24">
      <FloatingParticles />
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black gradient-text">StudyFlix</h1>
            <p className="text-muted-foreground text-sm mt-1">Your AI Learning Platform</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5 text-sm">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-foreground font-semibold">{profile?.streak || 0}</span>
            </div>
            <div className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5 text-sm">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-foreground font-semibold">{profile?.points || 0}</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-4 mb-6 flex items-center justify-between">
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
              Upgrade
            </button>
          )}
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, i) => (
            <motion.button key={cat.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i + 0.2, duration: 0.3 }} whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate(cat.path)} className="glass rounded-2xl p-4 text-left group relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2 shadow-lg`}>
                <cat.icon className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="text-foreground font-bold text-sm">{cat.emoji} {cat.name}</h3>
              <p className="text-muted-foreground text-[10px] mt-0.5">{cat.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
