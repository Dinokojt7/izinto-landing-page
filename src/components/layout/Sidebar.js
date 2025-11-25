// src/components/layout/Sidebar.js
'use client'
import { useServices } from '@/lib/api/services'

export default function Sidebar({ isOpen, onClose }) {
  const { data: services } = useServices()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 left-0 z-50 w-80 h-full bg-white shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-xl font-bold text-primary">Izinto</span>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a href="/" className="block p-3 text-primary hover:bg-gray-100 rounded-lg font-semibold">
                Home
              </a>
            </li>
            
            {/* Service Categories */}
            {services?.Specialties?.map((service) => (
              <li key={service.id}>
                <a 
                  href={`/services/${service.type.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm text-gray-500">{service.type}</div>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}