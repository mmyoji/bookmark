import { app } from "../main.ts";

import { config } from "@/lib/config.ts";
import { kv } from "@/lib/kv/_core.ts";
import { kvHelper } from "@/lib/kv/_test-helpers.ts";

const hostname = "127.0.0.1";

export const origin = `http://${hostname}`;

const username = "test-user";

export async function loginHeaders(): Promise<
  { headers: Headers; teardown: () => Promise<void> }
> {
  await kvHelper.login.create({ username, password: "P@s$w0rd" });

  const headers = new Headers();
  headers.set("Cookie", `${config.cookies.key.uid}=${username}`);
  return {
    headers,
    teardown: async () => {
      await kv.delete(["logins", username]);
    },
  };
}

export function visit(req: Request) {
  return app.handler()(req);
}
