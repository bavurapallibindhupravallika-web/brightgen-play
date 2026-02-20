import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Movie from "./pages/Movie";
import Song from "./pages/Song";
import Animated from "./pages/Animated";
import Quiz from "./pages/Quiz";
import AiChat from "./pages/AiChat";
import Games from "./pages/Games";
import Languages from "./pages/Languages";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import Saved from "./pages/Saved";
import VipUpgrade from "./pages/VipUpgrade";
import NotFound from "./pages/NotFound";

// Game gameplay pages (existing)
import WordPuzzle from "./pages/games/WordPuzzle";
import MemoryMatch from "./pages/games/MemoryMatch";
import SpeedQuiz from "./pages/games/SpeedQuiz";
import SentenceBuilder from "./pages/games/SentenceBuilder";
import BrainPuzzle from "./pages/games/BrainPuzzle";
import CodeBuilder from "./pages/games/CodeBuilder";
import BugFix from "./pages/games/BugFix";
import OutputPredict from "./pages/games/OutputPredict";

// New Game Home pages
import {
  WordPuzzleHome, MemoryMatchHome, SpeedQuizHome, SentenceBuilderHome,
  BrainPuzzleHome, CodeBuilderHome, BugFixHome, OutputPredictHome,
} from "./pages/games/GameHomes";

// New Game Level Map pages
import {
  WordPuzzleLevels, MemoryMatchLevels, SpeedQuizLevels, SentenceBuilderLevels,
  BrainPuzzleLevels, CodeBuilderLevels, BugFixLevels, OutputPredictLevels,
} from "./pages/games/GameLevelPages";

// New Game Settings pages
import {
  WordPuzzleSettings, MemoryMatchSettings, SpeedQuizSettings, SentenceBuilderSettings,
  BrainPuzzleSettings, CodeBuilderSettings, BugFixSettings, OutputPredictSettings,
} from "./pages/games/GameSettingPages";

// New Game Online pages
import {
  WordPuzzleOnline, MemoryMatchOnline, SpeedQuizOnline, SentenceBuilderOnline,
  BrainPuzzleOnline, CodeBuilderOnline, BugFixOnline, OutputPredictOnline,
} from "./pages/games/GameOnlinePages";

// New Game Play pages (with lives/score/GamePlayShell)
import {
  WordPuzzlePlay, MemoryMatchPlay, SpeedQuizPlay, SentenceBuilderPlay,
  BrainPuzzlePlay, CodeBuilderPlay, BugFixPlay, OutputPredictPlay,
} from "./pages/games/GamePlayPages";

// Language pages
import LanguageLearn from "./pages/languages/LanguageLearn";
import LanguageQuiz from "./pages/languages/LanguageQuiz";
import LanguageWritten from "./pages/languages/LanguageWritten";
import LanguagePractice from "./pages/languages/LanguagePractice";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/movie" element={<Movie />} />
            <Route path="/song" element={<Song />} />
            <Route path="/animated" element={<Animated />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/ai-chat" element={<AiChat />} />
            <Route path="/games" element={<Games />} />

            {/* ── Game Home pages ── */}
            <Route path="/games/word-puzzle/home" element={<WordPuzzleHome />} />
            <Route path="/games/memory-match/home" element={<MemoryMatchHome />} />
            <Route path="/games/speed-quiz/home" element={<SpeedQuizHome />} />
            <Route path="/games/sentence-builder/home" element={<SentenceBuilderHome />} />
            <Route path="/games/brain-puzzle/home" element={<BrainPuzzleHome />} />
            <Route path="/games/code-builder/home" element={<CodeBuilderHome />} />
            <Route path="/games/bug-fix/home" element={<BugFixHome />} />
            <Route path="/games/output-predict/home" element={<OutputPredictHome />} />

            {/* ── Game Level Map pages ── */}
            <Route path="/games/word-puzzle/levels" element={<WordPuzzleLevels />} />
            <Route path="/games/memory-match/levels" element={<MemoryMatchLevels />} />
            <Route path="/games/speed-quiz/levels" element={<SpeedQuizLevels />} />
            <Route path="/games/sentence-builder/levels" element={<SentenceBuilderLevels />} />
            <Route path="/games/brain-puzzle/levels" element={<BrainPuzzleLevels />} />
            <Route path="/games/code-builder/levels" element={<CodeBuilderLevels />} />
            <Route path="/games/bug-fix/levels" element={<BugFixLevels />} />
            <Route path="/games/output-predict/levels" element={<OutputPredictLevels />} />

            {/* ── Game Play pages ── */}
            <Route path="/games/word-puzzle/play/:level" element={<WordPuzzlePlay />} />
            <Route path="/games/memory-match/play/:level" element={<MemoryMatchPlay />} />
            <Route path="/games/speed-quiz/play/:level" element={<SpeedQuizPlay />} />
            <Route path="/games/sentence-builder/play/:level" element={<SentenceBuilderPlay />} />
            <Route path="/games/brain-puzzle/play/:level" element={<BrainPuzzlePlay />} />
            <Route path="/games/code-builder/play/:level" element={<CodeBuilderPlay />} />
            <Route path="/games/bug-fix/play/:level" element={<BugFixPlay />} />
            <Route path="/games/output-predict/play/:level" element={<OutputPredictPlay />} />

            {/* ── Game Settings pages ── */}
            <Route path="/games/word-puzzle/settings" element={<WordPuzzleSettings />} />
            <Route path="/games/memory-match/settings" element={<MemoryMatchSettings />} />
            <Route path="/games/speed-quiz/settings" element={<SpeedQuizSettings />} />
            <Route path="/games/sentence-builder/settings" element={<SentenceBuilderSettings />} />
            <Route path="/games/brain-puzzle/settings" element={<BrainPuzzleSettings />} />
            <Route path="/games/code-builder/settings" element={<CodeBuilderSettings />} />
            <Route path="/games/bug-fix/settings" element={<BugFixSettings />} />
            <Route path="/games/output-predict/settings" element={<OutputPredictSettings />} />

            {/* ── Game Online pages ── */}
            <Route path="/games/word-puzzle/online" element={<WordPuzzleOnline />} />
            <Route path="/games/memory-match/online" element={<MemoryMatchOnline />} />
            <Route path="/games/speed-quiz/online" element={<SpeedQuizOnline />} />
            <Route path="/games/sentence-builder/online" element={<SentenceBuilderOnline />} />
            <Route path="/games/brain-puzzle/online" element={<BrainPuzzleOnline />} />
            <Route path="/games/code-builder/online" element={<CodeBuilderOnline />} />
            <Route path="/games/bug-fix/online" element={<BugFixOnline />} />
            <Route path="/games/output-predict/online" element={<OutputPredictOnline />} />

            {/* ── Legacy game routes (keep existing) ── */}
            <Route path="/games/word-puzzle" element={<WordPuzzle />} />
            <Route path="/games/memory-match" element={<MemoryMatch />} />
            <Route path="/games/speed-quiz" element={<SpeedQuiz />} />
            <Route path="/games/sentence-builder" element={<SentenceBuilder />} />
            <Route path="/games/brain-puzzle" element={<BrainPuzzle />} />
            <Route path="/games/code-builder" element={<CodeBuilder />} />
            <Route path="/games/bug-fix" element={<BugFix />} />
            <Route path="/games/output-predict" element={<OutputPredict />} />

            {/* Language pages */}
            <Route path="/languages" element={<Languages />} />
            <Route path="/languages/learn" element={<LanguageLearn />} />
            <Route path="/languages/quiz" element={<LanguageQuiz />} />
            <Route path="/languages/written" element={<LanguageWritten />} />
            <Route path="/languages/practice" element={<LanguagePractice />} />

            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/vip" element={<VipUpgrade />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
