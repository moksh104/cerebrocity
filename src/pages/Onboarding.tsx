import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6 overflow-hidden scanlines">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-60 h-60 rounded-full bg-accent/5 blur-[80px]" />

      {/* City silhouette */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative mb-14 flex flex-col items-center z-10"
      >
        <div className="relative mb-10">
          {/* Glow backdrop */}
          <div className="absolute inset-0 blur-3xl bg-primary/15 rounded-full scale-[2]" />
          <div className="relative flex items-end gap-[3px]">
            {[
              { h: 40, color: "from-primary/30 to-primary/60" },
              { h: 64, color: "from-accent/30 to-accent/60" },
              { h: 52, color: "from-primary/30 to-primary/70" },
              { h: 76, color: "from-secondary/20 to-secondary/50" },
              { h: 44, color: "from-primary/30 to-primary/60" },
              { h: 60, color: "from-accent/30 to-accent/60" },
              { h: 48, color: "from-primary/30 to-primary/50" },
              { h: 68, color: "from-primary/30 to-primary/70" },
              { h: 36, color: "from-accent/20 to-accent/50" },
            ].map((b, i) => (
              <motion.div
                key={i}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: b.h, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                className={`w-5 rounded-t-sm bg-gradient-to-t ${b.color} border border-primary/20`}
                style={{
                  boxShadow: "0 0 8px hsl(var(--primary) / 0.1), inset 0 0 6px hsl(var(--primary) / 0.05)",
                }}
              />
            ))}
          </div>
          {/* Ground line */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col items-center mb-3"
        >
          <img src="/cerebrocity-logo.jpg" alt="Cerebrocity" className="h-20 w-auto mb-2" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="text-muted-foreground text-xs tracking-[0.25em] uppercase font-display"
        >
          Build Your Focus Empire
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="z-10"
      >
        <Button
          onClick={() => navigate("/signup")}
          className="glow-cyan rounded-full px-8 py-6 text-sm font-display font-semibold tracking-widest uppercase"
        >
          Begin Building
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 text-[10px] text-muted-foreground font-mono tracking-wider z-10"
      >
        v1.0 // SYSTEM ONLINE
      </motion.p>
    </div>
  );
};

export default Onboarding;
