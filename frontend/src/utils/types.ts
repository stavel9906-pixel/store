// types/User.ts
export enum UsersRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface User {
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