'use client'

import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { UserProvider, useUser } from '@/app/contexts/UserContext'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/universal/sidebar/app-sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@radix-ui/react-tooltip'
import { NextStepProvider, NextStep } from 'nextstepjs'
import CustomCard from '@/components/pages/tutorial/Card'
import { getSteps } from '@/app/tutorial/steps'
import { useState } from 'react' // Import useState

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <NextStepProvider>
            <LayoutWithNextStep>{children}</LayoutWithNextStep>
          </NextStepProvider>
        </UserProvider>
      </body>
    </html>
  )
}

// Create a new component to handle dynamic steps
function LayoutWithNextStep({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser()
  const [currentStep, setCurrentStep] = useState<number>(0) // Add currentStep state

  // Wait for the user to load
  if (loading) {
    return null // Or a loading spinner
  }

  const username = user?.username || 'guest'

  // Get steps with dynamic username
  const steps = getSteps(username)

  // Handler for when the tutorial step changes
  const handleStepChange = (step: number, tourName?: string | null) => {
    setCurrentStep(step)
  }

  return (
    <NextStep
      steps={steps}
      cardComponent={CustomCard}
      onStepChange={handleStepChange} // Add onStepChange prop
    >
      <SidebarProvider>
        <AppSidebar currentStep={currentStep} /> {/* Pass currentStep to AppSidebar */}
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger className="-ml-1" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>⌘ /</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </header>
          {children}
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    </NextStep>
  )
}