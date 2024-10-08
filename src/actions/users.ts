'use server'

import { getSupabaseAuth } from '@/utils/supabase/server'
import { Provider } from '@supabase/supabase-js'

export const loginAction = async (provider: Provider) => {
  try {
    const { data, error } = await getSupabaseAuth().signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    })

    if (error) throw error

    return { errorMessage: null, url: data.url }
  } catch (error) {
    return { errorMessage: 'Error logging in' }
  }
}
