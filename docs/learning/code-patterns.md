# Code Patterns and Best Practices

## Overview

This document explains the code patterns, architectural decisions, and best practices used throughout the AI Comparison Showcase. Learn how to write maintainable, performant code that follows the project's conventions.

## Table of Contents

1. [React Patterns](#react-patterns)
2. [TypeScript Patterns](#typescript-patterns)
3. [State Management](#state-management)
4. [Performance Patterns](#performance-patterns)
5. [Testing Patterns](#testing-patterns)
6. [Error Handling](#error-handling)
7. [Security Patterns](#security-patterns)

---

## React Patterns

### Component Structure

We follow a consistent component structure:

```typescript
// components/feature/my-component.tsx

// 1. Imports - grouped and ordered
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// 2. Types/Interfaces
interface MyComponentProps {
  title: string
  data: DataType[]
  onAction?: (item: DataType) => void
  className?: string
}

// 3. Constants
const DEFAULT_LIMIT = 10
const ANIMATION_DURATION = 0.3

// 4. Component
export function MyComponent({ 
  title, 
  data, 
  onAction,
  className 
}: MyComponentProps) {
  // 5. State and hooks
  const [isLoading, setIsLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DataType | null>(null)
  
  // 6. Computed values
  const sortedData = useMemo(() => 
    data.sort((a, b) => a.name.localeCompare(b.name)),
    [data]
  )
  
  // 7. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies])
  
  // 8. Handlers
  const handleItemClick = (item: DataType) => {
    setSelectedItem(item)
    onAction?.(item)
  }
  
  // 9. Render
  return (
    <div className={cn('component-wrapper', className)}>
      <h2>{title}</h2>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ItemList 
          items={sortedData}
          onItemClick={handleItemClick}
        />
      )}
    </div>
  )
}
```

### Custom Hooks Pattern

Extract reusable logic into custom hooks:

```typescript
// hooks/use-debounced-value.ts
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return debouncedValue
}

// Usage
function SearchComponent() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)
  
  useEffect(() => {
    if (debouncedSearch) {
      performSearch(debouncedSearch)
    }
  }, [debouncedSearch])
}
```

### Compound Components

For complex UI components with multiple parts:

```typescript
// components/ui/data-table.tsx
interface DataTableProps {
  children: React.ReactNode
}

interface DataTableHeaderProps {
  children: React.ReactNode
}

// Main component
export function DataTable({ children }: DataTableProps) {
  return <table className="data-table">{children}</table>
}

// Sub-components
DataTable.Header = function DataTableHeader({ children }: DataTableHeaderProps) {
  return <thead className="data-table-header">{children}</thead>
}

DataTable.Body = function DataTableBody({ children }) {
  return <tbody className="data-table-body">{children}</tbody>
}

DataTable.Row = function DataTableRow({ children }) {
  return <tr className="data-table-row">{children}</tr>
}

// Usage
<DataTable>
  <DataTable.Header>
    <DataTable.Row>
      <th>Name</th>
      <th>Value</th>
    </DataTable.Row>
  </DataTable.Header>
  <DataTable.Body>
    {data.map(item => (
      <DataTable.Row key={item.id}>
        <td>{item.name}</td>
        <td>{item.value}</td>
      </DataTable.Row>
    ))}
  </DataTable.Body>
</DataTable>
```

### Render Props Pattern

For maximum flexibility:

```typescript
interface RenderPropComponentProps<T> {
  data: T[]
  render: (item: T, index: number) => React.ReactNode
  fallback?: React.ReactNode
}

function FlexibleList<T>({ data, render, fallback }: RenderPropComponentProps<T>) {
  if (!data.length) {
    return <>{fallback || <EmptyState />}</>
  }
  
  return (
    <ul className="flexible-list">
      {data.map((item, index) => (
        <li key={index}>{render(item, index)}</li>
      ))}
    </ul>
  )
}

// Usage
<FlexibleList
  data={models}
  render={(model) => (
    <ModelCard model={model} onClick={() => selectModel(model)} />
  )}
  fallback={<NoModelsMessage />}
/>
```

## TypeScript Patterns

### Type Guards

Ensure type safety at runtime:

```typescript
// Type guard function
function isModelResponse(data: unknown): data is ModelResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'content' in data &&
    'model' in data &&
    'timestamp' in data
  )
}

// Usage
async function processResponse(data: unknown) {
  if (!isModelResponse(data)) {
    throw new Error('Invalid response format')
  }
  
  // TypeScript now knows data is ModelResponse
  console.log(data.content)
}
```

### Discriminated Unions

For handling different states:

```typescript
type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

function useAsyncData<T>(fetchFn: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' })
  
  const execute = async () => {
    setState({ status: 'loading' })
    try {
      const data = await fetchFn()
      setState({ status: 'success', data })
    } catch (error) {
      setState({ status: 'error', error: error as Error })
    }
  }
  
  return { state, execute }
}

// Usage with exhaustive checking
function DataDisplay() {
  const { state, execute } = useAsyncData(fetchData)
  
  switch (state.status) {
    case 'idle':
      return <Button onClick={execute}>Load Data</Button>
    case 'loading':
      return <Spinner />
    case 'success':
      return <DataView data={state.data} />
    case 'error':
      return <ErrorMessage error={state.error} />
    default:
      // TypeScript ensures this is never reached
      const exhaustive: never = state
      return null
  }
}
```

### Generic Components

Create reusable, type-safe components:

```typescript
interface SelectOption<T> {
  value: T
  label: string
}

interface GenericSelectProps<T> {
  options: SelectOption<T>[]
  value: T
  onChange: (value: T) => void
  getOptionLabel?: (option: SelectOption<T>) => string
}

function GenericSelect<T>({ 
  options, 
  value, 
  onChange,
  getOptionLabel = (opt) => opt.label 
}: GenericSelectProps<T>) {
  return (
    <select 
      value={JSON.stringify(value)}
      onChange={(e) => onChange(JSON.parse(e.target.value))}
    >
      {options.map((option, index) => (
        <option key={index} value={JSON.stringify(option.value)}>
          {getOptionLabel(option)}
        </option>
      ))}
    </select>
  )
}

// Usage with different types
<GenericSelect<string>
  options={[
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'claude-3', label: 'Claude 3' }
  ]}
  value={selectedModel}
  onChange={setSelectedModel}
/>

<GenericSelect<number>
  options={[
    { value: 100, label: '100 tokens' },
    { value: 500, label: '500 tokens' }
  ]}
  value={maxTokens}
  onChange={setMaxTokens}
/>
```

## State Management

### Local State Pattern

Keep state as close to where it's used as possible:

```typescript
// ❌ Avoid: Lifting state unnecessarily
function App() {
  const [searchTerm, setSearchTerm] = useState('')
  
  return (
    <div>
      <Header />
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <Results searchTerm={searchTerm} />
    </div>
  )
}

// ✅ Better: Colocate related state
function SearchSection() {
  const [searchTerm, setSearchTerm] = useState('')
  
  return (
    <div>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <Results searchTerm={searchTerm} />
    </div>
  )
}

function App() {
  return (
    <div>
      <Header />
      <SearchSection />
    </div>
  )
}
```

### Context Pattern

For cross-cutting concerns:

```typescript
// contexts/model-comparison.tsx
interface ModelComparisonContextType {
  selectedModels: string[]
  addModel: (modelId: string) => void
  removeModel: (modelId: string) => void
  compareModels: (prompt: string) => Promise<ComparisonResult>
}

const ModelComparisonContext = createContext<ModelComparisonContextType | null>(null)

export function ModelComparisonProvider({ children }: { children: ReactNode }) {
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  
  const addModel = (modelId: string) => {
    setSelectedModels(prev => [...prev, modelId])
  }
  
  const removeModel = (modelId: string) => {
    setSelectedModels(prev => prev.filter(id => id !== modelId))
  }
  
  const compareModels = async (prompt: string) => {
    // Comparison logic
  }
  
  return (
    <ModelComparisonContext.Provider 
      value={{ selectedModels, addModel, removeModel, compareModels }}
    >
      {children}
    </ModelComparisonContext.Provider>
  )
}

// Custom hook for using context
export function useModelComparison() {
  const context = useContext(ModelComparisonContext)
  if (!context) {
    throw new Error('useModelComparison must be used within ModelComparisonProvider')
  }
  return context
}
```

## Performance Patterns

### Memoization Strategy

Use memoization judiciously:

```typescript
// ✅ Good: Expensive computation
const expensiveValue = useMemo(() => {
  return calculateComplexMetrics(largeDataset)
}, [largeDataset])

// ✅ Good: Stable reference for child components
const stableOptions = useMemo(() => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}), [])

// ❌ Avoid: Simple computations
const simpleValue = useMemo(() => {
  return number * 2
}, [number])
```

### Code Splitting

Split code at route and component levels:

```typescript
// Route-level splitting (automatic with Next.js)
// app/analytics/page.tsx
export default function AnalyticsPage() {
  return <Analytics />
}

// Component-level splitting
const HeavyComponent = lazy(() => import('./heavy-component'))

function MyComponent() {
  const [showHeavy, setShowHeavy] = useState(false)
  
  return (
    <div>
      <Button onClick={() => setShowHeavy(true)}>
        Load Heavy Component
      </Button>
      
      {showHeavy && (
        <Suspense fallback={<LoadingSpinner />}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  )
}
```

### Virtual Scrolling

For long lists:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  })
  
  return (
    <div ref={parentRef} className="h-[400px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ItemComponent item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Testing Patterns

### Component Testing

Test behavior, not implementation:

```typescript
// ❌ Avoid: Testing implementation details
test('sets state when button clicked', () => {
  const { result } = renderHook(() => useState(false))
  act(() => {
    result.current[1](true)
  })
  expect(result.current[0]).toBe(true)
})

// ✅ Better: Test user behavior
test('shows content when button clicked', async () => {
  const user = userEvent.setup()
  render(<CollapsibleContent />)
  
  expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  
  await user.click(screen.getByRole('button', { name: 'Show content' }))
  
  expect(screen.getByText('Hidden content')).toBeInTheDocument()
})
```

### Integration Testing

Test features end-to-end:

```typescript
describe('Model Comparison Flow', () => {
  test('user can compare multiple models', async () => {
    const user = userEvent.setup()
    render(<ComparisonPlayground />)
    
    // Select models
    await user.click(screen.getByText('Select Models'))
    await user.click(screen.getByText('GPT-4'))
    await user.click(screen.getByText('Claude 3'))
    await user.click(screen.getByText('Done'))
    
    // Enter prompt
    await user.type(
      screen.getByPlaceholderText('Enter your prompt'),
      'Explain quantum computing'
    )
    
    // Submit comparison
    await user.click(screen.getByText('Compare'))
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByTestId('gpt-4-response')).toBeInTheDocument()
      expect(screen.getByTestId('claude-3-response')).toBeInTheDocument()
    })
    
    // Verify metrics
    expect(screen.getByText(/Response time:/)).toBeInTheDocument()
    expect(screen.getByText(/Tokens used:/)).toBeInTheDocument()
  })
})
```

## Error Handling

### Error Boundaries

Graceful error handling at component level:

```typescript
class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ComponentType<{ error: Error }> },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component error:', error, errorInfo)
    // Send to error tracking service
    trackError(error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback
      return <Fallback error={this.state.error!} />
    }
    
    return this.props.children
  }
}
```

### Async Error Handling

Consistent error handling for async operations:

```typescript
// utils/async.ts
export async function asyncHandler<T>(
  fn: () => Promise<T>,
  options?: {
    onError?: (error: Error) => void
    fallback?: T
  }
): Promise<T | undefined> {
  try {
    return await fn()
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    
    if (options?.onError) {
      options.onError(err)
    } else {
      console.error('Async operation failed:', err)
    }
    
    return options?.fallback
  }
}

// Usage
const data = await asyncHandler(
  () => fetchModelData(modelId),
  {
    onError: (error) => toast.error(`Failed to load model: ${error.message}`),
    fallback: defaultModelData
  }
)
```

## Security Patterns

### Input Sanitization

Always sanitize user input:

```typescript
import DOMPurify from 'isomorphic-dompurify'

// Sanitize HTML content
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  })
}

// Validate and sanitize JSON
export function parseJSON<T>(input: string): T | null {
  try {
    const parsed = JSON.parse(input)
    // Additional validation
    if (!isValidStructure(parsed)) {
      return null
    }
    return parsed as T
  } catch {
    return null
  }
}
```

### API Security

Secure API calls:

```typescript
// lib/api/secure-client.ts
class SecureAPIClient {
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    // Add security headers
    const headers = {
      ...options.headers,
      'X-CSRF-Token': await getCSRFToken(),
      'X-Request-ID': generateRequestId(),
    }
    
    // Validate endpoint
    if (!isValidEndpoint(endpoint)) {
      throw new Error('Invalid endpoint')
    }
    
    const response = await fetch(endpoint, {
      ...options,
      headers,
      credentials: 'same-origin',
    })
    
    // Check response
    if (!response.ok) {
      throw new APIError(response.status, await response.text())
    }
    
    return response
  }
}
```

## Summary

These patterns ensure:
- ✅ **Maintainability** through consistent structure
- ✅ **Type Safety** with TypeScript
- ✅ **Performance** through optimization
- ✅ **Reliability** with proper error handling
- ✅ **Security** through validation and sanitization

Following these patterns creates a robust, scalable application that's easy to understand and extend.