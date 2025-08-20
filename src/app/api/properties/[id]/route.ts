import { NextRequest, NextResponse } from "next/server";
import { mockProperties } from "@/data/mockReviews";
import { Property, ApiResponse } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: propertyId } = await params;

    // Find the property in mock data
    const property = mockProperties.find((p) => p.id === propertyId);

    if (!property) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }

    const response: ApiResponse<Property> = {
      success: true,
      data: property,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
