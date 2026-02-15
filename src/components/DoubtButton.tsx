import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const DoubtButton = ({ className = "" }: { className?: string }) => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate("/ai-chat")}
      className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground neon-glow shadow-lg p-0 ${className}`}
    >
      <HelpCircle className="w-6 h-6" />
    </Button>
  );
};

export default DoubtButton;
