import { useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, Clapperboard, Gamepad2, User } from "lucide-react";

const tabs = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: BookOpen, label: "Learn", path: "/learn" },
  { icon: Clapperboard, label: "Studio", path: "/story-studio" },
  { icon: Gamepad2, label: "Games", path: "/games" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass-strong border-t border-border/30 px-2 py-2 safe-area-bottom">
        <div className="max-w-lg mx-auto flex items-center justify-around">
          {tabs.map((tab) => {
            const active = location.pathname === tab.path || location.pathname.startsWith(tab.path + "/");
            return (
              <button
                key={tab.label}
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                  active
                    ? "text-primary scale-105"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className={`w-5 h-5 ${active ? "drop-shadow-[0_0_6px_hsl(var(--primary))]" : ""}`} />
                <span className="text-[10px] font-bold">{tab.label}</span>
                {active && (
                  <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
