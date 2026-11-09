export function createResponse(
  value: unknown,
  init: { status?: number; headers?: Record<string, string> } = {},
): Response {
  const headers = new Headers({
    "content-type": "application/json",
    ...init.headers,
  });
  return new Response(JSON.stringify(value), {
    status: init.status ?? 200,
    headers,
  });
}
