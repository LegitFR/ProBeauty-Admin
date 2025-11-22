"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  RefreshCw,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  salon: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: "confirmed" | "pending" | "completed" | "cancelled" | "no-show";
  notes?: string;
  stylist: string;
  paymentStatus: "paid" | "pending" | "refunded";
}

interface CalendarDay {
  date: number;
  bookings: Booking[];
  isToday: boolean;
  isOtherMonth: boolean;
}

export function BookingManagement() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  const [bookings] = useState<Booking[]>([
    {
      id: "BK-2024-001",
      customerName: "Sarah Johnson",
      customerEmail: "sarah.j@email.com",
      customerPhone: "+1 (555) 123-4567",
      service: "Premium Facial Treatment",
      salon: "Luxury Spa Downtown",
      date: "2024-12-07",
      time: "14:00",
      duration: 90,
      price: 150,
      status: "confirmed",
      stylist: "Emma Martinez",
      paymentStatus: "paid",
      notes: "Customer prefers organic products only",
    },
    {
      id: "BK-2024-002",
      customerName: "Michael Chen",
      customerEmail: "m.chen@email.com",
      customerPhone: "+1 (555) 234-5678",
      service: "Hair Cut & Styling",
      salon: "Elite Beauty Salon",
      date: "2024-12-07",
      time: "10:30",
      duration: 60,
      price: 85,
      status: "completed",
      stylist: "Lisa Rodriguez",
      paymentStatus: "paid",
    },
    {
      id: "BK-2024-003",
      customerName: "Emma Williams",
      customerEmail: "emma.w@email.com",
      customerPhone: "+1 (555) 345-6789",
      service: "Manicure & Pedicure",
      salon: "Beauty Hub Central",
      date: "2024-12-07",
      time: "16:30",
      duration: 120,
      price: 95,
      status: "pending",
      stylist: "Sofia Gonzalez",
      paymentStatus: "pending",
      notes: "First-time customer, provide full consultation",
    },
    {
      id: "BK-2024-004",
      customerName: "David Brown",
      customerEmail: "d.brown@email.com",
      customerPhone: "+1 (555) 456-7890",
      service: "Beard Trim & Shave",
      salon: "Gentleman's Grooming",
      date: "2024-12-06",
      time: "15:00",
      duration: 45,
      price: 55,
      status: "cancelled",
      stylist: "Alex Thompson",
      paymentStatus: "refunded",
      notes: "Customer had to cancel due to emergency",
    },
    {
      id: "BK-2024-005",
      customerName: "Jennifer Davis",
      customerEmail: "j.davis@email.com",
      customerPhone: "+1 (555) 567-8901",
      service: "Color Treatment",
      salon: "Luxury Spa Downtown",
      date: "2024-12-08",
      time: "11:00",
      duration: 180,
      price: 220,
      status: "confirmed",
      stylist: "Emma Martinez",
      paymentStatus: "paid",
    },
    {
      id: "BK-2024-006",
      customerName: "Robert Wilson",
      customerEmail: "r.wilson@email.com",
      customerPhone: "+1 (555) 678-9012",
      service: "Deep Tissue Massage",
      salon: "Wellness Center Spa",
      date: "2024-12-07",
      time: "09:00",
      duration: 60,
      price: 120,
      status: "no-show",
      stylist: "Maria Garcia",
      paymentStatus: "pending",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "no-show":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return CheckCircle;
      case "completed":
        return CheckCircle;
      case "pending":
        return Clock;
      case "cancelled":
        return XCircle;
      case "no-show":
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.salon.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const todaysBookings = bookings.filter(
    (booking) => booking.date === "2024-12-07"
  );
  const confirmedToday = todaysBookings.filter(
    (b) => b.status === "confirmed"
  ).length;
  const completedToday = todaysBookings.filter(
    (b) => b.status === "completed"
  ).length;
  const pendingToday = todaysBookings.filter(
    (b) => b.status === "pending"
  ).length;
  const cancelledToday = todaysBookings.filter(
    (b) => b.status === "cancelled" || b.status === "no-show"
  ).length;

  const generateCalendarDays = (): CalendarDay[] => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const today = new Date();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: CalendarDay[] = [];

    // Add previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date: date.getDate(),
        bookings: [],
        isToday: false,
        isOtherMonth: true,
      });
    }

    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split("T")[0];
      const dayBookings = bookings.filter((b) => b.date === dateString);

      days.push({
        date: day,
        bookings: dayBookings,
        isToday: date.toDateString() === today.toDateString(),
        isOtherMonth: false,
      });
    }

    // Add next month days to complete the grid
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        date: day,
        bookings: [],
        isToday: false,
        isOtherMonth: true,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            Booking Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage appointments, schedules, and booking analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isNewBookingOpen} onOpenChange={setIsNewBookingOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 rounded-2xl">
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Booking</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input placeholder="Enter customer name" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="Enter email address" />
                </div>
                <div className="space-y-2">
                  <Label>Service</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facial">
                        Premium Facial Treatment
                      </SelectItem>
                      <SelectItem value="haircut">
                        Hair Cut & Styling
                      </SelectItem>
                      <SelectItem value="manicure">
                        Manicure & Pedicure
                      </SelectItem>
                      <SelectItem value="massage">
                        Deep Tissue Massage
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Salon</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select salon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="luxury">
                        Luxury Spa Downtown
                      </SelectItem>
                      <SelectItem value="elite">Elite Beauty Salon</SelectItem>
                      <SelectItem value="beauty">Beauty Hub Central</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Stylist</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stylist" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emma">Emma Martinez</SelectItem>
                      <SelectItem value="lisa">Lisa Rodriguez</SelectItem>
                      <SelectItem value="sofia">Sofia Gonzalez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Notes</Label>
                  <Textarea placeholder="Additional notes or special requests" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsNewBookingOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  Create Booking
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Today's Bookings
                </p>
                <p className="text-2xl font-bold">{todaysBookings.length}</p>
                <p className="text-xs text-green-600">+8% from yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedToday}</p>
                <p className="text-xs text-green-600">94% completion rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-xl">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingToday}</p>
                <p className="text-xs text-yellow-600">Awaiting confirmation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Revenue</p>
                <p className="text-2xl font-bold">$1,247</p>
                <p className="text-xs text-green-600">+12% from yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 rounded-2xl">
          <TabsTrigger value="calendar" className="rounded-xl">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="bookings" className="rounded-xl">
            <Users className="h-4 w-4 mr-2" />
            All Bookings
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-xl">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          {/* Calendar Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <Calendar className="h-5 w-5" />
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </CardTitle>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-xl">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("month")}
                      className={
                        viewMode === "month"
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                    >
                      Month
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("week")}
                      className={
                        viewMode === "week"
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                    >
                      Week
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("day")}
                      className={
                        viewMode === "day"
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                    >
                      Day
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth("prev")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth("next")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-3 text-center font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[120px] p-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                      day.isToday ? "bg-primary/10 border-primary" : ""
                    } ${day.isOtherMonth ? "opacity-50" : ""}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`text-sm font-medium ${
                          day.isToday ? "text-primary" : ""
                        }`}
                      >
                        {day.date}
                      </span>
                      {day.bookings.length > 0 && (
                        <Badge variant="secondary" className="text-xs h-5 px-1">
                          {day.bookings.length}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1">
                      {day.bookings.slice(0, 3).map((booking, idx) => (
                        <div
                          key={idx}
                          className={`text-xs p-1 rounded text-white truncate ${
                            booking.status === "confirmed"
                              ? "bg-blue-500"
                              : booking.status === "completed"
                              ? "bg-green-500"
                              : booking.status === "pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        >
                          {booking.time} - {booking.customerName}
                        </div>
                      ))}
                      {day.bookings.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{day.bookings.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bookings by customer, service, or salon..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="no-show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings List */}
          <Card>
            <CardHeader>
              <CardTitle>All Bookings ({filteredBookings.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-1 p-6">
                  {filteredBookings.map((booking, index) => {
                    const StatusIcon = getStatusIcon(booking.status);
                    return (
                      <div key={booking.id}>
                        <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                          <div
                            className={`p-2 rounded-xl ${getStatusColor(
                              booking.status
                            )
                              .replace("text-", "text-")
                              .replace("bg-", "bg-")}`}
                          >
                            <StatusIcon className="h-5 w-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="font-medium">
                                    {booking.customerName}
                                  </h4>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs rounded-full ${getStatusColor(
                                      booking.status
                                    )}`}
                                  >
                                    {booking.status}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {booking.date} at {booking.time}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {booking.service}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {booking.salon}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />$
                                    {booking.price}
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {booking.duration} min
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {booking.stylist}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {booking.customerPhone}
                                  </span>
                                </div>

                                {booking.notes && (
                                  <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted/30 rounded-lg">
                                    {booking.notes}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit3 className="h-4 w-4 mr-2" />
                                      Edit Booking
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Mail className="h-4 w-4 mr-2" />
                                      Send Reminder
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Cancel Booking
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < filteredBookings.length - 1 && (
                          <Separator className="my-2" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>This Week</span>
                    <span className="font-bold">127 bookings</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Last Week</span>
                    <span className="font-bold">118 bookings</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Growth Rate</span>
                    <Badge className="bg-green-100 text-green-800">+7.6%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Hair Cut & Styling</span>
                    <span className="font-bold">45 bookings</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Premium Facial</span>
                    <span className="font-bold">32 bookings</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Manicure & Pedicure</span>
                    <span className="font-bold">28 bookings</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Deep Tissue Massage</span>
                    <span className="font-bold">22 bookings</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
