'use client';

import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowLeft, Package, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart } = useCart();

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
      day: 'numeric'
    });
  };

  const cleanedImage = product.image.replace('http://127.0.0.1:5025', '');

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
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={`https://api-mern-simpleecommerce.idkoding.com${cleanedImage}`}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 text-lg">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-blue-600">{formatPrice(product.price)}</span>
              <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline">{product.category}</Badge>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Package className="h-4 w-4" />
                <span>Inventory: {product.inventoryId}</span>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Added: {formatDate(product.createdAt)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" asChild>
                <Link href={`/inventory/${product.inventoryId}`}>
                  View Inventory
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/products/inventory/${product.inventoryId}`}>
                  Similar Products
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Product ID:</dt>
                  <dd className="font-medium">{product.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Category:</dt>
                  <dd className="font-medium">{product.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Stock:</dt>
                  <dd className="font-medium">{product.stock} units</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Inventory ID:</dt>
                  <dd className="font-medium">{product.inventoryId}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}