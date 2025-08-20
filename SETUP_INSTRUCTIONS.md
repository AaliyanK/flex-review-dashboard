# Setup Instructions - Flex Living Reviews Dashboard

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Git**: For cloning the repository

### 1. Local Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd flex-review-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### 2. Environment Configuration (Optional)

The application works with mock data by default. No API keys required for demo.

```bash
# Create environment file
cp .env.example .env.local

# Add API keys (optional)
HOSTAWAY_ACCOUNT_ID=your_account_id
HOSTAWAY_API_KEY=your_api_key
GOOGLE_PLACES_API_KEY=your_google_api_key
```

## 🚀 Vercel Deployment

### 1. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

### 2. Environment Variables in Vercel

Add environment variables in Vercel dashboard:

```bash
# Required
NEXT_PUBLIC_APP_NAME=Flex Living Reviews Dashboard
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Optional: Real API integration
HOSTAWAY_ACCOUNT_ID=your_account_id
HOSTAWAY_API_KEY=your_api_key
GOOGLE_PLACES_API_KEY=your_google_api_key
```

### 3. Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## 🧪 Testing the Application

### Demo Data Included

The application includes comprehensive mock data:

- **12 Hostaway Reviews**: Various ratings, statuses, and categories
- **5 Google Reviews**: Realistic mock data with profiles
- **3 Properties**: Different types with performance metrics

### Testing Scenarios

1. **Dashboard**: `http://localhost:3000/dashboard`

   - Test filtering, sorting, and bulk actions

2. **Public Property Pages**: `http://localhost:3000/properties`

   - View property listings and approved reviews

3. **Google Reviews Demo**: `http://localhost:3000/google-reviews`

   - Test search functionality with mock data

4. **Analytics Dashboard**: `http://localhost:3000/analytics`
   - Explore different time ranges and metrics

### API Endpoints

Test the API endpoints directly:

```bash
# Get all reviews
curl http://localhost:3000/api/reviews/hostaway

# Get properties with metrics
curl http://localhost:3000/api/properties?includeMetrics=true

# Get Google Reviews (mock)
curl http://localhost:3000/api/reviews/google?query=test
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# The application uses Turbopack for faster development
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   npx kill-port 3000
   # Or use different port
   npm run dev -- -p 3001
   ```

2. **Build Errors**

   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

3. **TypeScript Errors**
   ```bash
   npx tsc --noEmit
   ```

### Getting Help

- Check browser console for errors
- Verify all dependencies are installed
- Ensure Node.js version is 18+
- Check environment variables are set correctly

## 📈 Performance

### Development

- **Turbopack**: Fast development builds
- **Hot Reload**: Instant code changes
- **TypeScript**: Compile-time error checking

### Production

- **Next.js 15**: Latest optimizations
- **Static Generation**: Fast page loads
- **Image Optimization**: Automatic image optimization

---

**Version**: 1.0.0  
**Status**: Production Ready
