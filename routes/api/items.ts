import { assert } from "std/testing/asserts.ts";

import { type Handlers } from "$fresh/server.ts";

import { createSupabaseClient } from "@/lib/supabase.ts";

export const handler: Handlers = {
  async POST(req) {
    const form = await req.formData();
    const url = form.get("url");

    assert(typeof url === "string");

    const headers = new Headers();
    const supabase = createSupabaseClient(req.headers, headers);

    const { data: { session } } = await supabase.auth.getSession();

    assert(session);

    // TODO: fetch title
    await supabase.from("items").insert({
      title: "",
      url,
      uid: session.user.id,
    });

    return new Response(null, { headers: { location: "/" }, status: 302 });
  },
};
