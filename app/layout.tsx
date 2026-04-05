import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/layout/MobileNav'
import ThemeProvider from '@/components/theme/ThemeProvider'
import { getGoogleFontsURL } from '@/lib/constants/fonts'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Custom Acrylic & Decor - Unique Stands, Frames & Magnets',
  description: 'Shop custom acrylic stands, wall frames, and fridge magnets. Create personalized decor for your space.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={getGoogleFontsURL()} rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <Header />
          <main className="min-h-screen pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  )
}
