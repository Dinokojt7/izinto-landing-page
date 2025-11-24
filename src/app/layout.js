// src/app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import { AuthProvider } from '@/context/authContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Izinto - On-Demand Home Services',
  description: 'Professional home services at your doorstep',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ReactQueryProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}