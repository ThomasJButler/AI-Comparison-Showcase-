# AI Comparison Showcase - Deployment Guide

## 🚀 Quick Start with Vercel

The AI Comparison Showcase is optimized for deployment on Vercel. Follow these steps to deploy your own instance.

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (free tier works fine)

### Option 1: Deploy with Vercel Button (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-comparison-showcase)

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Run deployment**
   ```bash
   # For production deployment
   npm run deploy

   # For preview deployment
   npm run deploy:preview
   ```

3. **Follow the prompts** to link your project and configure settings

### Option 3: Deploy via GitHub Integration

1. **Push your code to GitHub**
2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure project settings
   - Deploy!

## 🔧 Configuration

### Environment Variables

Configure these in your Vercel dashboard under Project Settings → Environment Variables:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_BASE_URL` | Yes | Your deployment URL | `https://ai-showcase.vercel.app` |
| `OPENAI_API_KEY` | No | OpenAI API key for demos | `sk-...` |
| `ANTHROPIC_API_KEY` | No | Anthropic API key for demos | `sk-ant-...` |
| `DEEPSEEK_API_KEY` | No | DeepSeek API key for demos | `...` |
| `PERPLEXITY_API_KEY` | No | Perplexity API key for demos | `...` |

### Build Settings

These are automatically configured via `vercel.json`, but you can override them:

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### Domain Configuration

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## 📊 Performance Optimization

The project includes several optimizations for production:

### 1. **Automatic Code Splitting**
- Dynamic imports for heavy components
- Route-based code splitting
- Optimized chunk sizes

### 2. **Image Optimization**
- Automatic WebP/AVIF conversion
- Lazy loading
- Responsive images

### 3. **Caching Strategy**
- Static assets: 1 year cache
- API routes: No cache
- Pages: ISR where applicable

### 4. **Analytics & Monitoring**
- Vercel Analytics (automatic)
- Web Vitals tracking
- Error tracking

## 🛠️ Deployment Scripts

### Pre-deployment Checks
```bash
npm run pre-deploy
```
This script:
- Checks Node.js version
- Runs TypeScript type checking
- Runs ESLint
- Checks for large files
- Builds the project

### Post-deployment Verification
```bash
npm run post-deploy
```
This script:
- Checks all main routes
- Verifies API endpoints
- Reports deployment status

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors: `npx tsc --noEmit`
   - Review build logs in Vercel dashboard
   - Ensure all dependencies are listed in package.json

2. **Environment Variables**
   - Verify all required variables are set
   - Check for typos in variable names
   - Remember to redeploy after changing variables

3. **Performance Issues**
   - Run bundle analyzer: `npm run analyze`
   - Check for large dependencies
   - Review Vercel Analytics data

4. **API Rate Limiting**
   - Configure rate limits in environment variables
   - Implement caching for API responses
   - Consider using Vercel Edge Config

## 📈 Monitoring

### Vercel Dashboard
- Real-time logs
- Build & function logs
- Analytics overview
- Error tracking

### Performance Monitoring
- Core Web Vitals
- Loading performance
- API response times
- Error rates

## 🔐 Security

### Headers
Security headers are automatically configured:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### API Security
- Rate limiting enabled
- CORS configured
- Input validation
- Error sanitization

## 🚦 Production Checklist

Before deploying to production:

- [ ] Remove all development console.logs
- [ ] Set `NODE_ENV=production`
- [ ] Configure all required environment variables
- [ ] Test build locally: `npm run build && npm start`
- [ ] Run pre-deployment checks: `npm run pre-deploy`
- [ ] Review bundle size: `npm run analyze`
- [ ] Set up monitoring and alerts
- [ ] Configure custom domain (if applicable)
- [ ] Enable Vercel Analytics
- [ ] Test all critical user paths

## 🆘 Support

### Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Project Issues](https://github.com/yourusername/ai-comparison-showcase/issues)

### Getting Help
1. Check the [troubleshooting section](#-troubleshooting)
2. Review Vercel deployment logs
3. Open an issue on GitHub
4. Contact support via Vercel dashboard

## 📝 License

This project is licensed under the MIT License. See LICENSE file for details.