// Dynamic API URL detection — works on your PC, other PCs on network, and live server
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? `http://${window.location.hostname}:5001` : '');

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
