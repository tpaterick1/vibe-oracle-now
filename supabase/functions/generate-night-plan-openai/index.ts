
import "https://deno.land/x/xhr@0.1.0/mod.ts"; // Required for Deno runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Note: supabase-js v2 has Fetch
// import { OpenAI } from "https://esm.sh/openai@4.20.1"; // Using direct fetch instead of SDK for simplicity here

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or your specific frontend origin
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set in environment variables.");
    return new Response(JSON.stringify({ error: "OpenAI API key not configured." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { budget, time, numPeople, mood, additionalDetails } = await req.json(); // Added additionalDetails
    console.log("Received request with params:", { budget, time, numPeople, mood, additionalDetails });

    let moodString = mood ? `The desired vibe for the night is ${mood}.` : "The user has not specified a particular mood, so be creative or ask for clarification if needed.";
    let detailsString = additionalDetails ? `Additional details from the user: "${additionalDetails}".` : "No additional details were provided.";

    const prompt = `Generate a fun and unique night out plan in St. Augustine, Florida for ${numPeople || '1'} people, with a ${budget || 'flexible'} budget, for the ${time || 'evening'}. ${moodString} ${detailsString} Suggest 2-3 distinct venues or activities with brief, exciting descriptions for each. The output should be a concise plan formatted in markdown with clear headings for each venue/activity (e.g., "### Venue/Activity Name") followed by a short teaser/description. Include an overall title for the plan using a single H1 heading (e.g., "# Your Awesome Night Out"). If possible, include a fun tip or a short "Good to Know" section at the end. Make the descriptions engaging and appealing.`;
    console.log("Constructed prompt:", prompt);

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a creative and enthusiastic local guide for St. Augustine, Florida. Your goal is to generate exciting and personalized night out plans. Always respond in markdown format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 600,
      }),
    });

    console.log("OpenAI API response status:", openaiResponse.status);

    if (!openaiResponse.ok) {
      const errorBody = await openaiResponse.text();
      console.error("OpenAI API error:", errorBody);
      throw new Error(`OpenAI API request failed with status ${openaiResponse.status}: ${errorBody}`);
    }

    const responseData = await openaiResponse.json();
    console.log("OpenAI API response data:", responseData);

    if (!responseData.choices || responseData.choices.length === 0 || !responseData.choices[0].message || !responseData.choices[0].message.content) {
      console.error("Invalid response structure from OpenAI API:", responseData);
      throw new Error("Failed to get a valid plan from OpenAI or response format is unexpected.");
    }
    
    const plan = responseData.choices[0].message.content.trim();
    console.log("Generated plan:", plan);

    return new Response(JSON.stringify({ plan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message || "An unexpected error occurred." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

