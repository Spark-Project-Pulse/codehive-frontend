'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import SignOutButton from '@/components/universal/SignOutButton'
import { useUser } from '@/app/contexts/UserContext'
import { LoadingSpinner } from '@/components/ui/loading'

export default function Navbar() {
  const { user, loading } = useUser()

  if (loading) return <LoadingSpinner />

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto flex items-center justify-between px-4 py-2">
        <Link href="/" className="text-xl font-bold">
          Logo
        </Link>
        <div className="flex space-x-4">
          {user && (
            <Button asChild>
              <Link href={`/projects/add-project`}>
                Add a project
              </Link>
            </Button>
          )}
          <Button asChild>
            <Link href="/questions/ask-question">Ask a Question</Link>
          </Button>
          <Button asChild>
            <Link href="/questions/answer-question">Answer a Question</Link>
          </Button>
          <Button asChild>
            <Link href="/questions/view-all-questions">View All Questions</Link>
          </Button>
          {user ? (
            <>
              <Button asChild>
                <Link href={`/profiles/${user.user}`}>Profile</Link>
              </Button>
              <SignOutButton />
            </>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
