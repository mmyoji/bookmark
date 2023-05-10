import { Head } from "$fresh/runtime.ts";
import { type Handlers, type PageProps } from "$fresh/server.ts";

import { AuthForm } from "@/components/AuthForm.tsx";
import { Notice } from "@/components/Notice.tsx";

import { type State } from "@/lib/context.ts";

export const handler: Handlers<unknown, State> = {
  GET(_req, ctx) {
    if (ctx.state.currentUser) {
      const headers = new Headers();
      headers.set("location", "/");
      return new Response(null, { headers, status: 302 });
    }

    return ctx.render();
  },
};

export default function LoginPage(props: PageProps) {
  const error = props.url.searchParams.get("error");

  return (
    <>
      <Head>
        <title>Login - Archive Reminder</title>
      </Head>

      <div class="max-w-xs flex h-screen m-auto">
        <div class="m-auto space-y-8 w-72">
          <a href="/">
            <img src="/logo.svg" alt="Logo" class="h-24 w-auto mx-auto" />
          </a>
          {error && <Notice message={error} color="yellow" />}
          <AuthForm type="Login" />
        </div>
      </div>
    </>
  );
}
