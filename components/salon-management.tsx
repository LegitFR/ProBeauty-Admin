"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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
  Search,
  Filter,
  MoreHorizontal,
  Star,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Phone,
  Tag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { SalonAPI, OfferAPI } from "@/lib/services";
import { ApiError } from "@/lib/utils/apiClient";
import type { Salon as APISalon, PaginationResponse } from "@/lib/types/api";
import type { Offer } from "@/lib/types/offer";
import { AuthErrorMessage } from "./AuthErrorMessage";
import { toast } from "sonner";

export function SalonManagement() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "pending"
  >("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // API State
  const [salons, setSalons] = useState<APISalon[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [allSalonsStats, setAllSalonsStats] = useState<{
    total: number;
    active: number;
    pending: number;
    totalServices: number;
  }>({ total: 0, active: 0, pending: 0, totalServices: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationResponse>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);

  // Delete/Suspend Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState<APISalon | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch overall stats once on mount and when status filter changes
  useEffect(() => {
    fetchAllSalonsStats();
    fetchOffers();
  }, [statusFilter]);

  // Fetch paginated salons when page changes
  useEffect(() => {
    fetchSalons();
  }, [currentPage, statusFilter]);

  // Reset to page 1 when status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const fetchAllSalonsStats = async () => {
    try {
      // Fetch all salons for statistics (with high limit)
      const params: any = {
        page: 1,
        limit: 1000, // Get all salons for stats
      };

      // Add verified filter based on status
      if (statusFilter === "active") {
        params.verified = true;
      } else if (statusFilter === "pending") {
        params.verified = false;
      }

      const response = await SalonAPI.getSalons(params);

      // Calculate stats from all salons
      const allSalons = response.data;
      setAllSalonsStats({
        total: response.pagination?.total || allSalons.length,
        active: allSalons.filter((s) => s.verified).length,
        pending: allSalons.filter((s) => !s.verified).length,
        totalServices: allSalons.reduce(
          (sum, s) => sum + (s.services?.length || 0),
          0,
        ),
      });
    } catch (err) {
      console.error("Failed to fetch salon stats:", err);
    }
  };

  const fetchSalons = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsAuthError(false);

      const params: any = {
        page: currentPage,
        limit: 10,
      };

      // Add verified filter based on status
      if (statusFilter === "active") {
        params.verified = true;
      } else if (statusFilter === "pending") {
        params.verified = false;
      }

      const response = await SalonAPI.getSalons(params);
      setSalons(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setIsAuthError(true);
        }
        setError(err.message);
      } else {
        setError("Failed to load salons data");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await OfferAPI.getActiveOffers();
      console.log("Fetched offers:", response);
      setOffers(response.data);
    } catch (err) {
      console.error("Failed to fetch offers:", err);
    }
  };

  const handleViewSalon = (salonId: string) => {
    router.push(`/dashboard/salons/${salonId}`);
  };

  const handleEditSalon = (salon: APISalon) => {
    // Navigate to edit page or open edit dialog
    router.push(`/dashboard/salons/${salon.id}/edit`);
  };

  const handleDeleteSalon = async () => {
    if (!selectedSalon) return;

    setActionLoading(true);
    try {
      await SalonAPI.deleteSalon(selectedSalon.id);
      toast.success(`${selectedSalon.name} has been deleted successfully`);
      setDeleteDialogOpen(false);
      setSelectedSalon(null);
      // Refresh both the list and stats
      fetchSalons();
      fetchAllSalonsStats();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to delete salon");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveSalon = async (salon: APISalon) => {
    try {
      await SalonAPI.updateSalon(salon.id, { verified: true });
      toast.success(`${salon.name} has been approved successfully`);
      // Refresh both the list and stats
      fetchSalons();
      fetchAllSalonsStats();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to approve salon");
      }
    }
  };

  const openDeleteDialog = (salon: APISalon) => {
    setSelectedSalon(salon);
    setDeleteDialogOpen(true);
  };

  // Extract unique locations for filter
  const uniqueLocations = Array.from(
    new Set(
      salons
        .map((s) => {
          // Extract city from address
          const addressParts = s.address.split(",");
          return addressParts.length >= 2
            ? addressParts[addressParts.length - 2].trim()
            : "";
        })
        .filter(Boolean),
    ),
  );

  // Filter salons based on search and filters
  const filteredSalons = salons.filter((salon) => {
    const matchesSearch =
      salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (salon.owner?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      salon.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && salon.verified) ||
      (statusFilter === "pending" && !salon.verified);

    const matchesLocation =
      locationFilter === "all" || salon.address.includes(locationFilter);

    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Calculate statistics from all salons data
  const stats = {
    active: allSalonsStats.active,
    pending: allSalonsStats.pending,
    total: allSalonsStats.total,
    totalServices: allSalonsStats.totalServices,
    avgServicesPerSalon:
      allSalonsStats.total > 0
        ? (allSalonsStats.totalServices / allSalonsStats.total).toFixed(1)
        : "0",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading salons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    if (isAuthError) {
      return <AuthErrorMessage onRetry={fetchSalons} />;
    }
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchSalons}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Salon Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage and monitor your partner salons ({stats.total} total,{" "}
            {stats.active} active, {stats.pending} pending)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            onClick={() => router.push("/dashboard/salons/new")}
            className="bg-primary hover:bg-primary/90 rounded-2xl w-full sm:w-auto"
          >
            Add New Salon
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-green-100 rounded-xl">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Active Salons
                </p>
                <p className="text-xl sm:text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-xl">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Pending Verification
                </p>
                <p className="text-xl sm:text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-xl">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Total Salons
                </p>
                <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-purple-100 rounded-xl">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Avg Services
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {stats.avgServicesPerSalon}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salon Offers Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Salon Offers
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Active promotional offers across all salons
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {offers.length === 0 ? (
            <div className="py-8 text-center">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No offers available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers
                .filter((offer) => offer.offerType === "salon")
                .slice(0, 6)
                .map((offer) => (
                  <Card key={offer.id} className="border">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{offer.title}</h4>
                          {offer.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {offer.description}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={offer.isActive ? "default" : "secondary"}
                        >
                          {offer.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Discount
                          </p>
                          <p className="text-lg font-bold text-primary">
                            {offer.discountType === "percentage"
                              ? `${offer.discountValue}% OFF`
                              : `€${parseFloat(offer.discountValue).toFixed(2)} OFF`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div>
                          <p>Valid from</p>
                          <p className="font-medium">
                            {new Date(offer.startsAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p>Valid until</p>
                          <p className="font-medium">
                            {new Date(offer.endsAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {offer.salon && (
                        <div className="pt-2 border-t flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {offer.salon.name}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
          {offers.filter((offer) => offer.offerType === "salon").length > 6 && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View All Offers
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search salons, owners, or locations..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {uniqueLocations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Salons Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Salon</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSalons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchTerm ||
                      statusFilter !== "all" ||
                      locationFilter !== "all"
                        ? "No salons found matching your filters"
                        : "No salons available"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSalons.map((salon) => (
                  <TableRow key={salon.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={salon.thumbnail || undefined}
                            alt={salon.name}
                          />
                          <AvatarFallback>
                            {salon.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{salon.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {salon.owner?.name || "Unknown Owner"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm max-w-[200px] truncate">
                          {salon.address}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={salon.verified ? "default" : "secondary"}
                        className="rounded-full"
                      >
                        {salon.verified ? "Active" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{salon.phone || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>{salon.services?.length || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(salon.createdAt).toLocaleDateString()}
                      </span>
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
                            onClick={() => handleViewSalon(salon.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditSalon(salon)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Salon
                          </DropdownMenuItem>
                          {!salon.verified && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-green-600"
                                onClick={() => handleApproveSalon(salon)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve Salon
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => openDeleteDialog(salon)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Salon
                          </DropdownMenuItem>
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

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * 10 + 1}-
          {Math.min(currentPage * 10, pagination.total)} of {pagination.total}{" "}
          salons
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1 || loading}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="rounded-2xl"
          >
            Previous
          </Button>
          <div className="flex items-center gap-2 px-3">
            <span className="text-sm">
              Page {currentPage} of {pagination.totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= pagination.totalPages || loading}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="rounded-2xl"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Salon</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedSalon?.name}</strong>? This action cannot be
              undone and will remove all associated data including services,
              staff, and bookings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSalon}
              disabled={actionLoading}
            >
              {actionLoading ? "Deleting..." : "Delete Salon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
