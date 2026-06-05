import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { shadcn } from '@clerk/ui/themes'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Mini Resource Library',
  description: 'Save and manage private learning resources.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        theme: shadcn,
        elements: {
          popoverBox: '!shadow-md ring-1 !ring-foreground/10',
        },
      }}
    >
      <html
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        lang="en"
        suppressHydrationWarning
      >
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <SidebarProvider
                style={
                  {
                    '--sidebar-width': 'calc(var(--spacing) * 60)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                  } as React.CSSProperties
                }
              >
                <AppSidebar variant="inset" />
                <SidebarInset>{children}</SidebarInset>
              </SidebarProvider>
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
