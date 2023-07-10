import { type Handlers, type PageProps } from "$fresh/server.ts";

import IconChevronRight from "tabler_icons_tsx/tsx/chevron-right.tsx";

import { CreateForm } from "@/components/CreateForm.tsx";
import { Head } from "@/components/Head.tsx";
import { ListItem } from "@/components/ListItem.tsx";

import { config } from "@/lib/config.ts";
import { type State } from "@/lib/context.ts";
import { findItems, type Item } from "@/lib/db/items.kv.ts";
import { runKV } from "@/lib/db/kv.ts";

type Data = {
  cursor: string;
  items: Item[];
  user: State["currentUser"];
};

export const handler: Handlers<Data, State> = {
  async GET(req, ctx) {
    const after = new URL(req.url).searchParams.get("after") || undefined;
    const [items, cursor] = await runKV(findItems(after));

    return ctx.render({ items, cursor, user: ctx.state.currentUser });
  },
};

export default function Home(
  { data: { cursor, items, user } }: PageProps<Data>,
) {
  return (
    <>
      <Head />

      <div class="p-4 mx-auto max-w-screen-md">
        <div class="my-6 flex justify-between">
          <h1 class="text-2xl font-bold">{config.name}</h1>

          {!!user && (
            <div>
              <a href="/logout" class="underline">
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
          {items.map((item) => <ListItem isSignIn={!!user} item={item} />)}
        </ul>

        {!!cursor && (
          <div class="flex justify-center mt-4">
            <a
              class="bg-pink-700 text-white border border-solid border-pink-700 rounded pt-1 pb-1.5 pr-1 pl-2"
              href={`?after=${cursor}`}
            >
              <div class="flex items-center leading-normal">
                <span>NEXT</span>
                <IconChevronRight class="pt-0.5 w-5 h-5" />
              </div>
            </a>
          </div>
        )}
      </div>
    </>
  );
}
