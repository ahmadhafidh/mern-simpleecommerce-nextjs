"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import axiosInstance from "@/axiosInstance";

interface Inventory {
  id: string;
  name: string;
  description?: string;
}

export default function InventoryPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [inventories, setInventories] = useState<Inventory[]>([]);

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const token = Cookies.get("token"); // 🔑 ambil token dari cookie
        if (!token) {
          console.error("No token found, please login first.");
          return;
        }

        const res = await axiosInstance.get("/inventories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Products API response:", res.status, res.data); // cek response
        setInventories(res.data.data || []); // backend biasanya kasih di res.data.data
      } catch (err) {
        console.error("Error fetching inventories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading inventories...</p>
      </div>
    );
  }

  if (inventories.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-xl font-semibold text-gray-700">No Inventories Found</h1>
        <p className="text-gray-500 mt-2">Please add some inventory data first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Inventory Data</h1>
        <p className="text-gray-600">
          
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventories.map((inventory) => (
          <Card key={inventory.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span>{inventory.name}</span>
                </CardTitle>
                
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">

              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Description</span>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" asChild>
                  <Link href={`/products/inventory/${inventory.id}`}>
                    <Package className="h-4 w-4 mr-2" />
                    View Products
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}