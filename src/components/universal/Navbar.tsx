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
        <Link href="/" className="text-navLogo font-bold uppercase font-heading tracking-wider">
          CodeHive
        </Link>
        <div className="flex space-x-4">
          {user && (
            <Button asChild variant="nav">
              <Link href={`/projects/add-project`}>
                Add a project
              </Link>
            </Button>
          )}
          <Button asChild variant="nav">
            <Link href="/questions/ask-question">Ask a Question</Link>
          </Button>
          <Button asChild variant="nav">
            <Link href="/questions/answer-question">Answer a Question</Link>
          </Button>
          <Button asChild variant="nav">
            <Link href="/questions/view-all-questions">View All Questions</Link>
          </Button>
          {user ? (
            <>
              <Button asChild variant="nav">
                <Link href={`/profiles/${user.username}`}>Profile</Link>
              </Button>
              <SignOutButton />
            </>
          ) : (
            <Button asChild variant="nav">
              <Link href="/login">Login</Link>
            </Button>
          )
          }
        </div >
      </div >
    </nav >
  )
}
