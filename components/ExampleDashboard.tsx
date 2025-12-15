/**
 * Example Dashboard Component
 * Demonstrates how to use multiple API services together in a real component
 */

"use client";

import { useState, useEffect } from "react";
import {
  SalonAPI,
  BookingAPI,
  UserAPI,
  ProductAPI,
  ApiError,
} from "@/lib/services";
import type { Salon, Booking, UserProfile, Product } from "@/lib/types/api";

export default function ExampleDashboard() {
  // State management
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data in parallel for better performance
      const [profileRes, salonsRes, bookingsRes, productsRes] =
        await Promise.all([
          UserAPI.getUserProfile(),
          SalonAPI.getMySalons({ verified: true }),
          BookingAPI.getBookings({ status: "CONFIRMED" }),
          ProductAPI.getProducts({ inStock: true, limit: 5 }),
        ]);

      setProfile(profileRes.user);
      setSalons(salonsRes.data);
      setBookings(bookingsRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);

        // Handle specific errors
        if (err.status === 401) {
          // Redirect to login
          window.location.href = "/auth";
        }
      } else {
        setError("Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  // Example: Create a new booking
  const handleCreateBooking = async (bookingData: any) => {
    try {
      const result = await BookingAPI.createBooking(bookingData);
      alert(`Booking created: ${result.data.id}`);

      // Refresh bookings list
      const updatedBookings = await BookingAPI.getBookings({
        status: "CONFIRMED",
      });
      setBookings(updatedBookings.data);
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  // Example: Update user profile
  const handleUpdateProfile = async (name: string, phone: string) => {
    try {
      const result = await UserAPI.updateUserProfile({ name, phone });
      setProfile(result.data);
      alert("Profile updated successfully!");
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  // Example: Search salons
  const handleSearchSalons = async (query: string) => {
    try {
      const results = await SalonAPI.searchSalons({
        service: query,
        sortBy: "top_rated",
        page: 1,
        limit: 10,
      });

      console.log("Search results:", results.data);
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Search failed: ${err.message}`);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* User Profile Section */}
      <section className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>
        {profile && (
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Phone:</strong> {profile.phone || "Not set"}
            </p>
            <p>
              <strong>Role:</strong> {profile.role}
            </p>
          </div>
        )}
      </section>

      {/* Salons Section */}
      <section className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">
          My Salons ({salons.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {salons.map((salon) => (
            <div
              key={salon.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg">{salon.name}</h3>
              <p className="text-gray-600 text-sm mt-2">{salon.address}</p>
              <p className="text-sm mt-2">
                <span
                  className={`px-2 py-1 rounded ${
                    salon.verified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {salon.verified ? "Verified" : "Pending"}
                </span>
              </p>
              <p className="text-sm mt-2 text-gray-500">
                {salon.staff.length} staff, {salon.services.length} services
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bookings Section */}
      <section className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Upcoming Bookings ({bookings.length})
        </h2>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border-l-4 border-blue-500 pl-4 py-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{booking.service.title}</h3>
                  <p className="text-sm text-gray-600">{booking.salon.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.startTime).toLocaleString()}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Featured Products ({products.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {product.images[0] && (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-lg font-bold text-blue-600 mt-2">
                  ₹{product.price}
                </p>
                <p className="text-sm text-gray-500">
                  {product.quantity} in stock
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* User's Cart */}
      {profile?.cart && (
        <section className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Shopping Cart ({profile.cart.cartItems.length} items)
          </h2>
          <div className="space-y-4">
            {profile.cart.cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b pb-4"
              >
                <div className="flex items-center gap-4">
                  {item.product.images[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{item.product.title}</h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-bold">₹{item.product.price}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Addresses */}
      {profile?.addresses && profile.addresses.length > 0 && (
        <section className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Saved Addresses ({profile.addresses.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.addresses.map((address) => (
              <div
                key={address.id}
                className={`border rounded-lg p-4 ${
                  address.isDefault ? "border-blue-500 border-2" : ""
                }`}
              >
                {address.isDefault && (
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded mb-2">
                    Default
                  </span>
                )}
                <h3 className="font-semibold">{address.fullName}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  {address.addressLine1}
                  {address.addressLine2 && `, ${address.addressLine2}`}
                </p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-sm text-gray-600">{address.country}</p>
                <p className="text-sm text-gray-500 mt-2">{address.phone}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ==========================================================
// Example of using the component in a page
// ==========================================================

/*

// app/dashboard/page.tsx
import ExampleDashboard from "@/components/ExampleDashboard";

export default function DashboardPage() {
  return <ExampleDashboard />;
}

*/
