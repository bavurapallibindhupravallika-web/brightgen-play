import { useState, useEffect, useRef, useCallback } from "react";
import { Zap, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import DoubtButton from "@/components/DoubtButton";
import PageShell from "@/components/PageShell";

const questionBank = [
  { q: "What is the meaning of 'Apple'?", options: ["Fruit", "Car", "Sky", "Water"], correct: 0 },
  { q: "Capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], correct: 2 },
  { q: "H₂O is the formula for?", options: ["Salt", "Water", "Sugar", "Gold"], correct: 1 },
  { q: "Largest planet in our solar system?", options: ["Mars", "Venus", "Jupiter", "Saturn"], correct: 2 },
  { q: "How many continents are there?", options: ["5", "6", "7", "8"], correct: 2 },
  { q: "What gas do plants absorb?", options: ["Oxygen", "Nitrogen", "CO₂", "Helium"], correct: 2 },
  { q: "Opposite of 'hot'?", options: ["Warm", "Cold", "Cool", "Mild"], correct: 1 },
  { q: "What is 15 × 4?", options: ["50", "55", "60", "65"], correct: 2 },
  { q: "Who wrote Romeo and Juliet?", options: ["Dickens", "Shakespeare", "Hemingway", "Austen"], correct: 1 },
  { q: "Speed of light is approximately?", options: ["300 km/s", "3000 km/s", "300,000 km/s", "3M km/s"], correct: 2 },
  { q: "Boiling point of water in °C?", options: ["90", "100", "110", "120"], correct: 1 },
  { q: "Which is the smallest prime?", options: ["0", "1", "2", "3"], correct: 2 },
  { q: "Synonym of 'happy'?", options: ["Sad", "Joyful", "Angry", "Tired"], correct: 1 },
  { q: "Earth's natural satellite?", options: ["Sun", "Mars", "Moon", "Venus"], correct: 2 },
  { q: "What does CPU stand for?", options: ["Central Process Unit", "Central Processing Unit", "Computer Power Unit", "Core Processing Unit"], correct: 1 },
  { q: "Largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
  { q: "Chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2 },
  { q: "How many seconds in a minute?", options: ["30", "60", "90", "120"], correct: 1 },
  { q: "Which vitamin from sunlight?", options: ["A", "B", "C", "D"], correct: 3 },
  { q: "What is √144?", options: ["10", "11", "12", "14"], correct: 2 },
];

const SpeedQuiz = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<"ready" | "playing" | "done">("ready");
  const [questions, setQuestions] = useState<typeof questionBank>([]);
  const [answered, setAnswered] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const generateQuestions = useCallback(() => {
    const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
    const count = Math.min(5 + level, 15);
    setQuestions(shuffled.slice(0, count));
  }, [level]);

  const startGame = () => {
    generateQuestions();
    setQIndex(0);
    setScore(0);
    setCorrect(0);
    setTimeLeft(Math.max(15, 35 - level * 2));
    setGameState("playing");
    setAnswered(null);
  };

  useEffect(() => {
    if (gameState !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); setGameState("done"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  const handleAnswer = (idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);
    const isCorrect = idx === questions[qIndex].correct;
    if (isCorrect) {
      setScore((s) => s + level * 10);
      setCorrect((c) => c + 1);
    }
    setTimeout(() => {
      if (qIndex + 1 >= questions.length) {
        clearInterval(timerRef.current);
        setGameState("done");
      } else {
        setQIndex((i) => i + 1);
        setAnswered(null);
      }
    }, 600);
  };

  const currentQ = questions[qIndex];

  return (
    <PageShell title="Speed Quiz" subtitle={`Level ${level} • Score: ${score}`} icon={<Zap className="w-7 h-7 text-foreground" />} gradientClass="from-yellow-500 to-amber-500">
      <div className="space-y-4">
        {gameState === "ready" && (
          <div className="glass rounded-2xl p-8 text-center space-y-4">
            <p className="text-foreground font-bold text-lg">Level {level}</p>
            <p className="text-muted-foreground text-sm">Answer as fast as you can!</p>
            <Button onClick={startGame} className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
              <Play className="w-4 h-4 mr-2" /> Start
            </Button>
          </div>
        )}

        {gameState === "playing" && currentQ && (
          <>
            <div className="glass rounded-2xl p-4 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Q {qIndex + 1}/{questions.length}</span>
              <span className={`text-sm font-bold ${timeLeft <= 5 ? "text-destructive" : "text-foreground"}`}>⏱ {timeLeft}s</span>
            </div>
            <div className="glass rounded-2xl p-6">
              <p className="text-foreground font-bold text-center">{currentQ.q}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {currentQ.options.map((opt, i) => (
                <motion.button key={i} whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(i)}
                  className={`glass rounded-xl p-4 text-sm font-semibold transition-all
                    ${answered === null ? "text-foreground hover:bg-muted/50" :
                      i === currentQ.correct ? "bg-green-500/30 text-green-300" :
                      i === answered ? "bg-destructive/30 text-destructive" : "text-muted-foreground opacity-50"}`}>
                  {opt}
                </motion.button>
              ))}
            </div>
          </>
        )}

        {gameState === "done" && (
          <div className="glass rounded-2xl p-8 text-center space-y-4">
            <p className="text-2xl font-black text-foreground">🏆 Results</p>
            <p className="text-foreground">Score: <span className="text-primary font-bold">{score}</span></p>
            <p className="text-muted-foreground text-sm">Correct: {correct}/{questions.length}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => { setLevel((l) => l + 1); setGameState("ready"); }} className="bg-primary hover:bg-primary/90 text-primary-foreground">Next Level</Button>
              <Button variant="outline" onClick={() => { setGameState("ready"); }} className="border-border/50 text-muted-foreground">Replay</Button>
            </div>
          </div>
        )}
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default SpeedQuiz;
