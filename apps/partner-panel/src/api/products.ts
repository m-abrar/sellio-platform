// src/api/products.ts

import api from './axios';

export const getProducts = () => api.get('/dashboard/partner/products');
export const getProduct = (id: number) => api.get(`/dashboard/partner/products/${id}`);

export const getProductBySlug = (slug: string) => api.get(`/dashboard/partner/products/${slug}`);

export const createProduct = (formData: FormData) => 
    api.post('/dashboard/partner/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export const updateProduct = (id: number, formData: FormData) => 
    api.post(`/dashboard/partner/products/${id}/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export const deleteProduct = (id: number) => api.delete(`/dashboard/partner/products/edit/${id}`);