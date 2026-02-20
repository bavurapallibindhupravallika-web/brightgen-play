// Individual Game Home / Levels / Settings / Online pages
// These use shared shell components

import GameHomeShell from "@/components/GameHomeShell";
import { Type } from "lucide-react";
export const WordPuzzleHome = () => (
  <GameHomeShell gameName="Word Puzzle" gameSlug="word-puzzle" icon={<Type className="w-10 h-10 text-white" />}
    description="Unscramble words to unlock all 100 levels!" theme="jungle" gradient="from-green-500 to-emerald-500" />
);

import { Brain } from "lucide-react";
export const MemoryMatchHome = () => (
  <GameHomeShell gameName="Memory Match" gameSlug="memory-match" icon={<Brain className="w-10 h-10 text-white" />}
    description="Match words to meanings — test your memory!" theme="space" gradient="from-purple-500 to-indigo-500" />
);

import { Zap } from "lucide-react";
export const SpeedQuizHome = () => (
  <GameHomeShell gameName="Speed Quiz" gameSlug="speed-quiz" icon={<Zap className="w-10 h-10 text-white" />}
    description="Answer fast, beat the timer!" theme="fire" gradient="from-yellow-500 to-amber-500" />
);

import { AlignLeft } from "lucide-react";
export const SentenceBuilderHome = () => (
  <GameHomeShell gameName="Sentence Builder" gameSlug="sentence-builder" icon={<AlignLeft className="w-10 h-10 text-white" />}
    description="Arrange words to build perfect sentences!" theme="candy" gradient="from-orange-500 to-red-500" />
);

import { Puzzle } from "lucide-react";
export const BrainPuzzleHome = () => (
  <GameHomeShell gameName="Brain Puzzle" gameSlug="brain-puzzle" icon={<Puzzle className="w-10 h-10 text-white" />}
    description="Logic & pattern challenges for big brains!" theme="ocean" gradient="from-teal-500 to-cyan-500" />
);

import { Code } from "lucide-react";
export const CodeBuilderHome = () => (
  <GameHomeShell gameName="Code Builder" gameSlug="code-builder" icon={<Code className="w-10 h-10 text-white" />}
    description="Write code to solve real challenges!" theme="tech" gradient="from-blue-500 to-indigo-600" />
);

import { Bug } from "lucide-react";
export const BugFixHome = () => (
  <GameHomeShell gameName="Bug Fix" gameSlug="bug-fix" icon={<Bug className="w-10 h-10 text-white" />}
    description="Hunt bugs and fix code like a pro!" theme="cyberpunk" gradient="from-red-500 to-pink-500" />
);

import { Terminal } from "lucide-react";
export const OutputPredictHome = () => (
  <GameHomeShell gameName="Output Predict" gameSlug="output-predict" icon={<Terminal className="w-10 h-10 text-white" />}
    description="Predict what code outputs before it runs!" theme="neon" gradient="from-slate-500 to-zinc-600" />
);
