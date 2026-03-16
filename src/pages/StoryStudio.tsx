import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Film, Music, Palette, ChevronRight } from "lucide-react";
import PageShell from "@/components/PageShell";

const studioCards = [
  {
    name: "Movie Creator",
    desc: "Generate cinematic scripts with AI",
    icon: Film,
    emoji: "🎬",
    gradient: "from-red-500 to-orange-500",
    path: "/movie",
  },
  {
    name: "Song Creator",
    desc: "Write original songs & lyrics",
    icon: Music,
    emoji: "🎵",
    gradient: "from-pink-500 to-purple-500",
    path: "/song",
  },
  {
    name: "Animation Creator",
    desc: "Create animated story scripts",
    icon: Palette,
    emoji: "🎨",
    gradient: "from-cyan-500 to-blue-500",
    path: "/animated",
  },
];

const StoryStudio = () => {
  const navigate = useNavigate();

  return (
    <PageShell
      title="Story Studio"
      subtitle="Create stories, movies & songs with AI"
      icon={<Film className="w-7 h-7 text-foreground" />}
      gradientClass="from-purple-500 to-fuchsia-500"
    >
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm px-1">Choose a creative format to get started:</p>

        {studioCards.map((card, i) => (
          <motion.button
            key={card.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(card.path)}
            className="w-full relative rounded-2xl p-5 flex items-center gap-4 text-left group overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className="absolute inset-0 glass" />
            <div className="relative z-10 flex items-center gap-4 w-full">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                <span className="text-2xl">{card.emoji}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-foreground font-bold text-base">{card.name}</h3>
                <p className="text-muted-foreground text-xs mt-0.5">{card.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </motion.button>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-4 mt-4"
        >
          <h3 className="text-foreground font-bold text-sm mb-2">✨ How it works</h3>
          <ol className="space-y-2 text-muted-foreground text-xs">
            <li className="flex items-start gap-2"><span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-[10px] font-bold">1</span>Choose a format above</li>
            <li className="flex items-start gap-2"><span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-[10px] font-bold">2</span>Enter a topic & select language</li>
            <li className="flex items-start gap-2"><span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-[10px] font-bold">3</span>Generate script, images & AI voice</li>
          </ol>
        </motion.div>
      </div>
    </PageShell>
  );
};

export default StoryStudio;
