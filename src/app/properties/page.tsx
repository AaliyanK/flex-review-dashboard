"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Property } from "@/lib/types";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/properties?includeMetrics=true");
      const data = await response.json();

      if (data.success) {
        setProperties(data.data);
      } else {
        setError("Failed to fetch properties");
      }
    } catch (err) {
      setError("An error occurred while fetching properties");
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-flex-off-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flex-teal mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-flex-off-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProperties}
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
      <div className="bg-gradient-to-r from-flex-teal to-[#1a3a38] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Our Properties</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Discover our collection of premium properties, each offering
              exceptional experiences and outstanding guest satisfaction.
            </p>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-flex-teal mb-2">
            Featured Properties
          </h2>
          <p className="text-gray-600">
            {properties.length} properties available
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group"
            >
              <div className="flex-card p-6 h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                {/* Property Image Placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-flex-teal/20 to-[#1a3a38]/20 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-4xl">🏠</div>
                </div>

                {/* Property Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-flex-teal transition-colors">
                    {property.name}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    Experience luxury living in this exceptional {property.type}{" "}
                    property with modern amenities and prime location.
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
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
                      <span className="text-sm font-medium text-gray-900">
                        {property.averageRating}/10
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {property.totalReviews} reviews
                    </span>
                  </div>

                  {/* Property Type Badge */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-flex-teal/10 text-flex-teal">
                      {property.type}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">
                      {property.type}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="flex-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-flex-teal mb-4">
              Ready to Experience Our Properties?
            </h3>
            <p className="text-gray-600 mb-6">
              Each property is carefully managed to ensure the highest standards
              of comfort, cleanliness, and guest satisfaction.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-flex-teal text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1a3a38] transition-colors"
            >
              View All Reviews
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
