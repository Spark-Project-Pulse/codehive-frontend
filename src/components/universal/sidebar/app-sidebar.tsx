"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/universal/sidebar/nav-main"
import { NavProjects } from "@/components/universal/sidebar/nav-projects"
import { NavUser } from "@/components/universal/sidebar/nav-user"
import { TeamSwitcher } from "@/components/universal/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useUser } from "@/app/contexts/UserContext"
import { LoadingSpinner } from "@/components/ui/loading"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useUser()

  // if (loading) return <LoadingSpinner />
  
  const data = {
    // user: {
    //   name: user ? user.username : "Anonymous Atom",      // TODO: maybe use some auto-generated random user
    //   email: "m@example.com",
    //   // avatar: user?.pfp_url ? user.pfp_url : "../../../public/anon-user-pfp.jpg",
    //   avatar: "../../../public/anon-user-pfp.jpg",
    // },
    navMain: [
      {
        title: "Questions",
        url: "#",
        icon: SquareTerminal,
        items: [
          {
            title: "Ask",
            url: "/questions/ask-question",
          },
          {
            title: "Find Questions",
            url: "/questions/view-all-questions",
          },
        ],
      },
      {
        title: "Projects",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Add",
            url: "/projects/add-project",
          },
          {
            title: "Explore Projects",
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "[projext xyz]",
        url: "#",
        icon: Frame,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
