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
    const headers = {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    };

    // Use Wan2.1-T2V-1.3B (smaller, faster model) via fal-ai provider on HF router
    // providerId from HF mapping: fal-ai/wan/v2.1/1.3b/text-to-video
    const submitUrl = "https://router.huggingface.co/fal-ai/wan/v2.1/1.3b/text-to-video?_subdomain=queue";
    
    const submitResp = await fetch(submitUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ prompt }),
    });

    const submitText = await submitResp.text();
    console.log("Submit status:", submitResp.status, "body:", submitText);

    if (!submitResp.ok) {
      throw new Error(`HF API [${submitResp.status}]: ${submitText}`);
    }

    const submitData = JSON.parse(submitText);
    const requestId = submitData.request_id;
    if (!requestId) {
      // Maybe we got the result directly
      const videoUrl = submitData?.video?.url;
      if (videoUrl) {
        const videoResp = await fetch(videoUrl);
        const videoBlob = await videoResp.arrayBuffer();
        return new Response(videoBlob, {
          headers: { ...corsHeaders, "Content-Type": "video/mp4" },
        });
      }
      throw new Error("No request_id: " + submitText);
    }

    // Extract provider model path from response_url
    const responseUrl = submitData.response_url;
    let statusPath: string;
    let resultPath: string;
    
    if (responseUrl) {
      const parsed = new URL(responseUrl);
      statusPath = `https://router.huggingface.co/fal-ai${parsed.pathname}/status?_subdomain=queue`;
      resultPath = `https://router.huggingface.co/fal-ai${parsed.pathname}?_subdomain=queue`;
    } else {
      statusPath = `https://router.huggingface.co/fal-ai/wan/v2.1/1.3b/text-to-video/requests/${requestId}/status?_subdomain=queue`;
      resultPath = `https://router.huggingface.co/fal-ai/wan/v2.1/1.3b/text-to-video/requests/${requestId}?_subdomain=queue`;
    }

    console.log("Polling status at:", statusPath);

    // Poll for up to 5 minutes
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 5000));

      const pollResp = await fetch(statusPath, { headers });
      const pollText = await pollResp.text();
      console.log(`Poll ${i + 1}: status=${pollResp.status} body=${pollText}`);

      if (!pollResp.ok) continue;

      const pollData = JSON.parse(pollText);

      if (pollData.status === "FAILED") {
        throw new Error("Generation failed: " + pollText);
      }

      if (pollData.status === "COMPLETED") {
        const resultResp = await fetch(resultPath, { headers });
        const resultData = await resultResp.json();
        console.log("Result:", JSON.stringify(resultData));

        const videoUrl = resultData?.video?.url;
        if (!videoUrl) throw new Error("No video URL in result");

        const videoResp = await fetch(videoUrl);
        const videoBlob = await videoResp.arrayBuffer();
        return new Response(videoBlob, {
          headers: { ...corsHeaders, "Content-Type": "video/mp4" },
        });
      }
    }

    throw new Error("Timed out after 5 minutes");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("generate-video error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
