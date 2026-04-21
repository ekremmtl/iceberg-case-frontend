import { setApiBaseUrl } from "~/utils/api";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const url = config.public.apiBaseUrl as string;
  if (url) setApiBaseUrl(url);
});
