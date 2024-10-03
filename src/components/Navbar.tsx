import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className=" mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Logo
        </Link>
        <div className="flex space-x-4">
          <Button asChild>
            <Link href="/ask-question">Ask a Question</Link>
          </Button>
          <Button asChild>
            <Link href="/answer-question">Answer a Question</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/sign-up">Signup</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}