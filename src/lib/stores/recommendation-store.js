// src/lib/stores/recommendation-store.js
import { create } from 'zustand'

export const useRecommendationStore = create((set, get) => ({
  recommendations: [],
  isLoading: true,
  
  setRecommendations: (services) => {
    set({ 
      recommendations: services || [],
      isLoading: false 
    })
  },
  
  setLoading: (loading) => {
    set({ isLoading: loading })
  }
}))