export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const path = getRouterParam(event, "path") ?? "";
  const { searchParams } = new URL(event.node.req.url ?? "", "http://localhost");
  const query = searchParams.toString();
  const target = `${config.backendUrl}/${path}${query ? `?${query}` : ""}`;

  return proxyRequest(event, target);
});
