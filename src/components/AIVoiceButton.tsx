import { useState, useRef } from "react";
import { Volume2, VolumeX, Loader2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AIVoiceButtonProps {
  text: string;
  language?: string;
}

const langMap: Record<string, string> = {
  English: "en-US",
  Telugu: "te-IN",
  Hindi: "hi-IN",
  Tamil: "ta-IN",
  Kannada: "kn-IN",
  Bengali: "bn-IN",
};

const AIVoiceButton = ({ text, language = "English" }: AIVoiceButtonProps) => {
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = () => {
    if (!text.trim()) {
      toast.error("No text to read");
      return;
    }

    if (!("speechSynthesis" in window)) {
      toast.error("Voice not supported in your browser");
      return;
    }

    setLoading(true);

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langMap[language] || "en-US";
    utter.rate = 0.95;
    utter.pitch = 1.0;
    utter.volume = 1;

    // Try to pick a matching voice
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(
      (v) => v.lang.startsWith(utter.lang.split("-")[0]) || v.lang === utter.lang
    );
    if (match) utter.voice = match;

    utter.onstart = () => {
      setLoading(false);
      setSpeaking(true);
    };
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => {
      setSpeaking(false);
      setLoading(false);
      toast.error("Voice playback failed");
    };

    utteranceRef.current = utter;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setLoading(false);
  };

  if (speaking) {
    return (
      <Button onClick={stop} className="w-full h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold gap-2">
        <Square className="w-4 h-4 fill-current" />
        Stop Voice
      </Button>
    );
  }

  return (
    <Button
      onClick={speak}
      disabled={loading || !text}
      className="w-full h-12 font-bold gap-2"
      style={{
        background: "linear-gradient(135deg, hsl(265 85% 55%), hsl(185 100% 45%))",
        boxShadow: "0 0 20px hsl(265 85% 60% / 0.4)",
      }}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
      {loading ? "Preparing Voice..." : `🎙️ Play AI Voice (${language})`}
    </Button>
  );
};

export default AIVoiceButton;
