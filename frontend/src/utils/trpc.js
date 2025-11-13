// frontend/src/utils/trpc.js
import { createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';
// Adjust the path to match your backend router types
import { AppRouter } from '../../server/trpc/router';

export const trpc = createTRPCReact<AppRouter>({
  transformer: superjson,
});
