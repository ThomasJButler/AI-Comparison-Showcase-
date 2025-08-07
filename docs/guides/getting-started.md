# Getting Started Guide

## Welcome to AI Comparison Showcase

This guide will help you get up and running with the AI Comparison Showcase, from initial setup to making your first model comparison.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Your First Comparison](#your-first-comparison)
6. [Understanding the Interface](#understanding-the-interface)
7. [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** (v18.0.0 or higher)
  ```bash
  node --version  # Should output v18.0.0 or higher
  ```

- **npm** (v8.0.0 or higher)
  ```bash
  npm --version   # Should output v8.0.0 or higher
  ```

### Optional: API Keys

While the application works in demo mode without API keys, for full functionality you'll need:

- OpenAI API key (for GPT models)
- Anthropic API key (for Claude models)
- DeepSeek API key (for DeepSeek models)
- Perplexity API key (for Perplexity models)

## Installation

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/[your-username]/ai-comparison-showcase.git

# Navigate to the project directory
cd ai-comparison-showcase
```

### Step 2: Install Dependencies

```bash
# Install all dependencies
npm install

# This will install:
# - Next.js and React
# - TypeScript
# - Tailwind CSS
# - All UI components
# - API client libraries
```

### Step 3: Environment Setup

Create a local environment file:

```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` with your API keys:

```env
# AI Provider API Keys (Optional - app works in demo mode without these)
OPENAI_API_KEY=sk-...your-openai-key...
ANTHROPIC_API_KEY=sk-ant-...your-anthropic-key...
DEEPSEEK_API_KEY=...your-deepseek-key...
PERPLEXITY_API_KEY=pplx-...your-perplexity-key...

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_DEMO_MODE=true
```

## Configuration

### API Configuration

The application supports multiple configuration options:

#### 1. Demo Mode (Default)
No API keys required. Uses simulated responses for testing.

```env
NEXT_PUBLIC_ENABLE_DEMO_MODE=true
```

#### 2. Development Mode
Use your own API keys for real responses.

```env
NEXT_PUBLIC_ENABLE_DEMO_MODE=false
# Add your API keys as shown above
```

#### 3. Custom API Endpoints
For enterprise or self-hosted models:

```env
OPENAI_API_BASE_URL=https://your-proxy.com/v1
ANTHROPIC_API_BASE_URL=https://your-anthropic-proxy.com
```

### Application Settings

Configure application behaviour in `next.config.js`:

```javascript
module.exports = {
  // Enable/disable features
  experimental: {
    // Enable streaming responses
    streamingSSR: true,
  },
  
  // Performance settings
  images: {
    domains: ['localhost'],
  },
};
```

## Running the Application

### Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at:
- 🌐 **URL**: http://localhost:3000
- 🔥 **Hot Reload**: Enabled
- 🛠️ **Debug Mode**: Enabled

### Production Build

For production deployment:

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Other Commands

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check

# Format code
npm run format
```

## Your First Comparison

### Step 1: Navigate to Playground

1. Open http://localhost:3000
2. Click "Playground" in the navigation menu
3. You'll see the AI comparison interface

### Step 2: Select Models

1. Click "Select Models" button
2. Choose 2-4 models to compare:
   - **GPT-4**: Best for complex reasoning
   - **Claude-3**: Great for detailed explanations
   - **GPT-3.5-Turbo**: Fast and cost-effective
   - **DeepSeek**: Good balance of speed and quality

### Step 3: Enter Your Prompt

Try this example prompt:

```
Write a Python function that finds the longest common subsequence 
between two strings. Include comments and example usage.
```

### Step 4: Run Comparison

1. Click "Compare Models" button
2. Watch as responses stream in real-time
3. View performance metrics for each model

### Step 5: Analyse Results

The comparison view shows:
- **Response Content**: Side-by-side outputs
- **Response Time**: How long each model took
- **Token Usage**: Input/output token counts
- **Cost**: Estimated cost per response
- **Quality Metrics**: Relevance and accuracy scores

## Understanding the Interface

### Main Navigation

```
Home → Models → Playground → Analytics → Profile
```

- **Home**: Landing page with feature overview
- **Models**: Browse and manage available models
- **Playground**: Interactive comparison interface
- **Analytics**: Performance dashboards and insights
- **Profile**: Settings and API configuration

### Playground Interface

```
┌─────────────────────────────────────┐
│         Model Selection Bar         │
├─────────────────────────────────────┤
│                                     │
│         Prompt Input Area           │
│                                     │
├─────────────────────────────────────┤
│   Model A  │  Model B  │  Model C  │
│   Response │ Response │ Response   │
│            │          │            │
├─────────────────────────────────────┤
│        Performance Metrics          │
└─────────────────────────────────────┘
```

### Key Features

#### 1. Model Selection
- Multi-select interface
- Model information cards
- Quick stats preview

#### 2. Prompt Templates
Access pre-built prompts:
- Code generation
- Text summarisation
- Creative writing
- Data analysis

#### 3. Response Formats
Switch between:
- Plain text
- Markdown (formatted)
- JSON (structured)
- Code (syntax highlighted)

#### 4. Export Options
- Copy individual responses
- Export comparison as PDF
- Save as JSON data
- Share comparison link

## Next Steps

### 1. Explore Advanced Features

#### Custom Parameters
Adjust model behaviour:
```javascript
{
  temperature: 0.7,      // Creativity level
  maxTokens: 2000,      // Response length
  topP: 0.9,           // Token sampling
  frequencyPenalty: 0  // Repetition control
}
```

#### Batch Testing
Test multiple prompts:
1. Go to Analytics → Batch Test
2. Upload CSV with prompts
3. Run automated comparisons
4. Export results

### 2. Learn the Codebase

Explore key directories:
- `/components` - React components
- `/lib/api` - API integrations
- `/app` - Next.js pages
- `/docs` - Documentation

### 3. Customisation

#### Add Custom Models
```typescript
// lib/playground/models.ts
export const customModel: AIModel = {
  id: 'custom-model',
  name: 'My Custom Model',
  provider: 'custom',
  // ... configuration
};
```

#### Create Visualisations
```jsx
// components/visualizations/custom-viz.tsx
export function CustomVisualization({ data }) {
  // Your visualization logic
}
```

### 4. Community Resources

- **GitHub Issues**: Report bugs or request features
- **Discussions**: Share ideas and get help
- **Examples**: See community implementations
- **Blog Posts**: Learn from tutorials

## Troubleshooting

### Common Issues

#### 1. "API Key Invalid"
- Check your `.env.local` file
- Ensure keys are correctly formatted
- Verify key permissions

#### 2. "Model Not Responding"
- Check internet connection
- Verify API service status
- Try demo mode first

#### 3. "Build Errors"
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### Getting Help

1. Check the [FAQ](/docs/faq)
2. Search [GitHub Issues](https://github.com/...)
3. Ask in [Discussions](https://github.com/...)

## Summary

You're now ready to:
- ✅ Run the application locally
- ✅ Make your first model comparison
- ✅ Understand the interface
- ✅ Explore advanced features

Happy comparing! 🚀

---

## Quick Reference

### Essential Commands
```bash
npm run dev          # Start development
npm run build        # Build for production
npm test            # Run tests
npm run lint        # Check code quality
```

### Key Files
```
.env.local          # API keys and config
next.config.js      # Next.js configuration
tsconfig.json       # TypeScript settings
tailwind.config.js  # Styling configuration
```

### Useful Links
- [Architecture Guide](/docs/architecture)
- [API Reference](/docs/api)
- [Component Library](/docs/components)
- [Contributing Guide](/docs/contributing)