import { kv } from "@/lib/kv/_core.ts";
import { createItem } from "@/lib/kv/items.ts";
import { createLogin } from "@/lib/kv/logins.ts";
import { hashPassword } from "@/lib/password.ts";

export const kvHelper = {
  item: {
    create: createItem,
    async deleteAll() {
      for await (const entry of kv.list({ prefix: ["items"] })) {
        await kv.delete(entry.key);
      }
    },
  },
  login: {
    async create(
      { username, password }: { username: string; password: string },
    ) {
      const hashedPassword = hashPassword(password);
      await createLogin({ username, hashedPassword });
    },
    async deleteAll() {
      for await (const entry of kv.list({ prefix: ["logins"] })) {
        await kv.delete(entry.key);
      }
    },
    async findOne({ username }: { username: string }) {
      return (await kv.get(["logins", username])).value;
    },
  },
};
