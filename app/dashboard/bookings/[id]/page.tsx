"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  User,
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { BookingAPI, ApiError } from "@/lib/services";
import type { Booking } from "@/lib/types/api";
import { toast } from "sonner";

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await BookingAPI.getBookingById(bookingId);
      setBooking(response.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.status === 404) {
          toast.error("Booking not found");
        }
      } else {
        setError("Failed to load booking details");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-blue-100 text-blue-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            Confirmed
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        );
      case "PENDING":
      default:
        return (
          <Badge variant="secondary">
            <AlertCircle className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading booking details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="space-y-4 p-4 sm:p-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/bookings")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Button>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">
              {error || "Booking not found"}
            </p>
            <Button onClick={() => router.push("/dashboard/bookings")}>
              Return to Bookings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/bookings")}
            size="icon"
            className="rounded-2xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Booking Details</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Booking ID: {booking.id}
            </p>
          </div>
        </div>
        {getStatusBadge(booking.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={booking.user?.profilePicture || undefined}
                  />
                  <AvatarFallback>
                    {booking.user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-base sm:text-lg">
                    {booking.user?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.user?.email || "No email"}
                  </p>
                </div>
              </div>
              {booking.user?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.user.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Salon Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Salon Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={booking.salon?.thumbnail || undefined} />
                  <AvatarFallback>
                    {booking.salon?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "S"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-base sm:text-lg">
                    {booking.salon?.name || "Unknown Salon"}
                  </p>
                  {booking.salon?.verified && (
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              {booking.salon?.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="break-words">{booking.salon.address}</span>
                </div>
              )}
              {booking.salon?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.salon.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {booking.service?.title || "Unknown Service"}
                </h3>
                {booking.service?.description && (
                  <p className="text-sm text-muted-foreground">
                    {booking.service.description}
                  </p>
                )}
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {booking.service?.durationMinutes || 0} minutes
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium text-lg flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {booking.service?.price || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {new Date(booking.startTime).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="font-medium">
                    {new Date(booking.startTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(booking.endTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                {getStatusBadge(booking.status)}
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Total Amount</span>
                <span className="text-xl font-bold text-primary flex items-center gap-1">
                  <DollarSign className="h-5 w-5" />
                  {booking.service?.price || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Booking Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Created At</p>
                <p className="font-medium">
                  {booking.createdAt
                    ? new Date(booking.createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {booking.updatedAt
                    ? new Date(booking.updatedAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => router.push("/dashboard/bookings")}
              >
                Back to All Bookings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
