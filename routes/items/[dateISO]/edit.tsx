import { Handlers, PageProps } from "$fresh/server.ts";
import { assert } from "$std/assert/mod.ts";
import { ComponentChildren } from "preact";

import { Button } from "@/components/Button.tsx";
import { Input } from "@/components/Input.tsx";
import { Label } from "@/components/Label.tsx";
import { Layout } from "@/components/Layout.tsx";
import { type State } from "@/lib/context.ts";
import { findItem, Item, updateItem } from "@/lib/kv/items.ts";
import { redirect } from "@/lib/response.utils.ts";

type Data = {
  item: Item;
};

export const handler: Handlers<Data, State> = {
  async GET(_req, ctx) {
    const dateISO = ctx.params.dateISO;
    const user = ctx.state.currentUser;
    if (!dateISO || !user) {
      return ctx.renderNotFound();
    }

    const item = await findItem(dateISO);
    if (!item) {
      return ctx.renderNotFound();
    }

    return ctx.render({ item });
  },

  async POST(req, ctx) {
    const dateISO = ctx.params.dateISO;
    const user = ctx.state.currentUser;
    if (!dateISO || !user) {
      throw new Error("Invalid Request");
    }

    const item = await findItem(dateISO);
    if (!item) {
      throw new Error("Invalid Request");
    }

    const form = await req.formData();
    const title = form.get("title");
    const url = form.get("url");
    const note = form.get("note");
    assert(typeof title === "string" && title.length > 0);
    assert(typeof url === "string" && url.length > 0);
    assert(typeof note === "string");
    await updateItem({
      ...item,
      title,
      url,
      note,
    });

    return redirect({ location: "/" });
  },
};

const InputWrapper = ({ children }: { children: ComponentChildren }) => (
  <div class="py-2">
    {children}
  </div>
);

export default function ItemEditPage({ data: { item } }: PageProps<Data>) {
  return (
    <Layout>
      <div class="p-4 mx-auto max-w-screen-md">
        <h2 class="text-2xl font-bold">Edit Item</h2>

        <form action={`/items/${item.dateISO}/edit`} method="post">
          <InputWrapper>
            <Label class="block text-lg" htmlFor="title">Title</Label>
            <Input class="w-full" name="title" required value={item.title} />
          </InputWrapper>

          <InputWrapper>
            <Label htmlFor="url">URL</Label>
            <Input
              class="w-full"
              type="url"
              name="url"
              value={item.url}
              required
            />
          </InputWrapper>

          <InputWrapper>
            <Label htmlFor="note">Note</Label>
            <textarea class="w-full p-2" name="note">
              {item.note ?? ""}
            </textarea>
          </InputWrapper>

          <Button type="submit">Update</Button>
        </form>
      </div>
    </Layout>
  );
}
