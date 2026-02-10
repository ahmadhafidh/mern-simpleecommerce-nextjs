'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Receipt, Search, Mail, Calendar, Phone } from 'lucide-react';
import Link from "next/link";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axiosInstance.get('/invoice');
        setInvoices(res.data.data);
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Invoice Data</h1>
        <p className="text-gray-600">View and manage all customer invoices</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by ID, Name, or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading invoices...</p>
      ) : filteredInvoices.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Link
                  href={`/invoices/${invoice.id}`}
                  className="flex items-center space-x-2 cursor-pointer hover:text-blue-700 transition-colors"
                >
                  <Receipt className="h-5 w-5 text-blue-600" />
                  <span>{invoice.id}</span>
                </Link>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="font-medium">Customer:</span>
                    <span>{invoice.name}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                      <Link
                          href={`/invoices/email/${encodeURIComponent(
                            invoice.customerEmail || invoice.email
                          )}`}
                          className="underline text-blue-600" // opsional styling
                        >
                          {invoice.customerEmail || invoice.email}
                        </Link>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{invoice.phone}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Date: {formatDate(invoice.date)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Items:</span>
                    <Badge variant="outline">{invoice.items}</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(invoice.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No invoices found
          </h3>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
}
