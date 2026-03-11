import { Home, Timer, Building2, BarChart3 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/home", icon: Home, label: "HOME" },
  { path: "/focus", icon: Timer, label: "FOCUS" },
  { path: "/empire", icon: Building2, label: "EMPIRE" },
  { path: "/analytics", icon: BarChart3, label: "STATS" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-1.5 transition-all",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5", active && "animate-neon-breathe")} />
                {active && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-primary glow-cyan-sm" />
                )}
              </div>
              <span className="font-display text-[9px] tracking-wider">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
