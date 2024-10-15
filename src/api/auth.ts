'use server'

import { getSupabaseAuth } from '@/utils/supabase/server'
import { type ApiResponse } from '@/types/Api'
import { type Provider } from '@supabase/supabase-js'

/**
 * Handles user login via OAuth provider.
 *
 * Args:
 *   provider (Provider): The OAuth provider (e.g., GitHub, Google).
 *
 * Returns:
 *   Promise<ApiResponse<{ url: string }>>: The redirect URL on success, or an error message on failure.
 */
export const loginAction = async (
  provider: Provider
): Promise<ApiResponse<{ url: string }>> => {
  try {
    // Await the promise to get the resolved SupabaseAuthClient
    const supabaseAuthClient = await getSupabaseAuth();
    
    // Now you can call `signInWithOAuth` on the resolved object
    const { data, error } = await supabaseAuthClient.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    })

    if (error) throw error

    return { errorMessage: null, data: { url: data.url } }
  } catch (error) {
    console.error('Error logging in: ', error)
    return { errorMessage: 'Error logging in' }
  }
}

/**
 * Signs the user out from the application.
 *
 * Returns:
 *   Promise<ApiResponse<null>>: Null on success, or an error message on failure.
 */
export const signOutAction = async (): Promise<ApiResponse<null>> => {
  try {
    // Await the promise to get the resolved SupabaseAuthClient
    const supabaseAuthClient = await getSupabaseAuth();

    // Call the `signOut` method on the resolved object
    const { error } = await supabaseAuthClient.signOut()

    if (error) throw error

    return { errorMessage: null, data: null }
  } catch (error) {
    console.error('Error signing out: ', error)
    return { errorMessage: 'Error signing out', data: null }
  }
}