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
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Star,
  AlertTriangle,
  CheckCircle,
  MoreHorizontal,
  Image as ImageIcon,
  BarChart3,
  Users,
  Clock,
  MapPin,
  Truck,
  RefreshCw,
  Download,
  Upload,
  Tag,
  Zap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  salePrice?: number;
  stock: number;
  lowStockThreshold: number;
  description: string;
  images: string[];
  status: "active" | "inactive" | "out-of-stock";
  rating: number;
  reviews: number;
  sales: number;
  revenue: number;
  sku: string;
  tags: string[];
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: { product: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  orderDate: string;
  shippingAddress: string;
  paymentMethod: string;
}

export function ECommerceManagement() {
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);

  const [products] = useState<Product[]>([
    {
      id: "PRD-001",
      name: "Premium Hair Serum - Argan Oil",
      category: "Hair Care",
      brand: "LuxeBeauty",
      price: 89.99,
      salePrice: 69.99,
      stock: 3,
      lowStockThreshold: 10,
      description:
        "Nourishing argan oil hair serum for damaged and dry hair. Provides deep hydration and shine.",
      images: ["/api/placeholder/300/300"],
      status: "active",
      rating: 4.8,
      reviews: 127,
      sales: 234,
      revenue: 16398.66,
      sku: "LB-SERUM-001",
      tags: ["bestseller", "organic", "paraben-free"],
    },
    {
      id: "PRD-002",
      name: "Moisturizing Face Cream - Deluxe",
      category: "Skin Care",
      brand: "GlowPro",
      price: 125.0,
      stock: 8,
      lowStockThreshold: 15,
      description:
        "Anti-aging face cream with hyaluronic acid and peptides. Suitable for all skin types.",
      images: ["/api/placeholder/300/300"],
      status: "active",
      rating: 4.6,
      reviews: 89,
      sales: 156,
      revenue: 19500.0,
      sku: "GP-CREAM-002",
      tags: ["anti-aging", "hyaluronic", "luxury"],
    },
    {
      id: "PRD-003",
      name: "Professional Hair Dryer - Ionic",
      category: "Tools & Equipment",
      brand: "ProStyle",
      price: 299.99,
      stock: 15,
      lowStockThreshold: 5,
      description:
        "Professional ionic hair dryer with multiple heat and speed settings. Includes diffuser attachment.",
      images: ["/api/placeholder/300/300"],
      status: "active",
      rating: 4.7,
      reviews: 203,
      sales: 89,
      revenue: 26699.11,
      sku: "PS-DRYER-003",
      tags: ["professional", "ionic", "salon-grade"],
    },
    {
      id: "PRD-004",
      name: "Nail Polish Set - Spring Collection",
      category: "Nail Care",
      brand: "ColorFusion",
      price: 45.99,
      stock: 0,
      lowStockThreshold: 20,
      description:
        "Set of 6 nail polish colors in trendy spring shades. Long-lasting and chip-resistant formula.",
      images: ["/api/placeholder/300/300"],
      status: "out-of-stock",
      rating: 4.4,
      reviews: 67,
      sales: 178,
      revenue: 8186.22,
      sku: "CF-POLISH-004",
      tags: ["seasonal", "set", "chip-resistant"],
    },
    {
      id: "PRD-005",
      name: "Vitamin C Brightening Serum",
      category: "Skin Care",
      brand: "RadiantSkin",
      price: 78.5,
      stock: 22,
      lowStockThreshold: 12,
      description:
        "Vitamin C serum with niacinamide for brighter, more even skin tone. Cruelty-free and vegan.",
      images: ["/api/placeholder/300/300"],
      status: "active",
      rating: 4.9,
      reviews: 145,
      sales: 298,
      revenue: 23393.0,
      sku: "RS-SERUM-005",
      tags: ["vitamin-c", "vegan", "cruelty-free", "brightening"],
    },
    {
      id: "PRD-006",
      name: "Luxury Makeup Brush Set",
      category: "Makeup Tools",
      brand: "ArtistPro",
      price: 189.99,
      stock: 12,
      lowStockThreshold: 8,
      description:
        "Professional makeup brush set with synthetic bristles. Includes 15 brushes and leather case.",
      images: ["/api/placeholder/300/300"],
      status: "active",
      rating: 4.8,
      reviews: 98,
      sales: 67,
      revenue: 12729.33,
      sku: "AP-BRUSH-006",
      tags: ["professional", "synthetic", "luxury", "complete-set"],
    },
  ]);

  const [orders] = useState<Order[]>([
    {
      id: "ORD-2024-001",
      customerName: "Sarah Johnson",
      customerEmail: "sarah.j@email.com",
      items: [
        { product: "Premium Hair Serum", quantity: 2, price: 69.99 },
        { product: "Moisturizing Face Cream", quantity: 1, price: 125.0 },
      ],
      total: 264.98,
      status: "shipped",
      orderDate: "2024-12-06",
      shippingAddress: "123 Main St, New York, NY 10001",
      paymentMethod: "Credit Card",
    },
    {
      id: "ORD-2024-002",
      customerName: "Michael Chen",
      customerEmail: "m.chen@email.com",
      items: [
        { product: "Professional Hair Dryer", quantity: 1, price: 299.99 },
      ],
      total: 299.99,
      status: "processing",
      orderDate: "2024-12-07",
      shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
      paymentMethod: "PayPal",
    },
    {
      id: "ORD-2024-003",
      customerName: "Emma Williams",
      customerEmail: "emma.w@email.com",
      items: [
        { product: "Vitamin C Serum", quantity: 1, price: 78.5 },
        { product: "Luxury Brush Set", quantity: 1, price: 189.99 },
      ],
      total: 268.49,
      status: "delivered",
      orderDate: "2024-12-05",
      shippingAddress: "789 Pine St, Chicago, IL 60601",
      paymentMethod: "Credit Card",
    },
  ]);

  const getStockStatus = (product: Product) => {
    if (product.stock === 0)
      return {
        status: "out-of-stock",
        color: "bg-red-100 text-red-800 border-red-200",
      };
    if (product.stock <= product.lowStockThreshold)
      return {
        status: "low-stock",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    return {
      status: "in-stock",
      color: "bg-green-100 text-green-800 border-green-200",
    };
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalProducts = products.length;
  const lowStockProducts = products.filter(
    (p) => p.stock <= p.lowStockThreshold && p.stock > 0
  ).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "processing"
  ).length;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-primary" />
            E-Commerce Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage products, inventory, orders, and online sales
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="outline" className="rounded-2xl w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Dialog open={isNewProductOpen} onOpenChange={setIsNewProductOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 rounded-2xl">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input placeholder="Enter product name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Brand</Label>
                    <Input placeholder="Enter brand name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hair-care">Hair Care</SelectItem>
                        <SelectItem value="skin-care">Skin Care</SelectItem>
                        <SelectItem value="makeup-tools">
                          Makeup Tools
                        </SelectItem>
                        <SelectItem value="nail-care">Nail Care</SelectItem>
                        <SelectItem value="tools">Tools & Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input placeholder="Enter SKU" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price ($)</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Sale Price ($)</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Stock Quantity</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Low Stock Alert</Label>
                      <Input type="number" placeholder="10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Product Images</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload product images
                      </p>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Files
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <Input placeholder="Enter tags separated by commas" />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Enter product description" rows={4} />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsNewProductOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  Add Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-xl">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Total Products
                </p>
                <p className="text-xl sm:text-2xl font-bold">{totalProducts}</p>
                <p className="text-xs text-green-600">+12 this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-orange-100 rounded-xl">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Low Stock Items
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {lowStockProducts}
                </p>
                <p className="text-xs text-orange-600">Need reorder</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-green-100 rounded-xl">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Orders Today
                </p>
                <p className="text-xl sm:text-2xl font-bold">{totalOrders}</p>
                <p className="text-xs text-green-600">+15% from yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-xl">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Total Revenue
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  ${totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-green-600">+8% this month</p>
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
        <TabsList className="grid w-full grid-cols-4 rounded-2xl p-1">
          <TabsTrigger
            value="products"
            className="rounded-xl text-xs sm:text-sm px-2 sm:px-3"
          >
            <Package className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden xs:inline ml-1 sm:ml-0">Products</span>
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="rounded-xl text-xs sm:text-sm px-2 sm:px-3"
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden xs:inline ml-1 sm:ml-0">Orders</span>
          </TabsTrigger>
          <TabsTrigger
            value="inventory"
            className="rounded-xl text-xs sm:text-sm px-2 sm:px-3"
          >
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden xs:inline ml-1 sm:ml-0">Inventory</span>
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="rounded-xl text-xs sm:text-sm px-2 sm:px-3"
          >
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden xs:inline ml-1 sm:ml-0">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-9 sm:h-10 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto">
                  <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-32 sm:w-40 h-9 sm:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Hair Care">Hair Care</SelectItem>
                      <SelectItem value="Skin Care">Skin Care</SelectItem>
                      <SelectItem value="Makeup Tools">Makeup Tools</SelectItem>
                      <SelectItem value="Nail Care">Nail Care</SelectItem>
                      <SelectItem value="Tools & Equipment">
                        Tools & Equipment
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-28 sm:w-36 h-9 sm:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product);
              return (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <ImageWithFallback
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.salePrice && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        Sale
                      </Badge>
                    )}
                    <Badge
                      className={`absolute top-2 right-2 ${stockStatus.color}`}
                    >
                      {stockStatus.status === "out-of-stock"
                        ? "Out of Stock"
                        : stockStatus.status === "low-stock"
                        ? "Low Stock"
                        : "In Stock"}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {product.brand}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {product.salePrice ? (
                            <>
                              <span className="font-bold text-primary">
                                ${product.salePrice}
                              </span>
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.price}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold">${product.price}</span>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{product.rating}</span>
                          <span className="text-muted-foreground">
                            ({product.reviews})
                          </span>
                        </div>
                        <span className="text-muted-foreground">
                          Stock: {product.stock}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Tag className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Zap className="h-4 w-4 mr-2" />
                              Promote
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders ({orders.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-1 p-6">
                  {orders.map((order, index) => (
                    <div key={order.id}>
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                        <div className="p-2 bg-primary/10 rounded-xl">
                          <ShoppingCart className="h-5 w-5 text-primary" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium">{order.id}</h4>
                                <Badge
                                  className={`text-xs rounded-full ${getOrderStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {order.status}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">
                                    Customer
                                  </p>
                                  <p className="font-medium">
                                    {order.customerName}
                                  </p>
                                  <p className="text-muted-foreground">
                                    {order.customerEmail}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground">
                                    Order Details
                                  </p>
                                  <p className="font-medium">
                                    ${order.total.toFixed(2)}
                                  </p>
                                  <p className="text-muted-foreground">
                                    {order.items.length} items
                                  </p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground">
                                    Date & Payment
                                  </p>
                                  <p className="font-medium">
                                    {order.orderDate}
                                  </p>
                                  <p className="text-muted-foreground">
                                    {order.paymentMethod}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                                <p className="text-sm font-medium mb-1">
                                  Items:
                                </p>
                                <div className="space-y-1">
                                  {order.items.map((item, idx) => (
                                    <p
                                      key={idx}
                                      className="text-sm text-muted-foreground"
                                    >
                                      {item.quantity}x {item.product} - $
                                      {item.price}
                                    </p>
                                  ))}
                                </div>
                              </div>
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
                                    <Truck className="h-4 w-4 mr-2" />
                                    Update Status
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    Print Invoice
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < orders.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Low Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products
                    .filter(
                      (p) => p.stock <= p.lowStockThreshold && p.stock > 0
                    )
                    .map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-200"
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Only {product.stock} units left
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800"
                        >
                          Low Stock
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Out of Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products
                    .filter((p) => p.stock === 0)
                    .map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200"
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Needs immediate restock
                          </p>
                        </div>
                        <Badge variant="destructive" className="rounded-full">
                          Out of Stock
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products
                    .sort((a, b) => b.sales - a.sales)
                    .slice(0, 5)
                    .map((product, index) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{index + 1}
                          </span>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.brand}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{product.sales} sold</p>
                          <p className="text-sm text-muted-foreground">
                            ${product.revenue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    products.reduce((acc, product) => {
                      acc[product.category] =
                        (acc[product.category] || 0) + product.revenue;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, revenue]) => (
                      <div
                        key={category}
                        className="flex justify-between items-center"
                      >
                        <span className="font-medium">{category}</span>
                        <span className="font-bold">
                          ${revenue.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
