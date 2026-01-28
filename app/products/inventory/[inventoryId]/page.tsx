"use client";
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, use } from "react"; // ⬅️ penting, import use dari react
import axiosInstance from "@/axiosInstance";
import Cookies from "js-cookie";

export default function InventoryProductsPage({ params }: { params: Promise<{ inventoryId: string }> }) {
  const { inventoryId } = use(params); // ⬅️ unwrap promise
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.error("No token found, please login first.");
          return;
        }

        const res = await axiosInstance.get(`/products/inventories/${inventoryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Products API response:", res.status, res.data);
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [inventoryId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
        <nav className="text-sm text-gray-500">
          <span>Products</span>
          <span className="mx-2">/</span>
          <span>Inventory</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{inventoryId}</span>
        </nav>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Package className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Products from {inventoryId}</h1>
        </div>
        <p className="text-gray-600">{products.length} products found in this inventory</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">This inventory doesn't have any products yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
