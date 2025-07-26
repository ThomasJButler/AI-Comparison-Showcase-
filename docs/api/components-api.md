# Components API Reference

## Overview

This document provides a comprehensive API reference for all major components in the AI Comparison Showcase. Each component is documented with its props, usage examples, and implementation details.

## Table of Contents

1. [Core Components](#core-components)
2. [Playground Components](#playground-components)
3. [Visualisation Components](#visualisation-components)
4. [Analytics Components](#analytics-components)
5. [UI Components](#ui-components)
6. [Utility Components](#utility-components)

---

## Core Components

### ModelSelector

Multi-model selection component with search and filtering.

```typescript
interface ModelSelectorProps {
  models: AIModel[];
  selectedModels: string[];
  onSelectionChange: (models: string[]) => void;
  maxSelections?: number;
  showStats?: boolean;
  className?: string;
}
```

**Usage:**
```jsx
<ModelSelector
  models={availableModels}
  selectedModels={['gpt-4', 'claude-3']}
  onSelectionChange={handleModelChange}
  maxSelections={4}
  showStats
/>
```

**Props:**
- `models` - Array of available AI models
- `selectedModels` - Currently selected model IDs
- `onSelectionChange` - Callback when selection changes
- `maxSelections` - Maximum number of selections allowed (default: unlimited)
- `showStats` - Show model statistics (default: false)
- `className` - Additional CSS classes

---

### ComparisonView

Side-by-side model comparison interface.

```typescript
interface ComparisonViewProps {
  models: string[];
  prompt: string;
  responses: Record<string, ModelResponse>;
  isLoading: boolean;
  onRegenerateResponse?: (modelId: string) => void;
  showMetrics?: boolean;
  layout?: 'grid' | 'list' | 'tabs';
}
```

**Usage:**
```jsx
<ComparisonView
  models={['gpt-4', 'claude-3']}
  prompt="Explain quantum computing"
  responses={modelResponses}
  isLoading={false}
  showMetrics
  layout="grid"
/>
```

---

### ModelCard

Individual model information display card.

```typescript
interface ModelCardProps {
  model: AIModel;
  onSelect?: (model: AIModel) => void;
  isSelected?: boolean;
  showStats?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}
```

**Usage:**
```jsx
<ModelCard
  model={gpt4Model}
  onSelect={handleSelect}
  isSelected={true}
  showStats
  variant="detailed"
/>
```

---

## Playground Components

### CodeEditor

Monaco-based code editor with syntax highlighting.

```typescript
interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: 'light' | 'dark' | 'matrix';
  height?: string;
  readOnly?: boolean;
  minimap?: boolean;
  lineNumbers?: boolean;
}
```

**Usage:**
```jsx
<CodeEditor
  value={code}
  onChange={setCode}
  language="javascript"
  theme="matrix"
  height="400px"
/>
```

---

### OutputDisplay

Formatted output display with multiple format support.

```typescript
interface OutputDisplayProps {
  content: string;
  format: 'text' | 'json' | 'markdown' | 'code' | 'html';
  language?: string;
  showCopyButton?: boolean;
  showFormatToggle?: boolean;
  maxHeight?: string;
  className?: string;
}
```

**Usage:**
```jsx
<OutputDisplay
  content={response}
  format="markdown"
  showCopyButton
  showFormatToggle
  maxHeight="500px"
/>
```

---

### PlaygroundGuide

Interactive guide for playground features.

```typescript
interface PlaygroundGuideProps {
  show: boolean;
  onClose: () => void;
  step?: number;
  onStepChange?: (step: number) => void;
}
```

---

## Visualisation Components

### NetworkGraph

2D force-directed network graph.

```typescript
interface NetworkGraphProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  width?: number;
  height?: number;
  onNodeClick?: (node: NetworkNode) => void;
  onNodeHover?: (node: NetworkNode | null) => void;
  physics?: PhysicsConfig;
  theme?: GraphTheme;
}

interface NetworkNode {
  id: string;
  label: string;
  group?: string;
  size?: number;
  color?: string;
  x?: number;
  y?: number;
}

interface NetworkEdge {
  source: string;
  target: string;
  value?: number;
  label?: string;
  color?: string;
}
```

**Usage:**
```jsx
<NetworkGraph
  nodes={graphNodes}
  edges={graphEdges}
  width={800}
  height={600}
  onNodeClick={handleNodeClick}
  physics={{
    charge: -300,
    distance: 100,
    cooling: 0.95
  }}
/>
```

---

### Network3D

3D network visualisation with Three.js.

```typescript
interface Network3DProps extends NetworkGraphProps {
  cameraPosition?: [number, number, number];
  enableRotation?: boolean;
  enableZoom?: boolean;
  particleEffects?: boolean;
  backgroundColor?: string;
}
```

**Usage:**
```jsx
<Network3D
  nodes={nodes}
  edges={edges}
  cameraPosition={[0, 0, 100]}
  enableRotation
  particleEffects
  backgroundColor="#000000"
/>
```

---

### PerformanceChart

Real-time performance metrics visualisation.

```typescript
interface PerformanceChartProps {
  data: PerformanceData[];
  metrics: MetricType[];
  timeRange: TimeRange;
  refreshInterval?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  animate?: boolean;
}

interface PerformanceData {
  timestamp: number;
  model: string;
  responseTime: number;
  tokenUsage: number;
  cost: number;
  errorRate?: number;
}

type MetricType = 'responseTime' | 'tokenUsage' | 'cost' | 'errorRate';
type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d';
```

**Usage:**
```jsx
<PerformanceChart
  data={performanceData}
  metrics={['responseTime', 'cost']}
  timeRange="24h"
  refreshInterval={5000}
  showLegend
  animate
/>
```

---

## Analytics Components

### ModelComparison

Comprehensive model comparison dashboard.

```typescript
interface ModelComparisonProps {
  models: string[];
  timeRange: TimeRange;
  metrics?: MetricConfig[];
  onExport?: (data: ComparisonData) => void;
  showRealTime?: boolean;
}

interface MetricConfig {
  key: string;
  label: string;
  unit?: string;
  format?: (value: number) => string;
  color?: string;
}
```

---

### CostAnalysis

Cost breakdown and analysis component.

```typescript
interface CostAnalysisProps {
  data: CostData[];
  groupBy: 'model' | 'time' | 'user';
  showProjections?: boolean;
  budget?: number;
  currency?: string;
}

interface CostData {
  model: string;
  timestamp: number;
  promptTokens: number;
  completionTokens: number;
  totalCost: number;
}
```

---

### TokenUsageHeatmap

Heatmap visualisation of token usage patterns.

```typescript
interface TokenUsageHeatmapProps {
  data: TokenUsageData[];
  interval: 'hour' | 'day' | 'week';
  models?: string[];
  showValues?: boolean;
  colorScale?: string[];
}
```

---

## UI Components

### Button

Enhanced button component with multiple variants.

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

**Usage:**
```jsx
<Button
  variant="default"
  size="lg"
  loading={isSubmitting}
  leftIcon={<SendIcon />}
  onClick={handleSubmit}
>
  Send Prompt
</Button>
```

---

### Card

Container component with consistent styling.

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  selected?: boolean;
}
```

---

### Dialog

Modal dialog implementation.

```typescript
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeButton?: boolean;
}
```

---

### Tabs

Tabbed interface component.

```typescript
interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
}
```

---

## Utility Components

### ErrorBoundary

Error boundary with fallback UI.

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
```

**Usage:**
```jsx
<ErrorBoundary
  fallback={CustomErrorFallback}
  onError={(error) => console.error('Component error:', error)}
>
  <MyComponent />
</ErrorBoundary>
```

---

### LoadingStates

Consistent loading state components.

```typescript
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

// Components
<LoadingSpinner size="lg" />
<LoadingSkeleton lines={3} />
<LoadingDots text="Processing" />
```

---

### PageTransition

Smooth page transition wrapper.

```typescript
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
}
```

---

### ThemeProvider

Theme context provider.

```typescript
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
  storageKey?: string;
  enableSystem?: boolean;
}
```

---

## Component Patterns

### Composition Example

```jsx
// Composing multiple components
<Card variant="bordered" padding="lg">
  <ModelSelector
    models={models}
    selectedModels={selected}
    onSelectionChange={setSelected}
  />
  <Separator className="my-4" />
  <ComparisonView
    models={selected}
    prompt={prompt}
    responses={responses}
    isLoading={loading}
  />
</Card>
```

### Custom Hooks Integration

```jsx
// Using component with custom hooks
function MyComponent() {
  const { models, loading } = useModels();
  const { compare, responses } = useModelComparison();
  
  return (
    <ComparisonView
      models={models}
      responses={responses}
      isLoading={loading}
    />
  );
}
```

### Controlled Components

```jsx
// Fully controlled component
function ControlledEditor() {
  const [value, setValue] = useState('');
  const [format, setFormat] = useState('text');
  
  return (
    <>
      <CodeEditor
        value={value}
        onChange={setValue}
        language={format}
      />
      <OutputDisplay
        content={value}
        format={format}
      />
    </>
  );
}
```

---

## TypeScript Types

### Common Types

```typescript
// Model types
interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'deepseek' | 'perplexity';
  description?: string;
  capabilities: string[];
  pricing: ModelPricing;
  limits: ModelLimits;
}

interface ModelResponse {
  content: string;
  model: string;
  timestamp: number;
  usage: TokenUsage;
  metrics: ResponseMetrics;
}

interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

interface ResponseMetrics {
  responseTime: number;
  cost: number;
  tokenPerSecond: number;
}
```

---

## Best Practices

### 1. Error Handling

Always handle potential errors:

```jsx
<ErrorBoundary>
  <ModelSelector
    models={models}
    onSelectionChange={(selected) => {
      try {
        handleSelection(selected);
      } catch (error) {
        showError('Selection failed');
      }
    }}
  />
</ErrorBoundary>
```

### 2. Loading States

Provide appropriate loading feedback:

```jsx
{loading ? (
  <LoadingSkeleton lines={3} />
) : (
  <ModelCard model={model} />
)}
```

### 3. Accessibility

Ensure keyboard navigation and ARIA labels:

```jsx
<Button
  aria-label="Compare selected models"
  aria-busy={loading}
  disabled={!hasSelection}
>
  Compare
</Button>
```

### 4. Performance

Use memoization for expensive operations:

```jsx
const MemoizedGraph = memo(NetworkGraph, (prev, next) => {
  return prev.nodes === next.nodes && prev.edges === next.edges;
});
```

---

## Migration Guide

### From v1 to v2

```jsx
// v1
<ModelSelector models={models} selected={selected} />

// v2
<ModelSelector 
  models={models} 
  selectedModels={selected}
  onSelectionChange={setSelected}
/>
```

---

This API reference covers the main components in the AI Comparison Showcase. For more detailed examples and advanced usage, refer to the component source code and Storybook documentation.