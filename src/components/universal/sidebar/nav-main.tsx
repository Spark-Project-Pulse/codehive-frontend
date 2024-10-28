// src/components/universal/sidebar/nav-main.tsx

'use client'

import { ChevronRight, type LucideIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'

interface NavMainProps {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  currentStep: number
}

export function NavMain({ items, currentStep }: NavMainProps) {
  const [openMenus, setOpenMenus] = useState<{ [title: string]: boolean }>({})

  useEffect(() => {
    // Map step numbers to menu titles that need to be expanded
    const stepsToMenuTitles: { [step: number]: string } = {
      2: 'Questions', // Step 2 corresponds to 'Questions' menu
      3: 'Questions',
      4: 'Projects',
      5: 'Projects',
      // Add other mappings as necessary
    }

    const menuToOpen = stepsToMenuTitles[currentStep]

    if (menuToOpen) {
      setOpenMenus((prev) => ({ ...prev, [menuToOpen]: true }))
    }
  }, [currentStep])

  const handleOpenChange = (title: string, open: boolean) => {
    setOpenMenus((prev) => ({ ...prev, [title]: open }))
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Forum</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isOpen = openMenus[item.title] || false

          return (
            <Collapsible
              key={item.title}
              open={isOpen}
              onOpenChange={(open) => handleOpenChange(item.title, open)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a
                            id={getButtonId(subItem.title)}
                            href={subItem.url}
                          >
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function getButtonId(title: string) {
  switch (title) {
    case 'Ask':
      return 'ask-question-button'
    case 'Find Questions':
      return 'view-all-questions-button'
    case 'Add':
      return 'add-project-button'
    // Add other cases as needed
    default:
      return undefined
  }
}