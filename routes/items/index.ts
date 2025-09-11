import { createItem } from "@/lib/services/create-item.ts";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const req = ctx.req;

    if (!ctx.state.currentUser) {
      return ctx.redirect("/login");
    }

    const form = await req.formData();
    await createItem(form.get("url"));

    return ctx.redirect("/");
  },
});
