import { deleteItem } from "@/lib/kv/items.ts";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  async DELETE(ctx) {
    if (!ctx.state.currentUser) {
      return new Response(null, { status: 401 });
    }

    if (!("dateISO" in ctx.params) || !ctx.params.dateISO) {
      return new Response(null, { status: 404 });
    }

    await deleteItem(ctx.params.dateISO);

    return new Response(null, { status: 204 });
  },
});
