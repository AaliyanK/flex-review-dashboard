import { NextRequest, NextResponse } from "next/server";
import { mockProperties } from "@/data/mockReviews";
import {
  normalizeHostawayReview,
  calculatePropertyMetrics,
} from "@/lib/utils/reviewUtils";
import { hostawayAPI } from "@/lib/api/hostaway";
import { Property, ApiResponse } from "@/lib/types";

/**
 * GET /api/properties
 * Returns list of properties with performance metrics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeMetrics = searchParams.get("includeMetrics") === "true";

    // Fetch all reviews to calculate metrics
    const reviewsResponse = await hostawayAPI.fetchReviews();

    if (!reviewsResponse.success || !reviewsResponse.data) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch reviews for property metrics",
        },
        { status: 500 }
      );
    }

    // Normalize reviews
    const normalizedReviews = reviewsResponse.data.map(normalizeHostawayReview);

    // Group reviews by property
    const reviewsByProperty = normalizedReviews.reduce((acc, review) => {
      if (!acc[review.propertyId]) {
        acc[review.propertyId] = [];
      }
      acc[review.propertyId].push(review);
      return acc;
    }, {} as Record<string, typeof normalizedReviews>);

    // Build properties with metrics
    const properties: Property[] = mockProperties.map((property) => {
      const propertyReviews = reviewsByProperty[property.id] || [];

      // Calculate metrics if requested
      const performanceMetrics = includeMetrics
        ? calculatePropertyMetrics(propertyReviews)
        : {
            cleanliness: 0,
            communication: 0,
            checkIn: 0,
            accuracy: 0,
            location: 0,
            value: 0,
            overall: 0,
          };

      // Calculate average rating from reviews
      const averageRating =
        propertyReviews.length > 0
          ? propertyReviews.reduce(
              (sum, review) => sum + (review.averageCategoryRating || 0),
              0
            ) / propertyReviews.length
          : 0;

      // Find latest review date
      const lastReviewDate =
        propertyReviews.length > 0
          ? new Date(
              Math.max(...propertyReviews.map((r) => r.submittedAt.getTime()))
            )
          : new Date();

      return {
        ...property,
        totalReviews: propertyReviews.length,
        averageRating: Math.round(averageRating * 10) / 10,
        lastReviewDate,
        performanceMetrics,
      };
    });

    const result: ApiResponse<Property[]> = {
      success: true,
      data: properties,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/properties:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/properties/[id]
 * Returns a specific property with detailed metrics
 */
export async function GET_PROPERTY_BY_ID(propertyId: string) {
  try {
    // Fetch all reviews
    const reviewsResponse = await hostawayAPI.fetchReviews();

    if (!reviewsResponse.success || !reviewsResponse.data) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch reviews",
        },
        { status: 500 }
      );
    }

    // Find the property
    const property = mockProperties.find((p) => p.id === propertyId);
    if (!property) {
      return NextResponse.json(
        {
          success: false,
          error: "Property not found",
        },
        { status: 404 }
      );
    }

    // Get reviews for this property
    const normalizedReviews = reviewsResponse.data.map(normalizeHostawayReview);
    const propertyReviews = normalizedReviews.filter(
      (review) => review.propertyId === propertyId
    );

    // Calculate metrics
    const performanceMetrics = calculatePropertyMetrics(propertyReviews);

    // Calculate average rating
    const averageRating =
      propertyReviews.length > 0
        ? propertyReviews.reduce(
            (sum, review) => sum + (review.averageCategoryRating || 0),
            0
          ) / propertyReviews.length
        : 0;

    // Find latest review date
    const lastReviewDate =
      propertyReviews.length > 0
        ? new Date(
            Math.max(...propertyReviews.map((r) => r.submittedAt.getTime()))
          )
        : new Date();

    const result: Property = {
      ...property,
      totalReviews: propertyReviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      lastReviewDate,
      performanceMetrics,
    };

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in GET_PROPERTY_BY_ID:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
