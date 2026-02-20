import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemedBackground from "@/components/ThemedBackground";
import BottomNav from "@/components/BottomNav";
import type { BgTheme } from "@/components/GameHomeShell";
import { toast } from "sonner";

interface GameOnlineShellProps {
  gameName: string;
  gameSlug: string;
  theme: BgTheme;
}

const GameOnlineShell = ({ gameName, gameSlug, theme }: GameOnlineShellProps) => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [createdRoom, setCreatedRoom] = useState("");

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCreatedRoom(code);
    toast.success(`Room ${code} created! Share with friends.`);
  };

  const joinRoom = () => {
    if (!joinCode.trim()) { toast.error("Enter a room code"); return; }
    toast.success(`Joining room ${joinCode.toUpperCase()}...`);
  };

  return (
    <div className="relative min-h-screen pb-24">
      <ThemedBackground theme={theme} />
      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-6">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(`/games/${gameSlug}/home`)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">{gameName}</span>
        </motion.button>

        <h1 className="text-2xl font-black text-foreground mb-2">🌐 Online Play</h1>
        <p className="text-muted-foreground text-sm mb-6">Play {gameName} with friends in real-time</p>

        <div className="space-y-4">
          {/* Create Room */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏠</span>
              <div>
                <p className="text-foreground font-bold">Create Room</p>
                <p className="text-muted-foreground text-xs">Host a game for friends</p>
              </div>
            </div>
            {createdRoom && (
              <div className="bg-primary/20 rounded-xl p-3 flex items-center justify-between">
                <p className="text-primary font-black text-xl tracking-widest">{createdRoom}</p>
                <button onClick={() => { navigator.clipboard.writeText(createdRoom); toast.success("Copied!"); }}
                  className="glass rounded-lg p-2">
                  <Copy className="w-4 h-4 text-foreground" />
                </button>
              </div>
            )}
            <Button onClick={createRoom} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-glow">
              {createdRoom ? "New Room" : "Create Room"}
            </Button>
          </motion.div>

          {/* Join Room */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚪</span>
              <div>
                <p className="text-foreground font-bold">Join Room</p>
                <p className="text-muted-foreground text-xs">Enter a friend's room code</p>
              </div>
            </div>
            <Input
              placeholder="Enter room code..."
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="bg-muted/50 border-border/50 h-12 text-foreground uppercase tracking-widest font-bold text-center text-lg"
            />
            <Button onClick={joinRoom} variant="outline" className="w-full border-border/50 text-foreground font-bold">
              <Users className="w-4 h-4 mr-2" />
              Join Room
            </Button>
          </motion.div>

          {/* Online Players */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <p className="text-muted-foreground text-sm"><span className="text-foreground font-bold">1,247</span> players online now</p>
          </motion.div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default GameOnlineShell;
