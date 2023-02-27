import { serve } from "std/http/server.ts";
import { createClient } from "supabase-js";

const key = "created_at";

serve(async (req) => {
  // e.g., created_at="2023-02-26"
  const { created_at: createdAt } = (await req.json()) as {
    created_at: string;
  };

  const d = new Date(`${createdAt}T00:00:00.000+0000`);
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
    .gte(key, createdAt)
    .lt(key, tomorrow)
    .order(key, { ascending: true });

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
