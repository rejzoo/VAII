import { createBrowserClient } from '@supabase/ssr'

//https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

let supabaseClient: ReturnType<typeof createBrowserClient>;

export function createClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseClient;
}