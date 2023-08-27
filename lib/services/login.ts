import { assert } from "$std/assert/mod.ts";

import { findLogin } from "@/lib/db/logins.kv.ts";
import { verifyPassword } from "@/lib/password.ts";

const error = "You are not allowed to login";

async function run(
  { username, password }: {
    username: ReturnType<FormData["get"]>;
    password: ReturnType<FormData["get"]>;
  },
): Promise<
  { username: string; error: null } | { username: null; error: string }
> {
  try {
    assert(typeof username === "string");
    assert(typeof password === "string");
  } catch (_err) {
    return {
      username: null,
      error,
    };
  }

  const login = await findLogin(username);
  if (!login) {
    return { username: null, error };
  }

  const result = verifyPassword(password, login.hashedPassword);
  if (!result) {
    return { username: null, error };
  }

  return { username: login.username, error: null };
}

export const loginService = {
  run,
};
