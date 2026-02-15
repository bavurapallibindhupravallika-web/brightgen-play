import { useState } from "react";
import { Globe, BookOpen, MessageSquare, Brain, PenLine, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import DoubtButton from "@/components/DoubtButton";

const languages = [
  "English", "Telugu", "Hindi", "Tamil", "Kannada", "Malayalam", "Marathi", "Bengali",
  "Gujarati", "Punjabi", "Spanish", "French", "German", "Japanese", "Korean", "Chinese"
];

const activities = [
  { name: "Learn", icon: BookOpen, desc: "Vocabulary & grammar lessons", path: "learn" },
  { name: "Practice", icon: MessageSquare, desc: "Interactive exercises", path: "practice" },
  { name: "Quiz Test", icon: Brain, desc: "MCQ quiz with scoring", path: "quiz" },
  { name: "Written Test", icon: PenLine, desc: "Type answers, AI checks", path: "written" },
];

const Languages = () => {
  const [selected, setSelected] = useState("English");
  const navigate = useNavigate();

  return (
    <PageShell title="Language Practice" subtitle="Daily practice in 16 languages" icon={<Globe className="w-7 h-7 text-foreground" />} gradientClass="from-blue-500 to-indigo-500">
      <div className="space-y-4">
        <div className="glass rounded-2xl p-4">
          <h3 className="text-foreground font-bold text-sm mb-3">Select Language</h3>
          <div className="grid grid-cols-4 gap-2">
            {languages.map((lang) => (
              <button key={lang} onClick={() => setSelected(lang)}
                className={`text-[10px] font-semibold py-2 px-1 rounded-lg transition-all ${selected === lang ? "bg-primary text-primary-foreground neon-glow" : "glass text-muted-foreground hover:text-foreground"}`}>
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {activities.map((act, i) => (
            <motion.button
              key={act.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/languages/${act.path}?lang=${encodeURIComponent(selected)}`)}
              className="w-full glass rounded-2xl p-5 flex items-center gap-4 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <act.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-foreground font-bold text-sm">{act.name}</h3>
                <p className="text-muted-foreground text-xs">{act.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default Languages;
