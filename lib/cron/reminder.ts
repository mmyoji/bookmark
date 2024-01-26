import { createGitHubIssue, fetchGitHubIssues } from "@/lib/github.client.ts";
import { searchItems } from "@/lib/kv/items.ts";

const DAYS = 14;

export async function runReminder() {
  const title = Temporal.Now.plainDate("iso8601").subtract(
    Temporal.Duration.from({ days: DAYS }),
  ).toString();

  const items = await searchItems(title);
  if (!items.length) return;

  const issues = await fetchGitHubIssues();
  if (issues.map((i) => i.title).includes(title)) return;

  await createGitHubIssue({
    title,
    body: items.map(({ url }) => `- ${url}`).join("\n"),
  });
}
