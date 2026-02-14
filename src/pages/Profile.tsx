import { User, Star, Flame, Crown } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";

const Profile = () => (
  <PageShell title="Profile" subtitle="Your learning dashboard" icon={<User className="w-7 h-7 text-foreground" />} gradientClass="from-indigo-500 to-purple-500">
    <div className="space-y-4">
      {/* Avatar */}
      <div className="glass rounded-2xl p-8 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4 neon-glow">
          <User className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-foreground font-bold text-xl">Student</h2>
        <p className="text-muted-foreground text-sm">student@studyflix.com</p>
        <div className="flex items-center gap-1 mt-2">
          <Crown className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-semibold text-yellow-400">Free Plan</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Points", value: "120", icon: Star, color: "text-yellow-400" },
          { label: "Streak", value: "5 days", icon: Flame, color: "text-orange-400" },
          { label: "Level", value: "3", icon: Crown, color: "text-purple-400" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-4 text-center">
            <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
            <p className="text-foreground font-bold">{stat.value}</p>
            <p className="text-muted-foreground text-xs">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </PageShell>
);

export default Profile;
