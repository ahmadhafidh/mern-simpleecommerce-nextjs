import { Product, Inventory, Invoice } from '@/types';

export const mockInventories: Inventory[] = [
  {
    id: 'inv-1',
    name: 'Main Warehouse',
    location: 'Jakarta',
    totalProducts: 150,
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'inv-2',
    name: 'Secondary Storage',
    location: 'Surabaya',
    totalProducts: 85,
    createdAt: '2024-01-20T10:30:00Z'
  },
  {
    id: 'inv-3',
    name: 'Distribution Center',
    location: 'Bandung',
    totalProducts: 120,
    createdAt: '2024-01-25T14:15:00Z'
  }
];

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 299000,
    image: 'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=400',
    inventoryId: 'inv-1',
    stock: 25,
    category: 'Electronics',
    createdAt: '2024-01-10T09:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'Smart Watch',
    description: 'Advanced smartwatch with health monitoring features',
    price: 450000,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
    inventoryId: 'inv-1',
    stock: 15,
    category: 'Electronics',
    createdAt: '2024-01-12T11:30:00Z'
  },
  {
    id: 'prod-3',
    name: 'Laptop Stand',
    description: 'Ergonomic laptop stand for better posture',
    price: 125000,
    image: 'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=400',
    inventoryId: 'inv-2',
    stock: 40,
    category: 'Accessories',
    createdAt: '2024-01-14T13:45:00Z'
  },
  {
    id: 'prod-4',
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with cherry switches',
    price: 750000,
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400',
    inventoryId: 'inv-2',
    stock: 12,
    category: 'Electronics',
    createdAt: '2024-01-16T15:20:00Z'
  },
  {
    id: 'prod-5',
    name: 'Wireless Mouse',
    description: 'Precision wireless mouse for gaming and productivity',
    price: 180000,
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400',
    inventoryId: 'inv-3',
    stock: 30,
    category: 'Electronics',
    createdAt: '2024-01-18T16:10:00Z'
  },
  {
    id: 'prod-6',
    name: 'USB-C Hub',
    description: 'Multi-port USB-C hub with HDMI and charging support',
    price: 220000,
    image: 'https://images.pexels.com/photos/163142/usb-stick-usb-flash-drive-storage-163142.jpeg?auto=compress&cs=tinysrgb&w=400',
    inventoryId: 'inv-3',
    stock: 18,
    category: 'Accessories',
    createdAt: '2024-01-19T17:30:00Z'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    customerEmail: 'john@example.com',
    customerName: 'John Doe',
    items: [
      {
        id: 'cart-1',
        product: mockProducts[0],
        quantity: 2
      }
    ],
    total: 598000,
    status: 'paid',
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'inv-002',
    customerEmail: 'jane@example.com',
    customerName: 'Jane Smith',
    items: [
      {
        id: 'cart-2',
        product: mockProducts[1],
        quantity: 1
      },
      {
        id: 'cart-3',
        product: mockProducts[2],
        quantity: 1
      }
    ],
    total: 575000,
    status: 'pending',
    createdAt: '2024-01-21T14:30:00Z'
  },
  {
    id: 'inv-003',
    customerEmail: 'bob@example.com',
    customerName: 'Bob Johnson',
    items: [
      {
        id: 'cart-4',
        product: mockProducts[3],
        quantity: 1
      }
    ],
    total: 750000,
    status: 'paid',
    createdAt: '2024-01-22T09:15:00Z'
  }
];