"use client";

import { notFound, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Calendar, ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/axiosInstance";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  inventoryId: string;
}

interface Inventory {
  id: string;
  name: string;
  location: string;
  createdAt: string;
}

export default function InventoryDetailPage() {
  const params = useParams();
  const { id } = params;

  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const invRes = await axiosInstance.get(`/inventories/${id}`);
        const prodRes = await axiosInstance.get(`/products/inventories/${id}`);

        setInventory(invRes.data.data);
        setProducts(Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.data || []);
        console.log(invRes.data);
        console.log(prodRes.data);
      } catch (err) {
        console.error("Gagal fetch:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!inventory) return notFound();

  // pastikan products adalah array
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );

  const lowStockProducts = products.filter((p) => p.stock < 20);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

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
          <span>Inventory</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{inventory?.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-6 w-6 text-blue-600" />
                <span>{inventory.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{inventory.location}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Created: {formatDate(inventory.createdAt)}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {products.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Products</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(totalValue)}
                  </div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span>Quick Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Low Stock Items:</span>
                <Badge
                  variant={lowStockProducts.length > 0 ? "destructive" : "default"}
                >
                  {lowStockProducts.length}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Categories:</span>
                <Badge variant="outline">
                  {new Set(products.map((p) => p.category)).size}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Stock:</span>
                <Badge variant="secondary">
                  {products.reduce((sum, p) => sum + p.stock, 0)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" asChild>
            <Link href={`/products/inventory/${inventory.id}`}>
              <Package className="h-4 w-4 mr-2" />
              View All Products
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
