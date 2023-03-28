import { Head } from "$fresh/runtime.ts";
import { type PageProps } from "$fresh/server.ts";

import { AuthForm } from "@/components/AuthForm.tsx";
import { Notice } from "@/components/Notice.tsx";

export default function LoginPage(props: PageProps) {
  const errorMessage = props.url.searchParams.get("error");

  return (
    <>
      <Head>
        <title>Login - Archive Reminder</title>
      </Head>

      <div class="max-w-xs flex h-screen m-auto">
        <div class="m-auto space-y-8 w-72">
          <a href="/">
            <img
              src="/logo.svg"
              alt="Logo"
              class="h-24 w-auto mx-auto"
            />
          </a>
          {errorMessage === "Invalid login credentials" && (
            <Notice message={errorMessage} color="yellow" />
          )}
          <AuthForm type="Login" />
        </div>
      </div>
    </>
  );
}