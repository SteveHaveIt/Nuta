'''
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

// Since we don't have type information from the backend router, we use 'any'
// In a real-world scenario, you would import the 'AppRouter' type from the backend
// type AppRouter = any;

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Fallback for production or when VITE_API_URL is not set
  return `${window.location.origin}/api`;
};

const API_BASE_URL = getBaseUrl();

console.log(`[tRPC] Connecting to API at: ${API_BASE_URL}/trpc`);

export const trpcClient = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: `${API_BASE_URL}/trpc`,
    }),
  ],
});
'''
