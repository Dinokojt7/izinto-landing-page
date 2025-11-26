// src/app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import { ServicesProvider } from '@/providers/ServicesProvider'
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
            <ServicesProvider>
              {children}
            </ServicesProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}