import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../../server/routers"; // Assuming the server is in the parent directory

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    // VITE_API_URL should be set to the base URL of the Render service (e.g., https://nuta.onrender.com)
    return import.meta.env.VITE_API_URL;
  }
  // Fallback for local development
  return `http://localhost:3001`;
};

const API_BASE_URL = getBaseUrl();

console.log(`[tRPC] Connecting to API at: ${API_BASE_URL}/trpc`);

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${API_BASE_URL}/trpc`,
    }),
  ],
});
