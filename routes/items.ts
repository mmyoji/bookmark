import { type Handlers } from "$fresh/server.ts";
import { assert } from "$std/assert/mod.ts";

import { type State } from "@/lib/context.ts";
import { createItem } from "@/lib/db/items.kv.ts";
import { runKV } from "@/lib/db/kv.ts";
import { parseTitle } from "@/lib/html-parser.ts";

async function fetchTitle(url: string): Promise<string> {
  const res = await fetch(url).catch(() => undefined);
  if (!res || !res.ok) {
    return "";
  }

  const text = await res.text().catch(() => "");
  return parseTitle(text);
}

export const handler: Handlers<unknown, State> = {
  async POST(req, ctx) {
    if (!ctx.state.currentUser) {
      return new Response(null, {
        headers: { location: "/login" },
        status: 302,
      });
    }

    const form = await req.formData();
    const url = form.get("url");

    assert(typeof url === "string");

    const title = await fetchTitle(url);
    await runKV(createItem({ date: new Date(), url, title }));

    return new Response(null, { headers: { location: "/" }, status: 302 });
  },
};
