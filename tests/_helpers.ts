import { createHandler } from "$fresh/server.ts";

import manifest from "@/fresh.gen.ts";
import { config } from "@/lib/config.ts";
import { kv } from "@/lib/db/kv.ts";
import { createLogin } from "@/lib/db/logins.kv.ts";
import { hashPassword } from "@/lib/password.ts";

const hostname = "127.0.0.1";

export const origin = `http://${hostname}`;

const TEST_LOGIN = {
  username: "test-user",
  hashedPassword: hashPassword("P@s$w0rd"),
};

export async function loginHeaders(): Promise<
  { headers: Headers; teardown: () => Promise<void> }
> {
  await createLogin(TEST_LOGIN)(kv);

  const headers = new Headers();
  headers.set("Cookie", `${config.cookies.key.uid}=${TEST_LOGIN.username}`);
  return {
    headers,
    teardown: async () => {
      await kv.delete(["logins", TEST_LOGIN.username]);
    },
  };
}

export async function visit(req: Request) {
  const handler = await createHandler(manifest);
  return handler(req);
}
