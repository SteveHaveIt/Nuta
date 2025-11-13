// frontend/src/lib/trpcClient.js
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
// Adjust the path to match where your backend router types are
import { AppRouter } from '../../server/trpc/router';

const rawApiUrl = import.meta.env.VITE_API_URL;
export const API_BASE_URL =
  rawApiUrl && rawApiUrl.startsWith('http')
    ? rawApiUrl
    : `${window.location.origin}/api`;

export const trpcClient = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${API_BASE_URL}/trpc`,
    }),
  ],
});
