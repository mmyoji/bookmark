import { type Handlers } from "$fresh/server.ts";
import { assert } from "$std/testing/asserts.ts";
import { setCookie } from "$std/http/cookie.ts";

import { CookieKey } from "@/lib/cookie-keys.ts";
import { runKV } from "@/lib/kv.ts";
import { findLogin } from "@/lib/logins.repository.ts";
import { verifyPassword } from "@/lib/password.ts";

function errorResposne(headers: Headers) {
  const redirectUrl = `/login?error=${
    encodeURIComponent("You are not allowed to login")
  }`;
  headers.set("location", redirectUrl);
  return new Response(null, { headers, status: 302 });
}

export const handler: Handlers = {
  async POST(req) {
    const headers = new Headers();

    const form = await req.formData();
    const username = form.get("username");
    const password = form.get("password");

    assert(typeof username === "string");
    assert(typeof password === "string");

    const login = await runKV(findLogin(username));
    if (!login) {
      return errorResposne(headers);
    }

    const result = await verifyPassword(password, login.encryptedPassword);
    if (!result) {
      return errorResposne(headers);
    }

    const redirectUrl = new URL(req.url).searchParams.get("redirect_url") ??
      "/";
    setCookie(headers, {
      name: CookieKey.uid,
      value: login.username,
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: !!Deno.env.get("DENO_DEPLOYMENT_ID"),
      sameSite: "Lax",
      path: "/",
    });
    headers.set("location", redirectUrl);
    return new Response(null, { headers, status: 302 });
  },
};
