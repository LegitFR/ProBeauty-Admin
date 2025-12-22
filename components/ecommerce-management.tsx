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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProductAPI, SalonAPI } from "@/lib/services";
import { ApiError } from "@/lib/utils/apiClient";
import type { Product as APIProduct } from "@/lib/types/api";
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
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<APIProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );

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
  const [salonNames, setSalonNames] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

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
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">
                  Order management not available in current API
                </p>
              </div>
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
