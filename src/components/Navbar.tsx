import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUser } from "@/utils/supabase/server";

export default async function Navbar() {
  const user = await getUser();

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Logo
        </Link>
        <div className="flex space-x-4">
          <Button asChild>
            <Link href="/projects/add-project">Add a project</Link>
          </Button>
          <Button asChild>
            <Link href="/ask-question">Ask a Question</Link>
          </Button>
          <Button asChild>
            <Link href="/answer-question">Answer a Question</Link>
          </Button>
          <Button asChild>
            <Link href="/view-all-questions">View All Questions</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/sign-up">Signup</Link>
          </Button>
        </div>
        <div>
          {user ? `logged in as ${user.email}` : "not logged in"}
        </div>
      </div>
    </nav>
  );
}
