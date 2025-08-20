"use client";

import { Review } from "@/lib/types";
import { getReviewStats } from "@/lib/utils/reviewUtils";

interface StatsOverviewProps {
  reviews: Review[];
  properties: Array<{
    id: string;
    name: string;
    totalReviews: number;
    averageRating: number;
  }>;
}

export default function StatsOverview({
  reviews,
  properties,
}: StatsOverviewProps) {
  const stats = getReviewStats(reviews);
  const totalProperties = properties.length;
  const totalReviews = reviews.length;

  // Calculate trends and identify issues
  const getTrendsAndIssues = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const recentReviews = reviews.filter(
      (r) => new Date(r.submittedAt) >= thirtyDaysAgo
    );
    const previousReviews = reviews.filter(
      (r) =>
        new Date(r.submittedAt) >= sixtyDaysAgo &&
        new Date(r.submittedAt) < thirtyDaysAgo
    );

    const recentAvg =
      recentReviews.length > 0
        ? recentReviews.reduce(
            (sum, r) => sum + (r.averageCategoryRating || 0),
            0
          ) / recentReviews.length
        : 0;
    const previousAvg =
      previousReviews.length > 0
        ? previousReviews.reduce(
            (sum, r) => sum + (r.averageCategoryRating || 0),
            0
          ) / previousReviews.length
        : 0;

    const ratingChange =
      previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;

    // Identify recurring issues
    const lowRatedReviews = reviews.filter(
      (r) => (r.averageCategoryRating || 0) < 6
    );
    const issueCategories = lowRatedReviews.reduce((acc, review) => {
      review.reviewCategories.forEach((cat) => {
        if (cat.rating < 6) {
          acc[cat.category] = (acc[cat.category] || 0) + 1;
        }
      });
      return acc;
    }, {} as Record<string, number>);

    const topIssues = Object.entries(issueCategories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, count]) => ({
        category: category.replace("_", " "),
        count,
        percentage: Math.round((count / lowRatedReviews.length) * 100),
      }));

    return {
      ratingChange: Math.round(ratingChange * 10) / 10,
      recentReviews: recentReviews.length,
      previousReviews: previousReviews.length,
      topIssues,
    };
  };

  const trends = getTrendsAndIssues();

  const statCards = [
    {
      title: "Total Reviews",
      value: totalReviews,
      change: trends.recentReviews > 0 ? `+${trends.recentReviews}` : "0",
      changeType:
        trends.recentReviews > 0 ? ("positive" as const) : ("neutral" as const),
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
    },
    {
      title: "Average Rating",
      value: stats.averageRating,
      change: `${trends.ratingChange > 0 ? "+" : ""}${trends.ratingChange}%`,
      changeType:
        trends.ratingChange > 0
          ? ("positive" as const)
          : trends.ratingChange < 0
          ? ("negative" as const)
          : ("neutral" as const),
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
    {
      title: "Properties",
      value: totalProperties,
      change: "+1",
      changeType: "positive" as const,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      title: "Positive Reviews",
      value: `${stats.positivePercentage}%`,
      change: "+5%",
      changeType: "positive" as const,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-flex-teal mb-6">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="flex-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      card.changeType === "positive"
                        ? "text-green-600"
                        : card.changeType === "negative"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {card.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    from last month
                  </span>
                </div>
              </div>
              <div className="text-flex-teal">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Trend Analysis & Issues */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Analysis */}
        <div className="flex-card p-6">
          <h3 className="text-lg font-semibold text-flex-teal mb-4">
            📈 Recent Trends
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rating Change (30 days)</span>
              <span
                className={`font-semibold ${
                  trends.ratingChange > 0
                    ? "text-green-600"
                    : trends.ratingChange < 0
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {trends.ratingChange > 0 ? "+" : ""}
                {trends.ratingChange}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Reviews (30 days)</span>
              <span className="font-semibold text-gray-900">
                {trends.recentReviews}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Previous Period</span>
              <span className="font-semibold text-gray-900">
                {trends.previousReviews}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  trends.ratingChange > 0
                    ? "bg-green-500"
                    : trends.ratingChange < 0
                    ? "bg-red-500"
                    : "bg-gray-400"
                }`}
                style={{
                  width: `${Math.min(
                    Math.abs(trends.ratingChange) * 10,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recurring Issues */}
        <div className="flex-card p-6">
          <h3 className="text-lg font-semibold text-flex-teal mb-4">
            ⚠️ Recurring Issues
          </h3>
          {trends.topIssues.length > 0 ? (
            <div className="space-y-3">
              {trends.topIssues.map((issue, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize">
                    {issue.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-red-600">
                      {issue.count} issues
                    </span>
                    <span className="text-xs text-gray-500">
                      ({issue.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Based on reviews with ratings below 6/10
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-green-500 text-2xl mb-2">✅</div>
              <p className="text-sm text-gray-600">
                No recurring issues detected
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Property Performance Cards */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-flex-teal mb-4">
          Property Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="flex-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  {property.name}
                </h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {property.totalReviews} reviews
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {property.averageRating}/10
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-flex-teal h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(property.averageRating / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
