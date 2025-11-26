// src/lib/api/services.js
import { useQuery } from '@tanstack/react-query'
import apiClient from './axios-client'

// Fetch services through our working proxy route
const fetchServices = async () => {
  try {
    console.log('🔄 Fetching services through proxy...')
    const response = await apiClient.get('/services')
    
    console.log('✅ Services response:', response.data)
    return response.data

  } catch (error) {
    console.error('💥 Failed to fetch services:', error.message)
    throw new Error('Unable to load services')
  }
}

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllServices = useServices // Alias for consistency