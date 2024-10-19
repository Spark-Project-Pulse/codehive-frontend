import { createBrowserClient } from '@supabase/ssr'
import { getSecret } from '@/lib/getSecret';

export async function createClient() {
  // Fetch secrets using getSecret
  const supabaseUrl = await getSecret('SUPABASE_URL');
  const supabaseAnonKey = await getSecret('SUPABASE_ANON_KEY');

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}