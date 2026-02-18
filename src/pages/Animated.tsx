import { useState } from "react";
import { Palette, Sparkles, Loader2, Brain, PenLine, Download, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/PageShell";
import DoubtButton from "@/components/DoubtButton";
import InstructionsBlock from "@/components/InstructionsBlock";
import { streamChat, fetchAI } from "@/lib/ai";
import { useSaveContent } from "@/hooks/useSaveContent";
import { useDailyLimit } from "@/hooks/useDailyLimit";
import { toast } from "sonner";

const storyTypes = ["Adventure", "Love", "Action", "Thriller", "Horror", "Educational", "Sci-Fi", "Motivation", "Comedy", "Fantasy"];
const allLanguages = [
  { label: "English", flag: "🇺🇸" },
  { label: "Telugu", flag: "🇮🇳" },
  { label: "Hindi", flag: "🇮🇳" },
  { label: "Tamil", flag: "🇮🇳" },
  { label: "Kannada", flag: "🇮🇳" },
  { label: "Bengali", flag: "🇮🇳" },
];

const Animated = () => {
  const [storyType, setStoryType] = useState("Educational");
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, any>>({});
  const [quizResults, setQuizResults] = useState<Record<number, boolean>>({});
  const [quizLoading, setQuizLoading] = useState(false);
  const [writtenData, setWrittenData] = useState<any[]>([]);
  const [writtenAnswers, setWrittenAnswers] = useState<Record<number, string>>({});
  const [writtenResults, setWrittenResults] = useState<Record<number, boolean>>({});
  const [writtenLoading, setWrittenLoading] = useState(false);
  const [writtenSubmitted, setWrittenSubmitted] = useState(false);

  const { saveContent } = useSaveContent();
  const { checkAndUse, remaining, isVip } = useDailyLimit();

  const generateScript = async () => {
    if (!topic.trim()) { toast.error("Enter a topic"); return; }
    const allowed = await checkAndUse();
    if (!allowed) return;
    setLoading(true); setScript(""); let soFar = "";
    try {
      await streamChat({
        messages: [{ role: "user", content: `Create a ${storyType} animated story script about: ${topic} in ${language} language. Include character dialogues, meaning explanations, educational content, and visual scene descriptions.` }],
        mode: "script",
        onDelta: (chunk) => { soFar += chunk; setScript(soFar); },
        onDone: () => setLoading(false),
      });
    } catch (e: any) { setLoading(false); toast.error(e.message || "Failed"); }
  };

  const loadQuiz = async () => {
    setQuizLoading(true); setQuizAnswers({}); setQuizResults({});
    try {
      const content = await fetchAI([{ role: "user", content: `Generate 10 MCQ questions about: ${topic} in ${language}` }], "quiz");
      setQuizData(JSON.parse(content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
    } catch { toast.error("Failed"); }
    setQuizLoading(false);
  };

  const loadWritten = async () => {
    setWrittenLoading(true); setWrittenAnswers({}); setWrittenResults({}); setWrittenSubmitted(false);
    try {
      const content = await fetchAI([{ role: "user", content: `Generate 5 short-answer questions about: ${topic} in ${language}` }], "written_test");
      setWrittenData(JSON.parse(content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
    } catch { toast.error("Failed"); }
    setWrittenLoading(false);
  };

  const submitWritten = () => {
    const res: Record<number, boolean> = {};
    writtenData.forEach((q: any, i: number) => { res[i] = (writtenAnswers[i] || "").toLowerCase().trim() === q.answer.toLowerCase().trim(); });
    setWrittenResults(res); setWrittenSubmitted(true);
  };

  const handleDownload = () => {
    if (!script) return;
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${topic || "animated"}-script.txt`; a.click();
    URL.revokeObjectURL(url); toast.success("Script downloaded!");
  };

  const handleSave = () => {
    saveContent({ content_type: "animated", title: `${storyType} - ${topic}`, topic, language, content_text: script });
  };

  return (
    <PageShell title="Animated Story" subtitle="Create engaging animated stories" icon={<Palette className="w-7 h-7 text-foreground" />} gradientClass="from-cyan-500 to-blue-500">
      <div className="space-y-4">
        <div className="glass rounded-2xl p-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{isVip ? "💎 VIP – Unlimited" : `⚡ Free – ${remaining()} left today`}</p>
          {!isVip && <a href="/vip" className="text-xs font-bold text-primary hover:underline">Upgrade VIP</a>}
        </div>

        <InstructionsBlock type="animated" />

        <div className="glass rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">🌍 Language</label>
            <div className="grid grid-cols-3 gap-2">
              {allLanguages.map((lang) => (
                <button key={lang.label} onClick={() => setLanguage(lang.label)}
                  className={`text-[11px] font-semibold py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${language === lang.label ? "bg-primary text-primary-foreground neon-glow" : "glass text-muted-foreground hover:text-foreground"}`}>
                  <span>{lang.flag}</span> {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">🎨 Story Type</label>
            <div className="grid grid-cols-5 gap-2">
              {storyTypes.map((type) => (
                <button key={type} onClick={() => setStoryType(type)} className={`text-[10px] font-semibold py-1.5 px-1 rounded-lg transition-all ${storyType === type ? "bg-primary text-primary-foreground neon-glow" : "glass text-muted-foreground hover:text-foreground"}`}>{type}</button>
              ))}
            </div>
          </div>

          <Input placeholder="Study Topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="bg-muted/50 border-border/50 h-12 text-foreground placeholder:text-muted-foreground" />
          <Button onClick={generateScript} disabled={loading} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-glow">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Generate Animated Script
          </Button>
        </div>

        {script && (
          <>
            <div className="glass rounded-2xl p-6 max-h-[50vh] overflow-y-auto">
              <h3 className="text-foreground font-bold text-sm mb-3">🎬 Animated Script ({language})</h3>
              <div className="text-foreground text-sm whitespace-pre-wrap leading-relaxed">{script}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleDownload} variant="outline" className="h-10 text-xs border-border/50 text-muted-foreground hover:text-foreground"><Download className="w-3 h-3 mr-1" /> Download</Button>
              <Button onClick={handleSave} variant="outline" className="h-10 text-xs border-border/50 text-muted-foreground hover:text-foreground"><Save className="w-3 h-3 mr-1" /> Save</Button>
            </div>
          </>
        )}

        {topic && script && (
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={loadQuiz} disabled={quizLoading} variant="outline" className="h-10 text-xs border-border/50 text-muted-foreground hover:text-foreground">
              {quizLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Brain className="w-3 h-3 mr-1" />} Quiz Test
            </Button>
            <Button onClick={loadWritten} disabled={writtenLoading} variant="outline" className="h-10 text-xs border-border/50 text-muted-foreground hover:text-foreground">
              {writtenLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <PenLine className="w-3 h-3 mr-1" />} Written Test
            </Button>
          </div>
        )}

        {quizData.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-foreground font-bold text-sm">📝 Quiz Test</h3>
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

        {writtenData.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-foreground font-bold text-sm">✏️ Written Test</h3>
            {writtenData.map((q: any, i: number) => (
              <div key={i} className="glass rounded-2xl p-4 space-y-2">
                <p className="text-foreground text-sm font-semibold">Q{i + 1}. {q.question}</p>
                <input value={writtenAnswers[i] || ""} onChange={(e) => setWrittenAnswers((p) => ({ ...p, [i]: e.target.value }))} disabled={writtenSubmitted}
                  className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm" placeholder="Type answer..." />
                {writtenSubmitted && <p className={`text-xs font-bold ${writtenResults[i] ? "text-green-400" : "text-destructive"}`}>{writtenResults[i] ? "✅ Correct!" : `❌ Answer: ${q.answer}`}</p>}
              </div>
            ))}
            {!writtenSubmitted ? (
              <Button onClick={submitWritten} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Submit</Button>
            ) : (
              <p className="text-foreground text-center font-bold">Score: {Object.values(writtenResults).filter(Boolean).length}/{writtenData.length}</p>
            )}
          </div>
        )}
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default Animated;
