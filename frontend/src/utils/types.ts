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
