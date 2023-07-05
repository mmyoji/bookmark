import { Head } from "$fresh/runtime.ts";
import { type Handlers, type PageProps } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { assert } from "$std/testing/asserts.ts";

import { AuthForm } from "@/components/AuthForm.tsx";
import { Notice } from "@/components/Notice.tsx";

import { appConfig } from "@/lib/app.config.ts";
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
      const headers = new Headers();
      headers.set("location", "/");
      return new Response(null, { headers, status: 302 });
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

export default function LoginPage({ data }: PageProps<Data>) {
  const { error } = data;

  return (
    <>
      <Head>
        <title>Login - {appConfig.name}</title>
      </Head>

      <div class="max-w-xs flex h-screen m-auto">
        <div class="m-auto space-y-8 w-72">
          <a href="/">
            <img src="/logo.svg" alt="Logo" class="h-24 w-auto mx-auto" />
          </a>
          {!!error && <Notice message={error} color="yellow" />}
          <AuthForm />
        </div>
      </div>
    </>
  );
}
