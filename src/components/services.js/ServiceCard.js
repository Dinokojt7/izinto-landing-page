// src/components/services/ServiceCard.js
'use client'
import { useState } from 'react'
import { NewSpecialtyModel } from '@/lib/utils/serviceModels'
import AddToCart from '@/components/cart/AddToCart'

export default function ServiceCard({ service }) {
  const [selectedService, setSelectedService] = useState(() => new NewSpecialtyModel(service))
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleSizeChange = (size) => {
    const updatedService = new NewSpecialtyModel({
      ...service,
      selectedSize: size,
      isSizeVariant: true,
      originalId: service.id
    })
    setSelectedService(updatedService)
  }

  // Handle different image path structures
  const getImageSrc = () => {
    if (!service.img) return null
    // Handle different image path formats
    if (service.img.startsWith('http')) return service.img
    if (service.img.startsWith('/')) return service.img
    if (service.img.startsWith('assets/')) return `/${service.img}`
    return service.img
  }

  const imageSrc = getImageSrc()

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Service Image */}
      <div className="h-48  relative">
        {imageSrc && !imageError ? (
          <>
            <img 
              src={service.img} 
              alt={service.name}
              className="w-80% h-80% object-cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-pulse text-gray-400">Loading...</div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-accent">
            <span className="text-primary font-semibold text-center px-2">{service.name}</span>
          </div>
        )}
      </div>
      
      {/* Simplified Content */}
      <div className="p-4">
        <h3 className="text-sm text-gray-600 font-medium mb-3 truncate">
          {service.name}
        </h3>
        
      </div>
    </div>
  )
}