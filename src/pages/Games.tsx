import { Gamepad2, Brain, Type, Zap, AlignLeft, Code, Bug, Terminal, Lightbulb, Puzzle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import DoubtButton from "@/components/DoubtButton";

const educationalGames = [
  { name: "Word Puzzle", icon: Type, desc: "Unscramble words, unlimited levels", color: "from-green-500 to-emerald-500", path: "/games/word-puzzle" },
  { name: "Memory Match", icon: Brain, desc: "Match words to meanings", color: "from-purple-500 to-indigo-500", path: "/games/memory-match" },
  { name: "Speed Quiz", icon: Zap, desc: "Answer fast, beat the timer", color: "from-yellow-500 to-amber-500", path: "/games/speed-quiz" },
  { name: "Sentence Builder", icon: AlignLeft, desc: "Arrange words into sentences", color: "from-orange-500 to-red-500", path: "/games/sentence-builder" },
  { name: "Brain Puzzle", icon: Puzzle, desc: "Logic & pattern challenges", color: "from-teal-500 to-cyan-500", path: "/games/brain-puzzle" },
];

const programmingGames = [
  { name: "Code Builder", icon: Code, desc: "Write code to solve challenges", color: "from-blue-500 to-indigo-600", path: "/games/code-builder" },
  { name: "Bug Fix", icon: Bug, desc: "Find and fix code bugs", color: "from-red-500 to-pink-500", path: "/games/bug-fix" },
  { name: "Output Prediction", icon: Terminal, desc: "Predict what code outputs", color: "from-slate-500 to-zinc-600", path: "/games/output-predict" },
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
          onClick={() => navigate(game.path)}
          className="w-full glass rounded-2xl p-5 flex items-center gap-4 text-left group"
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
  );

  return (
    <PageShell title="Games" subtitle="Learn through play — unlimited levels" icon={<Gamepad2 className="w-7 h-7 text-foreground" />} gradientClass="from-violet-500 to-purple-600">
      <div className="space-y-6">
        {renderGameList(educationalGames, "🎓 Educational Games")}
        {renderGameList(programmingGames, "💻 Programming Games")}
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default Games;
