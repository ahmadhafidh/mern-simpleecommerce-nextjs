export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    inventoryId: string;
    stock: number;
    category: string;
    createdAt: string;
  }
  
  export interface Inventory {
    id: string;
    name: string;
    location: string;
    totalProducts: number;
    createdAt: string;
  }
  
  export interface CartItem {
    id: string;
    product: Product;
    quantity: number;
  }
  
  export interface Invoice {
    id: string;
    customerEmail: string;
    customerName: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'paid' | 'cancelled';
    createdAt: string;
  }