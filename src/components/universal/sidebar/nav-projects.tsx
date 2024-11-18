"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Folder, Forward, MoreHorizontal, Trash2, type LucideIcon } from "lucide-react"
import { type Project, type SidebarProject } from '@/types/Projects'
import { getProjectsByUserId } from '@/api/projects'
import { useUser } from '@/app/contexts/UserContext'
import { useTheme } from 'next-themes'
import { Skeleton } from '@/components/ui/skeleton'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from 'next/link'

interface NavProjectsProps {
  loading?: boolean
}

export function NavProjects({ loading: initialLoading = false }: NavProjectsProps) {
  const [projects, setProjects] = useState<SidebarProject[]>([])
  const [loading, setLoading] = useState(initialLoading)
  const { isMobile } = useSidebar()
  const { user } = useUser()

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.user) return

      setLoading(true)
      const response = await getProjectsByUserId(user.user)
      if (response.data) {
        const sidebarProjects: SidebarProject[] = response.data.map(project => ({
          id: project.project_id,
          title: project.title,
          url: `/projects/${project.project_id}`
        }))
        setProjects(sidebarProjects)
      }
      setLoading(false)
    }

    void fetchProjects()
  }, [user?.user])

  const { resolvedTheme } = useTheme()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
      <SidebarMenu>
        {loading ? (
          <Skeleton className="mb-2 h-6 w-full" />
        ) : projects.length === 0 ? (
          <div className="pl-3 text-sm">You have no projects</div>
        ) : (
          projects.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <Image
                  src={`/github-logo-${resolvedTheme === 'dark' ? 'light' : 'dark'}.svg`}
                  alt='Github logo'
                  width={20}
                  height={20}
                  className='h-5 w-5'
                  />
                  <span>{item.title}</span>
                </Link>
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
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem asChild>
                    <Link href={item.url}>
                      <Folder className="text-muted-foreground" />
                      <span>View Project</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward className="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
