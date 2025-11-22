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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreHorizontal,
  Star,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Heart,
  Gift,
  MessageCircle,
  Eye,
  Edit,
  Ban,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  lastVisit: string;
  totalSpent: number;
  visits: number;
  status: "active" | "inactive" | "vip";
  rating: number;
  preferredSalon: string;
  avatar: string;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
}

const customersData: Customer[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 123-4567",
    joinDate: "2023-01-15",
    lastVisit: "2024-01-12",
    totalSpent: 2450,
    visits: 18,
    status: "vip",
    rating: 5,
    preferredSalon: "Glamour Studio",
    avatar: "/api/placeholder/40/40",
    tier: "Platinum",
  },
  {
    id: "2",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 (555) 234-5678",
    joinDate: "2023-03-22",
    lastVisit: "2024-01-14",
    totalSpent: 1890,
    visits: 14,
    status: "active",
    rating: 4.8,
    preferredSalon: "Beauty Haven",
    avatar: "/api/placeholder/40/40",
    tier: "Gold",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "m.brown@email.com",
    phone: "+1 (555) 345-6789",
    joinDate: "2023-05-10",
    lastVisit: "2024-01-10",
    totalSpent: 1200,
    visits: 9,
    status: "active",
    rating: 4.5,
    preferredSalon: "Style & Grace",
    avatar: "/api/placeholder/40/40",
    tier: "Silver",
  },
  {
    id: "4",
    name: "Jessica Wilson",
    email: "jessica.w@email.com",
    phone: "+1 (555) 456-7890",
    joinDate: "2023-07-08",
    lastVisit: "2023-12-20",
    totalSpent: 650,
    visits: 5,
    status: "inactive",
    rating: 4.2,
    preferredSalon: "Elegant Touch",
    avatar: "/api/placeholder/40/40",
    tier: "Bronze",
  },
  {
    id: "5",
    name: "David Martinez",
    email: "david.m@email.com",
    phone: "+1 (555) 567-8901",
    joinDate: "2023-09-15",
    lastVisit: "2024-01-13",
    totalSpent: 980,
    visits: 7,
    status: "active",
    rating: 4.6,
    preferredSalon: "Urban Chic",
    avatar: "/api/placeholder/40/40",
    tier: "Silver",
  },
];

export function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");

  const filteredCustomers = customersData.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;
    const matchesTier =
      tierFilter === "all" || customer.tier.toLowerCase() === tierFilter;

    return matchesSearch && matchesStatus && matchesTier;
  });

  const totalCustomers = customersData.length;
  const activeCustomers = customersData.filter(
    (c) => c.status === "active" || c.status === "vip"
  ).length;
  const vipCustomers = customersData.filter((c) => c.status === "vip").length;
  const avgSpent =
    customersData.reduce((sum, c) => sum + c.totalSpent, 0) / totalCustomers;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return "bg-purple-100 text-purple-700";
      case "Gold":
        return "bg-yellow-100 text-yellow-700";
      case "Silver":
        return "bg-gray-100 text-gray-700";
      case "Bronze":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vip":
        return "bg-purple-100 text-purple-700";
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer relationships and analyze customer behavior
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 rounded-2xl">
          Add New Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">
                  {totalCustomers.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Active Customers
                </p>
                <p className="text-2xl font-bold">{activeCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Heart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">VIP Customers</p>
                <p className="text-2xl font-bold">{vipCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-xl">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg Customer Value
                </p>
                <p className="text-2xl font-bold">${avgSpent.toFixed(0)}</p>
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
              placeholder="Search customers by name, email, or phone..."
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
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="platinum">Platinum</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="bronze">Bronze</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-2xl">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg">Customer Lifecycle</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">New Customers</span>
                <Badge variant="default" className="rounded-full">
                  +23
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Returning Customers</span>
                <Badge variant="secondary" className="rounded-full">
                  156
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">At Risk</span>
                <Badge variant="destructive" className="rounded-full">
                  12
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Churned</span>
                <Badge variant="outline" className="rounded-full">
                  8
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg">Popular Services</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Hair Cut & Style</span>
                <span className="text-sm font-medium">342 bookings</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Hair Coloring</span>
                <span className="text-sm font-medium">289 bookings</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Manicure/Pedicure</span>
                <span className="text-sm font-medium">267 bookings</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Facial Treatment</span>
                <span className="text-sm font-medium">198 bookings</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg">Support Tickets</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Open Tickets</span>
                </div>
                <Badge variant="default" className="rounded-full">
                  7
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Pending Response</span>
                </div>
                <Badge variant="secondary" className="rounded-full">
                  3
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Resolved Today</span>
                </div>
                <Badge variant="outline" className="rounded-full">
                  12
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Visits</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={customer.avatar} alt={customer.name} />
                      <AvatarFallback>
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.preferredSalon}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`rounded-full ${getStatusColor(
                      customer.status
                    )}`}
                    variant="secondary"
                  >
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`rounded-full ${getTierColor(customer.tier)}`}
                    variant="secondary"
                  >
                    {customer.tier}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    ${customer.totalSpent.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <span>{customer.visits} visits</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{customer.lastVisit}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>{customer.rating}</span>
                  </div>
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
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Customer
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Ban className="mr-2 h-4 w-4" />
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredCustomers.length} of {customersData.length} customers
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
