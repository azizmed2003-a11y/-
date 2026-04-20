export type Category = 
  | 'Self-Development' 
  | 'Money & Investment' 
  | 'Novels' 
  | 'Children' 
  | 'English Books' 
  | 'Best Sellers' 
  | 'Offers'
  | 'Religious'
  | 'Science'
  | 'Motivation'
  | 'Magazines';

export type OrderStatus = 'New' | 'Review' | 'Paid' | 'Completed' | 'Rejected';

export interface Book {
  id: string;
  name: string;
  author: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  saleRange?: {
    start: string;
    end: string;
  };
  image: string;
  category: Category;
  sku: string;
  stock: number;
  weight: number; // in lb
  reviews: Review[];
  isVisible: boolean;
}

export interface Testimonial {
  id: string;
  userName: string;
  rating: number;
  content: string;
  date: string;
  isFeatured?: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  customer: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    email?: string;
    notes?: string;
  };
  paymentMethod: 'Bankily' | 'Cash';
  paymentDetails?: {
    senderName?: string;
    bankOwnerName?: string;
    proofImage?: string;
  };
  status: OrderStatus;
  date: string;
}

export interface Offer {
  id: string;
  title: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  target: 'all' | 'specific';
  bookIds?: string[];
}

export interface Activity {
  id: string;
  type: 'visit' | 'add_to_cart' | 'add_to_wishlist' | 'view_product';
  bookId?: string;
  bookName?: string;
  timestamp: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Message {
  id: string;
  name: string;
  phone: string;
  message: string;
  date: string;
}

export interface CartItem extends Book {
  quantity: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minSpend?: number;
}
