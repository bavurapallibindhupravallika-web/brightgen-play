import { useState, useEffect, useCallback } from "react";
import { Type, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import DoubtButton from "@/components/DoubtButton";
import PageShell from "@/components/PageShell";

const wordBank = [
  "HELLO", "APPLE", "WATER", "HOUSE", "STUDY", "BRAIN", "MUSIC", "EARTH", "LIGHT", "PEACE",
  "HAPPY", "DANCE", "RIVER", "CLOUD", "PLANT", "DREAM", "SMILE", "HEART", "STONE", "FLAME",
  "OCEAN", "MAGIC", "POWER", "GRACE", "BRAVE", "STORM", "QUIET", "FROST", "BLOOM", "SHINE",
  "TIGER", "PEARL", "CORAL", "SOLAR", "LUNAR", "CYBER", "PRISM", "QUEST", "NOBLE", "SWIFT",
  "GLOBE", "CRANE", "BRIDGE", "JUNGLE", "VALLEY", "ISLAND", "DESERT", "FOREST", "GARDEN", "CASTLE",
  "ROCKET", "PLANET", "GALAXY", "COMET", "METEOR", "NEUTRON", "PROTON", "ELECTRON", "MOLECULE", "CRYSTAL",
];

function scramble(word: string): string {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("") === word ? scramble(word) : arr.join("");
}

const WordPuzzle = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [currentWord, setCurrentWord] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [usedWords, setUsedWords] = useState<Set<number>>(new Set());

  const pickWord = useCallback(() => {
    let idx: number;
    const maxLen = Math.min(5 + Math.floor(level / 5), 10);
    const eligible = wordBank.filter((w, i) => !usedWords.has(i) && w.length <= maxLen);
    if (eligible.length === 0) {
      setUsedWords(new Set());
      idx = Math.floor(Math.random() * wordBank.length);
    } else {
      const word = eligible[Math.floor(Math.random() * eligible.length)];
      idx = wordBank.indexOf(word);
    }
    setUsedWords((prev) => new Set(prev).add(idx));
    const w = wordBank[idx];
    setCurrentWord(w);
    setScrambled(scramble(w));
    setGuess("");
    setFeedback(null);
  }, [level, usedWords]);

  useEffect(() => { pickWord(); }, [level]);

  const handleSubmit = () => {
    if (guess.toUpperCase() === currentWord) {
      setFeedback("correct");
      setScore((s) => s + level * 10);
      setTimeout(() => setLevel((l) => l + 1), 800);
    } else {
      setFeedback("wrong");
    }
  };

  return (
    <PageShell title="Word Puzzle" subtitle={`Level ${level} • Score: ${score}`} icon={<Type className="w-7 h-7 text-foreground" />} gradientClass="from-green-500 to-emerald-500">
      <div className="space-y-6">
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-muted-foreground text-xs mb-2">Unscramble this word:</p>
          <motion.h2
            key={scrambled}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-black text-foreground tracking-[0.3em]"
          >
            {scrambled}
          </motion.h2>
        </div>

        <div className="flex gap-3">
          <Input
            value={guess}
            onChange={(e) => { setGuess(e.target.value); setFeedback(null); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Type your answer..."
            className="bg-muted/50 border-border/50 h-12 text-foreground placeholder:text-muted-foreground uppercase tracking-widest text-center text-lg"
          />
          <Button onClick={handleSubmit} className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {feedback && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`glass rounded-2xl p-4 text-center font-bold ${feedback === "correct" ? "text-green-400" : "text-destructive"}`}>
            {feedback === "correct" ? `✅ Correct! +${level * 10} points` : `❌ Try again! Hint: starts with "${currentWord[0]}"`}
          </motion.div>
        )}

        <Button variant="outline" onClick={pickWord} className="w-full border-border/50 text-muted-foreground hover:text-foreground">
          <RotateCcw className="w-4 h-4 mr-2" /> Skip Word
        </Button>
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default WordPuzzle;
