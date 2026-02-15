import { useState } from "react";
import { BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import PageShell from "@/components/PageShell";
import DoubtButton from "@/components/DoubtButton";
import { fetchAI } from "@/lib/ai";
import { toast } from "sonner";

interface WordItem { word: string; meaning: string; sentence: string; pronunciation: string; }
interface Exercise { type: string; question: string; answer: string; options?: string[]; }

const LanguageLearn = () => {
  const [params] = useSearchParams();
  const lang = params.get("lang") || "English";
  const [level, setLevel] = useState(1);
  const [words, setWords] = useState<WordItem[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<number, string>>({});
  const [exerciseResults, setExerciseResults] = useState<Record<number, boolean>>({});

  const loadLesson = async () => {
    setLoading(true);
    setWords([]);
    setExercises([]);
    setExerciseAnswers({});
    setExerciseResults({});
    try {
      const content = await fetchAI(
        [{ role: "user", content: `Generate a Level ${level} ${lang} language lesson. Level ${level} difficulty (1=beginner, increases). Include 5 vocabulary words and 3 practice exercises.` }],
        "language_lesson"
      );
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setWords(parsed.words || []);
      setExercises(parsed.exercises || []);
    } catch (e: any) {
      toast.error("Failed to load lesson. Try again.");
    }
    setLoading(false);
  };

  const checkExercise = (idx: number, answer: string) => {
    const ex = exercises[idx];
    const correct = answer.toLowerCase().trim() === ex.answer.toLowerCase().trim();
    setExerciseResults((prev) => ({ ...prev, [idx]: correct }));
  };

  return (
    <PageShell title={`${lang} — Level ${level}`} subtitle="Vocabulary & Grammar" icon={<BookOpen className="w-7 h-7 text-foreground" />} gradientClass="from-blue-500 to-indigo-500">
      <div className="space-y-4">
        <div className="glass rounded-2xl p-4 flex items-center justify-between">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((l) => (
              <button key={l} onClick={() => setLevel(l)}
                className={`w-8 h-8 rounded-lg text-xs font-bold ${level === l ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"}`}>
                {l}
              </button>
            ))}
            <button onClick={() => setLevel((l) => l + 1)}
              className="w-8 h-8 rounded-lg text-xs font-bold glass text-muted-foreground">+</button>
          </div>
          <Button onClick={loadLesson} disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Load Lesson"}
          </Button>
        </div>

        {words.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-foreground font-bold text-sm">📖 Vocabulary</h3>
            {words.map((w, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-foreground font-bold">{w.word}</p>
                    <p className="text-primary text-xs font-semibold">{w.pronunciation}</p>
                  </div>
                  <span className="text-muted-foreground text-xs bg-muted/50 px-2 py-1 rounded">{w.meaning}</span>
                </div>
                <p className="text-muted-foreground text-xs mt-2 italic">"{w.sentence}"</p>
              </motion.div>
            ))}
          </div>
        )}

        {exercises.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-foreground font-bold text-sm">✏️ Practice</h3>
            {exercises.map((ex, i) => (
              <div key={i} className="glass rounded-2xl p-4 space-y-2">
                <p className="text-foreground text-sm font-semibold">{ex.question}</p>
                {ex.options ? (
                  <div className="grid grid-cols-2 gap-2">
                    {ex.options.map((opt, j) => (
                      <button key={j} onClick={() => { setExerciseAnswers((prev) => ({ ...prev, [i]: opt })); checkExercise(i, opt); }}
                        className={`text-xs py-2 px-3 rounded-lg font-semibold transition-all
                          ${exerciseAnswers[i] === opt ? (exerciseResults[i] ? "bg-green-500/30 text-green-300" : "bg-destructive/30 text-destructive") : "glass text-muted-foreground hover:text-foreground"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input value={exerciseAnswers[i] || ""} onChange={(e) => setExerciseAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
                      className="flex-1 bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm" placeholder="Type answer..." />
                    <Button size="sm" onClick={() => checkExercise(i, exerciseAnswers[i] || "")} className="bg-primary text-primary-foreground"><ArrowRight className="w-4 h-4" /></Button>
                  </div>
                )}
                {exerciseResults[i] !== undefined && (
                  <p className={`text-xs font-bold ${exerciseResults[i] ? "text-green-400" : "text-destructive"}`}>
                    {exerciseResults[i] ? "✅ Correct!" : `❌ Answer: ${ex.answer}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {words.length === 0 && !loading && (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-muted-foreground text-sm">Click "Load Lesson" to start learning!</p>
          </div>
        )}
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default LanguageLearn;
