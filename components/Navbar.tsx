'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Package, Receipt, Home, User, LogOut, Menu, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCartItemsCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/signin');
    setIsMobileMenuOpen(false); // Close mobile menu after logout
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-lg border-b relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">E-Commerce</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
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

            {/* Mobile menu button & Cart */}
            <div className="md:hidden flex items-center space-x-3">
              {/* Mobile Cart */}
              <Link
                href="/cart"
                className="relative flex items-center bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                onClick={closeMobileMenu}
              >
                <ShoppingCart className="h-5 w-5" />
                {getCartItemsCount() > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {getCartItemsCount()}
                  </Badge>
                )}
              </Link>
              
              {/* Hamburger Menu Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4">
          {/* Close Button */}
          <div className="flex justify-end mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={closeMobileMenu}
              className="p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="mb-6 pb-4 border-b">
              <span className="text-gray-700 font-medium">Hi, {user.email}</span>
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-4">
            <Link 
              href="/" 
              className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={closeMobileMenu}
            >
              <Home className="h-5 w-5" />
              <span>Products</span>
            </Link>
            <Link 
              href="/inventory" 
              className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={closeMobileMenu}
            >
              <Package className="h-5 w-5" />
              <span>Inventory</span>
            </Link>
            <Link 
              href="/invoices" 
              className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={closeMobileMenu}
            >
              <Receipt className="h-5 w-5" />
              <span>Invoices</span>
            </Link>
            {user ? (
              <>
                <Link
                  href="/admin"
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  <User className="h-5 w-5" />
                  <span>Admin</span>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full flex items-center space-x-3 justify-start py-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors py-2"
                onClick={closeMobileMenu}
              >
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}