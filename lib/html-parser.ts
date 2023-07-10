import { DOMParser } from "linkedom";

export function parseTitle(html: string): string {
  if (!html) return "";

  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) return "";

  const title = doc.querySelector("title");
  if (!title || !title.textContent) return "";

  return title.textContent;
}
