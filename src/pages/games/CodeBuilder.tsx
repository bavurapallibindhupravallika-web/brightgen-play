import { useState } from "react";
import { Code, Loader2, Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import DoubtButton from "@/components/DoubtButton";
import PageShell from "@/components/PageShell";
import { fetchAI } from "@/lib/ai";
import { toast } from "sonner";

interface CodeChallenge { title: string; description: string; starter_code: string; solution: string; hint: string; }

const CodeBuilder = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [challenge, setChallenge] = useState<CodeChallenge | null>(null);
  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const loadChallenge = async () => {
    setLoading(true);
    setFeedback(null);
    setShowHint(false);
    try {
      const content = await fetchAI(
        [{ role: "user", content: `Generate 1 coding challenge for level ${level} (1=beginner Python/JS, higher=harder). Return JSON: {title, description, starter_code, solution, hint}. Keep code simple and educational.` }],
        "quiz"
      );
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      const ch = Array.isArray(parsed) ? parsed[0] : parsed;
      setChallenge(ch);
      setUserCode(ch.starter_code || "");
    } catch {
      toast.error("Failed to load challenge");
    }
    setLoading(false);
  };

  const checkCode = () => {
    if (!challenge) return;
    const normalized = userCode.replace(/\s+/g, " ").trim().toLowerCase();
    const solution = challenge.solution.replace(/\s+/g, " ").trim().toLowerCase();
    if (normalized.includes(solution) || solution.includes(normalized)) {
      setFeedback("correct");
      setScore((s) => s + level * 25);
    } else {
      setFeedback("wrong");
    }
  };

  return (
    <PageShell title="Code Builder" subtitle={`Level ${level} • Score: ${score}`} icon={<Code className="w-7 h-7 text-foreground" />} gradientClass="from-blue-500 to-indigo-600">
      <div className="space-y-4">
        {!challenge && !loading && (
          <div className="glass rounded-2xl p-8 text-center space-y-4">
            <p className="text-foreground font-bold text-lg">Level {level} – Code Challenge</p>
            <p className="text-muted-foreground text-sm">Write code to solve AI-generated challenges</p>
            <Button onClick={loadChallenge} className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
              <Play className="w-4 h-4 mr-2" /> Start Challenge
            </Button>
          </div>
        )}

        {loading && (
          <div className="glass rounded-2xl p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground text-sm mt-3">Generating challenge...</p>
          </div>
        )}

        {challenge && !loading && (
          <>
            <div className="glass rounded-2xl p-5 space-y-2">
              <h3 className="text-foreground font-bold">{challenge.title}</h3>
              <p className="text-muted-foreground text-sm">{challenge.description}</p>
            </div>

            <div className="glass rounded-2xl p-4">
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">Your Code:</label>
              <textarea
                value={userCode}
                onChange={(e) => { setUserCode(e.target.value); setFeedback(null); }}
                rows={8}
                className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm font-mono"
                placeholder="Write your code here..."
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={checkCode} className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-glow">
                <ArrowRight className="w-4 h-4 mr-2" /> Submit Code
              </Button>
              <Button variant="outline" onClick={() => setShowHint(true)} className="h-12 border-border/50 text-muted-foreground">
                Hint
              </Button>
            </div>

            {showHint && (
              <div className="glass rounded-2xl p-4">
                <p className="text-xs text-muted-foreground">💡 {challenge.hint}</p>
              </div>
            )}

            {feedback && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`glass rounded-2xl p-4 text-center font-bold ${feedback === "correct" ? "text-green-400" : "text-destructive"}`}>
                {feedback === "correct" ? `✅ Great code! +${level * 25} points` : `❌ Not quite. Check the solution: ${challenge.solution}`}
              </motion.div>
            )}

            {feedback === "correct" && (
              <Button onClick={() => { setLevel((l) => l + 1); setChallenge(null); }} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Next Level →
              </Button>
            )}
          </>
        )}
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default CodeBuilder;
