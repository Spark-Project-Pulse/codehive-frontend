import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AccessDenied() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Access Denied</h1>
      <p className="mb-8">Sorry, you do not have access for this page.</p>
      <Button asChild>
        <Link href="/">Go Back Home</Link>
      </Button>
    </div>
  )
}
