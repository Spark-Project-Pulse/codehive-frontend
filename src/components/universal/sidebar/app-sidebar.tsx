// src/components/universal/sidebar/app-sidebar.tsx

'use client'

import * as React from 'react'
import { Frame, MessageCircleQuestion, FolderKanban } from 'lucide-react'

import { NavMain } from '@/components/universal/sidebar/nav-main'
import { NavProjects } from '@/components/universal/sidebar/nav-projects'
import { NavUser } from '@/components/universal/sidebar/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { useUser } from '@/app/contexts/UserContext'
import Link from 'next/link'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentStep: number
}

export function AppSidebar({ currentStep, ...props }: AppSidebarProps) {
  const { user, loading } = useUser()
  const { open, toggleSidebar } = useSidebar()

  const data = {
    navMain: [
      {
        title: 'Questions',
        url: '#',
        icon: MessageCircleQuestion,
        items: [
          {
            title: 'Ask', // Should match 'Ask' in getButtonId
            url: '/questions/ask-question',
          },
          {
            title: 'Find Questions', // Should match 'Find Questions' in getButtonId
            url: '/questions/view-all-questions',
          },
        ],
      },
      {
        title: 'Projects',
        url: '#',
        icon: FolderKanban,
        items: [
          {
            title: 'Add', // Should match 'Add' in getButtonId
            url: '/projects/add-project',
          },
          {
            title: 'Explore Projects',
            url: '#',
          },
        ],
      },
    ],
    projects: [
      {
        name: '[project xyz]',
        url: '#',
        icon: Frame,
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
            <Image src="/logo.svg" alt="CodeHive Logo" width={150} height={50} />
          </Link>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} currentStep={currentStep} /> {/* Pass currentStep */}
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
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
          <NavUser user={user} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
