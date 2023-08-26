import { type Handlers } from "$fresh/server.ts";
import { assert } from "$std/assert/mod.ts";

import { type State } from "@/lib/context.ts";
import { deleteItem, deleteItemLegacy } from "@/lib/db/items.kv.ts";
import { runKV } from "@/lib/db/kv.ts";

export const handler: Handlers<unknown, State> = {
  async DELETE(req, ctx) {
    if (!ctx.state.currentUser) {
      return new Response(null, { status: 401 });
    }

    const json = (await req.json()) as { url: string };
    assert(typeof json.url == "string" && !!json.url);
    assert(!!ctx.params.date);

    const { date: dateISO } = ctx.params;

    if (dateISO.length === 10) {
      await runKV(
        deleteItemLegacy({
          date: dateISO,
          url: json.url,
        }),
      );
    } else {
      await runKV(
        deleteItem({
          date: dateISO.slice(0, 10),
          dateISO,
        }),
      );
    }

    return new Response(null, { status: 204 });
  },
};
