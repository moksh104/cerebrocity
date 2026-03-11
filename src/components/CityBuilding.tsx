import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CityBuildingProps {
  unlocked: boolean;
  width: number;
  height: number;
  windows: number;
  index: number;
  hasAntenna?: boolean;
  hasSpire?: boolean;
}

const CityBuilding = ({
  unlocked,
  width,
  height,
  windows,
  index,
  hasAntenna,
  hasSpire,
}: CityBuildingProps) => {
  const windowCols = Math.min(Math.ceil(width / 12), 3);
  const windowRows = Math.min(Math.ceil(windows / windowCols), 5);

  return (
    <motion.div
      className="relative flex flex-col items-center"
      style={{ width, transformOrigin: "bottom" }}
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{
        delay: 0.15 + index * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Antenna / Spire */}
      {unlocked && hasAntenna && (
        <motion.div
          className="w-[2px] bg-primary rounded-full mb-0.5 animate-pulse-glow"
          style={{
            height: 10,
            boxShadow: "0 -4px 8px hsl(var(--primary) / 0.5)",
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
        />
      )}
      {unlocked && hasSpire && (
        <motion.div
          className="mb-0.5"
          style={{
            width: 0,
            height: 0,
            borderLeft: `${width / 4}px solid transparent`,
            borderRight: `${width / 4}px solid transparent`,
            borderBottom: `12px solid hsl(var(--primary) / 0.4)`,
            filter: "drop-shadow(0 -2px 6px hsl(var(--primary) / 0.3))",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        />
      )}

      {/* Main building body */}
      <motion.div
        className={cn(
          "relative rounded-t-sm border overflow-hidden",
          unlocked
            ? "border-primary/30"
            : "border-dashed border-muted-foreground/15"
        )}
        style={{
          width: "100%",
          height,
          background: unlocked
            ? "linear-gradient(to top, hsl(var(--primary) / 0.15), hsl(var(--accent) / 0.25))"
            : "hsl(var(--muted) / 0.08)",
          boxShadow: unlocked
            ? "0 -8px 24px hsl(var(--primary) / 0.12), inset 0 0 12px hsl(var(--primary) / 0.06)"
            : "none",
        }}
        animate={
          unlocked
            ? {
                boxShadow: [
                  "0 -8px 24px hsl(187 100% 50% / 0.08), inset 0 0 12px hsl(187 100% 50% / 0.04)",
                  "0 -8px 24px hsl(187 100% 50% / 0.18), inset 0 0 12px hsl(187 100% 50% / 0.08)",
                  "0 -8px 24px hsl(187 100% 50% / 0.08), inset 0 0 12px hsl(187 100% 50% / 0.04)",
                ],
              }
            : {}
        }
        transition={
          unlocked
            ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      >
        {/* Window grid */}
        {unlocked && (
          <div
            className="absolute inset-2 grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${windowCols}, 1fr)`,
              gridTemplateRows: `repeat(${windowRows}, 1fr)`,
            }}
          >
            {Array.from({ length: windowCols * windowRows }).map((_, wi) => (
              <motion.div
                key={wi}
                className="rounded-[1px]"
                style={{
                  background: "hsl(var(--primary) / 0.5)",
                  boxShadow: "0 0 4px hsl(var(--primary) / 0.4)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  delay: 0.8 + wi * 0.05 + Math.random() * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}

        {/* Locked X pattern */}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 border border-dashed border-muted-foreground/20 rounded-sm" />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CityBuilding;
