'use client'

import { getUserById } from '@/api/users'
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
    <section className="min-h-screen flex flex-col items-center bg-gray-100">
      {user ? (
        <div className="flex flex-col items-center mt-6">
          <img
            // Renders anon user pfp if user pfp is null
            src={user.pfp_url || "/anon-user-pfp.jpg"}
            alt="User profile picture"
            className="h-40 w-40 rounded-lg object-cover mb-6"
          />
            <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
            <h1 className="text-lg text-gray-600 mb-4">{user.reputation} reputation</h1>
        </div>
      ) : (
        <div className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
          <h2 className="text-lg font-bold">User not found</h2>
        </div>
      )}
    </section>
  )
}
