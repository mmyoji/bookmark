import { IconChevronRight } from "@tabler/icons-preact";

import { CreateForm } from "@/components/CreateForm.tsx";
import { ListItem } from "@/components/ListItem.tsx";

import { config } from "@/lib/config.ts";
import { findItems } from "@/lib/kv/items.ts";
import { define } from "@/utils.ts";

const cursorKey = "after";

export default define.page(async (ctx) => {
  const req = ctx.req;
  const after = new URL(req.url).searchParams.get(cursorKey) || undefined;
  const [items, cursor] = await findItems(after);
  const user = ctx.state.currentUser;

  return (
    <div class="p-4 mx-auto max-w-screen-lg">
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

      <div class="lg:grid gap-2 grid-cols-3 grid-rows-3">
        {items.map((item) => (
          <ListItem key={item.dateISO} isSignIn={!!user} item={item} />
        ))}
      </div>

      {!!cursor && (
        <div class="flex justify-center mt-4">
          <a
            class="bg-pink-700 text-white border border-solid border-pink-700 rounded pt-1 pb-1.5 pr-1 pl-2"
            href={`?${cursorKey}=${cursor}`}
          >
            <div class="flex items-center leading-normal">
              <span>NEXT</span>
              <IconChevronRight class="pt-0.5 w-5 h-5" />
            </div>
          </a>
        </div>
      )}
    </div>
  );
});
