import { api } from '@sellio/api-client';

export const getProducts = () => api.dashboard.partner.products.list();
export const getProduct = (id: number) => api.dashboard.partner.products.get(id);
export const createProduct = (formData: FormData) => api.dashboard.partner.products.create(formData);
export const updateProduct = (id: number, formData: FormData) => api.dashboard.partner.products.update(id, formData);
export const deleteProduct = (id: number) => api.dashboard.partner.products.delete(id);