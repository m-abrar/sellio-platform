import api from './axios';

/**
 * Fetch all properties for the authenticated partner
 */
export const getProperties = () => api.get('/dashboard/partner/properties');

/**
 * Fetch a single property by its numeric ID
 */
export const getProperty = (id: number) => api.get(`/dashboard/partner/properties/${id}`);

/**
 * Fetch a single property by its slug (useful for public-facing or SEO-friendly routes)
 */
export const getPropertyBySlug = (slug: string) => api.get(`/dashboard/partner/properties/edit/${slug}`);

/**
 * Create a new property asset
 * Uses FormData to support Spatie Media library image/document uploads
 */
export const createProperty = (formData: FormData) => 
    api.post('/dashboard/partner/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

/**
 * Update an existing property
 * Note: Using POST with /update suffix to bypass certain PHP/Laravel PUT limitations with multipart data
 */
export const updateProperty = (id: number, formData: FormData) => 
    api.post(`/dashboard/partner/properties/${id}/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

/**
 * Decommission/Delete a property asset from the portfolio
 */
export const deleteProperty = (id: number) => api.delete(`/dashboard/partner/properties/${id}`);