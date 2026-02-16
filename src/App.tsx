import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";
import WordPuzzle from "./pages/games/WordPuzzle";
import MemoryMatch from "./pages/games/MemoryMatch";
import SpeedQuiz from "./pages/games/SpeedQuiz";
import SentenceBuilder from "./pages/games/SentenceBuilder";
import BrainPuzzle from "./pages/games/BrainPuzzle";
import CodeBuilder from "./pages/games/CodeBuilder";
import BugFix from "./pages/games/BugFix";
import OutputPredict from "./pages/games/OutputPredict";
import LanguageLearn from "./pages/languages/LanguageLearn";
import LanguageQuiz from "./pages/languages/LanguageQuiz";
import LanguageWritten from "./pages/languages/LanguageWritten";
import LanguagePractice from "./pages/languages/LanguagePractice";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="/games/word-puzzle" element={<WordPuzzle />} />
          <Route path="/games/memory-match" element={<MemoryMatch />} />
          <Route path="/games/speed-quiz" element={<SpeedQuiz />} />
          <Route path="/games/sentence-builder" element={<SentenceBuilder />} />
          <Route path="/games/brain-puzzle" element={<BrainPuzzle />} />
          <Route path="/games/code-builder" element={<CodeBuilder />} />
          <Route path="/games/bug-fix" element={<BugFix />} />
          <Route path="/games/output-predict" element={<OutputPredict />} />
          <Route path="/languages" element={<Languages />} />
          <Route path="/languages/learn" element={<LanguageLearn />} />
          <Route path="/languages/quiz" element={<LanguageQuiz />} />
          <Route path="/languages/written" element={<LanguageWritten />} />
          <Route path="/languages/practice" element={<LanguagePractice />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
