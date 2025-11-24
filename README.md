# Izinto - Web Client

A responsive Next.js web application for on-demand home services, built with modern React patterns and Firebase integration.


## 🏗️ Architecture Overview

### Tech Stack

Frontend: Next.js 14+ with React 18, JavaScript
State Management: Zustand + React Query
Backend: Node.js/Express API hosted on Netlify (same as mobile)
Database: Firebase (Firestore, Auth, Storage)
Authentication: Firebase Auth with session persistence
UI Framework: Tailwind CSS + Headless UI

### Enhanced Web-Specific Features

Advanced Cart Management with local storage persistence

Address Search & Geolocation with Google Maps integration

Responsive Design optimized for desktop, tablet, and mobile

SEO Optimization with Next.js SSR/SSG capabilities

Progressive Web App (PWA) support

Real-time Updates with Firebase listeners

## 📦 Packages

### Core Dependencies

{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "firebase": "^10.x",
    "tailwindcss": "^3.4.x",
    "zustand": "^4.4.x",
    "@tanstack/react-query": "^5.x",
    "react-hook-form": "^7.47.x",
    "framer-motion": "^10.16.x"
  }
}

### Enhanced Experience Packages

{
  "dependencies": {
    // Maps & Location
    "@react-google-maps/api": "^2.19.x",
    "react-leaflet": "^4.2.x",
    
    // UI Components
    "@headlessui/react": "^1.7.x",
    "lucide-react": "^0.294.x",
    
    // Cart & State Persistence
    "react-use-cart": "^2.2.x",
    "usehooks-ts": "^2.12.x",
    
    // Forms & Validation
    "zod": "^3.22.x",
    "@hookform/resolvers": "^3.3.x",
    
    // Animation & UX
    "framer-motion": "^10.16.x",
    "react-intersection-observer": "^9.5.x",
    
    // Utilities
    "date-fns": "^2.30.x",
    "clsx": "^2.0.x",
    "tailwind-merge": "^2.0.x"
  }
}

## 🗂️ Project Structure

izinto-web/
├── public/
│   ├── icons/
│   ├── images/
│   └── manifest.json
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.jsx
│   │   ├── (main)/
│   │   │   ├── page.jsx       # Landing page
│   │   │   ├── cart/
│   │   │   ├── services/
│   │   │   ├── checkout/
│   │   │   └── layout.jsx
│   │   ├── api/               # API routes
│   │   │   ├── auth/
│   │   │   ├── services/
│   │   │   └── cart/
│   │   ├── globals.css
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Dialog.jsx
│   │   │   └── Select.jsx
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navigation.jsx
│   │   │   └── CartSidebar.jsx
│   │   ├── services/          # Service-specific components
│   │   │   ├── ServiceGrid.jsx
│   │   │   ├── ServiceCard.jsx
│   │   │   ├── HorizontalScroll.jsx
│   │   │   └── SizeSelector.jsx
│   │   ├── maps/              # Map components
│   │   │   ├── LocationMap.jsx
│   │   │   ├── AddressSearch.jsx
│   │   │   └── ServiceArea.jsx
│   │   └── cart/              # Cart components
│   │       ├── CartItem.jsx
│   │       ├── CartSummary.jsx
│   │       └── AddToCart.jsx
│   ├── lib/                   # Utilities and configurations
│   │   ├── firebase/          # Firebase configuration
│   │   │   ├── config.js
│   │   │   ├── auth.js
│   │   │   ├── firestore.js
│   │   │   └── storage.js
│   │   ├── utils/             # Utility functions
│   │   │   ├── constants.js
│   │   │   ├── dimensions.js
│   │   │   ├── formatters.js
│   │   │   └── validators.js
│   │   ├── api/               # API client and hooks
│   │   │   ├── client.js
│   │   │   ├── services.js
│   │   │   ├── cart.js
│   │   │   └── hooks.js
│   │   └── stores/            # Zustand stores
│   │       ├── auth-store.js
│   │       ├── cart-store.js
│   │       ├── services-store.js
│   │       └── ui-store.js
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useServices.js
│   │   ├── useLocalStorage.js
│   │   └── useGeolocation.js
│   └── styles/                # Additional styles
│       ├── globals.css
│       ├── components.css
│       └── animations.css
├── tailwind.config.js
├── jsconfig.json
├── next.config.js
├── package.json
└── README.md

## 🎨 Design System

### Colors (Mirroring Flutter App)

// src/lib/utils/constants.js
export const COLORS = {
  // Primary colors
  primary: '#121212',        // Main text
  cartBlue: 'rgba(0, 0, 191, 0.737)', // Main buttons
  accent: '#cfc5a5',         // Banners & highlights
  white: '#ffffff',          // Backgrounds & secondary
  blue: '#3b82f6',           // Notices & information
  
  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  
  // Gray scale
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
};

### Dimensions & Responsive Breakpoints

// src/lib/utils/dimensions.js
export const BREAKPOINTS = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem'     // 64px
};

### Typograhy

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1' }],
        'display-md': ['2.5rem', { lineHeight: '1.2' }],
        'display-sm': ['2rem', { lineHeight: '1.3' }],
      },
      colors: {
        primary: '#121212',
        cartBlue: 'rgba(0, 0, 191, 0.737)',
        accent: '#cfc5a5',
        notice: '#3b82f6'
      }
    }
  }
}

## 🔧 Implementation Strategy

For service items: Use CSS with Tailwind + Framer Motion for animations

### 2. Map Integration

Package: @react-google-maps/api or react-leaflet

Google Maps for better address search integration

Leaflet for more customization and cost control

### 3. State & Session Persistence

// src/lib/stores/cart-store.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set({ items: [...get().items, item] }),
      removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),
      clearCart: () => set({ items: [] })
    }),
    {
      name: 'izinto-cart-storage',
    }
  )
)

### 4. API Intergration Pattern

// src/lib/api/services.js
import { useQuery } from '@tanstack/react-query'

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await fetch('/api/services')
      if (!response.ok) throw new Error('Failed to fetch services')
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

### 5. Service Data Model 

// src/lib/utils/serviceModels.js
export class NewSpecialtyModel {
  constructor(data) {
    this.id = data?.id || this.generateFallbackId(data);
    this.name = data?.name || 'Unknown Item';
    this.introduction = data?.introduction || 'No description available';
    this.price = this.safeParsePriceList(data?.price);
    this.size = this.safeParseSizeList(data?.size);
    this.img = data?.img || '/images/placeholder.png';
    this.details = data?.details || [];
    this.type = data?.type || 'General';
    this.material = data?.material || 'Standard';
    this.provider = data?.provider || 'Unknown Provider';
    this.time = data?.time || '';
    this.selectedSize = data?.selectedSize || '';
    this.originalId = data?.originalId || this.id;
    this.isSizeVariant = data?.isSizeVariant || false;
  }

  safeParsePriceList(priceData) {
    try {
      if (Array.isArray(priceData)) {
        const result = [];
        for (let item of priceData) {
          const parsed = parseInt(item);
          if (!isNaN(parsed)) {
            result.push(parsed);
          }
        }
        return result.length > 0 ? result : [0];
      }
      return [0];
    } catch (e) {
      return [0];
    }
  }

  safeParseSizeList(sizeData) {
    try {
      if (Array.isArray(sizeData)) {
        return sizeData.map(item => item.toString());
      }
      return ['Standard'];
    } catch (e) {
      return ['Standard'];
    }
  }

  generateFallbackId(data) {
    return Math.abs(JSON.stringify(data).hashCode()) % 1000000;
  }

  get displayName() {
    if (this.isSizeVariant && this.selectedSize) {
      return `${this.name} (${this.selectedSize})`;
    }
    return this.name;
  }

  get actualPrice() {
    try {
      if (this.selectedSize && this.size && this.price) {
        const sizeIndex = this.size.indexOf(this.selectedSize);
        if (sizeIndex !== -1 && sizeIndex < this.price.length) {
          return this.price[sizeIndex];
        }
      }
      return this.firstPrice;
    } catch (e) {
      return this.firstPrice;
    }
  }

  get firstPrice() {
    return this.price && this.price.length > 0 ? this.price[0] : 0;
  }
}

// Add hashCode method to String prototype for fallback ID generation
String.prototype.hashCode = function() {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
};

## 🚀 Getting Started

### Prerequisites

Node.js 18+

Firebase project

Google Maps API key (optional)

### 

npx create-next-app@latest izinto-web --tailwind --eslint --app
cd izinto-web
npm install 

## 📱 Core Features Matching Mobile App

### Service Categories (Same as Flutter App)

🧺 Laundry & Dry Cleaning

⛽ Gas Refill & Exchange

🐾 Pet Care & Grooming

🧹 Home Cleaning Services

🚗 Mobile Car Wash

👟 Sneaker & Blanket Cleaning

### Key Functionalities

Real-time service booking

Live order tracking

Secure in-app payments

Multi-service cart management

Push notifications

Location-based services

