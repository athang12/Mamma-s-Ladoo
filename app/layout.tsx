import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { getGoogleFontsURL } from '@/lib/constants/fonts'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Mamma's Ladoo - Fresh Ladoos & Snacks",
  description: 'Shop fresh, handmade ladoos and traditional snacks delivered to your doorstep.',
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
        <Header />
        <main className="min-h-screen pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  )
}
