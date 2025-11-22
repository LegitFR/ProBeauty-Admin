"use client";

import { useState } from "react";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Salon {
  id: string;
  name: string;
  owner: string;
  location: string;
  status: "active" | "pending" | "suspended";
  rating: number;
  totalBookings: number;
  revenue: number;
  commission: number;
  services: number;
  image: string;
  joinedDate: string;
}

const salonsData: Salon[] = [
  {
    id: "1",
    name: "Glamour Studio",
    owner: "Sarah Johnson",
    location: "New York, NY",
    status: "active",
    rating: 4.8,
    totalBookings: 1247,
    revenue: 125400,
    commission: 12540,
    services: 15,
    image: "/api/placeholder/40/40",
    joinedDate: "2023-01-15",
  },
  {
    id: "2",
    name: "Beauty Haven",
    owner: "Maria Rodriguez",
    location: "Los Angeles, CA",
    status: "active",
    rating: 4.9,
    totalBookings: 1891,
    revenue: 189400,
    commission: 18940,
    services: 22,
    image: "/api/placeholder/40/40",
    joinedDate: "2023-02-10",
  },
  {
    id: "3",
    name: "Elegant Touch",
    owner: "Jennifer Kim",
    location: "Chicago, IL",
    status: "pending",
    rating: 4.6,
    totalBookings: 876,
    revenue: 87600,
    commission: 8760,
    services: 12,
    image: "/api/placeholder/40/40",
    joinedDate: "2023-12-01",
  },
  {
    id: "4",
    name: "Style & Grace",
    owner: "Amanda Wilson",
    location: "Miami, FL",
    status: "active",
    rating: 4.7,
    totalBookings: 1034,
    revenue: 103400,
    commission: 10340,
    services: 18,
    image: "/api/placeholder/40/40",
    joinedDate: "2023-03-22",
  },
  {
    id: "5",
    name: "Urban Chic",
    owner: "David Chen",
    location: "Seattle, WA",
    status: "suspended",
    rating: 4.2,
    totalBookings: 567,
    revenue: 45200,
    commission: 4520,
    services: 8,
    image: "/api/placeholder/40/40",
    joinedDate: "2023-06-15",
  },
];

export function SalonManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const filteredSalons = salonsData.filter((salon) => {
    const matchesSearch =
      salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || salon.status === statusFilter;
    const matchesLocation =
      locationFilter === "all" || salon.location.includes(locationFilter);

    return matchesSearch && matchesStatus && matchesLocation;
  });

  const totalRevenue = salonsData.reduce(
    (sum, salon) => sum + salon.revenue,
    0
  );
  const totalCommission = salonsData.reduce(
    (sum, salon) => sum + salon.commission,
    0
  );
  const activeCount = salonsData.filter(
    (salon) => salon.status === "active"
  ).length;
  const avgRating =
    salonsData.reduce((sum, salon) => sum + salon.rating, 0) /
    salonsData.length;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Salon Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage and monitor your partner salons
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button className="bg-primary hover:bg-primary/90 rounded-2xl w-full sm:w-auto">
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
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Active Salons
                </p>
                <p className="text-xl sm:text-2xl font-bold">{activeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-xl">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Total Revenue
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  ${(totalRevenue / 1000).toFixed(0)}K
                </p>
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
                <p className="text-sm text-muted-foreground">
                  Commission Earned
                </p>
                <p className="text-2xl font-bold">
                  ${(totalCommission / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-xl">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Avg Rating
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {avgRating.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="New York">New York</SelectItem>
              <SelectItem value="Los Angeles">Los Angeles</SelectItem>
              <SelectItem value="Chicago">Chicago</SelectItem>
              <SelectItem value="Miami">Miami</SelectItem>
              <SelectItem value="Seattle">Seattle</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-2xl">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
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
                <TableHead>Rating</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSalons.map((salon) => (
                <TableRow key={salon.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={salon.image} alt={salon.name} />
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
                          {salon.owner}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{salon.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        salon.status === "active"
                          ? "default"
                          : salon.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className="rounded-full"
                    >
                      {salon.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{salon.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{salon.totalBookings.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      ${salon.revenue.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-green-600 font-medium">
                      ${salon.commission.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Salon
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Suspend
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredSalons.length} of {salonsData.length} salons
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled className="rounded-2xl">
            Previous
          </Button>
          <Button variant="outline" size="sm" className="rounded-2xl">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
