import { GoogleReview, Review } from "../types";

/**
 * Convert Google Review to our standard Review format
 */
export function normalizeGoogleReview(
  googleReview: GoogleReview,
  propertyId: string,
  propertyName: string
): Review {
  return {
    id: Math.floor(Math.random() * 10000), // Generate a unique ID since Google reviews don't have IDs
    type: "guest-to-host", // Google reviews are always guest reviews
    status: "published", // Google reviews are always published
    rating: googleReview.rating,
    publicReview: googleReview.text,
    reviewCategories: [], // Google doesn't provide category breakdowns
    submittedAt: new Date(googleReview.time * 1000), // Convert timestamp to Date
    guestName: googleReview.author_name,
    listingName: propertyName,
    propertyId: propertyId,
    channel: "google",
    isApprovedForPublic: true, // Google reviews are pre-approved
    averageCategoryRating: googleReview.rating,
  };
}

/**
 * Merge Google Reviews with existing reviews
 */
export function mergeReviewsWithGoogle(
  existingReviews: Review[],
  googleReviews: GoogleReview[],
  propertyId: string,
  propertyName: string
): Review[] {
  const normalizedGoogleReviews = googleReviews.map((review) =>
    normalizeGoogleReview(review, propertyId, propertyName)
  );

  // Combine and deduplicate by review ID
  const allReviews = [...existingReviews, ...normalizedGoogleReviews];
  const uniqueReviews = allReviews.filter(
    (review, index, self) => index === self.findIndex((r) => r.id === review.id)
  );

  return uniqueReviews;
}

/**
 * Filter reviews by channel
 */
export function filterReviewsByChannel(
  reviews: Review[],
  channel: "hostaway" | "google" | "all"
): Review[] {
  if (channel === "all") {
    return reviews;
  }
  return reviews.filter((review) => review.channel === channel);
}

/**
 * Get review statistics by channel
 */
export function getReviewStatsByChannel(reviews: Review[]) {
  const hostawayReviews = reviews.filter((r) => r.channel === "hostaway");
  const googleReviews = reviews.filter((r) => r.channel === "google");

  return {
    hostaway: {
      count: hostawayReviews.length,
      averageRating:
        hostawayReviews.length > 0
          ? hostawayReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            hostawayReviews.length
          : 0,
    },
    google: {
      count: googleReviews.length,
      averageRating:
        googleReviews.length > 0
          ? googleReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            googleReviews.length
          : 0,
    },
    total: {
      count: reviews.length,
      averageRating:
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            reviews.length
          : 0,
    },
  };
}
