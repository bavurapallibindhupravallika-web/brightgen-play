import { useState } from "react";
import { PenLine, Loader2, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import PageShell from "@/components/PageShell";
import DoubtButton from "@/components/DoubtButton";
import { fetchAI } from "@/lib/ai";
import { toast } from "sonner";

interface WrittenQ { question: string; answer: string; }

const LanguageWritten = () => {
  const [params] = useSearchParams();
  const lang = params.get("lang") || "English";
  const [questions, setQuestions] = useState<WrittenQ[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const startTest = async () => {
    setLoading(true);
    setSubmitted(false);
    setAnswers({});
    setResults({});
    try {
      const content = await fetchAI(
        [{ role: "user", content: `Generate 5 ${lang} language written test questions. Short answer format. Include vocabulary and grammar questions.` }],
        "written_test"
      );
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      setQuestions(JSON.parse(cleaned));
    } catch {
      toast.error("Failed to generate test. Try again.");
    }
    setLoading(false);
  };

  const submitTest = () => {
    const res: Record<number, boolean> = {};
    questions.forEach((q, i) => {
      res[i] = (answers[i] || "").toLowerCase().trim() === q.answer.toLowerCase().trim();
    });
    setResults(res);
    setSubmitted(true);
  };

  const score = Object.values(results).filter(Boolean).length;

  return (
    <PageShell title={`${lang} Written Test`} subtitle="Type answers, AI evaluates" icon={<PenLine className="w-7 h-7 text-foreground" />} gradientClass="from-pink-500 to-rose-500">
      <div className="space-y-4">
        {questions.length === 0 && !loading && (
          <div className="glass rounded-2xl p-8 text-center space-y-4">
            <p className="text-foreground font-bold">Written test for {lang}</p>
            <p className="text-muted-foreground text-sm">Type your answers, AI will evaluate</p>
            <Button onClick={startTest} className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
              <Play className="w-4 h-4 mr-2" /> Start Test
            </Button>
          </div>
        )}

        {loading && (
          <div className="glass rounded-2xl p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground text-sm mt-3">Generating test...</p>
          </div>
        )}

        {questions.length > 0 && !loading && (
          <>
            {questions.map((q, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-4 space-y-2">
                <p className="text-foreground text-sm font-semibold">Q{i + 1}. {q.question}</p>
                <input
                  value={answers[i] || ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
                  disabled={submitted}
                  className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
                  placeholder="Type your answer..."
                />
                {submitted && (
                  <p className={`text-xs font-bold ${results[i] ? "text-green-400" : "text-destructive"}`}>
                    {results[i] ? "✅ Correct!" : `❌ Correct answer: ${q.answer}`}
                  </p>
                )}
              </motion.div>
            ))}

            {!submitted ? (
              <Button onClick={submitTest} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-glow">
                <ArrowRight className="w-4 h-4 mr-2" /> Submit Test
              </Button>
            ) : (
              <div className="glass rounded-2xl p-6 text-center space-y-3">
                <p className="text-xl font-black text-foreground">Score: {score}/{questions.length}</p>
                <Button onClick={startTest} className="bg-primary hover:bg-primary/90 text-primary-foreground">New Test</Button>
              </div>
            )}
          </>
        )}
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default LanguageWritten;
