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
import { Progress } from "./ui/progress";
import {
  AlertTriangle,
  MessageSquare,
  User,
  Clock,
  DollarSign,
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  CheckCircle,
  XCircle,
  ArrowRight,
  Mail,
  Phone,
  Calendar,
  Tag,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  RefreshCw,
  Download,
  Star,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Users,
  CreditCard,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Dispute {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subject: string;
  description: string;
  category:
    | "service_quality"
    | "billing"
    | "booking_issue"
    | "refund_request"
    | "staff_behavior"
    | "facility_concern"
    | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status:
    | "open"
    | "in_progress"
    | "pending_customer"
    | "resolved"
    | "closed"
    | "escalated";
  assignedTo: string;
  salon: string;
  bookingId?: string;
  amountInvolved?: number;
  createdDate: string;
  lastUpdate: string;
  resolutionDate?: string;
  customerSatisfaction?: number;
  messages: DisputeMessage[];
  attachments: string[];
  tags: string[];
}

interface DisputeMessage {
  id: string;
  sender: "customer" | "agent" | "system";
  senderName: string;
  message: string;
  timestamp: string;
  isInternal: boolean;
}

interface DisputeAgent {
  id: string;
  name: string;
  email: string;
  department: string;
  activeDisputes: number;
  resolvedDisputes: number;
  avgResolutionTime: number;
  customerRating: number;
  specialties: string[];
}

export function DisputeManagement() {
  const [activeTab, setActiveTab] = useState("disputes");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isNewDisputeOpen, setIsNewDisputeOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);

  const [disputes] = useState<Dispute[]>([
    {
      id: "DSP-001",
      ticketNumber: "TK-2024-00341",
      customerName: "Sarah Johnson",
      customerEmail: "sarah.j@email.com",
      customerPhone: "+1 (555) 123-4567",
      subject: "Unsatisfactory facial treatment results",
      description:
        "The premium facial treatment did not meet expectations. Skin appeared irritated after the session and no visible improvement was noticed. Requesting partial refund.",
      category: "service_quality",
      priority: "high",
      status: "in_progress",
      assignedTo: "Emma Martinez",
      salon: "Luxury Spa Downtown",
      bookingId: "BK-2024-001",
      amountInvolved: 150.0,
      createdDate: "2024-12-05",
      lastUpdate: "2024-12-07 10:30",
      customerSatisfaction: undefined,
      messages: [
        {
          id: "MSG-001",
          sender: "customer",
          senderName: "Sarah Johnson",
          message:
            "I had a premium facial treatment yesterday and I'm very disappointed with the results. My skin looks worse than before and I experienced irritation.",
          timestamp: "2024-12-05 14:20",
          isInternal: false,
        },
        {
          id: "MSG-002",
          sender: "agent",
          senderName: "Emma Martinez",
          message:
            "I'm sorry to hear about your experience. I've reviewed your booking and would like to schedule a follow-up appointment to assess the situation. We take all service quality concerns seriously.",
          timestamp: "2024-12-05 16:45",
          isInternal: false,
        },
        {
          id: "MSG-003",
          sender: "customer",
          senderName: "Sarah Johnson",
          message:
            "I appreciate the response but I would prefer a refund at this point. The treatment caused more harm than good.",
          timestamp: "2024-12-06 09:15",
          isInternal: false,
        },
      ],
      attachments: ["before_after_photos.jpg", "medical_note.pdf"],
      tags: ["facial_treatment", "skin_irritation", "refund_request"],
    },
    {
      id: "DSP-002",
      ticketNumber: "TK-2024-00342",
      customerName: "Michael Chen",
      customerEmail: "m.chen@email.com",
      customerPhone: "+1 (555) 234-5678",
      subject: "Incorrect billing for canceled appointment",
      description:
        "I was charged $85 for an appointment that was canceled 48 hours in advance according to the cancellation policy. The charge should be reversed.",
      category: "billing",
      priority: "medium",
      status: "pending_customer",
      assignedTo: "Lisa Rodriguez",
      salon: "Elite Beauty Salon",
      bookingId: "BK-2024-045",
      amountInvolved: 85.0,
      createdDate: "2024-12-06",
      lastUpdate: "2024-12-07 14:15",
      customerSatisfaction: undefined,
      messages: [
        {
          id: "MSG-004",
          sender: "customer",
          senderName: "Michael Chen",
          message:
            "I canceled my appointment 48 hours in advance but was still charged. This is against your cancellation policy.",
          timestamp: "2024-12-06 11:30",
          isInternal: false,
        },
        {
          id: "MSG-005",
          sender: "agent",
          senderName: "Lisa Rodriguez",
          message:
            "Thank you for bringing this to our attention. I'm investigating the cancellation timestamp and payment processing. Could you please provide the confirmation email for the cancellation?",
          timestamp: "2024-12-06 15:20",
          isInternal: false,
        },
      ],
      attachments: ["cancellation_email.pdf"],
      tags: ["billing_error", "cancellation_policy", "refund"],
    },
    {
      id: "DSP-003",
      ticketNumber: "TK-2024-00343",
      customerName: "Emma Williams",
      customerEmail: "emma.w@email.com",
      customerPhone: "+1 (555) 345-6789",
      subject: "Unprofessional staff behavior during appointment",
      description:
        "The stylist was rude and dismissive during my appointment. Made inappropriate comments about my hair and overall unprofessional conduct.",
      category: "staff_behavior",
      priority: "urgent",
      status: "escalated",
      assignedTo: "Sofia Gonzalez",
      salon: "Beauty Hub Central",
      bookingId: "BK-2024-067",
      amountInvolved: 95.0,
      createdDate: "2024-12-04",
      lastUpdate: "2024-12-07 09:45",
      customerSatisfaction: undefined,
      messages: [
        {
          id: "MSG-006",
          sender: "customer",
          senderName: "Emma Williams",
          message:
            "I had a terrible experience with the stylist today. They were very rude and made inappropriate comments. This is unacceptable behavior.",
          timestamp: "2024-12-04 17:30",
          isInternal: false,
        },
        {
          id: "MSG-007",
          sender: "system",
          senderName: "System",
          message:
            "Case escalated to management due to staff behavior concerns.",
          timestamp: "2024-12-05 08:00",
          isInternal: true,
        },
      ],
      attachments: [],
      tags: [
        "staff_conduct",
        "management_escalation",
        "professional_standards",
      ],
    },
    {
      id: "DSP-004",
      ticketNumber: "TK-2024-00344",
      customerName: "David Brown",
      customerEmail: "d.brown@email.com",
      customerPhone: "+1 (555) 456-7890",
      subject: "Facility cleanliness concerns",
      description:
        "The facility appeared unclean during my visit. Equipment was not properly sanitized and overall hygiene standards were below expectations.",
      category: "facility_concern",
      priority: "high",
      status: "open",
      assignedTo: "Alex Thompson",
      salon: "Gentleman's Grooming",
      bookingId: "BK-2024-089",
      createdDate: "2024-12-07",
      lastUpdate: "2024-12-07 11:20",
      customerSatisfaction: undefined,
      messages: [
        {
          id: "MSG-008",
          sender: "customer",
          senderName: "David Brown",
          message:
            "I'm concerned about the cleanliness standards at your facility. The equipment didn't appear to be properly sanitized.",
          timestamp: "2024-12-07 11:20",
          isInternal: false,
        },
      ],
      attachments: ["facility_photos.jpg"],
      tags: ["hygiene", "sanitization", "facility_standards"],
    },
    {
      id: "DSP-005",
      ticketNumber: "TK-2024-00340",
      customerName: "Jennifer Davis",
      customerEmail: "j.davis@email.com",
      customerPhone: "+1 (555) 567-8901",
      subject: "Color treatment damaged hair",
      description:
        "The color treatment severely damaged my hair. It became brittle and started breaking. I need compensation for repair treatments.",
      category: "service_quality",
      priority: "high",
      status: "resolved",
      assignedTo: "Emma Martinez",
      salon: "Luxury Spa Downtown",
      bookingId: "BK-2024-012",
      amountInvolved: 220.0,
      createdDate: "2024-11-28",
      lastUpdate: "2024-12-03 16:30",
      resolutionDate: "2024-12-03",
      customerSatisfaction: 4,
      messages: [
        {
          id: "MSG-009",
          sender: "customer",
          senderName: "Jennifer Davis",
          message:
            "The color treatment has severely damaged my hair. I need help with repair treatments.",
          timestamp: "2024-11-28 13:45",
          isInternal: false,
        },
        {
          id: "MSG-010",
          sender: "agent",
          senderName: "Emma Martinez",
          message:
            "We sincerely apologize for this experience. We're providing a full refund and covering the cost of professional hair repair treatments at our partner salon.",
          timestamp: "2024-12-01 10:20",
          isInternal: false,
        },
      ],
      attachments: ["hair_damage_photos.jpg", "repair_treatment_quote.pdf"],
      tags: ["hair_damage", "color_treatment", "compensation", "resolved"],
    },
  ]);

  const [agents] = useState<DisputeAgent[]>([
    {
      id: "AGT-001",
      name: "Emma Martinez",
      email: "emma.m@probeauty.com",
      department: "Customer Service",
      activeDisputes: 8,
      resolvedDisputes: 127,
      avgResolutionTime: 2.3,
      customerRating: 4.8,
      specialties: ["Service Quality", "Refunds", "Technical Issues"],
    },
    {
      id: "AGT-002",
      name: "Lisa Rodriguez",
      email: "lisa.r@probeauty.com",
      department: "Billing Support",
      activeDisputes: 5,
      resolvedDisputes: 89,
      avgResolutionTime: 1.8,
      customerRating: 4.6,
      specialties: ["Billing", "Payment Issues", "Refunds"],
    },
    {
      id: "AGT-003",
      name: "Sofia Gonzalez",
      email: "sofia.g@probeauty.com",
      department: "Escalations",
      activeDisputes: 3,
      resolvedDisputes: 234,
      avgResolutionTime: 3.2,
      customerRating: 4.9,
      specialties: ["Staff Issues", "Management Escalations", "Complex Cases"],
    },
    {
      id: "AGT-004",
      name: "Alex Thompson",
      email: "alex.t@probeauty.com",
      department: "Quality Assurance",
      activeDisputes: 6,
      resolvedDisputes: 156,
      avgResolutionTime: 2.7,
      customerRating: 4.7,
      specialties: [
        "Facility Standards",
        "Health & Safety",
        "Policy Violations",
      ],
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending_customer":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "escalated":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "service_quality":
        return Star;
      case "billing":
        return CreditCard;
      case "booking_issue":
        return Calendar;
      case "refund_request":
        return DollarSign;
      case "staff_behavior":
        return Users;
      case "facility_concern":
        return Shield;
      default:
        return AlertTriangle;
    }
  };

  const filteredDisputes = disputes.filter((dispute) => {
    const matchesSearch =
      dispute.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || dispute.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || dispute.priority === priorityFilter;
    const matchesCategory =
      categoryFilter === "all" || dispute.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const totalDisputes = disputes.length;
  const openDisputes = disputes.filter((d) =>
    ["open", "in_progress", "escalated"].includes(d.status)
  ).length;
  const resolvedDisputes = disputes.filter(
    (d) => d.status === "resolved"
  ).length;
  const avgResolutionTime = 2.4;
  const customerSatisfactionAvg = 4.3;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-primary" />
            Dispute Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Handle customer disputes, complaints, and resolution tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={isNewDisputeOpen} onOpenChange={setIsNewDisputeOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 rounded-2xl">
                <Plus className="h-4 w-4 mr-2" />
                New Dispute
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Dispute</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input placeholder="Enter customer name" />
                </div>
                <div className="space-y-2">
                  <Label>Customer Email</Label>
                  <Input type="email" placeholder="Enter email address" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service_quality">
                        Service Quality
                      </SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="booking_issue">
                        Booking Issue
                      </SelectItem>
                      <SelectItem value="refund_request">
                        Refund Request
                      </SelectItem>
                      <SelectItem value="staff_behavior">
                        Staff Behavior
                      </SelectItem>
                      <SelectItem value="facility_concern">
                        Facility Concern
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assign To</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Subject</Label>
                  <Input placeholder="Enter dispute subject" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Enter detailed description of the dispute"
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsNewDisputeOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  Create Dispute
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
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Disputes</p>
                <p className="text-2xl font-bold">{totalDisputes}</p>
                <p className="text-xs text-blue-600">All time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-xl">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open Disputes</p>
                <p className="text-2xl font-bold">{openDisputes}</p>
                <p className="text-xs text-orange-600">Needs attention</p>
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
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{resolvedDisputes}</p>
                <p className="text-xs text-green-600">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Resolution</p>
                <p className="text-2xl font-bold">{avgResolutionTime}d</p>
                <p className="text-xs text-green-600">-0.5d from last month</p>
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
        <TabsList className="grid w-full grid-cols-4 rounded-2xl">
          <TabsTrigger value="disputes" className="rounded-xl">
            <MessageSquare className="h-4 w-4 mr-2" />
            All Disputes
          </TabsTrigger>
          <TabsTrigger value="agents" className="rounded-xl">
            <Users className="h-4 w-4 mr-2" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-xl">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl">
            <Tag className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="disputes" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search disputes by subject, customer, or ticket number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="pending_customer">
                        Pending Customer
                      </SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="escalated">Escalated</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={priorityFilter}
                    onValueChange={setPriorityFilter}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disputes List */}
          <Card>
            <CardHeader>
              <CardTitle>Disputes ({filteredDisputes.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-1 p-6">
                  {filteredDisputes.map((dispute, index) => {
                    const CategoryIcon = getCategoryIcon(dispute.category);
                    return (
                      <div key={dispute.id}>
                        <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                          <div
                            className={`p-2 rounded-xl ${
                              dispute.priority === "urgent"
                                ? "bg-red-100 text-red-600"
                                : dispute.priority === "high"
                                ? "bg-orange-100 text-orange-600"
                                : dispute.priority === "medium"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            <CategoryIcon className="h-5 w-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-medium">
                                    {dispute.ticketNumber}
                                  </h4>
                                  <Badge
                                    className={`text-xs rounded-full ${getStatusColor(
                                      dispute.status
                                    )}`}
                                  >
                                    {dispute.status.replace("_", " ")}
                                  </Badge>
                                  <Badge
                                    className={`text-xs rounded-full ${getPriorityColor(
                                      dispute.priority
                                    )}`}
                                  >
                                    {dispute.priority}
                                  </Badge>
                                </div>

                                <h5 className="font-semibold mb-1">
                                  {dispute.subject}
                                </h5>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                  {dispute.description}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">
                                      Customer
                                    </p>
                                    <p className="font-medium">
                                      {dispute.customerName}
                                    </p>
                                    <p className="text-muted-foreground">
                                      {dispute.customerEmail}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-muted-foreground">
                                      Assigned To
                                    </p>
                                    <p className="font-medium">
                                      {dispute.assignedTo}
                                    </p>
                                    <p className="text-muted-foreground">
                                      {dispute.salon}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-muted-foreground">
                                      Created
                                    </p>
                                    <p className="font-medium">
                                      {dispute.createdDate}
                                    </p>
                                    <p className="text-muted-foreground">
                                      Updated: {dispute.lastUpdate}
                                    </p>
                                  </div>

                                  <div>
                                    {dispute.amountInvolved && (
                                      <>
                                        <p className="text-muted-foreground">
                                          Amount
                                        </p>
                                        <p className="font-medium">
                                          ${dispute.amountInvolved}
                                        </p>
                                      </>
                                    )}
                                    {dispute.customerSatisfaction && (
                                      <>
                                        <p className="text-muted-foreground">
                                          Satisfaction
                                        </p>
                                        <div className="flex items-center gap-1">
                                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                          <span className="font-medium">
                                            {dispute.customerSatisfaction}
                                          </span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-1 mt-3">
                                  {dispute.tags.map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="rounded-xl"
                                    >
                                      Actions
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit3 className="h-4 w-4 mr-2" />
                                      Edit Dispute
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Mail className="h-4 w-4 mr-2" />
                                      Contact Customer
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <ArrowRight className="h-4 w-4 mr-2" />
                                      Change Status
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < filteredDisputes.length - 1 && (
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

        <TabsContent value="agents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <User className="h-5 w-5" />
                    {agent.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Department</p>
                      <p className="font-medium">{agent.department}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{agent.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Active Disputes</p>
                      <p className="font-medium">{agent.activeDisputes}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Resolved Total</p>
                      <p className="font-medium">{agent.resolvedDisputes}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Resolution</p>
                      <p className="font-medium">
                        {agent.avgResolutionTime} days
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Customer Rating</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {agent.customerRating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-sm mb-2">
                      Specialties
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {agent.specialties.map((specialty) => (
                        <Badge
                          key={specialty}
                          variant="secondary"
                          className="text-xs"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl"
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dispute Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    disputes.reduce((acc, dispute) => {
                      acc[dispute.category] = (acc[dispute.category] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, count]) => (
                      <div
                        key={category}
                        className="flex justify-between items-center"
                      >
                        <span className="font-medium">
                          {category.replace("_", " ")}
                        </span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(count / totalDisputes) * 100}
                            className="w-20 h-2"
                          />
                          <span className="font-bold">{count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resolution Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Resolution Time</span>
                    <span className="font-bold">{avgResolutionTime} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Customer Satisfaction</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">
                        {customerSatisfactionAvg}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Resolution Rate</span>
                    <span className="font-bold">
                      {Math.round((resolvedDisputes / totalDisputes) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Escalation Rate</span>
                    <span className="font-bold">8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dispute Management Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto-assign New Disputes</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically assign disputes to available agents
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email alerts for new disputes and status changes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Customer Follow-up</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically send follow-up surveys after resolution
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Default Resolution SLA (days)</Label>
                  <Select defaultValue="3">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="2">2 days</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
