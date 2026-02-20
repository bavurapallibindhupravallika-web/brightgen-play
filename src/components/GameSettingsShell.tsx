import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX, RotateCcw, Music2 } from "lucide-react";
import { useState } from "react";
import ThemedBackground from "@/components/ThemedBackground";
import BottomNav from "@/components/BottomNav";
import type { BgTheme } from "@/components/GameHomeShell";
import { toast } from "sonner";

interface GameSettingsShellProps {
  gameName: string;
  gameSlug: string;
  theme: BgTheme;
}

const GameSettingsShell = ({ gameName, gameSlug, theme }: GameSettingsShellProps) => {
  const navigate = useNavigate();
  const [sound, setSound] = useState(true);
  const [music, setMusic] = useState(true);
  const [vibration, setVibration] = useState(true);

  const ToggleRow = ({ label, value, onChange, emoji }: {
    label: string; value: boolean; onChange: (v: boolean) => void; emoji: string;
  }) => (
    <div className="flex items-center justify-between p-4 glass rounded-2xl">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <span className="text-foreground font-semibold text-sm">{label}</span>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-14 h-7 rounded-full transition-all relative ${value ? "bg-primary" : "bg-muted"}`}
        style={{ boxShadow: value ? "0 0 10px hsl(265 85% 60% / 0.4)" : "none" }}
      >
        <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all ${value ? "right-0.5" : "left-0.5"}`} />
      </button>
    </div>
  );

  return (
    <div className="relative min-h-screen pb-24">
      <ThemedBackground theme={theme} />
      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-6">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(`/games/${gameSlug}/home`)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">{gameName}</span>
        </motion.button>

        <h1 className="text-2xl font-black text-foreground mb-6">⚙️ Settings</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <ToggleRow label="Sound Effects" value={sound} onChange={setSound} emoji="🔊" />
          <ToggleRow label="Background Music" value={music} onChange={setMusic} emoji="🎵" />
          <ToggleRow label="Vibration" value={vibration} onChange={setVibration} emoji="📳" />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              toast.success("Progress reset!");
            }}
            className="w-full glass rounded-2xl p-4 flex items-center gap-3 text-left border border-destructive/30"
          >
            <span className="text-2xl">🔄</span>
            <div>
              <p className="text-destructive font-semibold text-sm">Reset Progress</p>
              <p className="text-muted-foreground text-xs">Start from Level 1</p>
            </div>
          </motion.button>

          <div className="glass rounded-2xl p-4 space-y-2">
            <p className="text-foreground font-bold text-sm">🎮 About</p>
            <p className="text-muted-foreground text-xs">{gameName} — 100 Levels</p>
            <p className="text-muted-foreground text-xs">StudyFlix v1.0</p>
          </div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
};

export default GameSettingsShell;
