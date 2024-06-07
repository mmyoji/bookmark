import { findLogin } from "@/lib/kv/logins.ts";
import { verifyPassword } from "@/lib/password.ts";

const error = "You are not allowed to login";

type Params = {
  username: ReturnType<FormData["get"]>;
  password: ReturnType<FormData["get"]>;
};

function validate(p: Params): p is { username: string; password: string } {
  return (typeof p.username === "string") &&
    (typeof p.password === "string");
}

export async function login(p: Params): Promise<
  { username: string; error: string }
> {
  if (!validate(p)) {
    return { username: "", error };
  }

  const { username, password } = p;

  const login = await findLogin(username);
  if (!login) {
    return { username: "", error };
  }

  const result = verifyPassword(password, login.hashedPassword);
  if (!result) {
    return { username: "", error };
  }

  return { username: login.username, error: "" };
}
