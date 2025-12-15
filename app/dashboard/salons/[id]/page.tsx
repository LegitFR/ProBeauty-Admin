"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Star,
  DollarSign,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";
import { SalonAPI } from "@/lib/services";
import { ApiError } from "@/lib/utils/apiClient";
import type { Salon as APISalon } from "@/lib/types/api";
import { AuthErrorMessage } from "@/components/AuthErrorMessage";

export default function SalonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const salonId = params.id as string;

  const [salon, setSalon] = useState<APISalon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);

  useEffect(() => {
    fetchSalonDetails();
  }, [salonId]);

  const fetchSalonDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsAuthError(false);

      const response = await SalonAPI.getSalonById(salonId);
      setSalon(response.data);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setIsAuthError(true);
        }
        setError(err.message);
      } else {
        setError("Failed to load salon details");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading salon details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    if (isAuthError) {
      return (
        <div className="p-4 sm:p-6">
          <AuthErrorMessage onRetry={fetchSalonDetails} />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchSalonDetails}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <p className="text-muted-foreground">Salon not found</p>
          <Button
            onClick={() => router.push("/dashboard/salons")}
            className="mt-4"
          >
            Back to Salons
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/salons")}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Salons
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                {salon.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                {salon.verified ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <Badge variant="default" className="bg-green-600">
                      Verified
                    </Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-yellow-600" />
                    <Badge variant="secondary">Pending Verification</Badge>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" className="flex-1 sm:flex-none">
                <Trash2 className="mr-2 h-4 w-4" />
                Suspend
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <MapPin className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Address
                    </label>
                    <p className="text-base">
                      {salon.address || "No address provided"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">
                      Owner ID
                    </label>
                    <p className="text-sm font-mono break-all">
                      {salon.ownerId || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">
                      Venue Type
                    </label>
                    <p className="text-base capitalize">
                      {salon.venueType || "N/A"}
                    </p>
                  </div>
                  {salon.geo ? (
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Coordinates
                      </label>
                      <p className="text-sm">
                        {salon.geo.latitude.toFixed(6)},{" "}
                        {salon.geo.longitude.toFixed(6)}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Coordinates
                      </label>
                      <p className="text-sm text-muted-foreground">
                        No location coordinates available
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            {salon.hours && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Clock className="h-5 w-5" />
                    Operating Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(salon.hours).map(([day, hours]) => (
                      <div
                        key={day}
                        className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
                      >
                        <span className="font-medium capitalize">{day}</span>
                        <span className="text-sm">
                          {typeof hours === "object" &&
                          hours &&
                          "open" in hours &&
                          "close" in hours
                            ? `${hours.open} - ${hours.close}`
                            : "Closed"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Staff Members */}
            {salon.staff && salon.staff.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Users className="h-5 w-5" />
                    Staff Members ({salon.staff.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salon.staff.map((staff) => (
                      <div
                        key={staff.id}
                        className="p-4 border rounded-lg space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="text-sm">
                              {staff.user?.name?.[0] || "S"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold truncate">
                              {staff.user?.name || "Unknown"}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {staff.user?.email || "N/A"}
                            </p>
                          </div>
                        </div>

                        {staff.availability && (
                          <div>
                            <p className="text-sm font-medium mb-2">
                              Weekly Availability:
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                              {Object.entries(staff.availability).map(
                                ([day, avail]) => (
                                  <div
                                    key={day}
                                    className="text-xs p-2 bg-muted rounded flex flex-col"
                                  >
                                    <span className="font-medium capitalize truncate">
                                      {day}
                                    </span>
                                    {typeof avail === "object" &&
                                    avail &&
                                    "isAvailable" in avail ? (
                                      avail.isAvailable ? (
                                        <span className="text-green-600">
                                          Available
                                        </span>
                                      ) : (
                                        <span className="text-muted-foreground">
                                          Off
                                        </span>
                                      )
                                    ) : (
                                      <span className="text-muted-foreground">
                                        Off
                                      </span>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            {salon.services && salon.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Star className="h-5 w-5" />
                    Services ({salon.services.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {salon.services.map((service) => (
                      <div
                        key={service.id}
                        className="p-4 border rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">
                            {service.name || service.title || "Service"}
                          </p>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <p className="font-bold text-lg">${service.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Products */}
            {salon.products && salon.products.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <DollarSign className="h-5 w-5" />
                    Products ({salon.products.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {salon.products.map((product) => (
                      <div key={product.id} className="p-4 border rounded-lg">
                        <p className="font-semibold">{product.title}</p>
                        <div className="flex justify-between items-center mt-3">
                          <p className="font-bold">${product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-4 sm:space-y-6">
            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Calendar className="h-5 w-5" />
                  Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Salon ID
                  </label>
                  <p className="text-xs font-mono break-all">{salon.id}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Owner ID
                  </label>
                  <p className="text-xs font-mono break-all">{salon.ownerId}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Created At
                  </label>
                  <p className="text-sm">
                    {new Date(salon.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </label>
                  <p className="text-sm">
                    {new Date(salon.updatedAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Staff Count
                  </span>
                  <span className="font-bold">{salon.staff?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Services
                  </span>
                  <span className="font-bold">
                    {salon.services?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Products
                  </span>
                  <span className="font-bold">
                    {salon.products?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={salon.verified ? "default" : "secondary"}>
                    {salon.verified ? "Active" : "Pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
