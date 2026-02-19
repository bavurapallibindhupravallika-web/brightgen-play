import { useState } from "react";
import { Video, Loader2, X, Download, Maximize, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VideoResult {
  id: number;
  url: string;
  image: string;
  duration: number;
  user: string;
}

interface VideoPlayerSectionProps {
  topic: string;
  language: string;
  type: string;
}

const VIDEO_SEARCH_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/video-search`;

const VideoPlayerSection = ({ topic, language, type }: VideoPlayerSectionProps) => {
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoResult | null>(null);

  const searchVideos = async () => {
    if (!topic.trim()) {
      toast.error("Enter a topic first");
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch(VIDEO_SEARCH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ topic, language, type }),
      });
      if (!resp.ok) throw new Error("Failed to fetch videos");
      const data = await resp.json();
      setVideos(data.videos || []);
      if (!data.videos?.length) toast.info("No videos found for this topic");
    } catch (e: any) {
      toast.error(e.message || "Failed to load videos");
    }
    setLoading(false);
  };

  const downloadVideo = async (video: VideoResult) => {
    try {
      toast.info("Downloading video...");
      const resp = await fetch(video.url);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `studyflix-${topic}-${video.id}.mp4`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Video downloaded!");
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={searchVideos}
        disabled={loading}
        variant="outline"
        className="w-full h-11 text-xs border-border/50 text-muted-foreground hover:text-foreground font-bold"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Video className="w-4 h-4 mr-2" />}
        🎥 Generate Video
      </Button>

      {/* Active video player */}
      {activeVideo && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="relative">
            <video
              src={activeVideo.url}
              controls
              autoPlay
              className="w-full aspect-video bg-black"
              controlsList="nodownload"
            />
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-2 right-2 glass rounded-full p-1.5 text-foreground hover:bg-destructive/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-3 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">By {activeVideo.user} · {activeVideo.duration}s</p>
            <Button
              onClick={() => downloadVideo(activeVideo)}
              size="sm"
              variant="outline"
              className="h-8 text-xs border-border/50"
            >
              <Download className="w-3 h-3 mr-1" /> Download
            </Button>
          </div>
        </div>
      )}

      {/* Video grid */}
      {videos.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {videos.map((video) => (
            <button
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className={`glass rounded-xl overflow-hidden text-left group transition-all hover:scale-[1.02] ${activeVideo?.id === video.id ? "ring-2 ring-primary" : ""}`}
            >
              <div className="relative aspect-video">
                <img src={video.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-8 h-8 text-foreground" />
                </div>
                <span className="absolute bottom-1 right-1 text-[10px] bg-black/60 text-foreground px-1.5 py-0.5 rounded font-bold">
                  {video.duration}s
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground p-2 truncate">By {video.user}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoPlayerSection;
