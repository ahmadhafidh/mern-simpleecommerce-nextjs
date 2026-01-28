import { mockInvoices } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Receipt, ArrowLeft, Mail, Calendar, Eye } from 'lucide-react';
import Link from 'next/link';

interface InvoicesByEmailPageProps {
  params: {
    email: string;
  };
}

export default function InvoicesByEmailPage({ params }: InvoicesByEmailPageProps) {
  const decodedEmail = decodeURIComponent(params.email);
  const invoices = mockInvoices.filter(inv => inv.customerEmail === decodedEmail);

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

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);

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
          <span>Email</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{decodedEmail}</span>
        </nav>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Mail className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Invoices for {decodedEmail}</h1>
        </div>
        <p className="text-gray-600">
          {invoices.length} invoices found • Total: {formatPrice(totalAmount)}
        </p>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-12">
          <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-600">This email address has no invoices.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Receipt className="h-5 w-5 text-blue-600" />
                    <span>{invoice.id}</span>
                  </CardTitle>
                  <Badge variant={getStatusColor(invoice.status)}>
                    {invoice.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="font-medium">Customer:</span>
                    <span>{invoice.customerName}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(invoice.createdAt)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Items:</span>
                    <Badge variant="outline">{invoice.items.length}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total:</span>
                    <span className="text-lg font-bold text-blue-600">{formatPrice(invoice.total)}</span>
                  </div>
                </div>
                
                <Button className="w-full" asChild>
                  <Link href={`/invoices/${invoice.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}