"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Ban,
  DollarSign,
  TrendingUp,
  Users,
  Activity,
  MapPin,
} from "lucide-react";
import { BookingAPI, AnalyticsAPI } from "@/lib/services";
import { ApiError } from "@/lib/utils/apiClient";
import type { Booking, BookingStatus } from "@/lib/types/api";
import { AuthErrorMessage } from "./AuthErrorMessage";
import { toast } from "sonner";

export function BookingManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all",
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // API State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);
  const [serviceRevenue, setServiceRevenue] = useState<number>(0);
  const [totalBookingsCount, setTotalBookingsCount] = useState<number>(0);

  // Dialog States
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionType, setActionType] = useState<
    "confirm" | "complete" | "cancel" | null
  >(null);
  const [actionLoading, setActionLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, startDate, endDate]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Fetch analytics for revenue
        const analyticsResponse = await AnalyticsAPI.getAdminAnalytics({
          period: "monthly",
        });
        setServiceRevenue(
          parseFloat(analyticsResponse.data?.summary?.serviceRevenue || "0"),
        );

        // Fetch all bookings to get accurate total count
        const allBookingsResponse = await BookingAPI.getBookings({});
        setTotalBookingsCount(allBookingsResponse.data.length);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
      }
    };
    fetchAnalyticsData();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsAuthError(false);

      const params: any = {};

      if (statusFilter && statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (startDate) {
        params.startDate = new Date(startDate).toISOString();
      }

      if (endDate) {
        params.endDate = new Date(endDate).toISOString();
      }

      const response = await BookingAPI.getBookings(params);
      setBookings(response.data);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setIsAuthError(true);
        }
        setError(err.message);
      } else {
        setError("Failed to load bookings data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (
    booking: Booking,
    action: "confirm" | "complete" | "cancel",
  ) => {
    setSelectedBooking(booking);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleActionConfirm = async () => {
    if (!selectedBooking || !actionType) return;

    setActionLoading(true);
    try {
      switch (actionType) {
        case "confirm":
          await BookingAPI.confirmBooking(selectedBooking.id);
          toast.success("Booking confirmed successfully");
          break;
        case "complete":
          await BookingAPI.completeBooking(selectedBooking.id);
          toast.success("Booking marked as completed");
          break;
        case "cancel":
          await BookingAPI.cancelBooking(selectedBooking.id);
          toast.success("Booking cancelled successfully");
          break;
      }

      fetchBookings();
      setActionDialogOpen(false);
      setSelectedBooking(null);
      setActionType(null);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error(`Failed to ${actionType} booking`);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = (booking: Booking) => {
    router.push(`/dashboard/bookings/${booking.id}`);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.salon?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    cancelled: bookings.filter(
      (b) => b.status === "CANCELLED" || b.status === "NO_SHOW",
    ).length,
    totalRevenue: serviceRevenue,
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return "default";
      case "COMPLETED":
        return "default";
      case "PENDING":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      case "NO_SHOW":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    if (isAuthError) {
      return <AuthErrorMessage onRetry={fetchBookings} />;
    }
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchBookings}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Booking Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage and monitor all salon appointments ({totalBookingsCount}{" "}
            total)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-xl">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Confirmed
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {stats.confirmed}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-green-100 rounded-xl">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Completed
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {stats.completed}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-xl">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Pending
                </p>
                <p className="text-xl sm:text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-red-100 rounded-xl">
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Cancelled
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {stats.cancelled}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-purple-100 rounded-xl">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Revenue
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {new Intl.NumberFormat("en-DE", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  }).format(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer, service, or salon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value: any) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="NO_SHOW">No Show</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full md:w-40"
            placeholder="Start Date"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full md:w-40"
            placeholder="End Date"
          />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Salon</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== "all"
                        ? "No bookings found matching your filters"
                        : "No bookings available"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {booking.user?.name || "Unknown"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.user?.phone || "No phone"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm max-w-[150px] truncate">
                          {booking.salon?.name || "Unknown"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {booking.service?.title || "Unknown Service"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.service?.durationMinutes || 0} min
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm">
                            {formatDate(booking.startTime)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(booking.startTime)} -{" "}
                            {formatTime(booking.endTime)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {booking.staff?.user?.name || "Not Assigned"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {new Intl.NumberFormat("en-DE", {
                          style: "currency",
                          currency: "EUR",
                        }).format(parseFloat(booking.service?.price || "0"))}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusColor(booking.status)}
                        className="rounded-full"
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(booking)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {booking.status === "PENDING" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleActionClick(booking, "confirm")
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Confirm Booking
                            </DropdownMenuItem>
                          )}
                          {booking.status === "CONFIRMED" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleActionClick(booking, "complete")
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Complete
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {booking.status !== "CANCELLED" &&
                            booking.status !== "COMPLETED" && (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  handleActionClick(booking, "cancel")
                                }
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Cancel Booking
                              </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "confirm" && "Confirm Booking"}
              {actionType === "complete" && "Complete Booking"}
              {actionType === "cancel" && "Cancel Booking"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "confirm" &&
                `Are you sure you want to confirm this booking for ${selectedBooking?.user?.name}?`}
              {actionType === "complete" &&
                `Are you sure you want to mark this booking as completed? This action cannot be undone.`}
              {actionType === "cancel" &&
                `Are you sure you want to cancel this booking? The customer will be notified.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleActionConfirm} disabled={actionLoading}>
              {actionLoading ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
