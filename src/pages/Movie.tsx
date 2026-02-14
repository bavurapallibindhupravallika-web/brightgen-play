import { useState } from "react";
import { Film, Upload, Sparkles, Download, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/PageShell";

const Movie = () => {
  const [movieName, setMovieName] = useState("");
  const [topic, setTopic] = useState("");

  return (
    <PageShell title="Create Movie" subtitle="Turn any topic into a cinematic experience" icon={<Film className="w-7 h-7 text-foreground" />} gradientClass="from-red-500 to-orange-500">
      <div className="space-y-4">
        <div className="glass rounded-2xl p-6 space-y-4">
          <Input placeholder="Movie Name" value={movieName} onChange={(e) => setMovieName(e.target.value)} className="bg-muted/50 border-border/50 h-12 text-foreground placeholder:text-muted-foreground" />
          <Input placeholder="Study Topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="bg-muted/50 border-border/50 h-12 text-foreground placeholder:text-muted-foreground" />
          
          <button className="w-full glass rounded-xl p-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border border-dashed border-border/50">
            <Upload className="w-5 h-5" />
            <span className="text-sm font-semibold">Upload PDFs or Images</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-glow">
            <Sparkles className="w-4 h-4 mr-2" /> Generate Script
          </Button>
          <Button className="h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold">
            <Film className="w-4 h-4 mr-2" /> Generate Video
          </Button>
        </div>

        {/* Video Player Placeholder */}
        <div className="glass rounded-2xl aspect-video flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Video will appear here</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" className="h-10 text-xs border-border/50 text-muted-foreground hover:text-foreground">
            <Download className="w-3 h-3 mr-1" /> Download
          </Button>
          <Button variant="outline" className="h-10 text-xs border-border/50 text-muted-foreground hover:text-foreground">
            View Script
          </Button>
          <Button variant="outline" className="h-10 text-xs border-border/50 text-muted-foreground hover:text-foreground">
            <HelpCircle className="w-3 h-3 mr-1" /> Doubt
          </Button>
        </div>
      </div>
    </PageShell>
  );
};

export default Movie;
