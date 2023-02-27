module.exports = async ({ github, context, dayjs }) => {
  const { PROJECT_ID, SUPABASE_ANON_KEY } = process.env;

  const created_at = dayjs().subtract(7, "day").format("YYYY-MM-DD");

  const res = await fetch(
    `https://${PROJECT_ID}.functions.supabase.co/search-items`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        created_at,
      }),
    }
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
