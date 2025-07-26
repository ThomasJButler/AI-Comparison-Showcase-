# Customization Guide

## Overview

This guide explains how to customize the AI Comparison Showcase to meet your specific needs, from simple theme changes to adding new AI providers.

## Table of Contents

1. [Theme Customization](#theme-customization)
2. [Adding New Models](#adding-new-models)
3. [Creating Custom Visualizations](#creating-custom-visualizations)
4. [Extending the API](#extending-the-api)
5. [Custom Components](#custom-components)
6. [Configuration Options](#configuration-options)

---

## Theme Customization

### Colour Scheme

The application uses a Matrix-inspired theme by default. Customize it in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Matrix theme (default)
        matrix: {
          50: '#e6ffe6',
          100: '#b3ffb3',
          200: '#80ff80',
          300: '#4dff4d',
          400: '#1aff1a',
          500: '#00ff00', // Primary green
          600: '#00cc00',
          700: '#009900',
          800: '#006600',
          900: '#003300',
        },
        
        // Your custom theme
        brand: {
          primary: '#your-color',
          secondary: '#your-color',
          accent: '#your-color',
        }
      }
    }
  }
}
```

### Dark Mode Variants

Create custom dark mode styles:

```css
/* app/globals.css */
:root {
  --background: 255 255 255;
  --foreground: 0 0 0;
}

[data-theme="dark"] {
  --background: 0 0 0;
  --foreground: 255 255 255;
}

[data-theme="matrix"] {
  --background: 0 0 0;
  --foreground: 0 255 0;
  --accent: 0 255 0;
}
```

### Custom Fonts

Add custom fonts in `app/layout.tsx`:

```typescript
import { Inter, JetBrains_Mono, Your_Font } from 'next/font/google'

const yourFont = Your_Font({
  subsets: ['latin'],
  variable: '--font-your-font',
})

export default function RootLayout({ children }) {
  return (
    <html className={`${yourFont.variable}`}>
      {children}
    </html>
  )
}
```

## Adding New Models

### Step 1: Define the Model

Create a new model definition in `lib/playground/models.ts`:

```typescript
export const myCustomModel: AIModel = {
  id: 'my-custom-model',
  name: 'My Custom Model',
  provider: 'custom',
  description: 'A custom AI model implementation',
  capabilities: ['text-generation', 'code', 'analysis'],
  pricing: {
    input: 0.001,  // $ per 1K tokens
    output: 0.002, // $ per 1K tokens
  },
  limits: {
    maxTokens: 4096,
    rateLimit: 100, // requests per minute
  },
  parameters: {
    temperature: { min: 0, max: 2, default: 0.7 },
    topP: { min: 0, max: 1, default: 0.9 },
  }
}

// Add to models array
export const models = [
  ...existingModels,
  myCustomModel
]
```

### Step 2: Create API Client

Implement the API client in `lib/api/clients/customClient.ts`:

```typescript
import { BaseAPIClient } from '../apiClient'

export class CustomModelClient extends BaseAPIClient {
  constructor(apiKey: string) {
    super({
      baseURL: 'https://api.custom-model.com/v1',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    })
  }

  async generateCompletion(prompt: string, options?: CompletionOptions) {
    const response = await this.post('/completions', {
      prompt,
      max_tokens: options?.maxTokens || 1000,
      temperature: options?.temperature || 0.7,
      stream: options?.stream || false,
    })

    return this.transformResponse(response)
  }

  private transformResponse(response: any): ModelResponse {
    return {
      content: response.choices[0].text,
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      },
      model: 'my-custom-model',
      timestamp: Date.now(),
    }
  }
}
```

### Step 3: Register in API Gateway

Add to `lib/api/index.ts`:

```typescript
import { CustomModelClient } from './clients/customClient'

export function getModelClient(model: string, apiKey?: string) {
  switch (model) {
    case 'my-custom-model':
      return new CustomModelClient(apiKey || process.env.CUSTOM_MODEL_API_KEY)
    // ... other models
  }
}
```

## Creating Custom Visualizations

### Basic Visualization Component

Create a new visualization in `components/visualizations/custom-chart.tsx`:

```typescript
import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

interface CustomChartProps {
  data: DataPoint[]
  width?: number
  height?: number
  theme?: 'light' | 'dark' | 'matrix'
}

export function CustomChart({ data, width = 800, height = 400, theme = 'matrix' }) {
  const processedData = useMemo(() => {
    // Process your data here
    return data.map(point => ({
      ...point,
      value: point.value * 100
    }))
  }, [data])

  const colors = {
    light: '#000000',
    dark: '#ffffff',
    matrix: '#00ff00',
  }

  return (
    <div className="custom-chart-container">
      <LineChart width={width} height={height} data={processedData}>
        <XAxis stroke={colors[theme]} />
        <YAxis stroke={colors[theme]} />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={colors[theme]}
          strokeWidth={2}
          dot={{ fill: colors[theme], r: 4 }}
        />
      </LineChart>
    </div>
  )
}
```

### Advanced 3D Visualization

Using Three.js for complex visualizations:

```typescript
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export function Custom3DVisualization({ data, config }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      config.width / config.height,
      0.1,
      1000
    )
    camera.position.z = 5

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(config.width, config.height)
    mountRef.current.appendChild(renderer.domElement)

    // Create custom geometry from data
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array(data.flatMap(d => [d.x, d.y, d.z]))
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

    // Material
    const material = new THREE.PointsMaterial({
      color: 0x00ff00,
      size: 0.05,
    })

    // Mesh
    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)
      points.rotation.x += 0.001
      points.rotation.y += 0.001
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      mountRef.current?.removeChild(renderer.domElement)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [data, config])

  return <div ref={mountRef} className="visualization-3d" />
}
```

## Extending the API

### Custom Endpoints

Add new API routes in `app/api/custom/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Your custom logic here
    const result = await processCustomRequest(body)
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Processing failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  
  // Handle GET requests
  const data = await fetchCustomData(query)
  
  return NextResponse.json(data)
}
```

### Middleware Extensions

Add custom middleware in `middleware.ts`:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Custom authentication
  const token = request.headers.get('authorization')
  
  if (!token && request.nextUrl.pathname.startsWith('/api/protected')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  // Custom headers
  const response = NextResponse.next()
  response.headers.set('X-Custom-Header', 'value')
  
  return response
}

export const config = {
  matcher: ['/api/:path*', '/protected/:path*']
}
```

## Custom Components

### Creating a Plugin System

Build extensible components:

```typescript
// lib/plugins/types.ts
export interface Plugin {
  id: string
  name: string
  component: React.ComponentType<any>
  config?: PluginConfig
}

// lib/plugins/manager.ts
class PluginManager {
  private plugins: Map<string, Plugin> = new Map()

  register(plugin: Plugin) {
    this.plugins.set(plugin.id, plugin)
  }

  get(id: string): Plugin | undefined {
    return this.plugins.get(id)
  }

  getAll(): Plugin[] {
    return Array.from(this.plugins.values())
  }
}

export const pluginManager = new PluginManager()
```

### Dynamic Component Loading

```typescript
// components/plugin-renderer.tsx
import { Suspense, lazy } from 'react'
import { pluginManager } from '@/lib/plugins/manager'

export function PluginRenderer({ pluginId, props }) {
  const plugin = pluginManager.get(pluginId)
  
  if (!plugin) {
    return <div>Plugin not found</div>
  }

  const Component = plugin.component

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  )
}
```

## Configuration Options

### Environment-Based Config

Create different configurations for different environments:

```typescript
// config/index.ts
const configs = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    enableDebug: true,
    mockResponses: true,
  },
  production: {
    apiUrl: 'https://api.yourdomain.com',
    enableDebug: false,
    mockResponses: false,
  },
  staging: {
    apiUrl: 'https://staging-api.yourdomain.com',
    enableDebug: true,
    mockResponses: false,
  }
}

export const config = configs[process.env.NODE_ENV] || configs.development
```

### Feature Flags

Implement feature flags for gradual rollouts:

```typescript
// lib/features.ts
export const features = {
  newVisualization: process.env.NEXT_PUBLIC_ENABLE_NEW_VIZ === 'true',
  experimentalModels: process.env.NEXT_PUBLIC_ENABLE_EXPERIMENTAL === 'true',
  advancedAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
}

// Usage in components
import { features } from '@/lib/features'

export function MyComponent() {
  return (
    <>
      {features.newVisualization && <NewVisualization />}
      {features.experimentalModels && <ExperimentalModels />}
    </>
  )
}
```

### User Preferences

Store user customizations:

```typescript
// hooks/use-preferences.ts
export function usePreferences() {
  const [preferences, setPreferences] = useState(() => {
    const stored = localStorage.getItem('user-preferences')
    return stored ? JSON.parse(stored) : defaultPreferences
  })

  const updatePreference = (key: string, value: any) => {
    const updated = { ...preferences, [key]: value }
    setPreferences(updated)
    localStorage.setItem('user-preferences', JSON.stringify(updated))
  }

  return { preferences, updatePreference }
}
```

## Advanced Customization

### Custom Comparison Algorithms

```typescript
// lib/comparison/custom-algorithm.ts
export class CustomComparisonAlgorithm {
  compare(responses: ModelResponse[]): ComparisonResult {
    // Implement custom scoring logic
    const scores = responses.map(response => ({
      model: response.model,
      accuracy: this.calculateAccuracy(response),
      relevance: this.calculateRelevance(response),
      creativity: this.calculateCreativity(response),
    }))

    return {
      scores,
      winner: this.determineWinner(scores),
      insights: this.generateInsights(scores),
    }
  }

  private calculateAccuracy(response: ModelResponse): number {
    // Your accuracy calculation
    return 0
  }

  private calculateRelevance(response: ModelResponse): number {
    // Your relevance calculation
    return 0
  }

  private calculateCreativity(response: ModelResponse): number {
    // Your creativity calculation
    return 0
  }
}
```

### Custom Export Formats

```typescript
// lib/export/custom-exporter.ts
export class CustomExporter {
  export(data: ComparisonData, format: 'csv' | 'json' | 'pdf') {
    switch (format) {
      case 'csv':
        return this.toCSV(data)
      case 'json':
        return this.toJSON(data)
      case 'pdf':
        return this.toPDF(data)
    }
  }

  private toCSV(data: ComparisonData): string {
    const headers = ['Model', 'Response Time', 'Tokens', 'Cost']
    const rows = data.responses.map(r => [
      r.model,
      r.metrics.responseTime,
      r.usage.totalTokens,
      r.metrics.cost
    ])
    
    return [headers, ...rows]
      .map(row => row.join(','))
      .join('\n')
  }
}
```

## Summary

Customization allows you to:
- ✅ Adapt the theme to your brand
- ✅ Add new AI models
- ✅ Create custom visualizations
- ✅ Extend API functionality
- ✅ Build plugin systems
- ✅ Implement feature flags

The modular architecture makes it easy to extend and customize without modifying core functionality.