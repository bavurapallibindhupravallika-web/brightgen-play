import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, Phone, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FloatingParticles from "@/components/FloatingParticles";
import heroLogin from "@/assets/hero-login.jpg";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type AuthMode = "login" | "register" | "phone";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithOtp, verifyOtp, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", username: "", phone: "", otp: "" });

  if (user) {
    navigate("/home", { replace: true });
    return null;
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (mode === "register" && form.password !== form.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      if (mode === "register") {
        await signUp(form.email, form.password);
        toast.success("Account created! Check your email to verify, then log in.");
        setMode("login");
      } else {
        await signIn(form.email, form.password);
        toast.success("Welcome to StudyFlix!");
        navigate("/home");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    }
    setLoading(false);
  };

  const handleSendOtp = async () => {
    if (!form.phone) {
      toast.error("Enter your phone number");
      return;
    }
    setLoading(true);
    try {
      await signInWithOtp(form.phone);
      setOtpSent(true);
      toast.success("OTP sent to your phone!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.otp) {
      toast.error("Enter the OTP");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(form.phone, form.otp);
      toast.success("Welcome to StudyFlix!");
      navigate("/home");
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroLogin} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>
      <FloatingParticles />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-md mx-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center mb-8">
          <h1 className="text-5xl font-black gradient-text mb-2">StudyFlix</h1>
          <p className="text-muted-foreground text-sm">Learn through Movies, Songs, Animations, Games & AI</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-strong rounded-2xl p-8 neon-glow">
          {/* Mode Tabs */}
          <div className="flex gap-1 mb-6 glass rounded-xl p-1">
            {([["login", "Email Login"], ["phone", "Phone OTP"], ["register", "Register"]] as [AuthMode, string][]).map(([m, label]) => (
              <button
                key={m}
                onClick={() => { setMode(m); setOtpSent(false); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === "phone" ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="+91 Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  disabled={otpSent}
                  className="bg-muted/50 border-border/50 pl-10 h-12 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              {!otpSent ? (
                <Button type="button" onClick={handleSendOtp} disabled={loading} className="w-full h-12 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send OTP"}
                </Button>
              ) : (
                <>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={form.otp}
                      onChange={(e) => setForm({ ...form, otp: e.target.value })}
                      maxLength={6}
                      className="bg-muted/50 border-border/50 pl-10 h-12 text-foreground placeholder:text-muted-foreground text-center tracking-[0.5em] font-bold"
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-12 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify OTP"}
                  </Button>
                  <button type="button" onClick={() => setOtpSent(false)} className="w-full text-xs text-muted-foreground hover:text-foreground">
                    Change number
                  </button>
                </>
              )}
            </form>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {mode === "register" && (
                <Input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="bg-muted/50 border-border/50 h-12 text-foreground placeholder:text-muted-foreground" />
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-muted/50 border-border/50 pl-10 h-12 text-foreground placeholder:text-muted-foreground" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="bg-muted/50 border-border/50 pl-10 pr-10 h-12 text-foreground placeholder:text-muted-foreground" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === "register" && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="bg-muted/50 border-border/50 pl-10 h-12 text-foreground placeholder:text-muted-foreground" />
                </div>
              )}
              <Button type="submit" disabled={loading} className="w-full h-12 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === "register" ? "Create Account" : "Login"}
              </Button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
