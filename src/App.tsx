import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
          <Route path="/languages" element={<Languages />} />
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
