// src/app/layout.js
import { Inter, Roboto } from 'next/font/google'
import './globals.css'
import Footer from '@/components/layout/Footer'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import { AuthProvider } from '@/context/authContext'

const inter = Inter({ subsets: ['latin'] })
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700', '900'] })

export const metadata = {
  title: 'Izinto - On-Demand Home Services',
  description: 'Professional home services at your doorstep',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}  suppressHydrationWarning>
        <ReactQueryProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
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