import { assert } from "std/testing/asserts.ts";

import { type Handlers } from "$fresh/server.ts";

import { ItemsRepository } from "@/lib/items.repository.ts";
import { createSupabaseClient } from "@/lib/supabase.ts";

const key = "created_at";

function getTomorrow(base: string): string {
  const d = new Date(`${base}T00:00:00.000+0000`);
  const date = d.getDate();
  d.setDate(date + 1);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export const handler: Handlers = {
  async GET(req) {
    const createdAt = new URL(req.url).searchParams.get(key);

    assert(typeof createdAt === "string");

    const tomorrow = getTomorrow(createdAt);

    const headers = new Headers();
    const supabase = createSupabaseClient(req.headers, headers);

    headers.set("Content-type", "application/json");

    const repo = new ItemsRepository(supabase);
    const { data: items, error } = await repo.findMany(createdAt, tomorrow);

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
