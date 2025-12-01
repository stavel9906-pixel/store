export enum AddressField {
  COUNTRY = 0,
  FIRST_NAME = 1,
  LAST_NAME = 2,
  PHONE_NUMBER = 3,
  CITY = 4,
  STREET = 5,
  HOUSE_NUMBER = 6,
}

export enum UsersRole {
  ADMIN = "admin",
  USER = "user",
}

export enum PurchaseStatus {
  PENDING = "pending",
  PAID = "paid",
  CANCELLED = "cancelled",
  DELIVERED = "delivered",
  SHIPPED = "shipped",
}

export enum CreditCardField {
  CARD_NUMBER = 0,
  EXPIRY_DATE = 1,
  CVC = 2,
  CARD_HOLDER_NAME = 3,
}

export enum AuthField {
  USERNAME = 0,
  EMAIL = 1,
  PASSWORD = 2,
  CONFIRMED_PASSWORD = 3,
  PROFILE = 4,
  CURRENT_PASSWORD = 5,
}