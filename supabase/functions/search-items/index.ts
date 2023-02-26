import { serve } from "std/http/server.ts";
import { createClient } from "supabase-js";

serve(async (req) => {
  // e.g., created_at="2023-02-26"
  const { created_at } = await req.json();

  const d = new Date(`${created_at}T00:00:00.000+0900`);
  const date = d.getDate();
  d.setDate(date + 1);
  const tomorrow = d.toISOString().slice(0, 10);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") || "http://localhost:54321",
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .gte("created_at", created_at)
    .lt("created_at", tomorrow);

  if (error) {
    console.error(error);
    return new Response(JSON.stringify(error), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
});

// To invoke:
// curl -X POST 'http://localhost:54321/functions/v1/search-item' \
//   -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
//   -H 'Content-Type: application/json' \
//   -d '{"created_at":"2023-02-11"}'
