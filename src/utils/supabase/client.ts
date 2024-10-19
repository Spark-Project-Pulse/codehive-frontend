import { createBrowserClient } from '@supabase/ssr'
// import { getSecret } from '@/lib/getSecret';

export function createClient() {
  // Fetch secrets using getSecret
  const supabaseUrl = 'http://127.0.0.1:54321';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}