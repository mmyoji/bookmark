import { defineKVFunc } from "@/lib/db/kv.ts";

type Login = {
  username: string;
  hashedPassword: string;
};

const PREFIX = "logins";

export const createLogin = defineKVFunc<Login, void>(async (kv, data) => {
  await kv.set([PREFIX, data.username], data);
});

export const findLogin = defineKVFunc<string, Login | null>(
  async (kv, username) => {
    const res = await kv.get<Login>([PREFIX, username]);
    return res.value ?? null;
  },
);
