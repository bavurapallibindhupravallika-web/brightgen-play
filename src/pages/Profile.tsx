import { User, Star, Flame, Crown, Film, Music, Palette, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import IllustratedBackground from "@/components/IllustratedBackground";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [savedCounts, setSavedCounts] = useState({ movie: 0, song: 0, animated: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchCounts = async () => {
      const { count: mc } = await supabase.from("saved_content").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("content_type", "movie");
      const { count: sc } = await supabase.from("saved_content").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("content_type", "song");
      const { count: ac } = await supabase.from("saved_content").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("content_type", "animated");
      setSavedCounts({ movie: mc || 0, song: sc || 0, animated: ac || 0 });
    };
    fetchCounts();
  }, [user]);

  return (
    <div className="relative min-h-screen pb-24">
      <IllustratedBackground scene="pastel" />
      <div className="relative z-10 max-w-lg mx-auto px-4 pt-6">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Back</span>
        </motion.button>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card/40 backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center border border-border/20 shadow-lg">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4 shadow-lg">
              <User className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-foreground font-bold text-xl">{profile?.username || user?.email?.split("@")[0] || "Student"}</h2>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            <div className="flex items-center gap-1 mt-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-semibold text-yellow-500">{profile?.vip_status === "vip" ? "VIP Plan" : "Free Plan"}</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Points", value: String(profile?.points || 0), icon: Star, color: "from-[hsl(45_80%_50%)] to-[hsl(35_75%_45%)]" },
              { label: "Streak", value: `${profile?.streak || 0} days`, icon: Flame, color: "from-[hsl(20_75%_50%)] to-[hsl(10_70%_45%)]" },
              { label: "Level", value: String(profile?.level || 1), icon: Crown, color: "from-[hsl(270_60%_55%)] to-[hsl(260_55%_50%)]" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="relative rounded-3xl p-4 text-center overflow-hidden shadow-md">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-90`} />
                <div className="absolute inset-0 bg-white/10" />
                <div className="relative z-10">
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-white" />
                  <p className="text-white font-bold">{stat.value}</p>
                  <p className="text-white/70 text-xs">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-card/40 backdrop-blur-xl rounded-3xl p-5 border border-border/20 shadow-lg">
            <h3 className="text-foreground font-bold text-sm mb-3">📚 Saved Content</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Movies", count: savedCounts.movie, icon: Film, emoji: "🎬" },
                { label: "Songs", count: savedCounts.song, icon: Music, emoji: "🎵" },
                { label: "Animated", count: savedCounts.animated, icon: Palette, emoji: "🎨" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <span className="text-2xl">{item.emoji}</span>
                  <p className="text-foreground font-bold text-lg">{item.count}</p>
                  <p className="text-muted-foreground text-[10px]">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
