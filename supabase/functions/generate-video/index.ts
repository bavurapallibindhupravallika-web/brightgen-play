import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const FAL_PROVIDER_MODEL = "fal-ai/hunyuan-video";
const HF_ROUTER_BASE = "https://router.huggingface.co";

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
    const authHeaders = {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    };

    // Submit to fal-ai queue via HF router
    const submitUrl = `${HF_ROUTER_BASE}/${FAL_PROVIDER_MODEL}?_subdomain=queue`;
    console.log("Submitting to:", submitUrl);

    const submitResp = await fetch(submitUrl, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ prompt }),
    });

    if (!submitResp.ok) {
      const errText = await submitResp.text();
      throw new Error(`Hugging Face API error [${submitResp.status}]: ${errText}`);
    }

    const submitData = await submitResp.json();
    console.log("Submit response:", JSON.stringify(submitData));

    const requestId = submitData.request_id;
    if (!requestId) {
      throw new Error("No request_id in submit response: " + JSON.stringify(submitData));
    }

    // Extract the provider model path from response_url for status/result polling
    const responseUrl = submitData.response_url || "";
    const providerModelPath = responseUrl ? new URL(responseUrl).pathname : `/${FAL_PROVIDER_MODEL}/requests/${requestId}`;

    const statusUrl = `${HF_ROUTER_BASE}/fal-ai${providerModelPath}/status?_subdomain=queue`;
    const resultUrl = `${HF_ROUTER_BASE}/fal-ai${providerModelPath}?_subdomain=queue`;

    console.log("Status URL:", statusUrl);
    console.log("Result URL:", resultUrl);

    // Poll for completion (max ~5 minutes)
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 5000));

      const pollResp = await fetch(statusUrl, { headers: authHeaders });
      if (!pollResp.ok) {
        const pollErr = await pollResp.text();
        console.error(`Poll error [${pollResp.status}]:`, pollErr);
        // Continue polling on transient errors
        continue;
      }

      const pollData = await pollResp.json();
      console.log(`Poll ${i + 1}:`, JSON.stringify(pollData));

      if (pollData.status === "FAILED") {
        throw new Error("Generation failed: " + JSON.stringify(pollData));
      }

      if (pollData.status === "COMPLETED") {
        // Fetch the result
        const resultResp = await fetch(resultUrl, { headers: authHeaders });
        if (!resultResp.ok) {
          const resultErr = await resultResp.text();
          throw new Error(`Result fetch error [${resultResp.status}]: ${resultErr}`);
        }

        const resultData = await resultResp.json();
        console.log("Result data:", JSON.stringify(resultData));

        // Extract video URL from result
        const videoUrl = resultData?.video?.url || resultData?.output?.video?.url;
        if (!videoUrl) {
          throw new Error("No video URL in result: " + JSON.stringify(resultData));
        }

        // Download the video and return it
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
