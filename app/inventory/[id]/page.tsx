"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/axiosInstance";
import Cookies from "js-cookie";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";

interface InventoryProductsPageProps {
  params: { inventoryId: string };
}

export default function InventoryProductsPage({ params }: InventoryProductsPageProps) {
  const { inventoryId } = params;
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) return;

        const res = await axiosInstance.get(`/products/inventories/${inventoryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Products API response:", res.status, res.data); // cek response
        
        setProducts(res.data.data || []);
      } catch (err: any) {
        console.error("Error fetching products:", err.response?.data || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [inventoryId]);

  if (isLoading) return <div>Loading products...</div>;

  if (products.length === 0)
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">This inventory doesn't have any products yet.</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" asChild>
          <Link href="/inventory">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Link>
        </Button>
        <nav className="text-sm text-gray-500">
          <span>Products</span>
          <span className="mx-2">/</span>
          <span>Inventory</span>
          <span className="text-gray-900">{inventoryId}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
