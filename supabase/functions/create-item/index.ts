import { serve } from "std/http/server.ts";
import { createClient } from "supabase-js";

import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { url } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") || "http://localhost:54321",
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  const { data, error } = await supabase.from("items").insert({
    url,
  });

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }

  console.log({ data });

  return new Response(JSON.stringify(data), {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    status: 201,
  });
});

// To invoke:
// curl -X POST 'http://localhost:54321/functions/v1/create-item' \
//   -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
//   -H 'Content-Type: application/json' \
//   -d '{"url":"https://example.com/foo"}'
