'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@/types/Users'
import { getUserById } from '@/api/users'
import { toast } from '@/components/ui/use-toast'
import { type SupabaseClient } from '@supabase/supabase-js'

interface UserContextType {
  user: User | null
  loading: boolean
  error: string | null
  refetchUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [supabase, setSupabase] = useState<SupabaseClient<any, 'public', any> | null>(null) // TODO: replace any with actual types (if possible?)

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
        return
      }

      const response = await getUserById(authUser.id)
      if (response.errorMessage) {
        // render error to the user
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'There was an error logging you in.',
        })
        throw new Error(response.errorMessage)
      }

      if (response.data) {
        setUser(response.data)
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
    <UserContext.Provider value={{ user, loading, error, refetchUser }}>
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
