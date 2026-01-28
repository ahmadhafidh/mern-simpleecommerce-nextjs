import { mockInvoices } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Receipt, ArrowLeft, Mail, Calendar, User, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface InvoiceDetailPageProps {
  params: {
    id: string;
  };
}

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const invoice = mockInvoices.find(inv => inv.id === params.id);
  
  if (!invoice) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
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
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Receipt className="h-6 w-6 text-blue-600" />
                  <span>Invoice {invoice.id}</span>
                </CardTitle>
                <Badge variant={getStatusColor(invoice.status)}>
                  {invoice.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{invoice.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{invoice.customerEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{formatDate(invoice.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Invoice Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items:</span>
                      <span className="font-medium">{invoice.items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Quantity:</span>
                      <span className="font-medium">
                        {invoice.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">{formatPrice(invoice.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-blue-600" />
                <span>Order Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoice.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">{item.product.description}</p>
                      <p className="text-sm text-gray-500">Product ID: {item.product.id}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-medium">{item.quantity}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Unit Price</p>
                      <p className="font-medium">{formatPrice(item.product.price)}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-bold text-blue-600">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/invoices/email/${encodeURIComponent(invoice.customerEmail)}`}>
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