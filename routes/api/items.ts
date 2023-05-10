import { type Handlers } from "$fresh/server.ts";
import { assert } from "$std/testing/asserts.ts";

import { DOMParser } from "linkedom";

import { State } from "@/lib/context.ts";
import { createItem } from "@/lib/items.repository.ts";
import { runKV } from "@/lib/kv.ts";

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

export const handler: Handlers<unknown, State> = {
  async POST(req, ctx) {
    if (!ctx.state.currentUser) {
      const headers = new Headers();
      headers.set("location", "/login");
      return new Response(null, { headers, status: 302 });
    }

    const form = await req.formData();
    const url = form.get("url");

    assert(typeof url === "string");

    const title = await fetchTitle(url);
    const date = new Date().toISOString().slice(0, 10);

    await runKV(createItem({ date, url, title }));

    return new Response(null, { headers: { location: "/" }, status: 302 });
  },
};
