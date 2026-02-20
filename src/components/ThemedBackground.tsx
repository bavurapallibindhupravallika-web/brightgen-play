import React from "react";

interface ThemedBackgroundProps {
  theme: "jungle" | "space" | "cyberpunk" | "candy" | "neon" | "library" | "cinema" | "music" | "tech" | "ocean" | "fire" | "ice";
}

const themes = {
  jungle: {
    gradient: "from-green-900 via-emerald-800 to-teal-900",
    accent: "hsl(145 70% 40%)",
    particles: ["🌿", "🍃", "🌺", "🦋", "🌳"],
    overlay: "bg-gradient-to-br from-green-900/40 to-emerald-900/60",
  },
  space: {
    gradient: "from-slate-900 via-indigo-950 to-purple-950",
    accent: "hsl(265 85% 60%)",
    particles: ["⭐", "🌟", "✨", "🪐", "🚀"],
    overlay: "bg-gradient-to-br from-indigo-900/40 to-purple-900/60",
  },
  cyberpunk: {
    gradient: "from-violet-950 via-fuchsia-950 to-pink-950",
    accent: "hsl(320 100% 60%)",
    particles: ["⚡", "🔮", "💜", "🎯", "🌀"],
    overlay: "bg-gradient-to-br from-violet-900/40 to-pink-900/60",
  },
  candy: {
    gradient: "from-pink-800 via-rose-800 to-fuchsia-900",
    accent: "hsl(330 100% 65%)",
    particles: ["🍬", "🍭", "🍡", "🎀", "🌈"],
    overlay: "bg-gradient-to-br from-pink-900/40 to-fuchsia-900/60",
  },
  neon: {
    gradient: "from-cyan-950 via-blue-950 to-indigo-950",
    accent: "hsl(185 100% 55%)",
    particles: ["💎", "🔷", "⚡", "🌊", "🎆"],
    overlay: "bg-gradient-to-br from-cyan-900/40 to-blue-900/60",
  },
  library: {
    gradient: "from-amber-950 via-yellow-950 to-orange-950",
    accent: "hsl(45 100% 60%)",
    particles: ["📚", "📖", "✏️", "🎓", "💡"],
    overlay: "bg-gradient-to-br from-amber-900/40 to-yellow-900/60",
  },
  cinema: {
    gradient: "from-red-950 via-rose-950 to-orange-950",
    accent: "hsl(0 85% 60%)",
    particles: ["🎬", "🎥", "🎞️", "⭐", "🎭"],
    overlay: "bg-gradient-to-br from-red-900/40 to-orange-900/60",
  },
  music: {
    gradient: "from-purple-950 via-violet-950 to-indigo-950",
    accent: "hsl(290 85% 60%)",
    particles: ["🎵", "🎶", "🎸", "🎹", "🎤"],
    overlay: "bg-gradient-to-br from-purple-900/40 to-violet-900/60",
  },
  tech: {
    gradient: "from-slate-950 via-zinc-900 to-gray-950",
    accent: "hsl(220 100% 60%)",
    particles: ["💻", "⚙️", "🔧", "🖥️", "🤖"],
    overlay: "bg-gradient-to-br from-slate-900/40 to-zinc-900/60",
  },
  ocean: {
    gradient: "from-blue-950 via-cyan-950 to-teal-950",
    accent: "hsl(200 100% 55%)",
    particles: ["🌊", "🐠", "🐙", "🦈", "🌺"],
    overlay: "bg-gradient-to-br from-blue-900/40 to-cyan-900/60",
  },
  fire: {
    gradient: "from-orange-950 via-red-950 to-yellow-950",
    accent: "hsl(25 100% 55%)",
    particles: ["🔥", "💥", "⚡", "🌋", "✨"],
    overlay: "bg-gradient-to-br from-orange-900/40 to-red-900/60",
  },
  ice: {
    gradient: "from-sky-950 via-blue-950 to-indigo-950",
    accent: "hsl(200 100% 70%)",
    particles: ["❄️", "🌨️", "💙", "🔵", "🌟"],
    overlay: "bg-gradient-to-br from-sky-900/40 to-blue-900/60",
  },
};

const ThemedBackground: React.FC<ThemedBackgroundProps> = ({ theme }) => {
  const t = themes[theme];
  const emojis = React.useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: t.particles[i % t.particles.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4,
      size: 10 + Math.random() * 14,
    })),
    [theme]
  );

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient} opacity-60`} />
      {/* App base */}
      <div className="absolute inset-0 bg-background/70" />
      {/* Floating emojis */}
      {emojis.map((p) => (
        <div
          key={p.id}
          className="absolute select-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            opacity: 0.15,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        >
          {p.emoji}
        </div>
      ))}
      {/* Radial accent glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${t.accent}22 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, ${t.accent}15 0%, transparent 50%)`,
        }}
      />
    </div>
  );
};

export default ThemedBackground;
export { themes };
