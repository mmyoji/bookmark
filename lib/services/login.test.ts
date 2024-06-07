import { login } from "./login.ts";

import { kvHelper } from "@/lib/kv/_test-helpers.ts";
import { assertEquals } from "@std/assert";

Deno.test("login() returns error when username (or password) is not present", async () => {
  const { username, error } = await login({
    username: null,
    password: "password",
  });

  assertEquals(username, "");
  assertEquals(error, "You are not allowed to login");
});

Deno.test("login() returns error with invalid username", async () => {
  const { username, error } = await login({
    username: "test-user",
    password: "password",
  });

  assertEquals(username, "");
  assertEquals(error, "You are not allowed to login");
});

Deno.test("login() returns error with invalid password", async () => {
  await kvHelper.login.create({ username: "test-user", password: "P@s$w0rd" });

  const { username, error } = await login({
    username: "test-user",
    password: "password",
  });

  assertEquals(username, "");
  assertEquals(error, "You are not allowed to login");
});

Deno.test("login() returns username with valid credentials", async () => {
  await kvHelper.login.create({ username: "test-user", password: "P@s$w0rd" });

  const { username, error } = await login({
    username: "test-user",
    password: "P@s$w0rd",
  });

  assertEquals(username, "test-user");
  assertEquals(error, "");
});
