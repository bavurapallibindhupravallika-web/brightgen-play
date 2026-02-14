import { Brain, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import PageShell from "@/components/PageShell";

const Quiz = () => {
  const [topic, setTopic] = useState("");

  return (
    <PageShell title="Quiz Challenge" subtitle="Test your knowledge on any topic" icon={<Brain className="w-7 h-7 text-foreground" />} gradientClass="from-yellow-500 to-amber-500">
      <div className="space-y-4">
        <div className="glass rounded-2xl p-6 space-y-4">
          <Input placeholder="Enter study topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="bg-muted/50 border-border/50 h-12 text-foreground placeholder:text-muted-foreground" />
          <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-glow">
            <Play className="w-4 h-4 mr-2" /> Start Quiz
          </Button>
        </div>
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-muted-foreground text-sm">Quiz questions will appear here</p>
        </div>
      </div>
    </PageShell>
  );
};

export default Quiz;
