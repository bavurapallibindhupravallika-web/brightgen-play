import { useState } from "react";
import { Palette, Sparkles, Loader2, Brain, PenLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/PageShell";
import DoubtButton from "@/components/DoubtButton";
import { streamChat, fetchAI } from "@/lib/ai";
import { toast } from "sonner";

const storyTypes = ["Love", "Kids", "Friendship", "Motivational", "Fantasy", "Adventure", "Emotional", "Action"];

const Animated = () => {
  const [storyType, setStoryType] = useState("Kids");
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, any>>({});
  const [quizResults, setQuizResults] = useState<Record<number, boolean>>({});
  const [quizLoading, setQuizLoading] = useState(false);

  const generateScript = async () => {
    if (!topic.trim()) { toast.error("Enter a topic"); return; }
    setLoading(true);
    setScript("");
    let soFar = "";
    try {
      await streamChat({
        messages: [{ role: "user", content: `Create a ${storyType} animated story script about: ${topic}. Include character dialogues, meaning explanations, and educational content.` }],
        mode: "script",
        onDelta: (chunk) => { soFar += chunk; setScript(soFar); },
        onDone: () => setLoading(false),
      });
    } catch (e: any) {
      setLoading(false);
      toast.error(e.message || "Failed");
    }
  };

  const loadQuiz = async () => {
    setQuizLoading(true);
    setQuizAnswers({});
    setQuizResults({});
    try {
      const content = await fetchAI(
        [{ role: "user", content: `Generate 10 MCQ questions about: ${topic}` }],
        "quiz"
      );
      setQuizData(JSON.parse(content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
    } catch { toast.error("Failed"); }
    setQuizLoading(false);
  };

  return (
    <PageShell title="Animated Story" subtitle="Create engaging animated stories" icon={<Palette className="w-7 h-7 text-foreground" />} gradientClass="from-cyan-500 to-blue-500">
      <div className="space-y-4">
        <div className="glass rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Story Type</label>
            <div className="grid grid-cols-4 gap-2">
              {storyTypes.map((type) => (
                <button key={type} onClick={() => setStoryType(type)}
                  className={`text-xs font-semibold py-2 px-3 rounded-lg transition-all ${storyType === type ? "bg-primary text-primary-foreground neon-glow" : "glass text-muted-foreground hover:text-foreground"}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>
          <Input placeholder="Study Topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="bg-muted/50 border-border/50 h-12 text-foreground placeholder:text-muted-foreground" />
          <Button onClick={generateScript} disabled={loading} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-glow">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Generate Script
          </Button>
        </div>

        {script && (
          <div className="glass rounded-2xl p-6 max-h-[50vh] overflow-y-auto">
            <h3 className="text-foreground font-bold text-sm mb-3">🎬 Animated Script</h3>
            <div className="text-foreground text-sm whitespace-pre-wrap leading-relaxed">{script}</div>
          </div>
        )}

        {topic && script && (
          <Button onClick={loadQuiz} disabled={quizLoading} variant="outline" className="w-full h-10 text-xs border-border/50 text-muted-foreground hover:text-foreground">
            {quizLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Brain className="w-3 h-3 mr-1" />} Quiz Test
          </Button>
        )}

        {quizData.length > 0 && (
          <div className="space-y-3">
            {quizData.map((q: any, i: number) => (
              <div key={i} className="glass rounded-2xl p-4 space-y-2">
                <p className="text-foreground text-sm font-semibold">{q.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options?.map((opt: string, j: number) => (
                    <button key={j} onClick={() => { setQuizAnswers((p) => ({ ...p, [i]: j })); setQuizResults((p) => ({ ...p, [i]: j === q.correct })); }}
                      className={`text-xs py-2 px-3 rounded-lg font-semibold transition-all ${quizAnswers[i] === j ? (quizResults[i] ? "bg-green-500/30 text-green-300" : "bg-destructive/30 text-destructive") : "glass text-muted-foreground hover:text-foreground"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-foreground text-center font-bold">Score: {Object.values(quizResults).filter(Boolean).length}/{quizData.length}</p>
          </div>
        )}
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default Animated;
