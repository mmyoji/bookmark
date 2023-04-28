import { assertEquals } from "std/testing/asserts.ts";

import { getDaysDiff } from "@/lib/get-days-diff.ts";

[
  {
    base: new Date("2023-04-20T10:00:00+0900"),
    target: new Date("2023-04-27T10:00:00+0900"),
    expected: 7,
  },
  {
    base: new Date("2023-04-20T10:00:00+0900"),
    target: new Date("2023-04-26T10:01:00+0900"),
    expected: 7,
  },
  {
    base: new Date("2023-04-20T10:00:00+0900"),
    target: new Date("2023-04-26T10:00:00+0900"),
    expected: 6,
  },
  {
    base: new Date("2023-04-27T10:00:00+0900"),
    target: new Date("2023-04-20T10:00:00+0900"),
    expected: 7,
  },
  {
    base: new Date("2023-04-20T10:00:00+0900"),
    target: new Date("2023-04-27T11:00:00+0900"),
    expected: 8,
  },
].forEach(({ base, target, expected }) => {
  Deno.test(`getDaysDiff() returns date diff (expected=${expected}) when base=${base} target=${target}`, () => {
    assertEquals(getDaysDiff(base, target), expected);
  });
});
