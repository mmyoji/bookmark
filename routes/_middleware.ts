import { getCookies } from "@std/http";

import { config } from "@/lib/config.ts";
import { findLogin } from "@/lib/kv/logins.ts";
import { define } from "@/utils.ts";

export const handler = define.middleware(async (ctx) => {
  const uid = getCookies(ctx.req.headers)[config.cookies.key.uid];
  if (!uid) return ctx.next();

  const login = await findLogin(uid);
  if (!login) return ctx.next();

  ctx.state.currentUser = { username: login.username };

  return ctx.next();
});
