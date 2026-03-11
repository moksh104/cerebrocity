import { useState } from "react";
import {
  Building,
  Zap,
  Trees,
  GraduationCap,
  BookOpen,
  School,
  Atom,
  Landmark,
  Check,
  Lock,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MobileLayout from "@/components/MobileLayout";
import IsometricBuilding from "@/components/IsometricBuilding";
import type { BuildingData } from "@/components/IsometricBuilding";
import BuildingInfoCard from "@/components/BuildingInfoCard";
import { cn } from "@/lib/utils";

const buildings: BuildingData[] = [
  { name: "Command Center", xp: 0, level: 1, icon: Building, gridArea: "", windows: 8, size: "lg", buildingType: "empty" },
  { name: "House", xp: 50, level: 2, icon: Zap, gridArea: "", windows: 3, size: "sm", buildingType: "house" },
  { name: "Park", xp: 150, level: 5, icon: Trees, gridArea: "", windows: 2, size: "sm", buildingType: "park" },
  { name: "School", xp: 400, level: 10, icon: GraduationCap, gridArea: "", windows: 5, size: "md", buildingType: "school" },
  { name: "Library", xp: 900, level: 20, icon: BookOpen, gridArea: "", windows: 6, size: "md", buildingType: "library" },
  { name: "Research Lab", xp: 600, level: 10, icon: School, gridArea: "", windows: 4, size: "md", buildingType: "school" },
  { name: "University", xp: 1800, level: 35, icon: Atom, gridArea: "", windows: 10, size: "lg", buildingType: "university" },
  { name: "Mega City", xp: 3500, level: 50, icon: Landmark, gridArea: "", windows: 12, size: "lg", buildingType: "megacity" },
];

const buildingPositions = [
  { left: "50%", top: "68%" },
  { left: "28%", top: "48%" },
  { left: "50%", top: "40%" },
  { left: "24%", top: "20%" },
  { left: "70%", top: "18%" },
  { left: "74%", top: "48%" },
  { left: "46%", top: "6%" },
  { left: "82%", top: "32%" },
];

function getBuildingColor(type: string): string {
  const map: Record<string, string> = {
    empty: "#8bc34a",
    house: "#f4a582",
    park: "#81c784",
    school: "#64b5f6",
    library: "#ffb74d",
    university: "#ce93d8",
    megacity: "#4fc3f7",
  };
  return map[type] || "#00bcd4";
}

const EmpirePage = () => {
  const totalXP = 550;
  const currentLevel = totalXP < 50 ? 1 : totalXP < 150 ? 2 : totalXP < 400 ? 5 : totalXP < 600 ? 10 : totalXP < 900 ? 20 : totalXP < 1800 ? 35 : 50;
  const unlockedCount = buildings.filter((b) => totalXP >= b.xp).length;
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const selectedBuilding = selectedIdx !== null ? buildings[selectedIdx] : null;

  return (
    <MobileLayout>
      <div className="px-4 pt-10 pb-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-mono text-muted-foreground tracking-wider mb-1">
              DISTRICT 01
            </p>
            <h1 className="font-display text-xl font-bold text-foreground tracking-wide">
              YOUR EMPIRE
            </h1>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-muted-foreground">{unlockedCount}/{buildings.length}</span>
            <div className="h-1 w-12 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(unlockedCount / buildings.length) * 100}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                style={{
                  background: "linear-gradient(90deg, #4caf50, #81c784)",
                  boxShadow: "0 0 6px rgba(76,175,80,0.5)",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* === ISOMETRIC CITY MAP === */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="relative mt-4 rounded-2xl overflow-hidden border border-border/30"
          style={{
            height: 440,
            background: `url('/buildings/terrain_bg.png') center/cover no-repeat`,
          }}
        >
          {/* Vignette */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.2) 100%),
                linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.08) 100%)
              `,
            }}
          />

          {/* Level badge */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-background/80 backdrop-blur-sm px-2 py-1">
            <Zap className="h-3 w-3 text-emerald-400" />
            <span className="text-[10px] font-display font-bold text-emerald-400 tracking-wider">
              LVL {currentLevel}
            </span>
          </div>

          {/* Count badge */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-background/80 backdrop-blur-sm px-2 py-1">
            <Building className="h-3 w-3 text-amber-400" />
            <span className="text-[10px] font-display font-bold text-amber-400 tracking-wider">
              {unlockedCount}/{buildings.length}
            </span>
          </div>

          {/* Buildings */}
          <div className="relative z-10 w-full h-full">
            {buildings.map((b, i) => (
              <div
                key={b.name}
                className="absolute -translate-x-1/2"
                style={{
                  left: buildingPositions[i].left,
                  top: buildingPositions[i].top,
                }}
              >
                <IsometricBuilding
                  building={b}
                  unlocked={totalXP >= b.xp}
                  totalXP={totalXP}
                  isSelected={selectedIdx === i}
                  onTap={() => setSelectedIdx(selectedIdx === i ? null : i)}
                  gridRow={i}
                  gridCol={0}
                />
              </div>
            ))}
          </div>

          {/* Cloud shadows */}
          <motion.div
            className="absolute z-[3] pointer-events-none rounded-full"
            style={{ width: 90, height: 22, background: "rgba(0,0,0,0.05)", filter: "blur(14px)", top: "28%" }}
            animate={{ left: ["-20%", "120%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute z-[3] pointer-events-none rounded-full"
            style={{ width: 65, height: 16, background: "rgba(0,0,0,0.04)", filter: "blur(10px)", top: "60%" }}
            animate={{ left: ["120%", "-20%"] }}
            transition={{ duration: 35, delay: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* Tap hint */}
          <AnimatePresence>
            {selectedIdx === null && (
              <motion.div
                className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 rounded-md bg-background/60 backdrop-blur-sm px-2.5 py-1"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 0.7, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ delay: 1, duration: 0.4 }}
              >
                <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                <span className="text-[8px] font-mono text-muted-foreground">TAP A BUILDING</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* === INFO CARD === */}
        <AnimatePresence>
          {selectedBuilding && (
            <motion.div
              className="mt-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25 }}
            >
              <BuildingInfoCard
                building={selectedBuilding}
                unlocked={totalXP >= selectedBuilding.xp}
                totalXP={totalXP}
                onClose={() => setSelectedIdx(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* === PROGRESS GRID === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 mb-4"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest">
              EMPIRE PROGRESS
            </p>
            <p className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wider">
              {unlockedCount} / {buildings.length}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {buildings.map((b, i) => {
              const unlocked = totalXP >= b.xp;
              const Icon = b.icon;
              const palette = getBuildingColor(b.buildingType);
              const isActive = selectedIdx === i;

              return (
                <motion.button
                  key={b.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.04 }}
                  className={cn(
                    "relative flex flex-col items-center rounded-lg border p-2 overflow-hidden cursor-pointer transition-all duration-200",
                    unlocked ? "bg-card" : "bg-card/30 border-border/30",
                    isActive && "ring-1"
                  )}
                  style={{
                    borderColor: unlocked ? `${palette}25` : undefined,
                    boxShadow: isActive ? `0 0 12px ${palette}30` : unlocked ? `inset 0 0 12px ${palette}06` : undefined,
                    ringColor: isActive ? palette : undefined,
                  }}
                  onClick={() => setSelectedIdx(isActive ? null : i)}
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-md border mb-1",
                      unlocked ? "" : "bg-muted/15 border-border/40"
                    )}
                    style={{
                      background: unlocked ? `${palette}15` : undefined,
                      borderColor: unlocked ? `${palette}30` : undefined,
                    }}
                  >
                    {unlocked ? (
                      <Icon className="h-3.5 w-3.5" style={{ color: palette }} />
                    ) : (
                      <Lock className="h-2.5 w-2.5 text-muted-foreground/40" />
                    )}
                  </div>
                  <p className={cn(
                    "text-[7px] font-display font-semibold tracking-wider text-center leading-tight",
                    unlocked ? "text-foreground/80" : "text-muted-foreground/40"
                  )}>
                    {b.name.split(" ").map(w => w.slice(0, 4)).join(" ").toUpperCase()}
                  </p>
                  {unlocked && (
                    <Check className="absolute top-1 right-1 h-2.5 w-2.5" style={{ color: `${palette}60` }} />
                  )}
                  {!unlocked && (
                    <div className="w-full mt-1">
                      <div className="h-[2px] rounded-full bg-muted/20 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (totalXP / b.xp) * 100)}%`,
                            background: `${palette}60`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default EmpirePage;
