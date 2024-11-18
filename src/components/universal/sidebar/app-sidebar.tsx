'use client'

import * as React from 'react'
import {
  Frame,
  MessageCircleQuestion,
  FolderKanban,
  PersonStanding,
} from 'lucide-react'

import { type Project, type SidebarProject } from '@/types/Projects'
import { getProjectsByUserId } from '@/api/projects'

import { NavMain } from '@/components/universal/sidebar/nav-main'
import { NavProjects } from '@/components/universal/sidebar/nav-projects'
import { NavCommunities } from '@/components/universal/sidebar/nav-communities'
import { NavUser } from '@/components/universal/sidebar/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { useUser } from '@/app/contexts/UserContext'
import Link from 'next/link'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { getCurrentUserCommunities } from '@/api/communities'
import { type SidebarCommunity } from '@/types/Communities'
import { ThemeToggle } from '@/components/universal/sidebar/ThemeToggle'
import {
  communitiesCookieExists,
  getCommunitiesCookie,
  getNotificationsCookie,
  notificationsCookieExists,
  setCommunitiesCookie,
  setNotificationsCookie,
} from '@/lib/cookies'
import { AdminPanelLink } from '@/components/universal/sidebar/nav-admin'
import { type NotificatonsInfo } from '@/types/Notifications'
import { getUnreadNotificationsCountByUserId } from '@/api/notifications'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useUser()
  const { open, toggleSidebar } = useSidebar()
  const [communities, setCommunities] = React.useState<SidebarCommunity[]>([])
  const [communitiesLoading, setCommunitiesLoading] =
    React.useState<boolean>(true)
  const [projectsLoading, setProjectsLoading] =
    React.useState<boolean>(true)
  const [notificationsInfo, setNotificationsInfo] = React.useState<NotificatonsInfo>({ count: 0 })
  const [notificationsInfoLoading, setNotificationsInfoLoading] =
    React.useState<boolean>(true)

  const [projects, setProjects] = React.useState<SidebarProject[]>([])
  React.useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.user) return

      setProjectsLoading(true)
      const response = await getProjectsByUserId(user.user)
      if (response.data) {
        const sidebarProjects: SidebarProject[] = response.data.map(project => ({
          id: project.project_id,
          title: project.title,
          url: `/projects/${project.project_id}`
        }))
        setProjects(sidebarProjects)
      }
      setProjectsLoading(false)
    }

    void fetchProjects()
  }, [user?.user])

  // Fetch communities/use cookies
  React.useEffect(() => {
    const fetchCommunities = async () => {
      if (loading) return

      if (!loading && user === null) {
        setCommunitiesLoading(false)
        return
      }

      setCommunitiesLoading(true)
      try {
        // Check if communities info cookie exists
        if (await communitiesCookieExists()) {
          const cookieData = await getCommunitiesCookie()
          setCommunities(cookieData)
        } else {
          // Fetch community data and set cookie if not already cached
          const { data, errorMessage } = await getCurrentUserCommunities()
          if (data) {
            const formattedCommunities = data.map((community) => ({
              title: community.community_info?.title,
              url: `/communities/${community.community_info.title}`,
              avatar_url:
                community.community_info.avatar_url ??
                '/default-community-avatar.png',
            })) as SidebarCommunity[]

            setCommunities(formattedCommunities)
            setCommunitiesCookie(formattedCommunities) // Cache the communities
          } else {
            console.error(errorMessage)
          }
        }
      } catch (error) {
        console.error('Error fetching communities:', error)
      }
      setCommunitiesLoading(false)
    }

    const fetchNotificationsInfo = async () => {
      if (loading) return

      if (!loading && user === null) {
        setNotificationsInfoLoading(false)
        return
      }

      setNotificationsInfoLoading(true)
      try {
        // Check if notificationsCount info cookie exists
        if (await notificationsCookieExists()) {
          const cookieData = await getNotificationsCookie()
          setNotificationsInfo(cookieData)
        } else {
          // Fetch community data and set cookie if not already cached
          const { data, errorMessage } = await getUnreadNotificationsCountByUserId()
          if (data) {

            setNotificationsInfo(data)
            setNotificationsCookie(data) // Cache the notifications
          } else {
            console.error(errorMessage)
          }
        }
      } catch (error) {
        console.error('Error fetching notificatiinos:', error)
      }
      setNotificationsInfoLoading(false)
    }

    void fetchCommunities()
    void fetchNotificationsInfo()
  }, [loading, user])

  const data = {
    navMain: [
      {
        title: 'Questions',
        url: '#',
        icon: MessageCircleQuestion,
        items: [
          {
            title: 'Ask',
            url: '/questions/ask-question',
          },
          {
            title: 'Find Questions',
            url: '/questions/browse',
          },
        ],
      },
      {
        title: 'Projects',
        url: '#',
        icon: FolderKanban,
        items: [
          {
            title: 'Add',
            url: '/projects/add-project',
          },
          // TODO: Implement this page
          // {
          //   title: 'Explore Projects',
          //   url: '#',
          // },
        ],
      },
      {
        title: 'Communities',
        url: '#',
        icon: PersonStanding,
        items: [
          {
            title: 'Create Community',
            url: '/communities/create',
          },
          {
            title: 'Browse Communities',
            url: '/communities/browse',
          },
        ],
      },
    ],
  }

  // MacOS
  useKeyboardShortcut(['cmd', '/'], () => {
    toggleSidebar()
  })

  // Windows/Linux
  useKeyboardShortcut(['ctrl', '/'], () => {
    toggleSidebar()
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {open ? (
          <Link
            href="/"
            className="font-heading text-navLogo font-bold uppercase tracking-wider"
          >
            CodeHive
          </Link>
        ) : (
          <Link
            href="/"
            className="font-heading text-navLogo font-bold uppercase tracking-wider"
          >
            <Image
              src="/logo.svg"
              alt="CodeHive Logo"
              width={150}
              height={50}
            />
          </Link>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects
          projects={projects}
          loading={projectsLoading}
        />
        <NavCommunities
          communities={communities}
          loading={communitiesLoading}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <AdminPanelLink />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <ThemeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
        {loading ? (
          open ? (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ) : (
            <Skeleton className="mx-auto h-8 w-8 rounded-full" />
          )
        ) : (
          <NavUser user={user} notificationInfos={notificationsInfo} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
