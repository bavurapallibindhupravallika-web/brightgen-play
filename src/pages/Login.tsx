import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FloatingParticles from "@/components/FloatingParticles";
import heroLogin from "@/assets/hero-login.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ phone: "", email: "", password: "", confirmPassword: "", username: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroLogin} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      <FloatingParticles />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-black gradient-text mb-2">StudyFlix</h1>
          <p className="text-muted-foreground text-sm">
            Learn through Movies, Songs, Animations, Games & AI
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass-strong rounded-2xl p-8 neon-glow"
        >
          <h2 className="text-xl font-bold text-foreground mb-6 text-center">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="relative">
                <Input
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="bg-muted/50 border-border/50 pl-4 h-12 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            )}

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-muted/50 border-border/50 pl-10 h-12 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-muted/50 border-border/50 pl-10 h-12 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="bg-muted/50 border-border/50 pl-10 pr-10 h-12 text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {isRegister && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="bg-muted/50 border-border/50 pl-10 h-12 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground neon-glow transition-all duration-300 hover:scale-[1.02]"
            >
              {isRegister ? "Create Account" : "Login"}
            </Button>
          </form>

          {!isRegister && (
            <button className="w-full text-center text-sm text-neon-cyan mt-3 hover:underline">
              Forgot Password?
            </button>
          )}

          <div className="mt-6 text-center">
            <span className="text-muted-foreground text-sm">
              {isRegister ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary font-semibold ml-2 text-sm hover:underline"
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
