import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getUser } from '@/utils/supabase/server'
import SignOutButton from '@/components/universal/SignOutButton'

export default async function Navbar() {
  const user = await getUser()

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto flex items-center justify-between px-4 py-2">
        <Link href="/" className="text-xl font-bold">
          Logo
        </Link>
        <div className="flex space-x-4">
          { user && (
            <Button asChild>
              <Link href={`/projects/add-project/${user.id}`}>Add a project</Link>
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
                <Link href={`/profiles/${user.id}`}>Profile</Link>
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
