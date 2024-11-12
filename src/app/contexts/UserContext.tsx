'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { UserRole, type User } from '@/types/Users'
import { getCurrentUserRole, getUserById } from '@/api/users'
import { toast } from '@/components/ui/use-toast'
import { type SupabaseClient } from '@supabase/supabase-js'
import {
  getUserCookie,
  getUserRoleCookie,
  setUserCookie,
  setUserRoleCookie,
  userCookieExists,
  userRoleCookieExists,
} from '@/lib/cookies'

interface UserContextType {
  user: User | null
  role: UserRole | null
  loading: boolean
  error: string | null
  refetchUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [supabase, setSupabase] = useState<SupabaseClient<
    any,
    'public',
    any
  > | null>(null) // TODO: replace any with actual types (if possible?)

  // Fetch the Supabase client
  useEffect(() => {
    const fetchSupabaseClient = async () => {
      try {
        const client = await createClient()
        setSupabase(client)
      } catch (error) {
        console.error('Error creating Supabase client:', error)
        setError('Failed to create Supabase client')
        setLoading(false)
      }
    }

    void fetchSupabaseClient()
  }, [])

  // Function to fetch and set the user from Supabase and backend
  const fetchUser = async () => {
    if (!supabase) return // Wait until the supabase client is ready

    setLoading(true)
    setError(null)

    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        setUser(null)
        setRole(null)
        return
      }

      // Check if user_info cookie exists and set user
      if (await userCookieExists()) {
        const userData = await getUserCookie()
        setUser(userData)
      } else {
        // If user cookie doesn't exist, fetch user data and set cookie
        const userResponse = await getUserById(authUser.id)
        if (userResponse.errorMessage) {
          throw new Error(userResponse.errorMessage)
        }
        if (userResponse.data) {
          setUser(userResponse.data)
          setUserCookie(userResponse.data)
        }
      }

      // Check if user_role_info cookie exists and set role
      if (await userRoleCookieExists()) {
        const roleData = await getUserRoleCookie()
        setRole(roleData)
      } else {
        // If user role cookie doesn't exist, fetch role data and set cookie
        const roleResponse = await getCurrentUserRole()
        if (roleResponse.errorMessage) {
          throw new Error(roleResponse.errorMessage)
        }
        if (roleResponse.data) {
          setRole(roleResponse.data)
          setUserRoleCookie(roleResponse.data)
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      )

      // render error to the user
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error logging you in.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (supabase) {
      void fetchUser()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]) // Fetch user when supabase client is available

  // manually refresh user
  const refetchUser = async () => {
    await fetchUser()
  }

  return (
    <UserContext.Provider value={{ user, role, loading, error, refetchUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
