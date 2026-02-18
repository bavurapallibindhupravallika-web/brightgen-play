import { useState } from "react";
import { Settings as SettingsIcon, User, Crown, HelpCircle, LogOut, MessageSquare, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
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
    { name: "Profile", icon: User, desc: "View your profile & stats", action: () => navigate("/profile") },
    { name: "VIP Upgrade", icon: Crown, desc: "Unlock premium features", action: () => navigate("/vip") },
    { name: "Help & FAQ", icon: HelpCircle, desc: "Common questions answered", action: () => setShowHelp(!showHelp) },
    { name: "Feedback", icon: MessageSquare, desc: "Send us your thoughts", action: () => setShowFeedback(!showFeedback) },
    { name: "Contact Support", icon: Mail, desc: "Email our team", action: () => { window.open("mailto:support@studyflix.app", "_blank"); toast.success("Opening email client..."); } },
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
    <PageShell title="Settings" subtitle="Manage your account" icon={<SettingsIcon className="w-7 h-7 text-foreground" />} gradientClass="from-slate-400 to-slate-600">
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.button key={item.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            onClick={item.action} className="w-full glass rounded-2xl p-4 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center"><item.icon className="w-5 h-5 text-muted-foreground" /></div>
            <div>
              <h3 className="text-foreground font-semibold text-sm">{item.name}</h3>
              <p className="text-muted-foreground text-xs">{item.desc}</p>
            </div>
          </motion.button>
        ))}

        {showHelp && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass rounded-2xl p-5 space-y-3">
            <h3 className="text-foreground font-bold text-sm">❓ Frequently Asked Questions</h3>
            {[
              { q: "How do I generate content?", a: "Go to Movies, Songs, or Animated pages. Select a language, topic, and click Generate." },
              { q: "What is the daily limit?", a: "Free users get 10 generations per day. VIP users have unlimited access." },
              { q: "How do I save content?", a: "After generating a script/lyrics, click the Save button. Find saved content in the Saved page." },
              { q: "How do games work?", a: "Each game has unlimited levels. Complete a level to unlock the next. AI generates fresh challenges every time." },
              { q: "How do I become VIP?", a: "Go to VIP Upgrade page. Plans start at ₹299 for 2 months." },
            ].map((faq, i) => (
              <div key={i} className="bg-muted/30 rounded-xl p-3">
                <p className="text-foreground text-xs font-bold">{faq.q}</p>
                <p className="text-muted-foreground text-xs mt-1">{faq.a}</p>
              </div>
            ))}
          </motion.div>
        )}

        {showFeedback && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass rounded-2xl p-5 space-y-3">
            <h3 className="text-foreground font-bold text-sm">📝 Send Feedback</h3>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
              className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
              placeholder="Tell us what you think about StudyFlix..."
            />
            <Button onClick={handleSendFeedback} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              Send Feedback
            </Button>
          </motion.div>
        )}

        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          onClick={handleLogout} className="w-full glass rounded-2xl p-4 flex items-center gap-4 text-left hover:bg-destructive/10 transition-colors mt-6">
          <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center"><LogOut className="w-5 h-5 text-destructive" /></div>
          <h3 className="text-destructive font-semibold text-sm">Logout</h3>
        </motion.button>
      </div>
    </PageShell>
  );
};

export default Settings;
