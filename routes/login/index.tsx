import { setCookie } from "@std/http";
import { page } from "fresh";

import { AuthForm } from "@/components/AuthForm.tsx";
import { Notice } from "@/components/Notice.tsx";
import { config } from "@/lib/config.ts";
import { redirect } from "@/lib/response.utils.ts";
import { login } from "@/lib/services/login.ts";
import { define } from "@/utils.ts";

type Data = {
  error?: string;
};

export const handler = define.handlers<Data>({
  GET(ctx) {
    if (ctx.state.currentUser) {
      return redirect({ location: "/" });
    }

    ctx.state.title = "Login";

    return page({});
  },

  async POST(ctx) {
    const req = ctx.req;
    const form = await req.formData();

    const { username, error } = await login({
      username: form.get("username"),
      password: form.get("password"),
    });

    if (error) {
      return page({ error });
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
});

export default define.page<never, Data>(({ data: { error } }) => {
  return (
    <div class="max-w-xs flex h-screen m-auto">
      <div class="m-auto space-y-8 w-72">
        {!!error && <Notice message={error} color="yellow" />}
        <AuthForm />
      </div>
    </div>
  );
});
