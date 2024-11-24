'use client'

import { Folder, Forward, MoreHorizontal, Trash2 } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { type SidebarCommunity } from '@/types/Communities'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarImage } from '@/components/ui/avatar'

export function NavCommunities({
  communities = [], // Default to an empty array if communities is undefined
  loading: loading,
}: {
  communities: SidebarCommunity[]
  loading: boolean
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Your Communities</SidebarGroupLabel>
      <SidebarMenu>
        {loading ? (
          <Skeleton className="mb-2 h-6 w-full" />
        ) : communities.length === 0 ? (
          // Display message if no communities
          <div className="pl-3 text-sm">You are not in any communities</div>
        ) : (
          communities.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={item.avatar_url ?? '/default-community-avatar.png'}
                      alt={item.title || 'Community avatar'}
                    />
                  </Avatar>
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align={isMobile ? 'end' : 'start'}
                >
                  <DropdownMenuItem>
                    <Folder className="text-muted-foreground" />
                    <span>View Community</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward className="text-muted-foreground" />
                    <span>Share Community</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>Leave Community</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
