module.exports = async ({ github, context, fetch, dayjs }) => {
  const created_at = dayjs().subtract(7, "day").format("YYYY-MM-DD");

  const res = await fetch(
    `https://mmyoji-archive-reminder.deno.dev/api/search-items?created_at=${created_at}`,
  );
  const data = await res.json();
  if (!data || !data.length) return;

  const body = data.map(({ url }) => `- ${url}`).join("\n");

  await github.rest.issues.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title: created_at,
    body,
  });
};
