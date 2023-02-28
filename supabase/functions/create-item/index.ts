import { serve } from "std/http/server.ts";
import { createClient } from "supabase-js";

// const SERVICE_ROLE =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnd3RiZ2Joa3dmeGZobHViaG5lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3NzQwNzQwOCwiZXhwIjoxOTkyOTgzNDA4fQ.ASlyhCYZJzzZOdvdKAEZ7kbTXeUjQL06Ts1a-SiE-eY";

serve(async (req) => {
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
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  console.log({ data });

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
    status: 201,
  });
});

// To invoke:
// curl -X POST 'http://localhost:54321/functions/v1/create-item' \
//   -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
//   -H 'Content-Type: application/json' \
//   -d '{"url":"https://example.com/foo"}'
