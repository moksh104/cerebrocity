import { Flame, Zap, Building2, Trophy, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MobileLayout from "@/components/MobileLayout";
import CircularTimer from "@/components/CircularTimer";

const stats = [
  { icon: Zap, label: "XP", value: "2,450", accent: "text-primary", bg: "border-glow-cyan" },
  { icon: Trophy, label: "LEVEL", value: "7", accent: "text-accent", bg: "border-glow-purple" },
  { icon: Building2, label: "BUILT", value: "12", accent: "text-secondary", bg: "" },
];

/* Milestone-based skyline: each building unlocks at a focus-hour threshold */
const milestones = [
  { hours: 1, label: "Hut", h: 22, color: "from-primary/25 to-primary/50", unlocked: true },
  { hours: 3, label: "House", h: 34, color: "from-primary/30 to-primary/60", unlocked: true },
  { hours: 5, label: "Shop", h: 40, color: "from-accent/25 to-accent/55", unlocked: true },
  { hours: 10, label: "Library", h: 50, color: "from-primary/30 to-primary/70", unlocked: true },
  { hours: 20, label: "School", h: 44, color: "from-secondary/20 to-secondary/50", unlocked: true },
  { hours: 30, label: "Tower", h: 62, color: "from-accent/25 to-accent/60", unlocked: true },
  { hours: 50, label: "Lab", h: 52, color: "from-primary/30 to-primary/65", unlocked: false },
  { hours: 75, label: "Observatory", h: 70, color: "from-primary/25 to-primary/70", unlocked: false },
  { hours: 100, label: "Skyline", h: 46, color: "from-accent/20 to-accent/50", unlocked: false },
];

const totalFocusHours = 48; // would come from state in production

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="px-5 pt-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <p className="text-muted-foreground text-xs font-mono tracking-wider">COMMANDER</p>
            <h1 className="text-xl font-display font-bold text-foreground tracking-wide mt-1">
              DASHBOARD
            </h1>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 border border-border border-glow-cyan">
            <Flame className="h-4 w-4 text-neon-yellow" style={{ color: "hsl(54 100% 50%)" }} />
            <span className="text-sm font-mono font-bold text-foreground">14</span>
            <span className="text-[10px] text-muted-foreground font-mono">DAYS</span>
          </div>
        </motion.div>

        {/* Timer Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center mb-8"
        >
          <button onClick={() => navigate("/focus")} className="group relative">
            <CircularTimer progress={0.65} size={190} strokeWidth={3}>
              <div className="text-center">
                <p className="font-mono text-3xl font-bold text-foreground tabular-nums tracking-tight">
                  4:12
                </p>
                <p className="text-[10px] text-muted-foreground mt-1 font-mono tracking-wider">
                  HOURS TODAY
                </p>
              </div>
            </CircularTimer>
          </button>
          <p className="text-[10px] text-primary font-mono mt-3 tracking-wider animate-flicker">
            ▸ TAP TO START SESSION
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 mb-6"
        >
          {stats.map(({ icon: Icon, label, value, accent, bg }) => (
            <div
              key={label}
              className={`relative flex-1 rounded-xl bg-card border border-border p-4 overflow-hidden ${bg}`}
            >
              <div className="absolute inset-0 noise" />
              <div className="relative z-10">
                <Icon className={`h-4 w-4 ${accent} mb-2`} />
                <p className="font-mono text-xl font-bold text-foreground">{value}</p>
                <p className="text-[10px] text-muted-foreground font-display tracking-wider mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Growing Skyline — milestones unlock buildings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative rounded-xl bg-card border border-border p-5 overflow-hidden"
        >
          <div className="absolute inset-0 noise" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-display font-semibold text-foreground tracking-wider">YOUR EMPIRE</h2>
              <button
                onClick={() => navigate("/empire")}
                className="flex items-center text-[10px] text-primary font-mono tracking-wider group"
              >
                VIEW ALL <ChevronRight className="h-3 w-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Animated skyline */}
            <div className="flex items-end gap-[5px] justify-center h-24 mb-2">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: m.unlocked ? m.h : m.h * 0.3,
                    opacity: m.unlocked ? 1 : 0.25,
                  }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease: "easeOut" }}
                  className="relative group cursor-default"
                  style={{ width: 22 }}
                >
                  <div
                    className={`w-full h-full rounded-t-sm bg-gradient-to-t ${m.color} border border-primary/15`}
                    style={{
                      boxShadow: m.unlocked
                        ? `0 0 8px hsl(var(--primary) / 0.15), inset 0 0 6px hsl(var(--primary) / 0.08)`
                        : "none",
                      filter: m.unlocked ? "none" : "grayscale(0.6)",
                    }}
                  />
                  {/* Milestone windows */}
                  {m.unlocked && m.h > 30 && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col gap-1">
                      {Array.from({ length: Math.min(3, Math.floor(m.h / 18)) }).map((_, w) => (
                        <div
                          key={w}
                          className="w-1.5 h-1.5 rounded-[1px]"
                          style={{
                            background: "hsl(var(--primary) / 0.35)",
                            boxShadow: "0 0 3px hsl(var(--primary) / 0.2)",
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {/* Tooltip on hover */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    <span className="text-[7px] font-mono text-muted-foreground bg-background/90 px-1 py-0.5 rounded border border-border">
                      {m.label} · {m.hours}h
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Ground line */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-3" />

            {/* Next milestone progress */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground font-mono">NEXT: OBSERVATORY (75h)</span>
              <span className="text-[10px] font-mono font-semibold text-primary">{totalFocusHours}/75h</span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(totalFocusHours / 75) * 100}%` }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                style={{
                  background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--secondary)))",
                  boxShadow: "0 0 8px hsl(var(--primary) / 0.4)",
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
