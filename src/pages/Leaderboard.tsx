import { Trophy, Medal } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";

const users = [
  { name: "Ravi K.", points: 2450, rank: 1 },
  { name: "Priya S.", points: 2180, rank: 2 },
  { name: "Arjun M.", points: 1920, rank: 3 },
  { name: "Sneha R.", points: 1750, rank: 4 },
  { name: "You", points: 120, rank: 15 },
];

const rankColors = ["text-yellow-400", "text-slate-300", "text-amber-600"];

const Leaderboard = () => (
  <PageShell title="Leaderboard" subtitle="Top learners this week" icon={<Trophy className="w-7 h-7 text-foreground" />} gradientClass="from-yellow-500 to-orange-500">
    <div className="space-y-3">
      {users.map((user, i) => (
        <motion.div key={user.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
          className={`glass rounded-2xl p-4 flex items-center gap-4 ${user.name === "You" ? "neon-glow" : ""}`}>
          <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center font-bold text-foreground">
            {user.rank <= 3 ? <Medal className={`w-5 h-5 ${rankColors[user.rank - 1]}`} /> : <span className="text-sm">{user.rank}</span>}
          </div>
          <div className="flex-1">
            <p className={`font-bold text-sm ${user.name === "You" ? "text-primary" : "text-foreground"}`}>{user.name}</p>
          </div>
          <span className="text-muted-foreground text-sm font-semibold">{user.points} pts</span>
        </motion.div>
      ))}
    </div>
  </PageShell>
);

export default Leaderboard;
