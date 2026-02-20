// Gameplay pages for all 8 games - each wraps existing game logic inside GamePlayShell
import { useParams } from "react-router-dom";
import GamePlayShell from "@/components/GamePlayShell";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import { fetchAI } from "@/lib/ai";
import { toast } from "sonner";

// ── WORD PUZZLE PLAY ──────────────────────────────────────────────
const wordBank = [
  "HELLO","APPLE","WATER","HOUSE","STUDY","BRAIN","MUSIC","EARTH","LIGHT","PEACE",
  "HAPPY","DANCE","RIVER","CLOUD","PLANT","DREAM","SMILE","HEART","STONE","FLAME",
  "OCEAN","MAGIC","POWER","GRACE","BRAVE","STORM","QUIET","FROST","BLOOM","SHINE",
];

function scramble(w: string): string {
  const arr = w.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("") === w ? scramble(w) : arr.join("");
}

export const WordPuzzlePlay = () => {
  const { level: lv } = useParams();
  const level = parseInt(lv || "1");
  const [word, setWord] = useState(wordBank[level % wordBank.length]);
  const [sc, setSc] = useState(() => scramble(wordBank[level % wordBank.length]));
  const [guess, setGuess] = useState("");
  const [fb, setFb] = useState<"correct" | "wrong" | null>(null);

  return (
    <GamePlayShell gameName="Word Puzzle" gameSlug="word-puzzle" theme="jungle">
      {({ addScore, loseLife, resetGame }) => (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-muted-foreground text-xs mb-2">Unscramble:</p>
            <p className="text-4xl font-black text-foreground tracking-[0.3em]">{sc}</p>
          </div>
          <div className="flex gap-3">
            <Input value={guess} onChange={(e) => { setGuess(e.target.value); setFb(null); }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (guess.toUpperCase() === word) {
                    setFb("correct"); addScore(level * 10);
                    setTimeout(() => {
                      const nw = wordBank[Math.floor(Math.random() * wordBank.length)];
                      setWord(nw); setSc(scramble(nw)); setGuess(""); setFb(null);
                    }, 700);
                  } else { setFb("wrong"); loseLife(); }
                }
              }}
              placeholder="Your answer..." className="h-12 bg-muted/50 border-border/50 text-foreground uppercase tracking-widest text-center text-lg" />
            <Button onClick={() => {
              if (guess.toUpperCase() === word) {
                setFb("correct"); addScore(level * 10);
                setTimeout(() => { const nw = wordBank[Math.floor(Math.random() * wordBank.length)]; setWord(nw); setSc(scramble(nw)); setGuess(""); setFb(null); }, 700);
              } else { setFb("wrong"); loseLife(); }
            }} className="h-12 px-5 bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
          {fb && (
            <div className={`glass rounded-2xl p-4 text-center font-bold ${fb === "correct" ? "text-green-400" : "text-destructive"}`}>
              {fb === "correct" ? `✅ Correct! +${level * 10} pts` : `❌ Starts with "${word[0]}" — try again!`}
            </div>
          )}
          <Button variant="outline" onClick={() => { const nw = wordBank[Math.floor(Math.random() * wordBank.length)]; setWord(nw); setSc(scramble(nw)); setGuess(""); setFb(null); }}
            className="w-full border-border/50 text-muted-foreground">
            <RotateCcw className="w-4 h-4 mr-2" /> Skip Word
          </Button>
        </div>
      )}
    </GamePlayShell>
  );
};

// ── MEMORY MATCH PLAY ─────────────────────────────────────────────
const pairs = [
  { word: "Hello", meaning: "Greeting" }, { word: "Brave", meaning: "Courageous" },
  { word: "Happy", meaning: "Joyful" }, { word: "Light", meaning: "Illumination" },
  { word: "Ocean", meaning: "Sea" }, { word: "Dream", meaning: "Vision" },
];

export const MemoryMatchPlay = () => {
  const { level: lv } = useParams();
  const level = parseInt(lv || "1");
  const [cards, setCards] = useState(() => {
    const items = [...pairs.slice(0, 3 + Math.min(level - 1, 3))];
    return [...items.map((p, i) => ({ id: i * 2, text: p.word, group: i, flipped: false, matched: false })),
            ...items.map((p, i) => ({ id: i * 2 + 1, text: p.meaning, group: i, flipped: false, matched: false }))
    ].sort(() => Math.random() - 0.5);
  });
  const [selected, setSelected] = useState<number[]>([]);

  const flip = (idx: number, addScore: (p: number) => void, loseLife: () => void) => {
    if (cards[idx].matched || cards[idx].flipped || selected.length === 2) return;
    const nc = [...cards];
    nc[idx] = { ...nc[idx], flipped: true };
    const ns = [...selected, idx];
    setCards(nc);
    if (ns.length === 2) {
      setSelected([]);
      if (nc[ns[0]].group === nc[ns[1]].group) {
        setTimeout(() => setCards((c) => c.map((cd, i) => ns.includes(i) ? { ...cd, matched: true } : cd)), 400);
        addScore(level * 20);
      } else {
        loseLife();
        setTimeout(() => setCards((c) => c.map((cd, i) => ns.includes(i) ? { ...cd, flipped: false } : cd)), 900);
      }
    } else {
      setSelected(ns);
    }
  };

  return (
    <GamePlayShell gameName="Memory Match" gameSlug="memory-match" theme="space">
      {({ addScore, loseLife }) => (
        <div className="grid grid-cols-3 gap-3">
          {cards.map((card, i) => (
            <motion.button key={card.id} whileTap={{ scale: 0.9 }}
              onClick={() => flip(i, addScore, loseLife)}
              className={`h-20 rounded-2xl font-bold text-sm transition-all ${card.matched ? "bg-green-500/30 text-green-300 border border-green-500/30" : card.flipped ? "bg-primary/30 text-foreground border border-primary/30" : "glass text-transparent"}`}>
              {(card.flipped || card.matched) ? card.text : "?"}
            </motion.button>
          ))}
        </div>
      )}
    </GamePlayShell>
  );
};

// ── SPEED QUIZ PLAY ──────────────────────────────────────────────
const quizQs = [
  { q: "What is 7 × 8?", a: "56", opts: ["48", "54", "56", "64"] },
  { q: "Capital of France?", a: "Paris", opts: ["London", "Berlin", "Paris", "Rome"] },
  { q: "H₂O is?", a: "Water", opts: ["Fire", "Air", "Earth", "Water"] },
  { q: "Sun rises in?", a: "East", opts: ["West", "North", "East", "South"] },
];

export const SpeedQuizPlay = () => {
  const { level: lv } = useParams();
  const level = parseInt(lv || "1");
  const [qi, setQi] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const [timer, setTimer] = useState(15);

  useEffect(() => {
    if (answered) return;
    const t = setInterval(() => setTimer((v) => { if (v <= 1) { clearInterval(t); } return v - 1; }), 1000);
    return () => clearInterval(t);
  }, [qi, answered]);

  const q = quizQs[qi % quizQs.length];

  return (
    <GamePlayShell gameName="Speed Quiz" gameSlug="speed-quiz" theme="fire">
      {({ addScore, loseLife }) => (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-3 flex justify-between items-center">
            <span className="text-muted-foreground text-xs">Q{qi + 1}</span>
            <span className={`font-black text-2xl ${timer <= 5 ? "text-destructive" : "text-primary"}`}>{timer}s</span>
            <span className="text-muted-foreground text-xs">Level {level}</span>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-foreground font-bold">{q.q}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {q.opts.map((opt) => (
              <motion.button key={opt} whileTap={{ scale: 0.95 }}
                disabled={!!answered}
                onClick={() => {
                  setAnswered(opt);
                  if (opt === q.a) { addScore(level * timer * 5); }
                  else { loseLife(); }
                  setTimeout(() => { setQi((i) => i + 1); setAnswered(null); setTimer(15); }, 800);
                }}
                className={`h-16 rounded-2xl font-semibold text-sm transition-all ${
                  answered === opt ? opt === q.a ? "bg-green-500/40 text-green-300" : "bg-destructive/40 text-destructive"
                  : answered && opt === q.a ? "bg-green-500/40 text-green-300" : "glass text-foreground hover:bg-muted/50"}`}>
                {opt}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </GamePlayShell>
  );
};

// ── SENTENCE BUILDER PLAY ─────────────────────────────────────────
const sentences = [
  { words: ["The", "cat", "sat", "on", "mat", "the"], answer: "The cat sat on the mat" },
  { words: ["I", "love", "to", "learn", "new", "things"], answer: "I love to learn new things" },
];

export const SentenceBuilderPlay = () => {
  const { level: lv } = useParams();
  const level = parseInt(lv || "1");
  const sent = sentences[level % sentences.length];
  const [pool, setPool] = useState([...sent.words].sort(() => Math.random() - 0.5));
  const [built, setBuilt] = useState<string[]>([]);
  const [result, setResult] = useState<boolean | null>(null);

  const pick = (w: string, i: number) => {
    setBuilt((b) => [...b, w]);
    setPool((p) => { const np = [...p]; np.splice(i, 1); return np; });
  };
  const unpick = (i: number) => {
    setPool((p) => [...p, built[i]]);
    setBuilt((b) => { const nb = [...b]; nb.splice(i, 1); return nb; });
  };

  return (
    <GamePlayShell gameName="Sentence Builder" gameSlug="sentence-builder" theme="candy">
      {({ addScore, loseLife, resetGame }) => (
        <div className="space-y-4">
          <p className="text-muted-foreground text-xs text-center">Tap words to build the sentence</p>
          <div className="glass rounded-2xl p-4 min-h-16 flex flex-wrap gap-2">
            {built.map((w, i) => (
              <motion.button key={i} whileTap={{ scale: 0.9 }} onClick={() => unpick(i)}
                className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-semibold">
                {w}
              </motion.button>
            ))}
            {built.length === 0 && <p className="text-muted-foreground text-xs">Sentence appears here...</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            {pool.map((w, i) => (
              <motion.button key={i} whileTap={{ scale: 0.9 }} onClick={() => pick(w, i)}
                className="glass px-3 py-1.5 rounded-lg text-foreground text-sm font-semibold">
                {w}
              </motion.button>
            ))}
          </div>
          {result !== null && (
            <div className={`glass rounded-2xl p-3 text-center font-bold ${result ? "text-green-400" : "text-destructive"}`}>
              {result ? "✅ Perfect!" : `❌ Correct: "${sent.answer}"`}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => {
              const ok = built.join(" ") === sent.answer;
              setResult(ok);
              if (ok) addScore(level * 30); else loseLife();
            }} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Check</Button>
            <Button variant="outline" onClick={() => { setPool([...sent.words].sort(() => Math.random() - 0.5)); setBuilt([]); setResult(null); }}
              className="border-border/50 text-foreground">Clear</Button>
          </div>
        </div>
      )}
    </GamePlayShell>
  );
};

// ── BRAIN PUZZLE PLAY ─────────────────────────────────────────────
export const BrainPuzzlePlay = () => {
  const { level: lv } = useParams();
  const level = parseInt(lv || "1");
  const [questions, setQuestions] = useState<any[]>([]);
  const [qi, setQi] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const start = async (loseLife: () => void) => {
    setLoading(true); setStarted(true);
    try {
      const c = await fetchAI([{ role: "user", content: `Generate 5 brain puzzle/logic questions for level ${level}. Each with 4 options. Return JSON array: [{question, options:[4 strings], correct: index 0-3, explanation}]` }], "quiz");
      setQuestions(JSON.parse(c.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
    } catch { toast.error("Failed to load puzzles"); }
    setLoading(false);
  };

  return (
    <GamePlayShell gameName="Brain Puzzle" gameSlug="brain-puzzle" theme="ocean">
      {({ addScore, loseLife }) => {
        if (!started) return (
          <div className="glass rounded-2xl p-8 text-center space-y-4">
            <p className="text-4xl">🧠</p>
            <p className="text-foreground font-bold">Ready for Level {level}?</p>
            <Button onClick={() => start(loseLife)} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-glow">Start Puzzles</Button>
          </div>
        );
        if (loading) return <div className="glass rounded-2xl p-8 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>;
        const q = questions[qi];
        if (!q) return <div className="glass rounded-2xl p-8 text-center text-foreground font-bold">🎉 Level Complete!</div>;
        return (
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-foreground font-bold">{q.question}</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {q.options.map((opt: string, i: number) => (
                <motion.button key={i} whileTap={{ scale: 0.95 }} disabled={answered !== null}
                  onClick={() => {
                    setAnswered(i);
                    if (i === q.correct) addScore(level * 15); else loseLife();
                    setTimeout(() => { setQi((n) => n + 1); setAnswered(null); }, 1200);
                  }}
                  className={`glass rounded-xl p-4 text-sm font-semibold text-left transition-all ${
                    answered === null ? "text-foreground hover:bg-muted/50"
                    : i === q.correct ? "bg-green-500/30 text-green-300"
                    : i === answered ? "bg-destructive/30 text-destructive" : "text-muted-foreground opacity-50"}`}>
                  {opt}
                </motion.button>
              ))}
            </div>
            {answered !== null && <div className="glass rounded-2xl p-3 text-xs text-muted-foreground">💡 {q.explanation}</div>}
          </div>
        );
      }}
    </GamePlayShell>
  );
};

// ── CODE BUILDER PLAY ─────────────────────────────────────────────
const codeQs = [
  { q: "Complete: print('Hello ___')", answer: "World", opts: ["World", "Python", "Code", "Life"] },
  { q: "What is x?\nif True:\n  x = 5", answer: "5", opts: ["0", "5", "True", "None"] },
];

export const CodeBuilderPlay = () => {
  const { level: lv } = useParams();
  const level = parseInt(lv || "1");
  const [qi, setQi] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const q = codeQs[qi % codeQs.length];

  return (
    <GamePlayShell gameName="Code Builder" gameSlug="code-builder" theme="tech">
      {({ addScore, loseLife }) => (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-4 font-mono text-sm text-foreground whitespace-pre">{q.q}</div>
          <div className="grid grid-cols-2 gap-3">
            {q.opts.map((opt) => (
              <motion.button key={opt} whileTap={{ scale: 0.95 }} disabled={!!answered}
                onClick={() => {
                  setAnswered(opt);
                  if (opt === q.answer) addScore(level * 25); else loseLife();
                  setTimeout(() => { setQi((i) => i + 1); setAnswered(null); }, 800);
                }}
                className={`h-14 rounded-2xl font-semibold text-sm ${answered === opt ? opt === q.answer ? "bg-green-500/40 text-green-300" : "bg-destructive/40 text-destructive" : answered && opt === q.answer ? "bg-green-500/40 text-green-300" : "glass text-foreground"}`}>
                {opt}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </GamePlayShell>
  );
};

// ── BUG FIX PLAY ──────────────────────────────────────────────────
const bugs = [
  { code: "prnt('Hello World')", bug: "prnt", fix: "print", hint: "Wrong function name" },
  { code: "x = 5\nif x > 3\n  print('big')", bug: "if x > 3", fix: "if x > 3:", hint: "Missing colon" },
];

export const BugFixPlay = () => {
  const { level: lv } = useParams();
  const level = parseInt(lv || "1");
  const [bi, setBi] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const bug = bugs[bi % bugs.length];

  return (
    <GamePlayShell gameName="Bug Fix" gameSlug="bug-fix" theme="cyberpunk">
      {({ addScore, loseLife }) => (
        <div className="space-y-4">
          <p className="text-muted-foreground text-xs text-center">Find and fix the bug 🐛</p>
          <div className="glass rounded-2xl p-4">
            <p className="text-muted-foreground text-xs mb-1">Buggy Code:</p>
            <pre className="font-mono text-sm text-destructive">{bug.code}</pre>
          </div>
          <p className="text-muted-foreground text-xs">💡 Hint: {bug.hint}</p>
          <div className="flex gap-2">
            <Input value={answer} onChange={(e) => { setAnswer(e.target.value); setResult(null); }}
              placeholder="Type the fix..." className="h-12 bg-muted/50 border-border/50 text-foreground font-mono" />
            <Button onClick={() => {
              const ok = answer.trim() === bug.fix;
              setResult(ok);
              if (ok) { addScore(level * 30); setTimeout(() => { setBi((i) => i + 1); setAnswer(""); setResult(null); }, 700); }
              else loseLife();
            }} className="h-12 px-5 bg-primary hover:bg-primary/90 text-primary-foreground">✓</Button>
          </div>
          {result !== null && (
            <div className={`glass rounded-2xl p-3 text-center font-bold ${result ? "text-green-400" : "text-destructive"}`}>
              {result ? "✅ Bug Fixed!" : `❌ Answer: "${bug.fix}"`}
            </div>
          )}
        </div>
      )}
    </GamePlayShell>
  );
};

// ── OUTPUT PREDICT PLAY ───────────────────────────────────────────
const outputs = [
  { code: "x = 3 + 4\nprint(x)", answer: "7", opts: ["7", "34", "3", "Error"] },
  { code: "print(len('Hello'))", answer: "5", opts: ["4", "5", "6", "Hello"] },
  { code: "print(2 ** 3)", answer: "8", opts: ["6", "8", "9", "23"] },
];

export const OutputPredictPlay = () => {
  const { level: lv } = useParams();
  const level = parseInt(lv || "1");
  const [oi, setOi] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const o = outputs[oi % outputs.length];

  return (
    <GamePlayShell gameName="Output Predict" gameSlug="output-predict" theme="neon">
      {({ addScore, loseLife }) => (
        <div className="space-y-4">
          <p className="text-muted-foreground text-xs text-center">What will this output?</p>
          <div className="glass rounded-2xl p-4 font-mono text-sm text-foreground whitespace-pre">{o.code}</div>
          <div className="grid grid-cols-2 gap-3">
            {o.opts.map((opt) => (
              <motion.button key={opt} whileTap={{ scale: 0.95 }} disabled={!!answered}
                onClick={() => {
                  setAnswered(opt);
                  if (opt === o.answer) addScore(level * 20); else loseLife();
                  setTimeout(() => { setOi((i) => i + 1); setAnswered(null); }, 800);
                }}
                className={`h-14 rounded-2xl font-bold font-mono text-lg ${answered === opt ? opt === o.answer ? "bg-green-500/40 text-green-300" : "bg-destructive/40 text-destructive" : answered && opt === o.answer ? "bg-green-500/40 text-green-300" : "glass text-foreground"}`}>
                {opt}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </GamePlayShell>
  );
};
