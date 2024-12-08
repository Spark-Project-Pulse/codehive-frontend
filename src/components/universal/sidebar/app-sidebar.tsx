'use client'

import * as React from 'react'
import {
  MessageCircleQuestion,
  FolderKanban,
  PersonStanding,
} from 'lucide-react'

import { type SidebarProject } from '@/types/Projects'
import { getProjectsByUserId } from '@/api/projects'

import { NavMain } from '@/components/universal/sidebar/nav-main'
import { NavProjects } from '@/components/universal/sidebar/nav-projects'
import { NavHives } from '@/components/universal/sidebar/nav-hives'
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
import { getCurrentUserHives } from '@/api/hives'
import { type SidebarHive } from '@/types/Hives'
import { ThemeToggle } from '@/components/universal/sidebar/ThemeToggle'
import {
  hivesCookieExists,
  getHivesCookie,
  getNotificationsCookie,
  notificationsCookieExists,
  setHivesCookie,
  setNotificationsCookie,
} from '@/lib/cookies'
import { AdminPanelLink } from '@/components/universal/sidebar/nav-admin'
import { type NotificatonsInfo } from '@/types/Notifications'
import { getUnreadNotificationsCountByUserId } from '@/api/notifications'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useUser()
  const { open, toggleSidebar } = useSidebar()
  const [hives, setHives] = React.useState<SidebarHive[]>([])
  const [hivesLoading, setHivesLoading] = React.useState<boolean>(true)
  const [projectsLoading, setProjectsLoading] = React.useState<boolean>(true)
  const [notificationsInfo, setNotificationsInfo] =
    React.useState<NotificatonsInfo>({ count: 0 })
  const [, setNotificationsInfoLoading] = React.useState<boolean>(true)

  const [projects, setProjects] = React.useState<SidebarProject[]>([])
  React.useEffect(() => {
    const fetchProjects = async () => {
      if (loading) return

      if (!user?.user) {
        setProjectsLoading(false)
        return
      }

      setProjectsLoading(true)
      const response = await getProjectsByUserId(user.user)
      if (response.data) {
        const sidebarProjects: SidebarProject[] = response.data.map(
          (project) => ({
            id: project.project_id,
            title: project.title,
            url: `/projects/${project.project_id}`,
          })
        )
        setProjects(sidebarProjects)
      }
      setProjectsLoading(false)
    }

    void fetchProjects()
  }, [user?.user, loading])

  // Fetch hives/use cookies
  React.useEffect(() => {
    const fetchHives = async () => {
      if (loading) return

      if (!user?.user) {
        setHivesLoading(false)
        return
      }

      setHivesLoading(true)
      try {
        // Check if hives info cookie exists
        if (await hivesCookieExists()) {
          const cookieData = await getHivesCookie()
          setHives(cookieData)
        } else {
          // Fetch hive data and set cookie if not already cached
          const { data, errorMessage } = await getCurrentUserHives()
          if (data) {
            const formattedHives = data.map((hive) => ({
              title: hive.hive_info?.title,
              url: `/hives/${hive.hive_info.title}`,
              avatar_url:
                hive.hive_info.avatar_url ?? '/default-hive-avatar.png',
            })) as SidebarHive[]

            setHives(formattedHives)
            setHivesCookie(formattedHives) // Cache the hives
          } else {
            console.error(errorMessage)
          }
        }
      } catch (error) {
        console.error('Error fetching hives:', error)
      }
      setHivesLoading(false)
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
          // Fetch hive data and set cookie if not already cached
          const { data, errorMessage } =
            await getUnreadNotificationsCountByUserId()
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

    void fetchHives()
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
        title: 'Hives',
        url: '#',
        icon: PersonStanding,
        items: [
          {
            title: 'Create Hive',
            url: '/hives/create',
          },
          {
            title: 'Browse Hives',
            url: '/hives/browse',
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
            <Image
              src="/logo-and-codehive-dark.svg"
              className="block dark:hidden"
              alt="CodeHive and its logo"
              width={235}
              height={50}
              onError={(e) => {
                e.currentTarget.onerror = null
                if (e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.innerHTML = 'CodeHive'
                }
              }}
            />
            <Image
              src="/logo-and-codehive-light.svg"
              className="hidden dark:block"
              alt="CodeHive and its logo"
              width={235}
              height={50}
              onError={(e) => {
                e.currentTarget.onerror = null
                if (e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.innerHTML = 'CodeHive'
                }
              }}
            />
          </Link>
        ) : (
          <Link
            href="/"
            className="font-heading text-navLogo font-bold uppercase tracking-wider"
          >
            <Image src="/logo.svg" alt="CodeHive Logo" width={50} height={50} />
          </Link>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={projects} loading={projectsLoading} />
        <NavHives hives={hives} loading={hivesLoading} />
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
