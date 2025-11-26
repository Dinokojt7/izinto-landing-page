// src/app/api/services/route.js
import { getAllServices } from '@/lib/api/services-data'

export async function GET() {
  try {
    const services = await getAllServices()
    return Response.json(services)
  } catch (error) {
    return Response.json([], { status: 500 })
  }
}