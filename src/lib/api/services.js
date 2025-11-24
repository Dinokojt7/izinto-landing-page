// src/lib/api/services.js
import { useQuery } from '@tanstack/react-query'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-netlify-app.netlify.app/.netlify/functions/api'

const fetchServices = async () => {
  const response = await fetch(`${API_BASE_URL}/home-items`)
  if (!response.ok) {
    throw new Error(`Failed to fetch services: ${response.status}`)
  }
  return response.json()
}

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })
}

export const useServiceCategories = () => {
  return useQuery({
    queryKey: ['service-categories'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/categories`)
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`)
      }
      return response.json()
    },
  })
}

// Fallback mock data for development
const mockServices = {
  "Specialties": [
    {
      "id": 2111,
      "name": "Rug Cleaning",
      "introduction": "Full extraction cleaning to lift dirt from carpet fibers. Spot treatment for stubborn stains.",
      "price": [599, 799, 999],
      "size": ["Small", "Medium", "Large"],
      "img": "/images/rug.png",
      "type": "Rug",
      "material": "Deep Cleaning",
      "provider": "Modern8"
    },
    {
      "id": 2112,
      "name": "Couch Cleaning",
      "introduction": "Full extraction cleaning to lift dirt from couch fibers. Stain treatment for specific spots.",
      "price": [599, 649, 749],
      "size": ["1 Seater", "2 Seater", "3 Seater"],
      "img": "/images/couch.png",
      "type": "Couch",
      "material": "Deep Cleaning",
      "provider": "Modern8"
    }
  ]
}

export const useServicesWithFallback = () => {
  return useQuery({
    queryKey: ['services-with-fallback'],
    queryFn: async () => {
      try {
        return await fetchServices()
      } catch (error) {
        console.warn('Using fallback services data:', error.message)
        return mockServices
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}