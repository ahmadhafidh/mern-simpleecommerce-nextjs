"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/axiosInstance";
import ProductCard from "@/components/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [inventories, setInventories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // state untuk search + filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInventory, setSelectedInventory] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch products
        const prodRes = await axiosInstance.get("/products");
        const productData = prodRes.data.data || [];
        setProducts(productData);

        // ambil unique inventory dari products
        const uniqueInventories = Array.from(
          new Map(
            productData.map((p: any) => [p.inventory.id, p.inventory])
          ).values()
        );
        setInventories(uniqueInventories);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
        setInventories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchInventory =
      selectedInventory === "all" ||
      product.inventoryId === selectedInventory; // ⬅️ pakai id inventory

    return matchSearch && matchInventory;
  });

  if (loading) {
    return <p className="text-center">Loading products...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to E-Commerce
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover amazing products with our modern e-commerce platform
        </p>
      </div>

      {/* 🔎 Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={selectedInventory}
            onValueChange={setSelectedInventory}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Inventory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Inventories</SelectItem>
              {inventories.map((inv) => (
                <SelectItem key={inv.id} value={inv.id}>
                  {inv.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Produk hasil filter */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
