import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, Clock, Target, Zap } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import { cn } from "@/lib/utils";

const weeklyData = [
  { day: "MON", hours: 2.5 },
  { day: "TUE", hours: 3.2 },
  { day: "WED", hours: 1.8 },
  { day: "THU", hours: 4.1 },
  { day: "FRI", hours: 3.5 },
  { day: "SAT", hours: 2.0 },
  { day: "SUN", hours: 3.8 },
];

const xpData = [
  { week: "W1", xp: 320 },
  { week: "W2", xp: 480 },
  { week: "W3", xp: 410 },
  { week: "W4", xp: 620 },
];

const stats = [
  { icon: Clock, label: "TOTAL FOCUS", value: "48h", change: "+12%", accent: "text-primary" },
  { icon: Target, label: "SESSIONS", value: "32", change: "AVG 25M", accent: "text-accent" },
  { icon: TrendingUp, label: "BEST STREAK", value: "14d", change: "CURRENT", accent: "text-neon-yellow" },
  { icon: Zap, label: "XP EARNED", value: "2,450", change: "LVL 7", accent: "text-secondary" },
];

const tooltipStyle = {
  background: "hsl(240 20% 8%)",
  border: "1px solid hsl(240 15% 15%)",
  borderRadius: 8,
  fontSize: 11,
  fontFamily: "JetBrains Mono",
};

const AnalyticsPage = () => (
  <MobileLayout>
    <div className="px-5 pt-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="text-[10px] font-mono text-muted-foreground tracking-wider mb-1">WEEKLY REPORT</p>
        <h1 className="font-display text-xl font-bold text-foreground tracking-wide mb-1">ANALYTICS</h1>
        <p className="text-xs text-muted-foreground font-mono">PRODUCTIVITY INSIGHTS</p>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-2.5 mt-6 mb-6"
      >
        {stats.map(({ icon: Icon, label, value, change, accent }) => (
          <div key={label} className="relative rounded-xl bg-card border border-border p-4 overflow-hidden">
            <div className="absolute inset-0 noise" />
            <div className="relative z-10">
              <Icon className={cn("h-4 w-4 mb-2", accent)} style={accent === "text-neon-yellow" ? { color: "hsl(54 100% 50%)" } : undefined} />
              <p className="font-mono text-xl font-bold text-foreground">{value}</p>
              <p className="text-[9px] text-muted-foreground font-display tracking-wider mt-0.5">{label}</p>
              <p className={cn("text-[10px] font-mono mt-1", accent)} style={accent === "text-neon-yellow" ? { color: "hsl(54 100% 50%)" } : undefined}>{change}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Weekly chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative rounded-xl bg-card border border-border p-5 mb-4 overflow-hidden"
      >
        <div className="absolute inset-0 noise" />
        <div className="relative z-10">
          <h2 className="text-[10px] font-display font-semibold text-foreground tracking-wider mb-4">
            WEEKLY FOCUS HOURS
          </h2>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={weeklyData}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: "hsl(230 12% 48%)", fontFamily: "Orbitron" }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: "hsl(220 14% 92%)" }}
                itemStyle={{ color: "hsl(187 100% 50%)" }}
              />
              <Bar dataKey="hours" radius={[3, 3, 0, 0]}>
                {weeklyData.map((_, i) => (
                  <rect key={i} fill="url(#barGradient)" />
                ))}
              </Bar>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(187 100% 50%)" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="hsl(187 100% 50%)" stopOpacity={0.2} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* XP Trend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative rounded-xl bg-card border border-border p-5 mb-6 overflow-hidden"
      >
        <div className="absolute inset-0 noise" />
        <div className="relative z-10">
          <h2 className="text-[10px] font-display font-semibold text-foreground tracking-wider mb-4">
            XP TREND
          </h2>
          <ResponsiveContainer width="100%" height={110}>
            <LineChart data={xpData}>
              <XAxis
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: "hsl(230 12% 48%)", fontFamily: "Orbitron" }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: "hsl(220 14% 92%)" }}
                itemStyle={{ color: "hsl(255 100% 69%)" }}
              />
              <Line
                type="monotone"
                dataKey="xp"
                stroke="hsl(255 100% 69%)"
                strokeWidth={2}
                dot={{ fill: "hsl(255 100% 69%)", r: 4, strokeWidth: 0 }}
                style={{ filter: "drop-shadow(0 0 4px hsl(255 100% 69% / 0.5))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  </MobileLayout>
);

export default AnalyticsPage;
