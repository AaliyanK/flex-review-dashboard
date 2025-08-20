import { HostawayReview, ApiResponse } from "../types";

const HOSTAWAY_BASE_URL = "https://api.hostaway.com/v1";
const ACCOUNT_ID = process.env.HOSTAWAY_ACCOUNT_ID;
const API_KEY = process.env.HOSTAWAY_API_KEY;

/**
 * Hostaway API client for fetching reviews
 */
export class HostawayAPI {
  private baseUrl: string;
  private accountId: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = HOSTAWAY_BASE_URL;
    this.accountId = ACCOUNT_ID || "";
    this.apiKey = API_KEY || "";

    if (!this.accountId || !this.apiKey) {
      console.warn("Hostaway API credentials not found. Using mock data.");
    }
  }

  /**
   * Fetch reviews from Hostaway API
   */
  async fetchReviews(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    type?: string;
  }): Promise<ApiResponse<HostawayReview[]>> {
    try {
      // If no API credentials, return mock data
      if (!this.accountId || !this.apiKey) {
        return this.getMockReviews(params);
      }

      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.offset)
        queryParams.append("offset", params.offset.toString());
      if (params?.status) queryParams.append("status", params.status);
      if (params?.type) queryParams.append("type", params.type);

      const url = `${this.baseUrl}/reviews?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "X-Account-ID": this.accountId,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Hostaway API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.status === "success" && Array.isArray(data.result)) {
        return {
          success: true,
          data: data.result,
        };
      } else {
        throw new Error("Invalid response format from Hostaway API");
      }
    } catch (error) {
      console.error("Error fetching reviews from Hostaway:", error);

      // Fallback to mock data on error
      return this.getMockReviews(params);
    }
  }

  /**
   * Get mock reviews for development/testing
   */
  private async getMockReviews(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    type?: string;
  }): Promise<ApiResponse<HostawayReview[]>> {
    // Import mock data dynamically to avoid circular dependencies
    const { mockHostawayReviews } = await import("../../data/mockReviews");

    let filteredReviews = [...mockHostawayReviews];

    // Apply filters
    if (params?.status) {
      filteredReviews = filteredReviews.filter(
        (review) => review.status === params.status
      );
    }

    if (params?.type) {
      filteredReviews = filteredReviews.filter(
        (review) => review.type === params.type
      );
    }

    // Apply pagination
    const offset = params?.offset || 0;
    const limit = params?.limit || filteredReviews.length;
    const paginatedReviews = filteredReviews.slice(offset, offset + limit);

    return {
      success: true,
      data: paginatedReviews,
    };
  }

  /**
   * Fetch a single review by ID
   */
  async fetchReviewById(
    reviewId: number
  ): Promise<ApiResponse<HostawayReview>> {
    try {
      if (!this.accountId || !this.apiKey) {
        const { mockHostawayReviews } = await import("../../data/mockReviews");
        const review = mockHostawayReviews.find((r) => r.id === reviewId);

        if (review) {
          return { success: true, data: review };
        } else {
          return { success: false, error: "Review not found" };
        }
      }

      const url = `${this.baseUrl}/reviews/${reviewId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "X-Account-ID": this.accountId,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Hostaway API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.status === "success" && data.result) {
        return {
          success: true,
          data: data.result,
        };
      } else {
        return { success: false, error: "Review not found" };
      }
    } catch (error) {
      console.error("Error fetching review by ID:", error);
      return { success: false, error: "Failed to fetch review" };
    }
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      if (!this.accountId || !this.apiKey) {
        return false;
      }

      const response = await fetch(`${this.baseUrl}/reviews?limit=1`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "X-Account-ID": this.accountId,
        },
      });

      return response.ok;
    } catch (error) {
      console.error("Hostaway API connection test failed:", error);
      return false;
    }
  }
}

// Export singleton instance
export const hostawayAPI = new HostawayAPI();
