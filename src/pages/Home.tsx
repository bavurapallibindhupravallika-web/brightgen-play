import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Clapperboard, Gamepad2, Brain, MessageCircle,
  Star, Flame, User, Crown, Settings, Trophy, Calendar
} from "lucide-react";
import FloatingParticles from "@/components/FloatingParticles";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useDailyLimit } from "@/hooks/useDailyLimit";

const cards = [
  { name: "Continue Learning", emoji: "📚", icon: BookOpen, gradient: "from-blue-500 to-indigo-600", path: "/learn", desc: "Pick up where you left off" },
  { name: "Story Studio", emoji: "🎬", icon: Clapperboard, gradient: "from-purple-500 to-fuchsia-500", path: "/story-studio", desc: "Create movies, songs & stories" },
  { name: "Educational Games", emoji: "🎮", icon: Gamepad2, gradient: "from-pink-500 to-rose-500", path: "/games", desc: "Learn through play" },
  { name: "AI Teacher", emoji: "🤖", icon: MessageCircle, gradient: "from-orange-400 to-amber-500", path: "/ai-chat", desc: "Ask anything, learn faster" },
  { name: "Quiz Challenge", emoji: "🧠", icon: Brain, gradient: "from-teal-400 to-cyan-500", path: "/quiz", desc: "Test your knowledge" },
  { name: "Daily Challenge", emoji: "📅", icon: Calendar, gradient: "from-emerald-400 to-green-500", path: "/daily-challenge", desc: "New challenge every day" },
  { name: "Leaderboard", emoji: "🏆", icon: Trophy, gradient: "from-yellow-400 to-orange-500", path: "/leaderboard", desc: "Top learners" },
  { name: "VIP Upgrade", emoji: "👑", icon: Crown, gradient: "from-amber-400 to-yellow-300", path: "/vip", desc: "Unlimited access" },
  { name: "Settings", emoji: "⚙️", icon: Settings, gradient: "from-slate-400 to-gray-500", path: "/settings", desc: "Customize your app" },
];

const Home = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { remaining, isVip } = useDailyLimit();

  return (
    <div className="relative min-h-screen pb-24">
      <FloatingParticles />
      <div className="relative z-10 max-w-lg mx-auto px-4 pt-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-foreground">Welcome to StudyFlix 👋</h1>
              <p className="text-muted-foreground text-sm mt-0.5">Your AI Learning Platform</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="glass rounded-full px-2.5 py-1 flex items-center gap-1 text-xs">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-foreground font-bold">{profile?.streak || 0}</span>
              </div>
              <div className="glass rounded-full px-2.5 py-1 flex items-center gap-1 text-xs">
                <Star className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-foreground font-bold">{profile?.points || 0}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4 mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-foreground font-semibold text-sm">{profile?.username || user?.email?.split("@")[0] || "Student"}</p>
              <p className="text-muted-foreground text-xs">
                {isVip ? "💎 VIP · Unlimited" : `Free · ${remaining()} items today`}
              </p>
            </div>
          </div>
          {!isVip && (
            <button onClick={() => navigate("/vip")} className="text-xs font-bold text-primary glass rounded-full px-3 py-1.5 hover:bg-primary/10 transition-colors">
              Upgrade
            </button>
          )}
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {cards.map((card, i) => (
            <motion.button
              key={card.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.04 * i + 0.15, duration: 0.3 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(card.path)}
              className="relative rounded-2xl p-4 text-left overflow-hidden group"
            >
              {/* Gradient BG */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-15 group-hover:opacity-25 transition-opacity duration-300`} />
              <div className="absolute inset-0 glass" />
              <div className="relative z-10">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-2.5 shadow-lg`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-foreground font-bold text-sm leading-tight">{card.name}</h3>
                <p className="text-muted-foreground text-[10px] mt-0.5 leading-snug">{card.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Home;
