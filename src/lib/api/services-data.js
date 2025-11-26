// src/lib/api/services-data.js
export async function getAllServices() {
  const API_BASE_URL = process.env.API_BASE_URL || 'https://your-netlify-app.netlify.app/.netlify/functions/api'
  
  const endpoints = [
    '/laundry',
    '/gas-refill', 
    '/carpet-care',
    '/pet-care',
    '/home-items'
  ]

  try {
    console.log('🔄 Server: Fetching all services...')
    
    const results = await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        try {
          const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            next: { revalidate: 3600 } // Cache for 1 hour
          })
          
          if (!response.ok) {
            throw new Error(`Failed to fetch ${endpoint}: ${response.status}`)
          }
          
          const data = await response.json()
          console.log(`✅ Server: ${endpoint} - ${data.Specialties?.length || data.specialties?.length || 0} items`)
          
          // Extract services from different response formats
          if (Array.isArray(data)) return data
          if (data.Specialties) return data.Specialties
          if (data.specialties) return data.specialties
          return []
        } catch (error) {
          console.warn(`❌ Server: Failed to fetch ${endpoint}:`, error.message)
          return []
        }
      })
    )

    // Combine all successful results
    const allServices = results.flatMap(result => 
      result.status === 'fulfilled' ? result.value : []
    )

    console.log(`🎯 Server: Total services fetched: ${allServices.length}`)
    
    // Create sequential mix
    const sequentialServices = []
    const maxLength = Math.max(...results.map(r => r.value?.length || 0))
    
    for (let i = 0; i < maxLength; i++) {
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value[i]) {
          sequentialServices.push(result.value[i])
        }
      })
    }

    return sequentialServices

  } catch (error) {
    console.error('💥 Server: Error fetching services:', error)
    return []
  }
}