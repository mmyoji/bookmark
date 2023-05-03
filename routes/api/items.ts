import { assert } from "std/testing/asserts.ts";
import { DOMParser } from "linkedom";

import { type Handlers } from "$fresh/server.ts";

import { ItemsRepository } from "@/lib/items.repository.ts";
import { createSupabaseClient } from "@/lib/supabase.ts";

async function fetchTitle(url: string): Promise<string> {
  const res = await fetch(url).catch(() => undefined);
  if (!res || !res.ok) {
    return "";
  }

  const text = await res.text().catch(() => "");
  if (!text) return "";

  const doc = new DOMParser().parseFromString(text, "text/html");
  if (!doc) return "";

  const title = doc.querySelector("title");
  if (!title || !title.textContent) return "";

  return title.textContent;
}

export const handler: Handlers = {
  async POST(req) {
    const form = await req.formData();
    const url = form.get("url");

    assert(typeof url === "string");

    const title = await fetchTitle(url);

    const headers = new Headers();
    const supabase = createSupabaseClient(req.headers, headers);

    const { data: { session } } = await supabase.auth.getSession();

    assert(session);

    const kv = await Deno.openKv();
    const date = new Date().toISOString().slice(0, 10);
    const repo = new ItemsRepository(kv);
    await repo.create({
      date,
      url,
      title,
    });

    await kv.close();

    return new Response(null, { headers: { location: "/" }, status: 302 });
  },
};
