import { Gamepad2, Brain, Type, Zap, AlignLeft, Code, Bug, Terminal, Puzzle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import DoubtButton from "@/components/DoubtButton";

const educationalGames = [
  { name: "Word Puzzle", icon: Type, desc: "Unscramble words, 100 levels", color: "from-green-500 to-emerald-500", slug: "word-puzzle", emoji: "🌿" },
  { name: "Memory Match", icon: Brain, desc: "Match words to meanings", color: "from-purple-500 to-indigo-500", slug: "memory-match", emoji: "🧠" },
  { name: "Speed Quiz", icon: Zap, desc: "Answer fast, beat the timer", color: "from-yellow-500 to-amber-500", slug: "speed-quiz", emoji: "⚡" },
  { name: "Sentence Builder", icon: AlignLeft, desc: "Arrange words into sentences", color: "from-orange-500 to-red-500", slug: "sentence-builder", emoji: "📝" },
  { name: "Brain Puzzle", icon: Puzzle, desc: "Logic & pattern challenges", color: "from-teal-500 to-cyan-500", slug: "brain-puzzle", emoji: "🧩" },
];

const programmingGames = [
  { name: "Code Builder", icon: Code, desc: "Write code to solve challenges", color: "from-blue-500 to-indigo-600", slug: "code-builder", emoji: "💻" },
  { name: "Bug Fix", icon: Bug, desc: "Find and fix code bugs", color: "from-red-500 to-pink-500", slug: "bug-fix", emoji: "🐛" },
  { name: "Output Prediction", icon: Terminal, desc: "Predict what code outputs", color: "from-slate-500 to-zinc-600", slug: "output-predict", emoji: "🖥️" },
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
          className="w-full glass rounded-2xl p-4 flex items-center gap-4 text-left group"
        >
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center shrink-0 shadow-lg`}>
            <span className="text-2xl">{game.emoji}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-foreground font-bold">{game.name}</h3>
            <p className="text-muted-foreground text-xs mt-0.5">{game.desc}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </motion.button>
      ))}
    </div>
  );

  return (
    <PageShell title="Games" subtitle="Learn through play — 100 levels each" icon={<Gamepad2 className="w-7 h-7 text-foreground" />} gradientClass="from-violet-500 to-purple-600">
      <div className="space-y-6">
        {renderGameList(educationalGames, "🎓 Educational Games")}
        {renderGameList(programmingGames, "💻 Programming Games")}
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default Games;
