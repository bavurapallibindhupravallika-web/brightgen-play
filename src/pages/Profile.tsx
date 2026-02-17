import { User, Star, Flame, Crown, Film, Music, Palette } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const Profile = () => {
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
    <PageShell title="Profile" subtitle="Your learning dashboard" icon={<User className="w-7 h-7 text-foreground" />} gradientClass="from-indigo-500 to-purple-500">
      <div className="space-y-4">
        <div className="glass rounded-2xl p-8 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4 neon-glow">
            <User className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-foreground font-bold text-xl">{profile?.username || user?.email?.split("@")[0] || "Student"}</h2>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
          <div className="flex items-center gap-1 mt-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-semibold text-yellow-400">{profile?.vip_status === "vip" ? "VIP Plan" : "Free Plan"}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Points", value: String(profile?.points || 0), icon: Star, color: "text-yellow-400" },
            { label: "Streak", value: `${profile?.streak || 0} days`, icon: Flame, color: "text-orange-400" },
            { label: "Level", value: String(profile?.level || 1), icon: Crown, color: "text-purple-400" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-4 text-center">
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <p className="text-foreground font-bold">{stat.value}</p>
              <p className="text-muted-foreground text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-foreground font-bold text-sm mb-3">📚 Saved Content</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Movies", count: savedCounts.movie, icon: Film, color: "text-red-400" },
              { label: "Songs", count: savedCounts.song, icon: Music, color: "text-pink-400" },
              { label: "Animated", count: savedCounts.animated, icon: Palette, color: "text-cyan-400" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <item.icon className={`w-5 h-5 mx-auto mb-1 ${item.color}`} />
                <p className="text-foreground font-bold text-lg">{item.count}</p>
                <p className="text-muted-foreground text-[10px]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Profile;
