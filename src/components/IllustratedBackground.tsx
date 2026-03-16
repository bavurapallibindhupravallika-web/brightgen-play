import React from "react";

type Scene = "dreamySky" | "nightSky" | "classroom" | "gameWorld" | "fantasy" | "pastel" | "minimal" | "ocean" | "forest";

interface IllustratedBackgroundProps {
  scene: Scene;
}

const scenes: Record<Scene, {
  sky: string[];
  elements: { emoji: string; x: number; y: number; size: number; opacity: number }[];
  groundGradient?: string;
}> = {
  dreamySky: {
    sky: [
      "hsl(220 60% 85%)",   // soft blue
      "hsl(280 50% 80%)",   // lavender
      "hsl(330 60% 85%)",   // pink
      "hsl(40 80% 90%)",    // warm glow
    ],
    elements: [
      { emoji: "☁️", x: 10, y: 8, size: 40, opacity: 0.7 },
      { emoji: "☁️", x: 70, y: 5, size: 50, opacity: 0.5 },
      { emoji: "☁️", x: 45, y: 15, size: 35, opacity: 0.6 },
      { emoji: "⭐", x: 20, y: 12, size: 14, opacity: 0.4 },
      { emoji: "⭐", x: 80, y: 18, size: 12, opacity: 0.3 },
      { emoji: "✨", x: 55, y: 8, size: 16, opacity: 0.5 },
      { emoji: "🌤️", x: 85, y: 6, size: 30, opacity: 0.6 },
      { emoji: "🦋", x: 30, y: 25, size: 18, opacity: 0.4 },
      { emoji: "🌈", x: 15, y: 20, size: 28, opacity: 0.3 },
    ],
    groundGradient: "linear-gradient(to top, hsl(120 30% 75% / 0.3) 0%, transparent 30%)",
  },
  nightSky: {
    sky: [
      "hsl(240 40% 12%)",
      "hsl(260 50% 18%)",
      "hsl(280 40% 15%)",
      "hsl(240 40% 10%)",
    ],
    elements: [
      { emoji: "🌙", x: 80, y: 8, size: 36, opacity: 0.8 },
      { emoji: "⭐", x: 10, y: 5, size: 14, opacity: 0.6 },
      { emoji: "⭐", x: 25, y: 12, size: 10, opacity: 0.5 },
      { emoji: "⭐", x: 50, y: 8, size: 12, opacity: 0.7 },
      { emoji: "⭐", x: 65, y: 15, size: 8, opacity: 0.4 },
      { emoji: "⭐", x: 90, y: 20, size: 11, opacity: 0.6 },
      { emoji: "✨", x: 35, y: 6, size: 16, opacity: 0.5 },
      { emoji: "✨", x: 75, y: 22, size: 14, opacity: 0.4 },
      { emoji: "🌌", x: 40, y: 3, size: 24, opacity: 0.3 },
    ],
  },
  classroom: {
    sky: [
      "hsl(200 50% 85%)",
      "hsl(170 40% 82%)",
      "hsl(200 45% 88%)",
      "hsl(180 30% 90%)",
    ],
    elements: [
      { emoji: "📚", x: 10, y: 80, size: 28, opacity: 0.3 },
      { emoji: "✏️", x: 85, y: 75, size: 22, opacity: 0.3 },
      { emoji: "🎓", x: 50, y: 5, size: 26, opacity: 0.3 },
      { emoji: "💡", x: 75, y: 10, size: 20, opacity: 0.4 },
      { emoji: "📖", x: 20, y: 15, size: 22, opacity: 0.25 },
      { emoji: "🌱", x: 90, y: 85, size: 24, opacity: 0.3 },
    ],
    groundGradient: "linear-gradient(to top, hsl(120 25% 80% / 0.2) 0%, transparent 20%)",
  },
  gameWorld: {
    sky: [
      "hsl(200 70% 80%)",
      "hsl(170 60% 75%)",
      "hsl(140 50% 70%)",
      "hsl(80 50% 75%)",
    ],
    elements: [
      { emoji: "☁️", x: 15, y: 8, size: 42, opacity: 0.6 },
      { emoji: "☁️", x: 65, y: 5, size: 48, opacity: 0.5 },
      { emoji: "🏆", x: 50, y: 12, size: 24, opacity: 0.4 },
      { emoji: "⭐", x: 30, y: 18, size: 16, opacity: 0.5 },
      { emoji: "⭐", x: 80, y: 15, size: 14, opacity: 0.4 },
      { emoji: "🎮", x: 10, y: 20, size: 20, opacity: 0.3 },
      { emoji: "🎯", x: 90, y: 22, size: 18, opacity: 0.3 },
    ],
    groundGradient: "linear-gradient(to top, hsl(120 40% 65% / 0.4) 0%, hsl(140 35% 70% / 0.2) 15%, transparent 35%)",
  },
  fantasy: {
    sky: [
      "hsl(260 40% 75%)",
      "hsl(280 45% 78%)",
      "hsl(310 40% 80%)",
      "hsl(340 45% 85%)",
    ],
    elements: [
      { emoji: "🏰", x: 50, y: 70, size: 36, opacity: 0.25 },
      { emoji: "🌺", x: 15, y: 80, size: 22, opacity: 0.3 },
      { emoji: "🌺", x: 85, y: 78, size: 18, opacity: 0.25 },
      { emoji: "✨", x: 30, y: 10, size: 16, opacity: 0.5 },
      { emoji: "✨", x: 70, y: 8, size: 14, opacity: 0.4 },
      { emoji: "🦋", x: 60, y: 20, size: 20, opacity: 0.35 },
      { emoji: "☁️", x: 20, y: 6, size: 38, opacity: 0.5 },
      { emoji: "☁️", x: 75, y: 4, size: 44, opacity: 0.4 },
    ],
    groundGradient: "linear-gradient(to top, hsl(280 30% 70% / 0.3) 0%, transparent 25%)",
  },
  pastel: {
    sky: [
      "hsl(280 40% 88%)",
      "hsl(320 35% 88%)",
      "hsl(200 40% 90%)",
      "hsl(160 30% 88%)",
    ],
    elements: [
      { emoji: "💫", x: 20, y: 10, size: 18, opacity: 0.4 },
      { emoji: "💫", x: 80, y: 15, size: 14, opacity: 0.3 },
      { emoji: "🫧", x: 40, y: 8, size: 20, opacity: 0.3 },
      { emoji: "🫧", x: 70, y: 20, size: 16, opacity: 0.25 },
      { emoji: "🫧", x: 10, y: 25, size: 22, opacity: 0.2 },
      { emoji: "☁️", x: 55, y: 5, size: 36, opacity: 0.4 },
    ],
  },
  minimal: {
    sky: [
      "hsl(220 30% 90%)",
      "hsl(230 25% 88%)",
      "hsl(240 20% 92%)",
      "hsl(220 25% 90%)",
    ],
    elements: [
      { emoji: "⚙️", x: 85, y: 10, size: 20, opacity: 0.15 },
      { emoji: "🔧", x: 15, y: 85, size: 18, opacity: 0.12 },
    ],
  },
  ocean: {
    sky: [
      "hsl(200 60% 80%)",
      "hsl(195 55% 75%)",
      "hsl(190 50% 70%)",
      "hsl(200 45% 85%)",
    ],
    elements: [
      { emoji: "🌊", x: 10, y: 85, size: 30, opacity: 0.3 },
      { emoji: "🌊", x: 50, y: 88, size: 34, opacity: 0.25 },
      { emoji: "🌊", x: 85, y: 83, size: 28, opacity: 0.3 },
      { emoji: "🐠", x: 30, y: 75, size: 20, opacity: 0.25 },
      { emoji: "☁️", x: 20, y: 8, size: 40, opacity: 0.5 },
      { emoji: "☁️", x: 70, y: 5, size: 46, opacity: 0.45 },
      { emoji: "🌤️", x: 85, y: 6, size: 28, opacity: 0.5 },
    ],
    groundGradient: "linear-gradient(to top, hsl(200 50% 65% / 0.3) 0%, transparent 25%)",
  },
  forest: {
    sky: [
      "hsl(140 35% 80%)",
      "hsl(160 30% 78%)",
      "hsl(120 25% 82%)",
      "hsl(100 30% 85%)",
    ],
    elements: [
      { emoji: "🌳", x: 5, y: 75, size: 36, opacity: 0.3 },
      { emoji: "🌳", x: 90, y: 72, size: 32, opacity: 0.25 },
      { emoji: "🌲", x: 15, y: 78, size: 28, opacity: 0.2 },
      { emoji: "🍃", x: 40, y: 15, size: 16, opacity: 0.3 },
      { emoji: "🍃", x: 65, y: 10, size: 14, opacity: 0.25 },
      { emoji: "🦋", x: 50, y: 20, size: 18, opacity: 0.35 },
      { emoji: "☁️", x: 30, y: 6, size: 38, opacity: 0.5 },
      { emoji: "☁️", x: 75, y: 4, size: 42, opacity: 0.4 },
    ],
    groundGradient: "linear-gradient(to top, hsl(120 30% 65% / 0.3) 0%, hsl(140 25% 70% / 0.15) 20%, transparent 40%)",
  },
};

const IllustratedBackground: React.FC<IllustratedBackgroundProps> = ({ scene }) => {
  const s = scenes[scene];

  const skyGradient = `linear-gradient(180deg, ${s.sky[0]} 0%, ${s.sky[1]} 35%, ${s.sky[2]} 65%, ${s.sky[3]} 100%)`;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Sky gradient */}
      <div className="absolute inset-0" style={{ background: skyGradient }} />

      {/* Ground gradient */}
      {s.groundGradient && (
        <div className="absolute inset-0" style={{ background: s.groundGradient }} />
      )}

      {/* Illustrated elements */}
      {s.elements.map((el, i) => (
        <div
          key={i}
          className="absolute select-none"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: `${el.size}px`,
            opacity: el.opacity,
            animation: `float ${6 + (i % 3) * 2}s ease-in-out ${i * 0.5}s infinite`,
          }}
        >
          {el.emoji}
        </div>
      ))}

      {/* Soft overlay for text readability */}
      <div className="absolute inset-0 bg-background/30" />
    </div>
  );
};

export default IllustratedBackground;
export type { Scene };
