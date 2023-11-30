import { createGitHubIssue, fetchGitHubIssues } from "@/lib/github.client.ts";
import { searchItems } from "@/lib/kv/items.ts";

const DAYS = 14;

export async function runReminder() {
  const d = new Date();
  d.setDate(d.getDate() - DAYS);
  // YYYY-MM-DD
  const title = d.toISOString().slice(0, 10);

  const items = await searchItems(title);
  if (!items.length) return;

  const issues = await fetchGitHubIssues();
  if (issues.map((i) => i.title).includes(title)) return;

  await createGitHubIssue({
    title,
    body: items.map(({ url }) => `- ${url}`).join("\n"),
  });
}
