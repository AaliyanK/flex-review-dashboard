// Core review types based on Hostaway API response
export interface ReviewCategory {
  category: string;
  rating: number;
}

export interface HostawayReview {
  id: number;
  type: "host-to-guest" | "guest-to-host";
  status: "published" | "pending" | "rejected";
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

// Normalized review type for our application
export interface Review {
  id: number;
  type: "host-to-guest" | "guest-to-host";
  status: "published" | "pending" | "rejected" | "approved" | "disapproved";
  rating: number | null;
  publicReview: string;
  reviewCategories: ReviewCategory[];
  submittedAt: Date;
  guestName: string;
  listingName: string;
  propertyId: string;
  channel: "hostaway" | "google";
  isApprovedForPublic: boolean;
  averageCategoryRating: number;
}

// Property types
export interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  totalReviews: number;
  averageRating: number;
  lastReviewDate: Date;
  performanceMetrics: PropertyPerformanceMetrics;
}

export interface PropertyPerformanceMetrics {
  cleanliness: number;
  communication: number;
  checkIn: number;
  accuracy: number;
  location: number;
  value: number;
  overall: number;
}

// Dashboard filter types
export interface ReviewFilters {
  propertyId?: string;
  rating?: number;
  category?: string;
  channel?: "hostaway" | "google" | "all";
  dateRange?: {
    start: Date;
    end: Date;
  };
  timeRange?: "7d" | "30d" | "90d" | "all";
  status?: "all" | "pending" | "approved" | "disapproved";
  type?: "all" | "guest-to-host" | "host-to-guest";
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard state types
export interface DashboardState {
  reviews: Review[];
  properties: Property[];
  filters: ReviewFilters;
  selectedReviews: number[];
  loading: boolean;
  error: string | null;
}

// Chart data types
export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
}

export interface ReviewTrendData {
  date: string;
  totalReviews: number;
  averageRating: number;
  positiveReviews: number;
  negativeReviews: number;
}

// Google Reviews types (for future integration)
export interface GoogleReview {
  author_name: string;
  author_url: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated: boolean;
}

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  reviews?: GoogleReview[];
  photos?: string[];
}
