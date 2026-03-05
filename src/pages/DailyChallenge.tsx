import { useState, useEffect } from "react";
import { Calendar, Trophy, Loader2, Star, Flame, Medal } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import DoubtButton from "@/components/DoubtButton";
import { Button } from "@/components/ui/button";
import { fetchAI } from "@/lib/ai";
import { useDailyLimit } from "@/hooks/useDailyLimit";
import { toast } from "sonner";

const badges = [
  { name: "Science Explorer", emoji: "🔬", requirement: "Complete 5 science challenges" },
  { name: "Math Master", emoji: "🧮", requirement: "Score 100% on a math challenge" },
  { name: "Coding Beginner", emoji: "💻", requirement: "Complete 3 coding challenges" },
  { name: "Language Hero", emoji: "🌍", requirement: "Complete 5 language challenges" },
  { name: "Streak Champion", emoji: "🔥", requirement: "7-day challenge streak" },
  { name: "Quiz King", emoji: "👑", requirement: "Score 100% 3 times in a row" },
];

const categories = ["Science", "Math", "History", "Programming", "Language", "General Knowledge"];

const DailyChallenge = () => {
  const [category, setCategory] = useState("General Knowledge");
  const [quizData, setQuizData] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResults, setQuizResults] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const { checkAndUse, remaining, isVip } = useDailyLimit();

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const startChallenge = async () => {
    const allowed = await checkAndUse();
    if (!allowed) return;
    setLoading(true);
    setQuizAnswers({});
    setQuizResults({});
    setScore(null);
    try {
      const content = await fetchAI(
        [{ role: "user", content: `Generate 5 MCQ quiz questions for a daily challenge in the category: ${category}. Mix easy and medium difficulty.` }],
        "quiz"
      );
      setQuizData(JSON.parse(content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
    } catch { toast.error("Failed to load challenge"); }
    setLoading(false);
  };

  const handleAnswer = (qi: number, oi: number, correct: number) => {
    if (quizAnswers[qi] !== undefined) return;
    setQuizAnswers(p => ({ ...p, [qi]: oi }));
    setQuizResults(p => ({ ...p, [qi]: oi === correct }));
  };

  useEffect(() => {
    if (quizData.length > 0 && Object.keys(quizAnswers).length === quizData.length && score === null) {
      const s = Object.values(quizResults).filter(Boolean).length;
      setScore(s);
    }
  }, [quizAnswers, quizResults, quizData, score]);

  return (
    <PageShell title="Daily Challenge" subtitle={today} icon={<Calendar className="w-7 h-7 text-foreground" />} gradientClass="from-amber-500 to-orange-500" theme="fire">
      <div className="space-y-4">
        <div className="glass rounded-2xl p-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {isVip ? "💎 VIP – Unlimited" : `⚡ ${remaining()} left today`}
          </p>
          <button onClick={() => setShowBadges(!showBadges)} className="text-xs font-bold text-primary">
            {showBadges ? "Hide Badges" : "🏅 View Badges"}
          </button>
        </div>

        {showBadges && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass rounded-2xl p-4 space-y-2">
            <h3 className="text-foreground font-bold text-sm mb-2">🏆 Available Badges</h3>
            <div className="grid grid-cols-2 gap-2">
              {badges.map(b => (
                <div key={b.name} className="glass rounded-xl p-3 text-center">
                  <span className="text-2xl">{b.emoji}</span>
                  <p className="text-foreground text-xs font-bold mt-1">{b.name}</p>
                  <p className="text-muted-foreground text-[10px]">{b.requirement}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {quizData.length === 0 && !loading && (
          <div className="glass rounded-2xl p-6 space-y-4">
            <div className="text-center">
              <span className="text-5xl">🎯</span>
              <h3 className="text-foreground font-bold mt-3">Today's Challenge</h3>
              <p className="text-muted-foreground text-xs mt-1">Test your knowledge and earn badges!</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`text-[10px] font-semibold py-2 px-2 rounded-lg transition-all ${category === cat ? "bg-primary text-primary-foreground neon-glow" : "glass text-muted-foreground hover:text-foreground"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={startChallenge} className="w-full h-12 font-bold">
              <Flame className="w-4 h-4 mr-2" /> Start Challenge
            </Button>
          </div>
        )}

        {loading && (
          <div className="glass rounded-2xl p-10 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground text-sm mt-3">Generating your challenge...</p>
          </div>
        )}

        {quizData.length > 0 && !loading && (
          <div className="space-y-3">
            {quizData.map((q: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-4 space-y-2">
                <p className="text-foreground text-sm font-semibold">Q{i + 1}. {q.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options?.map((opt: string, j: number) => (
                    <button key={j} onClick={() => handleAnswer(i, j, q.correct)}
                      className={`text-xs py-2 px-3 rounded-lg font-semibold transition-all ${quizAnswers[i] === j ? (quizResults[i] ? "bg-green-500/30 text-green-300 border border-green-500/50" : "bg-destructive/30 text-destructive border border-destructive/50") : quizAnswers[i] !== undefined && j === q.correct ? "bg-green-500/20 text-green-300" : "glass text-muted-foreground hover:text-foreground"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}

            {score !== null && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-6 text-center space-y-3">
                <span className="text-5xl">{score === quizData.length ? "🎉" : score >= 3 ? "👏" : "💪"}</span>
                <h3 className="text-foreground font-black text-xl">{score}/{quizData.length}</h3>
                <p className="text-muted-foreground text-sm">
                  {score === quizData.length ? "Perfect! You're amazing!" : score >= 3 ? "Great job! Keep learning!" : "Good try! Practice more!"}
                </p>
                <Button onClick={() => { setQuizData([]); setScore(null); }} variant="outline" className="text-xs">
                  Try Another Challenge
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default DailyChallenge;
