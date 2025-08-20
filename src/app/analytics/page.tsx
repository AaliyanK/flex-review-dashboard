"use client";

import { useState, useEffect } from "react";
import { Property, Review } from "@/lib/types";
import { getReviewStatsByChannel } from "@/lib/utils/googleReviewUtils";

export default function AnalyticsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch properties and reviews
      const [propertiesResponse, reviewsResponse] = await Promise.all([
        fetch("/api/properties?includeMetrics=true"),
        fetch("/api/reviews/hostaway"),
      ]);

      const propertiesData = await propertiesResponse.json();
      const reviewsData = await reviewsResponse.json();

      if (propertiesData.success) {
        setProperties(propertiesData.data);
      }
      if (reviewsData.success) {
        setReviews(reviewsData.data);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getReviewStats = () => {
    const totalReviews = reviews.length;
    const approvedReviews = reviews.filter((r) => r.isApprovedForPublic).length;
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        : 0;
    const pendingReviews = reviews.filter((r) => r.status === "pending").length;

    return { totalReviews, approvedReviews, averageRating, pendingReviews };
  };

  const getTopProperties = () => {
    return properties
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);
  };

  const getReviewTrends = () => {
    const now = new Date();
    const daysAgo = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;

    const recentReviews = reviews.filter((review) => {
      const reviewDate = new Date(review.submittedAt);
      return (
        now.getTime() - reviewDate.getTime() <= daysAgo * 24 * 60 * 60 * 1000
      );
    });

    return {
      total: recentReviews.length,
      approved: recentReviews.filter((r) => r.isApprovedForPublic).length,
      averageRating:
        recentReviews.length > 0
          ? recentReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            recentReviews.length
          : 0,
    };
  };

  const getCategoryBreakdown = () => {
    const categories = [
      "cleanliness",
      "communication",
      "check-in",
      "accuracy",
      "location",
      "value",
    ];
    const breakdown: { [key: string]: number } = {};

    categories.forEach((category) => {
      const categoryReviews = reviews.filter((review) =>
        review.reviewCategories.some((cat) => cat.category === category)
      );

      if (categoryReviews.length > 0) {
        const avgRating =
          categoryReviews.reduce((sum, review) => {
            const categoryRating = review.reviewCategories.find(
              (cat) => cat.category === category
            );
            return sum + (categoryRating?.rating || 0);
          }, 0) / categoryReviews.length;

        breakdown[category] = avgRating;
      }
    });

    return breakdown;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-flex-off-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flex-teal mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const stats = getReviewStats();
  const trends = getReviewTrends();
  const topProperties = getTopProperties();
  const categoryBreakdown = getCategoryBreakdown();
  const channelStats = getReviewStatsByChannel(reviews);

  return (
    <div className="min-h-screen bg-flex-off-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-flex-teal to-[#1a3a38] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Analytics Dashboard</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Comprehensive insights into property performance and guest
              satisfaction
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Time Range Selector */}
        <div className="flex-card p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-flex-teal">Time Range</h2>
            <div className="flex gap-2">
              {(["7d", "30d", "90d"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    timeRange === range
                      ? "bg-flex-teal text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {range === "7d"
                    ? "7 Days"
                    : range === "30d"
                    ? "30 Days"
                    : "90 Days"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="flex-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Reviews
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalReviews}
                </p>
              </div>
              <div className="text-flex-teal">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Approved Reviews
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.approvedReviews}
                </p>
              </div>
              <div className="text-green-500">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Rating
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageRating.toFixed(1)}/10
                </p>
              </div>
              <div className="text-yellow-500">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Reviews
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingReviews}
                </p>
              </div>
              <div className="text-orange-500">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="flex-card p-6">
            <h3 className="text-lg font-semibold text-flex-teal mb-4">
              Recent Trends ({timeRange})
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Reviews</span>
                <span className="font-semibold">{trends.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved Reviews</span>
                <span className="font-semibold">{trends.approved}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Rating</span>
                <span className="font-semibold">
                  {trends.averageRating.toFixed(1)}/10
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approval Rate</span>
                <span className="font-semibold">
                  {trends.total > 0
                    ? ((trends.approved / trends.total) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="flex-card p-6">
            <h3 className="text-lg font-semibold text-flex-teal mb-4">
              Review Sources
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Hostaway Reviews</span>
                <span className="font-semibold">
                  {channelStats.hostaway.count}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Google Reviews</span>
                <span className="font-semibold">
                  {channelStats.google.count}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Reviews</span>
                <span className="font-semibold">
                  {channelStats.total.count}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Overall Average</span>
                <span className="font-semibold">
                  {channelStats.total.averageRating.toFixed(1)}/10
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Properties */}
        <div className="flex-card p-6 mb-8">
          <h3 className="text-lg font-semibold text-flex-teal mb-4">
            Top Performing Properties
          </h3>
          <div className="space-y-4">
            {topProperties.map((property, index) => (
              <div
                key={property.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-flex-teal text-white rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {property.name}
                    </h4>
                    <p className="text-sm text-gray-600">{property.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {property.averageRating}/10
                  </div>
                  <div className="text-sm text-gray-600">
                    {property.totalReviews} reviews
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="flex-card p-6">
          <h3 className="text-lg font-semibold text-flex-teal mb-4">
            Category Performance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(categoryBreakdown).map(([category, rating]) => (
              <div key={category} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {category}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {rating.toFixed(1)}/10
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-flex-teal h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(rating / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
