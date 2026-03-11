import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MobileLayout from "@/components/MobileLayout";
import CircularTimer from "@/components/CircularTimer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const durations = [
  { label: "15 MIN", seconds: 15 * 60 },
  { label: "25 MIN", seconds: 25 * 60 },
  { label: "50 MIN", seconds: 50 * 60 },
];

/* ── Floating XP particle ── */
const FloatingXP = ({ xp, onDone }: { xp: number; onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 1600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="absolute top-1/3 left-1/2 -translate-x-1/2 text-primary font-display text-lg font-bold text-glow-cyan z-30 pointer-events-none"
      initial={{ opacity: 1, y: 0, scale: 0.8 }}
      animate={{ opacity: 0, y: -70, scale: 1.2 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      +{xp} XP
    </motion.div>
  );
};

/* ── XP counter that counts up rapidly ── */
const CountUpXP = ({ target }: { target: number }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1200;
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplay(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return <>{display}</>;
};

const FocusPage = () => {
  const [selected, setSelected] = useState(1);
  const [timeLeft, setTimeLeft] = useState(durations[1].seconds);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showFloatingXP, setShowFloatingXP] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = durations[selected].seconds;
  const progress = 1 - timeLeft / total;
  const xpReward = Math.floor(total / 60);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const reset = useCallback(() => {
    setRunning(false);
    setCompleted(false);
    setShowFloatingXP(false);
    setTimeLeft(durations[selected].seconds);
  }, [selected]);

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && running) {
      setRunning(false);
      setCompleted(true);
      setShowFloatingXP(true);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, timeLeft]);

  return (
    <MobileLayout>
      <div className="relative flex flex-col items-center px-5 pt-14 overflow-hidden">
        {/* Ambient glow behind timer when running */}
        <AnimatePresence>
          {running && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 1 } }}
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/5 blur-[90px]"
            />
          )}
        </AnimatePresence>

        {/* Completed glow */}
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px]"
              style={{ background: "radial-gradient(circle, hsl(187 100% 50% / 0.1) 0%, hsl(255 100% 69% / 0.05) 50%, transparent 100%)" }}
            />
          )}
        </AnimatePresence>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "font-display text-xs font-medium tracking-[0.3em] uppercase mb-10",
            running ? "text-primary text-glow-cyan animate-flicker" : completed ? "text-accent text-glow-purple" : "text-muted-foreground"
          )}
        >
          {running ? "FOCUS ACTIVE" : completed ? "SESSION COMPLETE" : "FOCUS SESSION"}
        </motion.h1>

        {/* Duration pills */}
        <div className="flex gap-2 mb-10">
          {durations.map((d, i) => (
            <button
              key={d.label}
              onClick={() => { if (!running) { setSelected(i); setTimeLeft(d.seconds); setCompleted(false); setShowFloatingXP(false); } }}
              className={cn(
                "rounded-full px-4 py-1.5 text-[11px] font-display font-medium tracking-wider transition-all border",
                i === selected
                  ? "bg-primary/10 border-primary/50 text-primary glow-cyan-sm"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              )}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Timer — with breathing when active */}
        <div className={cn("relative z-10", running && "animate-timer-pulse")}>
          <CircularTimer progress={progress} size={270} strokeWidth={3} glowing={running}>
            <div className="text-center">
              <p className="font-mono text-5xl font-bold text-foreground tabular-nums tracking-tight">
                {formatTime(timeLeft)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-2 font-mono tracking-wider">
                +{xpReward} XP REWARD
              </p>
            </div>
          </CircularTimer>

          {/* Floating +XP animation on completion */}
          <AnimatePresence>
            {showFloatingXP && (
              <FloatingXP xp={xpReward} onDone={() => setShowFloatingXP(false)} />
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-10 z-10">
          {(running || completed) && (
            <Button variant="outline" size="icon" onClick={reset} className="rounded-full h-12 w-12 border-border">
              <RotateCcw className="h-5 w-5" />
            </Button>
          )}
          {!completed && (
            <Button
              onClick={() => setRunning(!running)}
              className={cn(
                "rounded-full h-16 w-16 text-primary-foreground transition-all",
                running ? "glow-pink bg-secondary hover:bg-secondary/90" : "glow-cyan"
              )}
              size="icon"
            >
              {running ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
            </Button>
          )}
        </div>

        {/* Completion reward — with count-up and level bar glow */}
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-10 text-center z-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-display text-4xl font-bold text-primary text-glow-cyan">
                  +<CountUpXP target={xpReward} /> XP
                </p>
              </motion.div>
              <p className="text-xs text-muted-foreground mt-2 font-mono tracking-wider">
                MISSION ACCOMPLISHED
              </p>

              {/* Level progress bar with glow animation */}
              <motion.div
                className="mt-4 w-48 mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-[9px] font-mono text-muted-foreground">LVL 7</span>
                  <span className="text-[9px] font-mono text-primary">LVL 8</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full animate-bar-glow"
                    initial={{ width: "55%" }}
                    animate={{ width: "72%" }}
                    transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                    style={{
                      background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileLayout>
  );
};

export default FocusPage;
