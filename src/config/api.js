// Nikan Pen Global API Configuration
// Hardcoding for local dev to ensure no connection issues
const API_BASE_URL = 'http://localhost:5001';

export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/api/products`,
  CATEGORIES: `${API_BASE_URL}/api/categories`,
  SUB_CATEGORIES: `${API_BASE_URL}/api/subcategories`,
  ENQUIRIES: `${API_BASE_URL}/api/enquiries`,
  MEDIA: `${API_BASE_URL}/api/media`,
  HERO_SETTINGS: `${API_BASE_URL}/api/hero-settings`,
  BASE: API_BASE_URL
};

// Smart image URL helper — handles both Cloudinary full URLs and local /uploads/ paths
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE_URL}${path}`;
};

export default API_BASE_URL;
