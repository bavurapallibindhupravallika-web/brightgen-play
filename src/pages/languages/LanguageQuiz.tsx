import { useState } from "react";
import { Brain, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import PageShell from "@/components/PageShell";
import DoubtButton from "@/components/DoubtButton";
import { fetchAI } from "@/lib/ai";
import { toast } from "sonner";

interface QuizQ { question: string; options: string[]; correct: number; }

const LanguageQuiz = () => {
  const [params] = useSearchParams();
  const lang = params.get("lang") || "English";
  const [questions, setQuestions] = useState<QuizQ[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    setDone(false);
    setCurrent(0);
    setScore(0);
    setAnswered(null);
    try {
      const content = await fetchAI(
        [{ role: "user", content: `Generate 10 ${lang} language quiz questions. Mix vocabulary, grammar, and comprehension. Each with 4 options.` }],
        "quiz"
      );
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      setQuestions(JSON.parse(cleaned));
    } catch {
      toast.error("Failed to generate quiz. Try again.");
    }
    setLoading(false);
  };

  const handleAnswer = (idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === questions[current].correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setDone(true);
      } else {
        setCurrent((c) => c + 1);
        setAnswered(null);
      }
    }, 800);
  };

  const q = questions[current];

  return (
    <PageShell title={`${lang} Quiz`} subtitle="Test your knowledge" icon={<Brain className="w-7 h-7 text-foreground" />} gradientClass="from-yellow-500 to-amber-500">
      <div className="space-y-4">
        {questions.length === 0 && !loading && (
          <div className="glass rounded-2xl p-8 text-center space-y-4">
            <p className="text-foreground font-bold">Ready to test your {lang}?</p>
            <Button onClick={startQuiz} className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
              <Play className="w-4 h-4 mr-2" /> Start Quiz
            </Button>
          </div>
        )}

        {loading && (
          <div className="glass rounded-2xl p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground text-sm mt-3">Generating fresh questions...</p>
          </div>
        )}

        {q && !done && !loading && (
          <>
            <div className="glass rounded-2xl p-4 flex justify-between text-xs text-muted-foreground">
              <span>Question {current + 1}/{questions.length}</span>
              <span>Score: {score}</span>
            </div>
            <div className="glass rounded-2xl p-6">
              <p className="text-foreground font-bold text-center">{q.question}</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {q.options.map((opt, i) => (
                <motion.button key={i} whileTap={{ scale: 0.95 }} onClick={() => handleAnswer(i)}
                  className={`glass rounded-xl p-4 text-sm font-semibold text-left transition-all
                    ${answered === null ? "text-foreground hover:bg-muted/50" :
                      i === q.correct ? "bg-green-500/30 text-green-300" :
                      i === answered ? "bg-destructive/30 text-destructive" : "text-muted-foreground opacity-50"}`}>
                  {opt}
                </motion.button>
              ))}
            </div>
          </>
        )}

        {done && (
          <div className="glass rounded-2xl p-8 text-center space-y-4">
            <p className="text-2xl font-black text-foreground">🏆 Quiz Complete!</p>
            <p className="text-foreground text-lg">Score: <span className="text-primary font-bold">{score}/{questions.length}</span></p>
            <Button onClick={startQuiz} className="bg-primary hover:bg-primary/90 text-primary-foreground">New Quiz</Button>
          </div>
        )}
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default LanguageQuiz;
