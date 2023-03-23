import { assert } from "std/testing/asserts.ts";

import { type Handlers } from "$fresh/server.ts";

import { createSupabaseClient } from "@/lib/supabase.ts";

const key = "created_at";

export const handler: Handlers = {
  async GET(req) {
    const createdAt = new URL(req.url).searchParams.get(key);

    assert(typeof createdAt === "string");

    const d = new Date(`${createdAt}T00:00:00.000+0000`);
    const date = d.getDate();
    d.setDate(date + 1);
    const tomorrow = d.toISOString().slice(0, 10);

    const headers = new Headers();
    const supabase = createSupabaseClient(req.headers, headers);

    const { data: items, error } = await supabase
      .from("items")
      .select("*")
      .gte(key, createdAt)
      .lt(key, tomorrow)
      .order(key, { ascending: true });

    headers.set("Content-type", "application/json");

    if (error) {
      console.error(error);
      return new Response(JSON.stringify(error), {
        headers,
        status: 400,
      });
    }

    return new Response(JSON.stringify(items), {
      headers,
    });
  },
};
