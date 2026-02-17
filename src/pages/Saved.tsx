import { useState, useEffect } from "react";
import { Save, Trash2, Film, Music, Palette, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const iconMap: Record<string, any> = { movie: Film, song: Music, animated: Palette };

const Saved = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<"movie" | "song" | "animated">("movie");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchItems = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from("saved_content").select("*").eq("user_id", user.id).eq("content_type", tab).order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [tab, user]);

  const deleteItem = async (id: string) => {
    await supabase.from("saved_content").delete().eq("id", id);
    toast.success("Deleted");
    fetchItems();
  };

  const tabs = [
    { key: "movie" as const, label: "Movies", icon: Film },
    { key: "song" as const, label: "Songs", icon: Music },
    { key: "animated" as const, label: "Animated", icon: Palette },
  ];

  return (
    <PageShell title="Saved Content" subtitle="Your saved movies, songs & animations" icon={<Save className="w-7 h-7 text-foreground" />} gradientClass="from-amber-500 to-orange-500">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${tab === t.key ? "bg-primary text-primary-foreground neon-glow" : "glass text-muted-foreground hover:text-foreground"}`}>
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="glass rounded-2xl p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
        ) : items.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-muted-foreground text-sm">No saved {tab}s yet. Generate content and save it!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-foreground font-semibold text-sm">{item.title}</h3>
                    <p className="text-muted-foreground text-xs">{item.language} · {new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                      <Save className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteItem(item.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
                {expanded === item.id && (
                  <div className="bg-muted/30 rounded-xl p-3 max-h-60 overflow-y-auto">
                    <p className="text-foreground text-xs whitespace-pre-wrap">{item.content_text}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default Saved;
