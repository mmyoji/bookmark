import { type Handlers } from "$fresh/server.ts";
import { assert } from "$std/assert/mod.ts";

import { searchItems } from "@/lib/kv/items.ts";

export const handler: Handlers = {
  async GET(req) {
    const date = new URL(req.url).searchParams.get("date");

    assert(typeof date === "string");

    const items = await searchItems(date);
    return Response.json(items);
  },
};
