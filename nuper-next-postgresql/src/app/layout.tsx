import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/Providers'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' })

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Nuper Industries - Geleceğin Teknolojileri',
  description: 'Nuper Industries bünyesinde geliştirilen inovasyonlar, Ar-Ge projeleri, teknoloji bültenleri ve etkinlikler.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="scroll-smooth" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        spaceGrotesk.variable
      )}>
        <Providers>
          {children}
        </Providers>
        <Toaster position="bottom-right" richColors />
        <SpeedInsights />
      </body>
    </html>
  )
}
