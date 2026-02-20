import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Star, ChevronRight } from "lucide-react";
import ThemedBackground from "@/components/ThemedBackground";
import BottomNav from "@/components/BottomNav";
import type { BgTheme } from "@/components/GameHomeShell";

interface GameLevelsShellProps {
  gameName: string;
  gameSlug: string;
  theme: BgTheme;
  unlockedLevels?: number;
}

const GameLevelsShell = ({ gameName, gameSlug, theme, unlockedLevels = 5 }: GameLevelsShellProps) => {
  const navigate = useNavigate();

  const levels = Array.from({ length: 30 }, (_, i) => ({
    num: i + 1,
    stars: i < unlockedLevels - 1 ? Math.floor(Math.random() * 3) + 1 : 0,
    unlocked: i < unlockedLevels,
  }));

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

        <h1 className="text-2xl font-black text-foreground mb-6">🗺️ Level Map</h1>

        {/* Candy Crush style level path */}
        <div className="relative space-y-2 pb-6">
          {levels.map((level, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={level.num}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex ${isLeft ? "justify-start" : "justify-end"} relative`}
              >
                {/* Connector line */}
                {i < levels.length - 1 && (
                  <div
                    className="absolute"
                    style={{
                      width: "2px",
                      height: "32px",
                      background: level.unlocked ? "hsl(265 85% 60% / 0.4)" : "hsl(230 30% 25% / 0.4)",
                      bottom: "-32px",
                      left: isLeft ? "36px" : "auto",
                      right: isLeft ? "auto" : "36px",
                    }}
                  />
                )}

                <motion.button
                  whileHover={level.unlocked ? { scale: 1.1 } : {}}
                  whileTap={level.unlocked ? { scale: 0.95 } : {}}
                  disabled={!level.unlocked}
                  onClick={() => level.unlocked && navigate(`/games/${gameSlug}/play/${level.num}`)}
                  className={`w-20 h-20 rounded-full flex flex-col items-center justify-center relative shadow-lg ${
                    level.unlocked
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-60"
                  }`}
                  style={{
                    background: level.unlocked
                      ? level.stars > 0
                        ? "linear-gradient(135deg, hsl(45 100% 55%), hsl(25 100% 50%))"
                        : "linear-gradient(135deg, hsl(265 85% 55%), hsl(220 100% 55%))"
                      : "hsl(230 30% 15%)",
                    border: level.unlocked ? "3px solid hsl(265 85% 70% / 0.5)" : "3px solid hsl(230 30% 25%)",
                    boxShadow: level.unlocked ? "0 0 20px hsl(265 85% 60% / 0.4)" : "none",
                  }}
                >
                  {!level.unlocked ? (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  ) : (
                    <>
                      <span className="text-white font-black text-sm">{level.num}</span>
                      <div className="flex gap-0.5 mt-0.5">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-2.5 h-2.5 ${s <= level.stars ? "text-yellow-300 fill-yellow-300" : "text-white/30"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Unlocked glow ring */}
                  {level.unlocked && level.num === unlockedLevels && (
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                      style={{ background: "hsl(265 85% 60%)" }} />
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default GameLevelsShell;
