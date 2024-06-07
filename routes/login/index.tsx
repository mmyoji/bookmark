import { type Handlers, type PageProps } from "$fresh/server.ts";
import { AuthForm } from "@/components/AuthForm.tsx";
import { Layout } from "@/components/Layout.tsx";
import { Notice } from "@/components/Notice.tsx";
import { config } from "@/lib/config.ts";
import { type State } from "@/lib/context.ts";
import { redirect } from "@/lib/response.utils.ts";
import { login } from "@/lib/services/login.ts";
import { setCookie } from "@std/http";

type Data = {
  error?: string;
};

export const handler: Handlers<Data, State> = {
  GET(_req, ctx) {
    if (ctx.state.currentUser) {
      return redirect({ location: "/" });
    }

    return ctx.render({});
  },

  async POST(req, ctx) {
    const form = await req.formData();

    const { username, error } = await login({
      username: form.get("username"),
      password: form.get("password"),
    });

    if (error) {
      return ctx.render({ error });
    }

    const redirectUrl = new URL(req.url).searchParams.get("redirect_url") ??
      "/";
    const headers = new Headers();
    setCookie(headers, {
      name: config.cookies.key.uid,
      value: username,
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: !!config.deploy.id,
      sameSite: "Lax",
      path: "/",
    });
    headers.set("location", redirectUrl);
    return redirect(headers);
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
