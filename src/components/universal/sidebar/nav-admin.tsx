import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useUser } from '@/app/contexts/UserContext'
import { useSidebar } from '@/components/ui/sidebar'

// AdminPanel function
export function AdminPanelLink() {
  const { role } = useUser()
  const { open } = useSidebar()

  // Only render if the user role is 'admin'
  if (role?.role_type !== 'admin') return null

  return (
    <Link href="/admin/dashboard">
      <Button
        variant="secondary"
        size="sm"
        className={`relative w-full ${open ? 'justify-start' : 'justify-center px-0'}`}
      >
        <ShieldAlert className="h-4 w-4" />
        {open && <span className="ml-2">Admin Panel</span>}
      </Button>
    </Link>
  )
}
