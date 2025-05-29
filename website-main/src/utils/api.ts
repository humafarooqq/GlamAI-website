import { API_CONFIG } from '../config';

const API_URL = API_CONFIG.API_URL;

export interface IProduct {
  _id: string;
  name: string;
  img?: string;
  mainImage?: string;
  price: {
    $numberInt: string;
  } | number | string;
  sale?: boolean;
  category?: string;
  brand?: string;
  description?: string;
  shades?: Array<{
    _id: string;
    name: string;
    colorCode: string;
    referenceImage: string | { $oid: string };
    stock: number | { $numberInt: string };
    price?: number;
  }>;
  rating?: number;
  features?: string[];
  ingredients?: string[];
  createdAt?: string | { $date: { $numberLong: string } };
  updatedAt?: string | { $date: { $numberLong: string } };
}

interface ApiResponse<T> {
  products: T[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

export const api = {
  // Get all products
  getProducts: async (): Promise<IProduct[]> => {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    console.log('API Response:', data);
    // Handle both array and object responses
    return Array.isArray(data) ? data : data.products || [];
  },

  // Get single product
  getProduct: async (id: string): Promise<IProduct> => {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return response.json();
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<IProduct[]> => {
    const response = await fetch(`${API_URL}/products/category/${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : data.products || [];
  },

  // Get products by brand
  getProductsByBrand: async (brand: string): Promise<IProduct[]> => {
    const response = await fetch(`${API_URL}/products/brand/${brand}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products by brand');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : data.products || [];
  }
}; 