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
  title: 'Welcome to CodeHive | Your developer hivemind',
  description: 'Keep on buzzing!',
}
import { ThemeProvider } from "@/components/universal/theme-provider"
import SiteFooter from '@/components/universal/footer/footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className="flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="min-h-screen flex flex-col">
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
                <main className="flex-grow ml-6 mr-6 mt-12">{children}</main>
                <SiteFooter />
                <Toaster />
              </SidebarInset>
            </SidebarProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
