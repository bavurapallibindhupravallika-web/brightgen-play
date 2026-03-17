import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HF_TOKEN = Deno.env.get("HF_TOKEN");
    if (!HF_TOKEN) {
      throw new Error("HF_TOKEN is not configured");
    }

    const { topic } = await req.json();
    if (!topic) {
      throw new Error("Topic is required");
    }

    const prompt = `A high-quality 3D cinematic study animation movie about ${topic}`;

    // Use the fal-ai provider for text-to-video via HF router
    const submitResponse = await fetch(
      "https://router.huggingface.co/fal-ai/models/tencent/HunyuanVideo",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      throw new Error(`HF API error [${submitResponse.status}]: ${errorText}`);
    }

    // Check if we got a direct response (binary) or a polling URL
    const contentType = submitResponse.headers.get("content-type") || "";
    
    if (contentType.includes("video") || contentType.includes("octet-stream")) {
      // Direct binary response
      const videoBlob = await submitResponse.arrayBuffer();
      return new Response(videoBlob, {
        headers: { ...corsHeaders, "Content-Type": "video/mp4" },
      });
    }

    // Async polling response
    const submitData = await submitResponse.json();
    const statusUrl = submitData.status_url || submitData.url;

    if (!statusUrl) {
      // Response might contain the video URL directly
      if (submitData.video?.url || submitData[0]?.url) {
        const videoUrl = submitData.video?.url || submitData[0]?.url;
        const videoResp = await fetch(videoUrl);
        const videoBlob = await videoResp.arrayBuffer();
        return new Response(videoBlob, {
          headers: { ...corsHeaders, "Content-Type": "video/mp4" },
        });
      }
      throw new Error("No status URL or video in response: " + JSON.stringify(submitData));
    }

    // Poll for completion (max ~5 minutes)
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 5000));

      const pollResp = await fetch(statusUrl, {
        headers: { Authorization: `Bearer ${HF_TOKEN}` },
      });

      if (!pollResp.ok) {
        const pollErr = await pollResp.text();
        throw new Error(`Poll error [${pollResp.status}]: ${pollErr}`);
      }

      const pollData = await pollResp.json();
      
      if (pollData.status === "failed" || pollData.error) {
        throw new Error("Generation failed: " + (pollData.error || "Unknown"));
      }

      if (pollData.status === "completed" || pollData.video?.url || pollData[0]?.url) {
        const videoUrl = pollData.video?.url || pollData[0]?.url || pollData.output?.video?.url;
        if (!videoUrl) throw new Error("No video URL in completed response");
        
        const videoResp = await fetch(videoUrl);
        const videoBlob = await videoResp.arrayBuffer();
        return new Response(videoBlob, {
          headers: { ...corsHeaders, "Content-Type": "video/mp4" },
        });
      }
    }

    throw new Error("Video generation timed out after 5 minutes");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("generate-video error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
