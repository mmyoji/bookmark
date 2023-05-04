import { assert } from "std/testing/asserts.ts";

import { Head } from "$fresh/runtime.ts";
import { type Handlers, type PageProps } from "$fresh/server.ts";

import { CreateForm } from "@/components/CreateForm.tsx";
import { URLListItem } from "@/components/URLListItem.tsx";

import { findItems } from "@/lib/items.repository.ts";
import { runKV } from "@/lib/kv.ts";
import { createSupabaseClient } from "@/lib/supabase.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const headers = new Headers();
    const supabase = createSupabaseClient(req.headers, headers);

    const {
      data: { session },
    } = await supabase.auth.getSession();

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

    const items = await runKV(findItems());

    return await ctx.render({ items });
  },
};

type PageData = {
  items: {
    url: string;
    title: string;
    date: string;
  }[];
};

export default function Home({ data: { items } }: PageProps<PageData>) {
  return (
    <>
      <Head>
        <title>Archive Reminder</title>
      </Head>

      <div class="p-4 mx-auto max-w-screen-md">
        <img
          src="/logo.svg"
          class="w-32 h-32"
          alt="the fresh logo: a sliced lemon dripping with juice"
        />

        <div class="my-6 flex justify-between">
          <h1 class="text-2xl font-bold">Archive Reminder</h1>

          <div>
            <a href="/api/logout" class="underline">
              Sign out
            </a>
          </div>
        </div>

        <div class="my-4">
          <CreateForm />
        </div>

        <ul>
          {items.map(({ date, ...rest }) => (
            <URLListItem {...rest} date={date} />
          ))}
        </ul>
      </div>
    </>
  );
}
