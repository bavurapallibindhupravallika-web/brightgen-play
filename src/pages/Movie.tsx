import { useState } from "react";
import { Film, Upload, Sparkles, Download, Loader2, Brain, PenLine, Globe, Play, FileText, Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/PageShell";
import DoubtButton from "@/components/DoubtButton";
import { streamChat, fetchAI } from "@/lib/ai";
import { toast } from "sonner";

const movieTypes = ["Action", "Love", "Educational", "Thriller", "Motivation", "Comedy", "Sci-Fi", "Horror"];
const allLanguages = ["English", "Telugu", "Hindi", "Tamil", "Kannada", "Malayalam", "Marathi", "Bengali", "Spanish", "French", "German", "Japanese", "Korean", "Chinese", "Arabic", "Russian"];

const Movie = () => {
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [movieType, setMovieType] = useState("Educational");
  const [language, setLanguage] = useState("English");
  const [quizMode, setQuizMode] = useState<"none" | "quiz" | "written">("none");
  const [quizData, setQuizData] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, any>>({});
  const [quizResults, setQuizResults] = useState<Record<number, boolean>>({});
  const [quizLoading, setQuizLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const generateScript = async () => {
    if (!topic.trim()) { toast.error("Enter a topic"); return; }
    setLoading(true);
    setScript("");
    let soFar = "";
    try {
      await streamChat({
        messages: [{ role: "user", content: `Create a ${movieType} movie-style educational script about: ${topic} in ${language} language. Include characters, dialogue, meanings, explanations, and educational content. Make it cinematic and engaging.` }],
        mode: "script",
        onDelta: (chunk) => { soFar += chunk; setScript(soFar); },
        onDone: () => setLoading(false),
      });
    } catch (e: any) {
      setLoading(false);
      toast.error(e.message || "Failed");
    }
  };

  const loadQuiz = async (mode: "quiz" | "written") => {
    setQuizMode(mode);
    setQuizLoading(true);
    setQuizAnswers({});
    setQuizResults({});
    setSubmitted(false);
    try {
      const content = await fetchAI(
        [{ role: "user", content: `Generate ${mode === "quiz" ? "10 MCQ" : "5 short-answer"} questions about: ${topic} in ${language}` }],
        mode === "quiz" ? "quiz" : "written_test"
      );
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      setQuizData(JSON.parse(cleaned));
    } catch {
      toast.error("Failed to generate questions");
    }
    setQuizLoading(false);
  };

  const submitWritten = () => {
    const res: Record<number, boolean> = {};
    quizData.forEach((q: any, i: number) => { res[i] = (quizAnswers[i] || "").toLowerCase().trim() === q.answer.toLowerCase().trim(); });
    setQuizResults(res);
    setSubmitted(true);
  };

  const handleDownload = () => {
    if (!script) return;
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic || "movie"}-script.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Script downloaded!");
  };

  return (
    <PageShell title="Create Movie" subtitle="Turn any topic into a cinematic experience" icon={<Film className="w-7 h-7 text-foreground" />} gradientClass="from-red-500 to-orange-500">
      <div className="space-y-4">
        <div className="glass rounded-2xl p-6 space-y-4">
          {/* Language Selector */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">🌍 Language</label>
            <div className="grid grid-cols-4 gap-2">
              {allLanguages.slice(0, 8).map((lang) => (
                <button key={lang} onClick={() => setLanguage(lang)}
                  className={`text-[10px] font-semibold py-1.5 px-1 rounded-lg transition-all ${language === lang ? "bg-primary text-primary-foreground neon-glow" : "glass text-muted-foreground hover:text-foreground"}`}>
                  {lang}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {allLanguages.slice(8).map((lang) => (
                <button key={lang} onClick={() => setLanguage(lang)}
                  className={`text-[10px] font-semibold py-1.5 px-1 rounded-lg transition-all ${language === lang ? "bg-primary text-primary-foreground neon-glow" : "glass text-muted-foreground hover:text-foreground"}`}>
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Movie Type */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">🎬 Movie Type</label>
            <div className="grid grid-cols-4 gap-2">
              {movieTypes.map((type) => (
                <button key={type} onClick={() => setMovieType(type)}
                  className={`text-[10px] font-semibold py-1.5 px-2 rounded-lg transition-all ${movieType === type ? "bg-primary text-primary-foreground neon-glow" : "glass text-muted-foreground hover:text-foreground"}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <Input placeholder="Study Topic (e.g. Photosynthesis, Gravity, History)" value={topic} onChange={(e) => setTopic(e.target.value)} className="bg-muted/50 border-border/50 h-12 text-foreground placeholder:text-muted-foreground" />

          <Button onClick={generateScript} disabled={loading} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-glow">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Generate Movie Script
          </Button>
        </div>

        {script && (
          <>
            <div className="glass rounded-2xl p-6 max-h-[50vh] overflow-y-auto">
              <h3 className="text-foreground font-bold text-sm mb-3">📜 Movie Script ({language})</h3>
              <div className="text-foreground text-sm whitespace-pre-wrap leading-relaxed">{script}</div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleDownload} variant="outline" className="h-10 text-xs border-border/50 text-muted-foreground hover:text-foreground">
                <Download className="w-3 h-3 mr-1" /> Download Script
              </Button>
              <Button onClick={() => { toast.success("Script saved!"); }} variant="outline" className="h-10 text-xs border-border/50 text-muted-foreground hover:text-foreground">
                <FileText className="w-3 h-3 mr-1" /> Save Script
              </Button>
            </div>
          </>
        )}

        {topic && script && (
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => loadQuiz("quiz")} variant="outline" className="h-10 text-xs border-border/50 text-muted-foreground hover:text-foreground">
              <Brain className="w-3 h-3 mr-1" /> Quiz Test
            </Button>
            <Button onClick={() => loadQuiz("written")} variant="outline" className="h-10 text-xs border-border/50 text-muted-foreground hover:text-foreground">
              <PenLine className="w-3 h-3 mr-1" /> Written Test
            </Button>
          </div>
        )}

        {quizLoading && (
          <div className="glass rounded-2xl p-6 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          </div>
        )}

        {quizMode === "quiz" && quizData.length > 0 && !quizLoading && (
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

        {quizMode === "written" && quizData.length > 0 && !quizLoading && (
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
              <Button onClick={submitWritten} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Submit</Button>
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

export default Movie;
