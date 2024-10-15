import { createServerClient } from '@supabase/ssr'
import { type ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'
import { getSecret } from '@/lib/getSecret';

export const getUser = async () => {
  const auth = await getSupabaseAuth()
  const user = (await auth.getUser()).data.user

  return user
}

export async function getSupabaseAuth() {
  const cookieStore = cookies()

  // Fetch secrets using getSecret
  const supabaseUrl = await getSecret('SUPABASE_URL');
  const supabaseAnonKey = await getSecret('SUPABASE_ANON_KEY');

  const supabaseClient = createServerClient(
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
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  return supabaseClient.auth
}
