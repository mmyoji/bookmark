import { assert } from "std/testing/asserts.ts";

import { type Handlers } from "$fresh/server.ts";

import { createSupabaseClient } from "@/lib/supabase.ts";

export const handler: Handlers = {
  async POST(req) {
    const form = await req.formData();
    const email = form.get("email");
    const password = form.get("password");

    assert(typeof email === "string");
    assert(typeof password === "string");

    const headers = new Headers();
    const supabase = createSupabaseClient(req.headers, headers);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    let redirectUrl = new URL(req.url).searchParams.get("redirect_url") ??
      "/";
    if (error) {
      redirectUrl = `/login?error=${encodeURIComponent(error.message)}`;
    }

    headers.set("location", redirectUrl);

    return new Response(null, { headers, status: 302 });
  },
};
