import { motion } from "framer-motion";

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 4,
}));

const FloatingParticles = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {particles.map((p) => (
      <motion.div
        key={p.id}
        className="absolute rounded-full bg-neon-purple/30"
        style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: p.duration,
          delay: p.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export default FloatingParticles;
