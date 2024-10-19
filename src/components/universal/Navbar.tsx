'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import SignOutButton from '@/components/universal/SignOutButton'
import { useEffect, useState } from 'react'
import { type User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        
        // Fetch the current session and user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUser(user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  console.log(user);

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
