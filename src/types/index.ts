export type UserRole = 'customer' | 'restaurant_owner' | 'admin' | 'delivery_partner';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  savedAddresses?: DeliveryAddress[];
  createdAt: string;
}

export interface DeliveryAddress {
  id: string;
  title: string; // 'Home', 'Work', 'Other'
  street: string;
  area: string;
  city: string;
  pinCode: string;
  isDefault?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  description: string;
  cuisineType: string[];
  rating: number;
  ratingCount: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  address: string;
  city: string;
  image: string;
  bannerImage: string;
  isVegOnly: boolean;
  isOpen: boolean;
  deliveryTimeMin: number;
  deliveryFee: number;
  minOrder: number;
  featuredDishes?: string[];
  ownerId?: string;
  contactPhone: string;
}

export interface FoodCustomizationOption {
  name: string;
  price: number;
}

export interface FoodCustomizationGroup {
  title: string;
  required: boolean;
  options: FoodCustomizationOption[];
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  isVeg: boolean;
  isBestseller?: boolean;
  isAvailable: boolean;
  preparationTime: number; // in mins
  image: string;
  rating: number;
  ratingCount: number;
  calories?: number;
  customizationGroups?: FoodCustomizationGroup[];
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  selectedOptions?: FoodCustomizationOption[];
  specialInstructions?: string;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cash_on_delivery' | 'demo_upi' | 'demo_card';

export interface OrderItemRecord {
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  selectedOptions?: FoodCustomizationOption[];
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  items: OrderItemRecord[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'completed' | 'failed';
  deliveryAddress: DeliveryAddress;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  estimatedDeliveryMinutes: number;
  createdAt: string;
  updatedAt: string;
  cancellationReason?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  image: string;
  description: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  restaurantName?: string;
  foodItemId?: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
  description: string;
  isActive: boolean;
  validUntil: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'Electric Scooter' | 'Motorbike' | 'Bicycle';
  vehicleNumber: string;
  rating: number;
  totalDeliveries: number;
  status: 'available' | 'busy' | 'offline';
  currentOrderId?: string;
  avatarUrl: string;
}
