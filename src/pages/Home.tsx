import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Film, Music, Palette, Brain, MessageCircle, Gamepad2, Globe, Settings,
  Trophy, Star, Flame, User, Home as HomeIcon, LogOut
} from "lucide-react";
import FloatingParticles from "@/components/FloatingParticles";

const categories = [
  { name: "Movie", icon: Film, color: "from-red-500 to-orange-500", path: "/movie" },
  { name: "Song", icon: Music, color: "from-pink-500 to-purple-500", path: "/song" },
  { name: "Animated", icon: Palette, color: "from-cyan-500 to-blue-500", path: "/animated" },
  { name: "Quiz", icon: Brain, color: "from-yellow-500 to-amber-500", path: "/quiz" },
  { name: "AI Chat", icon: MessageCircle, color: "from-emerald-500 to-teal-500", path: "/ai-chat" },
  { name: "Games", icon: Gamepad2, color: "from-violet-500 to-purple-600", path: "/games" },
  { name: "Languages", icon: Globe, color: "from-blue-500 to-indigo-500", path: "/languages" },
  { name: "Settings", icon: Settings, color: "from-slate-400 to-slate-600", path: "/settings" },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen pb-24">
      <FloatingParticles />

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-black gradient-text">StudyFlix</h1>
            <p className="text-muted-foreground text-sm mt-1">Select your learning experience</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2 text-sm">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-foreground font-semibold">5</span>
            </div>
            <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-foreground font-semibold">120</span>
            </div>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-4 mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-foreground font-semibold text-sm">Welcome, Student</p>
              <p className="text-muted-foreground text-xs">Free Plan · 10 videos today</p>
            </div>
          </div>
          <button className="text-xs font-bold text-neon-cyan glass rounded-full px-3 py-1.5 hover:bg-neon-cyan/10 transition-colors">
            Upgrade VIP
          </button>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i + 0.3, duration: 0.4 }}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(cat.path)}
              className="glass rounded-2xl p-6 text-left group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 shadow-lg`}>
                <cat.icon className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-foreground font-bold text-lg">{cat.name}</h3>
              <p className="text-muted-foreground text-xs mt-1">Tap to explore</p>
            </motion.button>
          ))}
        </div>

        {/* Recent Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8"
        >
          <h2 className="text-foreground font-bold text-lg mb-4">Recent Content</h2>
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-muted-foreground text-sm">No content yet. Start creating!</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Nav */}
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        <div className="glass-strong border-t border-border/30 px-6 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-around">
            {[
              { icon: HomeIcon, label: "Home", path: "/home", active: true },
              { icon: User, label: "Profile", path: "/profile", active: false },
              { icon: Trophy, label: "Ranks", path: "/leaderboard", active: false },
              { icon: LogOut, label: "Logout", path: "/", active: false },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
                  item.active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
