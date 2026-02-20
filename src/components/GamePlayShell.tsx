import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, RotateCcw, Lightbulb, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemedBackground from "@/components/ThemedBackground";
import BottomNav from "@/components/BottomNav";
import type { BgTheme } from "@/components/GameHomeShell";

interface GamePlayShellProps {
  gameName: string;
  gameSlug: string;
  theme: BgTheme;
  children: (props: {
    level: number;
    score: number;
    lives: number;
    addScore: (pts: number) => void;
    loseLife: () => void;
    resetGame: () => void;
  }) => React.ReactNode;
}

const GamePlayShell = ({ gameName, gameSlug, theme, children }: GamePlayShellProps) => {
  const navigate = useNavigate();
  const { level: levelParam } = useParams();
  const level = parseInt(levelParam || "1", 10);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const addScore = (pts: number) => setScore((s) => s + pts);
  const loseLife = () => {
    setLives((l) => {
      const next = l - 1;
      if (next <= 0) setGameOver(true);
      return next;
    });
  };
  const resetGame = () => {
    setScore(0);
    setLives(5);
    setGameOver(false);
    setShowHint(false);
  };

  return (
    <div className="relative min-h-screen pb-24">
      <ThemedBackground theme={theme} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-4">
        {/* Top Bar */}
        <div className="glass rounded-2xl p-3 mb-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`/games/${gameSlug}/levels`)}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-semibold">Levels</span>
          </button>

          <div className="flex flex-col items-center">
            <span className="text-foreground font-black text-sm">Level {level}</span>
            <span className="text-primary text-xs font-bold">{gameName}</span>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={`text-sm transition-all ${i < lives ? "opacity-100" : "opacity-20 grayscale"}`}>❤️</span>
            ))}
          </div>
        </div>

        {/* Score */}
        <div className="flex justify-between items-center mb-4 px-1">
          <span className="text-muted-foreground text-xs">Score</span>
          <motion.span
            key={score}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            className="text-primary font-black text-xl"
          >
            {score}
          </motion.span>
        </div>

        {/* Game Content */}
        {!gameOver ? (
          children({ level, score, lives, addScore, loseLife, resetGame })
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-10 text-center space-y-4"
          >
            <p className="text-5xl">💔</p>
            <p className="text-2xl font-black text-foreground">Game Over!</p>
            <p className="text-muted-foreground text-sm">Final Score: <span className="text-primary font-bold">{score}</span></p>
            <div className="flex gap-3 justify-center">
              <Button onClick={resetGame} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-glow">
                <RotateCcw className="w-4 h-4 mr-2" /> Retry
              </Button>
              <Button variant="outline" onClick={() => navigate(`/games/${gameSlug}/levels`)} className="border-border/50 text-foreground">
                <Home className="w-4 h-4 mr-2" /> Levels
              </Button>
            </div>
          </motion.div>
        )}

        {/* Bottom buttons */}
        {!gameOver && (
          <div className="grid grid-cols-3 gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowHint(!showHint)}
              className="h-12 text-xs border-border/50 text-foreground gap-1">
              <Lightbulb className="w-4 h-4" /> Hint
            </Button>
            <Button variant="outline" onClick={resetGame}
              className="h-12 text-xs border-border/50 text-foreground gap-1">
              <RotateCcw className="w-4 h-4" /> Restart
            </Button>
            <Button variant="outline" onClick={() => navigate(`/games/${gameSlug}/home`)}
              className="h-12 text-xs border-border/50 text-foreground gap-1">
              <Home className="w-4 h-4" /> Home
            </Button>
          </div>
        )}

        {showHint && !gameOver && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4 mt-3 text-center"
          >
            <p className="text-yellow-400 text-sm">💡 <strong>Hint:</strong> Think carefully about the pattern and use elimination strategy!</p>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default GamePlayShell;
