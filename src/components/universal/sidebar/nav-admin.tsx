import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@/app/contexts/UserContext'
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar'

export function AdminPanelLink() {
  const { role } = useUser()
  const { open } = useSidebar()

  if (role?.role_type !== 'admin') return null

  return (
    <Link href="/admin/dashboard">
      <SidebarMenuButton>
        <div className="relative h-4 w-4">
          <ShieldAlert className="h-4 w-4" />
        </div>
        {open && <span>Admin Panel</span>}
      </SidebarMenuButton>
    </Link>
  )
}