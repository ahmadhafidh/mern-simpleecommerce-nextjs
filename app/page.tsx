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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/products");
        console.log("API response:", res.data); // 👈 cek dulu
        
        // ambil array dari data
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]); // fallback biar gak crash
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


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

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search products..." className="pl-10" />
        </div>

        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Inventory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Inventories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
