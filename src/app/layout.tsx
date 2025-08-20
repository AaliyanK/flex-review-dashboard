import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flex Living Reviews Dashboard",
  description:
    "Comprehensive reviews management system for Flex Living property managers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Navigation Header */}
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and Brand */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-flex-teal rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">F</span>
                  </div>
                  <span className="text-xl font-bold text-flex-teal">
                    Flex Living
                  </span>
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-flex-teal transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/properties"
                  className="text-gray-700 hover:text-flex-teal transition-colors font-medium"
                >
                  Properties
                </Link>
                <Link
                  href="/analytics"
                  className="text-gray-700 hover:text-flex-teal transition-colors font-medium"
                >
                  Analytics
                </Link>
                <Link
                  href="/google-reviews"
                  className="text-gray-700 hover:text-flex-teal transition-colors font-medium"
                >
                  Google Reviews
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button className="text-gray-700 hover:text-flex-teal transition-colors">
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                © 2025 Flex Living. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Reviews Management System - Developer Assessment
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
