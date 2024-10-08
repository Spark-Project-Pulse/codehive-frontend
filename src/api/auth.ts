'use server'

import { getSupabaseAuth, getUser } from '@/utils/supabase/server'
import { type Provider } from '@supabase/supabase-js'
import { createUser, userExists } from './users'

/**
 * Handles user login via OAuth provider.
 *
 * Args:
 *   provider (Provider): The OAuth provider (e.g., GitHub, Google).
 *
 * Returns:
 *   Promise<{errorMessage: string | null, url?: string}>: The redirect URL on success, or an error message on failure.
 */
export const loginAction = async (provider: Provider) => {
  try {
    const { data, error } = await getSupabaseAuth().signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    })

    if (error) throw error

    // const authUser = await getUser();
    // if (!authUser) {
    //   throw new Error('Failed to get authenticated user')
    // }

    // // Check if the user exists in the database
    // const { userExists: exists } = await userExists(authUser.id)

    // // If the user doesn't exist, create a new user in your DB
    // if (!exists) {
    //   const { errorMessage } = await createUser({
    //     user_id: authUser.id,
    //     username: authUser.user_metadata.username,
    //   })

    //   if (errorMessage) {
    //     throw new Error(errorMessage)
    //   }
    // }

    return { errorMessage: null, url: data.url }
  } catch (error) {
    console.error('Error logging in: ', error)
    return { errorMessage: 'Error logging in' }
  }
}

/**
 * Signs the user out from the application.
 *
 * Returns:
 *   Promise<{errorMessage: string | null}>: Null on success, or an error message on failure.
 */
export const signOutAction = async () => {
  try {
    const { error } = await getSupabaseAuth().signOut()

    if (error) throw error

    return { errorMessage: null }
  } catch (error) {
    console.error('Error signing out: ', error)
    return { errorMessage: 'Error signing out' }
  }
}
