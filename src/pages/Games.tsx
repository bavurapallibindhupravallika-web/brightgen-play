import { Gamepad2, Brain, BookOpen, Calculator, Type, Map } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";

const games = [
  { name: "Memory Match", icon: Brain, desc: "Match pairs to boost memory", color: "from-purple-500 to-indigo-500" },
  { name: "Quiz Challenge", icon: BookOpen, desc: "Test your knowledge", color: "from-blue-500 to-cyan-500" },
  { name: "Word Puzzle", icon: Type, desc: "Unscramble & discover words", color: "from-green-500 to-emerald-500" },
  { name: "Math Challenge", icon: Calculator, desc: "Speed math puzzles", color: "from-orange-500 to-red-500" },
  { name: "Spelling Bee", icon: BookOpen, desc: "Master spelling skills", color: "from-yellow-500 to-amber-500" },
  { name: "Topic Adventure", icon: Map, desc: "Explore & learn topics", color: "from-pink-500 to-rose-500" },
];

const Games = () => (
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

    <div className="glass rounded-2xl p-4 mt-6">
      <h3 className="text-foreground font-bold text-sm mb-3">Game Modes</h3>
      <div className="grid grid-cols-2 gap-2">
        {["Play vs Computer", "Play Online", "Create Room", "Join Room"].map((mode) => (
          <button key={mode} className="glass rounded-xl py-3 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
            {mode}
          </button>
        ))}
      </div>
    </div>
  </PageShell>
);

export default Games;
