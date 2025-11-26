// src/app/api/services/route.js
import { NextResponse } from 'next/server'

const API_BASE_URL = 'https://gregarious-marshmallow-0b7661.netlify.app/.netlify/functions/api'

export async function GET() {
  const endpoints = [
    '/gas-refill', 
    '/carpet-care',
    '/pet-care',
    '/home-items'
  ]

  try {
    console.log('🔄 Proxying requests...')
    
    const requests = endpoints.map(endpoint => 
      fetch(`${API_BASE_URL}${endpoint}`)
        .then(res => res.ok ? res.json() : { Specialties: [] })
        .catch(() => ({ Specialties: [] }))
    )

    const results = await Promise.all(requests)
    
    // Get services from each endpoint and track their source
    const servicesByEndpoint = results.map((result, index) => ({
      endpoint: endpoints[index],
      services: result.Specialties || result.specialties || []
    }))

    console.log('📊 Services by endpoint:')
    servicesByEndpoint.forEach(item => {
      console.log(`   ${item.endpoint}: ${item.services.length} services`)
    })

    // Create randomized sequential mix
    const randomizedServices = []
    
    // Find the maximum number of services from any endpoint
    const maxServices = Math.max(...servicesByEndpoint.map(item => item.services.length))
    
    // Create a round-robin randomized sequence
    for (let i = 0; i < maxServices; i++) {
      // Shuffle the endpoints order for each round to ensure randomness
      const shuffledEndpoints = [...servicesByEndpoint].sort(() => Math.random() - 0.5)
      
      shuffledEndpoints.forEach(item => {
        if (item.services[i]) {
          randomizedServices.push(item.services[i])
        }
      })
    }

    console.log(`🎯 Total randomized services: ${randomizedServices.length}`)

    // Return in the same format as your backend
    return NextResponse.json({ 
      Specialties: randomizedServices,
      total: randomizedServices.length,
      success: true
    })

  } catch (error) {
    console.error('💥 Proxy error:', error)
    
    // Fallback: try to get just home-items
    try {
      const fallback = await fetch(`${API_BASE_URL}/home-items`)
      const data = await fallback.json()
      return NextResponse.json(data)
    } catch (fallbackError) {
      return NextResponse.json(
        { Specialties: [], error: 'Failed to fetch services' },
        { status: 500 }
      )
    }
  }
}