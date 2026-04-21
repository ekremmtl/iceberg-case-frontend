export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return;

  const token = localStorage.getItem("iceberg_auth_token");
  if (!token) return navigateTo("/login");
});
