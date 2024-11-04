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
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={`${user?.profile_image_url ?? '/anon-user-pfp.jpg'}?t=${Date.now()}`} alt={user?.username} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.username}</span>
                <span className="truncate text-xs">{'fakemail@gmail.com'}</span>
                {/* TODO: replace with actual email */}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={`${user?.profile_image_url ?? '/anon-user-pfp.jpg'}?t=${Date.now()}`} alt={user?.username} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.username}
                  </span>
                  <span className="truncate text-xs">
                    {'fakemail@gmail.com'}
                  </span>
                  {/* TODO: replace with actual email */}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user ? (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link
                      className="flex cursor-pointer items-center gap-2"
                      href={`/profiles/${user.username}`}
                    >
                      <BadgeCheck />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      className="flex cursor-pointer items-center gap-2"
                      href={'#'}
                    >
                      <Bell />
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {/* TODO: replace SignOutButton with DropdownMenuItem */}
                {/* <DropdownMenuItem> */}
                {/* <LogOut /> */}
                <SignOutButton />
                {/* </DropdownMenuItem> */}
              </>
            ) : (
              <DropdownMenuItem>
                <Link
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
