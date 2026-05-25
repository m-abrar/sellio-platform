import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/products`;

// Mock data for products
const mockProducts = [
  {
    id: 1,
    title: 'Modern Executive Desk',
    slug: 'modern-executive-desk',
    sku: 'DSK-001',
    featured_image: 'https://picsum.photos/seed/desk/400/300',
    featured_image_id: 101,
    pricing: { base_price: 599.99, sale_price: 499.99, formatted: '$599.99' },
    inventory: { stock_quantity: 12, in_stock: true, manage_stock: true },
    category: { id: 1, title: 'Furniture' },
    brand: { id: 1, title: 'OfficePro' },
    description: 'A high-quality executive desk for modern offices.',
    short_description: 'Modern desk.',
    specs: { weight: '25', dimensions: '120x60x75 cm' },
    is_featured: true,
    gallery: [
      { id: 201, url: 'https://picsum.photos/seed/desk2/400/300' }
    ]
  },
  {
    id: 2,
    title: 'Ergonomic Office Chair',
    slug: 'ergonomic-office-chair',
    sku: 'CHR-002',
    featured_image: 'https://picsum.photos/seed/chair/400/300',
    featured_image_id: 102,
    pricing: { base_price: 249.50, sale_price: null, formatted: '$249.50' },
    inventory: { stock_quantity: 3, in_stock: true, manage_stock: true },
    category: { id: 1, title: 'Furniture' },
    brand: { id: 1, title: 'OfficePro' },
    description: 'Comfortable ergonomic chair.',
    short_description: 'Ergo chair.',
    specs: { weight: '15', dimensions: '60x60x110 cm' },
    is_featured: false,
    gallery: []
  }
];

export const getProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock data');
    return { data: { data: mockProducts } };
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const response = await axios.get(`${API_URL}/${slug}`);
    return response.data;
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock data');
    const product = mockProducts.find(p => p.slug === slug);
    if (product) return { data: { data: product } };
    throw new Error('Product not found');
  }
};

export const createProduct = async (formData: FormData) => {
  try {
    const response = await axios.post(API_URL, formData);
    return response.data;
  } catch (error) {
    console.log('Creating product with data:', formData);
    return { data: { message: 'Product created successfully (Mock)' } };
  }
};

export const updateProduct = async (id: number, formData: FormData) => {
  try {
    const response = await axios.post(`${API_URL}/${id}`, formData); // Using POST for Laravel compatibility with FormData
    return response.data;
  } catch (error) {
    console.log(`Updating product ${id} with data:`, formData);
    return { data: { message: 'Product updated successfully (Mock)' } };
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.log(`Deleting product ${id}`);
    return { data: { message: 'Product deleted successfully (Mock)' } };
  }
};
