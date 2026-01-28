'use client';

import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.product.id);
    } else {
      updateQuantity(item.product.id, newQuantity);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
            <Image
              src={item.product.image}
              alt={item.product.name}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
            <p className="text-sm text-gray-600">{item.product.description}</p>
            <p className="text-lg font-bold text-blue-600">{formatPrice(item.product.price)}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-semibold">{item.quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(item.product.price * item.quantity)}
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeFromCart(item.product.id)}
              className="mt-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}