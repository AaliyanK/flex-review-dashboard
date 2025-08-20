"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Property, Review } from "@/lib/types";
import { filterReviews } from "@/lib/utils/reviewUtils";
import ReviewCard from "@/components/reviews/ReviewCard";

export default function PropertyDetailsPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPropertyData();
  }, [propertyId]);

  const fetchPropertyData = async () => {
    try {
      setLoading(true);

      // Fetch property details
      const propertyResponse = await fetch(`/api/properties/${propertyId}`);
      const propertyData = await propertyResponse.json();

      if (propertyData.success) {
        setProperty(propertyData.data);
      } else {
        setError("Property not found");
      }

      // Fetch all reviews and filter for this property
      const reviewsResponse = await fetch("/api/reviews/hostaway");
      const reviewsData = await reviewsResponse.json();

      if (reviewsData.success) {
        const propertyReviews = filterReviews(reviewsData.data, {
          propertyId: propertyId,
          status: "approved",
          channel: "all",
          type: "all",
          rating: undefined,
          category: undefined,
        });
        setReviews(propertyReviews);
      }
    } catch (err) {
      setError("An error occurred while fetching property data");
      console.error("Error fetching property data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-flex-off-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flex-teal mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-flex-off-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || "Property not found"}</p>
          <button
            onClick={fetchPropertyData}
            className="bg-flex-teal text-white px-4 py-2 rounded-lg hover:bg-[#1a3a38] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-flex-off-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-flex-teal to-[#1a3a38] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">{property.name}</h1>
              <p className="text-xl mb-6 text-gray-200">
                Experience luxury living in the heart of the city
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Prime Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Modern Amenities</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">
                Property Highlights
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Reviews</span>
                  <span className="font-semibold">{property.totalReviews}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Rating</span>
                  <span className="font-semibold">
                    {property.averageRating}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Property Type</span>
                  <span className="font-semibold capitalize">
                    {property.type}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* About Section */}
            <div className="flex-card p-8 mb-8">
              <h2 className="text-2xl font-semibold text-flex-teal mb-4">
                About This Property
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {`Experience the perfect blend of comfort and luxury at ${property.name}. 
                This exceptional property offers modern amenities, prime location, and outstanding guest experiences. 
                Our commitment to excellence is reflected in every detail, ensuring your stay is nothing short of extraordinary.`}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">🏠</div>
                  <div className="text-sm font-medium text-gray-700">
                    Spacious
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">🌟</div>
                  <div className="text-sm font-medium text-gray-700">
                    Premium
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">📍</div>
                  <div className="text-sm font-medium text-gray-700">
                    Central
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">✨</div>
                  <div className="text-sm font-medium text-gray-700">
                    Modern
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Reviews Section */}
            <div className="flex-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-flex-teal">
                    Guest Reviews
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {reviews.length} verified guest reviews
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(property.averageRating / 2)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {property.averageRating}/10
                  </span>
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">⭐</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-gray-600">
                    Be the first to experience this amazing property!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      showActions={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="flex-card p-6">
              <h3 className="text-lg font-semibold text-flex-teal mb-4">
                Quick Info
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium capitalize">
                    {property.type}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="font-medium">{property.totalReviews}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-medium">
                    {property.averageRating}/10
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="flex-card p-6">
              <h3 className="text-lg font-semibold text-flex-teal mb-4">
                Get in Touch
              </h3>
              <p className="text-gray-600 mb-4">
                Ready to experience this amazing property? Contact us today!
              </p>
              <button className="w-full bg-flex-teal text-white px-4 py-3 rounded-lg font-medium hover:bg-[#1a3a38] transition-colors">
                Contact Property Manager
              </button>
            </div>

            {/* Similar Properties */}
            <div className="flex-card p-6">
              <h3 className="text-lg font-semibold text-flex-teal mb-4">
                Similar Properties
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">
                    Luxury Downtown Suite
                  </div>
                  <div className="text-sm text-gray-600">
                    9.2/10 • 45 reviews
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">
                    Modern City Apartment
                  </div>
                  <div className="text-sm text-gray-600">
                    8.8/10 • 32 reviews
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">
                    Premium Urban Loft
                  </div>
                  <div className="text-sm text-gray-600">
                    9.0/10 • 28 reviews
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
