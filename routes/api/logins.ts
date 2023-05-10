import { type Handlers } from "$fresh/server.ts";
import { assert } from "$std/testing/asserts.ts";

import { runKV } from "@/lib/db/kv.ts";
import { createLogin } from "@/lib/db/logins.kv.ts";
import { hashPassword } from "@/lib/password.ts";

function validAuth(auth: string | null): boolean {
  if (!auth) return false;

  const [_, apiKey] = auth.split("Bearer ");
  return !!apiKey && apiKey === Deno.env.get("API_KEY");
}

export const handler: Handlers = {
  async POST(req) {
    if (!validAuth(req.headers.get("Authorization"))) {
      return new Response(null, { status: 404 });
    }

    const params = await req.json();

    assert(typeof params.username === "string");
    assert(typeof params.password === "string");

    const data = {
      username: params.username,
      encryptedPassword: await hashPassword(params.password),
    };

    await runKV(createLogin(data));

    return new Response(JSON.stringify({ message: "Created" }), {
      status: 201,
    });
  },
};
