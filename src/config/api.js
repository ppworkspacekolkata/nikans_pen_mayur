// Nikan Pen Global API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5001' : '');

export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/api/products`,
  CATEGORIES: `${API_BASE_URL}/api/categories`,
  SUB_CATEGORIES: `${API_BASE_URL}/api/subcategories`,
  ENQUIRIES: `${API_BASE_URL}/api/enquiries`,
  MEDIA: `${API_BASE_URL}/api/media`,
  BASE: API_BASE_URL
};

export default API_BASE_URL;
