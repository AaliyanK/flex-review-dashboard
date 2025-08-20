import {
  HostawayReview,
  Review,
  ReviewCategory,
  PropertyPerformanceMetrics,
} from "../types";

/**
 * Normalize Hostaway review data to our application format
 */
export function normalizeHostawayReview(
  hostawayReview: HostawayReview
): Review {
  const averageCategoryRating = calculateAverageCategoryRating(
    hostawayReview.reviewCategory
  );

  // Ensure proper date conversion
  let submittedAt: Date;
  try {
    submittedAt = new Date(hostawayReview.submittedAt);
    // Check if the date is valid
    if (isNaN(submittedAt.getTime())) {
      console.warn(
        `Invalid date format for review ${hostawayReview.id}: ${hostawayReview.submittedAt}`
      );
      submittedAt = new Date(); // Fallback to current date
    }
  } catch (error) {
    console.warn(
      `Error parsing date for review ${hostawayReview.id}: ${hostawayReview.submittedAt}`,
      error
    );
    submittedAt = new Date(); // Fallback to current date
  }

  return {
    id: hostawayReview.id,
    type: hostawayReview.type,
    status: hostawayReview.status,
    rating: hostawayReview.rating,
    publicReview: hostawayReview.publicReview,
    reviewCategories: hostawayReview.reviewCategory,
    submittedAt,
    guestName: hostawayReview.guestName,
    listingName: hostawayReview.listingName,
    propertyId: extractPropertyId(hostawayReview.listingName),
    channel: "hostaway",
    isApprovedForPublic: false, // Default to false, managers will approve
    averageCategoryRating,
  };
}

/**
 * Calculate average rating from review categories
 */
export function calculateAverageCategoryRating(
  categories: ReviewCategory[]
): number {
  if (categories.length === 0) return 0;

  const totalRating = categories.reduce(
    (sum, category) => sum + category.rating,
    0
  );
  return Math.round((totalRating / categories.length) * 10) / 10; // Round to 1 decimal
}

/**
 * Extract property ID from listing name
 * Format: "2B N1 A - 29 Shoreditch Heights" -> "29-shoreditch-heights"
 */
export function extractPropertyId(listingName: string): string {
  const parts = listingName.split(" - ");
  if (parts.length > 1) {
    const propertyPart = parts[1].toLowerCase();
    return propertyPart.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }
  return listingName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Calculate property performance metrics from reviews
 */
export function calculatePropertyMetrics(
  reviews: Review[]
): PropertyPerformanceMetrics {
  const categoryTotals: Record<string, { sum: number; count: number }> = {};

  reviews.forEach((review) => {
    review.reviewCategories.forEach((category) => {
      if (!categoryTotals[category.category]) {
        categoryTotals[category.category] = { sum: 0, count: 0 };
      }
      categoryTotals[category.category].sum += category.rating;
      categoryTotals[category.category].count += 1;
    });
  });

  const metrics: PropertyPerformanceMetrics = {
    cleanliness: 0,
    communication: 0,
    checkIn: 0,
    accuracy: 0,
    location: 0,
    value: 0,
    overall: 0,
  };

  // Calculate averages for each category
  Object.entries(categoryTotals).forEach(([category, { sum, count }]) => {
    const average = Math.round((sum / count) * 10) / 10;

    switch (category) {
      case "cleanliness":
        metrics.cleanliness = average;
        break;
      case "communication":
        metrics.communication = average;
        break;
      case "check_in":
        metrics.checkIn = average;
        break;
      case "accuracy":
        metrics.accuracy = average;
        break;
      case "location":
        metrics.location = average;
        break;
      case "value":
        metrics.value = average;
        break;
    }
  });

  // Calculate overall average
  const validMetrics = Object.values(metrics).filter((metric) => metric > 0);
  metrics.overall =
    validMetrics.length > 0
      ? Math.round(
          (validMetrics.reduce((sum, metric) => sum + metric, 0) /
            validMetrics.length) *
            10
        ) / 10
      : 0;

  return metrics;
}

/**
 * Filter reviews based on criteria
 */
export function filterReviews(
  reviews: Review[],
  filters: {
    propertyId?: string;
    rating?: number;
    category?: string;
    channel?: "hostaway" | "google" | "all";
    dateRange?: { start: Date; end: Date };
    timeRange?: "7d" | "30d" | "90d" | "all";
    status?: "all" | "pending" | "approved" | "disapproved";
    type?: "all" | "guest-to-host" | "host-to-guest";
  }
): Review[] {
  return reviews.filter((review) => {
    // Property filter
    if (filters.propertyId && review.propertyId !== filters.propertyId) {
      return false;
    }

    // Rating filter
    if (filters.rating && review.averageCategoryRating < filters.rating) {
      return false;
    }

    // Category filter
    if (
      filters.category &&
      !review.reviewCategories.some((cat) => cat.category === filters.category)
    ) {
      return false;
    }

    // Channel filter
    if (
      filters.channel &&
      filters.channel !== "all" &&
      review.channel !== filters.channel
    ) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const reviewDate = review.submittedAt;
      if (
        reviewDate < filters.dateRange.start ||
        reviewDate > filters.dateRange.end
      ) {
        return false;
      }
    }

    // Time range filter
    if (filters.timeRange && filters.timeRange !== "all") {
      const now = new Date();
      const daysAgo =
        filters.timeRange === "7d" ? 7 : filters.timeRange === "30d" ? 30 : 90;
      const cutoffDate = new Date(
        now.getTime() - daysAgo * 24 * 60 * 60 * 1000
      );
      const reviewDate = new Date(review.submittedAt);

      if (reviewDate < cutoffDate) {
        return false;
      }
    }

    // Status filter - based on approval status for public display
    if (filters.status && filters.status !== "all") {
      if (filters.status === "approved" && !review.isApprovedForPublic) {
        return false;
      }
      if (filters.status === "pending" && review.isApprovedForPublic === true) {
        return false;
      }
      // For disapproved, we would need to add a separate field in the future
      // For now, treat anything not approved as either pending or disapproved
      if (filters.status === "disapproved") {
        // This would require additional logic or data field to distinguish
        // between pending and explicitly disapproved reviews
        return false; // Skip for now as we don't have explicit disapproval tracking
      }
    }

    // Type filter
    if (
      filters.type &&
      filters.type !== "all" &&
      review.type !== filters.type
    ) {
      return false;
    }

    return true;
  });
}

/**
 * Sort reviews by various criteria
 */
export function sortReviews(
  reviews: Review[],
  sortBy: "date" | "rating" | "guestName" | "propertyName",
  sortOrder: "asc" | "desc" = "desc"
): Review[] {
  return [...reviews].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        // Ensure submittedAt is a Date object before calling getTime()
        const dateA =
          a.submittedAt instanceof Date
            ? a.submittedAt
            : new Date(a.submittedAt);
        const dateB =
          b.submittedAt instanceof Date
            ? b.submittedAt
            : new Date(b.submittedAt);
        comparison = dateA.getTime() - dateB.getTime();
        break;
      case "rating":
        comparison =
          (a.averageCategoryRating || 0) - (b.averageCategoryRating || 0);
        break;
      case "guestName":
        comparison = a.guestName.localeCompare(b.guestName);
        break;
      case "propertyName":
        comparison = a.listingName.localeCompare(b.listingName);
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });
}

/**
 * Get review statistics
 */
export function getReviewStats(reviews: Review[]) {
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? Math.round(
          (reviews.reduce(
            (sum, review) => sum + (review.averageCategoryRating || 0),
            0
          ) /
            totalReviews) *
            10
        ) / 10
      : 0;

  const positiveReviews = reviews.filter(
    (review) => (review.averageCategoryRating || 0) >= 4
  ).length;
  const negativeReviews = reviews.filter(
    (review) => (review.averageCategoryRating || 0) < 3
  ).length;
  const neutralReviews = totalReviews - positiveReviews - negativeReviews;

  return {
    totalReviews,
    averageRating,
    positiveReviews,
    negativeReviews,
    neutralReviews,
    positivePercentage:
      totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0,
    negativePercentage:
      totalReviews > 0 ? Math.round((negativeReviews / totalReviews) * 100) : 0,
  };
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}
