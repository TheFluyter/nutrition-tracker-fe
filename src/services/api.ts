import axios from 'axios';
import { Product } from '../types/Product';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (name: string): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/products/search?name=${encodeURIComponent(name)}`);
    return response.data;
  },
};

export default api;
