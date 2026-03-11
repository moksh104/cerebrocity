import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CircularTimerProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  className?: string;
  glowing?: boolean;
}

const CircularTimer = ({ progress, size = 220, strokeWidth = 3, children, className, glowing }: CircularTimerProps) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      {/* Outer rotating halo when active */}
      {glowing && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size + 20,
            height: size + 20,
            background: `conic-gradient(
              hsl(187 100% 50% / 0.15),
              hsl(255 100% 69% / 0.08),
              hsl(338 100% 59% / 0.08),
              hsl(187 100% 50% / 0.15)
            )`,
            filter: "blur(8px)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Breathing pulse ring when active */}
      {glowing && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size + 10,
            height: size + 10,
            border: "1px solid hsl(187 100% 50% / 0.12)",
            background: "radial-gradient(circle, hsl(187 100% 50% / 0.06) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Static glow ring when not active but has progress */}
      {!glowing && progress > 0 && (
        <div
          className="absolute rounded-full"
          style={{
            width: size + 6,
            height: size + 6,
            background: "radial-gradient(circle, hsl(187 100% 50% / 0.04) 0%, transparent 70%)",
          }}
        />
      )}

      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          opacity={0.5}
        />
        {/* Progress arc with flowing gradient */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#timerGradient)"
          strokeWidth={strokeWidth + 1}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
          style={{
            filter: glowing
              ? "drop-shadow(0 0 12px hsl(187 100% 50% / 0.7)) drop-shadow(0 0 30px hsl(187 100% 50% / 0.3))"
              : "drop-shadow(0 0 4px hsl(187 100% 50% / 0.3))",
          }}
        />
        {/* Dot at the tip of progress */}
        {progress > 0.01 && (
          <circle
            cx={size / 2 + radius * Math.cos(2 * Math.PI * progress - Math.PI / 2)}
            cy={size / 2 + radius * Math.sin(2 * Math.PI * progress - Math.PI / 2)}
            r={glowing ? 4 : 3}
            fill="hsl(187 100% 80%)"
            style={{
              filter: glowing
                ? "drop-shadow(0 0 6px hsl(187 100% 50% / 0.8))"
                : "drop-shadow(0 0 3px hsl(187 100% 50% / 0.5))",
            }}
          />
        )}
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(187 100% 50%)" />
            <stop offset="50%" stopColor="hsl(255 100% 69%)" />
            <stop offset="100%" stopColor="hsl(338 100% 59%)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
};

export default CircularTimer;
