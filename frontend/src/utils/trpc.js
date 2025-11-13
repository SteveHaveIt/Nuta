
import { createTRPCReact } from '@trpc/react-query';

// Since we don't have type information from the backend router, we use 'any'
// In a real-world scenario, you would import the 'AppRouter' type from the backend
// type AppRouter = any;

export const trpc = createTRPCReact();
