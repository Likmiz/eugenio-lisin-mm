import apiClient from './client';
import type { Product } from '../types/product';

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  categoryId: number;
}

export async function getProducts() {
  const res = await apiClient.get<Product[]>('/products');
  return res.data;
}

export async function createProduct(payload: ProductPayload) {
  const res = await apiClient.post<Product>('/products', payload);
  return res.data;
}

export async function updateProduct(id: number, payload: ProductPayload) {
  const res = await apiClient.put<Product>(`/products/${id}`, payload);
  return res.data;
}

export async function deleteProduct(id: number) {
  await apiClient.delete(`/products/${id}`);
}
