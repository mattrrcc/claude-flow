export const Config = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'https://rebelreaper.com/api',
  SQUARE_APP_ID: process.env.EXPO_PUBLIC_SQUARE_APP_ID ?? '',
  SQUARE_LOCATION_ID: process.env.EXPO_PUBLIC_SQUARE_LOCATION_ID ?? '',

  PAGINATION: {
    DEFAULT_LIMIT: 20,
    PRODUCTS_LIMIT: 20,
    REVIEWS_LIMIT: 10,
    ORDERS_LIMIT: 20,
  },

  TIMEOUTS: {
    API_REQUEST: 15000,
    IMAGE_LOAD: 10000,
  },

  CACHE: {
    PRODUCTS_STALE_TIME: 5 * 60 * 1000,
    PRODUCT_STALE_TIME: 10 * 60 * 1000,
    CART_STALE_TIME: 30 * 1000,
    ORDERS_STALE_TIME: 2 * 60 * 1000,
    CATEGORIES_STALE_TIME: 30 * 60 * 1000,
  },

  SECURE_STORE_KEYS: {
    AUTH_TOKEN: 'rebel_reaper_auth_token',
    CART_ID: 'rebel_reaper_cart_id',
    WISHLIST: 'rebel_reaper_wishlist',
    USER_DATA: 'rebel_reaper_user_data',
  },

  SHIPPING: {
    FREE_THRESHOLD_CENTS: 10000,
    STANDARD_RATE_CENTS: 799,
    EXPRESS_RATE_CENTS: 1499,
    ESTIMATED_DAYS_MIN: 5,
    ESTIMATED_DAYS_MAX: 7,
  },

  TAX_RATE: 0.08,

  SIZES: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

  SORT_OPTIONS: [
    { label: 'Newest', value: 'newest' },
    { label: 'Best Sellers', value: 'best_sellers' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
  ] as const,

  CATEGORIES: [
    { id: 'tops', name: 'Tops', slug: 'tops' },
    { id: 'bottoms', name: 'Bottoms', slug: 'bottoms' },
    { id: 'outerwear', name: 'Outerwear', slug: 'outerwear' },
    { id: 'accessories', name: 'Accessories', slug: 'accessories' },
    { id: 'footwear', name: 'Footwear', slug: 'footwear' },
  ],

  TRENDING_SEARCHES: [
    'Oversized Tee',
    'Cargo Pants',
    'Hoodie',
    'Jacket',
    'Limited Edition',
  ],

  APP: {
    NAME: 'Rebel Reaper',
    VERSION: '1.0.0',
    SUPPORT_EMAIL: 'support@rebelreaper.com',
    PRIVACY_URL: 'https://rebelreaper.com/privacy',
    TERMS_URL: 'https://rebelreaper.com/terms',
    INSTAGRAM: 'https://instagram.com/rebelreaper',
  },
} as const;

export default Config;
