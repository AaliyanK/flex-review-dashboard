"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Review,
  Property,
  ReviewFilters as ReviewFiltersType,
} from "@/lib/types";
import { filterReviews, sortReviews } from "@/lib/utils/reviewUtils";
import ReviewFilters from "@/components/dashboard/ReviewFilters";
import ReviewCard from "@/components/reviews/ReviewCard";
import StatsOverview from "@/components/dashboard/StatsOverview";

export default function DashboardPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReviewFiltersType>({
    propertyId: undefined,
    rating: undefined,
    category: undefined,
    channel: "all",
    timeRange: "all",
    status: "all",
    type: "all",
  });
  const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<
    "date" | "rating" | "guestName" | "propertyName"
  >("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch reviews
      const reviewsResponse = await fetch("/api/reviews/hostaway");
      const reviewsData = await reviewsResponse.json();

      if (reviewsData.success) {
        setReviews(reviewsData.data);
      } else {
        setError("Failed to fetch reviews");
      }

      // Fetch properties
      const propertiesResponse = await fetch(
        "/api/properties?includeMetrics=true"
      );
      const propertiesData = await propertiesResponse.json();

      if (propertiesData.success) {
        setProperties(propertiesData.data);
      } else {
        setError("Failed to fetch properties");
      }
    } catch (err) {
      setError("An error occurred while fetching data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSelect = (reviewId: number) => {
    setSelectedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const handleReviewApprove = async (reviewId: number, approved: boolean) => {
    try {
      const response = await fetch("/api/reviews/hostaway", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId,
          isApproved: approved,
        }),
      });

      if (response.ok) {
        // Update the review in the local state
        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId
              ? { ...review, isApprovedForPublic: approved }
              : review
          )
        );
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleBulkApprove = async (approved: boolean) => {
    try {
      const promises = selectedReviews.map((reviewId) =>
        fetch("/api/reviews/hostaway", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reviewId,
            isApproved: approved,
          }),
        })
      );

      await Promise.all(promises);

      // Update all selected reviews in local state
      setReviews((prev) =>
        prev.map((review) =>
          selectedReviews.includes(review.id)
            ? { ...review, isApprovedForPublic: approved }
            : review
        )
      );

      setSelectedReviews([]);
    } catch (error) {
      console.error("Error bulk updating reviews:", error);
    }
  };

  const handleExportData = () => {
    const dataToExport = {
      reviews: reviews,
      properties: properties,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reviews-export-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Apply filters, search, and sorting
  const filteredReviews = filterReviews(reviews, filters);
  const searchFilteredReviews = searchQuery
    ? filteredReviews.filter(
        (review) =>
          review.publicReview
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          review.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.listingName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredReviews;
  const sortedReviews = sortReviews(searchFilteredReviews, sortBy, sortOrder);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-flex-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-flex-teal transition-colors">
                Home
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <Link
                href="/properties"
                className="hover:text-flex-teal transition-colors"
              >
                Properties
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li className="text-flex-teal font-medium">Dashboard</li>
          </ol>
        </nav>

        {/* Header with Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-flex-teal">
                Reviews Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and analyze guest reviews across all properties
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/analytics"
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Analytics
              </Link>

              <Link
                href="/google-reviews"
                className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                </svg>
                Google Reviews
              </Link>

              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export Data
              </button>

              <button
                onClick={fetchData}
                className="flex items-center gap-2 px-4 py-2 bg-flex-teal text-white rounded-lg font-medium hover:bg-[#1a3a38] transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex-card p-4 text-center">
              <div className="text-2xl font-bold text-flex-teal">
                {reviews.filter((r) => r.status === "pending").length}
              </div>
              <div className="text-sm text-gray-600">Pending Reviews</div>
            </div>
            <div className="flex-card p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {reviews.filter((r) => r.isApprovedForPublic).length}
              </div>
              <div className="text-sm text-gray-600">Approved Reviews</div>
            </div>
            <div className="flex-card p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {properties.length}
              </div>
              <div className="text-sm text-gray-600">Active Properties</div>
            </div>
            <div className="flex-card p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {
                  reviews.filter((r) => (r.averageCategoryRating || 0) < 6)
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">Low Rated Reviews</div>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <StatsOverview reviews={reviews} properties={properties} />

        {/* Filters */}
        <ReviewFilters
          filters={filters}
          onFiltersChange={setFilters}
          properties={properties}
        />

        {/* Reviews Section */}
        <div className="flex-card">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-flex-teal">
                  Reviews ({sortedReviews.length})
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {sortedReviews.length} of {reviews.length} reviews
                </p>
              </div>

              {/* Search and Sort Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flex-teal focus:border-flex-teal text-sm w-full sm:w-64"
                  />
                  <svg
                    className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Sort Controls */}
                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as
                          | "date"
                          | "rating"
                          | "guestName"
                          | "propertyName"
                      )
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flex-teal focus:border-flex-teal text-sm"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="guestName">Sort by Guest</option>
                    <option value="propertyName">Sort by Property</option>
                  </select>

                  <button
                    onClick={() =>
                      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                    }
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedReviews.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedReviews.length} review(s) selected
                </span>
                <button
                  onClick={() => handleBulkApprove(true)}
                  className="px-3 py-1.5 text-sm font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Approve Selected
                </button>
                <button
                  onClick={() => handleBulkApprove(false)}
                  className="px-3 py-1.5 text-sm font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Reject Selected
                </button>
                <button
                  onClick={() => setSelectedReviews([])}
                  className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>

          {/* Reviews Grid */}
          <div className="p-6">
            {sortedReviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No reviews found
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? "Try adjusting your search terms or filters to see more results."
                    : "Try adjusting your filters to see more results."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sortedReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    isSelected={selectedReviews.includes(review.id)}
                    onSelect={handleReviewSelect}
                    onApprove={handleReviewApprove}
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
