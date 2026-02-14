import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import FloatingParticles from "./FloatingParticles";

interface PageShellProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  gradientClass: string;
  children: React.ReactNode;
}

const PageShell = ({ title, subtitle, icon, gradientClass, children }: PageShellProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen pb-8">
      <FloatingParticles />

      {/* Top gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-48 bg-gradient-to-b ${gradientClass} opacity-20`} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-6">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Back</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">{title}</h1>
            {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default PageShell;
