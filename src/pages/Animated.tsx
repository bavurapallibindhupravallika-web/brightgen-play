import { useState } from "react";
import { Palette, Sparkles, Download, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/PageShell";

const storyTypes = ["Love", "Kids", "Friendship", "Motivational", "Fantasy", "Adventure", "Emotional", "Action"];

const Animated = () => {
  const [storyType, setStoryType] = useState("Love");
  const [topic, setTopic] = useState("");

  return (
    <PageShell title="Animated Story" subtitle="Create engaging animated stories" icon={<Palette className="w-7 h-7 text-foreground" />} gradientClass="from-cyan-500 to-blue-500">
      <div className="space-y-4">
        <div className="glass rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Story Type</label>
            <div className="grid grid-cols-4 gap-2">
              {storyTypes.map((type) => (
                <button key={type} onClick={() => setStoryType(type)}
                  className={`text-xs font-semibold py-2 px-3 rounded-lg transition-all ${storyType === type ? "bg-primary text-primary-foreground neon-glow" : "glass text-muted-foreground hover:text-foreground"}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>
          <Input placeholder="Study Topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="bg-muted/50 border-border/50 h-12 text-foreground placeholder:text-muted-foreground" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-glow"><Sparkles className="w-4 h-4 mr-2" /> Generate Script</Button>
          <Button className="h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold"><Palette className="w-4 h-4 mr-2" /> Generate Video</Button>
        </div>
        <div className="glass rounded-2xl aspect-video flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Animated video will appear here</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" className="h-10 text-xs border-border/50 text-muted-foreground hover:text-foreground"><Download className="w-3 h-3 mr-1" /> Download</Button>
          <Button variant="outline" className="h-10 text-xs border-border/50 text-muted-foreground hover:text-foreground">Script</Button>
          <Button variant="outline" className="h-10 text-xs border-border/50 text-muted-foreground hover:text-foreground"><HelpCircle className="w-3 h-3 mr-1" /> Doubt</Button>
        </div>
      </div>
    </PageShell>
  );
};

export default Animated;
