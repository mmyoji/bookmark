import { type Handlers } from "$fresh/server.ts";
import { assert } from "$std/assert/mod.ts";

import { type State } from "@/lib/context.ts";
import { deleteItem } from "@/lib/kv/items.ts";

export const handler: Handlers<unknown, State> = {
  async DELETE(_req, ctx) {
    if (!ctx.state.currentUser) {
      return new Response(null, { status: 401 });
    }

    assert(!!ctx.params.dateISO);

    await deleteItem(ctx.params.dateISO);

    return new Response(null, { status: 204 });
  },
};
