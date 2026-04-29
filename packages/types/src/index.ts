export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  image_url?: string;
  category_id: number;
}

export interface Category {
  id: number;
  title: string;
  slug: string;
}

export interface Theme {
  id: number;
  theme_key: string;
  vertical?: string;
  title: string;
  is_active: boolean;
  variables?: Record<string, string>;
  config?: Record<string, any>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'seller' | 'customer';
}
