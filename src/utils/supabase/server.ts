import { createServerClient } from '@supabase/ssr'
import { type ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'
import { getSecret } from '@/lib/getSecret';


export async function createClient() {
  const cookieStore = cookies()

  // Fetch secrets using getSecret
  const supabaseUrl = await getSecret('SUPABASE_URL');
  const supabaseAnonKey = await getSecret('SUPABASE_ANON_KEY');

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(
          cookiesToSet: Array<{
            name: string
            value: string
            options?: Partial<ResponseCookie>
          }>
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            console.error('Error setting cookies:', error);
          }
        },
      },
    }
  )
}

// Return the SUPABASE user
export const getSupaUser = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};