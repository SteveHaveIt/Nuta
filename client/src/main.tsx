import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

// Determine the API URL based on environment
const getApiUrl = (): string => {
  try {
    // In production, use the backend URL from environment variable
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    
    // In development or when same-origin, use relative path
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      return "/api/trpc";
    }
    
    // For deployed environments, construct the backend URL
    if (typeof window !== "undefined" && window.location.hostname) {
      const hostname = window.location.hostname;
      
      // For Render deployments
      if (hostname.includes("onrender.com")) {
        if (hostname.startsWith("nuta.")) {
          return "https://nuta-backend.onrender.com/api/trpc";
        }
      }
      
      // For Vercel deployments
      if (hostname.includes("vercel.app")) {
        if (hostname.startsWith("nuta.")) {
          return "https://nuta-backend.vercel.app/api/trpc";
        }
      }
    }
    
    // Fallback to relative path
    return "/api/trpc";
  } catch (error) {
    console.error("[API URL Config] Error determining API URL:", error);
    return "/api/trpc";
  }
};

const apiUrl = getApiUrl();
console.log("[tRPC] Connecting to API at:", apiUrl);

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: apiUrl,
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
