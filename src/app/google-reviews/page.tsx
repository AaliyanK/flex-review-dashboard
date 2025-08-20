"use client";

import { useState, useEffect } from "react";
import { GoogleReview } from "@/lib/types";
import GoogleReviewCard from "@/components/reviews/GoogleReviewCard";

export default function GoogleReviewsPage() {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load initial mock reviews
    fetchGoogleReviews("Demo Property");
  }, []);

  const fetchGoogleReviews = async (query: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/reviews/google?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (data.success) {
        setReviews(data.data);
      } else {
        setError(data.error || "Failed to fetch Google Reviews");
      }
    } catch (err) {
      setError("An error occurred while fetching Google Reviews");
      console.error("Error fetching Google Reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchGoogleReviews(searchQuery.trim());
    }
  };

  return (
    <div className="min-h-screen bg-flex-off-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-flex-teal to-[#1a3a38] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Google Reviews Integration
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Demo of Google Reviews integration with mock data
            </p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-yellow-500/20 rounded-full">
              <span className="text-yellow-200 text-sm font-medium">
                🎯 Demo Mode - No API Charges
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Demo Notice */}
        <div className="flex-card p-6 mb-8 bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-blue-900">
              Demo Information
            </h2>
          </div>
          <p className="text-blue-800 mb-3">
            This is a demonstration of Google Reviews integration using mock
            data. No real API calls are made, ensuring zero costs and immediate
            functionality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-blue-700">No API Key Required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-blue-700">Zero Cost</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-blue-700">Instant Results</span>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="flex-card p-6 mb-8">
          <h2 className="text-xl font-semibold text-flex-teal mb-4">
            Search Google Reviews
          </h2>
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter property name or address..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flex-teal focus:border-flex-teal"
            />
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="px-6 py-2 bg-flex-teal text-white rounded-lg font-medium hover:bg-[#1a3a38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {/* Example Queries */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              Try these example queries:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Luxury Hotel Downtown",
                "Beach Resort Miami",
                "Mountain Cabin Colorado",
                "City Apartment",
                "Villa Resort",
              ].map((query) => (
                <button
                  key={query}
                  onClick={() => {
                    setSearchQuery(query);
                    fetchGoogleReviews(query);
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex-card p-6 mb-8 bg-red-50 border border-red-200">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Reviews Display */}
        <div className="flex-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-flex-teal">
              Google Reviews
            </h2>
            <span className="text-sm text-gray-600">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flex-teal mx-auto"></div>
              <p className="mt-4 text-gray-600">
                Searching for Google Reviews...
              </p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reviews found
              </h3>
              <p className="text-gray-600">
                Search for Google Reviews by place name or address. We&apos;ll find the best matches and display their reviews.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <GoogleReviewCard
                  key={`${review.author_name}-${review.time}-${index}`}
                  review={review}
                  showActions={false}
                />
              ))}
            </div>
          )}
        </div>

        {/* Demo Features */}
        <div className="flex-card p-6 mt-8">
          <h2 className="text-xl font-semibold text-flex-teal mb-4">
            Demo Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                What&apos;s Included
              </h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Realistic mock Google Reviews data</li>
                <li>• Search functionality simulation</li>
                <li>• Review cards with Google styling</li>
                <li>• Author profiles and ratings</li>
                <li>• Timestamps and relative dates</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Production Ready
              </h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Easy to switch to real API</li>
                <li>• Same UI components</li>
                <li>• Identical data structure</li>
                <li>• No code changes needed</li>
                <li>• Just add API key</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
