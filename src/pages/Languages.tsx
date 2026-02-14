import { useState } from "react";
import { Globe, BookOpen, MessageSquare, Brain, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";

const languages = [
  "English", "Telugu", "Hindi", "Tamil", "Kannada", "Malayalam", "Marathi", "Bengali",
  "Gujarati", "Punjabi", "Spanish", "French", "German", "Japanese", "Korean", "Chinese"
];

const activities = [
  { name: "Daily Words", icon: BookOpen, desc: "Learn new vocabulary" },
  { name: "Daily Sentences", icon: MessageSquare, desc: "Practice sentence building" },
  { name: "Conversation", icon: MessageSquare, desc: "Chat with AI tutor" },
  { name: "Daily Quiz", icon: Brain, desc: "Test your progress" },
  { name: "Review & Streak", icon: RotateCcw, desc: "Track your learning" },
];

const Languages = () => {
  const [selected, setSelected] = useState("English");

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
              className="w-full glass rounded-2xl p-5 flex items-center gap-4 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <act.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-foreground font-bold text-sm">{act.name}</h3>
                <p className="text-muted-foreground text-xs">{act.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </PageShell>
  );
};

export default Languages;
