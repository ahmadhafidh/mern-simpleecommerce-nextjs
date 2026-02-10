"use client"
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, X, Upload } from 'lucide-react';
import axiosInstance from "@/axiosInstance";
import { getImageUrl } from "@/lib/getImageUrl";
import {useRouter} from "next/navigation"

// Types
interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  description: string;
  inventoryId: string;
  createdAt: string;
  updatedAt: string;
  inventory: {
    id: string;
    name: string;
    description: string;
  };
}

interface Inventory {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Invoice {
  id: string;
  email: string;
  name: string;
  phone: string;
  items: string;
  total: number;
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface Statistic {
  totalPesanan: number;
  totalTerbayar: number;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<
    "products" | "inventories" | "invoices" | "statistics"
  >("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [mode, setMode] = useState<"single" | "range">("single");
  const [statistics, setStatistics] = useState<Statistic | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [editingItem, setEditingItem] = useState<any>(null);
  const router = useRouter();

  // Validasi login (cek akses ke inventories)
  useEffect(() => {
    const validateAccess = async () => {
      try {
        const res = await axiosInstance.get("/inventories");
        if (!res.data.success) {
          alert("Anda harus login terlebih dahulu!");
          router.push("/auth/signin");
        }
      } catch (error) {
        console.error("Validasi gagal:", error);
        alert("Anda harus login terlebih dahulu!");
        router.push("/auth/signin");
      }
    };

    validateAccess();
  }, [router]);

  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    image: null as File | null,
    price: "",
    stock: "",
    description: "",
    inventoryId: "",
  });

  const [inventoryForm, setInventoryForm] = useState({
    name: "",
    description: "",
  });

  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // Fetch data functions
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/products");
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/inventories");
      if (response.data.success) {
        setInventories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching inventories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/invoice');
      if (response.data.success) {
        setInvoices(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      let res;

      if (mode === "single" && date) {
        res = await axiosInstance.get("/statistics/single", {
          params: { date },
        });
      } else if (mode === "range" && start && end) {
        res = await axiosInstance.get("/statistics/range", {
          params: { start, end },
        });
      } else {
        alert("Isi tanggal terlebih dahulu!");
        return;
      }

      if (res.data.success) setStatistics(res.data.data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  // const fetchStatisticsSingle = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axiosInstance.get("/statistics/single", {
  //       params: { date },
  //     });
  //     if (response.data.success) {
  //       setInvoices(response.data.data);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching statistics:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchStatisticsRange = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axiosInstance.get("/statistics/single");
  //     if (response.data.success) {
  //       setInvoices(response.data.data);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching statistics:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Product CRUD operations
  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("price", productForm.price);
      formData.append("stock", productForm.stock);
      formData.append("description", productForm.description);
      formData.append("inventoryId", productForm.inventoryId);
      if (productForm.image) {
        formData.append("image", productForm.image);
      }

      const response = await axiosInstance.post("/products", formData);
      if (response.data.success) {
        await fetchProducts();
        resetProductForm();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("price", productForm.price);
      formData.append("stock", productForm.stock);
      formData.append("description", productForm.description);
      formData.append("inventoryId", productForm.inventoryId);
      if (productForm.image) {
        formData.append("image", productForm.image);
      }

      const response = await axiosInstance.put(
        `/products/${editingItem.id}`,
        formData
      );
      if (response.data.success) {
        await fetchProducts();
        resetProductForm();
        setShowModal(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axiosInstance.delete(`/products/${id}`);
        if (response.data.success) {
          await fetchProducts();
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Inventory CRUD operations
  const handleAddInventory = async () => {
    try {
      const response = await axiosInstance.post("/inventories", inventoryForm);
      if (response.data.success) {
        await fetchInventories();
        resetInventoryForm();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error adding inventory:", error);
    }
  };

  const handleEditInventory = async () => {
    try {
      const response = await axiosInstance.put(
        `/inventories/${editingItem.id}`,
        inventoryForm
      );
      if (response.data.success) {
        await fetchInventories();
        resetInventoryForm();
        setShowModal(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error("Error editing inventory:", error);
    }
  };

  const handleDeleteInventory = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this inventory?")) {
      try {
        const response = await axiosInstance.delete(`/inventories/${id}`);
        if (response.data.success) {
          await fetchInventories();
        }
      } catch (error) {
        console.error("Error deleting inventory:", error);
      }
    }
  };

  // Form reset functions
  const resetProductForm = () => {
    setProductForm({
      name: "",
      image: null,
      price: "",
      stock: "",
      description: "",
      inventoryId: "",
    });
  };

  const resetInventoryForm = () => {
    setInventoryForm({
      name: "",
      description: "",
    });
  };

  // Modal handlers
  const openAddModal = (type: "product" | "inventory") => {
    setModalType("add");
    setShowModal(true);
    if (type === "product") {
      resetProductForm();
    } else {
      resetInventoryForm();
    }
  };

  const openEditModal = (item: any, type: "product" | "inventory") => {
    setModalType("edit");
    setEditingItem(item);
    setShowModal(true);

    if (type === "product") {
      setProductForm({
        name: item.name,
        image: null,
        price: item.price.toString(),
        stock: item.stock.toString(),
        description: item.description,
        inventoryId: item.inventoryId,
      });
    } else {
      setInventoryForm({
        name: item.name,
        description: item.description,
      });
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
      fetchInventories(); // for dropdown
    } else if (activeTab === "inventories") {
      fetchInventories();
    } else if (activeTab === "invoices") {
      fetchInvoices();
    } else if (activeTab === "statistics") {
      setStatistics(null);
      setDate("");
      setStart("");
      setEnd("");
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {["products", "inventories", "invoices", "statistics"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                      activeTab === tab
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Products Tab */}
            {activeTab === "products" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    Products
                  </h2>
                  <button
                    onClick={() => openAddModal("product")}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Image
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Inventory
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <img
                                src={getImageUrl(product.image)}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.description}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(product.price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.stock}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.inventory.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    openEditModal(product, "product")
                                  }
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Inventories Tab */}
            {activeTab === "inventories" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    Inventories
                  </h2>
                  <button
                    onClick={() => openAddModal("inventory")}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Inventory
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created At
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {inventories.map((inventory) => (
                          <tr key={inventory.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {inventory.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {inventory.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(inventory.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    openEditModal(inventory, "inventory")
                                  }
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteInventory(inventory.id)
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === "invoices" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  Invoices
                </h2>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Items
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {invoices.map((invoice) => (
                          <tr key={invoice.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {invoice.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {invoice.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {invoice.phone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {invoice.items}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(invoice.total)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(invoice.date)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === "statistics" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  Statistics
                </h2>

                {/* Mode Switch */}
                <div className="flex gap-2 mb-4">
                  <button
                    className={`px-4 py-2 rounded ${
                      mode === "single"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setMode("single")}
                  >
                    Single
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${
                      mode === "range"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setMode("range")}
                  >
                    Range
                  </button>
                </div>

                {/* Loading */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Input tanggal */}
                    {mode === "single" ? (
                      <div>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="border p-2 rounded w-60"
                        />
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={start}
                          onChange={(e) => setStart(e.target.value)}
                          className="border p-2 rounded w-60"
                        />
                        <input
                          type="date"
                          value={end}
                          onChange={(e) => setEnd(e.target.value)}
                          className="border p-2 rounded w-60"
                        />
                      </div>
                    )}

                    {/* Tombol Fetch */}
                    <button
                      onClick={fetchStatistics}
                      disabled={loading}
                      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                      {loading ? "Loading..." : "Fetch Statistics"}
                    </button>

                    {/* Result */}
                    {statistics && (
                      <div className="mt-4 p-4 border rounded bg-gray-100">
                        <p>
                          <strong>Total Pesanan:</strong>{" "}
                          {statistics.totalPesanan}
                        </p>
                        <p>
                          <strong>Total Terbayar:</strong>{" "}
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(statistics.totalTerbayar)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={() => setShowModal(false)}
              ></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {modalType === "add" ? "Add" : "Edit"}{" "}
                    {activeTab === "products" ? "Product" : "Inventory"}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Product Form */}
                {activeTab === "products" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            name: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            image: e.target.files?.[0] || null,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Price
                      </label>
                      <input
                        type="number"
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            price: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Stock
                      </label>
                      <input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            stock: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Inventory
                      </label>
                      <select
                        value={productForm.inventoryId}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            inventoryId: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Inventory</option>
                        {inventories.map((inventory) => (
                          <option key={inventory.id} value={inventory.id}>
                            {inventory.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Inventory Form */}
                {activeTab === "inventories" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        value={inventoryForm.name}
                        onChange={(e) =>
                          setInventoryForm({
                            ...inventoryForm,
                            name: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={inventoryForm.description}
                        onChange={(e) =>
                          setInventoryForm({
                            ...inventoryForm,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => {
                    if (activeTab === "products") {
                      modalType === "add"
                        ? handleAddProduct()
                        : handleEditProduct();
                    } else {
                      modalType === "add"
                        ? handleAddInventory()
                        : handleEditInventory();
                    }
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {modalType === "add" ? "Add" : "Update"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;