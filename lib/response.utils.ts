export const redirect = (headers: HeadersInit) =>
  new Response(null, { headers, status: 302 });
