import { Brain, Type, Zap, AlignLeft, Code, Bug, Terminal, Puzzle, ChevronRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import IllustratedBackground from "@/components/IllustratedBackground";
import BottomNav from "@/components/BottomNav";
import DoubtButton from "@/components/DoubtButton";

const educationalGames = [
  { name: "Word Puzzle", desc: "Unscramble words, 100 levels", slug: "word-puzzle", emoji: "🌿", gradient: "from-[hsl(150_60%_45%)] to-[hsl(170_55%_40%)]" },
  { name: "Memory Match", desc: "Match words to meanings", slug: "memory-match", emoji: "🧠", gradient: "from-[hsl(270_60%_55%)] to-[hsl(250_55%_50%)]" },
  { name: "Speed Quiz", desc: "Answer fast, beat the timer", slug: "speed-quiz", emoji: "⚡", gradient: "from-[hsl(45_80%_50%)] to-[hsl(35_75%_45%)]" },
  { name: "Sentence Builder", desc: "Arrange words into sentences", slug: "sentence-builder", emoji: "📝", gradient: "from-[hsl(20_75%_50%)] to-[hsl(0_70%_48%)]" },
  { name: "Brain Puzzle", desc: "Logic & pattern challenges", slug: "brain-puzzle", emoji: "🧩", gradient: "from-[hsl(180_55%_42%)] to-[hsl(195_50%_38%)]" },
];

const programmingGames = [
  { name: "Code Builder", desc: "Write code to solve challenges", slug: "code-builder", emoji: "💻", gradient: "from-[hsl(220_65%_50%)] to-[hsl(240_60%_45%)]" },
  { name: "Bug Fix", desc: "Find and fix code bugs", slug: "bug-fix", emoji: "🐛", gradient: "from-[hsl(350_65%_50%)] to-[hsl(330_60%_45%)]" },
  { name: "Output Prediction", desc: "Predict what code outputs", slug: "output-predict", emoji: "🖥️", gradient: "from-[hsl(210_30%_45%)] to-[hsl(220_25%_38%)]" },
];

const Games = () => {
  const navigate = useNavigate();

  const renderGameList = (games: typeof educationalGames, title: string) => (
    <div className="space-y-3">
      <h3 className="text-foreground font-bold text-sm px-1">{title}</h3>
      {games.map((game, i) => (
        <motion.button
          key={game.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/games/${game.slug}/home`)}
          className="w-full relative rounded-3xl p-4 flex items-center gap-4 text-left overflow-hidden shadow-md"
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${game.gradient} opacity-90`} />
          <div className="absolute inset-0 bg-white/10" />
          <div className="relative z-10 flex items-center gap-4 w-full">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <span className="text-2xl">{game.emoji}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold">{game.name}</h3>
              <p className="text-white/70 text-xs mt-0.5">{game.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/60" />
          </div>
        </motion.button>
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen pb-24">
      <IllustratedBackground scene="gameWorld" />
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
          <h1 className="text-2xl font-black text-foreground">Games 🎮</h1>
          <p className="text-muted-foreground text-sm mt-1">Learn through play — 100 levels each</p>
        </motion.div>

        <div className="space-y-6">
          {renderGameList(educationalGames, "🎓 Educational Games")}
          {renderGameList(programmingGames, "💻 Programming Games")}
        </div>
      </div>
      <DoubtButton />
      <BottomNav />
    </div>
  );
};

export default Games;
