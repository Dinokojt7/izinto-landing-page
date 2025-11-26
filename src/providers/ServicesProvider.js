// src/providers/ServicesProvider.js
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { fetchServicesClient } from '@/lib/api/client-services'

const ServicesContext = createContext()

export function ServicesProvider({ children }) {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true)
        const servicesData = await fetchServicesClient()
        setServices(servicesData)
      } catch (error) {
        console.error('Failed to load services:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [])

  return (
    <ServicesContext.Provider value={{ 
      services, 
      isLoading,
      hasServices: services.length > 0 
    }}>
      {children}
    </ServicesContext.Provider>
  )
}

export const useServices = () => {
  const context = useContext(ServicesContext)
  if (!context) {
    throw new Error('useServices must be used within ServicesProvider')
  }
  return context
}