import { NextRequest, NextResponse } from "next/server";
import { googlePlacesAPI } from "@/lib/api/google";
import { GoogleReview, ApiResponse } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get("placeId");
    const query = searchParams.get("query");

    // Always use mock data for demo (no API charges)
    let reviews: GoogleReview[] = [];

    if (placeId) {
      // Get reviews for specific place ID
      const result = await googlePlacesAPI.getPlaceReviews(placeId);
      if (result.success && result.data) {
        reviews = result.data;
      } else {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }
    } else if (query) {
      // Search for place and get reviews
      const searchResult = await googlePlacesAPI.searchPlace(query);
      if (
        searchResult.success &&
        searchResult.data &&
        searchResult.data.length > 0
      ) {
        const placeId = searchResult.data[0].place_id;
        const reviewsResult = await googlePlacesAPI.getPlaceReviews(placeId);
        if (reviewsResult.success && reviewsResult.data) {
          reviews = reviewsResult.data;
        }
      } else {
        return NextResponse.json(
          { success: false, error: "No places found for the given query" },
          { status: 404 }
        );
      }
    } else {
      // Return mock reviews if no query provided
      reviews = googlePlacesAPI.getMockReviews();
    }

    const response: ApiResponse<GoogleReview[]> = {
      success: true,
      data: reviews,
      message: "Demo mode: Using mock Google Reviews data",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching Google Reviews:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
