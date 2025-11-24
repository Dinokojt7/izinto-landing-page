// src/components/services/ServiceGrid.js
'use client'
import { useServicesWithFallback } from '@/lib/api/services'
import ServiceCard from './ServiceCard'
import HorizontalScroll from './HorizontalScroll'

export default function ServiceGrid() {
  const { data: services, isLoading, error } = useServicesWithFallback()

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg"></div>
              <div className="mt-4 space-y-2">
                <div className="bg-gray-200 h-4 rounded"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-red-600">Failed to load services. Please try again later.</p>
      </div>
    )
  }

  return (
    <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-primary mb-8">Our Services</h2>
      
      {/* Horizontal scroll for featured services */}
      <HorizontalScroll services={services?.Specialties || []} />
      
      {/* Grid layout for all services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {services?.Specialties?.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  )
}