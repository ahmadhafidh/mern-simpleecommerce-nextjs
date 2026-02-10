'use client';

import { useCart } from '@/contexts/CartContext';
import CartItem from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, CreditCard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import axiosInstance from "@/axiosInstance";
import Cookies from "js-cookie";

export default function CartPage() {
  const { items, total, clearCart } = useCart();

  
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };
const handleCheckout = async () => {
  try {
    // 1. Ambil cart dari localStorage
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");

    if (!cartData || cartData.length === 0) {
      alert("Keranjang belanja kosong!");
      return;
    }

    // 2. Kirim tiap item cart ke API /carts
    for (const item of cartData) {
      await axiosInstance.post("/carts", {
        productId: item.product.id,
        quantity: item.quantity,
      });
    }

    // 3. Ambil email dari cookies
    const email = Cookies.get("userEmail");
    if (!email) {
      alert("Anda harus login terlebih dahulu!");
      return;
    }

    // 4. Minta input nama & phone dari user
    const name = prompt("Masukkan nama lengkap Anda:");
    const phone = prompt("Masukkan nomor telepon Anda:");

    if (!name || !phone) {
      alert("Nama dan nomor telepon wajib diisi!");
      return;
    }

    // 5. Ambil tanggal sekarang (format YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    // 6. Kirim data ke /checkout
    const res = await axiosInstance.post("invoice/checkout", {
      email,
      name,
      phone,
      date: today,
    });

    console.log("Checkout berhasil:", res.data);
    alert("Checkout berhasil!");

    // 7. Kosongkan cart
    localStorage.removeItem("cart");
    clearCart();
  } catch (error) {
    console.error("Checkout error:", error);
    alert("Terjadi kesalahan saat checkout!");
  }
};


  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some products to get started</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button className="w-full" onClick={handleCheckout}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
                <Button variant="outline" className="w-full" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}