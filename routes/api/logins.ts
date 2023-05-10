import { assert } from "std/testing/asserts.ts";
import { Handlers } from "$fresh/server.ts";

import { runKV } from "@/lib/kv.ts";
import { createLogin } from "@/lib/logins.repository.ts";
import { hashPassword } from "@/lib/password.ts";

export const handler: Handlers = {
  async POST(req) {
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
