import { type Handlers, type PageProps } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { assert } from "$std/testing/asserts.ts";

import { AuthForm } from "@/components/AuthForm.tsx";
import { Layout } from "@/components/Layout.tsx";
import { Notice } from "@/components/Notice.tsx";

import { config } from "@/lib/config.ts";
import { type State } from "@/lib/context.ts";
import { runKV } from "@/lib/db/kv.ts";
import { findLogin } from "@/lib/db/logins.kv.ts";
import { verifyPassword } from "@/lib/password.ts";

type Data = {
  error?: string;
};

const loginFailed = "You are not allowed to login";

export const handler: Handlers<Data, State> = {
  GET(_req, ctx) {
    if (ctx.state.currentUser) {
      return new Response(null, { headers: { location: "/" }, status: 302 });
    }

    return ctx.render({});
  },

  async POST(req, ctx) {
    const form = await req.formData();
    const username = form.get("username");
    const password = form.get("password");

    assert(typeof username === "string");
    assert(typeof password === "string");

    const login = await runKV(findLogin(username));
    if (!login) {
      return ctx.render({ error: loginFailed });
    }

    const result = verifyPassword(password, login.hashedPassword);
    if (!result) {
      return ctx.render({ error: loginFailed });
    }

    const redirectUrl = new URL(req.url).searchParams.get("redirect_url") ??
      "/";
    const headers = new Headers();
    setCookie(headers, {
      name: config.cookies.key.uid,
      value: login.username,
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: !!config.deploy.id,
      sameSite: "Lax",
      path: "/",
    });
    headers.set("location", redirectUrl);
    return new Response(null, { headers, status: 302 });
  },
};

export default function LoginPage({ data: { error } }: PageProps<Data>) {
  return (
    <Layout title="Login">
      <div class="max-w-xs flex h-screen m-auto">
        <div class="m-auto space-y-8 w-72">
          {!!error && <Notice message={error} color="yellow" />}
          <AuthForm />
        </div>
      </div>
    </Layout>
  );
}
