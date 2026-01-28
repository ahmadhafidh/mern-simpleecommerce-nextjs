"use client";

import { use, useEffect, useState } from "react";
import axiosInstance from "@/axiosInstance";
import ProductDetail from "@/components/ProductDetail";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  // ✅ unwrap params pakai React.use()
  const { id } = use(params);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data.data); // ✅ ambil dari data.data
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // ✅ dependensinya pakai id, bukan params.id

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;

  return <ProductDetail product={product} />;
}
