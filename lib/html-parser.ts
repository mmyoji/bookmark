import { parse } from "parse5";

export function parseTitle(html: string): string {
  if (!html) return "";

  const doc = parse(html);
  if (!doc) return "";

  const htmlTag = doc.childNodes[1];
  if (htmlTag?.nodeName !== "html") return "";

  const headTag = htmlTag.childNodes[0];
  if (headTag?.nodeName !== "head") return "";

  const titleTag = headTag.childNodes.find((n) => n.nodeName === "title");
  if (titleTag?.nodeName !== "title") return "";

  const textTag = titleTag.childNodes[0];
  if (textTag?.nodeName !== "#text") return "";

  // @ts-expect-error this is TextNode
  return textTag?.value || "";
}
