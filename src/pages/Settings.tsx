import { useState } from "react";
import { Settings as SettingsIcon, User, Crown, HelpCircle, LogOut, MessageSquare, Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import IllustratedBackground from "@/components/IllustratedBackground";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [showHelp, setShowHelp] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const items = [
    { name: "Profile", icon: User, desc: "View your profile & stats", action: () => navigate("/profile"), emoji: "👤" },
    { name: "VIP Upgrade", icon: Crown, desc: "Unlock premium features", action: () => navigate("/vip"), emoji: "👑" },
    { name: "Help & FAQ", icon: HelpCircle, desc: "Common questions answered", action: () => setShowHelp(!showHelp), emoji: "❓" },
    { name: "Feedback", icon: MessageSquare, desc: "Send us your thoughts", action: () => setShowFeedback(!showFeedback), emoji: "💬" },
    { name: "Contact Support", icon: Mail, desc: "Email our team", action: () => { window.open("mailto:support@studyflix.app", "_blank"); toast.success("Opening email client..."); }, emoji: "📧" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) { toast.error("Please write your feedback"); return; }
    toast.success("Thank you for your feedback! We'll review it soon.");
    setFeedbackText("");
    setShowFeedback(false);
  };

  return (
    <div className="relative min-h-screen pb-24">
      <IllustratedBackground scene="minimal" />
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-black text-foreground">Settings ⚙️</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your account</p>
        </motion.div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.button key={item.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              onClick={item.action} className="w-full bg-card/40 backdrop-blur-xl rounded-3xl p-4 flex items-center gap-4 text-left hover:bg-card/60 transition-colors border border-border/20 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-xl">{item.emoji}</span>
              </div>
              <div>
                <h3 className="text-foreground font-semibold text-sm">{item.name}</h3>
                <p className="text-muted-foreground text-xs">{item.desc}</p>
              </div>
            </motion.button>
          ))}

          {showHelp && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-card/40 backdrop-blur-xl rounded-3xl p-5 space-y-3 border border-border/20">
              <h3 className="text-foreground font-bold text-sm">❓ Frequently Asked Questions</h3>
              {[
                { q: "How do I generate content?", a: "Go to Movies, Songs, or Animated pages. Select a language, topic, and click Generate." },
                { q: "What is the daily limit?", a: "Free users get 10 generations per day. VIP users have unlimited access." },
                { q: "How do I save content?", a: "After generating a script/lyrics, click the Save button. Find saved content in the Saved page." },
                { q: "How do games work?", a: "Each game has unlimited levels. Complete a level to unlock the next." },
                { q: "How do I become VIP?", a: "Go to VIP Upgrade page. Plans start at ₹299 for 2 months." },
              ].map((faq, i) => (
                <div key={i} className="bg-muted/30 rounded-2xl p-3">
                  <p className="text-foreground text-xs font-bold">{faq.q}</p>
                  <p className="text-muted-foreground text-xs mt-1">{faq.a}</p>
                </div>
              ))}
            </motion.div>
          )}

          {showFeedback && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-card/40 backdrop-blur-xl rounded-3xl p-5 space-y-3 border border-border/20">
              <h3 className="text-foreground font-bold text-sm">📝 Send Feedback</h3>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                className="w-full bg-muted/50 border border-border/50 rounded-2xl px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
                placeholder="Tell us what you think about StudyFlix..."
              />
              <Button onClick={handleSendFeedback} className="w-full rounded-2xl">
                Send Feedback
              </Button>
            </motion.div>
          )}

          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            onClick={handleLogout} className="w-full bg-destructive/10 backdrop-blur-xl rounded-3xl p-4 flex items-center gap-4 text-left hover:bg-destructive/20 transition-colors border border-destructive/20 mt-6">
            <div className="w-11 h-11 rounded-2xl bg-destructive/20 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <h3 className="text-destructive font-semibold text-sm">Logout</h3>
          </motion.button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Settings;
