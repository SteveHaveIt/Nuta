import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "../../server/routers"; // Assuming the server is in the parent directory

// We use the AppRouter type from the backend for type safety
export const trpc = createTRPCReact<AppRouter>();
