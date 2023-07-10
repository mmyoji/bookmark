import { type MiddlewareHandler } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";

import { config } from "@/lib/config.ts";
import { type State } from "@/lib/context.ts";
import { runKV } from "@/lib/db/kv.ts";
import { findLogin } from "@/lib/db/logins.kv.ts";

export const handler: MiddlewareHandler<State> = async (req, ctx) => {
  const uid = getCookies(req.headers)[config.cookies.key.uid];
  if (!uid) return ctx.next();

  const login = await runKV(findLogin(uid));
  if (!login) return ctx.next();

  ctx.state.currentUser = { username: login.username };

  return ctx.next();
};
