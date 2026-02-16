import { useState } from "react";
import { Terminal, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import DoubtButton from "@/components/DoubtButton";
import PageShell from "@/components/PageShell";
import { fetchAI } from "@/lib/ai";
import { toast } from "sonner";

interface OutputQ { code: string; options: string[]; correct: number; explanation: string; }

const OutputPredict = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<OutputQ[]>([]);
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const startGame = async () => {
    setLoading(true);
    setDone(false);
    setCurrent(0);
    setAnswered(null);
    try {
      const content = await fetchAI(
        [{ role: "user", content: `Generate 6 "predict the output" coding questions for level ${level}. Use Python or JavaScript. Return JSON array: [{code: string, options: [4 strings], correct: index 0-3, explanation: string}]` }],
        "quiz"
      );
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      setQuestions(JSON.parse(cleaned));
    } catch {
      toast.error("Failed");
    }
    setLoading(false);
  };

  const handleAnswer = (idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === questions[current].correct) setScore((s) => s + level * 15);
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setDone(true);
      } else {
        setCurrent((c) => c + 1);
        setAnswered(null);
      }
    }, 1500);
  };

  const q = questions[current];

  return (
    <PageShell title="Output Prediction" subtitle={`Level ${level} • Score: ${score}`} icon={<Terminal className="w-7 h-7 text-foreground" />} gradientClass="from-slate-500 to-zinc-600">
      <div className="space-y-4">
        {questions.length === 0 && !loading && (
          <div className="glass rounded-2xl p-8 text-center space-y-4">
            <p className="text-foreground font-bold text-lg">Level {level}</p>
            <p className="text-muted-foreground text-sm">Predict what the code will output</p>
            <Button onClick={startGame} className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
              <Play className="w-4 h-4 mr-2" /> Start
            </Button>
          </div>
        )}

        {loading && (
          <div className="glass rounded-2xl p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          </div>
        )}

        {q && !done && !loading && (
          <>
            <div className="glass rounded-2xl p-4 flex justify-between text-xs text-muted-foreground">
              <span>Q {current + 1}/{questions.length}</span>
              <span>Score: {score}</span>
            </div>
            <div className="glass rounded-2xl p-5">
              <p className="text-xs text-muted-foreground mb-2">What does this code output?</p>
              <pre className="text-foreground text-sm font-mono whitespace-pre-wrap bg-muted/30 rounded-lg p-3">{q.code}</pre>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt, i) => (
                <motion.button key={i} whileTap={{ scale: 0.95 }} onClick={() => handleAnswer(i)}
                  className={`glass rounded-xl p-3 text-sm font-mono font-semibold transition-all
                    ${answered === null ? "text-foreground hover:bg-muted/50" :
                      i === q.correct ? "bg-green-500/30 text-green-300" :
                      i === answered ? "bg-destructive/30 text-destructive" : "text-muted-foreground opacity-50"}`}>
                  {opt}
                </motion.button>
              ))}
            </div>
            {answered !== null && (
              <div className="glass rounded-2xl p-4">
                <p className="text-xs text-muted-foreground">💡 {q.explanation}</p>
              </div>
            )}
          </>
        )}

        {done && (
          <div className="glass rounded-2xl p-8 text-center space-y-4">
            <p className="text-2xl font-black text-foreground">🏆 Complete!</p>
            <p className="text-foreground">Score: <span className="text-primary font-bold">{score}</span></p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => { setLevel((l) => l + 1); setQuestions([]); }} className="bg-primary hover:bg-primary/90 text-primary-foreground">Next Level</Button>
              <Button variant="outline" onClick={() => setQuestions([])} className="border-border/50 text-muted-foreground">Replay</Button>
            </div>
          </div>
        )}
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default OutputPredict;
