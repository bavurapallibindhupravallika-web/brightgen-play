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
    const REPLICATE_API_TOKEN = Deno.env.get("REPLICATE_API_TOKEN");
    if (!REPLICATE_API_TOKEN) {
      throw new Error("REPLICATE_API_TOKEN is not configured");
    }

    const { topic } = await req.json();
    if (!topic) {
      throw new Error("Topic is required");
    }

    const prompt = `A high-quality 3D cinematic study animation movie about ${topic}`;

    // Create prediction with retry for rate limits
    let prediction: any;
    for (let retry = 0; retry < 3; retry++) {
      const createResp = await fetch(
        "https://api.replicate.com/v1/models/minimax/video-01-live/predictions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: {
              prompt,
              prompt_optimizer: true,
            },
          }),
        }
      );

      if (createResp.status === 429) {
        console.log("Rate limited, waiting 15s...");
        await new Promise((r) => setTimeout(r, 15000));
        continue;
      }

      if (!createResp.ok) {
        const errText = await createResp.text();
        throw new Error(`Replicate error [${createResp.status}]: ${errText}`);
      }

      prediction = await createResp.json();
      break;
    }

    if (!prediction) {
      throw new Error("Failed after retries — rate limited. Please try again in a minute.");
    }
    console.log("Prediction created:", prediction.id, prediction.status);

    const getUrl = prediction.urls?.get;
    if (!getUrl) {
      throw new Error("No get URL in prediction response");
    }

    // Poll for completion (max ~5 minutes)
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 5000));

      const pollResp = await fetch(getUrl, {
        headers: { Authorization: `Bearer ${REPLICATE_API_TOKEN}` },
      });

      if (!pollResp.ok) {
        const pollErr = await pollResp.text();
        console.error(`Poll error: ${pollErr}`);
        continue;
      }

      const pollData = await pollResp.json();
      console.log(`Poll ${i + 1}: status=${pollData.status}`);

      if (pollData.status === "failed" || pollData.status === "canceled") {
        throw new Error("Generation failed: " + (pollData.error || "Unknown error"));
      }

      if (pollData.status === "succeeded") {
        // Output is typically a URL string or array of URLs
        const videoUrl = Array.isArray(pollData.output) ? pollData.output[0] : pollData.output;
        if (!videoUrl) {
          throw new Error("No video URL in output");
        }

        // Download and return the video
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
