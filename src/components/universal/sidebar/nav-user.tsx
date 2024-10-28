'use client'

import { BadgeCheck, Bell, ChevronsUpDown, LogIn } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { type User } from '@/types/Users'
import Link from 'next/link'
import SignOutButton from '@/components/universal/SignOutButton'

export function NavUser({ user }: { user: User | null }) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* ... existing code ... */}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            {/* ... existing code ... */}
            {user ? (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link
                      id="profile-button"
                      className="flex cursor-pointer items-center gap-2"
                      href={`/profiles/${user.username}`}
                    >
                      <BadgeCheck />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {/* ... other items ... */}
                </DropdownMenuGroup>
                {/* ... existing code ... */}
              </>
            ) : (
              <DropdownMenuItem>
                <Link
                  id="login-button"
                  className="flex cursor-pointer items-center gap-2"
                  href={'/login'}
                >
                  <LogIn />
                  Login
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
