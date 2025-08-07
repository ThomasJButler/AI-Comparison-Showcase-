# Component Architecture

## Overview

This document details the component architecture of the AI Comparison Showcase, explaining the design patterns, component hierarchy, and best practices used throughout the application.

## Component Design Principles

### 1. Single Responsibility
Each component has one clear purpose and responsibility.

### 2. Composition Over Inheritance
We favour component composition to build complex UIs from simple building blocks.

### 3. Props Interface Design
Clear, typed interfaces for all component props using TypeScript.

### 4. Accessibility First
All interactive components include proper ARIA attributes and keyboard navigation.

## Component Categories

### 1. UI Components (`/components/ui/`)

Base-level components from the shadcn/ui library, customised for our design system.

```typescript
// Example: Button component
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}
```

**Key UI Components:**
- `Button` - Interactive button with multiple variants
- `Card` - Container component with consistent styling
- `Dialog` - Modal dialog implementation
- `Input` - Form input with validation support
- `Select` - Dropdown selection component
- `Tabs` - Tabbed interface component

### 2. Feature Components

Higher-level components that implement specific features.

#### Model Components
```typescript
// ModelCard - Displays AI model information
interface ModelCardProps {
  model: AIModel
  onSelect?: (model: AIModel) => void
  isSelected?: boolean
  showStats?: boolean
}

// ModelSelector - Multi-model selection interface
interface ModelSelectorProps {
  models: AIModel[]
  selectedModels: string[]
  onSelectionChange: (models: string[]) => void
  maxSelections?: number
}
```

#### Playground Components
```typescript
// ComparisonView - Side-by-side model comparison
interface ComparisonViewProps {
  models: string[]
  prompt: string
  responses: Record<string, ModelResponse>
  isLoading: boolean
}

// OutputDisplay - Formatted response display
interface OutputDisplayProps {
  content: string
  format: 'text' | 'json' | 'markdown' | 'code'
  language?: string
}
```

### 3. Visualisation Components (`/components/visualizations/`)

Advanced data visualisation components using Three.js, D3, and Recharts.

#### Network Visualisations
```typescript
// NetworkGraph - 2D force-directed graph
interface NetworkGraphProps {
  nodes: NetworkNode[]
  edges: NetworkEdge[]
  onNodeClick?: (node: NetworkNode) => void
  physics?: PhysicsConfig
}

// Network3D - 3D network visualisation
interface Network3DProps extends NetworkGraphProps {
  cameraPosition?: Vector3
  enableRotation?: boolean
  particleEffects?: boolean
}
```

#### Performance Charts
```typescript
// PerformanceChart - Real-time performance metrics
interface PerformanceChartProps {
  data: PerformanceData[]
  metrics: MetricType[]
  timeRange: TimeRange
  refreshInterval?: number
}
```

### 4. Layout Components

Components that control page structure and layout.

```typescript
// PageTransition - Smooth page transitions
interface PageTransitionProps {
  children: ReactNode
  className?: string
}

// MainContent - Main content wrapper with consistent spacing
interface MainContentProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}
```

## Component Patterns

### 1. Compound Components

Used for complex components with multiple parts:

```typescript
// Example: Model Builder pattern
<ModelBuilder>
  <ModelBuilder.Definition />
  <ModelBuilder.Testing />
  <ModelBuilder.Visualization />
</ModelBuilder>
```

### 2. Render Props

For components that need flexible rendering:

```typescript
<DataFetcher
  endpoint="/api/models"
  render={({ data, loading, error }) => (
    loading ? <Spinner /> : <ModelGrid models={data} />
  )}
/>
```

### 3. Higher-Order Components (HOCs)

For cross-cutting concerns:

```typescript
// withAuth - Authentication wrapper
const ProtectedComponent = withAuth(MyComponent);

// withPerformanceTracking - Performance monitoring
const TrackedComponent = withPerformanceTracking(MyComponent);
```

### 4. Custom Hooks

Extracting component logic into reusable hooks:

```typescript
// useModelComparison - Comparison logic
const {
  selectedModels,
  responses,
  isLoading,
  compareModels
} = useModelComparison();

// useVisualization - Visualisation state management
const {
  data,
  config,
  updateConfig,
  exportImage
} = useVisualization(type);
```

## State Management

### Component State Hierarchy

```
App State (Context/Providers)
  └─> Page State (Page Components)
      └─> Feature State (Feature Components)
          └─> Local State (UI Components)
```

### State Management Patterns

1. **Local State** - useState for component-specific state
2. **Lifted State** - Lifting state to parent when shared
3. **Context API** - For cross-cutting concerns (theme, auth)
4. **URL State** - Using Next.js router for shareable state

## Performance Optimisation

### 1. Code Splitting

```typescript
// Lazy loading heavy components
const HeavyVisualization = lazy(() => 
  import('./visualizations/heavy-viz')
);

// Usage with Suspense
<Suspense fallback={<LoadingSkeleton />}>
  <HeavyVisualization data={data} />
</Suspense>
```

### 2. Memoisation

```typescript
// Memoising expensive computations
const processedData = useMemo(() => 
  processComplexData(rawData), 
  [rawData]
);

// Memoising components
const MemoizedComponent = memo(ExpensiveComponent);
```

### 3. Virtualisation

For long lists and large datasets:

```typescript
<VirtualList
  items={largeDataset}
  itemHeight={50}
  renderItem={(item) => <ItemComponent {...item} />}
/>
```

## Component Testing Strategy

### 1. Unit Tests

Testing individual components in isolation:

```typescript
describe('ModelCard', () => {
  it('renders model information correctly', () => {
    render(<ModelCard model={mockModel} />);
    expect(screen.getByText(mockModel.name)).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<ModelCard model={mockModel} onSelect={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledWith(mockModel);
  });
});
```

### 2. Integration Tests

Testing component interactions:

```typescript
describe('ModelComparison', () => {
  it('compares multiple models correctly', async () => {
    render(<ModelComparison />);
    
    // Select models
    await selectModels(['gpt-4', 'claude-3']);
    
    // Enter prompt
    await enterPrompt('Test prompt');
    
    // Verify responses
    await waitFor(() => {
      expect(screen.getByTestId('gpt-4-response')).toBeInTheDocument();
      expect(screen.getByTestId('claude-3-response')).toBeInTheDocument();
    });
  });
});
```

### 3. Visual Regression Tests

Using Storybook and Chromatic for visual testing:

```typescript
export default {
  title: 'Components/ModelCard',
  component: ModelCard,
};

export const Default = {
  args: {
    model: defaultModel,
  },
};

export const Selected = {
  args: {
    model: defaultModel,
    isSelected: true,
  },
};
```

## Accessibility Patterns

### 1. Keyboard Navigation

All interactive components support keyboard navigation:

```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Enter':
    case ' ':
      handleSelect();
      break;
    case 'Escape':
      handleClose();
      break;
  }
};
```

### 2. ARIA Attributes

Proper ARIA labels and roles:

```typescript
<button
  role="button"
  aria-label={`Select ${model.name} model`}
  aria-pressed={isSelected}
  aria-describedby={`${model.id}-description`}
>
  {model.name}
</button>
```

### 3. Focus Management

Managing focus for modal and dynamic content:

```typescript
useEffect(() => {
  if (isOpen) {
    firstFocusableElement.current?.focus();
  }
}, [isOpen]);
```

## Component Documentation

### PropTypes Documentation

Each component includes comprehensive prop documentation:

```typescript
/**
 * ModelCard displays information about an AI model
 * 
 * @param {AIModel} model - The model data to display
 * @param {Function} onSelect - Callback when model is selected
 * @param {boolean} isSelected - Whether the model is currently selected
 * @param {boolean} showStats - Whether to show performance statistics
 * 
 * @example
 * <ModelCard 
 *   model={gpt4Model}
 *   onSelect={handleModelSelect}
 *   isSelected={selectedModels.includes('gpt-4')}
 *   showStats
 * />
 */
```

### Storybook Documentation

Interactive component documentation:

```typescript
export default {
  title: 'Features/ModelCard',
  component: ModelCard,
  parameters: {
    docs: {
      description: {
        component: 'ModelCard displays AI model information with selection capability',
      },
    },
  },
  argTypes: {
    onSelect: { action: 'selected' },
    isSelected: { control: 'boolean' },
    showStats: { control: 'boolean' },
  },
};
```

## Best Practices

### 1. Component Naming
- PascalCase for components
- Descriptive names that indicate purpose
- Suffix with component type when ambiguous

### 2. File Organisation
- One component per file
- Co-locate styles and tests
- Group related components

### 3. Props Design
- Use TypeScript interfaces
- Provide sensible defaults
- Keep props minimal and focused

### 4. Performance
- Lazy load heavy components
- Memoize expensive operations
- Use virtualisation for long lists

### 5. Testing
- Test user interactions, not implementation
- Cover edge cases
- Maintain high test coverage

## Conclusion

The component architecture of AI Comparison Showcase emphasises:
- **Reusability** through composition
- **Type Safety** with TypeScript
- **Performance** through optimisation
- **Accessibility** as a core requirement
- **Maintainability** through clear patterns

This architecture enables rapid feature development while maintaining code quality and user experience standards.