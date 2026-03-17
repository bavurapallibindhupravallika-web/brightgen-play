import { useState } from "react";
import { Clapperboard, Loader2, Download, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AIVideoGeneratorProps {
  topic: string;
}

const AIVideoGenerator = ({ topic }: AIVideoGeneratorProps) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateVideo = async () => {
    if (!topic.trim()) {
      toast.error("Enter a topic first");
      return;
    }
    setLoading(true);
    setVideoUrl(null);

    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-video`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ topic }),
          }
        );

        if (resp.status === 503) {
          toast.info(`Model is loading... retrying (${attempt}/${maxRetries})`);
          await new Promise((r) => setTimeout(r, 30000));
          continue;
        }

        if (!resp.ok) {
          const err = await resp.json();
          throw new Error(err.error || "Video generation failed");
        }

        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        toast.success("Video generated!");
        setLoading(false);
        return;
      } catch (e: any) {
        if (attempt === maxRetries) {
          toast.error(e.message || "Failed to generate video");
        }
      }
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `studyflix-${topic.replace(/\s+/g, "-")}.mp4`;
    a.click();
    toast.success("Video downloaded!");
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={generateVideo}
        disabled={loading}
        className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Clapperboard className="w-4 h-4 mr-2" />
        )}
        🎬 Generate AI Video
      </Button>

      {loading && (
        <div className="glass rounded-2xl p-8 text-center space-y-4">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
            <Clapperboard className="absolute inset-0 m-auto w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-foreground font-bold text-sm">
              StudyFlix is directing your movie...
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              This may take 1-3 minutes. Model may need to warm up.
            </p>
          </div>
        </div>
      )}

      {videoUrl && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="relative">
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full aspect-video bg-black rounded-t-2xl"
            />
            <button
              onClick={() => {
                URL.revokeObjectURL(videoUrl);
                setVideoUrl(null);
              }}
              className="absolute top-2 right-2 glass rounded-full p-1.5 text-foreground hover:bg-destructive/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-3 flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-semibold">
              🎬 AI Generated · {topic}
            </p>
            <Button
              onClick={handleDownload}
              size="sm"
              variant="outline"
              className="h-8 text-xs border-border/50"
            >
              <Download className="w-3 h-3 mr-1" /> Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIVideoGenerator;
