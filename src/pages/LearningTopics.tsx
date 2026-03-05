import { useState } from "react";
import { BookOpen, Sparkles, Loader2, Brain, PenLine, BookOpenCheck, Lightbulb, Save, Download } from "lucide-react";
import PageShell from "@/components/PageShell";
import DoubtButton from "@/components/DoubtButton";
import AIVoiceButton from "@/components/AIVoiceButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { streamChat, fetchAI } from "@/lib/ai";
import { useSaveContent } from "@/hooks/useSaveContent";
import { useDailyLimit } from "@/hooks/useDailyLimit";
import { toast } from "sonner";

const subjects = ["Science", "Mathematics", "History", "Geography", "Physics", "Chemistry", "Biology", "Economics", "Psychology", "Philosophy"];
const allLanguages = [
  { label: "English", flag: "🇺🇸" },
  { label: "Telugu", flag: "🇮🇳" },
  { label: "Hindi", flag: "🇮🇳" },
  { label: "Tamil", flag: "🇮🇳" },
  { label: "Kannada", flag: "🇮🇳" },
  { label: "Bengali", flag: "🇮🇳" },
];

const LearningTopics = () => {
  const [subject, setSubject] = useState("Science");
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<string>("");
  const [quizData, setQuizData] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, any>>({});
  const [quizResults, setQuizResults] = useState<Record<number, boolean>>({});
  const [quizLoading, setQuizLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { saveContent } = useSaveContent();
  const { checkAndUse, remaining, isVip } = useDailyLimit();

  const generate = async (genMode: string) => {
    if (!topic.trim()) { toast.error("Enter a topic"); return; }
    const allowed = await checkAndUse();
    if (!allowed) return;
    setMode(genMode);
    setLoading(true);
    setContent("");
    let soFar = "";
    const prompts: Record<string, string> = {
      explain: `Explain the topic "${topic}" in ${subject} in ${language}. Provide detailed explanations, examples, and key points.`,
      story: `Tell the concept of "${topic}" in ${subject} as an engaging story in ${language}. Make it educational and memorable with characters and plot.`,
      script: `Create an educational script about "${topic}" in ${subject} in ${language}. Include narration, key facts, and teaching points.`,
    };
    try {
      await streamChat({
        messages: [{ role: "user", content: prompts[genMode] }],
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
        [{ role: "user", content: `Generate ${qMode === "quiz" ? "10 MCQ" : "5 short-answer"} questions about ${topic} in ${subject} in ${language}` }],
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

  return (
    <PageShell title="Learning Topics" subtitle="AI-powered education" icon={<BookOpen className="w-7 h-7 text-foreground" />} gradientClass="from-violet-500 to-purple-500" theme="library">
      <div className="space-y-4">
        <div className="glass rounded-2xl p-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {isVip ? "💎 VIP – Unlimited" : `⚡ ${remaining()} left today`}
          </p>
        </div>

        <div className="glass rounded-2xl p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">📚 Subject</label>
            <div className="grid grid-cols-5 gap-1.5">
              {subjects.map(s => (
                <button key={s} onClick={() => setSubject(s)}
                  className={`text-[9px] font-semibold py-1.5 px-1 rounded-lg transition-all ${subject === s ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"}`}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">🌍 Language</label>
            <div className="grid grid-cols-3 gap-2">
              {allLanguages.map(lang => (
                <button key={lang.label} onClick={() => setLanguage(lang.label)}
                  className={`text-[11px] font-semibold py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${language === lang.label ? "bg-primary text-primary-foreground neon-glow" : "glass text-muted-foreground hover:text-foreground"}`}>
                  <span>{lang.flag}</span> {lang.label}
                </button>
              ))}
            </div>
          </div>

          <Input placeholder="Enter topic (e.g. Photosynthesis, Gravity)" value={topic} onChange={(e) => setTopic(e.target.value)} className="bg-muted/50 border-border/50 h-12 text-foreground placeholder:text-muted-foreground" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button onClick={() => generate("explain")} disabled={loading} className="h-11 text-[10px] font-bold">
            <Lightbulb className="w-3 h-3 mr-1" /> Explain
          </Button>
          <Button onClick={() => generate("story")} disabled={loading} variant="secondary" className="h-11 text-[10px] font-bold">
            <BookOpenCheck className="w-3 h-3 mr-1" /> Story
          </Button>
          <Button onClick={() => generate("script")} disabled={loading} variant="outline" className="h-11 text-[10px] font-bold border-border/50">
            <Sparkles className="w-3 h-3 mr-1" /> Script
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => loadQuiz("quiz")} variant="outline" className="h-10 text-xs border-border/50">
            <Brain className="w-3 h-3 mr-1" /> Quiz
          </Button>
          <Button onClick={() => loadQuiz("written")} variant="outline" className="h-10 text-xs border-border/50">
            <PenLine className="w-3 h-3 mr-1" /> Written Test
          </Button>
        </div>

        {loading && (
          <div className="glass rounded-2xl p-6 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
        )}

        {content && !loading && (
          <>
            <div className="glass rounded-2xl p-6 max-h-[50vh] overflow-y-auto">
              <div className="text-foreground text-sm whitespace-pre-wrap leading-relaxed">{content}</div>
            </div>
            <AIVoiceButton text={content} language={language} />
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => saveContent({ content_type: "learning", title: `${subject} - ${topic}`, topic, language, content_text: content })} variant="outline" className="h-10 text-xs border-border/50">
                <Save className="w-3 h-3 mr-1" /> Save
              </Button>
              <Button onClick={() => { const b = new Blob([content], { type: "text/plain" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = `${topic}.txt`; a.click(); }} variant="outline" className="h-10 text-xs border-border/50">
                <Download className="w-3 h-3 mr-1" /> Download
              </Button>
            </div>
          </>
        )}

        {quizLoading && <div className="glass rounded-2xl p-6 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>}

        {mode === "quiz" && quizData.length > 0 && !quizLoading && (
          <div className="space-y-3">
            {quizData.map((q: any, i: number) => (
              <div key={i} className="glass rounded-2xl p-4 space-y-2">
                <p className="text-foreground text-sm font-semibold">{q.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options?.map((opt: string, j: number) => (
                    <button key={j} onClick={() => { setQuizAnswers(p => ({ ...p, [i]: j })); setQuizResults(p => ({ ...p, [i]: j === q.correct })); }}
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
                <input value={quizAnswers[i] || ""} onChange={(e) => setQuizAnswers(p => ({ ...p, [i]: e.target.value }))} disabled={submitted}
                  className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm" placeholder="Type answer..." />
                {submitted && <p className={`text-xs font-bold ${quizResults[i] ? "text-green-400" : "text-destructive"}`}>{quizResults[i] ? "✅ Correct!" : `❌ Answer: ${q.answer}`}</p>}
              </div>
            ))}
            {!submitted ? <Button onClick={submitWritten} className="w-full font-bold">Submit</Button> : <p className="text-foreground text-center font-bold">Score: {Object.values(quizResults).filter(Boolean).length}/{quizData.length}</p>}
          </div>
        )}
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default LearningTopics;
