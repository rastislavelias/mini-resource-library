import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { shadcn } from '@clerk/ui/themes'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

import { ResponsiveToaster } from '@/components/responsive-toaster'
import { ThemeProvider } from '@/components/theme-provider'

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
      signInForceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/dashboard"
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
            {children}
            <ResponsiveToaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
