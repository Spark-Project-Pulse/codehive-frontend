'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import SignOutButton from '@/components/universal/SignOutButton'
import { useUser } from '@/app/contexts/UserContext'
import { LoadingSpinner } from '@/components/ui/loading'
import Image from 'next/image'
import { useState } from 'react'

export default function Navbar() {
  const { user, loading } = useUser()
  const [imageError, setImageError] = useState(false);

  if (loading) return <LoadingSpinner />

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto flex items-center justify-between px-4 py-2">
        <Link href="/" className="flex items-center">
          {!imageError && (
            <Image
              src="codehive_with_logo.svg"
              alt="CodeHive"
              className="h-8"
              width={500}
              height={500}
              onError={() => setImageError(true)}
            />
          )}
          {imageError && (
            <span className="text-navLogo font-bold uppercase font-heading tracking-wider">CodeHive</span>
          )}
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
