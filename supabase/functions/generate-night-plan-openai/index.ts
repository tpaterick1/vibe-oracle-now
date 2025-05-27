
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { budget, time, numPeople, mood } = await req.json(); // Added mood
    console.log("Received request with params:", { budget, time, numPeople, mood });

    if (!openAIApiKey) {
      console.error("OpenAI API key is not set in environment variables.");
      return new Response(JSON.stringify({ error: "OpenAI API key is not configured." }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let moodString = "";
    if (mood) {
      moodString = ` The desired vibe for the night is ${mood}.`;
    }

    const prompt = `Generate a fun and unique night out plan in St. Augustine, Florida for ${numPeople} people, with a ${budget} budget, for the ${time}.${moodString} Suggest 2-3 distinct venues or activities with brief, exciting descriptions for each. The output should be a concise plan formatted in markdown with clear headings for each venue/activity (e.g., "### Venue/Activity Name") followed by a short teaser/description. Include an overall title for the plan using a single H1 heading (e.g., "# Your Awesome Night Out"). If possible, include a fun tip or a short "Good to Know" section at the end.`;
    console.log("Constructed prompt:", prompt);

    console.log("Sending request to OpenAI API...");
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates exciting night out plans in St. Augustine, Florida. Your plans should be well-structured in Markdown, including an H1 title for the overall plan, H3 titles for each venue/activity, and a brief teaser. Optionally, include a "Good to Know" or "Pro Tip" section at the end.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 400, // Increased slightly to accommodate mood and potentially longer descriptions
      }),
    });

    console.log("OpenAI API response status:", response.status);
    const responseData = await response.json();
    console.log("OpenAI API response data:", responseData);

    if (!response.ok) {
      const errorMessage = responseData.error?.message || `OpenAI API Error: ${response.status}`;
      console.error("OpenAI API error:", errorMessage);
      throw new Error(errorMessage);
    }

    if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message) {
      const generatedPlan = responseData.choices[0].message.content;
      console.log("Generated plan:", generatedPlan);
      return new Response(JSON.stringify({ plan: generatedPlan }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.error("No plan generated or unexpected response structure from OpenAI.");
      throw new Error("No plan generated or unexpected response structure from OpenAI.");
    }
  } catch (error) {
    console.error('Error in generate-night-plan-openai function:', error);
    return new Response(JSON.stringify({ error: error.message || "Failed to generate plan." }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
