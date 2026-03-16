import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Film, Music, Palette, ChevronRight, ArrowLeft } from "lucide-react";
import IllustratedBackground from "@/components/IllustratedBackground";
import BottomNav from "@/components/BottomNav";

const studioCards = [
  {
    name: "Movie Creator",
    desc: "Generate cinematic scripts with AI",
    emoji: "🎬",
    gradient: "from-[hsl(0_70%_55%)] to-[hsl(30_75%_50%)]",
    path: "/movie",
  },
  {
    name: "Song Creator",
    desc: "Write original songs & lyrics",
    emoji: "🎵",
    gradient: "from-[hsl(300_60%_55%)] to-[hsl(270_65%_50%)]",
    path: "/song",
  },
  {
    name: "Animation Creator",
    desc: "Create animated story scripts",
    emoji: "🎨",
    gradient: "from-[hsl(190_65%_45%)] to-[hsl(210_60%_40%)]",
    path: "/animated",
  },
];

const StoryStudio = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen pb-24">
      <IllustratedBackground scene="nightSky" />
      <div className="relative z-10 max-w-lg mx-auto px-4 pt-6">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Back</span>
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-black text-foreground">Story Studio ✨</h1>
          <p className="text-muted-foreground text-sm mt-1">Create stories, movies & songs with AI</p>
        </motion.div>

        <div className="space-y-4">
          {studioCards.map((card, i) => (
            <motion.button
              key={card.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(card.path)}
              className="w-full relative rounded-3xl p-5 flex items-center gap-4 text-left overflow-hidden shadow-lg"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-90`} />
              <div className="absolute inset-0 bg-white/10" />
              <div className="relative z-10 flex items-center gap-4 w-full">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <span className="text-3xl">{card.emoji}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-base">{card.name}</h3>
                  <p className="text-white/70 text-xs mt-0.5">{card.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/60" />
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card/40 backdrop-blur-xl rounded-3xl p-5 mt-6 border border-border/20"
        >
          <h3 className="text-foreground font-bold text-sm mb-3">✨ How it works</h3>
          <ol className="space-y-2.5 text-muted-foreground text-xs">
            <li className="flex items-start gap-2.5">
              <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-[11px] font-bold">1</span>
              Choose a format above
            </li>
            <li className="flex items-start gap-2.5">
              <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-[11px] font-bold">2</span>
              Enter a topic & select language
            </li>
            <li className="flex items-start gap-2.5">
              <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-[11px] font-bold">3</span>
              Generate script, images & AI voice
            </li>
          </ol>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
};

export default StoryStudio;
