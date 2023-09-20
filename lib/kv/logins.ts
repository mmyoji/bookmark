import { kv } from "@/lib/kv/_core.ts";

type Login = {
  username: string;
  hashedPassword: string;
};

const PREFIX = "logins";

export async function createLogin(data: Login): Promise<void> {
  await kv.set([PREFIX, data.username], data);
}

export async function findLogin(username: string): Promise<Login | null> {
  return (await kv.get<Login>([PREFIX, username])).value;
}
