import { motion } from "framer-motion";
import { useMemo } from "react";

/* ── Decorative isometric terrain: trees, ground tiles, small details ── */

interface TerrainItem {
    type: "tree" | "bush" | "rock" | "flower";
    x: number; // percentage left
    y: number; // percentage top
    size: number;
    delay: number;
}

const IsometricTerrain = () => {
    const items = useMemo<TerrainItem[]>(
        () => [
            // Trees scattered around the map
            { type: "tree", x: 8, y: 25, size: 16, delay: 0.3 },
            { type: "tree", x: 92, y: 20, size: 14, delay: 0.5 },
            { type: "tree", x: 15, y: 68, size: 13, delay: 0.4 },
            { type: "tree", x: 88, y: 72, size: 15, delay: 0.6 },
            { type: "tree", x: 5, y: 48, size: 11, delay: 0.35 },
            { type: "tree", x: 95, y: 45, size: 12, delay: 0.45 },
            // Bushes
            { type: "bush", x: 12, y: 40, size: 7, delay: 0.55 },
            { type: "bush", x: 85, y: 35, size: 6, delay: 0.65 },
            { type: "bush", x: 18, y: 82, size: 8, delay: 0.7 },
            { type: "bush", x: 80, y: 85, size: 7, delay: 0.75 },
            // Flowers
            { type: "flower", x: 7, y: 55, size: 4, delay: 0.8 },
            { type: "flower", x: 93, y: 58, size: 3, delay: 0.85 },
            { type: "flower", x: 10, y: 90, size: 4, delay: 0.9 },
            { type: "flower", x: 90, y: 92, size: 3, delay: 0.95 },
        ],
        []
    );

    return (
        <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
            {items.map((item, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: item.delay, duration: 0.5, ease: "easeOut" }}
                >
                    {item.type === "tree" && <TreeSprite size={item.size} />}
                    {item.type === "bush" && <BushSprite size={item.size} />}
                    {item.type === "flower" && <FlowerSprite size={item.size} />}
                </motion.div>
            ))}

            {/* Ground fog / ambient overlay at bottom */}
            <div
                className="absolute bottom-0 left-0 right-0 h-16"
                style={{
                    background:
                        "linear-gradient(to top, rgba(30,40,30,0.25), transparent)",
                }}
            />
        </div>
    );
};

/* ── Sprite sub-components ── */

const TreeSprite = ({ size }: { size: number }) => (
    <div className="flex flex-col items-center">
        {/* Canopy */}
        <div
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                background: "radial-gradient(circle at 35% 30%, #81c784, #388e3c)",
                boxShadow: "0 2px 4px rgba(56,142,60,0.4)",
            }}
        />
        {/* Trunk */}
        <div
            style={{
                width: Math.max(2, size * 0.18),
                height: size * 0.35,
                background: "#795548",
                marginTop: -2,
                borderRadius: "0 0 1px 1px",
            }}
        />
        {/* Shadow */}
        <div
            style={{
                width: size * 0.8,
                height: size * 0.2,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.15)",
                marginTop: 1,
            }}
        />
    </div>
);

const BushSprite = ({ size }: { size: number }) => (
    <div className="flex flex-col items-center">
        <div
            style={{
                width: size,
                height: size * 0.65,
                borderRadius: "50% 50% 40% 40%",
                background: "radial-gradient(circle at 40% 40%, #a5d6a7, #4caf50)",
                boxShadow: "0 1px 3px rgba(76,175,80,0.3)",
            }}
        />
        <div
            style={{
                width: size * 0.6,
                height: size * 0.15,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.1)",
                marginTop: 1,
            }}
        />
    </div>
);

const FlowerSprite = ({ size }: { size: number }) => {
    const colors = ["#e91e63", "#ff9800", "#ffeb3b", "#9c27b0"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    return (
        <motion.div
            className="rounded-full"
            style={{
                width: size,
                height: size,
                background: `radial-gradient(circle, ${color}, ${color}80)`,
                boxShadow: `0 0 ${size}px ${color}40`,
            }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
        />
    );
};

export default IsometricTerrain;
