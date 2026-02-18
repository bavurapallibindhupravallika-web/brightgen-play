import { useState, useEffect } from "react";
import { Trophy, Medal, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const rankColors = ["text-yellow-400", "text-slate-300", "text-amber-600"];

const Leaderboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("user_id, username, points, streak, level")
        .order("points", { ascending: false })
        .limit(50);

      setUsers(
        (data || []).map((u, i) => ({
          ...u,
          rank: i + 1,
          isMe: u.user_id === user?.id,
          displayName: u.username || `Student #${i + 1}`,
        }))
      );
      setLoading(false);
    };
    fetchLeaderboard();
  }, [user]);

  return (
    <PageShell title="Leaderboard" subtitle="Top learners this week" icon={<Trophy className="w-7 h-7 text-foreground" />} gradientClass="from-yellow-500 to-orange-500">
      <div className="space-y-3">
        {loading ? (
          <div className="glass rounded-2xl p-8 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          </div>
        ) : users.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-muted-foreground text-sm">No learners yet. Be the first!</p>
          </div>
        ) : (
          users.map((u, i) => (
            <motion.div key={u.user_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className={`glass rounded-2xl p-4 flex items-center gap-4 ${u.isMe ? "neon-glow border border-primary/30" : ""}`}>
              <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center font-bold text-foreground">
                {u.rank <= 3 ? <Medal className={`w-5 h-5 ${rankColors[u.rank - 1]}`} /> : <span className="text-sm">{u.rank}</span>}
              </div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${u.isMe ? "text-primary" : "text-foreground"}`}>
                  {u.isMe ? `${u.displayName} (You)` : u.displayName}
                </p>
                <p className="text-muted-foreground text-[10px]">Level {u.level} · 🔥 {u.streak} streak</p>
              </div>
              <span className="text-muted-foreground text-sm font-semibold">{u.points} pts</span>
            </motion.div>
          ))
        )}
      </div>
    </PageShell>
  );
};

export default Leaderboard;
