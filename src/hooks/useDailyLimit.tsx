import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DAILY_LIMIT = 10;

export const useDailyLimit = () => {
  const { user, profile, refreshProfile } = useAuth();

  const canUse = () => {
    if (!profile) return false;
    if (profile.vip_status === "vip") return true;
    const today = new Date().toISOString().split("T")[0];
    if (profile.daily_usage_date !== today) return true;
    return profile.daily_usage_count < DAILY_LIMIT;
  };

  const increment = async () => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    const isNewDay = profile?.daily_usage_date !== today;
    await supabase.from("profiles").update({
      daily_usage_count: isNewDay ? 1 : (profile?.daily_usage_count || 0) + 1,
      daily_usage_date: today,
    }).eq("user_id", user.id);
    await refreshProfile();
  };

  const checkAndUse = async () => {
    if (!canUse()) {
      toast.error("Daily limit reached! Upgrade to VIP for unlimited access.");
      return false;
    }
    await increment();
    return true;
  };

  const remaining = () => {
    if (!profile) return 0;
    if (profile.vip_status === "vip") return Infinity;
    const today = new Date().toISOString().split("T")[0];
    if (profile.daily_usage_date !== today) return DAILY_LIMIT;
    return Math.max(0, DAILY_LIMIT - profile.daily_usage_count);
  };

  return { canUse, checkAndUse, remaining, isVip: profile?.vip_status === "vip" };
};
