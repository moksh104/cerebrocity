import { motion } from "framer-motion";
import { useMemo } from "react";

const FloatingParticles = ({ count = 10 }: { count?: number }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: 60 + Math.random() * 40,
        size: 1.5 + Math.random() * 2.5,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 3,
        opacity: 0.2 + Math.random() * 0.5,
      })),
    [count]
  );

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary"
          style={{
            left: `${p.x}%`,
            bottom: `${p.y}%`,
            width: p.size,
            height: p.size,
            boxShadow: `0 0 ${p.size * 3}px hsl(var(--primary) / 0.6)`,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, p.opacity, p.opacity, 0],
            y: [0, -40 - Math.random() * 60, -80 - Math.random() * 40, -120],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
};

export default FloatingParticles;
