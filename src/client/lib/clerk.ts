// Clerk configuration
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  const errorMsg = 'Missing VITE_CLERK_PUBLISHABLE_KEY environment variable';
  if (import.meta.env.PROD) {
    throw new Error(errorMsg);
  } else {
    console.error(`[Clerk] ${errorMsg}`);
  }
}
