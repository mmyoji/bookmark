import { type MiddlewareHandler } from "$fresh/server.ts";
import { getCookies } from "@std/http";

import { config } from "@/lib/config.ts";
import { type State } from "@/lib/context.ts";
import { findLogin } from "@/lib/kv/logins.ts";

export const handler: MiddlewareHandler<State> = async (req, ctx) => {
  const uid = getCookies(req.headers)[config.cookies.key.uid];
  if (!uid) return ctx.next();

  const login = await findLogin(uid);
  if (!login) return ctx.next();

  ctx.state.currentUser = { username: login.username };

  return ctx.next();
};
