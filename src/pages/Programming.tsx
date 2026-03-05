import { useState } from "react";
import { Code, Terminal, FileCode, Braces, Globe, BookOpen, Play, Brain, PenLine, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageShell from "@/components/PageShell";
import DoubtButton from "@/components/DoubtButton";
import AIVoiceButton from "@/components/AIVoiceButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { streamChat, fetchAI } from "@/lib/ai";
import { useDailyLimit } from "@/hooks/useDailyLimit";
import { toast } from "sonner";

const courses = [
  { name: "Python", icon: "🐍", color: "from-yellow-500 to-green-500", slug: "python" },
  { name: "Java", icon: "☕", color: "from-orange-500 to-red-500", slug: "java" },
  { name: "HTML", icon: "🌐", color: "from-orange-400 to-red-400", slug: "html" },
  { name: "CSS", icon: "🎨", color: "from-blue-400 to-purple-400", slug: "css" },
  { name: "JavaScript", icon: "⚡", color: "from-yellow-400 to-amber-500", slug: "javascript" },
];

const Programming = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseSlug = searchParams.get("course");
  const selectedCourse = courses.find(c => c.slug === courseSlug);

  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"explain" | "code" | "quiz" | "written" | null>(null);
  const [quizData, setQuizData] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, any>>({});
  const [quizResults, setQuizResults] = useState<Record<number, boolean>>({});
  const [quizLoading, setQuizLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { checkAndUse, remaining, isVip } = useDailyLimit();

  const generate = async (genMode: "explain" | "code") => {
    if (!topic.trim()) { toast.error("Enter a topic"); return; }
    const allowed = await checkAndUse();
    if (!allowed) return;
    setMode(genMode);
    setLoading(true);
    setContent("");
    let soFar = "";
    const prompt = genMode === "explain"
      ? `Explain this ${selectedCourse?.name} programming concept in detail with examples: ${topic}. Include code snippets, explanations, and best practices.`
      : `Show practical ${selectedCourse?.name} code examples for: ${topic}. Include multiple examples from basic to advanced, with comments explaining each line.`;
    try {
      await streamChat({
        messages: [{ role: "user", content: prompt }],
        mode: "script",
        onDelta: (chunk) => { soFar += chunk; setContent(soFar); },
        onDone: () => setLoading(false),
      });
    } catch (e: any) {
      setLoading(false);
      toast.error(e.message || "Failed");
    }
  };

  const loadQuiz = async (qMode: "quiz" | "written") => {
    if (!topic.trim()) { toast.error("Enter a topic first"); return; }
    const allowed = await checkAndUse();
    if (!allowed) return;
    setMode(qMode);
    setQuizLoading(true);
    setQuizAnswers({});
    setQuizResults({});
    setSubmitted(false);
    try {
      const result = await fetchAI(
        [{ role: "user", content: `Generate ${qMode === "quiz" ? "10 MCQ" : "5 short-answer"} questions about ${selectedCourse?.name} programming topic: ${topic}` }],
        qMode === "quiz" ? "quiz" : "written_test"
      );
      setQuizData(JSON.parse(result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
    } catch { toast.error("Failed to generate questions"); }
    setQuizLoading(false);
  };

  const submitWritten = () => {
    const res: Record<number, boolean> = {};
    quizData.forEach((q: any, i: number) => { res[i] = (quizAnswers[i] || "").toLowerCase().trim() === q.answer.toLowerCase().trim(); });
    setQuizResults(res);
    setSubmitted(true);
  };

  // Course selection view
  if (!selectedCourse) {
    return (
      <PageShell title="Programming" subtitle="Learn to code with AI" icon={<Code className="w-7 h-7 text-foreground" />} gradientClass="from-emerald-500 to-cyan-500" theme="tech">
        <div className="space-y-4">
          <div className="glass rounded-2xl p-4">
            <h3 className="text-foreground font-bold text-sm mb-3">Select a Course</h3>
          </div>
          {courses.map((course, i) => (
            <motion.button
              key={course.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/programming?course=${course.slug}`)}
              className="w-full glass rounded-2xl p-5 flex items-center gap-4 text-left"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center shadow-lg text-2xl`}>
                {course.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-foreground font-bold">{course.name}</h3>
                <p className="text-muted-foreground text-xs">Learn {course.name} with AI</p>
              </div>
            </motion.button>
          ))}
        </div>
        <DoubtButton />
      </PageShell>
    );
  }

  // Course detail view
  return (
    <PageShell title={selectedCourse.name} subtitle={`Learn ${selectedCourse.name} programming`} icon={<Code className="w-7 h-7 text-foreground" />} gradientClass={selectedCourse.color} theme="tech" backPath="/programming">
      <div className="space-y-4">
        <div className="glass rounded-2xl p-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {isVip ? "💎 VIP – Unlimited access" : `⚡ Free Plan – ${remaining()} generations left today`}
          </p>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <Input
            placeholder={`Topic (e.g. loops, functions, classes)`}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="bg-muted/50 border-border/50 h-12 text-foreground placeholder:text-muted-foreground"
          />

          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => generate("explain")} disabled={loading} className="h-12 text-xs font-bold">
              {loading && mode === "explain" ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <BookOpen className="w-4 h-4 mr-1" />}
              Explain Topic
            </Button>
            <Button onClick={() => generate("code")} disabled={loading} variant="secondary" className="h-12 text-xs font-bold">
              {loading && mode === "code" ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <FileCode className="w-4 h-4 mr-1" />}
              Code Examples
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => loadQuiz("quiz")} variant="outline" className="h-10 text-xs border-border/50">
              <Brain className="w-3 h-3 mr-1" /> Quiz Test
            </Button>
            <Button onClick={() => loadQuiz("written")} variant="outline" className="h-10 text-xs border-border/50">
              <PenLine className="w-3 h-3 mr-1" /> Written Test
            </Button>
          </div>
        </div>

        {content && (
          <>
            <div className="glass rounded-2xl p-6 max-h-[50vh] overflow-y-auto">
              <h3 className="text-foreground font-bold text-sm mb-3">
                {mode === "explain" ? "📖 Explanation" : "💻 Code Examples"}
              </h3>
              <div className="text-foreground text-sm whitespace-pre-wrap leading-relaxed font-mono">{content}</div>
            </div>
            <AIVoiceButton text={content} language="English" />
          </>
        )}

        {quizLoading && (
          <div className="glass rounded-2xl p-6 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
        )}

        {mode === "quiz" && quizData.length > 0 && !quizLoading && (
          <div className="space-y-3">
            {quizData.map((q: any, i: number) => (
              <div key={i} className="glass rounded-2xl p-4 space-y-2">
                <p className="text-foreground text-sm font-semibold">{q.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options?.map((opt: string, j: number) => (
                    <button key={j} onClick={() => { setQuizAnswers((p) => ({ ...p, [i]: j })); setQuizResults((p) => ({ ...p, [i]: j === q.correct })); }}
                      className={`text-xs py-2 px-3 rounded-lg font-semibold transition-all ${quizAnswers[i] === j ? (quizResults[i] ? "bg-green-500/30 text-green-300" : "bg-destructive/30 text-destructive") : "glass text-muted-foreground hover:text-foreground"}`}>{opt}</button>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-foreground text-center font-bold">Score: {Object.values(quizResults).filter(Boolean).length}/{quizData.length}</p>
          </div>
        )}

        {mode === "written" && quizData.length > 0 && !quizLoading && (
          <div className="space-y-3">
            {quizData.map((q: any, i: number) => (
              <div key={i} className="glass rounded-2xl p-4 space-y-2">
                <p className="text-foreground text-sm font-semibold">Q{i + 1}. {q.question}</p>
                <input value={quizAnswers[i] || ""} onChange={(e) => setQuizAnswers((p) => ({ ...p, [i]: e.target.value }))} disabled={submitted}
                  className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm" placeholder="Type answer..." />
                {submitted && <p className={`text-xs font-bold ${quizResults[i] ? "text-green-400" : "text-destructive"}`}>{quizResults[i] ? "✅ Correct!" : `❌ Answer: ${q.answer}`}</p>}
              </div>
            ))}
            {!submitted ? (
              <Button onClick={submitWritten} className="w-full font-bold">Submit</Button>
            ) : (
              <p className="text-foreground text-center font-bold">Score: {Object.values(quizResults).filter(Boolean).length}/{quizData.length}</p>
            )}
          </div>
        )}
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default Programming;
