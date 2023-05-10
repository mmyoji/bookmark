import { Head } from "$fresh/runtime.ts";
import { type Handlers, type PageProps } from "$fresh/server.ts";

import { CreateForm } from "@/components/CreateForm.tsx";
import { URLListItem } from "@/components/URLListItem.tsx";

import { type State } from "@/lib/context.ts";
import { findItems, type Item } from "@/lib/items.repository.ts";
import { runKV } from "@/lib/kv.ts";

export const handler: Handlers<unknown, State> = {
  async GET(_req, ctx) {
    const items = await runKV(findItems());

    return await ctx.render({ items, user: ctx.state.currentUser });
  },
};

type PageData = {
  items: Item[];
  user: State["currentUser"];
};

export default function Home({ data: { items, user } }: PageProps<PageData>) {
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

          {!!user && (
            <div>
              <a href="/api/logout" class="underline">
                Sign out
              </a>
            </div>
          )}
        </div>

        {!!user && (
          <div class="my-4">
            <CreateForm />
          </div>
        )}

        <ul>
          {items.map(({ date, ...rest }) => (
            <URLListItem {...rest} date={date} />
          ))}
        </ul>
      </div>
    </>
  );
}
