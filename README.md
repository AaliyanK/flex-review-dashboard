# Flex Living Reviews Dashboard

A comprehensive reviews management system for Flex Living property managers to assess property performance, manage guest reviews, and display approved reviews on public property pages.

## 🎯 Quick Overview

This dashboard enables property managers to:

- **View per-property performance metrics** with detailed analytics
- **Filter and sort reviews** by rating, category, channel, or time
- **Identify trends and recurring issues** with automated analysis
- **Approve/select reviews** for public display with bulk operations
- **Manage review data** from multiple sources (Hostaway, Google Reviews)
- **Export data** for external analysis and reporting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone and install
git clone <repository-url>
cd flex-review-dashboard
npm install

# Start development server
npm run dev
# Open http://localhost:3000
```

### Production Deployment (Vercel)

```bash
# Deploy to Vercel
npm run build
vercel --prod
```

## ✨ Key Features

| Feature                | Status      | Description                             |
| ---------------------- | ----------- | --------------------------------------- |
| **Dashboard**          | ✅ Complete | Full review management interface        |
| **Property Analytics** | ✅ Complete | Performance metrics and trends          |
| **Review Approval**    | ✅ Complete | Individual and bulk operations          |
| **Public Display**     | ✅ Complete | Flex Living styled property pages       |
| **Google Reviews**     | ✅ Demo     | Mock implementation with migration path |
| **Search & Filter**    | ✅ Complete | Advanced filtering and real-time search |
| **Export Data**        | ✅ Complete | JSON export functionality               |
| **Responsive Design**  | ✅ Complete | Mobile-first responsive layout          |

## 🛠 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, TypeScript
- **Development**: ESLint, Prettier, Turbopack

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Backend API routes
│   ├── dashboard/         # Main dashboard
│   ├── properties/        # Property pages
│   ├── analytics/         # Analytics dashboard
│   └── google-reviews/    # Google Reviews demo
├── components/            # Reusable components
├── lib/                   # Core business logic
└── data/                 # Mock data
```

## 🎯 Core Requirements Met

### ✅ 1. Hostaway Integration

- Complete API integration with mock fallback
- Data normalization and error handling

### ✅ 2. Manager Dashboard

- Modern interface with Flex Global branding
- Advanced filtering, sorting, and bulk operations
- Trend analysis and issue detection

### ✅ 3. Review Display Page

- Flex Living layout with approved reviews only
- Professional design and responsive layout

### ✅ 4. Google Reviews Integration

- Demo implementation with realistic mock data
- Production-ready migration path

## 📚 Documentation

- **[Setup Instructions](SETUP_INSTRUCTIONS.md)** - Detailed setup and deployment guide
- **[Technical Documentation](TECHNICAL_DOCUMENTATION.md)** - Architecture and design decisions
- **[Google Reviews Integration](GOOGLE_REVIEWS_INTEGRATION.md)** - Integration details and findings

## 🚀 Live Demo

The application includes comprehensive mock data for immediate testing:

- **12 realistic reviews** across 3 properties
- **Performance metrics** for each property
- **Google Reviews simulation** with 5 sample reviews
- **Trend data** for analytics features

## 🔧 Configuration

### Environment Variables (Optional)

```bash
# .env.local
HOSTAWAY_API_KEY=your_hostaway_api_key
HOSTAWAY_ACCOUNT_ID=your_account_id
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

_Note: The application works with mock data by default. No API keys required for demo._

## 📞 Support

- **Documentation**: Check the docs folder
- **Issues**: Create a GitHub issue
- **Demo**: All features available without setup

---

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Deployment**: Vercel Ready
