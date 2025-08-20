import { NextRequest, NextResponse } from "next/server";
import { hostawayAPI } from "@/lib/api/hostaway";
import { normalizeHostawayReview } from "@/lib/utils/reviewUtils";
import { Review, PaginatedResponse } from "@/lib/types";

/**
 * GET /api/reviews/hostaway
 * Fetches and normalizes Hostaway reviews
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 50;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : 0;
    const status = searchParams.get("status") || undefined;
    const type = searchParams.get("type") || undefined;
    const propertyId = searchParams.get("propertyId") || undefined;

    // Fetch reviews from Hostaway API
    const response = await hostawayAPI.fetchReviews({
      limit,
      offset,
      status,
      type,
    });

    if (!response.success || !response.data) {
      return NextResponse.json(
        {
          success: false,
          error: response.error || "Failed to fetch reviews",
        },
        { status: 500 }
      );
    }

    // Normalize the reviews
    const normalizedReviews: Review[] = response.data.map(
      normalizeHostawayReview
    );

    // Filter by property if specified
    let filteredReviews = normalizedReviews;
    if (propertyId) {
      filteredReviews = normalizedReviews.filter(
        (review) => review.propertyId === propertyId
      );
    }

    // Calculate pagination info
    const total = filteredReviews.length;
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    const result: PaginatedResponse<Review> = {
      success: true,
      data: filteredReviews,
      pagination: {
        page: currentPage,
        limit,
        total,
        totalPages,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/reviews/hostaway:", error);

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
 * POST /api/reviews/hostaway
 * Updates review approval status (for future use)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, isApproved } = body;

    if (typeof reviewId !== "number" || typeof isApproved !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid request body. reviewId (number) and isApproved (boolean) are required.",
        },
        { status: 400 }
      );
    }

    // In a real application, this would update the review status in the database
    // For now, we'll return a success response
    return NextResponse.json({
      success: true,
      message: `Review ${reviewId} ${
        isApproved ? "approved" : "disapproved"
      } successfully`,
      data: { reviewId, isApproved },
    });
  } catch (error) {
    console.error("Error in POST /api/reviews/hostaway:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
