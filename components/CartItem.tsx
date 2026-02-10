'use client';

import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash } from 'lucide-react';
import Image from 'next/image';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => updateQuantity(item.product.id, item.quantity + 1);
  const handleDecrement = () => updateQuantity(item.product.id, item.quantity - 1);
  const handleRemove = () => removeFromCart(item.product.id);

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden">
          <Image
            src={item.product.image.replace('http://127.0.0.1:5025', 'https://api-mern-simpleecommerce.idkoding.com')}
            alt={item.product.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">{item.product.name}</h3>
          <p className="text-sm text-gray-500">{item.product.description}</p>
          <p className="text-sm font-medium text-blue-600">Rp {item.product.price.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button size="sm" onClick={handleDecrement} disabled={item.quantity <= 1}>
          <Minus className="h-4 w-4" />
        </Button>
        <span>{item.quantity}</span>
        <Button size="sm" onClick={handleIncrement}>
          <Plus className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="destructive" onClick={handleRemove}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}