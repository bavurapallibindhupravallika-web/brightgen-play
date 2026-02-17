import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FloatingParticles from "@/components/FloatingParticles";
import heroLogin from "@/assets/hero-login.jpg";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", username: "" });

  // Redirect if already logged in
  if (user) {
    navigate("/home", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (isRegister && form.password !== form.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      if (isRegister) {
        await signUp(form.email, form.password);
        toast.success("Account created! Check your email to verify, then log in.");
        setIsRegister(false);
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
          <h2 className="text-xl font-bold text-foreground mb-6 text-center">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
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
            {isRegister && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="bg-muted/50 border-border/50 pl-10 h-12 text-foreground placeholder:text-muted-foreground" />
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full h-12 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isRegister ? "Create Account" : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-muted-foreground text-sm">{isRegister ? "Already have an account?" : "Don't have an account?"}</span>
            <button onClick={() => setIsRegister(!isRegister)} className="text-primary font-semibold ml-2 text-sm hover:underline">
              {isRegister ? "Login" : "Register"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
