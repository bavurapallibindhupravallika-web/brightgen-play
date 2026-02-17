import { Info } from "lucide-react";

const InstructionsBlock = ({ type }: { type: "movie" | "song" | "animated" }) => {
  const mediaLabel = type === "song" ? "listen to the audio" : "watch the video";
  const contentLabel = type === "song" ? "lyrics" : "script / story";

  return (
    <div className="glass rounded-2xl p-5 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-4 h-4 text-primary" />
        <h3 className="text-foreground font-bold text-sm">How to Use This Page</h3>
      </div>
      <ol className="text-muted-foreground text-xs space-y-1 list-decimal list-inside">
        <li>Select your preferred language from the options.</li>
        <li>Select your {type} type and enter a study topic.</li>
        <li>Click Generate to create your {contentLabel}.</li>
        <li>View the {contentLabel} below the generator.</li>
        <li>Use Quiz Test or Written Test to test your knowledge.</li>
        <li>Click <strong>Save</strong> to access offline later.</li>
        <li>Click <strong>Doubts</strong> (bottom-right) to ask questions via AI.</li>
        <li>Free users can generate <strong>10 items/day</strong>. VIP users have <strong>unlimited access</strong>.</li>
      </ol>
    </div>
  );
};

export default InstructionsBlock;
