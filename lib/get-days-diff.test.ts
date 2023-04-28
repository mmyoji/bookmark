import { assertEquals } from "std/testing/asserts.ts";

import { getDaysDiff } from "@/lib/get-days-diff.ts";

[
  {
    base: new Date("2023-04-20T10:00:00+0900"),
    target: new Date("2023-04-27T10:00:00+0900"),
    days: 7,
  },
  {
    base: new Date("2023-04-20T10:00:00+0900"),
    target: new Date("2023-04-26T10:00:01+0900"),
    days: 7,
  },
  {
    base: new Date("2023-04-20T10:00:00+0900"),
    target: new Date("2023-04-26T10:00:00+0900"),
    days: 6,
  },
  {
    base: new Date("2023-04-27T10:00:00+0900"),
    target: new Date("2023-04-20T10:00:00+0900"),
    days: 7,
  },
  {
    base: new Date("2023-04-20T10:00:00+0900"),
    target: new Date("2023-04-27T11:00:00+0900"),
    days: 8,
  },
].forEach(({ base, target, days }) => {
  Deno.test(`getDaysDiff() returns ${days} (days) between ${base.toISOString()} and ${target.toISOString()}`, () => {
    assertEquals(getDaysDiff(base, target), days);
  });
});
