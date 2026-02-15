import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompts: Record<string, string> = {
      doubt: "You are StudyFlix AI Assistant — an expert tutor. Answer any question clearly with examples, steps, and explanations. Cover Math, Science, History, Languages, Programming, and all subjects. Keep answers helpful and educational. Use markdown formatting.",
      quiz: "You are a quiz generator. Generate exactly 10 multiple-choice questions on the given topic. Return valid JSON array with objects having: question (string), options (array of 4 strings), correct (index 0-3). Only return the JSON array, no other text.",
      written_test: "You are a written test generator. Generate exactly 5 short-answer questions on the given topic. Return valid JSON array with objects having: question (string), answer (string). Only return the JSON array, no other text.",
      script: "You are a script writer for educational videos. Generate a dialogue-based script on the given topic with characters, dialogue lines, meaning explanations, and practice questions. Use markdown formatting.",
      language_lesson: "You are a language teacher. Generate a lesson with 5 vocabulary words including: word, meaning, example sentence, and pronunciation guide. Then add 3 practice exercises. Return valid JSON with: words (array of {word, meaning, sentence, pronunciation}), exercises (array of {type, question, answer, options?}). Only return JSON.",
    };

    const systemContent = systemPrompts[mode] || systemPrompts.doubt;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemContent },
          ...messages,
        ],
        stream: mode === "doubt" || mode === "script",
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For streaming modes, pass through the stream
    if (mode === "doubt" || mode === "script") {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // For non-streaming modes (quiz, written_test, language_lesson), parse and return
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
