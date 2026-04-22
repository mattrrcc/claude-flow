export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // cents
  comparePrice?: number; // cents
  images: string[];
  category: Category;
  categoryId: string;
  tags: string[];
  variants: ProductVariant[];
  averageRating: number;
  reviewCount: number;
  featured: boolean;
  sizeChart?: SizeChart;
}

export interface ProductVariant {
  id: string;
  size: string;
  color?: string;
  sku: string;
  price?: number;
  inventory: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId: string;
  variant: ProductVariant;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  variantId: string;
  variant: ProductVariant;
  quantity: number;
  price: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
}

export interface SizeChart {
  unit: 'inches' | 'cm';
  sizes: SizeEntry[];
}

export interface SizeEntry {
  size: string;
  chest?: number;
  waist?: number;
  hips?: number;
  length?: number;
  shoulder?: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: string;
}

export interface ProductsParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'best_sellers';
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface CreateOrderPayload {
  cartId: string;
  shippingAddress: Address;
  paymentNonce: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SquareTokenResponse {
  applicationId: string;
  locationId: string;
}

export type RootStackParamList = {
  Main: undefined;
  ProductDetail: { productId: string };
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
  OrderDetail: { orderId: string };
  AllReviews: { productId: string };
  Search: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ShopTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: { productId: string };
};

export type ShopStackParamList = {
  Shop: undefined;
  ProductDetail: { productId: string };
};

export type CartStackParamList = {
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  OrderHistory: undefined;
  OrderDetail: { orderId: string };
};
