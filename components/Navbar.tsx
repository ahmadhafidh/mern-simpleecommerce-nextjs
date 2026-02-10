'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Package, Receipt, Home, User, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { getCartItemsCount } = useCart();
  const { user, logout } = useAuth(); // ambil user & logout dari AuthContext
  const router = useRouter();

  const handleLogout = () => {
    logout(); // clear token & user dari AuthContext
    router.push('/auth/signin');
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">E-Commerce</span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
              <Home className="h-4 w-4" />
              <span>Products</span>
            </Link>

            <Link href="/inventory" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
              <Package className="h-4 w-4" />
              <span>Inventory</span>
            </Link>

            <Link href="/invoices" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
              <Receipt className="h-4 w-4" />
              <span>Invoices</span>
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-700 font-medium">Hi, {user.email}</span>

                <Link
                  href="/admin"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Admin</span>
                </Link>

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}

            <Link
              href="/cart"
              className="relative flex items-center space-x-1 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
              {getCartItemsCount() > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {getCartItemsCount()}
                </Badge>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
