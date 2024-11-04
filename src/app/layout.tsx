import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { UserProvider } from '@/app/contexts/UserContext'
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

export const metadata: Metadata = {
  title: 'CodeHive',
  description: 'Keep on buzzing!',
}
import { ThemeProvider } from "@/components/universal/theme-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                  <div className="flex items-center gap-2 px-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarTrigger className="-ml-1" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {/* TODO: fix tooltip styling (doesn't seem correct) */}
                        <p>⌘ /</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </header>
                {children}
                <Toaster />
              </SidebarInset>
            </SidebarProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
