import { type Handlers } from "$fresh/server.ts";
import { assert } from "$std/assert/mod.ts";

import { type State } from "@/lib/context.ts";
import { createItem } from "@/lib/kv/items.ts";
import { parseTitle } from "@/lib/html-parser.ts";
import { redirect } from "@/lib/response.utils.ts";

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
      return redirect({ location: "/login" });
    }

    const form = await req.formData();
    const url = form.get("url");

    assert(typeof url === "string");

    const title = await fetchTitle(url);
    await createItem({ date: new Date(), url, title });

    return redirect({ location: "/" });
  },
};
