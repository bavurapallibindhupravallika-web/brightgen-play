import { Gamepad2, Brain, BookOpen, Type, Zap, AlignLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import DoubtButton from "@/components/DoubtButton";

const games = [
  { name: "Word Puzzle", icon: Type, desc: "Unscramble words, unlimited levels", color: "from-green-500 to-emerald-500", path: "/games/word-puzzle" },
  { name: "Memory Match", icon: Brain, desc: "Match words to meanings", color: "from-purple-500 to-indigo-500", path: "/games/memory-match" },
  { name: "Speed Quiz", icon: Zap, desc: "Answer fast, beat the timer", color: "from-yellow-500 to-amber-500", path: "/games/speed-quiz" },
  { name: "Sentence Builder", icon: AlignLeft, desc: "Arrange words into sentences", color: "from-orange-500 to-red-500", path: "/games/sentence-builder" },
];

const Games = () => {
  const navigate = useNavigate();

  return (
    <PageShell title="Games" subtitle="Learn through play — unlimited levels" icon={<Gamepad2 className="w-7 h-7 text-foreground" />} gradientClass="from-violet-500 to-purple-600">
      <div className="grid grid-cols-1 gap-4">
        {games.map((game, i) => (
          <motion.button
            key={game.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(game.path)}
            className="glass rounded-2xl p-5 flex items-center gap-4 text-left group"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center shrink-0 shadow-lg`}>
              <game.icon className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-foreground font-bold">{game.name}</h3>
              <p className="text-muted-foreground text-xs mt-0.5">{game.desc}</p>
            </div>
            <div className="text-xs text-muted-foreground glass rounded-full px-3 py-1">Play</div>
          </motion.button>
        ))}
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default Games;
