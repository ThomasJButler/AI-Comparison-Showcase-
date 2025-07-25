# AI Comparison Showcase 🤖

> An interactive tool for comparing multiple AI models side by side with real-time performance metrics and visualizations.

## Overview

AI Comparison Showcase is a portfolio project demonstrating advanced AI model comparison capabilities. It allows users to test and compare various AI models including OpenAI's GPT, Anthropic's Claude, DeepSeek, and Perplexity models with real-time performance metrics and beautiful visualizations.

![AI Comparison Demo](To be added)

## 🚀 Features

### Core Functionality
- **Multi-Model AI Playground**
  - Support for OpenAI, Anthropic, DeepSeek, and Perplexity models
  - Real-time response streaming
  - Multiple input formats (JSON, text, code)
  - Performance metrics tracking

- **Model Comparison**
  - Side-by-side model testing
  - Response time analysis
  - Token usage tracking
  - Accuracy metrics
  - Export comparison results

- **Advanced Visualizations**
  - Real-time performance charts
  - Network analysis graphs
  - 3D force-directed graphs
  - Token usage heatmaps

- **Modern UI/UX**
  - Matrix-inspired design system
  - Smooth animations with Framer Motion
  - Responsive layouts
  - Dark mode optimized

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Monaco Editor** - Code editing
- **Three.js** - 3D visualizations

### AI Integration
- **OpenAI API** - GPT models
- **Anthropic API** - Claude models
- **DeepSeek API** - DeepSeek models
- **Perplexity API** - Search-enhanced models

### UI Components
- **shadcn/ui** - Component system
- **Radix UI** - Accessible components
- **Lucide Icons** - Icon library

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ and npm
- API keys for AI providers (optional, demo mode available)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/ai-comparison-showcase.git
cd ai-comparison-showcase
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your AI provider API keys in `.env.local` (optional):
```env
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
DEEPSEEK_API_KEY=your_deepseek_key
PERPLEXITY_API_KEY=your_perplexity_key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/              # Next.js app directory
│   ├── playground/   # AI testing playground
│   ├── models/       # Model management
│   ├── analytics/    # Analytics dashboard
│   └── profile/      # User settings
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── visualizations/ # Data viz components
├── lib/             # Utility libraries
│   ├── api/         # API clients
│   └── playground/  # Playground logic
└── hooks/           # Custom React hooks
```

## 🎨 Design System

The project uses a Matrix-inspired design system with:
- Custom color palette with green accent colors
- Monospace typography (JetBrains Mono)
- Glowing effects and animations
- Dark theme optimized

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📦 Building for Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## 🚀 Deployment

The application can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any Node.js hosting platform

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

**[Your Name]**
- Portfolio: [your-portfolio-url]
- LinkedIn: [your-linkedin]
- GitHub: [@your-username]

## 🙏 Acknowledgments

- Inspired by the need for better AI model comparison tools
- Built as a portfolio project to showcase full-stack development skills
- Special thanks to the open-source community