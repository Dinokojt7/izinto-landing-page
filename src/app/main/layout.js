// src/app/main/layout.js
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}