import { api } from '@/lib/api-client';

export const getProperties = () => api.dashboard.partner.properties.list();
export const getProperty = (id: number) => api.dashboard.partner.properties.get(id);
export const createProperty = (formData: FormData) => api.dashboard.partner.properties.create(formData);
export const updateProperty = (id: number, formData: FormData) => api.dashboard.partner.properties.update(id, formData);
export const deleteProperty = (id: number) => api.dashboard.partner.properties.delete(id);