import { GoogleReview, GooglePlaceDetails, ApiResponse } from "../types";

export class GooglePlacesAPI {
  /**
   * Search for a place by text query (Mock implementation)
   */
  async searchPlace(query: string): Promise<ApiResponse<GooglePlaceDetails[]>> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return mock place data based on query
    const mockPlaces: GooglePlaceDetails[] = [
      {
        place_id: "mock_place_1",
        name: query || "Demo Property",
        formatted_address: "123 Demo Street, Demo City, DC 12345",
        reviews: this.getMockReviews(),
      },
      {
        place_id: "mock_place_2",
        name: `${query} - Premium`,
        formatted_address: "456 Premium Ave, Demo City, DC 12345",
        reviews: this.getMockReviews().slice(0, 2),
      },
    ];

    return {
      success: true,
      data: mockPlaces,
    };
  }

  /**
   * Get place details including reviews (Mock implementation)
   */
  async getPlaceDetails(
    placeId: string
  ): Promise<ApiResponse<GooglePlaceDetails>> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const mockPlace: GooglePlaceDetails = {
      place_id: placeId,
      name: "Demo Property",
      formatted_address: "123 Demo Street, Demo City, DC 12345",
      reviews: this.getMockReviews(),
    };

    return {
      success: true,
      data: mockPlace,
    };
  }

  /**
   * Get reviews for a specific place (Mock implementation)
   */
  async getPlaceReviews(placeId: string): Promise<ApiResponse<GoogleReview[]>> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      success: true,
      data: this.getMockReviews(),
    };
  }

  /**
   * Test the API connection (Mock implementation)
   */
  async testConnection(): Promise<boolean> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Always return true for demo
    return true;
  }

  /**
   * Get mock Google reviews for development/testing
   */
  getMockReviews(): GoogleReview[] {
    return [
      {
        author_name: "Sarah Johnson",
        author_url: "https://maps.google.com/maps/contrib/123456789",
        language: "en",
        profile_photo_url: "https://lh3.googleusercontent.com/a/default-user",
        rating: 5,
        relative_time_description: "2 months ago",
        text: "Amazing property! The location is perfect and the amenities are top-notch. Highly recommend for anyone visiting the area. The host was incredibly responsive and the place was spotless.",
        time: Math.floor((Date.now() - 60 * 24 * 60 * 60 * 1000) / 1000), // 2 months ago
        translated: false,
      },
      {
        author_name: "Michael Chen",
        author_url: "https://maps.google.com/maps/contrib/987654321",
        language: "en",
        profile_photo_url: "https://lh3.googleusercontent.com/a/default-user",
        rating: 4,
        relative_time_description: "1 month ago",
        text: "Great experience overall. The property was clean and well-maintained. The only minor issue was the wifi speed, but everything else was excellent. Would definitely stay again!",
        time: Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000), // 1 month ago
        translated: false,
      },
      {
        author_name: "Emily Rodriguez",
        author_url: "https://maps.google.com/maps/contrib/456789123",
        language: "en",
        profile_photo_url: "https://lh3.googleusercontent.com/a/default-user",
        rating: 5,
        relative_time_description: "3 weeks ago",
        text: "Absolutely loved our stay! The property exceeded our expectations. The host was very responsive and the location couldn't be better. Perfect for our family vacation.",
        time: Math.floor((Date.now() - 21 * 24 * 60 * 60 * 1000) / 1000), // 3 weeks ago
        translated: false,
      },
      {
        author_name: "David Kim",
        author_url: "https://maps.google.com/maps/contrib/789123456",
        language: "en",
        profile_photo_url: "https://lh3.googleusercontent.com/a/default-user",
        rating: 4,
        relative_time_description: "1 week ago",
        text: "Very nice property with great amenities. The neighborhood is quiet and safe. The only suggestion would be to add more kitchen utensils, but overall a great stay.",
        time: Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000), // 1 week ago
        translated: false,
      },
      {
        author_name: "Lisa Thompson",
        author_url: "https://maps.google.com/maps/contrib/321654987",
        language: "en",
        profile_photo_url: "https://lh3.googleusercontent.com/a/default-user",
        rating: 5,
        relative_time_description: "5 days ago",
        text: "Exceptional experience! The property is beautifully decorated and has everything you need. The host went above and beyond to make our stay comfortable. Highly recommend!",
        time: Math.floor((Date.now() - 5 * 24 * 60 * 60 * 1000) / 1000), // 5 days ago
        translated: false,
      },
    ];
  }
}

export const googlePlacesAPI = new GooglePlacesAPI();
