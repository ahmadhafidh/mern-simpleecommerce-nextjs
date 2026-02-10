// app/invoices/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import axiosInstance from "@/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Receipt,
  ArrowLeft,
  Mail,
  Calendar,
  User,
  Package,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    console.error(" Token tidak ditemukan, harus login dulu");
    redirect("/login"); // atau bisa pakai notFound()
  }

  let invoice: any = null;
  try {
    const res = await axiosInstance.get(`/invoice/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    invoice = res.data.data;
    if (!invoice) {
      console.log("Data invoice tidak ada");
    } else {
      // console.log("Data invoice ditemukan:", invoice);
    }
  } catch (error) {
    console.error("Failed to fetch invoice:", error);
    notFound();
  }

  if (!invoice) notFound();

  const itemList =
    typeof invoice.items === "string"
      ? invoice.items.split(",").map((i: string) => i.trim())
      : [];

  const totalQuantity = itemList.reduce((sum: number, item: string) => {
    const match = item.match(/x\s*(\d+)/i); // cari angka setelah "x"
    return sum + (match ? parseInt(match[1]) : 1);
  }, 0);

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
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Back Button */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" asChild>
          <Link href="/invoices">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Link>
        </Button>
        <nav className="text-sm text-gray-500">
          <span>Invoices</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{invoice.id}</span>
        </nav>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Invoice Detail */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Receipt className="h-6 w-6 text-blue-600" />
                  <span>Invoice {invoice.id}</span>
                </CardTitle>
                <Badge variant={getStatusColor(invoice.status)}>
                  {invoice?.status ? (
                    <p>Status: {invoice.status.toUpperCase()}</p>
                  ) : (
                    <p>Status tidak tersedia</p>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    Customer Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{invoice.customerName || invoice.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{invoice.customerEmail || invoice.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{formatDate(invoice.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Invoice Summary */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Invoice Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items:</span>
                      <span className="font-medium">
                        {itemList.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Quantity:</span>
                      <span className="font-medium">
                        {totalQuantity}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">
                        {formatPrice(invoice.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-blue-600" />
                <span>Order Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(invoice.items) ? (
                  invoice.items.map((item: any) => (
                    <div
                      key={item.id || item.product?.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg"
                    >
                      {item.product?.image && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.product?.name || "Unknown Product"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.product?.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          Product ID: {item.product?.id}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">Quantity</p>
                        <p className="font-medium">{item.quantity || 1}</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">Unit Price</p>
                        <p className="font-medium">
                          {item.product?.price
                            ? formatPrice(item.product.price)
                            : "-"}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-bold text-blue-600">
                          {item.product?.price
                            ? formatPrice(item.product.price * (item.quantity || 1))
                            : "-"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>{invoice.items}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline" asChild>
                <Link
                  href={`/invoices/email/${encodeURIComponent(
                    invoice.customerEmail || invoice.email
                  )}`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  View by Email
                </Link>
              </Button>

              <Button className="w-full" variant="outline">
                <Receipt className="h-4 w-4 mr-2" />
                Download PDF
              </Button>

              <Button className="w-full" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}