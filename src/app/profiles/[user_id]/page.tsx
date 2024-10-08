'use client'

import { getUserById } from '@/api/users'
import SignOutButton from '@/components/profiles/SignOutButton'
import { LoadingSpinner } from '@/components/ui/loading'
import { User } from '@/types/User'
import { useEffect, useState } from 'react'

export default function ProfilePage({
  params,
}: {
  params: { user_id: string }
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    const fetchUser = async () => {
      try {
        const response = await getUserById(params.user_id)

        if (response.errorMessage) {
          console.error('Error fetching user:', response.errorMessage)
          return
        }

        // Set the user state with the fetched data
        setUser(response.user)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [params.user_id])

  // Conditional rendering for loading state
  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <section className="min-h-screen bg-gray-100 py-24">
      {user ? (
        <div>
            <h1>{user.username}</h1>
          <SignOutButton />
        </div>
      ) : (
        <div className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
          <h2 className="text-lg font-bold">User not found</h2>
        </div>
      )}
    </section>
  )
}
