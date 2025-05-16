import { parseTitle } from "./html-parser.ts";

import { assertEquals } from "@std/assert";

Deno.test("parseTitle() returns blank string when input is blank string", () => {
  const title = parseTitle("");

  assertEquals(title, "");
});

Deno.test("parseTitle() returns blank string when input is not HTML", () => {
  const title = parseTitle(`{"title":"test title","body":"test body"}`);

  assertEquals(title, "");
});

Deno.test("parseTitle() returns blank string when input doesn't have title tag", () => {
  const title = parseTitle(`
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <h1>Hello!</h1>
      </body>
    </html>
  `);

  assertEquals(title, "");
});

Deno.test("parseTitle() returns textContent of title tag when input has valid title tag", () => {
  const title = parseTitle(`
    <!doctype html>
    <html>
      <head>
        <title>Test Title</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <h1>Hello!</h1>
      </body>
    </html>
  `);

  assertEquals(title, "Test Title");
});
