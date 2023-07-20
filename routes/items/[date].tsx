import { type Handlers } from "$fresh/server.ts";
import { assert } from "$std/assert/mod.ts";

import { type State } from "@/lib/context.ts";
import { deleteItem } from "@/lib/db/items.kv.ts";
import { runKV } from "@/lib/db/kv.ts";

export const handler: Handlers<unknown, State> = {
  async DELETE(req, ctx) {
    if (!ctx.state.currentUser) {
      return new Response(null, { status: 401 });
    }

    const json = (await req.json()) as { url: string };
    assert(typeof json.url == "string" && !!json.url);
    assert(!!ctx.params.date);

    await runKV(
      deleteItem({
        date: ctx.params.date,
        url: json.url,
      }),
    );

    return new Response(null, { status: 204 });
  },
};
