import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface BuildingData {
  name: string;
  xp: number;
  level: number;
  icon: LucideIcon;
  gridArea: string;
  windows: number;
  size: "sm" | "md" | "lg";
}

interface EmpireMapTileProps {
  building: BuildingData;
  unlocked: boolean;
  totalXP: number;
  isSelected: boolean;
  onTap: () => void;
}

const sizeConfig = {
  sm: { w: 24, h: 28, floors: 2, iconSize: "h-3 w-3", padW: 36, padH: 8 },
  md: { w: 30, h: 40, floors: 3, iconSize: "h-3.5 w-3.5", padW: 46, padH: 10 },
  lg: { w: 38, h: 54, floors: 4, iconSize: "h-4 w-4", padW: 56, padH: 12 },
};

const EmpireMapTile = ({ building, unlocked, totalXP, isSelected, onTap }: EmpireMapTileProps) => {
  const Icon = building.icon;
  const progress = Math.min(100, (totalXP / building.xp) * 100);
  const cfg = sizeConfig[building.size];
  const windowCols = Math.min(building.windows, building.size === "sm" ? 2 : 3);
  const windowRows = Math.ceil(building.windows / windowCols);

  return (
    <motion.button
      className="relative flex flex-col items-center justify-end focus:outline-none"
      onClick={onTap}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {unlocked ? (
        <>
          {/* Antenna for large buildings */}
          {building.size === "lg" && (
            <motion.div
              className="mb-[-1px]"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              style={{ transformOrigin: "bottom" }}
            >
              <div
                className="mx-auto rounded-full"
                style={{
                  width: 2,
                  height: 8,
                  background: "hsl(var(--primary) / 0.5)",
                  boxShadow: "0 -3px 6px hsl(var(--primary) / 0.4)",
                }}
              />
              <div
                className="mx-auto rounded-full"
                style={{
                  width: 4,
                  height: 4,
                  background: "hsl(var(--primary) / 0.8)",
                  boxShadow: "0 0 6px hsl(var(--primary) / 0.6)",
                  marginTop: -1,
                }}
              />
            </motion.div>
          )}

          {/* Roof peak for medium buildings */}
          {building.size === "md" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-[-1px]"
              style={{
                width: 0,
                height: 0,
                borderLeft: `${cfg.w / 2}px solid transparent`,
                borderRight: `${cfg.w / 2}px solid transparent`,
                borderBottom: `8px solid hsl(var(--primary) / 0.15)`,
              }}
            />
          )}

          {/* Main building body */}
          <motion.div
            className="relative overflow-hidden"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              transformOrigin: "bottom",
              width: cfg.w,
              height: cfg.h,
              background: `linear-gradient(to top, hsl(var(--primary) / 0.18), hsl(var(--accent) / 0.08) 60%, hsl(var(--primary) / 0.12))`,
              borderLeft: "1px solid hsl(var(--primary) / 0.2)",
              borderRight: "1px solid hsl(var(--primary) / 0.2)",
              borderTop: "1px solid hsl(var(--primary) / 0.25)",
              borderRadius: "2px 2px 0 0",
            }}
          >
            {/* Horizontal floor lines */}
            {Array.from({ length: cfg.floors - 1 }).map((_, fi) => (
              <div
                key={fi}
                className="absolute left-0 right-0"
                style={{
                  top: `${((fi + 1) / cfg.floors) * 100}%`,
                  height: 1,
                  background: "hsl(var(--primary) / 0.08)",
                }}
              />
            ))}

            {/* Window grid */}
            <div
              className="absolute grid gap-[2px]"
              style={{
                inset: building.size === "sm" ? 3 : 4,
                gridTemplateColumns: `repeat(${windowCols}, 1fr)`,
                gridTemplateRows: `repeat(${windowRows}, 1fr)`,
              }}
            >
              {Array.from({ length: windowCols * windowRows }).map((_, wi) => (
                <motion.div
                  key={wi}
                  className="rounded-[0.5px]"
                  style={{
                    background: "hsl(var(--primary) / 0.55)",
                    boxShadow: "0 0 3px hsl(var(--primary) / 0.3)",
                  }}
                  animate={{ opacity: [0.25, 0.85, 0.25] }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    delay: Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Vertical accent stripe */}
            <div
              className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
              style={{
                width: 1,
                background: "hsl(var(--primary) / 0.06)",
              }}
            />
          </motion.div>

          {/* Landing pad / ground platform */}
          <div className="relative flex flex-col items-center">
            <div
              className="rounded-sm"
              style={{
                width: cfg.padW,
                height: 3,
                background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.35), transparent)",
                boxShadow: "0 0 6px hsl(var(--primary) / 0.15)",
              }}
            />
            {/* Glowing pad surface */}
            <div
              className="rounded-full"
              style={{
                width: cfg.padW * 0.8,
                height: cfg.padH,
                marginTop: 1,
                background: "radial-gradient(ellipse, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Label */}
          <p className="text-[6px] font-display font-semibold text-primary/60 tracking-[0.1em] mt-0.5 text-center leading-tight whitespace-nowrap">
            {building.name.toUpperCase()}
          </p>

          {/* Ambient glow beneath */}
          <motion.div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
            style={{
              width: cfg.padW,
              height: 10,
              background: "radial-gradient(ellipse, hsl(var(--primary) / 0.12) 0%, transparent 70%)",
              filter: "blur(4px)",
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : (
        <>
          {/* Locked building silhouette */}
          <div
            className="relative overflow-hidden"
            style={{
              width: cfg.w,
              height: cfg.h,
              background: "hsl(var(--muted) / 0.04)",
              border: "1px dashed hsl(var(--muted-foreground) / 0.1)",
              borderBottom: "none",
              borderRadius: "2px 2px 0 0",
            }}
          >
            {/* Silhouette shape */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="h-3 w-3 text-muted-foreground/15" />
            </div>
            {/* Ghost floor lines */}
            {Array.from({ length: 2 }).map((_, fi) => (
              <div
                key={fi}
                className="absolute left-0 right-0"
                style={{
                  top: `${((fi + 1) / 3) * 100}%`,
                  height: 1,
                  background: "hsl(var(--muted-foreground) / 0.04)",
                }}
              />
            ))}
          </div>

          {/* Dim ground */}
          <div
            className="rounded-sm"
            style={{
              width: cfg.padW,
              height: 2,
              background: "linear-gradient(90deg, transparent, hsl(var(--muted-foreground) / 0.08), transparent)",
            }}
          />

          {/* Level + progress */}
          <p className="text-[5px] font-mono text-muted-foreground/25 tracking-wider mt-1">
            LVL {building.level}
          </p>
          <div className="h-[1.5px] rounded-full mt-0.5 overflow-hidden" style={{ width: cfg.padW * 0.6, background: "hsl(var(--muted) / 0.15)" }}>
            <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "hsl(var(--primary) / 0.25)" }} />
          </div>
        </>
      )}

      {/* Selection ring */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute -inset-3 rounded-xl pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              border: "1px solid hsl(var(--primary) / 0.3)",
              boxShadow: "0 0 20px hsl(var(--primary) / 0.1), inset 0 0 16px hsl(var(--primary) / 0.03)",
              background: "radial-gradient(ellipse, hsl(var(--primary) / 0.04) 0%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default EmpireMapTile;
