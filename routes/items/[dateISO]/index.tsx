import { type Handlers } from "$fresh/server.ts";
import { type State } from "@/lib/context.ts";
import { deleteItem } from "@/lib/kv/items.ts";

export const handler: Handlers<unknown, State> = {
  async DELETE(_req, ctx) {
    if (!ctx.state.currentUser) {
      return new Response(null, { status: 401 });
    }

    if (!("dateISO" in ctx.params) || !ctx.params.dateISO) {
      return new Response(null, { status: 404 });
    }

    await deleteItem(ctx.params.dateISO);

    return new Response(null, { status: 204 });
  },
};
