import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export const useSaveContent = () => {
  const { user } = useAuth();

  const saveContent = async (params: {
    content_type: string;
    title: string;
    topic: string;
    language: string;
    content_text: string;
  }) => {
    if (!user) {
      toast.error("Please login to save content");
      return false;
    }
    const { error } = await supabase.from("saved_content").insert({
      user_id: user.id,
      ...params,
    });
    if (error) {
      toast.error("Failed to save");
      return false;
    }
    toast.success("Content saved!");
    return true;
  };

  return { saveContent };
};
