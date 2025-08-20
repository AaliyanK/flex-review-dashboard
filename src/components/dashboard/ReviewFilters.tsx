"use client";

import { useState } from "react";
import { ReviewFilters as ReviewFiltersType } from "@/lib/types";

interface ReviewFiltersProps {
  filters: ReviewFiltersType;
  onFiltersChange: (filters: ReviewFiltersType) => void;
  properties: Array<{ id: string; name: string }>;
}

export default function ReviewFilters({
  filters,
  onFiltersChange,
  properties,
}: ReviewFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (
    key: keyof ReviewFiltersType,
    value: string | number | undefined
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      propertyId: undefined,
      rating: undefined,
      category: undefined,
      channel: "all",
      timeRange: "all",
      status: "all",
      type: "all",
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== "all"
  );

  return (
    <div className="flex-card mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-flex-teal">
            Filter Reviews
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            {isExpanded ? "Hide Filters" : "Show Filters"}
            <svg
              className={`w-4 h-4 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-6">
            {/* Property Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property
              </label>
              <select
                value={filters.propertyId || ""}
                onChange={(e) =>
                  handleFilterChange("propertyId", e.target.value || undefined)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flex-teal focus:border-flex-teal text-gray-900"
              >
                <option value="">All Properties</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <select
                value={filters.rating || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "rating",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flex-teal focus:border-flex-teal text-gray-900"
              >
                <option value="">Any Rating</option>
                <option value="9">9+ Stars</option>
                <option value="8">8+ Stars</option>
                <option value="7">7+ Stars</option>
                <option value="6">6+ Stars</option>
                <option value="5">5+ Stars</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category || ""}
                onChange={(e) =>
                  handleFilterChange("category", e.target.value || undefined)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flex-teal focus:border-flex-teal text-gray-900"
              >
                <option value="">All Categories</option>
                <option value="cleanliness">Cleanliness</option>
                <option value="communication">Communication</option>
                <option value="check_in">Check-in</option>
                <option value="accuracy">Accuracy</option>
                <option value="location">Location</option>
                <option value="value">Value</option>
              </select>
            </div>

            {/* Time Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Range
              </label>
              <select
                value={filters.timeRange || "all"}
                onChange={(e) =>
                  handleFilterChange("timeRange", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flex-teal focus:border-flex-teal text-gray-900"
              >
                <option value="all">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status || "all"}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flex-teal focus:border-flex-teal text-gray-900"
              >
                <option value="all">All Reviews</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="disapproved">Disapproved</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Type
              </label>
              <select
                value={filters.type || "all"}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flex-teal focus:border-flex-teal text-gray-900"
              >
                <option value="all">All Types</option>
                <option value="guest-to-host">Guest Reviews</option>
                <option value="host-to-guest">Host Reviews</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
