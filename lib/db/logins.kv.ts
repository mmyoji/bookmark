import { KVFunc } from "@/lib/db/kv.ts";

type Login = {
  username: string;
  hashedPassword: string;
};

const KEY = "logins";

export const createLogin = (data: Login): KVFunc<void> => {
  return async (kv) => {
    await kv.set([KEY, data.username], data);
  };
};

export const findLogin = (username: string): KVFunc<Login | null> => {
  return async (kv) => {
    const res = await kv.get<Login>([KEY, username]);
    return res.value ?? null;
  };
};
