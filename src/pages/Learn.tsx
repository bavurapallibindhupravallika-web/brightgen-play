import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Globe, Code, Brain, ChevronRight, Sparkles } from "lucide-react";
import PageShell from "@/components/PageShell";

const sections = [
  {
    name: "Learning Topics",
    desc: "AI-powered lessons on any subject",
    icon: BookOpen,
    emoji: "📚",
    gradient: "from-violet-500 to-purple-500",
    path: "/learning-topics",
  },
  {
    name: "Language Practice",
    desc: "Learn 6 languages like Duolingo",
    icon: Globe,
    emoji: "🌐",
    gradient: "from-blue-500 to-indigo-500",
    path: "/languages",
  },
  {
    name: "Programming",
    desc: "Python, Java, HTML, CSS, JS",
    icon: Code,
    emoji: "💻",
    gradient: "from-emerald-500 to-cyan-500",
    path: "/programming",
  },
  {
    name: "AI Teacher",
    desc: "Your personal AI study assistant",
    icon: Sparkles,
    emoji: "🤖",
    gradient: "from-orange-400 to-amber-500",
    path: "/ai-chat",
  },
];

const Learn = () => {
  const navigate = useNavigate();

  return (
    <PageShell
      title="Learn"
      subtitle="Choose your learning path"
      icon={<BookOpen className="w-7 h-7 text-foreground" />}
      gradientClass="from-blue-500 to-indigo-600"
    >
      <div className="space-y-4">
        {sections.map((s, i) => (
          <motion.button
            key={s.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(s.path)}
            className="w-full relative rounded-2xl p-5 flex items-center gap-4 text-left group overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${s.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className="absolute inset-0 glass" />
            <div className="relative z-10 flex items-center gap-4 w-full">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                <span className="text-2xl">{s.emoji}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-foreground font-bold text-base">{s.name}</h3>
                <p className="text-muted-foreground text-xs mt-0.5">{s.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </motion.button>
        ))}

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-4"
        >
          <h3 className="text-foreground font-bold text-sm mb-3">📊 Your Progress</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Topics", value: "—", icon: "📖" },
              { label: "Languages", value: "—", icon: "🌍" },
              { label: "Code", value: "—", icon: "💻" },
            ].map((p) => (
              <div key={p.label} className="bg-muted/30 rounded-xl p-3">
                <span className="text-lg">{p.icon}</span>
                <p className="text-foreground font-bold text-sm mt-1">{p.value}</p>
                <p className="text-muted-foreground text-[10px]">{p.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
};

export default Learn;
