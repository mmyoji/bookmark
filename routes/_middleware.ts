import { MiddlewareHandler } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";

import { State } from "@/lib/context.ts";
import { CookieKey } from "@/lib/cookie-keys.ts";
import { runKV } from "@/lib/kv.ts";
import { findLogin } from "@/lib/logins.repository.ts";

export const handler: MiddlewareHandler<State> = async (req, ctx) => {
  const uid = getCookies(req.headers)[CookieKey.uid];
  if (!uid) return ctx.next();

  const login = await runKV(findLogin(uid));
  if (!login) return ctx.next();

  ctx.state.currentUser = { username: login.username };

  return ctx.next();
};
