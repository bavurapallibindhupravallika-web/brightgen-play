import { useState, useEffect, useCallback } from "react";
import { AlignLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import DoubtButton from "@/components/DoubtButton";
import PageShell from "@/components/PageShell";

const sentenceSets = [
  { words: ["I", "am", "happy"], answer: "I am happy" },
  { words: ["She", "is", "running"], answer: "She is running" },
  { words: ["We", "love", "learning"], answer: "We love learning" },
  { words: ["The", "sun", "is", "bright"], answer: "The sun is bright" },
  { words: ["Birds", "can", "fly", "high"], answer: "Birds can fly high" },
  { words: ["I", "like", "to", "read", "books"], answer: "I like to read books" },
  { words: ["The", "cat", "sat", "on", "the", "mat"], answer: "The cat sat on the mat" },
  { words: ["They", "are", "playing", "in", "the", "park"], answer: "They are playing in the park" },
  { words: ["She", "wrote", "a", "beautiful", "poem"], answer: "She wrote a beautiful poem" },
  { words: ["Knowledge", "is", "power"], answer: "Knowledge is power" },
  { words: ["Stars", "twinkle", "at", "night"], answer: "Stars twinkle at night" },
  { words: ["He", "solved", "the", "math", "problem", "quickly"], answer: "He solved the math problem quickly" },
  { words: ["The", "earth", "revolves", "around", "the", "sun"], answer: "The earth revolves around the sun" },
  { words: ["Practice", "makes", "perfect"], answer: "Practice makes perfect" },
  { words: ["Water", "boils", "at", "hundred", "degrees"], answer: "Water boils at hundred degrees" },
];

const SentenceBuilder = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(sentenceSets[0]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [usedIdx, setUsedIdx] = useState<Set<number>>(new Set());

  const pickSentence = useCallback(() => {
    const difficulty = Math.min(3 + Math.floor(level / 3), 6);
    const eligible = sentenceSets.filter((s, i) => !usedIdx.has(i) && s.words.length <= difficulty + 2);
    let idx: number;
    if (eligible.length === 0) {
      setUsedIdx(new Set());
      idx = Math.floor(Math.random() * sentenceSets.length);
    } else {
      const s = eligible[Math.floor(Math.random() * eligible.length)];
      idx = sentenceSets.indexOf(s);
    }
    setUsedIdx((prev) => new Set(prev).add(idx));
    const sentence = sentenceSets[idx];
    setCurrent(sentence);
    setShuffledWords([...sentence.words].sort(() => Math.random() - 0.5));
    setSelectedWords([]);
    setFeedback(null);
  }, [level, usedIdx]);

  useEffect(() => { pickSentence(); }, [level]);

  const handleWordClick = (word: string, idx: number) => {
    setSelectedWords((prev) => [...prev, word]);
    setShuffledWords((prev) => prev.filter((_, i) => i !== idx));
    setFeedback(null);
  };

  const handleRemoveWord = (idx: number) => {
    const word = selectedWords[idx];
    setShuffledWords((prev) => [...prev, word]);
    setSelectedWords((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCheck = () => {
    if (selectedWords.join(" ") === current.answer) {
      setFeedback("correct");
      setScore((s) => s + level * 15);
      setTimeout(() => setLevel((l) => l + 1), 800);
    } else {
      setFeedback("wrong");
    }
  };

  return (
    <PageShell title="Sentence Builder" subtitle={`Level ${level} • Score: ${score}`} icon={<AlignLeft className="w-7 h-7 text-foreground" />} gradientClass="from-orange-500 to-red-500">
      <div className="space-y-4">
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-muted-foreground text-xs mb-3">Arrange the words to form a sentence:</p>
          <div className="min-h-[48px] glass rounded-xl p-3 flex flex-wrap gap-2 justify-center">
            {selectedWords.length === 0 && <span className="text-muted-foreground text-sm">Tap words below to build sentence</span>}
            {selectedWords.map((w, i) => (
              <motion.button key={`sel-${i}`} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                onClick={() => handleRemoveWord(i)}
                className="bg-primary/30 text-primary-foreground px-3 py-1 rounded-lg text-sm font-semibold">
                {w}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {shuffledWords.map((w, i) => (
            <motion.button key={`word-${i}`} whileTap={{ scale: 0.9 }}
              onClick={() => handleWordClick(w, i)}
              className="glass px-4 py-2 rounded-xl text-foreground font-semibold text-sm hover:bg-muted/50">
              {w}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button onClick={handleCheck} disabled={shuffledWords.length > 0}
            className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground neon-glow font-bold">
            <ArrowRight className="w-4 h-4 mr-2" /> Check
          </Button>
          <Button variant="outline" onClick={pickSentence} className="h-12 border-border/50 text-muted-foreground">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {feedback && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`glass rounded-2xl p-4 text-center font-bold ${feedback === "correct" ? "text-green-400" : "text-destructive"}`}>
            {feedback === "correct" ? `✅ Correct! +${level * 15} points` : `❌ Wrong! Correct: "${current.answer}"`}
          </motion.div>
        )}
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default SentenceBuilder;
