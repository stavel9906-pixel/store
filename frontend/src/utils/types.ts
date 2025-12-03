import { PurchaseStatus, UsersRole } from "./enums";

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: UsersRole;
  profile?: string;
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
  productType: ProductType;
  imageUrl: string; // URL של התמונה ב-Cloudinary
};

export type ProductType = {
  id: number;
  name: string;
};

export interface PurchaseProduct {
  id: number;
  purchase: Purchase;
  product: Product;
  amount: number;
  currentPrice: number;
}

export interface Purchase {
  id: number;
  user: User;
  status: PurchaseStatus;
  createdAt: string;
  deliverTime?: string;
  purchaseProducts: PurchaseProduct[];
}

export interface City {
  id: number;
  name: string;
  country: Country;
}

export interface Country {
  id: number;
  name: string;
  cities: City[];
}

export interface PurchaseAddress {
  id: number;
  purchase: Purchase;
  street: string;
  houseNumber: string;
  city: City;
  phone: string;
  firstName: string;
  lastName: string;
  date?: Date;
  timeFrom?: string;
  timeTo?: string;
}

export type FormField = {
  name: string;
  value: string;
  validate: (value: string, formData?: FormField[]) => boolean; 
  errorMessage: string;
  showError: boolean;
};
