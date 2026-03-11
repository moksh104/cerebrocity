import { motion } from "framer-motion";

/* ── Isometric road network connecting building positions ── */

const IsometricRoads = () => {
  // Road segments as diamond-shaped tiles positioned between buildings
  const roadTiles = [
    // Main horizontal road
    { x: 20, y: 50, w: 60, h: 4, angle: 0 },
    // Vertical roads
    { x: 30, y: 25, w: 4, h: 30, angle: 0 },
    { x: 55, y: 20, w: 4, h: 35, angle: 0 },
    { x: 75, y: 30, w: 4, h: 25, angle: 0 },
    // Cross road
    { x: 20, y: 80, w: 60, h: 4, angle: 0 },
    // Connecting streets
    { x: 42, y: 55, w: 4, h: 28, angle: 0 },
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full z-[2] pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="roadColor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(120,120,120,0.06)" />
          <stop offset="50%" stopColor="rgba(150,150,150,0.12)" />
          <stop offset="100%" stopColor="rgba(120,120,120,0.06)" />
        </linearGradient>
        <filter id="roadBlur">
          <feGaussianBlur stdDeviation="0.3" />
        </filter>
      </defs>

      {roadTiles.map((road, i) => (
        <motion.rect
          key={i}
          x={road.x}
          y={road.y}
          width={road.w}
          height={road.h}
          rx="1"
          fill="url(#roadColor)"
          filter="url(#roadBlur)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
        />
      ))}

      {/* Dashed center lines */}
      {[
        "M 20 52 L 80 52",
        "M 32 25 L 32 55",
        "M 57 20 L 57 55",
        "M 44 55 L 44 83",
      ].map((d, i) => (
        <motion.path
          key={`dash-${i}`}
          d={d}
          fill="none"
          stroke="rgba(200,200,200,0.08)"
          strokeWidth="0.3"
          strokeDasharray="1.5 2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
};

export default IsometricRoads;
