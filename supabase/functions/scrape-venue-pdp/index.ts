import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!FIRECRAWL_API_KEY) {
    console.error("FIRECRAWL_API_KEY is not set in environment variables.");
    return new Response(JSON.stringify({ error: "Firecrawl API key not configured." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Supabase URL or Service Role Key is not set.");
    return new Response(JSON.stringify({ error: "Supabase connection details not configured." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
  
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  let urlToScrape: string | null = null;
  try {
    const body = await req.json();
    urlToScrape = body.url;
    if (!urlToScrape || typeof urlToScrape !== 'string') {
      throw new Error("Invalid or missing 'url' in request body.");
    }
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new Response(JSON.stringify({ error: "Invalid request body. Expecting JSON with a 'url' property." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }

  console.log(`Attempting to scrape URL: ${urlToScrape}`);

  try {
    const firecrawlResponse = await fetch("https://api.firecrawl.dev/v0/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({ url: urlToScrape }),
    });

    if (!firecrawlResponse.ok) {
      const errorData = await firecrawlResponse.text();
      console.error(`Firecrawl API error: ${firecrawlResponse.status}`, errorData);
      throw new Error(`Firecrawl API request failed with status ${firecrawlResponse.status}: ${errorData}`);
    }

    const scrapedData = await firecrawlResponse.json();
    console.log("Successfully scraped data from Firecrawl for URL:", urlToScrape);

    if (!scrapedData.data || !scrapedData.data.markdown || !scrapedData.data.metadata) {
        console.error("Firecrawl response missing expected data structure for URL:", urlToScrape, scrapedData);
        throw new Error("Firecrawl response format unexpected. Missing data.markdown or data.metadata.");
    }
    
    const venueName = scrapedData.data.metadata.title || "Unknown Venue Name";
    const venueDescription = scrapedData.data.metadata.description || null;
    const markdownContent = scrapedData.data.markdown;
    const htmlContent = scrapedData.data.html || null; // Optional

    const dataToUpsert = {
      name: venueName,
      source_url: urlToScrape,
      description: venueDescription,
      scraped_content_markdown: markdownContent,
      scraped_content_html: htmlContent,
      // Other fields like categories, address, etc., will be null initially
      // They can be populated later through parsing or AI.
      last_scraped_at: new Date().toISOString(),
    };

    // Upsert into Supabase
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from("scraped_venue_pdp_data")
      .upsert(dataToUpsert, { onConflict: "source_url" })
      .select()
      .single(); // Assuming source_url is unique and we want the upserted record back

    if (dbError) {
      console.error("Supabase upsert error for URL:", urlToScrape, dbError);
      throw dbError;
    }

    console.log("Successfully upserted data into Supabase for URL:", urlToScrape, dbData);
    return new Response(JSON.stringify({ success: true, message: "Venue data scraped and saved.", data: dbData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in scrape-venue-pdp function for URL:", urlToScrape, error);
    return new Response(JSON.stringify({ error: error.message || "Failed to scrape venue data." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
