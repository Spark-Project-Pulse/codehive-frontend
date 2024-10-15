'use client'

import { getUserById } from '@/api/users'
import { LoadingSpinner } from '@/components/ui/loading'
import { type User } from '@/types/Users'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function ProfilePage({
  params,
}: {
  params: { user_id: string }
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(params.user_id)

        if (response.errorMessage) {
          console.error('Error fetching user:', response.errorMessage)
          return
        }

        // Set the user state with the fetched data
        setUser(response.data ?? null)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchUser()
  }, [params.user_id])

  // Conditional rendering for loading state
  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <section className="flex min-h-screen flex-col items-center">
      {user ? (
        <div className="mt-6 flex flex-col items-center">
          <Image
            // Renders anon user pfp if user pfp is null
            src={user.pfp_url ?? '/anon-user-pfp.jpg'}
            alt="User profile picture"
            width={200}
            height={200}
            className="mb-6 h-40 w-40 rounded-lg object-cover"
          />
          <h1 className="mb-2 text-3xl font-bold">{user.username}</h1>
          <h1 className="mb-4 text-lg text-gray-600">
            {user.reputation} reputation
          </h1>
        </div>
      ) : (
        <div className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
          <h2 className="text-lg font-bold">User not found</h2>
        </div>
      )}
    </section>
  )
}
