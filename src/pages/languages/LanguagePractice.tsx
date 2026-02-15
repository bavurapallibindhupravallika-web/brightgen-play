import { useState } from "react";
import { MessageSquare, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import PageShell from "@/components/PageShell";
import DoubtButton from "@/components/DoubtButton";
import { fetchAI } from "@/lib/ai";
import { toast } from "sonner";

interface Exercise { type: string; question: string; answer: string; options?: string[]; }

const LanguagePractice = () => {
  const [params] = useSearchParams();
  const lang = params.get("lang") || "English";
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);

  const loadPractice = async () => {
    setLoading(true);
    setAnswers({});
    setResults({});
    try {
      const content = await fetchAI(
        [{ role: "user", content: `Generate 6 ${lang} interactive practice exercises. Mix: fill-in-blanks, match word to meaning, translate sentence, unscramble words. Return JSON array of {type, question, answer, options (array, optional)}.` }],
        "language_lesson"
      );
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setExercises(parsed.exercises || parsed);
    } catch {
      toast.error("Failed to load. Try again.");
    }
    setLoading(false);
  };

  const checkAnswer = (idx: number, answer: string) => {
    const ex = exercises[idx];
    setAnswers((prev) => ({ ...prev, [idx]: answer }));
    setResults((prev) => ({ ...prev, [idx]: answer.toLowerCase().trim() === ex.answer.toLowerCase().trim() }));
  };

  return (
    <PageShell title={`${lang} Practice`} subtitle="Interactive exercises" icon={<MessageSquare className="w-7 h-7 text-foreground" />} gradientClass="from-green-500 to-teal-500">
      <div className="space-y-4">
        <Button onClick={loadPractice} disabled={loading} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-glow">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {loading ? "Loading..." : "Generate Practice"}
        </Button>

        {exercises.map((ex, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-4 space-y-2">
            <span className="text-[10px] text-primary font-bold uppercase">{ex.type}</span>
            <p className="text-foreground text-sm font-semibold">{ex.question}</p>
            {ex.options ? (
              <div className="grid grid-cols-2 gap-2">
                {ex.options.map((opt, j) => (
                  <button key={j} onClick={() => checkAnswer(i, opt)}
                    className={`text-xs py-2 px-3 rounded-lg font-semibold transition-all
                      ${answers[i] === opt ? (results[i] ? "bg-green-500/30 text-green-300" : "bg-destructive/30 text-destructive") : "glass text-muted-foreground hover:text-foreground"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex gap-2">
                <input value={answers[i] || ""} onChange={(e) => setAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
                  className="flex-1 bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm" placeholder="Answer..." />
                <Button size="sm" onClick={() => checkAnswer(i, answers[i] || "")} className="bg-primary text-primary-foreground"><ArrowRight className="w-4 h-4" /></Button>
              </div>
            )}
            {results[i] !== undefined && (
              <p className={`text-xs font-bold ${results[i] ? "text-green-400" : "text-destructive"}`}>
                {results[i] ? "✅ Correct!" : `❌ Answer: ${ex.answer}`}
              </p>
            )}
          </motion.div>
        ))}
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default LanguagePractice;
