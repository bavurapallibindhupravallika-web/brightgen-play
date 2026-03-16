import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Clapperboard, Gamepad2, Brain, MessageCircle,
  Star, Flame, User, Crown, Settings, Trophy, Calendar, Code, Globe
} from "lucide-react";
import IllustratedBackground from "@/components/IllustratedBackground";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useDailyLimit } from "@/hooks/useDailyLimit";

const cards = [
  { name: "Story Studio", emoji: "🎬", icon: Clapperboard, gradient: "from-[hsl(280_70%_60%)] to-[hsl(320_70%_55%)]", path: "/story-studio", desc: "Create movies, songs & stories" },
  { name: "Educational Games", emoji: "🎮", icon: Gamepad2, gradient: "from-[hsl(150_60%_45%)] to-[hsl(170_55%_40%)]", path: "/games", desc: "Learn through play" },
  { name: "AI Teacher", emoji: "🤖", icon: MessageCircle, gradient: "from-[hsl(200_70%_50%)] to-[hsl(220_65%_45%)]", path: "/ai-chat", desc: "Ask anything, learn faster" },
  { name: "Quiz Challenge", emoji: "🧠", icon: Brain, gradient: "from-[hsl(30_80%_55%)] to-[hsl(15_75%_50%)]", path: "/quiz", desc: "Test your knowledge" },
  { name: "Learning Topics", emoji: "📚", icon: BookOpen, gradient: "from-[hsl(260_65%_55%)] to-[hsl(240_60%_50%)]", path: "/learning-topics", desc: "Explore any subject" },
  { name: "Languages", emoji: "🌍", icon: Globe, gradient: "from-[hsl(340_65%_55%)] to-[hsl(360_60%_50%)]", path: "/languages", desc: "Learn new languages" },
  { name: "Programming", emoji: "💻", icon: Code, gradient: "from-[hsl(180_55%_40%)] to-[hsl(200_60%_35%)]", path: "/programming", desc: "Code like a pro" },
  { name: "Daily Challenge", emoji: "📅", icon: Calendar, gradient: "from-[hsl(45_75%_50%)] to-[hsl(35_70%_45%)]", path: "/daily-challenge", desc: "New challenge every day" },
  { name: "Leaderboard", emoji: "🏆", icon: Trophy, gradient: "from-[hsl(40_80%_55%)] to-[hsl(25_75%_50%)]", path: "/leaderboard", desc: "Top learners" },
  { name: "VIP Upgrade", emoji: "👑", icon: Crown, gradient: "from-[hsl(50_85%_55%)] to-[hsl(40_80%_50%)]", path: "/vip", desc: "Unlimited access" },
  { name: "Settings", emoji: "⚙️", icon: Settings, gradient: "from-[hsl(220_25%_55%)] to-[hsl(230_30%_45%)]", path: "/settings", desc: "Customize your app" },
];

const Home = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { remaining, isVip } = useDailyLimit();

  return (
    <div className="relative min-h-screen pb-24">
      <IllustratedBackground scene="dreamySky" />
      <div className="relative z-10 max-w-lg mx-auto px-4 pt-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-foreground">Welcome to StudyFlix 👋</h1>
              <p className="text-muted-foreground text-sm mt-0.5">Your AI Learning Platform</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-card/60 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1 text-xs border border-border/30">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-foreground font-bold">{profile?.streak || 0}</span>
              </div>
              <div className="bg-card/60 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1 text-xs border border-border/30">
                <Star className="w-3.5 h-3.5 text-yellow-500" />
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
          className="bg-card/50 backdrop-blur-xl rounded-3xl p-4 mb-6 flex items-center justify-between border border-border/20 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-foreground font-bold text-sm">{profile?.username || user?.email?.split("@")[0] || "Student"}</p>
              <p className="text-muted-foreground text-xs">
                {isVip ? "💎 VIP · Unlimited" : `Free · ${remaining()} items today`}
              </p>
            </div>
          </div>
          {!isVip && (
            <button onClick={() => navigate("/vip")} className="text-xs font-bold text-primary bg-primary/10 rounded-full px-3 py-1.5 hover:bg-primary/20 transition-colors">
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
              className="relative rounded-3xl p-4 text-left overflow-hidden group shadow-lg"
            >
              {/* Gradient BG */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-90`} />
              <div className="absolute inset-0 bg-white/10" />
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2.5">
                  <span className="text-xl">{card.emoji}</span>
                </div>
                <h3 className="text-white font-bold text-sm leading-tight">{card.name}</h3>
                <p className="text-white/70 text-[10px] mt-0.5 leading-snug">{card.desc}</p>
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
