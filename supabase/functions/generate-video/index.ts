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

    const response = await fetch(
      "https://api-inference.huggingface.co/models/ali-vilab/text-to-video-ms-1.7b",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face API error [${response.status}]: ${errorText}`);
    }

    const videoBlob = await response.arrayBuffer();

    return new Response(videoBlob, {
      headers: {
        ...corsHeaders,
        "Content-Type": "video/mp4",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("generate-video error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
