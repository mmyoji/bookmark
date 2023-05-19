import { type Handlers } from "$fresh/server.ts";
import { assert } from "$std/testing/asserts.ts";
import { setCookie } from "$std/http/cookie.ts";

import { appConfig } from "@/lib/app.config.ts";
import { runKV } from "@/lib/db/kv.ts";
import { findLogin } from "@/lib/db/logins.kv.ts";
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

    const result = verifyPassword(password, login.hashedPassword);
    if (!result) {
      return errorResposne(headers);
    }

    const redirectUrl = new URL(req.url).searchParams.get("redirect_url") ??
      "/";
    setCookie(headers, {
      name: appConfig.cookies.key.uid,
      value: login.username,
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: !!appConfig.deploy.id,
      sameSite: "Lax",
      path: "/",
    });
    headers.set("location", redirectUrl);
    return new Response(null, { headers, status: 302 });
  },
};
