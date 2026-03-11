import { motion, AnimatePresence } from "framer-motion";
import { Lock, Hammer } from "lucide-react";
import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";

export interface BuildingData {
  name: string;
  xp: number;
  level: number;
  icon: LucideIcon;
  gridArea: string;
  windows: number;
  size: "sm" | "md" | "lg";
  buildingType: "empty" | "house" | "park" | "school" | "library" | "university" | "megacity";
}

interface IsometricBuildingProps {
  building: BuildingData;
  unlocked: boolean;
  totalXP: number;
  isSelected: boolean;
  onTap: () => void;
  gridRow: number;
  gridCol: number;
}

/* ── image paths ── */
const buildingImages: Record<string, string> = {
  empty: "/buildings/empty.png",
  house: "/buildings/house.png",
  park: "/buildings/park.png",
  school: "/buildings/school.png",
  library: "/buildings/library.png",
  university: "/buildings/university.png",
  megacity: "/buildings/megacity.png",
};

const constructionImage = "/buildings/construction.png";

/* ── visual hierarchy sizes (larger = more important) ── */
const buildingSizes: Record<string, number> = {
  empty: 105,     // Command Center — largest
  house: 68,      // small
  park: 72,       // small
  school: 88,     // medium
  library: 88,    // medium
  university: 100, // large
  megacity: 110,  // large
};

/* ── accent colours ── */
const buildingAccents: Record<string, string> = {
  empty: "#8bc34a",
  house: "#f4a582",
  park: "#81c784",
  school: "#64b5f6",
  library: "#ffb74d",
  university: "#ce93d8",
  megacity: "#4fc3f7",
};

/* ── sparkle particle for unlock effect ── */
const SparkleParticles = ({ count = 6, accent }: { count?: number; accent: string }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (360 / count) * i,
        distance: 18 + Math.random() * 16,
        size: 2 + Math.random() * 2.5,
        delay: Math.random() * 0.4,
        duration: 0.8 + Math.random() * 0.6,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const x = Math.cos(rad) * p.distance;
        const y = Math.sin(rad) * p.distance;
        return (
          <motion.div
            key={p.id}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: accent,
              boxShadow: `0 0 ${p.size * 2}px ${accent}`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: [0, x],
              y: [0, y],
              opacity: [1, 0],
              scale: [1, 0.2],
            }}
            transition={{
              delay: p.delay,
              duration: p.duration,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
};

/* ══════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════ */
const IsometricBuilding = ({
  building,
  unlocked,
  isSelected,
  onTap,
}: IsometricBuildingProps) => {
  const type = building.buildingType;
  const accent = buildingAccents[type] || "#00bcd4";
  const imgSize = buildingSizes[type] || 80;

  /* ── LOCKED: construction scaffold ── */
  if (!unlocked) {
    return (
      <motion.button
        className="relative flex flex-col items-center justify-end focus:outline-none cursor-pointer"
        onClick={onTap}
        whileTap={{ scale: 0.93 }}
        whileHover={{ scale: 1.04 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: imgSize + 16 }}
      >
        {/* Construction site image — semi-transparent */}
        <div className="relative">
          <img
            src={constructionImage}
            alt={`Locked: ${building.name}`}
            style={{
              width: imgSize * 0.75,
              height: "auto",
              filter: "grayscale(50%) brightness(0.55) opacity(0.7)",
              imageRendering: "auto",
              borderRadius: 8,
            }}
            draggable={false}
          />

          {/* Scaffold overlay lines */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              border: "1.5px dashed rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.15)",
            }}
          />

          {/* Crane / hammer icon */}
          <div
            className="absolute -top-1 -right-1 flex items-center justify-center rounded-full z-10"
            style={{
              width: 18,
              height: 18,
              background: "rgba(50,50,50,0.85)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <Hammer className="h-2.5 w-2.5 text-amber-400/80" />
          </div>
        </div>

        {/* "Unlock at Level X" label */}
        <div className="flex flex-col items-center mt-1">
          <p className="text-[6px] font-mono text-gray-500/80 tracking-wider whitespace-nowrap">
            UNLOCK AT
          </p>
          <div className="flex items-center gap-0.5">
            <Lock className="h-2 w-2 text-gray-500/60" />
            <p className="text-[7px] font-display font-bold text-gray-400 tracking-wider whitespace-nowrap">
              LVL {building.level}
            </p>
          </div>
        </div>

        {/* Selection */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              className="absolute -inset-2 rounded-xl pointer-events-none z-20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                border: "1.5px solid rgba(255,180,80,0.5)",
                boxShadow: "0 0 16px rgba(255,180,80,0.25), inset 0 0 8px rgba(255,180,80,0.05)",
              }}
            />
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  /* ── UNLOCKED: building with game-like feedback ── */
  return (
    <motion.button
      className="relative flex flex-col items-center justify-end focus:outline-none cursor-pointer"
      onClick={onTap}
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.06, y: -3 }}
      initial={{ opacity: 0, scale: 0.3, y: 30 }}
      animate={{
        opacity: 1,
        scale: isSelected ? 1.08 : 1,
        y: isSelected ? -4 : 0,
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        scale: { duration: 0.2 },
        y: { duration: 0.2 },
      }}
      style={{ width: imgSize + 16 }}
    >
      {/* Unlock sparkle particles (play once on mount) */}
      <SparkleParticles accent={accent} count={8} />

      {/* Building image with construction-rise feel */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "bottom" }}
      >
        <img
          src={buildingImages[type]}
          alt={building.name}
          style={{
            width: imgSize,
            height: "auto",
            imageRendering: "auto",
            borderRadius: 10,
            filter: isSelected
              ? `drop-shadow(0 0 12px ${accent}80) drop-shadow(0 4px 8px rgba(0,0,0,0.4))`
              : "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
            transition: "filter 0.2s ease",
          }}
          draggable={false}
        />
      </motion.div>

      {/* Ground shadow */}
      <motion.div
        className="rounded-full"
        style={{
          width: imgSize * 0.65,
          height: imgSize * 0.1,
          background: "rgba(0,0,0,0.2)",
          marginTop: -3,
          filter: "blur(4px)",
        }}
        animate={{
          width: isSelected ? imgSize * 0.75 : imgSize * 0.65,
          opacity: isSelected ? 0.35 : 0.2,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Label */}
      <p
        className="text-[7px] font-display font-bold tracking-[0.08em] mt-0.5 whitespace-nowrap text-center"
        style={{
          color: accent,
          textShadow: `0 0 8px ${accent}40`,
        }}
      >
        {building.name.toUpperCase()}
      </p>

      {/* Ambient glow beneath */}
      <motion.div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
        style={{
          width: imgSize * 0.8,
          height: 14,
          background: `radial-gradient(ellipse, ${accent}30 0%, transparent 70%)`,
          filter: "blur(5px)",
        }}
        animate={{
          opacity: isSelected ? [0.7, 1, 0.7] : [0.3, 0.6, 0.3],
          scale: isSelected ? 1.2 : 1,
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Selection glow ring */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute -inset-2 rounded-xl pointer-events-none z-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              border: `2px solid ${accent}80`,
              boxShadow: `0 0 24px ${accent}50, inset 0 0 16px ${accent}10`,
              background: `radial-gradient(ellipse, ${accent}08 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default IsometricBuilding;
