import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'FoodExpress',
  description: 'Fast, fresh food delivery from your favorite local kitchens.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,107,53,0.18),transparent_35%),radial-gradient(circle_at_85%_12%,rgba(255,71,87,0.14),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(255,202,152,0.24),transparent_45%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.82),rgba(255,255,255,0.95))]" />
        </div>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <div className="mx-auto w-full max-w-[1280px] px-4 py-6 md:px-6 md:py-8">
              {children}
            </div>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
