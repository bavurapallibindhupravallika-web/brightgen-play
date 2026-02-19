import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, language, type } = await req.json();
    const PEXELS_API_KEY = Deno.env.get("PEXELS_API_KEY");
    if (!PEXELS_API_KEY) throw new Error("PEXELS_API_KEY is not configured");

    // Build search query from topic and type
    const query = `${topic} ${type || "education"}`.trim();

    const response = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=6&orientation=landscape`,
      {
        headers: { Authorization: PEXELS_API_KEY },
      }
    );

    if (!response.ok) {
      const t = await response.text();
      console.error("Pexels error:", response.status, t);
      throw new Error("Failed to fetch videos");
    }

    const data = await response.json();
    const videos = (data.videos || []).map((v: any) => {
      // Pick the best quality file (HD preferred)
      const hdFile = v.video_files?.find((f: any) => f.quality === "hd" && f.width >= 1280);
      const sdFile = v.video_files?.find((f: any) => f.quality === "sd");
      const file = hdFile || sdFile || v.video_files?.[0];
      return {
        id: v.id,
        url: file?.link || "",
        image: v.image || "",
        duration: v.duration,
        width: file?.width || 0,
        height: file?.height || 0,
        user: v.user?.name || "Unknown",
      };
    }).filter((v: any) => v.url);

    return new Response(JSON.stringify({ videos }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("video-search error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
