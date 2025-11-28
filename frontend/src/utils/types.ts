// types/User.ts
export enum UsersRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum PurchaseStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  DELIVERED = 'delivered',
  SHIPPED = 'shipped',
}

export interface User {
  id: number;
  userName: string;
  email: string;
  password?: string;
  role: UsersRole;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export type Product = {
  productId: number;
  productName: string;
  price: number;
  description: string;
  productType: ProductType;  // שם סוג המוצר
  imageUrl: string;     // URL של התמונה ב-Cloudinary
};

export type ProductType = {
  id: number;       // מזהה ייחודי של סוג המוצר
  name: string;     // שם סוג המוצר
};

export interface PurchaseProduct {
  id: number;
  purchase: Purchase; // רק ה-id של הרכישה
  product: Product;
  amount: number;
  currentPrice: number;
}

export interface Purchase {
  id: number;
  user: User; // רק ה-id של המשתמש
  status: PurchaseStatus; // בהתאמה ל-PurchaseStatus
  createdAt: string; // ISO string
  deliverTime?: string; // ISO string
  address?: string;
  phone?: string;
  purchaseProducts: PurchaseProduct[];
}