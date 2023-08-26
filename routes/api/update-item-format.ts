import { type Handlers } from "$fresh/server.ts";

import { config } from "@/lib/config.ts";
import { runKV } from "@/lib/db/kv.ts";
import { updateItemFormat } from "@/lib/db/items.kv.ts";

function validAuth(auth: string | null): boolean {
  if (!auth) return false;

  const [_, apiKey] = auth.split("Bearer ");
  return !!apiKey && apiKey === config.api.key;
}

export const handler: Handlers = {
  async POST(req) {
    if (!validAuth(req.headers.get("Authorization"))) {
      return new Response(null, { status: 404 });
    }

    await runKV(updateItemFormat());

    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
    });
  },
};
