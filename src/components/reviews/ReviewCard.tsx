"use client";

import { Review } from "@/lib/types";
import { formatDate, formatRelativeTime } from "@/lib/utils/reviewUtils";

interface ReviewCardProps {
  review: Review;
  isSelected?: boolean;
  onSelect?: (reviewId: number) => void;
  onApprove?: (reviewId: number, approved: boolean) => void;
  showActions?: boolean;
}

export default function ReviewCard({
  review,
  isSelected = false,
  onSelect,
  onApprove,
  showActions = true,
}: ReviewCardProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 9) return "text-green-600 bg-green-100";
    if (rating >= 7) return "text-blue-600 bg-blue-100";
    if (rating >= 5) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusColor = (isApproved: boolean) => {
    return isApproved
      ? "text-green-700 bg-green-100 border-green-200"
      : "text-yellow-700 bg-yellow-100 border-yellow-200";
  };

  return (
    <div
             className={`flex-card p-6 transition-all hover:shadow-md ${
         isSelected ? "ring-2 ring-flex-teal" : ""
       }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {review.guestName}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatingColor(
                review.averageCategoryRating
              )}`}
            >
              {review.averageCategoryRating}/10
            </span>
          </div>
          <p className="text-sm text-gray-600">{review.listingName}</p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
              review.isApprovedForPublic
            )}`}
          >
            {review.isApprovedForPublic ? "Approved" : "Pending"}
          </span>
          {onSelect && (
                         <input
               type="checkbox"
               checked={isSelected}
               onChange={() => onSelect(review.id)}
               className="w-4 h-4 text-flex-teal border-gray-300 rounded focus:ring-flex-teal"
             />
          )}
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{review.publicReview}</p>
      </div>

      {/* Category Ratings */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Category Ratings
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {review.reviewCategories.map((category) => (
            <div
              key={category.category}
              className="flex justify-between text-sm"
            >
              <span className="text-gray-600 capitalize">
                {category.category.replace("_", " ")}
              </span>
              <span className="font-medium text-gray-900">
                {category.rating}/10
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{formatDate(review.submittedAt)}</span>
          <span>•</span>
          <span className="capitalize">{review.type.replace("-", " ")}</span>
          <span>•</span>
          <span className="capitalize">{review.channel}</span>
        </div>

        {showActions && onApprove && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onApprove(review.id, true)}
              disabled={review.isApprovedForPublic}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                review.isApprovedForPublic
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              Approve
            </button>
            <button
              onClick={() => onApprove(review.id, false)}
              disabled={!review.isApprovedForPublic}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                !review.isApprovedForPublic
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
