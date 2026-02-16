import { useState } from "react";
import { Bug, Loader2, Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import DoubtButton from "@/components/DoubtButton";
import PageShell from "@/components/PageShell";
import { fetchAI } from "@/lib/ai";
import { toast } from "sonner";

interface BugChallenge { buggy_code: string; fixed_code: string; explanation: string; language: string; }

const BugFix = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [challenge, setChallenge] = useState<BugChallenge | null>(null);
  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const loadChallenge = async () => {
    setLoading(true);
    setFeedback(null);
    setShowAnswer(false);
    try {
      const content = await fetchAI(
        [{ role: "user", content: `Generate 1 "fix the bug" coding challenge for level ${level} (1=easy typos, higher=logic bugs). Return JSON: {buggy_code, fixed_code, explanation, language}. Use Python or JavaScript. Keep it educational.` }],
        "quiz"
      );
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      const ch = Array.isArray(parsed) ? parsed[0] : parsed;
      setChallenge(ch);
      setUserCode(ch.buggy_code || "");
    } catch {
      toast.error("Failed to load challenge");
    }
    setLoading(false);
  };

  const checkFix = () => {
    if (!challenge) return;
    const normalized = userCode.replace(/\s+/g, "").trim().toLowerCase();
    const solution = challenge.fixed_code.replace(/\s+/g, "").trim().toLowerCase();
    if (normalized === solution) {
      setFeedback("correct");
      setScore((s) => s + level * 20);
    } else {
      setFeedback("wrong");
    }
  };

  return (
    <PageShell title="Bug Fix" subtitle={`Level ${level} • Score: ${score}`} icon={<Bug className="w-7 h-7 text-foreground" />} gradientClass="from-red-500 to-pink-500">
      <div className="space-y-4">
        {!challenge && !loading && (
          <div className="glass rounded-2xl p-8 text-center space-y-4">
            <p className="text-foreground font-bold text-lg">Level {level} – Find & Fix the Bug 🐛</p>
            <p className="text-muted-foreground text-sm">Fix the buggy code to make it work correctly</p>
            <Button onClick={loadChallenge} className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
              <Play className="w-4 h-4 mr-2" /> Start
            </Button>
          </div>
        )}

        {loading && (
          <div className="glass rounded-2xl p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground text-sm mt-3">Generating buggy code...</p>
          </div>
        )}

        {challenge && !loading && (
          <>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Language: {challenge.language}</p>
              <p className="text-foreground font-bold text-sm">Fix the bug in this code:</p>
            </div>

            <div className="glass rounded-2xl p-4">
              <textarea
                value={userCode}
                onChange={(e) => { setUserCode(e.target.value); setFeedback(null); }}
                rows={8}
                className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm font-mono"
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={checkFix} className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-glow">
                <ArrowRight className="w-4 h-4 mr-2" /> Check Fix
              </Button>
              <Button variant="outline" onClick={() => setShowAnswer(true)} className="h-12 border-border/50 text-muted-foreground">
                Answer
              </Button>
            </div>

            {showAnswer && (
              <div className="glass rounded-2xl p-4 space-y-2">
                <p className="text-xs font-bold text-foreground">Correct code:</p>
                <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap">{challenge.fixed_code}</pre>
                <p className="text-xs text-muted-foreground mt-2">💡 {challenge.explanation}</p>
              </div>
            )}

            {feedback && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`glass rounded-2xl p-4 text-center font-bold ${feedback === "correct" ? "text-green-400" : "text-destructive"}`}>
                {feedback === "correct" ? `✅ Bug fixed! +${level * 20} points` : "❌ Still buggy. Try again or check the answer."}
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

export default BugFix;
