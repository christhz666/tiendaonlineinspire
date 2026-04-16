import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file."
  );
}

/**
 * Browser Supabase client.
 * Shared singleton used by Zustand stores and client components.
 * Sessions are persisted in cookies (synced with middleware on the server).
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
