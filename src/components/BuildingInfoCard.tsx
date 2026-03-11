import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, X } from "lucide-react";
import type { BuildingData } from "./IsometricBuilding";
import { cn } from "@/lib/utils";

interface BuildingInfoCardProps {
  building: BuildingData | null;
  unlocked: boolean;
  totalXP: number;
  onClose: () => void;
}

const BuildingInfoCard = ({ building, unlocked, totalXP, onClose }: BuildingInfoCardProps) => {
  if (!building) return null;
  const Icon = building.icon;
  const progress = Math.min(100, (totalXP / building.xp) * 100);

  return (
    <AnimatePresence>
      {building && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "relative rounded-xl border p-4 overflow-hidden",
            unlocked ? "bg-card border-primary/20" : "bg-card border-border/40"
          )}
          style={
            unlocked
              ? { boxShadow: "0 0 24px hsl(var(--primary) / 0.1), inset 0 0 16px hsl(var(--primary) / 0.04)" }
              : undefined
          }
        >
          <div className="absolute inset-0 noise" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div className="relative z-10 flex items-center gap-3">
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-lg border",
                unlocked ? "bg-primary/10 border-primary/25" : "bg-muted/20 border-border"
              )}
              style={unlocked ? { boxShadow: "0 0 10px hsl(var(--primary) / 0.2)" } : undefined}
            >
              <Icon className={cn("h-5 w-5", unlocked ? "text-primary" : "text-muted-foreground")} />
            </div>

            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-display font-bold tracking-wider", unlocked ? "text-foreground" : "text-muted-foreground")}>
                {building.name.toUpperCase()}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground tracking-wider mt-0.5">
                {unlocked ? (
                  <span className="text-primary/80">● ONLINE — LEVEL {building.level}</span>
                ) : (
                  <span>REQUIRES LEVEL {building.level} · {building.xp} XP</span>
                )}
              </p>
            </div>

            {unlocked && <Check className="h-4 w-4 text-primary/60 flex-shrink-0" />}
          </div>

          {!unlocked && (
            <div className="relative z-10 mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-mono text-muted-foreground tracking-wider">PROGRESS</span>
                <span className="text-[9px] font-mono text-primary font-semibold">{totalXP} / {building.xp} XP</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{ boxShadow: "0 0 8px hsl(var(--primary) / 0.5)" }}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuildingInfoCard;
