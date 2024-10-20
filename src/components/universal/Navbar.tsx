import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getUser } from '@/utils/supabase/server'
import SignOutButton from '@/components/universal/SignOutButton'

export default async function Navbar() {
  const user = await getUser()

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto flex items-center justify-between px-4 py-2">
        <Link href="/" className="text-navLogo font-bold uppercase font-heading tracking-wider">
          CodeHive
        </Link>
        <div className="flex space-x-4">
          {user && (
            <Button asChild variant="nav">
              <Link href={`/projects/add-project/${user.id}`}>Add a project</Link>
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
                <Link href={`/profiles/${user.id}`}>Profile</Link>
              </Button>
              <SignOutButton />
            </>
          ) : (
            <Button asChild variant="nav">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
