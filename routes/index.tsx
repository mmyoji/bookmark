import { assert } from "std/testing/asserts.ts";

import { Head } from "$fresh/runtime.ts";
import { type Handlers, type PageProps } from "$fresh/server.ts";

import { createSupabaseClient } from "@/lib/supabase.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const headers = new Headers();
    const supabase = createSupabaseClient(req.headers, headers);

    const { data: { session } } = await supabase.auth.getSession();

    try {
      assert(session);
    } catch (err) {
      return new Response(null, {
        status: 302,
        headers: {
          location: "/login",
        },
      });
    }

    const { user } = session;

    const result = await supabase.from("items").select("*").eq(
      "uid",
      user.id,
    ).order("created_at", { ascending: false });

    return await ctx.render({ items: result.error ? [] : result.data });
  },
};

type PageData = {
  items: {
    id: string;
    url: string;
    created_at: string;
  }[];
};

export default function Home({ data: { items } }: PageProps<PageData>) {
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>

      <div class="p-4 mx-auto max-w-screen-md">
        <img
          src="/logo.svg"
          class="w-32 h-32"
          alt="the fresh logo: a sliced lemon dripping with juice"
        />
        <p class="my-6">
          Welcome to `fresh`. Try updating this message in the
          ./routes/index.tsx file, and refresh.
        </p>

        <form action="/api/items" method="POST">
          <label for="url">URL</label>
          <input
            type="url"
            name="url"
            id="url"
            required
            pattern="https?://.*"
          />
          <button>Submit</button>
        </form>

        <ul>
          {items.map((i) => <li>{i.id} - {i.url} - {i.created_at}</li>)}
        </ul>
      </div>
    </>
  );
}
