"use client";

import { useState, useEffect } from "react";
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
  XCircle,
  Building2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProductAPI, SalonAPI, OrderAPI } from "@/lib/services";
import { ApiError } from "@/lib/utils/apiClient";
import type {
  Product as APIProduct,
  OrderDetail,
  OrderStatus,
} from "@/lib/types/api";
import { AuthErrorMessage } from "./AuthErrorMessage";

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
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<APIProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

  // Form state for add/edit product
  const [formData, setFormData] = useState({
    salonId: "",
    title: "",
    sku: "",
    price: "",
    quantity: "",
    images: [] as File[],
  });
  const [formLoading, setFormLoading] = useState(false);

  // API State
  const [products, setProducts] = useState<APIProduct[]>([]);
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [salonNames, setSalonNames] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab, orderStatusFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsAuthError(false);

      const response = await ProductAPI.getProducts({ page: 1, limit: 100 });
      setProducts(response.data);

      // Fetch salon names for all unique salonIds
      const uniqueSalonIds = [...new Set(response.data.map((p) => p.salonId))];
      const salonNamesMap = new Map<string, string>();

      await Promise.all(
        uniqueSalonIds.map(async (salonId) => {
          try {
            const salonResponse = await SalonAPI.getSalonById(salonId);
            salonNamesMap.set(salonId, salonResponse.data.name);
          } catch (err) {
            // If salon fetch fails, keep the ID
            console.error(`Failed to fetch salon ${salonId}:`, err);
            salonNamesMap.set(salonId, `Salon ID: ${salonId}`);
          }
        })
      );

      setSalonNames(salonNamesMap);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setIsAuthError(true);
        }
        setError(err.message);
      } else {
        setError("Failed to load products data");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      salonId: "",
      title: "",
      sku: "",
      price: "",
      quantity: "",
      images: [],
    });
  };

  const handleAddProduct = async () => {
    if (
      !formData.title ||
      !formData.sku ||
      !formData.price ||
      !formData.quantity ||
      !formData.salonId
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setFormLoading(true);
      await ProductAPI.createProduct({
        salonId: formData.salonId,
        title: formData.title,
        sku: formData.sku,
        price: formData.price,
        quantity: formData.quantity,
        images: formData.images.length > 0 ? formData.images : undefined,
      });

      setIsNewProductOpen(false);
      resetForm();
      await fetchProducts();
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Failed to add product: ${err.message}`);
      } else {
        alert("Failed to add product");
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    try {
      setFormLoading(true);
      await ProductAPI.updateProduct(editingProduct.id, {
        title: formData.title || undefined,
        sku: formData.sku || undefined,
        price: formData.price || undefined,
        quantity: formData.quantity || undefined,
        images: formData.images.length > 0 ? formData.images : undefined,
      });

      setIsEditProductOpen(false);
      setEditingProduct(null);
      resetForm();
      await fetchProducts();
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Failed to update product: ${err.message}`);
      } else {
        alert("Failed to update product");
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setIsDeleting(true);
      setDeletingProductId(productId);
      await ProductAPI.deleteProduct(productId);
      await fetchProducts();
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Failed to delete product: ${err.message}`);
      } else {
        alert("Failed to delete product");
      }
    } finally {
      setIsDeleting(false);
      setDeletingProductId(null);
    }
  };

  const openEditDialog = (product: APIProduct) => {
    setEditingProduct(product);
    setFormData({
      salonId: product.salonId,
      title: product.title,
      sku: product.sku,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      images: [],
    });
    setIsEditProductOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    }
  };

  // Order Management Functions
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);

      // Fetch all orders as admin without any status filter when "all" is selected
      const params: any = { page: 1, limit: 100 }; // API maximum limit is 100
      if (orderStatusFilter !== "all") {
        params.status = orderStatusFilter.toUpperCase();
      }

      // Use admin endpoint to get all orders across all users and salons
      const response = await OrderAPI.getAllOrdersAdmin(params);
      setOrders(response.data);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setIsAuthError(true);
        }
        setOrdersError(err.message);
      } else {
        setOrdersError("Failed to load orders");
      }
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleViewOrderDetails = async (orderId: string) => {
    try {
      const response = await OrderAPI.getOrderById(orderId);
      setSelectedOrder(response.data);
      setIsOrderDetailOpen(true);
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Failed to load order details: ${err.message}`);
      } else {
        alert("Failed to load order details");
      }
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      await OrderAPI.updateOrderStatus(orderId, { status: newStatus });
      await fetchOrders();
      if (selectedOrder?.id === orderId) {
        const response = await OrderAPI.getOrderById(orderId);
        setSelectedOrder(response.data);
      }
      alert("Order status updated successfully");
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Failed to update order status: ${err.message}`);
      } else {
        alert("Failed to update order status");
      }
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (
      !confirm(
        "Are you sure you want to cancel this order? Product quantities will be restored."
      )
    )
      return;

    try {
      await OrderAPI.cancelOrder(orderId);
      await fetchOrders();
      if (selectedOrder?.id === orderId) {
        const response = await OrderAPI.getOrderById(orderId);
        setSelectedOrder(response.data);
      }
      alert("Order cancelled successfully");
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Failed to cancel order: ${err.message}`);
      } else {
        alert("Failed to cancel order");
      }
    }
  };

  // Transform API products to local format
  const transformedProducts: Product[] = products.map((p) => {
    // Determine stock status
    let status: "active" | "inactive" | "out-of-stock" = "active";
    if (p.quantity === 0) status = "out-of-stock";

    // Get salon name from the map, fallback to "No Salon" if not found
    const salonName = p.salonId
      ? salonNames.get(p.salonId) || "Loading..."
      : "No Salon";

    return {
      id: p.id,
      name: p.title,
      category: "Uncategorized", // Not in API
      brand: salonName, // Display actual salon name
      price: p.price,
      salePrice: undefined, // Not in API
      stock: p.quantity,
      lowStockThreshold: 10, // Default threshold
      description: "", // Not in API
      images: p.images || [],
      status,
      rating: 4.5, // Not in API
      reviews: 0, // Not in API
      sales: 0, // Not in API
      revenue: 0, // Not in API
      sku: p.sku,
      tags: [], // Not in API
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    if (isAuthError) {
      return <AuthErrorMessage onRetry={fetchProducts} />;
    }
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchProducts}>Try Again</Button>
        </div>
      </div>
    );
  }

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
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "payment_pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "payment_failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredProducts = transformedProducts.filter((product) => {
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

  const totalProducts = transformedProducts.length;
  const lowStockProducts = transformedProducts.filter(
    (p) => p.stock <= p.lowStockThreshold && p.stock > 0
  ).length;
  const outOfStockProducts = transformedProducts.filter(
    (p) => p.stock === 0
  ).length;
  const totalRevenue = transformedProducts.reduce(
    (sum, p) => sum + p.revenue,
    0
  );

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-primary" />
            E-Commerce Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage products, inventory, orders, and online sales
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button variant="outline" className="rounded-2xl">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Dialog
            open={isNewProductOpen}
            onOpenChange={(open) => {
              setIsNewProductOpen(open);
              if (!open) resetForm();
            }}
          >
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Salon ID *</Label>
                    <Input
                      placeholder="Enter salon ID"
                      value={formData.salonId}
                      onChange={(e) =>
                        setFormData({ ...formData, salonId: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Product Name *</Label>
                    <Input
                      placeholder="Enter product name"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SKU *</Label>
                    <Input
                      placeholder="Enter SKU"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price ($) *</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Stock Quantity *</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Product Images</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        {formData.images.length > 0
                          ? `${formData.images.length} file(s) selected`
                          : "Upload product images"}
                      </p>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="product-images"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() =>
                          document.getElementById("product-images")?.click()
                        }
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Files
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsNewProductOpen(false);
                    resetForm();
                  }}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleAddProduct}
                  disabled={formLoading}
                >
                  {formLoading ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Product Dialog */}
          <Dialog
            open={isEditProductOpen}
            onOpenChange={(open) => {
              setIsEditProductOpen(open);
              if (!open) {
                setEditingProduct(null);
                resetForm();
              }
            }}
          >
            <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Salon ID</Label>
                    <Input
                      placeholder="Enter salon ID"
                      value={formData.salonId}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input
                      placeholder="Enter product name"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input
                      placeholder="Enter SKU"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Stock Quantity</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Product Images</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        {formData.images.length > 0
                          ? `${formData.images.length} file(s) selected`
                          : "Upload new images"}
                      </p>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="edit-product-images"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() =>
                          document
                            .getElementById("edit-product-images")
                            ?.click()
                        }
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Files
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditProductOpen(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleEditProduct}
                  disabled={formLoading}
                >
                  {formLoading ? "Updating..." : "Update Product"}
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
                <p className="text-xl sm:text-2xl font-bold">0</p>
                <p className="text-xs text-green-600">Orders not available</p>
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            const apiProduct = products.find(
                              (p) => p.id === product.id
                            );
                            if (apiProduct) openEditDialog(apiProduct);
                          }}
                        >
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
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={
                                isDeleting && deletingProductId === product.id
                              }
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {isDeleting && deletingProductId === product.id
                                ? "Deleting..."
                                : "Delete"}
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
          {/* Enhanced Orders Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <Card
              className="overflow-hidden border-l-4 border-l-yellow-500 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setOrderStatusFilter("pending")}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span className="text-2xl font-bold">
                      {orders.filter((o) => o.status === "PENDING").length}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Pending
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setOrderStatusFilter("confirmed")}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">
                      {orders.filter((o) => o.status === "CONFIRMED").length}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Confirmed
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="overflow-hidden border-l-4 border-l-purple-500 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setOrderStatusFilter("shipped")}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Truck className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">
                      {orders.filter((o) => o.status === "SHIPPED").length}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Shipped
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="overflow-hidden border-l-4 border-l-green-500 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setOrderStatusFilter("delivered")}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">
                      {orders.filter((o) => o.status === "DELIVERED").length}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Delivered
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="overflow-hidden border-l-4 border-l-gray-500 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setOrderStatusFilter("cancelled")}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <XCircle className="h-5 w-5 text-gray-600" />
                    <span className="text-2xl font-bold">
                      {orders.filter((o) => o.status === "CANCELLED").length}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Cancelled
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Orders Filters */}
          <Card className="border-2">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Filter className="h-5 w-5 text-primary flex-shrink-0" />
                    <Select
                      value={orderStatusFilter}
                      onValueChange={setOrderStatusFilter}
                    >
                      <SelectTrigger className="w-full h-10 sm:h-11 text-sm font-medium border-2">
                        <SelectValue placeholder="Filter by Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                            All Orders
                          </div>
                        </SelectItem>
                        <SelectItem value="pending">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-yellow-500" />
                            Pending
                          </div>
                        </SelectItem>
                        <SelectItem value="payment_pending">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-orange-500" />
                            Payment Pending
                          </div>
                        </SelectItem>
                        <SelectItem value="payment_failed">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500" />
                            Payment Failed
                          </div>
                        </SelectItem>
                        <SelectItem value="confirmed">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            Confirmed
                          </div>
                        </SelectItem>
                        <SelectItem value="shipped">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-purple-500" />
                            Shipped
                          </div>
                        </SelectItem>
                        <SelectItem value="delivered">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            Delivered
                          </div>
                        </SelectItem>
                        <SelectItem value="cancelled">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-gray-500" />
                            Cancelled
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={fetchOrders}
                    disabled={ordersLoading}
                    className="rounded-xl border-2 hover:bg-primary hover:text-primary-foreground transition-all whitespace-nowrap flex-shrink-0"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        ordersLoading ? "animate-spin" : ""
                      }`}
                    />
                    <span className="ml-2 font-medium">Refresh Orders</span>
                  </Button>
                </div>
                {orderStatusFilter !== "all" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOrderStatusFilter("all")}
                    className="text-xs self-start"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Orders Grid/List */}
          {ordersLoading ? (
            <Card className="border-2">
              <CardContent className="p-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
                    <ShoppingCart className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="mt-6 text-lg font-medium text-muted-foreground">
                    Loading orders...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Please wait while we fetch your data
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : ordersError ? (
            <Card className="border-2 border-destructive/50">
              <CardContent className="p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-destructive/10 rounded-full mb-4">
                    <AlertTriangle className="h-12 w-12 text-destructive" />
                  </div>
                  <p className="text-lg font-semibold mb-2">
                    Error Loading Orders
                  </p>
                  <p className="text-destructive mb-6 max-w-md">
                    {ordersError}
                  </p>
                  <Button
                    onClick={fetchOrders}
                    size="lg"
                    className="rounded-xl"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : orders.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="p-6 bg-muted rounded-full mb-6">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No Orders Found
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    {orderStatusFilter !== "all"
                      ? `No ${orderStatusFilter} orders at the moment. Try adjusting your filters.`
                      : "No orders have been placed yet. Orders will appear here once customers start purchasing."}
                  </p>
                  {orderStatusFilter !== "all" && (
                    <Button
                      onClick={() => setOrderStatusFilter("all")}
                      variant="outline"
                      className="rounded-xl"
                    >
                      View All Orders
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {orderStatusFilter === "all"
                    ? "All Orders"
                    : `${
                        orderStatusFilter.charAt(0).toUpperCase() +
                        orderStatusFilter.slice(1).replace("_", " ")
                      } Orders`}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({orders.length})
                  </span>
                </h3>
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {orders.map((order, index) => {
                  const statusLower = order.status.toLowerCase();
                  const statusConfig = {
                    pending: {
                      color: "yellow",
                      icon: Clock,
                      gradient: "from-yellow-500 to-orange-500",
                    },
                    payment_pending: {
                      color: "orange",
                      icon: DollarSign,
                      gradient: "from-orange-500 to-red-500",
                    },
                    payment_failed: {
                      color: "red",
                      icon: AlertTriangle,
                      gradient: "from-red-500 to-pink-500",
                    },
                    confirmed: {
                      color: "blue",
                      icon: CheckCircle,
                      gradient: "from-blue-500 to-cyan-500",
                    },
                    shipped: {
                      color: "purple",
                      icon: Truck,
                      gradient: "from-purple-500 to-pink-500",
                    },
                    delivered: {
                      color: "green",
                      icon: CheckCircle,
                      gradient: "from-green-500 to-emerald-500",
                    },
                    cancelled: {
                      color: "gray",
                      icon: XCircle,
                      gradient: "from-gray-500 to-slate-500",
                    },
                  }[statusLower] || {
                    color: "gray",
                    icon: Package,
                    gradient: "from-gray-500 to-slate-500",
                  };

                  const StatusIcon = statusConfig.icon;

                  return (
                    <Card
                      key={order.id}
                      className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 animate-in fade-in slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CardContent className="p-0">
                        <div
                          className={`bg-gradient-to-r ${statusConfig.gradient} p-4 text-white`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <StatusIcon className="h-5 w-5" />
                                <p className="font-semibold text-sm uppercase tracking-wide">
                                  {order.status.replace("_", " ")}
                                </p>
                              </div>
                              <p className="text-xs opacity-90">
                                Order #{order.id.slice(-8).toUpperCase()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold">
                                ${parseFloat(order.total).toFixed(2)}
                              </p>
                              <p className="text-xs opacity-90">
                                {order.orderItems.length} item
                                {order.orderItems.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground font-medium">
                                Order Date
                              </p>
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-primary" />
                                <p className="text-sm font-medium">
                                  {new Date(order.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground font-medium">
                                Salon
                              </p>
                              <div className="flex items-center gap-1.5">
                                <Building2 className="h-3.5 w-3.5 text-primary" />
                                <p className="text-sm font-medium truncate">
                                  {order.salon?.name || "N/A"}
                                </p>
                              </div>
                              {order.salon?.verified && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs py-0 h-5"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground font-medium">
                              Order Items
                            </p>
                            <div className="space-y-1.5">
                              {order.orderItems.slice(0, 2).map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
                                >
                                  <div className="h-10 w-10 rounded-md bg-background border-2 flex items-center justify-center flex-shrink-0">
                                    {item.product.images[0] ? (
                                      <ImageWithFallback
                                        src={item.product.images[0]}
                                        alt={item.product.title}
                                        className="h-full w-full object-cover rounded"
                                      />
                                    ) : (
                                      <Package className="h-5 w-5 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">
                                      {item.product.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Qty: {item.quantity} × $
                                      {parseFloat(item.unitPrice).toFixed(2)}
                                    </p>
                                  </div>
                                  <p className="text-sm font-semibold">
                                    $
                                    {(
                                      item.quantity * parseFloat(item.unitPrice)
                                    ).toFixed(2)}
                                  </p>
                                </div>
                              ))}
                              {order.orderItems.length > 2 && (
                                <p className="text-xs text-muted-foreground text-center py-1">
                                  +{order.orderItems.length - 2} more item
                                  {order.orderItems.length - 2 !== 1 ? "s" : ""}
                                </p>
                              )}
                            </div>

                            {/* Calculation Check Badge */}
                            {(() => {
                              const calculatedTotal = order.orderItems.reduce(
                                (sum, item) =>
                                  sum +
                                  parseFloat(item.unitPrice) * item.quantity,
                                0
                              );
                              const orderTotal = parseFloat(order.total);
                              const hasDiscrepancy =
                                Math.abs(calculatedTotal - orderTotal) > 0.01;

                              if (hasDiscrepancy) {
                                return (
                                  <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                                    <p className="text-xs text-orange-700 dark:text-orange-400 flex items-center gap-1">
                                      <AlertTriangle className="h-3 w-3" />
                                      Items: ${calculatedTotal.toFixed(2)} |
                                      Total: ${orderTotal.toFixed(2)}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              onClick={() => handleViewOrderDetails(order.id)}
                              className="flex-1 rounded-xl font-medium"
                              size="sm"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            {order.status !== "CANCELLED" &&
                              order.status !== "DELIVERED" && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="rounded-xl px-3"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                  >
                                    {order.status === "PENDING" && (
                                      <>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleUpdateOrderStatus(
                                              order.id,
                                              "CONFIRMED"
                                            )
                                          }
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                                          <span className="font-medium">
                                            Confirm Order
                                          </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleUpdateOrderStatus(
                                              order.id,
                                              "PAYMENT_PENDING"
                                            )
                                          }
                                        >
                                          <DollarSign className="h-4 w-4 mr-2 text-orange-600" />
                                          <span className="font-medium">
                                            Mark Payment Pending
                                          </span>
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                    {order.status === "PAYMENT_PENDING" && (
                                      <>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleUpdateOrderStatus(
                                              order.id,
                                              "CONFIRMED"
                                            )
                                          }
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                          <span className="font-medium">
                                            Confirm Payment
                                          </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleUpdateOrderStatus(
                                              order.id,
                                              "PAYMENT_FAILED"
                                            )
                                          }
                                        >
                                          <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                                          <span className="font-medium">
                                            Mark Payment Failed
                                          </span>
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                    {order.status === "CONFIRMED" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleUpdateOrderStatus(
                                            order.id,
                                            "SHIPPED"
                                          )
                                        }
                                      >
                                        <Truck className="h-4 w-4 mr-2 text-purple-600" />
                                        <span className="font-medium">
                                          Mark as Shipped
                                        </span>
                                      </DropdownMenuItem>
                                    )}
                                    {order.status === "SHIPPED" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleUpdateOrderStatus(
                                            order.id,
                                            "DELIVERED"
                                          )
                                        }
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                        <span className="font-medium">
                                          Mark as Delivered
                                        </span>
                                      </DropdownMenuItem>
                                    )}
                                    {order.status !== "SHIPPED" && (
                                      <>
                                        <div className="my-1 h-px bg-border" />
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleCancelOrder(order.id)
                                          }
                                          className="text-destructive focus:text-destructive"
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          <span className="font-medium">
                                            Cancel Order
                                          </span>
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order Details Dialog */}
          <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
              </DialogHeader>
              {selectedOrder && (
                <div className="space-y-6 py-4">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-medium">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge
                        variant="outline"
                        className={`${getOrderStatusColor(
                          selectedOrder.status.toLowerCase()
                        )} rounded-full mt-1`}
                      >
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Order Date
                      </p>
                      <p className="font-medium">
                        {new Date(selectedOrder.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-semibold text-lg">
                        ${parseFloat(selectedOrder.total).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Salon Info */}
                  {selectedOrder.salon && (
                    <div className="p-4 bg-muted rounded-xl">
                      <p className="text-sm font-medium mb-2">
                        Salon Information
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <strong>Name:</strong> {selectedOrder.salon.name}
                          {selectedOrder.salon.verified && (
                            <CheckCircle className="h-4 w-4 inline ml-1 text-green-600" />
                          )}
                        </p>
                        <p className="text-sm">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {selectedOrder.salon.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedOrder.notes && (
                    <div className="p-4 bg-muted rounded-xl">
                      <p className="text-sm font-medium mb-2">Order Notes</p>
                      <p className="text-sm">{selectedOrder.notes}</p>
                    </div>
                  )}

                  <Separator />

                  {/* Order Items */}
                  <div>
                    <p className="text-sm font-medium mb-3">Order Items</p>
                    <div className="space-y-3">
                      {selectedOrder.orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 p-3 border rounded-xl"
                        >
                          {item.product.images &&
                          item.product.images.length > 0 ? (
                            <ImageWithFallback
                              src={item.product.images[0]}
                              alt={item.product.title}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-[60px] h-[60px] bg-muted rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {item.product.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              SKU: {item.product.sku}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-sm">
                                Quantity: <strong>{item.quantity}</strong>
                              </p>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                  ${parseFloat(item.unitPrice).toFixed(2)} each
                                </p>
                                <p className="font-semibold text-sm">
                                  $
                                  {(
                                    parseFloat(item.unitPrice) * item.quantity
                                  ).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary with Calculation Check */}
                    <div className="mt-4 p-4 bg-muted/50 rounded-xl space-y-2">
                      {(() => {
                        const calculatedSubtotal =
                          selectedOrder.orderItems.reduce(
                            (sum, item) =>
                              sum + parseFloat(item.unitPrice) * item.quantity,
                            0
                          );
                        const orderTotal = parseFloat(selectedOrder.total);
                        const hasDiscrepancy =
                          Math.abs(calculatedSubtotal - orderTotal) > 0.01;

                        return (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Items Subtotal:
                              </span>
                              <span className="font-medium">
                                ${calculatedSubtotal.toFixed(2)}
                              </span>
                            </div>
                            {hasDiscrepancy && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Adjustments:
                                </span>
                                <span
                                  className={`font-medium ${
                                    orderTotal > calculatedSubtotal
                                      ? "text-orange-600"
                                      : "text-green-600"
                                  }`}
                                >
                                  {orderTotal > calculatedSubtotal ? "+" : ""}$
                                  {(orderTotal - calculatedSubtotal).toFixed(2)}
                                </span>
                              </div>
                            )}
                            <Separator />
                            <div className="flex justify-between text-base font-semibold">
                              <span>Order Total:</span>
                              <span className="text-lg">
                                ${orderTotal.toFixed(2)}
                              </span>
                            </div>
                            {hasDiscrepancy && (
                              <p className="text-xs text-muted-foreground italic mt-2">
                                * Total includes additional charges or discounts
                              </p>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
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
                  {transformedProducts
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
                  {transformedProducts
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
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">
                    Sales analytics not available in current API
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">
                    Revenue analytics not available in current API
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
