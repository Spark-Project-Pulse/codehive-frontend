import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Button asChild>
        <Link href="/">Login With Google</Link>
      </Button>
    </div>
  )
}